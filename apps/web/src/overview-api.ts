import { isObject, readChecked, type DealSummary, type Money } from "./api";

/** Where a deal stands, as the dashboard groups deals. */
export type DealStage =
  | "drafting"
  | "awaiting_buyer"
  | "in_progress"
  | "delivered"
  | "disputed"
  | "complete"
  | "cancelled";

/** The one thing a deal is waiting for. */
export interface NextStep {
  text: string;
  waitingOn: "seller" | "buyer" | "paypal";
  /** A day (YYYY-MM-DD), or null when none is set. */
  dueDate: string | null;
  overdue: boolean;
  step: number | null;
}

/** A deal with what the dashboard and the deals table show for it. */
export interface DealOverview extends DealSummary {
  updatedAt: string;
  /** The agreed total; null until there is agreed work. */
  amount: Money | null;
  stage: DealStage;
  next: NextStep | null;
  stepsDone: number;
  stepsTotal: number;
  /** Evidence completeness, 0 to 100, for the seller; never a prediction of any outcome. */
  completeness: number | null;
  unreadMessages: number;
  unreadNotifications: number;
  dispute: { disputeId: string; respondBy: string | null } | null;
}

const isOverview = (value: unknown): value is DealOverview =>
  isObject(value) &&
  typeof value.id === "string" &&
  typeof value.title === "string" &&
  typeof value.stage === "string" &&
  typeof value.updatedAt === "string" &&
  typeof value.unreadMessages === "number" &&
  typeof value.unreadNotifications === "number" &&
  typeof value.stepsDone === "number" &&
  typeof value.stepsTotal === "number" &&
  (value.next === null || (isObject(value.next) && typeof value.next.text === "string")) &&
  (value.amount === null || isObject(value.amount)) &&
  (value.completeness === null || typeof value.completeness === "number") &&
  (value.dispute === null || isObject(value.dispute));

/** Every deal the person sells or buys in, most recently changed first, in one request. */
export async function listDealOverview(): Promise<DealOverview[]> {
  const body = await readChecked(
    await fetch("/api/deals/overview"),
    (b): b is { deals: unknown[] } => isObject(b) && Array.isArray(b.deals),
    "load your deals",
  );
  return body.deals.filter(isOverview);
}
