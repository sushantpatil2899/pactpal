import { describe, expect, it } from "vitest";
import type { LedgerEntryView } from "./api";
import { logLabels } from "./log-labels";

const D1 = "11111111-1111-4111-8111-111111111111";
const D2 = "22222222-2222-4222-8222-222222222222";
const D3 = "33333333-3333-4333-8333-333333333333";

let seq = 0;
const entry = (type: string, payload: unknown): LedgerEntryView => ({
  seq: seq++,
  type,
  actor: "buyer",
  actorName: "Sam",
  serverTime: "2026-11-02T23:26:00.000Z",
  entryHash: "0".repeat(64),
  payload,
});
const sent = (deliveryId: string, stage: number, version = 1) =>
  entry("DELIVERY_SENT", { deliveryId, version, stage, files: [] });
const changes = (deliveryId: string, extra: Record<string, unknown>) =>
  entry("CHANGE_REQUESTED", { deliveryId, version: 1, stage: 1, request: "Turn left", ...extra });

describe("evidence log labels", () => {
  it("numbers the deliveries of a stage and names them in every entry about them", () => {
    expect(
      logLabels([
        sent(D1, 1),
        entry("DELIVERY_EMAILED", { deliveryId: D1, recipientEmailSha256: "a".repeat(64) }),
        entry("DELIVERY_VIEWED", { deliveryId: D1, access: "link" }),
        entry("DELIVERY_DOWNLOADED", { deliveryId: D1, filename: "IMG_6899.png" }),
        changes(D1, { revision: 1, revisionsIncluded: 2, beyondIncluded: false }),
        sent(D2, 1),
        entry("DELIVERY_VIEWED", { deliveryId: D2, access: "link" }),
        entry("MILESTONE_APPROVED", { deliveryId: D2, version: 1, stage: 1, files: [] }),
      ]),
    ).toEqual([
      "Delivery 1 for stage 1 sent (agreement version 1)",
      "Delivery 1 for stage 1 emailed to the buyer",
      "Delivery 1 for stage 1 opened",
      "File downloaded: IMG_6899.png (delivery 1 for stage 1)",
      "Changes requested for delivery 1 of stage 1, revision 1 of 2 (agreement version 1)",
      "Delivery 2 for stage 1 sent (agreement version 1)",
      "Delivery 2 for stage 1 opened",
      "Delivery 2 for stage 1 approved (agreement version 1)",
    ]);
  });

  it("counts each stage separately, across agreement versions", () => {
    expect(logLabels([sent(D1, 1), sent(D2, 2), sent(D3, 1, 2)])).toEqual([
      "Delivery 1 for stage 1 sent (agreement version 1)",
      "Delivery 1 for stage 2 sent (agreement version 1)",
      "Delivery 2 for stage 1 sent (agreement version 2)",
    ]);
  });

  it("says where a change request stood against the included revisions", () => {
    expect(
      logLabels([
        sent(D1, 1),
        changes(D1, { revision: 3, revisionsIncluded: 2, beyondIncluded: true }),
        changes(D1, { revision: 1, revisionsIncluded: null, beyondIncluded: false }),
        changes(D1, {}),
      ]).slice(1),
    ).toEqual([
      "Changes requested for delivery 1 of stage 1, revision 3, beyond the 2 included (agreement version 1)",
      "Changes requested for delivery 1 of stage 1, revision 1, no revision limit stated (agreement version 1)",
      "Changes requested for delivery 1 of stage 1 (agreement version 1)",
    ]);
  });

  it("names the agreement version for invoices and payments, and the version for agreement steps", () => {
    expect(
      logLabels([
        entry("SCOPE_VERSIONED", { version: 1, sha256: "b".repeat(64) }),
        entry("ACCEPTED", { version: 1 }),
        entry("RECEIPT_SENT", { version: 1, to: "buyer" }),
        entry("INVOICE_SENT", { version: 1, stage: 1, invoiceId: "INV2-X" }),
        entry("PAYMENT_RECEIVED", { version: 1, stage: 1, invoiceId: "INV2-X" }),
        entry("DELIVERABLE_ADDED", { filename: "sketch.png" }),
        entry("DEAL_CREATED", {}),
      ]),
    ).toEqual([
      "Agreed work saved (version 1)",
      "Buyer signed (version 1)",
      "Receipt emailed to the buyer (version 1)",
      "Invoice sent for stage 1 (agreement version 1)",
      "Payment received for stage 1 (agreement version 1)",
      "Delivery file added: sketch.png",
      "Deal created",
    ]);
  });

  it("names the version of each change order step", () => {
    expect(
      logLabels([
        entry("CHANGE_ORDER_PROPOSED", { changeOrderId: D1, fromVersion: 1, version: 2 }),
        entry("CHANGE_ORDER_ACCEPTED", { changeOrderId: D1, fromVersion: 1, version: 2 }),
        entry("CHANGE_ORDER_DECLINED", { changeOrderId: D2, version: 3, reason: "No blog" }),
        entry("CHANGE_ORDER_WITHDRAWN", { changeOrderId: D3, version: 4 }),
      ]),
    ).toEqual([
      "Change order proposed (version 2)",
      "Change order accepted (version 2)",
      "Change order declined (version 3)",
      "Change order withdrawn (version 4)",
    ]);
  });

  it("falls back to plain words for unknown types, unknown deliveries and odd payloads", () => {
    expect(
      logLabels([
        entry("SOMETHING_NEW", null),
        entry("DELIVERY_VIEWED", { deliveryId: D3 }),
        entry("DELIVERY_SENT", { deliveryId: D1, stage: "one" }),
        entry("DELIVERY_VIEWED", { deliveryId: D1 }),
        entry("NOTE_ADDED", "not an object"),
      ]),
    ).toEqual([
      "SOMETHING_NEW",
      "Delivery opened",
      "Delivery sent",
      "Delivery opened",
      "Note added",
    ]);
  });

  it("names the delivery of a download even without a file name", () => {
    expect(logLabels([sent(D1, 2), entry("DELIVERY_DOWNLOADED", { deliveryId: D1 })])[1]).toBe(
      "File downloaded (delivery 1 for stage 2)",
    );
  });
});
