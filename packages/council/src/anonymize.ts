import type { CandidateAnswer, LabelledAnswer } from "./types.js";

export type Rng = () => number;

/** Splits answers into those that passed the code checks and those that did not. */
export function filterValid<T>(answers: CandidateAnswer<T>[]): {
  valid: CandidateAnswer<T>[];
  dropped: { modelName: string; errors: string[] }[];
} {
  const valid: CandidateAnswer<T>[] = [];
  const dropped: { modelName: string; errors: string[] }[] = [];
  for (const a of answers) {
    if (a.validation.valid) valid.push(a);
    else dropped.push({ modelName: a.modelName, errors: a.validation.errors });
  }
  return { valid, dropped };
}

function labelFor(index: number): string {
  // A..Z, then AA, AB, ... for very large councils.
  let label = "";
  let n = index;
  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return label;
}

/**
 * Shuffles answers and gives them neutral labels so voters cannot tell which
 * answer is their own from its position or name.
 */
export function anonymize<T>(answers: CandidateAnswer<T>[], rng: Rng = Math.random): LabelledAnswer<T>[] {
  const shuffled = [...answers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled.map((answer, i) => ({ label: labelFor(i), answer }));
}
