import { describe, expect, it } from "vitest";
import { draftSourceText, numberSourceLines } from "./index.js";

const at = "2026-11-08T10:42:31.000Z";

describe("the text a draft is made from", () => {
  it("labels the in-app chat and each pasted chat, with every message's time, name and side", () => {
    const text = draftSourceText({
      chat: [
        { seq: 1, at, name: "Maya", role: "seller", body: "Hi Chris!\n\nTwo concepts by Friday?" },
        { seq: 2, at, name: "Chris", role: "buyer", body: "Yes, $200 total" },
        {
          seq: 3,
          at,
          name: "PactPal",
          role: "system",
          body: "Version 1 is ready for your review.",
        },
      ],
      pasted: [{ filename: "whatsapp.txt", text: "\nMaya: deposit first?\nChris: sure\n" }],
    });
    expect(text).toBe(
      [
        "=== The deal's chat in PactPal ===",
        "[2026-11-08 10:42 UTC] Maya (seller): Hi Chris!",
        "    Two concepts by Friday?",
        "[2026-11-08 10:42 UTC] Chris (buyer): Yes, $200 total",
        "[2026-11-08 10:42 UTC] PactPal: Version 1 is ready for your review.",
        "",
        "=== Chat pasted by the seller: whatsapp.txt ===",
        "Maya: deposit first?",
        "Chris: sure",
        "",
      ].join("\n"),
    );
    // Numbered as one source: blank lines between sections are not counted.
    const numbered = numberSourceLines(text);
    expect(numbered.ok && numbered.lines.length).toBe(8);
  });

  it("puts the agreement first for an update, then only the new messages", () => {
    const text = draftSourceText({
      current: { version: 2, lines: ["Summary: A logo", "Payment stage 1: Deposit, 50.00 USD"] },
      chat: [],
    });
    expect(text.split("\n")).toEqual([
      "=== The agreement as it stands (version 2) ===",
      "Summary: A logo",
      "Payment stage 1: Deposit, 50.00 USD",
      "",
      "=== New messages in the deal's chat since that version (later messages change earlier terms) ===",
      "(no messages)",
      "",
    ]);
  });

  it("is empty with no parts", () => {
    expect(draftSourceText({})).toBe("\n");
  });
});
