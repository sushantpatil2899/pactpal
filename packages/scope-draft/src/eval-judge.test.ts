import { describe, expect, it } from "vitest";
import { EVAL_CASES, type EvalCase } from "./eval-cases.js";
import { scoreDraft } from "./eval-judge.js";
import { ALL_MISSING_DRAFT, MAYA_DRAFT } from "./maya-fixtures.js";
import { scopeDraftSchema, type ScopeDraft } from "./schema.js";
import { numberSourceLines } from "./source.js";

const caseOf = (id: string): EvalCase => {
  const found = EVAL_CASES.find((c) => c.id === id);
  if (found === undefined) throw new Error(`no case ${id}`);
  return found;
};
const linesOf = (evalCase: EvalCase) => {
  const numbered = numberSourceLines(evalCase.chat);
  if (!numbered.ok) throw new Error("numbering failed");
  return numbered.lines;
};
const maya = caseOf("maya").gold;
const cite = (line: number) => [{ line, quote: "quote" }];

describe("the right answers", () => {
  it("has the 11 planned cases with distinct ids", () => {
    expect(EVAL_CASES).toHaveLength(11);
    expect(new Set(EVAL_CASES.map((c) => c.id)).size).toBe(11);
  });

  it.each(EVAL_CASES.map((c) => [c.id, c] as const))(
    "%s: every line it points at exists, and its price, phrases and values fit its chat",
    (_id, evalCase) => {
      const lines = linesOf(evalCase);
      const text = (n: number) => lines.find((line) => line.n === n)?.text ?? "";
      const { gold } = evalCase;
      const groups = [...gold.deliverables, ...gold.exclusions];
      for (const n of groups.flat()) expect(text(n), `line ${String(n)}`).not.toBe("");
      if (gold.price !== null) {
        const stated = text(gold.price.line).replaceAll(",", "");
        expect(stated).toContain(String(Number(gold.price.amount)));
        expect(gold.price.currency).toBe(evalCase.dealCurrency);
      }
      const chat = lines.map((line) => line.text.toLowerCase()).join("\n");
      for (const wordings of gold.vague) {
        expect(wordings.some((wording) => chat.includes(wording))).toBe(true);
      }
      if (gold.dueDate !== null) expect(gold.dueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(gold.category.length).toBeGreaterThan(0);
    },
  );
});

describe("scoreDraft", () => {
  it("gives the known-good Maya draft a perfect score", () => {
    expect(scoreDraft(maya, MAYA_DRAFT)).toEqual({
      score: 1,
      fields: { price: "right", dueDate: "right", revisions: "right", category: "right" },
      recall: { deliverables: 1, exclusions: 1, vague: 1 },
      extras: { deliverables: 0, exclusions: 0, vague: 0 },
      wrongValues: 0,
      buyerProvides: { recall: 1, datesRight: null, extras: 0 },
      marks: { right: 2, judged: 2 },
    });
  });

  it("reports buyer duties and marks apart from the score", () => {
    const sunrise = caseOf("sunrise").gold;
    const withDuty = (dueDate: string | null): ScopeDraft => ({
      ...ALL_MISSING_DRAFT,
      deliverables: [
        { text: "Three pages", citations: cite(3), mark: "objective" },
        { text: "Hosting", citations: cite(7), mark: "unsure" },
      ],
      buyerProvides: [{ text: "Menu text and photos", dueDate, citations: cite(19) }],
    });
    expect(scoreDraft(sunrise, withDuty("2026-11-20"))).toMatchObject({
      buyerProvides: { recall: 1, datesRight: 1, extras: 0 },
      marks: { right: 1, judged: 2 },
    });
    expect(scoreDraft(sunrise, withDuty(null)).buyerProvides.datesRight).toBe(0);
    // An older draft: no buyer duties and no marks.
    const format2 = scopeDraftSchema.parse({
      ...Object.fromEntries(
        Object.entries(ALL_MISSING_DRAFT).filter(([key]) => key !== "buyerProvides"),
      ),
      format: 2,
    });
    expect(scoreDraft(sunrise, format2).buyerProvides).toEqual({
      recall: 0,
      datesRight: null,
      extras: 0,
    });
    expect(scoreDraft(sunrise, format2).marks).toEqual({ right: 0, judged: 2 });
  });

  it("counts a wrong price as wrong, and a price left missing as missed, not as wrong", () => {
    const wrongPrice: ScopeDraft = {
      ...MAYA_DRAFT,
      price: { status: "found", amount: "24.00", currency: "USD", citations: cite(16) },
    };
    const wrongCurrency: ScopeDraft = {
      ...MAYA_DRAFT,
      price: { status: "found", amount: "240.00", currency: "EUR", citations: cite(16) },
    };
    const sameValue: ScopeDraft = {
      ...MAYA_DRAFT,
      price: { status: "found", amount: "240", currency: "USD", citations: cite(16) },
    };
    const missing: ScopeDraft = { ...MAYA_DRAFT, price: { status: "missing" } };
    expect(scoreDraft(maya, wrongPrice)).toMatchObject({
      fields: { price: "wrong" },
      wrongValues: 1,
    });
    expect(scoreDraft(maya, wrongCurrency).fields.price).toBe("wrong");
    expect(scoreDraft(maya, sameValue).fields.price).toBe("right");
    expect(scoreDraft(maya, missing)).toMatchObject({
      fields: { price: "missed" },
      wrongValues: 0,
    });
    expect(scoreDraft(maya, missing).score).toBeLessThan(scoreDraft(maya, MAYA_DRAFT).score);
  });

  it("counts a value the chat does not give as wrong (invented), for date and revisions", () => {
    const invented: ScopeDraft = {
      ...MAYA_DRAFT,
      dueDate: { status: "found", value: "2026-12-01", citations: cite(22) },
      revisionsIncluded: { status: "found", value: 3, citations: cite(20) },
    };
    expect(scoreDraft(maya, invented)).toMatchObject({
      fields: { dueDate: "wrong", revisions: "wrong" },
      wrongValues: 2,
    });
  });

  it("checks a date and a revision count that the chat does give", () => {
    const sunrise = caseOf("sunrise").gold;
    const right: ScopeDraft = {
      ...MAYA_DRAFT,
      dueDate: { status: "found", value: "2026-12-12", citations: cite(13) },
      revisionsIncluded: { status: "found", value: 2, citations: cite(15) },
    };
    expect(scoreDraft(sunrise, right).fields).toMatchObject({
      dueDate: "right",
      revisions: "right",
    });
    const other: ScopeDraft = {
      ...right,
      dueDate: { status: "found", value: "2026-12-13", citations: cite(13) },
      revisionsIncluded: { status: "missing" },
    };
    expect(scoreDraft(sunrise, other).fields).toMatchObject({
      dueDate: "wrong",
      revisions: "missed",
    });
  });

  it("judges the category: any listed id is right, unclear is a miss, anything else is wrong", () => {
    const gift = caseOf("gift-card").gold;
    const withCategory = (id: string): ScopeDraft => ({
      ...ALL_MISSING_DRAFT,
      category: { id, citations: [], note: "" },
    });
    expect(scoreDraft(gift, withCategory("gift-cards-stored-value")).fields.category).toBe("right");
    expect(scoreDraft(gift, withCategory("other-prohibited")).fields.category).toBe("right");
    expect(scoreDraft(gift, withCategory("unclear")).fields.category).toBe("missed");
    expect(scoreDraft(gift, withCategory("art-and-design")).fields.category).toBe("wrong");
  });

  it("measures list recall by the lines cited, and counts items that cite no known line as extras", () => {
    const draft: ScopeDraft = {
      ...MAYA_DRAFT,
      deliverables: [
        { text: "a", citations: cite(3), mark: "objective" },
        { text: "b", citations: cite(1), mark: "unsure" },
      ],
      exclusions: [],
      vagueTerms: [
        { ...MAYA_DRAFT.vagueTerms[0], phrase: "clean, modern look" },
        { ...MAYA_DRAFT.vagueTerms[0], phrase: "an invented worry" },
      ] as ScopeDraft["vagueTerms"],
    };
    const score = scoreDraft(maya, draft);
    expect(score.recall).toEqual({ deliverables: 0.5, exclusions: 0, vague: 0.5 });
    expect(score.extras).toEqual({ deliverables: 1, exclusions: 0, vague: 1 });
  });

  it("treats a chat with nothing to list as fully covered, and every item as an extra", () => {
    const plain = caseOf("price-changed").gold;
    const draft: ScopeDraft = {
      ...ALL_MISSING_DRAFT,
      exclusions: [{ text: "x", citations: cite(2) }],
      vagueTerms: [
        { ...MAYA_DRAFT.vagueTerms[0], phrase: "about 80 words" },
      ] as ScopeDraft["vagueTerms"],
    };
    const score = scoreDraft(plain, draft);
    expect(score.recall).toMatchObject({ exclusions: 1, vague: 1 });
    expect(score.extras).toMatchObject({ exclusions: 1, vague: 1 });
  });

  it("matches vague wordings either way round, but a very short phrase must be a whole wording", () => {
    const relative = caseOf("relative-date").gold;
    const phrased = (...phrases: string[]): ScopeDraft => ({
      ...ALL_MISSING_DRAFT,
      vagueTerms: phrases.map((phrase) => ({
        ...MAYA_DRAFT.vagueTerms[0],
        phrase,
      })) as ScopeDraft["vagueTerms"],
    });
    expect(scoreDraft(relative, phrased("A  Few small changes", "by Friday")).recall.vague).toBe(1);
    expect(
      scoreDraft(relative, phrased("changes after", "a few changes afterwards")).recall.vague,
    ).toBe(0.5);
    expect(scoreDraft(relative, phrased("by")).recall.vague).toBe(0);
  });

  it("gives an all-missing draft full marks on a chat that states nothing and partial marks otherwise", () => {
    const score = scoreDraft(maya, ALL_MISSING_DRAFT);
    expect(score.fields).toEqual({
      price: "missed",
      dueDate: "right",
      revisions: "right",
      category: "missed",
    });
    expect(score.wrongValues).toBe(0);
    expect(score.score).toBeCloseTo((2 + 0 + 0 + 0) / 7);
  });
});
