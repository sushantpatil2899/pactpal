import { useEffect, useState, type FormEvent } from "react";
import {
  addPastedChat,
  getDraftById,
  listDrafts,
  listFiles,
  startDraft,
  type DealFile,
  type DraftView,
} from "./api";
import { CouncilPanel } from "./CouncilPanel";
import { DraftReview } from "./DraftReview";
import type { DraftFill } from "./draft-fill";
import { when } from "./format";
import { FULL_WIDTH } from "./styles";

/** How often a running draft is checked, and how many failed checks in a row stop the checking. */
const POLL_MS = 3000;
const MAX_FAILED_POLLS = 3;

/** A form field's text; empty when the field is missing or is a file. */
const textOf = (value: FormDataEntryValue | null): string =>
  typeof value === "string" ? value : "";

const STATUS_WORDS: Record<DraftView["status"], string> = {
  running: "drafting",
  ready: "ready",
  failed: "did not work",
};

/**
 * Drafting the agreed work from a chat with the AI council. The seller pastes the chat (saved as a
 * text file on the deal) or picks a saved text file; the page checks back while the council works,
 * then shows the draft for review. Earlier drafts stay listed. Only the seller sees this.
 */
export function DraftPanel({
  dealId,
  canDraft,
  dealCategory,
  onUse,
  onLogChange,
}: {
  dealId: string;
  /** The seller of a deal that is still a draft may start new drafts. */
  canDraft: boolean;
  dealCategory: string;
  onUse: (fill: DraftFill) => void;
  onLogChange: () => void;
}) {
  const [drafts, setDrafts] = useState<DraftView[] | undefined>();
  const [files, setFiles] = useState<DealFile[]>([]);
  const [openId, setOpenId] = useState<string | undefined>();
  const [detail, setDetail] = useState<DraftView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [lostContact, setLostContact] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([listDrafts(dealId), listFiles(dealId)]).then(
      ([found, saved]) => {
        setDrafts(found);
        setFiles(saved.filter((file) => file.kind === "source" && file.mediaType === "text/plain"));
        setOpenId(found[0]?.id);
      },
      () => {
        setProblem("Could not load the drafts.");
      },
    );
  }, [dealId]);

  // Opens the chosen draft in full (a finished one comes with its numbered chat) and, while it is
  // running, checks back until it is final, the page is left, or the server stops answering.
  useEffect(() => {
    if (openId === undefined) {
      setDetail(undefined);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failed = 0;
    setLostContact(false);
    const load = () => {
      getDraftById(dealId, openId).then(
        (view) => {
          if (cancelled) return;
          failed = 0;
          setDetail(view);
          setDrafts((current) => current?.map((d) => (d.id === view.id ? { ...d, ...view } : d)));
          if (view.status === "running") {
            timer = setTimeout(load, POLL_MS);
          } else {
            onLogChange();
          }
        },
        () => {
          if (cancelled) return;
          failed += 1;
          if (failed >= MAX_FAILED_POLLS) {
            setLostContact(true);
          } else {
            timer = setTimeout(load, POLL_MS);
          }
        },
      );
    };
    load();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
    };
    // onLogChange is a fresh function on each render of the page; the draft to follow is what matters.
  }, [dealId, openId]);

  const onStart = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const pasted = textOf(form.get("chat")).trim();
    const savedId = textOf(form.get("savedFile"));
    if (pasted === "" && savedId === "") {
      setProblem("Paste the chat, or choose a saved text file.");
      return;
    }
    setBusy(true);
    setProblem(undefined);
    const source =
      pasted === ""
        ? Promise.resolve(savedId)
        : addPastedChat(dealId, pasted).then((file) => {
            setFiles((current) => [...current, file]);
            onLogChange();
            return file.id;
          });
    source
      .then((fileId) => startDraft(dealId, fileId))
      .then(
        (started) => {
          setBusy(false);
          setDrafts((current) => [started, ...(current ?? [])]);
          setOpenId(started.id);
          setDetail(started);
        },
        (error: unknown) => {
          setBusy(false);
          setProblem(error instanceof Error ? error.message : "Could not start the draft.");
        },
      );
  };

  const running = drafts?.some((d) => d.status === "running") === true;
  if (drafts === undefined && !problem) return <p aria-busy="true">Loading the drafts…</p>;
  return (
    <section aria-labelledby="drafts">
      <h3 id="drafts">Draft the agreed work from a chat</h3>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {canDraft && (
        <form onSubmit={onStart}>
          <p>
            Paste a chat between you and the buyer. Several AI models read it, check each other and
            draft the agreed work, quoting the chat for every line.{" "}
            <strong>
              The chat is sent to the AI providers (Google, Groq, Mistral and OpenRouter): paste
              only text you may share, and use made-up chats for testing.
            </strong>
          </p>
          <p>
            <label>
              Paste the chat
              <br />
              <textarea
                style={FULL_WIDTH}
                name="chat"
                rows={8}
                maxLength={60000}
                disabled={busy || running}
              />
            </label>
          </p>
          {files.length > 0 && (
            <p>
              <label>
                or use a text file already saved on this deal{" "}
                <select name="savedFile" defaultValue="" disabled={busy || running}>
                  <option value="">(none)</option>
                  {files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.filename}
                    </option>
                  ))}
                </select>
              </label>
            </p>
          )}
          <p>
            <button type="submit" disabled={busy || running}>
              Draft the agreed work
            </button>{" "}
            It takes about a minute.
          </p>
        </form>
      )}
      {drafts?.length === 0 && !canDraft && <p>No drafts were made for this deal.</p>}
      {drafts && drafts.length > 1 && (
        <>
          <h4>Drafts of this deal</h4>
          <ul>
            {drafts.map((draft) => (
              <li key={draft.id}>
                <button
                  type="button"
                  aria-pressed={draft.id === openId}
                  onClick={() => {
                    setOpenId(draft.id);
                  }}
                >
                  {when(draft.createdAt)}: {STATUS_WORDS[draft.status]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {detail?.status === "running" && (
        <p role="status" aria-busy="true">
          The council is drafting (started {when(detail.createdAt)}). This takes about a minute and
          sometimes two. You can leave this page open or come back later: the draft keeps running.
        </p>
      )}
      {lostContact && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          Lost contact with the server. The draft keeps running there; reload this page to check.
        </p>
      )}
      {detail?.status === "failed" && (
        <>
          <p role="alert" style={{ color: "#8a1c1c" }}>
            This draft did not work: {detail.failureReason ?? "unknown reason"}. You can try again.
          </p>
          {detail.council !== null && <CouncilPanel council={detail.council} />}
        </>
      )}
      {detail?.status === "ready" && (
        <DraftReview view={detail} dealCategory={dealCategory} canUse={canDraft} onUse={onUse} />
      )}
    </section>
  );
}
