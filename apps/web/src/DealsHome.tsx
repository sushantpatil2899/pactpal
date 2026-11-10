import { NotificationsList } from "./NotificationsList";
import { useEffect, useState } from "react";
import { listDeals, type DealSummary } from "./api";

/** The deals of someone who opened one with a link: a plain list. Sellers get the dashboard. */
export function DealsHome() {
  const [deals, setDeals] = useState<DealSummary[] | undefined>();
  const [problem, setProblem] = useState<string | undefined>();

  useEffect(() => {
    listDeals().then(
      (list) => {
        setDeals(list);
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load your deals.");
      },
    );
  }, []);

  return (
    <>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      <NotificationsList
        refreshKey={0}
        onOpen={(note) => {
          window.location.assign(`/deals/${note.dealId}#${note.tab}`);
        }}
      />
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
    </>
  );
}
