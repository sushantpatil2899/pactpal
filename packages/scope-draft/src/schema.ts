import { z } from "zod";

/** Where in the pasted chat a fact comes from: a line number and words copied from that line. */
const citation = z.strictObject({
  line: z.number().int().min(1),
  quote: z.string().trim().min(3).max(300),
});
const citations = z.array(citation).min(1).max(8);

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
 * A draft's suggested mark for a delivered line (format 3): it can be checked, it is a step in
 * the work, it is a matter of taste, or the model could not tell. Only a suggestion for the seller.
 */
export const DELIVERABLE_MARKS = ["objective", "process", "subjective", "unsure"] as const;
export type DeliverableMark = (typeof DELIVERABLE_MARKS)[number];

/** Fields every draft format has. */
const commonFields = {
  summary: foundOrMissing({ value: z.string().trim().min(1).max(600) }),
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
    citations: z.array(citation).max(8),
    note: z.string().trim().max(300),
  }),
};

/**
 * An AI draft of a deal's scope from a pasted chat ("format 3", drafting prompt version 3). Every
 * statement carries citations or is marked missing; each delivered line has a suggested mark and
 * the draft lists what the buyer must provide. A proposal for the seller to review: it is not
 * evidence and not an agreement.
 */
export const scopeDraftV3Schema = z.strictObject({
  format: z.literal(3),
  ...commonFields,
  deliverables: z.array(listItem.extend({ mark: z.enum(DELIVERABLE_MARKS) })).max(30),
  buyerProvides: z
    .array(
      z.strictObject({
        text: z.string().trim().min(1).max(500),
        /** Only when the chat states day, month and year for it. */
        dueDate: z.iso.date().nullable(),
        citations,
      }),
    )
    .max(20),
});

/** A draft made before prompt version 3 ("format 2"): no marks and no buyer duties. */
const scopeDraftV2Schema = z.strictObject({
  format: z.literal(2),
  ...commonFields,
  deliverables: z.array(listItem).max(30),
});

/** Any stored draft: format 2 (older drafts) or format 3. New drafts are checked as format 3. */
export const scopeDraftSchema = z.discriminatedUnion("format", [
  scopeDraftV2Schema,
  scopeDraftV3Schema,
]);
export type ScopeDraft = z.output<typeof scopeDraftSchema>;
export type ScopeDraftV3 = z.output<typeof scopeDraftV3Schema>;
export type Citation = z.output<typeof citation>;

/** What the buyer provides, by the draft; none in a format 2 draft. */
export const buyerProvidesOf = (draft: ScopeDraft) =>
  draft.format === 3 ? draft.buyerProvides : [];

/** The suggested mark of each delivered line, in order; none in a format 2 draft. */
export const deliverableMarksOf = (draft: ScopeDraft): (DeliverableMark | undefined)[] =>
  draft.format === 3
    ? draft.deliverables.map((item) => item.mark)
    : draft.deliverables.map(() => undefined);
