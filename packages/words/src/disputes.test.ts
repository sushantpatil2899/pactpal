import { describe, expect, it } from "vitest";
import {
  answerFacts,
  deadlineIsNear,
  deadlineWords,
  disputeActionWords,
  disputeReasonWords,
  plainCode,
} from "./disputes.js";

const now = new Date("2026-11-05T12:00:00.000Z");
const later = (hours: number) => new Date(now.getTime() + hours * 3_600_000);

describe("dispute words", () => {
  it("says the reason in plain words, and an unknown one in plain letters", () => {
    expect(disputeReasonWords("MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED")).toBe("not as described");
    expect(disputeReasonWords("MERCHANDISE_OR_SERVICE_NOT_RECEIVED")).toBe("not received");
    expect(disputeReasonWords("SOMETHING_NEW")).toBe("something new");
    expect(plainCode("PRE_ARBITRATION")).toBe("pre arbitration");
  });

  it("explains each known action, the ones not done yet as coming later, an unknown one as not possible", () => {
    for (const action of ["provide_supporting_info", "acknowledge_return_item"]) {
      expect(disputeActionWords(action)).toMatch(/\(coming in a later step\)$/);
    }
    expect(disputeActionWords("escalate")).toBe(
      "Escalate: ask PayPal to decide the case. Only after this can you send evidence.",
    );
    expect(disputeActionWords("provide_evidence")).toBe(
      "Send evidence: upload documents that answer the claim.",
    );
    expect(disputeActionWords("new_thing")).toBe("new thing: PactPal cannot do this yet.");
    expect(disputeActionWords("appeal")).toBe(
      "Appeal: ask PayPal to look again, with new evidence.",
    );
    expect(disputeActionWords("make_offer")).toBe(
      "Offer a refund: propose a refund the buyer can accept.",
    );
  });

  it("states what each answer does in fixed words, with the disputed amount", () => {
    expect(answerFacts("accept_claim", "120.00 USD")).toBe(
      "PayPal refunds the buyer 120.00 USD from your PayPal account and closes the case in the buyer's favour. This cannot be undone.",
    );
    expect(answerFacts("make_offer", "120.00 USD")).toContain(
      "your refund offer, up to 120.00 USD.",
    );
    expect(answerFacts("make_offer", null)).toContain("your refund offer. If");
    expect(answerFacts("accept_claim", null)).toContain("refunds the buyer the disputed amount");
    expect(answerFacts("send_message", null)).toContain("The case stays open.");
    expect(answerFacts("escalate", null)).toBe(disputeActionWords("escalate"));
    expect(answerFacts("new_thing", null)).toBe("new thing: PactPal cannot do this yet.");
  });

  it("says how long is left, or how long ago the deadline passed", () => {
    expect(deadlineWords(later(76), now)).toBe("3 days 4 hours left");
    expect(deadlineWords(later(48), now)).toBe("2 days left");
    expect(deadlineWords(later(25), now)).toBe("1 day 1 hour left");
    expect(deadlineWords(later(5.5), now)).toBe("5 hours left");
    expect(deadlineWords(later(0.5), now)).toBe("less than an hour left");
    expect(deadlineWords(later(-0.2), now)).toBe("the deadline passed less than an hour ago");
    expect(deadlineWords(later(-2), now)).toBe("the deadline passed 2 hours ago");
    expect(deadlineIsNear(later(30), now)).toBe(true);
    expect(deadlineIsNear(later(49), now)).toBe(false);
    expect(deadlineIsNear(later(-1), now)).toBe(false);
  });
});
