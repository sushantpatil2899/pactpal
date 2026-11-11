import { useState, type FormEvent } from "react";
import { addBuyer, makeBuyerLink, type DealSummary } from "./api";

const dateOf = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });

/**
 * The seller's view of the buyer: a form to add them by email, then a button that makes a private
 * link to copy and send (email sending is not set up yet).
 */
export function BuyerPanel({
  deal,
  onDealChange,
}: {
  deal: DealSummary;
  onDealChange: (deal: DealSummary) => void;
}) {
  const [link, setLink] = useState<
    { url: string; expiresAt: string; emailed: boolean } | undefined
  >();
  const [problem, setProblem] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const fail = (error: unknown) => {
    setBusy(false);
    setProblem(error instanceof Error ? error.message : "Something went wrong.");
  };

  const onAdd = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get("email");
    const name = form.get("name");
    setBusy(true);
    setProblem(undefined);
    addBuyer(deal.id, {
      email: typeof email === "string" ? email : "",
      ...(typeof name === "string" && name.trim() !== "" ? { name } : {}),
    }).then((updated) => {
      setBusy(false);
      onDealChange(updated);
    }, fail);
  };

  const onMakeLink = () => {
    setBusy(true);
    setProblem(undefined);
    setCopied(false);
    makeBuyerLink(deal.id).then((made) => {
      setBusy(false);
      setLink(made);
    }, fail);
  };

  const onCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
      },
      () => {
        setProblem("Copying did not work; select the link and copy it by hand.");
      },
    );
  };

  return (
    <section aria-labelledby="buyer">
      <h3 id="buyer">Buyer</h3>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      {!deal.buyer && (
        <form onSubmit={onAdd}>
          <p>
            <label>
              Buyer's email <input name="email" type="email" required maxLength={320} />
            </label>
          </p>
          <p>
            <label>
              Name (optional) <input name="name" maxLength={200} />
            </label>
          </p>
          <button type="submit" disabled={busy}>
            Add the buyer
          </button>
        </form>
      )}
      {deal.buyer && (
        <>
          <p>{deal.buyer.name ? `${deal.buyer.name} (${deal.buyer.email})` : deal.buyer.email}</p>
          <button type="button" onClick={onMakeLink} disabled={busy}>
            Make buyer link
          </button>
          {link && (
            <div>
              <p>
                <label>
                  Private link for the buyer{" "}
                  <input
                    readOnly
                    value={link.url}
                    size={40}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                </label>{" "}
                <button
                  type="button"
                  onClick={() => {
                    onCopy(link.url);
                  }}
                >
                  Copy
                </button>
                {copied && <span role="status"> Copied.</span>}
              </p>
              <p>
                Works until {dateOf(link.expiresAt)} and opens only this deal. Making a new link
                cancels the old one.{" "}
                {link.emailed
                  ? "It was also emailed to the buyer."
                  : "It was not emailed: copy the link and send it to the buyer yourself."}
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
