import { describe, expect, it } from "vitest";
import {
  checkKey,
  inProcessChecker,
  renderDraftStarter,
  renderWorkflowChecker,
  type TaskStarter,
} from "./checker.js";
import { disputeNotifications } from "./notifications.js";
import { keptLog } from "./test-support.js";

const at = (iso: string) => new Date(iso);

/** A stand-in for Render's client that keeps what it was asked to start. */
function fakeRender() {
  const started: { slug: string; input: unknown[]; key: string }[] = [];
  const starter: TaskStarter = {
    startTask: (slug, input, { idempotencyKey }) => {
      started.push({ slug, input, key: idempotencyKey });
      return Promise.resolve({ taskRunId: `trn-${String(started.length)}` });
    },
  };
  return { starter, started };
}

describe("dispute checkers", () => {
  it("makes one key per 5-minute window, per deal every 30 seconds, and per notification", () => {
    const now = at("2026-11-05T17:04:59.000Z");
    expect(checkKey({ kind: "schedule" }, now)).toBe(
      checkKey({ kind: "schedule" }, at("2026-11-05T17:00:00.000Z")),
    );
    expect(checkKey({ kind: "schedule" }, now)).not.toBe(
      checkKey({ kind: "schedule" }, at("2026-11-05T17:05:00.000Z")),
    );
    expect(checkKey({ kind: "button", dealId: "d1" }, now)).toMatch(/^button:d1:\d+$/);
    expect(checkKey({ kind: "notification", eventId: "WH-1" }, now)).toBe("notification:WH-1");
  });

  it("starts the Render Workflow task with the source as its input", async () => {
    const { starter, started } = fakeRender();
    const { log, lines } = keptLog();
    const checker = renderWorkflowChecker(
      starter,
      "pactpal-workflows/check-disputes",
      () => at("2026-11-05T17:00:00.000Z"),
      log,
    );
    await checker.start({ kind: "button", dealId: "d1" });
    expect(started).toEqual([
      {
        slug: "pactpal-workflows/check-disputes",
        input: ["button"],
        key: checkKey({ kind: "button", dealId: "d1" }, at("2026-11-05T17:00:00.000Z")),
      },
    ]);
    expect(lines.join("")).toContain("trn-1");
  });

  it("runs the check in process when there is no Render", async () => {
    const sources: string[] = [];
    await inProcessChecker((source) => {
      sources.push(source);
      return Promise.resolve();
    }).start({ kind: "schedule" });
    expect(sources).toEqual(["schedule"]);
  });

  it("starts a check for a PayPal dispute notification and ignores other kinds", async () => {
    const { starter, started } = fakeRender();
    const handle = disputeNotifications(
      renderWorkflowChecker(starter, "w/t", () => at("2026-11-05T17:00:00.000Z"), keptLog().log),
    );
    await handle({ eventId: "WH-1", eventType: "INVOICING.INVOICE.PAID", body: {} });
    await handle({ eventId: "WH-2", eventType: "CUSTOMER.DISPUTE.CREATED", body: {} });
    expect(started.map((s) => [s.input, s.key])).toEqual([[["notification"], "notification:WH-2"]]);
  });
});

describe("the draft starter (9R-1)", () => {
  it("starts the draft task once per draft, with the ids as its input", async () => {
    const { starter, started } = fakeRender();
    const { log, lines } = keptLog();
    const start = renderDraftStarter(starter, "pactpal-workflows/draft-scope", log);
    await start({ dealId: "d1", draftId: "r1" });
    expect(started).toEqual([
      {
        slug: "pactpal-workflows/draft-scope",
        input: [{ dealId: "d1", draftId: "r1" }],
        key: "draft:r1",
      },
    ]);
    expect(JSON.stringify(lines)).toContain("trn-1");
  });
});
