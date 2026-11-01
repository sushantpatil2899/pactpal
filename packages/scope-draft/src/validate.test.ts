import { okReply, testSpec } from "@pactpal/ai/testing";
import { describe, expect, it } from "vitest";
import type { ScopeDraft } from "./schema.js";
import { numberSourceLines } from "./source.js";
import { MAYA_CHAT, MAYA_DRAFT, TEST_CATEGORIES } from "./testing.js";
import { normalizeForMatch, readScopeDraft, validateScopeDraft } from "./validate.js";

const numbered = numberSourceLines(MAYA_CHAT);
if (!numbered.ok) throw new Error("the sample chat must be numbered");
const context = {
  lines: numbered.lines,
  categoryIds: TEST_CATEGORIES.map(({ id }) => id),
  dealCurrency: "USD",
};

/** A copy of the correct draft with `change` applied, for testing one failure at a time. */
function altered(change: (draft: ScopeDraft) => void): unknown {
  const copy = structuredClone(MAYA_DRAFT);
  change(copy);
  return copy;
}

function errorsOf(value: unknown): string[] {
  const result = validateScopeDraft(value, context);
  expect(result.ok).toBe(false);
  expect(result.validation.valid).toBe(false);
  return result.validation.errors;
}

describe("validateScopeDraft", () => {
  it("accepts the correct draft with a perfect score", () => {
    const result = validateScopeDraft(MAYA_DRAFT, context);
    expect(result).toMatchObject({ ok: true, validation: { valid: true, score: 1, errors: [] } });
  });

  it("accepts a draft where everything is missing", () => {
    const empty = {
      format: 2,
      summary: { status: "missing" },
      deliverables: [],
      exclusions: [],
      price: { status: "missing" },
      paymentTerms: { status: "missing" },
      dueDate: { status: "missing" },
      revisionsIncluded: { status: "missing" },
      vagueTerms: [],
      category: { id: "unclear", citations: [], note: "" },
    };
    expect(validateScopeDraft(empty, context)).toMatchObject({
      ok: true,
      validation: { valid: true, score: 1 },
    });
  });

  it("accepts honest quotes that differ only in case, spacing, curly quotes or a copied line prefix", () => {
    const result = validateScopeDraft(
      altered((d) => {
        d.price = {
          status: "found",
          amount: "240.00",
          currency: "usd",
          citations: [{ line: 16, quote: "L16|  IT’S   $240 total" }],
        };
      }),
      context,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects a line that does not exist", () => {
    const errors = errorsOf(
      altered((d) => {
        d.exclusions = [{ text: "x", citations: [{ line: 99, quote: "No merchandise use" }] }];
      }),
    );
    expect(errors).toEqual(["exclusions[0]: line 99 does not exist"]);
  });

  it("rejects a quote that is not on the cited line, even if it is on another line", () => {
    const errors = errorsOf(
      altered((d) => {
        d.exclusions = [{ text: "x", citations: [{ line: 14, quote: "No merchandise use" }] }];
      }),
    );
    expect(errors).toEqual(["exclusions[0]: the quote is not on line 14"]);
  });

  it("rejects a quote too short to mean anything once its line prefix is removed", () => {
    const errors = errorsOf(
      altered((d) => {
        d.exclusions = [{ text: "x", citations: [{ line: 13, quote: "L13| a" }] }];
      }),
    );
    expect(errors[0]).toContain("the quote is not on line 13");
  });

  it("scores the share of citations that passed", () => {
    const result = validateScopeDraft(
      altered((d) => {
        d.exclusions = [
          { text: "x", citations: [{ line: 14, quote: "that is invented" }] },
          { text: "y", citations: [{ line: 13, quote: "No merchandise use" }] },
        ];
      }),
      context,
    );
    expect(result.ok).toBe(false);
    // The correct draft has 12 citations; one is now invented, so 11 of 12 pass.
    expect(result.validation.score).toBeCloseTo(11 / 12);
  });

  it("never repeats the quoted words or other chat text in its errors", () => {
    const errors = errorsOf(
      altered((d) => {
        d.exclusions = [
          { text: "Maya secret", citations: [{ line: 14, quote: "Chris private words" }] },
        ];
        d.vagueTerms = [{ ...MAYA_DRAFT.vagueTerms[0]!, phrase: "unrelated private phrase" }];
      }),
    );
    expect(errors.join(" ")).not.toMatch(/private|secret|Chris|Maya/);
  });

  it("rejects a price in another currency, below one, or whose digits are not in the quote", () => {
    const price = (amount: string, currency: string, quote = "it's $240 total", line = 16) =>
      altered((d) => {
        d.price = { status: "found", amount, currency, citations: [{ line, quote }] };
      });
    expect(errorsOf(price("240.00", "EUR"))).toEqual([
      "price: the currency is not the deal's currency",
    ]);
    expect(errorsOf(price("0.00", "USD"))).toContain("price: the amount is not above zero");
    expect(errorsOf(price("250.00", "USD"))).toEqual([
      "price: the amount does not appear in the quotes cited for it",
    ]);
    // 24 is part of 240 but is not the number 24.
    expect(errorsOf(price("24.00", "USD"))).toEqual([
      "price: the amount does not appear in the quotes cited for it",
    ]);
  });

  it("matches the digits of a price written with commas, and ignores the cents", () => {
    const lines = [{ n: 1, text: "Total is $1,240.50 for everything" }];
    const draft = altered((d) => {
      d.price = {
        status: "found",
        amount: "1240.50",
        currency: "USD",
        citations: [{ line: 1, quote: "$1,240.50 for everything" }],
      };
      d.summary = { status: "missing" };
      d.deliverables = [];
      d.exclusions = [];
      d.paymentTerms = { status: "missing" };
      d.vagueTerms = [];
      d.category = { id: "unclear", citations: [], note: "" };
    });
    expect(validateScopeDraft(draft, { ...context, lines }).ok).toBe(true);
  });

  it("rejects a vague phrase that is not on a cited line", () => {
    const errors = errorsOf(
      altered((d) => {
        d.vagueTerms = [{ ...MAYA_DRAFT.vagueTerms[0]!, phrase: "sleek futuristic style" }];
      }),
    );
    expect(errors).toEqual(["vagueTerms[0]: the phrase is not on a cited line"]);
  });

  it("rejects a category that is not in the lists, or that is certain but has no citation", () => {
    expect(
      errorsOf(altered((d) => void (d.category = { id: "pottery", citations: [], note: "" }))),
    ).toEqual(["category: the id is not in the lists given"]);
    expect(
      errorsOf(
        altered((d) => void (d.category = { id: "art-and-design", citations: [], note: "" })),
      ),
    ).toEqual(["category: no citation for a category that is not unclear"]);
  });

  it("accepts a blocked category with a citation", () => {
    const result = validateScopeDraft(
      altered((d) => {
        d.category = {
          id: "gift-cards-stored-value",
          citations: [{ line: 3, quote: "full-body character illustration" }],
          note: "",
        };
      }),
      context,
    );
    expect(result.ok).toBe(true);
  });

  it("rejects the wrong shape and names the field, not the value", () => {
    const base: Record<string, unknown> = { ...MAYA_DRAFT };
    expect(errorsOf("not an object")[0]).toMatch(/^\(root\)/);
    expect(errorsOf({ ...base, format: 1 })[0]).toMatch(/^format/);
    expect(errorsOf({ ...base, surprise: "secret value" }).join(" ")).not.toContain("secret value");
    expect(
      errorsOf({
        ...base,
        dueDate: {
          status: "found",
          value: "20 Nov",
          citations: MAYA_DRAFT.summary.status === "found" ? MAYA_DRAFT.summary.citations : [],
        },
      })[0],
    ).toMatch(/^dueDate/);
    expect(
      errorsOf({
        ...base,
        revisionsIncluded: { status: "found", value: 2.5, citations: [{ line: 1, quote: "abc" }] },
      })[0],
    ).toMatch(/^revisionsIncluded/);
    expect(
      errorsOf({ ...base, summary: { status: "found", value: "x", citations: [] } })[0],
    ).toMatch(/^summary/);
    expect(errorsOf({ ...base, deliverables: "list" })[0]).toMatch(/^deliverables/);
  });

  it("accepts eight citations on a field and rejects nine", () => {
    const citedTimes = (n: number) =>
      altered((d) => {
        d.summary = {
          status: "found",
          value: "x",
          citations: Array.from({ length: n }, () => ({ line: 3, quote: "full-body character" })),
        };
      });
    expect(validateScopeDraft(citedTimes(8), context).ok).toBe(true);
    expect(errorsOf(citedTimes(9))[0]).toMatch(/^summary\.citations/);
  });

  it("gives a wrong-shape answer a score of zero", () => {
    expect(validateScopeDraft({}, context).validation.score).toBe(0);
  });

  it("accepts a found date and a found revision count when they are cited", () => {
    const result = validateScopeDraft(
      altered((d) => {
        d.dueDate = {
          status: "found",
          value: "2026-11-20",
          citations: [{ line: 22, quote: "ideally a quick turnaround" }],
        };
        d.revisionsIncluded = {
          status: "found",
          value: 2,
          citations: [{ line: 20, quote: "rough sketch first" }],
        };
      }),
      context,
    );
    expect(result.ok).toBe(true);
  });
});

describe("readScopeDraft", () => {
  const spec = testSpec({ name: "m" });

  it("reads a reply, including one wrapped in a code fence, and checks it", () => {
    const fenced = "```json\n" + JSON.stringify(MAYA_DRAFT) + "\n```";
    expect(readScopeDraft(okReply(spec, fenced), context)).toMatchObject({ ok: true });
  });

  it("treats a failed call, a cut-off reply and a non-JSON reply as invalid", () => {
    const failed = {
      ok: false,
      model: "m",
      kind: "timeout",
      message: "m: timed out",
      status: undefined,
    } as const;
    expect(readScopeDraft(failed, context).validation.errors).toEqual(["m: timed out"]);
    const cut = { ...okReply(spec, JSON.stringify(MAYA_DRAFT)), finishReason: "length" };
    expect(readScopeDraft(cut, context).validation.errors[0]).toContain("cut off");
    expect(readScopeDraft(okReply(spec, "no json here"), context).validation).toMatchObject({
      valid: false,
      score: 0,
    });
  });

  it("checks the citations of a well-formed reply", () => {
    const bad = altered(
      (d) =>
        void (d.exclusions = [{ text: "x", citations: [{ line: 14, quote: "made up words" }] }]),
    );
    expect(readScopeDraft(okReply(spec, JSON.stringify(bad)), context).ok).toBe(false);
  });
});

describe("normalizeForMatch", () => {
  it("makes typography plain and ignores case and spacing", () => {
    expect(normalizeForMatch("  It’s   “fine” – really\n")).toBe('it\'s "fine" - really');
  });
});
