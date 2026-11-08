import { useState, type FormEvent } from "react";
import { FULL_WIDTH } from "./styles";

const textOf = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

/**
 * The buyer's answer to a page shown above it: a typed name to sign, or a decline with an
 * optional reason. Used for the agreement and for change orders, with their own words.
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
      <form onSubmit={sign}>
        <p>
          <label>
            Type your full name{" "}
            <input name="typedName" required minLength={2} maxLength={200} autoComplete="name" />
          </label>
        </p>
        <button type="submit" disabled={busy}>
          {words.sign}
        </button>{" "}
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setDeclining(!declining);
          }}
        >
          {words.decline ?? "Decline"}
        </button>
      </form>
      {declining && (
        <form onSubmit={decline}>
          <p>
            <label>
              {words.reasonLabel}
              <textarea name="reason" maxLength={1000} rows={3} style={FULL_WIDTH} />
            </label>
          </p>
          <button type="submit" disabled={busy}>
            {words.sendDecline}
          </button>
        </form>
      )}
    </>
  );
}
