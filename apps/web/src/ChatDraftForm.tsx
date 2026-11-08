import { useState, type FormEvent } from "react";
import { startDraftFromChat, type DealFile, type DraftView } from "./api";

/** PactPal's own transcripts are not offered as pasted chats. */
const TRANSCRIPT_PREFIX = "pactpal-chat-";

/**
 * Drafting from the deal's own conversation (7h, 7i): the chat in PactPal, any pasted chats, or
 * both; and, once there is an agreement, "Update from the latest chat", which reads the
 * agreement as it stands plus only the messages since the last draft.
 */
export function ChatDraftForm({
  dealId,
  files,
  hasAgreement,
  disabled,
  onStarted,
}: {
  dealId: string;
  files: readonly DealFile[];
  hasAgreement: boolean;
  disabled: boolean;
  onStarted: (draft: DraftView) => void;
}) {
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const pasted = files.filter((file) => !file.filename.startsWith(TRANSCRIPT_PREFIX));

  const start = (input: { chat: boolean; pastedFileIds: string[]; update: boolean }) => {
    setBusy(true);
    setProblem(undefined);
    startDraftFromChat(dealId, input).then(
      (draft) => {
        setBusy(false);
        onStarted(draft);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Could not start the draft.");
      },
    );
  };
  const onDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    start({
      chat: form.get("useChat") === "on",
      pastedFileIds: form.getAll("pasted").filter((id): id is string => typeof id === "string"),
      update: false,
    });
  };

  return (
    <form onSubmit={onDraft} aria-labelledby="chat-draft-heading">
      <h4 id="chat-draft-heading">From the conversation</h4>
      <p>
        Draft the agreed work and its timeline from what you and the buyer wrote. The words are sent
        to the AI providers; the exact text they read is kept with this deal.
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      <p>
        <label>
          <input type="checkbox" name="useChat" defaultChecked /> The chat in PactPal
        </label>
        {pasted.map((file) => (
          <label key={file.id} style={{ display: "block" }}>
            <input type="checkbox" name="pasted" value={file.id} /> Pasted chat: {file.filename}
          </label>
        ))}
      </p>
      <p>
        <button type="submit" disabled={disabled || busy}>
          Draft from the conversation
        </button>{" "}
        {hasAgreement && (
          <button
            type="button"
            disabled={disabled || busy}
            onClick={() => {
              start({ chat: true, pastedFileIds: [], update: true });
            }}
          >
            Update from the latest chat
          </button>
        )}
      </p>
      {hasAgreement && (
        <p style={{ fontSize: 14, color: "#555" }}>
          &quot;Update from the latest chat&quot; reads the agreement as it stands and only the
          messages since the last draft, and shows you what would change.
        </p>
      )}
    </form>
  );
}
