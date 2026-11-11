import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  getIntakeKey,
  makeIntakeSecret,
  turnOffIntakeSecret,
  type DealOptions,
  type IntakeKeyView,
  type IntakeKind,
  type IntakeSecretView,
} from "./api";
import { when } from "./format";
import { FULL_WIDTH, WRAP } from "./styles";

/** The example request shown with a new key; `origin` is this site's address. */
export const intakeExample = (origin: string, key: string) =>
  `curl -X POST ${origin}/api/intake/deals \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New commission", "text": "Paste the chat or email here"}'`;

/** The words that differ between the key and the forwarding address. */
const WORDS: Record<IntakeKind, { name: string; make: string; shown: string }> = {
  key: { name: "key", make: "Make a key", shown: "Your new key (shown only now):" },
  address: {
    name: "address",
    make: "Make my address",
    shown: "Your new address (shown only now; save it as a contact):",
  },
  agent: {
    name: "agent key",
    make: "Make an agent key",
    shown: "Your new agent key (shown only now):",
  },
};

/** A button that copies `text`, saying so once it has. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true);
          },
          () => undefined,
        );
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/** One secret: the current one's ending and defaults, the new one shown once, and the make form. */
function SecretPart({
  kind,
  current,
  secret,
  busy,
  options,
  onMake,
  onOff,
  children,
}: {
  kind: IntakeKind;
  current: IntakeSecretView | null;
  secret: string | undefined;
  busy: boolean;
  options: DealOptions;
  onMake: (defaults: { defaultCategory: string; defaultCurrency: string }) => void;
  onOff: () => void;
  /** Shown under a new secret. */
  children?: ReactNode;
}) {
  const words = WORDS[kind];
  const label = (id: string) => options.categories.find((c) => c.id === id)?.label ?? id;
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const entry = form.get(name);
      return typeof entry === "string" ? entry : "";
    };
    onMake({
      defaultCategory: value("defaultCategory"),
      defaultCurrency: value("defaultCurrency"),
    });
  };
  return (
    <div className="pp-secret">
      {current && (
        <div className="pp-secret-status">
          <p>
            <span>
              Your {words.name} ends in <code>…{current.ending}</code>
            </span>
            <small>
              Made {when(current.createdAt)} ·{" "}
              {current.lastUsedAt === null
                ? "not used yet"
                : `last used ${when(current.lastUsedAt)}`}{" "}
              · New deals: {label(current.defaultCategory)}, {current.defaultCurrency}
            </small>
          </p>
          <button type="button" className="pp-secret-off" disabled={busy} onClick={onOff}>
            Turn off
          </button>
        </div>
      )}
      {secret && (
        <div role="status" className="pp-secret-new" style={WRAP}>
          <p>
            <strong>{words.shown}</strong> <code>{secret}</code> <CopyButton text={secret} />
          </p>
          {children}
        </div>
      )}
      <form onSubmit={submit} className="pp-secret-form">
        <div className="pp-secret-fields">
          <label>
            <span>Default category</span>
            <select name="defaultCategory" defaultValue={current?.defaultCategory}>
              {options.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Currency</span>
            <select name="defaultCurrency" defaultValue={current?.defaultCurrency}>
              {options.currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" disabled={busy}>
          {current ? `Make a new ${words.name} (the old one stops working)` : words.make}
        </button>
      </form>
    </div>
  );
}

/**
 * The seller's private keys and forwarding address (4p, 4p-2, 8a), loaded once: `part(kind)`
 * draws one of them with its make and turn-off controls, and the new secret shown once.
 */
export function useSecrets(options: DealOptions) {
  const [view, setView] = useState<IntakeKeyView | undefined>();
  const [shown, setShown] = useState<{ kind: IntakeKind; secret: string } | undefined>();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  useEffect(() => {
    getIntakeKey().then(setView, () => undefined);
  }, []);

  const run = (kind: IntakeKind, work: Promise<IntakeKeyView>) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (next) => {
        setBusy(false);
        setView(next);
        setShown(next.secret === undefined ? undefined : { kind, secret: next.secret });
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };
  const part = (kind: IntakeKind, children?: ReactNode) =>
    view && (
      <SecretPart
        kind={kind}
        current={view[kind]}
        secret={shown?.kind === kind ? shown.secret : undefined}
        busy={busy}
        options={options}
        onMake={(defaults) => {
          run(kind, makeIntakeSecret(kind, defaults));
        }}
        onOff={() => {
          run(kind, turnOffIntakeSecret(kind));
        }}
      >
        {children}
      </SecretPart>
    );
  return { view, shown, problem, part };
}

/**
 * "Create deals from other tools" (4p, 4p-2): the seller makes a private key for other tools to
 * post text with, and a private address to forward emails to, each with default category and
 * currency. Each text or email becomes a draft deal with it saved as its chat. A new key or
 * address is shown once. Hidden for someone not signed in with PayPal. The agent key has its
 * own card in Settings.
 */
export function IntakePanel({ options }: { options: DealOptions }) {
  const { view, shown, problem, part } = useSecrets(options);
  if (!view) return null;

  return (
    <section aria-labelledby="intake">
      <h2 id="intake">Create deals from other tools</h2>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      <p>
        Make a private key, then send text to PactPal from another tool (a form, a script, an
        automation). Each text becomes a draft deal with the text saved as its chat.{" "}
        <strong>Keep the key secret: anyone with it can add draft deals to your account.</strong>
      </p>
      {part(
        "key",
        <>
          <p>Example request:</p>
          <pre style={{ ...FULL_WIDTH, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {intakeExample(window.location.origin, shown?.secret ?? "")}
          </pre>
        </>,
      )}
      <h3>Forward emails to PactPal</h3>
      {view.forwarding ? (
        <>
          <p style={WRAP}>
            Make a private address, then forward a chat or an email thread to it. Each email becomes
            a draft deal titled with its subject, with its text saved as its chat (attachments are
            not used). Only emails sent from <strong>{view.sellerEmail}</strong> (your PactPal
            email) are accepted.
          </p>
          {part("address")}
        </>
      ) : (
        <p>Email forwarding is not set up yet.</p>
      )}
      <h3>Connect your AI agent</h3>
      <p>
        Your agent key and setup are in <a href="/settings#agent">Settings</a>.
      </p>
    </section>
  );
}
