/** One in-app chat message as the drafting transcript shows it. */
export interface TranscriptMessage {
  seq: number;
  /** Server time, ISO 8601. */
  at: string;
  name: string;
  role: "seller" | "buyer" | "system";
  body: string;
}

/** What a draft is made from (7h, 7i): any of the current agreement, the in-app chat, pasted chats. */
export interface DraftSourceParts {
  /** For an update: the agreement as it stands, line by line, and its version. */
  current?: { version: number; lines: readonly string[] };
  /** The in-app chat, oldest first; for an update, only the messages after `current`. */
  chat?: readonly TranscriptMessage[];
  /** Chats the seller pasted (or forwarded), each with its file name. */
  pasted?: readonly { filename: string; text: string }[];
}

const ROLE_WORDS: Record<TranscriptMessage["role"], string> = {
  seller: "seller",
  buyer: "buyer",
  system: "PactPal",
};

/** "2026-11-08 10:42 UTC": the same in every language and time zone. */
const minuteOf = (iso: string) => `${iso.slice(0, 10)} ${iso.slice(11, 16)} UTC`;

/** One message as transcript lines: a header on its first line, the rest indented. */
function messageLines(message: TranscriptMessage): string[] {
  const [first = "", ...rest] = message.body
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const who =
    message.role === "system" ? "PactPal" : `${message.name} (${ROLE_WORDS[message.role]})`;
  return [`[${minuteOf(message.at)}] ${who}: ${first}`, ...rest.map((line) => `    ${line}`)];
}

/**
 * The text a draft is made from, in labelled sections: the agreement as it stands (for an
 * update), the in-app chat (each message with its time, name and side), then each pasted chat.
 * Section headings are lines like any other, so the models see where each part comes from and
 * code numbers and checks the whole text as one source. Pure.
 */
export function draftSourceText(parts: DraftSourceParts): string {
  const sections: string[][] = [];
  if (parts.current) {
    sections.push([
      `=== The agreement as it stands (version ${String(parts.current.version)}) ===`,
      ...parts.current.lines,
    ]);
  }
  if (parts.chat) {
    const heading = parts.current
      ? "=== New messages in the deal's chat since that version (later messages change earlier terms) ==="
      : "=== The deal's chat in PactPal ===";
    sections.push([
      heading,
      ...(parts.chat.length === 0 ? ["(no messages)"] : parts.chat.flatMap(messageLines)),
    ]);
  }
  for (const chat of parts.pasted ?? []) {
    sections.push([`=== Chat pasted by the seller: ${chat.filename} ===`, chat.text.trim()]);
  }
  return `${sections.map((lines) => lines.join("\n")).join("\n\n")}\n`;
}
