import { useEffect, useState, type FormEvent } from "react";
import {
  getIntakeKey,
  makeIntakeKey,
  turnOffIntakeKey,
  type DealOptions,
  type IntakeKeyView,
} from "./api";
import { when } from "./format";
import { FULL_WIDTH, WRAP } from "./styles";

/** The example request shown with a new key; `origin` is this site's address. */
export const intakeExample = (origin: string, key: string) =>
  `curl -X POST ${origin}/api/intake/deals \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New commission", "text": "Paste the chat or email here"}'`;

/**
 * "Create deals from other tools" (4p): the seller makes a private key with default category and
 * currency; a tool posts text with it and each text becomes a draft deal with the text saved as
 * its chat. The key is shown once. Hidden for someone not signed in with PayPal.
 */
export function IntakePanel({ options }: { options: DealOptions }) {
  const [view, setView] = useState<IntakeKeyView | undefined>();
  const [secret, setSecret] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getIntakeKey().then(setView, () => undefined);
  }, []);
  if (!view) return null;

  const run = (work: Promise<IntakeKeyView>) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (next) => {
        setBusy(false);
        setView(next);
        setSecret(next.secret);
        setCopied(false);
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };
  const onMake = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => {
      const entry = form.get(name);
      return typeof entry === "string" ? entry : "";
    };
    run(
      makeIntakeKey({
        defaultCategory: value("defaultCategory"),
        defaultCurrency: value("defaultCurrency"),
      }),
    );
  };
  const label = (id: string) => options.categories.find((c) => c.id === id)?.label ?? id;

  return (
    <section aria-labelledby="intake">
      <h2 id="intake">Create deals from other tools</h2>
      <p>
        Make a private key, then send text to PactPal from another tool (a form, a script, an
        automation). Each text becomes a draft deal with the text saved as its chat.{" "}
        <strong>Keep the key secret: anyone with it can add draft deals to your account.</strong>
      </p>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      {view.key && (
        <p>
          Your key ends in <code>…{view.key.ending}</code>, made {when(view.key.createdAt)}
          {view.key.lastUsedAt === null
            ? ", not used yet"
            : `, last used ${when(view.key.lastUsedAt)}`}
          . New deals: {label(view.key.defaultCategory)}, {view.key.defaultCurrency}.{" "}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              run(turnOffIntakeKey());
            }}
          >
            Turn off
          </button>
        </p>
      )}
      {secret && (
        <div role="status" style={WRAP}>
          <p>
            <strong>Your new key (shown only now):</strong> <code>{secret}</code>{" "}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(secret).then(
                  () => {
                    setCopied(true);
                  },
                  () => undefined,
                );
              }}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </p>
          <p>Example request:</p>
          <pre style={{ ...FULL_WIDTH, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
            {intakeExample(window.location.origin, secret)}
          </pre>
        </div>
      )}
      <form onSubmit={onMake}>
        <p>
          <label>
            Default category{" "}
            <select name="defaultCategory" defaultValue={view.key?.defaultCategory}>
              {options.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>{" "}
          <label>
            Currency{" "}
            <select name="defaultCurrency" defaultValue={view.key?.defaultCurrency}>
              {options.currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </p>
        <button type="submit" disabled={busy}>
          {view.key ? "Make a new key (the old one stops working)" : "Make a key"}
        </button>
      </form>
    </section>
  );
}
