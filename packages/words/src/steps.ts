import { dayWords } from "./changes.js";

/** A timeline step as the receipt, the pages and emails describe it. */
export interface StepFacts {
  n: number;
  kind: string;
  owner: "seller" | "buyer";
  title: string;
  dueDate: string | null;
  amount: { text: string } | null;
}

const KIND_WORDS: Record<string, string> = {
  "buyer-provides": "The buyer provides",
  review: "Review: the seller shares, the buyer approves",
  payment: "Payment",
  delivery: "Delivery",
};

/**
 * One step in words, e.g. "2. Payment: Deposit, 50.00 USD (by the buyer, due 10 Nov 2026)".
 * Steps of kind "other" say who does them.
 */
export function stepLine(step: StepFacts, currency: string): string {
  const kind = KIND_WORDS[step.kind] ?? `The ${step.owner}`;
  const amount = step.amount === null ? "" : `, ${step.amount.text} ${currency}`;
  const due = step.dueDate === null ? "" : `, due ${dayWords(step.dueDate)}`;
  return `${String(step.n)}. ${kind}: ${step.title}${amount} (by the ${step.owner}${due})`;
}
