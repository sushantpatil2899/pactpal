import { checkedScopeContentSchema, scopeContentSchema, type ScopeContent } from "@pactpal/db";
import { fromPayPalMoney } from "@pactpal/paypal";
import { z } from "zod";

const { milestones } = scopeContentSchema.shape;

/** A payment stage as the seller types it: the stored stage's rules, with the amount as text. */
export const typedStageSchema = milestones.element
  .omit({ amountMinor: true })
  .extend({ amount: z.string().trim().min(1).max(20) });
export type TypedStage = z.output<typeof typedStageSchema>;

/**
 * Typed stages with their amounts in minor units, converted without floating point; amounts that
 * are not a number of the currency's format are named in `fields` as `<path>.<n>.amount`.
 */
export function stagesInMinor(stages: readonly TypedStage[], currency: string, path: string) {
  const fields: string[] = [];
  const converted = stages.map(({ amount, ...stage }, n) => {
    try {
      return {
        ...stage,
        amountMinor: fromPayPalMoney({ currency_code: currency, value: amount }).minor,
      };
    } catch {
      fields.push(`${path}.${String(n)}.amount`);
      return { ...stage, amountMinor: 0 };
    }
  });
  return { stages: converted, fields };
}

/**
 * The content checked by the stored rules, or the fields that are wrong (with the ones already
 * found, such as amounts); an amount's field is named `amount`, as the seller typed it.
 */
export function checkedContent(
  raw: unknown,
  found: readonly string[],
): { ok: true; content: ScopeContent } | { ok: false; fields: string[] } {
  const content = checkedScopeContentSchema.safeParse(raw);
  if (content.success && found.length === 0) return { ok: true, content: content.data };
  const fields = [...found];
  for (const issue of content.success ? [] : content.error.issues) {
    const field = issue.path.join(".").replace(/amountMinor$/, "amount");
    if (!fields.includes(field)) fields.push(field);
  }
  return { ok: false, fields };
}
