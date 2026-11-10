import { readLedger } from "@pactpal/db";
import { useMigratedTestDatabase } from "@pactpal/db/testing";
import type { EvidenceInput } from "@pactpal/paypal";
import { describe, expect, it } from "vitest";
import { fakeWriter, paypalState, signedDispute } from "../disputes/test-support.js";
import { mcpClient } from "./test-support.js";

const db = useMigratedTestDatabase();
const NOTE = "The buyer approved the stage 1 sketch after one change to the pose.";

describe("an agent and a dispute", () => {
  it("reads the dispute, builds a packet, and uploads it only after the seller's code", async () => {
    const paypal = fakeWriter();
    const deal = await signedDispute(
      db,
      [["chat.txt", "source", new TextEncoder().encode("Maya: deal\nChris: deal"), "seller"]],
      { disputeWriter: paypal.writer, disputes: { start: () => Promise.resolve() } },
    );
    await paypalState(db, deal.dealId, {
      allowedActions: ["provide_evidence"],
      requestedEvidence: ["PROOF_OF_FULFILLMENT", "OTHER"],
    });
    const { tool } = await mcpClient(db, deal.call, deal.seller.id);
    const ids = { dealId: deal.dealId, disputeId: "PP-R-TEST-1" };

    const listed = await tool("list_disputes", { dealId: deal.dealId });
    expect(JSON.stringify(listed.data)).toContain("PP-R-TEST-1");
    const read = await tool("get_dispute", ids);
    expect(read.data).toMatchObject({
      choices: { allowed: { evidence: true }, evidenceTypes: ["PROOF_OF_FULFILLMENT", "OTHER"] },
    });
    expect(await tool("request_send_evidence", { ...ids, note: NOTE })).toMatchObject({
      isError: true,
      text: "there is no evidence packet yet: call draft_evidence_packet first",
    });
    const built = await tool("draft_evidence_packet", ids);
    expect(String(built.data?.packetSha256)).toMatch(/^[0-9a-f]{64}$/);
    expect(
      await tool("request_send_evidence", { ...ids, evidenceType: "PROOF_OF_REFUND", note: NOTE }),
    ).toMatchObject({
      isError: true,
      text: "choose an evidence type: PROOF_OF_FULFILLMENT, OTHER",
    });

    const asked = await tool("request_send_evidence", {
      ...ids,
      evidenceType: "PROOF_OF_FULFILLMENT",
      note: NOTE,
    });
    expect(asked.data?.summary).toMatch(
      /^Upload evidence to PayPal for dispute PP-R-TEST-1: type PROOF_OF_FULFILLMENT, \d+ documents/,
    );
    expect(paypal.sent).toEqual([]);
    const requestId = String(asked.data?.requestId);
    const approved = await deal.call(
      "POST",
      `/api/agent-requests/${requestId}/approve`,
      deal.token,
    );
    const done = await tool("confirm_action", {
      requestId,
      code: approved.json<{ code: string }>().code,
    });
    expect(done.data).toMatchObject({ status: "done", result: { status: 201 } });
    expect((paypal.sent[0]?.input as EvidenceInput).notes).toBe(NOTE);
    expect((await readLedger(db, deal.dealId)).map((e) => e.type).slice(-2)).toEqual([
      "EVIDENCE_UPLOADED",
      "AGENT_ACTED",
    ]);
    await deal.app.close();
  });
});
