import { z } from "zod";

export const LOOK_VERDICTS = ["shown", "not-shown", "contradicted", "cannot-tell"] as const;
export type LookVerdict = (typeof LOOK_VERDICTS)[number];

const lookSchema = z.object({
  description: z.string().trim().min(1).max(300),
  lines: z
    .array(
      z.object({
        line: z.number().int().min(1),
        verdict: z.enum(LOOK_VERDICTS),
        note: z.string().trim().max(200).default(""),
      }),
    )
    .min(1)
    .max(50),
});

/** A model's look at one image, after the checks: what it shows, and a verdict per line. */
export type Look = z.output<typeof lookSchema>;

export type CheckedLook =
  { ok: true; look: Look } | { ok: false; reason: "bad-shape" | "wrong-lines" };

/**
 * Checks a model's reply about one image: the right shape, every given line exactly once and no
 * other, verdicts from the fixed list and short notes. Anything else is thrown away. Pure.
 */
export function checkLook(value: unknown, lineNumbers: readonly number[]): CheckedLook {
  const parsed = lookSchema.safeParse(value);
  if (!parsed.success) return { ok: false, reason: "bad-shape" };
  const answered = parsed.data.lines.map((entry) => entry.line);
  const expected = [...lineNumbers].sort((a, b) => a - b);
  const same =
    answered.length === expected.length &&
    [...answered].sort((a, b) => a - b).every((line, i) => line === expected[i]);
  if (!same) return { ok: false, reason: "wrong-lines" };
  const lines = [...parsed.data.lines].sort((a, b) => a.line - b.line);
  return { ok: true, look: { ...parsed.data, lines } };
}
