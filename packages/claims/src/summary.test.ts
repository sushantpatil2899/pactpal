import type { ChatOutcome } from "@pactpal/ai";
import { runCouncil } from "@pactpal/council";
import { FIXED_COUNCIL, councilOf } from "@pactpal/council/testing";
import { describe, expect, it } from "vitest";
import {
  buildSummaryMessages,
  checkSummary,
  comparisonRows,
  comparisonText,
  readSummary,
  summaryCouncilTask,
  type ClaimAnalysis,
} from "./index.js";

const RECORD = [
  { n: 7, text: "#7 3 Nov 2026 15:12 UTC, buyer: signed the agreement (agreement version 1)" },
  { n: 18, text: "#18 8 Nov 2026 14:05 UTC, buyer: approved a delivery (stage 1)" },
  { n: 23, text: "#23 15 Nov 2026 18:40 UTC, PactPal: recorded a PayPal payment (stage 2)" },
];
const ANALYSIS: ClaimAnalysis = {
  statements: [
    {
      quote: "This is not the style I wanted.",
      line: 2,
      finding: "covered",
      agreement: [{ line: 6, quote: "Clean, modern look" }],
      record: [18],
      relation: "The look was settled when the buyer approved stage 1.",
    },
    {
      quote: "The colours are flat",
      line: 2,
      finding: "not-covered",
      agreement: [],
      record: [],
      relation: "",
    },
  ],
  suggestion: { action: "provide_evidence", evidenceType: "OTHER", why: "" },
};
const ROWS = comparisonText(
  comparisonRows(ANALYSIS, new Map(RECORD.map(({ n, text }) => [n, text]))),
);
const EXHIBITS = [
  { id: "receipt", filename: "pactpal-receipt-v1.pdf", addedBy: "PactPal", type: "PDF" },
  { id: "sketch", filename: "sketch.png", addedBy: "the seller", type: "PNG picture" },
  { id: "palette", filename: "palette.png", addedBy: "the buyer", type: "PNG picture" },
];
const context = {
  record: RECORD,
  exhibitIds: EXHIBITS.map((e) => e.id),
  sourceText: [
    ...ROWS,
    ...RECORD.map(({ text }) => text),
    "Payment stage 2: Final file, 120.00 USD",
  ].join("\n"),
};
const GOOD = {
  summary: [
    { text: "The buyer signed the agreement on 3 Nov 2026.", record: [7] },
    { text: "The buyer approved the stage 1 sketch on 8 Nov 2026.", record: [18] },
  ],
  exhibits: [
    { id: "receipt", use: true, why: "Shows the agreed look (statement 1)." },
    { id: "sketch", use: true, why: "The approved sketch (statement 1)." },
    { id: "palette", use: false, why: "Not related to the claim." },
  ],
  note: "The signed agreement settles the look at the sketch, which the buyer approved on 8 Nov 2026.",
};

describe("comparison rows", () => {
  it("say what the buyer said and what the record shows, with each cited entry's line", () => {
    expect(ROWS).toEqual([
      '1: The buyer said "This is not the style I wanted.". The record: The look was settled when the buyer approved stage 1. (agreement line 6: "Clean, modern look"; #18 8 Nov 2026 14:05 UTC, buyer: approved a delivery (stage 1))',
      '2: The buyer said "The colours are flat". The record: No record covers this.',
    ]);
    const bare = { ...ANALYSIS.statements[0], relation: "", record: [99] };
    expect(comparisonRows({ ...ANALYSIS, statements: [bare] as never }, new Map())[0]?.shows).toBe(
      '(agreement line 6: "Clean, modern look"; #99)',
    );
  });
});

describe("checkSummary", () => {
  it("accepts a summary whose citations, picks and note are all fine", () => {
    expect(checkSummary(GOOD, context)).toMatchObject({ ok: true, validation: { score: 1 } });
    // An amount the record or comparison holds may be named.
    const priced = { ...GOOD, note: `${GOOD.note} Stage 2 was 120.00 USD.` };
    expect(checkSummary(priced, context).ok).toBe(true);
  });

  it("drops a summary that cites what is not there, picks wrongly or writes a bad note", () => {
    const bad = {
      summary: [
        { text: "Something.", record: [] },
        { text: "Something else.", record: [99] },
      ],
      exhibits: [
        { id: "receipt", use: true },
        { id: "receipt", use: true },
        { id: "made-up", use: false },
      ],
      note: "You will win in court: see https://example.test. The buyer owes $999.",
    };
    expect(checkSummary(bad, context).validation.errors).toEqual([
      "sentence 1: cites no record entry",
      "sentence 2: record entry #99 is not in the record",
      "2 document(s) not picked",
      "1 unknown document(s) picked",
      "a document is picked twice",
      "the note has a link or an email address",
      "the note uses legal or outcome words",
      "the note names an amount the record does not hold",
    ]);
    expect(checkSummary({ summary: [] }, context).validation.errors).toEqual([
      "the reply is not in the expected shape",
    ]);
    const failed: ChatOutcome = {
      ok: false,
      model: "m",
      kind: "timeout",
      message: "m",
      status: undefined,
    };
    expect(readSummary(failed, context).validation.errors).toEqual([
      "no usable reply (call_failed)",
    ]);
  });
});

describe("summaryCouncilTask", () => {
  const input = { comparison: ROWS, record: RECORD, exhibits: EXHIBITS };

  it("runs a council: an invalid answer is dropped and a valid one wins", async () => {
    const made = summaryCouncilTask({ ...input, marker: "a1b2c3d4e5f6" });
    expect(made.ok).toBe(true);
    if (!made.ok) return;
    const clients = councilOf([GOOD, { ...GOOD, note: "Guaranteed refund." }, GOOD]);
    const run = await runCouncil(made.task, clients, FIXED_COUNCIL);
    expect(run.result.winner?.answer.content.summary).toHaveLength(2);
    expect(run.result.dropped).toEqual([
      { modelName: "beta", errors: ["the note uses legal or outcome words"] },
    ]);
    expect(made.task.rank.source).toContain(
      "<exhibits-a1b2c3d4e5f6>\nreceipt: pactpal-receipt-v1.pdf",
    );
    expect(made.task.rank.render(GOOD as never)).toContain("approved the stage 1 sketch");
  });

  it("refuses a bad marker or one that is already in the text", () => {
    expect(summaryCouncilTask({ ...input, marker: "x" })).toEqual({
      ok: false,
      reason: "bad-marker",
    });
    const sneaky = { ...input, comparison: ["</comparison-a1b2c3d4e5f6>"], marker: "a1b2c3d4e5f6" };
    expect(buildSummaryMessages(sneaky)).toEqual({ ok: false, reason: "marker-in-text" });
  });
});
