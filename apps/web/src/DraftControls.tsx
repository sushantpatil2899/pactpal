import { when } from "./format";

/**
 * Below a council draft (5f summary, 5h answer help): why the last one failed, that one is
 * running, and the button to draft (again), or why drafting is off.
 */
export function DraftControls({
  latest,
  canDraft,
  busy,
  onDraft,
  first,
  off,
}: {
  latest: { status: string; createdAt: string; failureReason: string | null } | undefined;
  canDraft: boolean;
  busy: boolean;
  onDraft: () => void;
  /** The button's words before any draft. */
  first: string;
  /** Why drafting is off. */
  off: string;
}) {
  const running = latest?.status === "running";
  return (
    <>
      {latest?.status === "failed" && (
        <p>The last draft did not finish: {latest.failureReason ?? "unknown reason"}.</p>
      )}
      {running && <p>Drafting… (started {when(latest.createdAt)}; this takes a minute or two)</p>}
      {canDraft ? (
        <button type="button" disabled={busy || running} onClick={onDraft}>
          {latest === undefined ? first : "Draft again"}
        </button>
      ) : (
        <p>{off}</p>
      )}
    </>
  );
}
