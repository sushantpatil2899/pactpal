import type { ChatMessageView } from "@pactpal/live";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { getPastedChats, type PastedChat } from "./chat-api";
import { lastSeenByOther, type ChatState } from "./chat-state";
import { when } from "./format";
import { WRAP } from "./styles";
import type { LiveChat } from "./useLiveChat";

/** The longest message the server takes. */
const MAX_CHARS = 4000;

const CONNECTION_WORDS: Record<ChatState["connection"], string> = {
  connecting: "Connecting…",
  live: "Live",
  offline: "Offline: reconnecting. Messages you send are still saved.",
};

/** Which tab a PactPal card points to, by what it is about. */
const NOTICE_TABS: Record<string, { tab: DealTab; words: string }> = {
  "review-requested": { tab: "scope", words: "Open the agreement" },
  "review-withdrawn": { tab: "scope", words: "Open the agreement" },
  "changes-requested": { tab: "scope", words: "Open the agreement" },
  signed: { tab: "timeline", words: "Open the timeline" },
  step: { tab: "timeline", words: "Open the timeline" },
  reminder: { tab: "timeline", words: "Open the timeline" },
};

export type DealTab = "chat" | "scope" | "timeline" | "files" | "disputes" | "log";

function Message({
  message,
  mine,
  seen,
  onOpenTab,
}: {
  message: ChatMessageView;
  mine: boolean;
  seen: boolean;
  onOpenTab: (tab: DealTab) => void;
}) {
  if (message.kind === "notice") {
    const link = NOTICE_TABS[message.notice?.type ?? ""];
    return (
      <li className="pp-msg-card">
        <strong>PactPal:</strong> {message.body}{" "}
        {link && (
          <button
            type="button"
            onClick={() => {
              onOpenTab(link.tab);
            }}
          >
            {link.words}
          </button>
        )}
        <br />
        <small>{when(message.createdAt)}</small>
      </li>
    );
  }
  return (
    <li className="pp-msg" data-mine={mine}>
      <div>
        <small>
          <strong>{mine ? "You" : message.name}</strong> · {when(message.createdAt)}
        </small>
        <br />
        {message.body}
      </div>
      {seen && <small aria-label="Seen by the other side">Seen</small>}
    </li>
  );
}

/** The seller's pasted chats, readable by both sides, folded away under the live chat. */
function PastedChats({ dealId }: { dealId: string }) {
  const [chats, setChats] = useState<PastedChat[] | undefined>();
  useEffect(() => {
    getPastedChats(dealId).then(setChats, () => {
      setChats([]);
    });
  }, [dealId]);
  if (!chats || chats.length === 0) return null;
  return (
    <section aria-labelledby="pasted-chats">
      <h4 id="pasted-chats">Pasted chats</h4>
      {chats.map((chat) => (
        <details key={chat.id}>
          <summary>
            {chat.filename} · pasted by the{" "}
            {chat.addedBy === "seller" ? "seller" : "email forwarding"}, {when(chat.addedAt)}
          </summary>
          <pre style={{ whiteSpace: "pre-wrap", ...WRAP }}>{chat.text}</pre>
        </details>
      ))}
    </section>
  );
}

/**
 * The deal's live chat: messages from both sides and PactPal's cards, who is online and typing,
 * "Seen" under the newest message the other side has read, and a box to write in (Enter sends,
 * Shift+Enter adds a line). Every message is saved in the evidence log.
 */
export function ChatTab({
  dealId,
  chat,
  otherName,
  onOpenTab,
  about,
  pasted = true,
}: {
  dealId: string;
  chat: LiveChat;
  otherName: string;
  onOpenTab: (tab: DealTab) => void;
  /** The deal this chat belongs to, named under the heading where the page does not say it. */
  about?: string;
  /** Whether to list the chats pasted in from elsewhere (the deal space does). */
  pasted?: boolean;
}) {
  const { state } = chat;
  const [draft, setDraft] = useState("");
  const thread = useRef<HTMLOListElement>(null);
  const other = state.role === "seller" ? "buyer" : "seller";
  const seenSeq = lastSeenByOther(state);

  useEffect(() => {
    // Scroll the thread itself to its newest message, never the page around it.
    const list = thread.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [state.messages.length, state.pending.length]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    const body = draft.trim();
    if (body === "" || body.length > MAX_CHARS) return;
    chat.send(body);
    setDraft("");
  };
  const onKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) submit(event);
  };

  return (
    <section aria-labelledby="chat-heading" className="pp-chat">
      <h3 id="chat-heading">
        Chat with {otherName}
        {about !== undefined && <small className="pp-chat-about">{about}</small>}
      </h3>
      <p role="status" data-connection={state.connection}>
        {CONNECTION_WORDS[state.connection]}
        {state.role !== undefined && (
          <>
            {" · "}
            {otherName} is {state.online[other] ? "online" : "away"}
          </>
        )}
      </p>
      <p className="pp-chat-note">
        Every message is saved with the time and a fingerprint in the deal&apos;s evidence log.
        Agree on the work, the stages and the payments here; the seller can turn the chat into the
        agreement.
      </p>
      <ol ref={thread} aria-label="Messages" aria-live="polite" className="pp-thread">
        {state.messages.length === 0 && state.pending.length === 0 && (
          <li className="pp-thread-empty">No messages yet.</li>
        )}
        {state.messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            mine={message.role === state.role}
            seen={message.seq === seenSeq}
            onOpenTab={onOpenTab}
          />
        ))}
        {state.pending.map((pending) => (
          <li key={pending.clientId} className="pp-msg" data-mine>
            <div>{pending.body}</div>
            <small>
              {pending.status === "sending" ? (
                "Sending…"
              ) : (
                <>
                  Not sent.{" "}
                  <button
                    type="button"
                    onClick={() => {
                      chat.retry(pending.clientId);
                    }}
                  >
                    Try again
                  </button>
                </>
              )}
            </small>
          </li>
        ))}
      </ol>
      {state.otherTyping && <p aria-live="polite">{otherName} is typing…</p>}
      {state.open ? (
        <form onSubmit={submit} className="pp-compose">
          <label htmlFor="chat-message" className="pp-hidden">
            Message
          </label>
          <textarea
            id="chat-message"
            rows={2}
            placeholder={`Message ${otherName}…`}
            value={draft}
            maxLength={MAX_CHARS}
            onChange={(event) => {
              setDraft(event.target.value);
              chat.typing();
            }}
            onKeyDown={onKey}
          />
          <button type="submit" disabled={draft.trim() === ""}>
            Send
          </button>
        </form>
      ) : (
        <p>This deal was cancelled; its chat is closed.</p>
      )}
      {pasted && <PastedChats dealId={dealId} />}
    </section>
  );
}
