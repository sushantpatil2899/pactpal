import { useState } from "react";
import { redeemLink, type LinkProblem } from "./api";

const PROBLEMS: Record<LinkProblem, string> = {
  unknown: "This link is not valid. Please ask the seller to send it again.",
  expired: "This link has expired. Please ask the seller for a new one.",
  replaced: "A newer link was sent for this deal. Please use the most recent one.",
  unavailable: "PactPal cannot open links right now. Please try again later.",
};

/** Takes the secret from after `#` and removes it from the address bar right away. */
function takeLinkSecret(): string | undefined {
  const secret = new URLSearchParams(window.location.hash.slice(1)).get("t") ?? undefined;
  window.history.replaceState(null, "", window.location.pathname);
  return secret;
}

// Read once when the page loads (React may run state set-up twice in development).
const initialSecret = takeLinkSecret();

type View =
  | { kind: "ready"; secret: string }
  | { kind: "working" }
  | { kind: "in"; dealId: string }
  | { kind: "problem"; message: string };

/**
 * A buyer link. Nothing happens until the person presses "Continue": mail scanners open links to
 * check them, but do not press buttons.
 */
export function LinkPage() {
  const [view, setView] = useState<View>(
    initialSecret === undefined
      ? { kind: "problem", message: PROBLEMS.unknown }
      : { kind: "ready", secret: initialSecret },
  );

  const onContinue = (secret: string) => {
    setView({ kind: "working" });
    redeemLink(secret).then(
      (result) => {
        setView(
          result.ok
            ? { kind: "in", dealId: result.dealId }
            : { kind: "problem", message: PROBLEMS[result.problem] },
        );
      },
      () => {
        setView({ kind: "problem", message: PROBLEMS.unavailable });
      },
    );
  };

  return (
    <section aria-label="Your deal link">
      {view.kind === "ready" && (
        <>
          <p>You were sent a private link to a deal on PactPal.</p>
          <button
            type="button"
            onClick={() => {
              onContinue(view.secret);
            }}
          >
            Continue to your deal
          </button>
        </>
      )}
      {view.kind === "working" && <p aria-busy="true">Opening your deal…</p>}
      {view.kind === "in" && (
        <p role="status">
          You're in for this deal. <a href={`/deals/${view.dealId}`}>Open your deal</a>
        </p>
      )}
      {view.kind === "problem" && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {view.message}
        </p>
      )}
    </section>
  );
}
