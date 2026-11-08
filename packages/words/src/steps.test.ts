import { describe, expect, it } from "vitest";
import { stepLine } from "./index.js";

describe("timeline steps in words", () => {
  it("names the kind, amount, who acts and the due date", () => {
    expect(
      stepLine(
        {
          n: 2,
          kind: "payment",
          owner: "buyer",
          title: "Deposit",
          dueDate: "2026-11-10",
          amount: { text: "50.00" },
        },
        "USD",
      ),
    ).toBe("2. Payment: Deposit, 50.00 USD (by the buyer, due 10 Nov 2026)");
    expect(
      stepLine(
        { n: 3, kind: "review", owner: "seller", title: "Sketches", dueDate: null, amount: null },
        "USD",
      ),
    ).toBe("3. Review: the seller shares, the buyer approves: Sketches (by the seller)");
    expect(
      stepLine(
        { n: 4, kind: "other", owner: "buyer", title: "Pick a font", dueDate: null, amount: null },
        "USD",
      ),
    ).toBe("4. The buyer: Pick a font (by the buyer)");
  });
});
