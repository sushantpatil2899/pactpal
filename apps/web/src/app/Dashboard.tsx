import { Alert, ButtonLink, Card, EmptyState, Field, Skeleton } from "../design/parts";
import { Icon } from "../design/icons";
import { NotificationsList } from "../NotificationsList";
import type { DealOverview } from "../overview-api";
import { navigate } from "../router/useRoute";
import { noteAddress } from "../messages/threads";
import { byUrgency, isOpen, needsMe } from "./overview-words";
import { DealRow } from "./parts";
import type { Overview } from "./useOverview";

function DealList({
  title,
  deals,
  empty,
}: {
  title: string;
  deals: DealOverview[];
  empty: string;
}) {
  const id = title.toLowerCase().replaceAll(" ", "-");
  return (
    <section aria-labelledby={id}>
      <Card>
        <h2 id={id} className="pp-card-title">
          {title} <span className="pp-count">{deals.length}</span>
        </h2>
        {deals.length === 0 ? (
          <p data-tone="note">{empty}</p>
        ) : (
          <div className="pp-rows">
            {deals.map((deal) => (
              <DealRow key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}

/** The seller's home: what needs them first, then what waits on others, and disputes. */
export function Dashboard({ overview }: { overview: Overview }) {
  const { deals, problem } = overview;
  const open = (deals ?? []).filter(isOpen).sort(byUrgency);
  const disputed = open.filter((deal) => deal.dispute !== null);
  // A dispute has its own list, so it is not repeated under the person's other work.
  const mine = open.filter((deal) => needsMe(deal) && deal.dispute === null);
  const theirs = open.filter((deal) => !needsMe(deal) && deal.dispute === null);
  return (
    <div className="pp-stack">
      <header className="pp-page-head">
        <h1>Dashboard</h1>
        <ButtonLink look="primary" href="/new">
          <Icon name="plus" />
          New deal
        </ButtonLink>
      </header>
      {problem !== undefined && <Alert problem>{problem}</Alert>}
      {deals === undefined && problem === undefined && (
        <Skeleton label="Loading your deals…" lines={6} />
      )}
      {deals?.length === 0 && (
        <EmptyState>
          <p>
            No deals yet. Start one from a chat you already had: paste it, upload it or forward it,
            and PactPal drafts the agreement for you to check.
          </p>
          <ButtonLink look="primary" href="/new">
            Start your first deal
          </ButtonLink>
        </EmptyState>
      )}
      {deals !== undefined && deals.length > 0 && (
        <>
          <div className="pp-facts">
            <Field caption="Waiting for you">{mine.length}</Field>
            <Field caption="Waiting for others">{theirs.length}</Field>
            <Field caption="Open disputes">{disputed.length}</Field>
            <Field caption="Open deals">{open.length}</Field>
          </div>
          <NotificationsList
            refreshKey={deals.length}
            onOpen={(note) => {
              navigate(noteAddress(note));
            }}
          />
          <DealList title="Waiting for you" deals={mine} empty="Nothing is waiting for you." />
          {disputed.length > 0 && (
            <DealList title="Disputes" deals={disputed} empty="No open disputes." />
          )}
          <DealList
            title="Waiting for others"
            deals={theirs}
            empty="Nothing is waiting on a buyer or on PayPal."
          />
        </>
      )}
    </div>
  );
}
