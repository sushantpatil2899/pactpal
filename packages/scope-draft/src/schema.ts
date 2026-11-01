import { z } from "zod";

/** Where in the pasted chat a fact comes from: a line number and words copied from that line. */
const citation = z.strictObject({
  line: z.number().int().min(1),
  quote: z.string().trim().min(3).max(300),
});
const citations = z.array(citation).min(1).max(5);

/** A field the chat either states (`found`, with citations) or does not (`missing`). */
function foundOrMissing<Shape extends z.ZodRawShape>(shape: Shape) {
  return z.discriminatedUnion("status", [
    z.strictObject({ status: z.literal("found"), ...shape, citations }),
    z.strictObject({ status: z.literal("missing") }),
  ]);
}

/** One item of a list; an empty list means the chat states none. */
const listItem = z.strictObject({ text: z.string().trim().min(1).max(300), citations });

export const VAGUE_KINDS = ["subjective", "unmeasurable"] as const;

/**
 * An AI draft of a deal's scope from a pasted chat ("format 2"). Every statement carries
 * citations or is marked missing. The draft is a proposal for the seller to review: it is not
 * evidence and not an agreement.
 */
export const scopeDraftSchema = z.strictObject({
  format: z.literal(2),
  summary: foundOrMissing({ value: z.string().trim().min(1).max(600) }),
  deliverables: z.array(listItem).max(30),
  exclusions: z.array(listItem).max(30),
  price: foundOrMissing({
    /** A decimal string such as "240.00"; converted to whole minor units only when saved. */
    amount: z.string().regex(/^\d{1,8}(\.\d{1,2})?$/),
    currency: z.string().length(3),
  }),
  paymentTerms: foundOrMissing({ value: z.string().trim().min(1).max(300) }),
  dueDate: foundOrMissing({ value: z.iso.date() }),
  revisionsIncluded: foundOrMissing({ value: z.number().int().min(0).max(20) }),
  vagueTerms: z
    .array(
      z.strictObject({
        phrase: z.string().trim().min(2).max(200),
        kind: z.enum(VAGUE_KINDS),
        suggestedRewrite: z.string().trim().min(1).max(400),
        citations,
      }),
    )
    .max(20),
  category: z.strictObject({
    id: z.string().trim().min(1).max(64),
    citations: z.array(citation).max(5),
    note: z.string().trim().max(300),
  }),
});
export type ScopeDraft = z.output<typeof scopeDraftSchema>;
export type Citation = z.output<typeof citation>;
