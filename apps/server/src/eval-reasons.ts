/** A draft the citation checker dropped: which model, which chat, and the checker's messages. */
export interface DroppedDraft {
  model: string;
  caseId: string;
  /** The checker's messages: field names, line numbers and rules, never the chat's words. */
  reasons: readonly string[];
}

/** A checker message without its list position ("timeline[2]: …" → "timeline: …"). */
export const ruleOf = (reason: string) => reason.replace(/\[\d+\]/g, "");

/**
 * Why drafts were dropped, one line per model, chat and rule, with how often (7p). Empty when no
 * draft was dropped.
 */
export function droppedSection(drops: readonly DroppedDraft[]): string {
  const counted = new Map<string, number>();
  for (const drop of drops) {
    for (const rule of new Set(drop.reasons.map(ruleOf))) {
      const key = `${drop.model}, ${drop.caseId}: ${rule}`;
      counted.set(key, (counted.get(key) ?? 0) + 1);
    }
  }
  if (counted.size === 0) return "";
  const lines = [...counted].map(([key, n]) => `  ${key}${n > 1 ? ` (${String(n)})` : ""}\n`);
  return `\nWhy drafts were dropped (model, chat: rule)\n${lines.join("")}`;
}
