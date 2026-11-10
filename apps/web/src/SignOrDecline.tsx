import { useState, type FormEvent } from "react";
import { Button } from "./design/parts";

const textOf = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

/**
 * The buyer's answer to a page shown above it: a typed name to sign, or a decline with an
 * optional reason. Used for the agreement and for change orders, with their own words. Signing
 * sits in its own highlighted band; declining is the quieter choice under it.
 */
export function SignOrDecline({
  busy,
  words,
  onSign,
  onDecline,
}: {
  busy: boolean;
  words: { sign: string; decline?: string; reasonLabel: string; sendDecline: string };
  onSign: (typedName: string) => void;
  onDecline: (reason: string | undefined) => void;
}) {
  const [declining, setDeclining] = useState(false);
  const sign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSign(textOf(new FormData(event.currentTarget).get("typedName")));
  };
  const decline = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reason = textOf(new FormData(event.currentTarget).get("reason"));
    onDecline(reason === "" ? undefined : reason);
  };
  return (
    <>
      <form onSubmit={sign} className="pp-band pp-sign">
        <label>
          Type your full name
          <input name="typedName" required minLength={2} maxLength={200} autoComplete="name" />
        </label>
        <Button type="submit" look="primary" large disabled={busy}>
          {words.sign}
        </Button>
      </form>
      <p className="pp-sign-after">
        <Button
          disabled={busy}
          aria-expanded={declining}
          onClick={() => {
            setDeclining(!declining);
          }}
        >
          {words.decline ?? "Decline"}
        </Button>
      </p>
      {declining && (
        <form onSubmit={decline}>
          <p>
            <label>
              {words.reasonLabel}
              <textarea name="reason" maxLength={1000} rows={3} className="pp-full" />
            </label>
          </p>
          <Button type="submit" disabled={busy}>
            {words.sendDecline}
          </Button>
        </form>
      )}
    </>
  );
}
