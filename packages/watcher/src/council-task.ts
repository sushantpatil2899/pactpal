import type { CouncilTask } from "@pactpal/council";
import type { AgreementLine } from "@pactpal/qa";
import type { SourceLine } from "@pactpal/scope-draft";
import { buildReviewMessages, recordLines, reviewSource, type WorkRecord } from "./prompt.js";
import { readReview, type MessageReview } from "./review.js";

/** Room for the review, including the thinking some models do before they answer. */
const REVIEW_MAX_TOKENS = 4000;

/** What the voters are told the reviews are, and what makes one better (approved by the owner, 4m). */
const RANK_SUMMARY =
  "Reviews of a buyer's new message against the signed agreement: what each request is, a reply, and lines for a change to the agreement.";
const RANK_CRITERIA = [
  "Each request is labelled correctly against the agreement.",
  "The cited agreement lines really support the label.",
  "No request in the message is missed, and nothing is invented.",
  "The reply is short and polite, and promises nothing outside the agreement.",
  "The change lines describe only the out-of-scope requests, clearly enough to add to an agreement.",
];

export type MessageReviewTask =
  | { ok: true; task: CouncilTask<MessageReview> }
  | { ok: false; reason: "bad-marker" | "marker-in-text" };

/**
 * The council task for reviewing a buyer's new message: the request (agreement, record and
 * message in elements named with `marker`), the code checks every answer must pass before the
 * vote, and what voters are shown (exactly what the answering models saw).
 */
export function messageReviewCouncilTask(input: {
  agreement: readonly AgreementLine[];
  record: WorkRecord;
  message: readonly SourceLine[];
  marker: string;
}): MessageReviewTask {
  const { agreement, message, marker } = input;
  const record = recordLines(input.record);
  const built = buildReviewMessages({ agreement, record, message, marker });
  if (!built.ok) return { ok: false, reason: built.reason };
  const context = { agreement, message };
  return {
    ok: true,
    task: {
      answerRequest: () => ({
        messages: built.messages,
        maxTokens: REVIEW_MAX_TOKENS,
        temperature: 0,
        reply: "json",
      }),
      check: (outcome) => {
        const result = readReview(outcome, context);
        return result.ok
          ? { ok: true, content: result.review, validation: result.validation }
          : { ok: false, validation: result.validation };
      },
      rank: {
        summary: RANK_SUMMARY,
        criteria: RANK_CRITERIA,
        source: reviewSource({ agreement, record, message, marker }),
        render: (review) => JSON.stringify(review),
      },
    },
  };
}
