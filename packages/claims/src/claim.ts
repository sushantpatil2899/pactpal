import { hideInstructionLines, findInstructionLines, type SourceLine } from "@pactpal/scope-draft";
import { disputeReasonWords } from "@pactpal/words";

/** The buyer's claim as the models read it, and the lines they may not cite. */
export interface ClaimText {
  /** Every line, numbered from 1; line 1 is the reason the buyer gave PayPal. */
  lines: SourceLine[];
  /** The same lines with any that give orders to an AI replaced by a placeholder. */
  modelView: SourceLine[];
  /** Numbers of the hidden lines; a citation of one makes an answer invalid. */
  hidden: number[];
}

/** Splits text into its non-blank lines, trimmed. */
const linesOf = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");

/**
 * The claim as numbered lines: "Reason given to PayPal: <plain words>", then each line of the
 * buyer's messages as PayPal shows them, then the seller's pasted copy of the claim (used when
 * PayPal shows none). Lines that look like orders to an AI are hidden from the models. Pure.
 */
export function claimLines(input: {
  reason: string | null;
  buyerMessages: readonly string[];
  pasted?: string;
}): ClaimText {
  const texts = [
    `Reason given to PayPal: ${input.reason === null ? "not given" : disputeReasonWords(input.reason)}`,
    ...input.buyerMessages.flatMap(linesOf),
    ...(input.pasted === undefined ? [] : linesOf(input.pasted)),
  ];
  const lines = texts.map((text, i) => ({ n: i + 1, text }));
  return { lines, modelView: hideInstructionLines(lines), hidden: findInstructionLines(lines) };
}
