import type { DealOverview } from "../overview-api";
import { addDays, earlierDay, laterDay } from "./days";

/** Dispute events that show the seller has put evidence together for PayPal. */
const EVIDENCE_EVENTS = ["PACKET_BUILT", "PACKET_CONFIRMED", "EVIDENCE_UPLOADED"];

/** Whether a dispute's events include any evidence the seller prepared. */
export const hasEvidence = (events: readonly { type: string }[]): boolean =>
  events.some((event) => EVIDENCE_EVENTS.includes(event.type));

export interface DeadlineRow {
  id: string;
  deal: string;
  otherSide: string;
}

export interface DeadlineEvent {
  id: string;
  dealId: string;
  /** A day (YYYY-MM-DD); every deadline is drawn on its one day. */
  day: string;
  name: string;
  /** `dispute-bare` is a dispute deadline with no evidence prepared yet. */
  kind: "due" | "late" | "dispute" | "dispute-bare";
  /** Where clicking it leads. */
  path: string;
}

export interface Deadlines {
  rows: DeadlineRow[];
  events: DeadlineEvent[];
  start: string;
  end: string;
}

const other = (deal: DealOverview): string =>
  deal.role === "buyer"
    ? (deal.seller?.name ?? "the seller")
    : (deal.buyer?.name ?? deal.buyer?.email ?? "the buyer");

/**
 * Every dated thing across the person's deals: each open deal's next step with a due day, and
 * each dispute's day to respond by. `evidence` says, per dispute id, whether evidence has been
 * prepared; a dispute missing from it is treated as not yet known and drawn as a plain dispute.
 */
export function deadlineRows(
  deals: readonly DealOverview[],
  evidence: Readonly<Record<string, boolean>>,
  today: string,
): Deadlines {
  const events: DeadlineEvent[] = [];
  for (const deal of deals) {
    if (deal.stage === "complete" || deal.stage === "cancelled") continue;
    if (deal.next && deal.next.dueDate !== null) {
      events.push({
        id: `${deal.id}-step`,
        dealId: deal.id,
        day: deal.next.dueDate,
        name: deal.next.text,
        kind: deal.next.overdue ? "late" : "due",
        path: `/deals/${deal.id}#timeline`,
      });
    }
    const respondBy = deal.dispute?.respondBy ?? null;
    if (deal.dispute && respondBy !== null) {
      const bare = evidence[deal.dispute.disputeId] === false;
      events.push({
        id: `${deal.id}-dispute`,
        dealId: deal.id,
        day: respondBy.slice(0, 10),
        name: bare ? "Respond to the dispute: no evidence prepared yet" : "Respond to the dispute",
        kind: bare ? "dispute-bare" : "dispute",
        path: `/deals/${deal.id}/disputes/${deal.dispute.disputeId}`,
      });
    }
  }
  const dated = new Set(events.map((event) => event.dealId));
  const rows = deals
    .filter((deal) => dated.has(deal.id))
    .map((deal) => ({ id: deal.id, deal: deal.title, otherSide: other(deal) }));
  let [first, last] = [today, today];
  for (const event of events) {
    first = earlierDay(first, event.day);
    last = laterDay(last, event.day);
  }
  return { rows, events, start: addDays(first, -3), end: addDays(last, 7) };
}
