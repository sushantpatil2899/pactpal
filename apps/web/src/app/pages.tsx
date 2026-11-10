import { lazy, Suspense, useState, type ReactNode } from "react";
import { Alert, Button, ButtonLink, Card, EmptyState, Skeleton } from "../design/parts";
import { Icon } from "../design/icons";
import { NotificationsList } from "../NotificationsList";
import type { DealStage } from "../overview-api";
import { navigate } from "../router/useRoute";
import { noteAddress } from "../messages/threads";
import { SellerAppPanel } from "../SellerAppPanel";
import { STAGES, STAGE_ORDER, byUrgency } from "./overview-words";
import { DealRow } from "./parts";
import type { Overview } from "./useOverview";

// AG Grid is large; it loads only when the Deals page opens.
const Deadlines = lazy(() =>
  import("../schedule/Deadlines").then((m) => ({ default: m.Deadlines })),
);
const Insights = lazy(() => import("./Insights").then((m) => ({ default: m.Insights })));
const DealsTable = lazy(() => import("./DealsTable").then((m) => ({ default: m.DealsTable })));

function Page({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="pp-stack">
      <header className="pp-page-head">
        <h1>{title}</h1>
        {action}
      </header>
      {children}
    </div>
  );
}

const newDeal = (
  <ButtonLink look="primary" href="/new">
    <Icon name="plus" />
    New deal
  </ButtonLink>
);

/** What every list page shows before or instead of its deals. */
function Waiting({ overview }: { overview: Overview }) {
  if (overview.problem !== undefined) return <Alert problem>{overview.problem}</Alert>;
  return overview.deals === undefined ? <Skeleton label="Loading your deals…" lines={5} /> : null;
}

/** Every deal in one table: search, filter by stage, sort by any column. */
export function DealsPage({ overview }: { overview: Overview }) {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<DealStage | "all">("all");
  const deals = overview.deals?.filter((deal) => stage === "all" || deal.stage === stage);
  return (
    <Page title="Deals" action={newDeal}>
      <div className="pp-toolbar">
        <label>
          <span className="pp-hidden">Search deals</span>
          <input
            type="search"
            placeholder="Search by title, buyer or category"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />
        </label>
        <label>
          <span className="pp-hidden">Stage</span>
          <select
            value={stage}
            onChange={(event) => {
              setStage(event.target.value as DealStage | "all");
            }}
          >
            <option value="all">All stages</option>
            {STAGE_ORDER.map((id) => (
              <option key={id} value={id}>
                {STAGES[id].word}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Waiting overview={overview} />
      {overview.deals?.length === 0 && (
        <EmptyState>
          <p>No deals yet. Each deal you start appears here with its stage and next step.</p>
          {newDeal}
        </EmptyState>
      )}
      {deals !== undefined && overview.deals?.length !== 0 && (
        <Suspense fallback={<Skeleton label="Loading the table…" lines={5} />}>
          <div className="pp-vendor">
            <DealsTable deals={deals} search={search} />
          </div>
        </Suspense>
      )}
    </Page>
  );
}

/** What is due, late or disputed across every deal, on one calendar-like chart. */
export function DeadlinesPage({ overview }: { overview: Overview }) {
  return (
    <Page title="Deadlines">
      <p className="pp-page-note">
        Each deal&apos;s next dated step, and the day to respond by on any open dispute. Red is
        late, or a dispute with no evidence prepared yet.
      </p>
      <Waiting overview={overview} />
      {overview.deals !== undefined && (
        <Suspense fallback={<Skeleton label="Loading the deadlines…" lines={5} />}>
          <Deadlines deals={overview.deals} />
        </Suspense>
      )}
    </Page>
  );
}

/** Charts of the person's own deals; the charts can be rearranged in edit mode. */
export function InsightsPage({ overview }: { overview: Overview }) {
  const [editing, setEditing] = useState(false);
  return (
    <Page
      title="Insights"
      action={
        <Button
          onClick={() => {
            setEditing(!editing);
          }}
        >
          {editing ? "Done" : "Edit charts"}
        </Button>
      }
    >
      <Waiting overview={overview} />
      {overview.deals !== undefined && (
        <Suspense fallback={<Skeleton label="Loading the charts…" lines={5} />}>
          <Insights deals={overview.deals} editing={editing} />
        </Suspense>
      )}
    </Page>
  );
}

/** Deals with an open dispute, most urgent first. */
export function DisputesPage({ overview }: { overview: Overview }) {
  const disputed = (overview.deals ?? []).filter((deal) => deal.dispute !== null).sort(byUrgency);
  return (
    <Page title="Disputes">
      <Waiting overview={overview} />
      {overview.deals !== undefined && disputed.length === 0 && (
        <EmptyState>
          <p>
            No open disputes. When a buyer opens one in PayPal, it appears here with its deadline
            and the record that answers it.
          </p>
        </EmptyState>
      )}
      {disputed.length > 0 && (
        <Card>
          <div className="pp-rows">
            {disputed.map((deal) => (
              <DealRow key={deal.id} deal={deal} />
            ))}
          </div>
        </Card>
      )}
    </Page>
  );
}

/** Everything unread that needs the person, across all deals. */
export function NotificationsPage() {
  return (
    <Page title="Needs you">
      <NotificationsList
        refreshKey={0}
        empty={
          <EmptyState>
            <p>Nothing unread. New messages, review requests and reminders appear here.</p>
          </EmptyState>
        }
        onOpen={(note) => {
          navigate(noteAddress(note));
        }}
      />
    </Page>
  );
}

/** The seller's own settings: the PayPal app their invoices and disputes go through. */
export function SettingsPage() {
  return (
    <Page title="Settings">
      <Card>
        <div>
          <SellerAppPanel />
        </div>
      </Card>
    </Page>
  );
}
