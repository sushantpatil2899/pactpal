import type { DealOverview } from "../overview-api";
import { STAGES, needsMe, otherName } from "./overview-words";

/** One deal as a flat row, the shape charts and pivots read. */
export interface InsightRow {
  id: string;
  deal: string;
  otherSide: string;
  category: string;
  stage: string;
  waitingOn: string;
  timing: string;
  /** The agreed total in whole units of `currency`; null until there is agreed work. */
  amount: number | null;
  currency: string;
  /** Completeness of the deal's records, 0 to 100; never a prediction of any outcome. */
  records: number | null;
  stepsDone: number;
  stepsTotal: number;
  unread: number;
  /** The day the deal last changed (YYYY-MM-DD). */
  changed: string;
}

function waitingOn(deal: DealOverview): string {
  if (!deal.next) return "Nobody";
  if (needsMe(deal)) return "You";
  return deal.next.waitingOn === "paypal" ? "PayPal" : "The other side";
}

function timing(deal: DealOverview): string {
  const day = deal.next?.dueDate ?? null;
  if (day === null) return "No due day";
  return deal.next?.overdue === true ? "Overdue" : "On time";
}

/** The deals as rows for the Insights page. */
export function insightRows(deals: readonly DealOverview[]): InsightRow[] {
  return deals.map((deal) => ({
    id: deal.id,
    deal: deal.title,
    otherSide: otherName(deal),
    category: deal.categoryLabel,
    stage: STAGES[deal.stage].word,
    waitingOn: waitingOn(deal),
    timing: timing(deal),
    amount: deal.amount === null ? null : deal.amount.minor / 100,
    currency: deal.currency,
    records: deal.completeness,
    stepsDone: deal.stepsDone,
    stepsTotal: deal.stepsTotal,
    unread: deal.unreadMessages + deal.unreadNotifications,
    changed: deal.updatedAt.slice(0, 10),
  }));
}
