import { useEffect, useState, type FormEvent } from "react";
import {
  getSellerApp,
  linkSellerApp,
  unlinkSellerApp,
  type SellerAppLink,
  type SellerAppState,
} from "./api";
import { when } from "./format";
import { sellerAppProblemText } from "./seller-app-words";
import { FULL_WIDTH, WRAP } from "./styles";

const DEVELOPER_SITE = "https://developer.paypal.com/dashboard/applications/sandbox";

/** How to make a sandbox app whose keys PactPal can use. */
function Steps() {
  return (
    <ol>
      <li>
        Open the{" "}
        <a href={DEVELOPER_SITE} target="_blank" rel="noreferrer">
          PayPal developer dashboard
        </a>{" "}
        and choose <strong>Sandbox</strong>, then <strong>Apps &amp; Credentials</strong>.
      </li>
      <li>
        Choose <strong>Create App</strong>, type <strong>Merchant</strong>, and pick the sandbox
        business account that should receive your payments.
      </li>
      <li>
        In the app's features, keep <strong>Invoicing</strong> and <strong>Disputes</strong> turned
        on.
      </li>
      <li>Copy the app's client ID and secret into the boxes below.</li>
    </ol>
  );
}

/** The linked app: its account and client id (never the secret), and unlinking after a confirm. */
function Linked({ link, onUnlinked }: { link: SellerAppLink; onUnlinked: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  const unlink = () => {
    setBusy(true);
    unlinkSellerApp().then(onUnlinked, (error: unknown) => {
      setBusy(false);
      setProblem(error instanceof Error ? error.message : "Could not unlink your PayPal app.");
    });
  };

  return (
    <>
      <p role="status" style={WRAP}>
        Linked to PayPal account <strong>{link.merchantId}</strong> through the app{" "}
        <code>{link.clientId}</code>, since {when(link.linkedAt)}.
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {confirming ? (
        <div role="group" aria-label="Confirm unlinking">
          <p>
            Unlinking deletes the app secret PactPal stored. PactPal then cannot answer disputes on
            invoices sent from this account until you link it again.
          </p>
          <button type="button" onClick={unlink} disabled={busy}>
            {busy ? "Unlinking…" : "Yes, unlink"}
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              setConfirming(false);
            }}
            disabled={busy}
          >
            Keep it linked
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setConfirming(true);
          }}
        >
          Unlink
        </button>
      )}
    </>
  );
}

/** The form for a client id and secret; the secret box is cleared whatever the answer. */
function LinkForm({ onLinked }: { onLinked: (link: SellerAppLink) => void }) {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setProblem(undefined);
    linkSellerApp({ clientId: clientId.trim(), clientSecret: clientSecret.trim() }).then(
      (result) => {
        setBusy(false);
        setClientSecret("");
        if (result.ok) onLinked(result.link);
        else setProblem(sellerAppProblemText(result.problem, result.missing));
      },
      () => {
        setBusy(false);
        setClientSecret("");
        setProblem(sellerAppProblemText("other", []));
      },
    );
  };

  return (
    <form onSubmit={submit} aria-busy={busy}>
      <Steps />
      <p>
        <label htmlFor="seller-app-client-id">Client ID</label>
        <br />
        <input
          id="seller-app-client-id"
          value={clientId}
          onChange={(event) => {
            setClientId(event.target.value);
          }}
          autoComplete="off"
          spellCheck={false}
          required
          style={FULL_WIDTH}
        />
      </p>
      <p>
        <label htmlFor="seller-app-secret">Secret</label>
        <br />
        <input
          id="seller-app-secret"
          type="password"
          value={clientSecret}
          onChange={(event) => {
            setClientSecret(event.target.value);
          }}
          autoComplete="off"
          spellCheck={false}
          required
          style={FULL_WIDTH}
        />
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      <button type="submit" disabled={busy}>
        {busy ? "Checking with PayPal…" : "Link app"}
      </button>
    </form>
  );
}

/**
 * "Your PayPal app" (6h-2): a seller links their own sandbox app so PactPal can act from their
 * account. The secret is sent once, then only the account and client id are shown.
 */
export function SellerAppPanel() {
  const [state, setState] = useState<SellerAppState | undefined>();
  const [problem, setProblem] = useState<string | undefined>();

  useEffect(() => {
    getSellerApp().then(setState, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load your PayPal app.");
    });
  }, []);

  return (
    <section aria-labelledby="seller-app">
      <h2 id="seller-app">Your PayPal app</h2>
      <p>
        Link your own sandbox PayPal app so PactPal can send your invoices and answer your disputes
        from your own PayPal account. Sandbox keys only: never enter live keys.
      </p>
      <p style={{ color: "#555" }}>
        Not in use yet: until the next update, invoices still come from PactPal's own sandbox seller
        account.
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {state === undefined && problem === undefined && <p aria-busy="true">Loading…</p>}
      {state && !state.available && state.link === null && (
        <p>{sellerAppProblemText("unavailable", [])}</p>
      )}
      {state?.link && (
        <Linked
          link={state.link}
          onUnlinked={() => {
            setState({ ...state, link: null });
          }}
        />
      )}
      {state?.available && state.link === null && (
        <LinkForm
          onLinked={(link) => {
            setState({ ...state, link });
          }}
        />
      )}
    </section>
  );
}
