import { useEffect, useState, type CSSProperties } from "react";
import type { ChatLine } from "./api";
import { WRAP } from "./styles";

/** A request to show one line; `nonce` changes on every request, so asking twice scrolls again. */
export interface LineRequest {
  line: number;
  nonce: number;
}

const HIGHLIGHT: CSSProperties = {
  background: "color-mix(in srgb, var(--color-wait) 22%, transparent)",
  outline: "2px solid var(--color-wait)",
};

/** The numbered chat lines, marking those hidden from the AI and the highlighted one. */
function ChatLines({
  idPrefix,
  lines,
  hidden,
  highlighted,
}: {
  idPrefix: string;
  lines: ChatLine[];
  hidden: readonly number[];
  highlighted: number | undefined;
}) {
  return (
    <ol style={{ listStyle: "none", paddingLeft: 0, ...WRAP }}>
      {lines.map((line) => (
        <li
          key={line.n}
          id={`${idPrefix}-${String(line.n)}`}
          tabIndex={-1}
          style={line.n === highlighted ? HIGHLIGHT : undefined}
        >
          <code>{line.n}</code> {line.text}
          {hidden.includes(line.n) && <strong data-tone="problem"> (hidden from the AI)</strong>}
        </li>
      ))}
    </ol>
  );
}

/**
 * The chat a draft was made from, with line numbers: folded away (a phone, or the draft review)
 * or as a column that stays in view beside the form. A line request opens it, scrolls to the line,
 * highlights it and moves focus there.
 */
export function ChatPane({
  idPrefix,
  lines,
  hidden,
  request,
  layout,
}: {
  idPrefix: string;
  lines: ChatLine[];
  hidden: readonly number[];
  request?: LineRequest | undefined;
  layout: "folded" | "column";
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (request === undefined) return;
    setOpen(true);
    // After the fold opens, bring the line into view and give it focus.
    requestAnimationFrame(() => {
      const target = document.getElementById(`${idPrefix}-${String(request.line)}`);
      target?.scrollIntoView({ block: "center" });
      target?.focus({ preventScroll: true });
    });
  }, [request, idPrefix]);

  const list = (
    <ChatLines idPrefix={idPrefix} lines={lines} hidden={hidden} highlighted={request?.line} />
  );
  if (layout === "column") {
    return (
      <section
        aria-label="The chat"
        style={{ position: "sticky", top: 0, maxHeight: "100vh", overflowY: "auto" }}
      >
        <h4>The chat</h4>
        {list}
      </section>
    );
  }
  return (
    <details
      open={open}
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
      }}
    >
      <summary>The chat with line numbers</summary>
      {list}
    </details>
  );
}

/** "From the chat: line 14, line 22" as buttons that show each line in the chat. */
export function FromTheChat({
  lines,
  onShow,
  prefix = "From the chat:",
}: {
  lines: readonly number[];
  onShow: (line: number) => void;
  prefix?: string;
}) {
  if (lines.length === 0) return null;
  return (
    <span data-tone="note">
      {prefix}{" "}
      {lines.map((line, n) => (
        <span key={line}>
          {n > 0 && ", "}
          <button
            type="button"
            aria-label={`Show line ${String(line)} of the chat`}
            onClick={() => {
              onShow(line);
            }}
          >
            line {line}
          </button>
        </span>
      ))}
    </span>
  );
}
