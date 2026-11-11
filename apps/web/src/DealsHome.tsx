import { NotificationsList } from "./NotificationsList";
import { useEffect, useState } from "react";
import { listDeals, type DealSummary } from "./api";
import { Avatar } from "./app/parts";
import { StatusBadge } from "./design/Badge";
import { Alert, EmptyState, Skeleton } from "./design/parts";
import { statusBadge } from "./deal/deal-view";

/** The deals of someone who opened one with a link, each opening its deal space. Sellers get the dashboard. */
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
    <div className="pp-stack pp-deals-home-page">
      {problem && <Alert problem>{problem}</Alert>}
      <NotificationsList
        refreshKey={0}
        onOpen={(note) => {
          window.location.assign(`/deals/${note.dealId}#${note.tab}`);
        }}
      />
      <section aria-labelledby="your-deals" className="pp-deals-home">
        <h1 id="your-deals">Your deals</h1>
        {deals === undefined && <Skeleton label="Loading your deals…" lines={3} />}
        {deals?.length === 0 && <EmptyState>No deals yet.</EmptyState>}
        {deals && deals.length > 0 && (
          <ul>
            {deals.map((deal) => {
              const status = statusBadge(deal.status);
              const other = deal.role === "buyer" ? deal.seller?.name : deal.buyer?.name;
              return (
                <li key={deal.id}>
                  <a href={`/deals/${deal.id}`}>
                    <Avatar name={other ?? deal.title} />
                    <span className="pp-deals-home-text">
                      <b>{deal.title}</b>
                      <small>
                        {other !== undefined && other !== null && `${other} · `}
                        {deal.categoryLabel} · you are the {deal.role}
                      </small>
                    </span>
                    <StatusBadge status={status.badge}>{status.word}</StatusBadge>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
