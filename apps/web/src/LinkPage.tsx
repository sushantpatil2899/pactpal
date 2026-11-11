import { useState } from "react";
import { SIGN_IN_PATH, redeemLink, type LinkProblem } from "./api";
import { BrandLogo } from "./design/brand-logos";
import { LogoMark } from "./design/Logo";
import { Alert, Button, ButtonLink, Skeleton } from "./design/parts";

const PROBLEMS: Record<LinkProblem, string> = {
  unknown: "This link is not valid. Please ask the seller to send it again.",
  expired: "This link has expired. Please ask the seller for a new one.",
  replaced: "A newer link was sent for this deal. Please use the most recent one.",
  unavailable: "PactPal cannot open links right now. Please try again later.",
};

/**
 * Takes the secret from after `#` and removes it from the address bar right away. Only on the link
 * page: this file is loaded on every page, and other pages keep their address as it is.
 */
function takeLinkSecret(): string | undefined {
  if (window.location.pathname !== "/link") return undefined;
  const secret = new URLSearchParams(window.location.hash.slice(1)).get("t") ?? undefined;
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
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

  /**
   * Uses the link (which proves the buyer's email), then either shows the deal or, if the buyer
   * chose PayPal, goes to PayPal and comes back to the deal.
   */
  const onUse = (secret: string, withPayPal: boolean) => {
    setView({ kind: "working" });
    redeemLink(secret).then(
      (result) => {
        if (result.ok && withPayPal) {
          window.location.assign(
            `${SIGN_IN_PATH}?return=${encodeURIComponent(`/deals/${result.dealId}`)}`,
          );
          return;
        }
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
    <section aria-labelledby="link-title" className="pp-link">
      <div className="pp-link-card">
        <LogoMark className="pp-link-mark" />
        <h1 id="link-title">Your deal on PactPal</h1>
        {view.kind === "ready" && (
          <p className="pp-link-lead">
            You were sent a private link to a deal on PactPal. How would you like to continue?
          </p>
        )}
        {view.kind === "working" && <Skeleton label="Opening your deal…" lines={2} />}
        {view.kind === "in" && <Alert>You&apos;re in for this deal.</Alert>}
        {view.kind === "problem" && <Alert problem>{view.message}</Alert>}
        {view.kind === "ready" && (
          <div className="pp-link-choices">
            <Button
              look="primary"
              large
              onClick={() => {
                onUse(view.secret, false);
              }}
            >
              Continue without an account
            </Button>
            <p className="pp-link-or">
              <span>or</span>
            </p>
            <Button
              large
              onClick={() => {
                onUse(view.secret, true);
              }}
            >
              <BrandLogo name="paypal" />
              Sign in with PayPal
            </Button>
            <small>
              Signing in with PayPal keeps your access without the link. Use the PayPal account with
              the email this link was sent to.
            </small>
          </div>
        )}
        {view.kind === "in" && (
          <ButtonLink look="primary" large href={`/deals/${view.dealId}`}>
            Open your deal
          </ButtonLink>
        )}
      </div>
    </section>
  );
}
