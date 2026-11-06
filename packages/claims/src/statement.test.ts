import { testSpec } from "@pactpal/ai/testing";
import { runCouncil } from "@pactpal/council";
import { FIXED_COUNCIL, councilOf } from "@pactpal/council/testing";
import { describe, expect, it } from "vitest";
import { checkStatement, readStatement, statementCouncilTask } from "./index.js";

const RECORD = [
  {
    n: 17,
    text: '#17 22 Sept 2026 11:00 UTC, seller: proposed a change to the agreement ("A blog")',
  },
  {
    n: 19,
    text: '#19 23 Sept 2026 10:05 UTC, buyer: declined a change to the agreement ("A blog")',
  },
];
const ITEMS = [
  { id: "E19", words: `${RECORD[1]?.text ?? ""}. Why: it records the blog declined.` },
];
const context = { record: RECORD, sourceText: RECORD.map((r) => r.text).join("\n") };
const GOOD = {
  statement: [
    { text: "The seller proposed a blog as a change on 22 Sept 2026.", record: [17] },
    { text: "The buyer declined that change on 23 Sept 2026.", record: [19] },
  ],
  note: "The record shows the buyer declined the proposed blog on 23 Sept 2026; the log entry is attached.",
};
const input = {
  claim: [{ n: 1, text: "The site has no blog." }],
  decision: ["PayPal decided: resolved buyer favour"],
  sent: ["As PayPal lists it: type other; files: homepage.png"],
  record: RECORD,
  items: ITEMS,
  marker: "a1b2c3d4e5f6",
};

describe("appeal statement checks", () => {
  it("keeps a statement whose sentences cite real entries, one may cite none", () => {
    const one = {
      ...GOOD,
      statement: [GOOD.statement[0], { text: "Nothing else changed.", record: [] }],
    };
    expect(checkStatement(one, context)).toMatchObject({ ok: true, validation: { score: 1 } });
  });

  it("drops a statement citing nothing or missing entries, with links, outcome words or new amounts", () => {
    const bad = {
      statement: [
        { text: "This guarantees a refund of $500.", record: [99] },
        { text: "See https://example.test", record: [] },
      ],
      note: "You will win.",
    };
    expect(checkStatement(bad, context).validation.errors).toEqual([
      "sentence 1: record entry #99 is not in the record",
      "sentence 1 uses legal or outcome words",
      "sentence 1 names an amount the record does not hold",
      "sentence 2 has a link or an email address",
      "the note uses legal or outcome words",
    ]);
    const uncited = { ...GOOD, statement: GOOD.statement.map((s) => ({ ...s, record: [] })) };
    expect(checkStatement(uncited, context).validation.errors).toEqual([
      "no sentence cites a record entry",
    ]);
    expect(checkStatement({ note: "x" }, context).ok).toBe(false);
    expect(readStatement({ ok: false, error: "timeout" } as never, context).ok).toBe(false);
  });
});

describe("the appeal statement council task", () => {
  it("asks with the approved wording and the new items with their reasons", async () => {
    const made = statementCouncilTask(input);
    if (!made.ok) throw new Error(made.reason);
    const asked = made.task.answerRequest(testSpec());
    const system = asked.messages[0];
    const user = asked.messages[1];
    expect(system?.content).toContain("You help a seller write an appeal to PayPal");
    expect(user?.content).toContain("E19: #19 23 Sept 2026");
    const run = await runCouncil(
      made.task,
      councilOf([GOOD, { ...GOOD, note: "You will win." }, GOOD]),
      FIXED_COUNCIL,
    );
    expect(run.result.winner?.answer.content.statement).toHaveLength(2);
    expect(run.result.dropped).toEqual([
      { modelName: "beta", errors: ["the note uses legal or outcome words"] },
    ]);
    expect(statementCouncilTask({ ...input, marker: "x" })).toEqual({
      ok: false,
      reason: "bad-marker",
    });
  });
});
