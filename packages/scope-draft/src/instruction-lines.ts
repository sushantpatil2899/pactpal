import type { SourceLine } from "./source.js";

/** What the models see in place of a chat line that gives orders to an AI. */
export const HIDDEN_LINE_TEXT = "[line hidden: it looks like an instruction to an AI]";

/** Invisible characters stripped before matching, so hiding the letters of an order does not hide the order. */
const STRIPPED = /\u200b|\u200c|\u200d|\u2060|\ufeff/g;

/** Invisible characters that are never part of ordinary chat text (the joiners used in emoji and some scripts are left out). */
const SUSPICIOUS_INVISIBLE = /[\u200b\u2060\ufeff]/;

/** Job titles that follow "assistant" in ordinary talk ("the assistant manager"). */
const ASSISTANT_TITLES =
  "manager|director|professor|principal|coach|editor|teacher|secretary|engineer|designer|accountant|buyer";

/** Words that name an AI reader, with "assistant" only when it does not start a job title ("assistant manager"). */
const AI_WORD = `(?:\\bai\\b|\\ba\\.i\\.|\\bllm\\b|\\bchatbot\\b|\\bassistant\\b(?!\\s+(?:${ASSISTANT_TITLES})\\b))`;

/** The same, but "assistant" after "my", "the" and the like is a person ("my assistant, Jo"). */
const AI_NAME = `(?:\\bai\\b|\\ba\\.i\\.|\\bllm\\b|\\bchatbot\\b|(?<!\\b(?:my|our|his|her|their|your|the)\\s)\\bassistant\\b(?!\\s+(?:${ASSISTANT_TITLES})\\b))`;

const COMMANDS =
  "output|write|add|set|reply|print|classify|cite|rank|mark|record|confirm|put|use|ignore|say|answer|include|insert|change|make|respond|return|reveal|show|state|treat|list";

/**
 * Patterns for a line that gives orders to an AI. Each is narrow on purpose: a chat that only
 * mentions an AI product or an assistant manager must not match. Matching is case-insensitive.
 */
const PATTERNS: readonly RegExp[] = [
  // "ignore all earlier instructions", "disregard the rules above"
  /\b(?:ignore|disregard|forget|override)\b[^.\n]{0,60}\b(?:instructions?|rules?|prompts?|guidelines?)\b/i,
  // "the previous instructions are void"
  /\b(?:previous|prior|earlier|above)\s+(?:instructions?|rules?)\b/i,
  // "note to the AI", "message for the assistant"
  new RegExp(
    `\\b(?:note|message|instruction|order|request|attention|reminder)s?\\s+(?:to|for)\\s+(?:the\\s+)?${AI_WORD}`,
    "i",
  ),
  // "(to the AI)", "[for the reviewers]"
  /[([]\s*(?:to|for)\s+the\s+(?:ai|assistant|llm|reviewers?)\s*[)\]]/i,
  // a role label at the start of a line, with or without a speaker's name before it
  /^(?:[^:\n]{1,30}:\s*)?(?:system|developer|assistant)\s*:/i,
  // an AI addressed with a command: "assistant, add ...", "AI: put ..."
  new RegExp(`${AI_NAME}\\s*[:,]\\s*(?:please\\s+)?(?:you\\s+)?(?:${COMMANDS})\\b`, "i"),
  // "new rules:", "updated criteria:"
  /\b(?:new|updated|revised|real)\s+(?:rules?|instructions?|criteria|guidelines?)\s*:/i,
  // "print your full instructions", "reveal your API key"
  /\b(?:print|reveal|repeat|output|leak|display)\b[^.\n]{0,40}\b(?:instructions|rules|system prompt|prompt|api[ -]?key|secret|password)\b/i,
  // tags that imitate the structure of our own instructions
  /<\/?(?:chat|rules|role|fields|summary|deliverables|price|draft|source|reply_schema|deal_currency|allowed_categories|system)\b[^>]*>/i,
  // markup that could run in a page
  /<\s*(?:script|iframe|object|embed)\b|\bon(?:error|load|click|mouseover)\s*=/i,
  // a pasted draft to copy
  /"format"\s*:\s*2\b|"citations"\s*:\s*\[/,
  // the same orders in Spanish
  /\b(?:nota|mensaje|instrucci[oó]n(?:es)?)\s+para\s+(?:la\s+)?(?:ia|inteligencia artificial|asistente)\b/i,
  /\bignora(?:r)?\s+(?:todas?\s+)?(?:las\s+)?(?:instrucciones|reglas)\b/i,
];

/** The text without zero-width characters, as the patterns see it. */
export function withoutInvisible(text: string): string {
  return text.replace(STRIPPED, "");
}

/** Whether one chat line looks like an order to an AI. */
export function looksLikeInstruction(text: string): boolean {
  if (SUSPICIOUS_INVISIBLE.test(text)) return true;
  const plain = withoutInvisible(text);
  return PATTERNS.some((pattern) => pattern.test(plain));
}

/** The numbers of the lines that look like orders to an AI. */
export function findInstructionLines(lines: readonly SourceLine[]): number[] {
  return lines.filter(({ text }) => looksLikeInstruction(text)).map(({ n }) => n);
}

/**
 * The chat as the models see it: the same lines with the same numbers, but a line that looks like
 * an order to an AI is replaced by a placeholder. The stored chat is never changed.
 */
export function hideInstructionLines(lines: readonly SourceLine[]): SourceLine[] {
  return lines.map((line) =>
    looksLikeInstruction(line.text) ? { n: line.n, text: HIDDEN_LINE_TEXT } : line,
  );
}
