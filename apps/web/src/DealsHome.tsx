import { useEffect, useState, type FormEvent } from "react";
import { createDeal, getDealOptions, listDeals, type DealOptions, type DealSummary } from "./api";
import { IntakePanel } from "./IntakePanel";

/** The signed-in seller's deals and a form to create one. Simple on purpose; Phase 4 designs it. */
export function DealsHome() {
  const [deals, setDeals] = useState<DealSummary[] | undefined>();
  const [options, setOptions] = useState<DealOptions | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([listDeals(), getDealOptions()]).then(
      ([list, choices]) => {
        setDeals(list);
        setOptions(choices);
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load your deals.");
      },
    );
  }, []);

  const onCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (name: string) => {
      const value = form.get(name);
      return typeof value === "string" ? value : "";
    };
    setSaving(true);
    createDeal({
      title: text("title"),
      category: text("category"),
      currency: text("currency"),
    }).then(
      (deal) => {
        window.location.assign(`/deals/${deal.id}`);
      },
      (error: unknown) => {
        setSaving(false);
        setProblem(error instanceof Error ? error.message : "Could not create the deal.");
      },
    );
  };

  return (
    <>
      {problem && (
        <p role="alert" style={{ color: "#8a1c1c" }}>
          {problem}
        </p>
      )}
      <section aria-labelledby="your-deals">
        <h2 id="your-deals">Your deals</h2>
        {deals === undefined && <p aria-busy="true">Loading…</p>}
        {deals?.length === 0 && <p>No deals yet.</p>}
        {deals && deals.length > 0 && (
          <ul>
            {deals.map((deal) => (
              <li key={deal.id}>
                <a href={`/deals/${deal.id}`}>{deal.title}</a> ({deal.categoryLabel}, you are the{" "}
                {deal.role})
              </li>
            ))}
          </ul>
        )}
      </section>
      {options && (
        <section aria-labelledby="new-deal">
          <h2 id="new-deal">New deal</h2>
          <form onSubmit={onCreate}>
            <p>
              <label>
                Title <input name="title" required maxLength={200} />
              </label>
            </p>
            <p>
              <label>
                What are you selling?{" "}
                <select name="category" required>
                  {options.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </p>
            <p>
              <label>
                Currency{" "}
                <select name="currency" required>
                  {options.currencies.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </p>
            <button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create deal"}
            </button>
          </form>
        </section>
      )}
      {options && <IntakePanel options={options} />}
    </>
  );
}
