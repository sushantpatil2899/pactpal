import { useEffect, useState, type FormEvent } from "react";
import { createDeal, getDealOptions, type DealOptions } from "../api";
import { Alert, Button, Card, Skeleton } from "../design/parts";
import { IntakePanel } from "../IntakePanel";
import { navigate } from "../router/useRoute";

/**
 * Starting a deal: name it and say what is being sold, then add the chat inside the deal; or set
 * up a key or a forwarding address so deals arrive from other tools and from email.
 */
export function NewDealPage() {
  const [options, setOptions] = useState<DealOptions | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getDealOptions().then(setOptions, (error: unknown) => {
      setProblem(error instanceof Error ? error.message : "Could not load the deal choices.");
    });
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
        navigate(`/deals/${deal.id}`);
      },
      (error: unknown) => {
        setSaving(false);
        setProblem(error instanceof Error ? error.message : "Could not create the deal.");
      },
    );
  };

  return (
    <div className="pp-stack">
      <header className="pp-page-head">
        <h1>New deal</h1>
      </header>
      {problem !== undefined && <Alert problem>{problem}</Alert>}
      {!options && problem === undefined && <Skeleton label="Loading…" lines={4} />}
      {options && (
        <>
          <Card>
            <form onSubmit={onCreate} className="pp-form">
              <label>
                Title
                <input
                  name="title"
                  required
                  maxLength={200}
                  placeholder="Book cover illustration"
                />
              </label>
              <label>
                What are you selling?
                <select name="category" required>
                  {options.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Currency
                <select name="currency" required>
                  {options.currencies.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <div>
                <Button type="submit" look="primary" disabled={saving}>
                  {saving ? "Creating…" : "Create deal"}
                </Button>
              </div>
              <small>
                Next you add the buyer and the chat you agreed in: paste it, upload a screenshot, or
                talk in the deal&apos;s own chat.
              </small>
            </form>
          </Card>
          <Card>
            <div>
              <IntakePanel options={options} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
