import { dayWords } from "@pactpal/words";
import type { Status } from "../design/Badge";
import type { DealOverview, DealStage } from "../overview-api";

/** Each stage as people read it, and the badge it wears. */
export const STAGES: Record<DealStage, { word: string; badge: Status }> = {
  drafting: { word: "Drafting", badge: "draft" },
  awaiting_buyer: { word: "Waiting for buyer", badge: "awaiting" },
  in_progress: { word: "In progress", badge: "signed" },
  delivered: { word: "Delivered", badge: "delivered" },
  disputed: { word: "Disputed", badge: "disputed" },
  complete: { word: "Complete", badge: "paid" },
  cancelled: { word: "Cancelled", badge: "draft" },
};

/** The stages in the order a deal moves through them, for filters. */
export const STAGE_ORDER = Object.keys(STAGES) as DealStage[];

/** Whether the deal's next step is the person's own to do. */
export const needsMe = (deal: DealOverview): boolean => deal.next?.waitingOn === deal.role;

/** Still running: something is, or will be, waiting on someone. */
export const isOpen = (deal: DealOverview): boolean =>
  deal.stage !== "complete" && deal.stage !== "cancelled";

/** The other side's name, or a plain word for them. */
export function otherName(deal: DealOverview): string {
  if (deal.role === "buyer") return deal.seller?.name ?? "the seller";
  return deal.buyer?.name ?? deal.buyer?.email ?? "the buyer";
}

/** Who the deal is waiting for, in words; empty when nothing is waiting. */
export function waitingWords(deal: DealOverview): string {
  if (!deal.next) return "";
  if (needsMe(deal)) return "Waiting for you";
  return deal.next.waitingOn === "paypal" ? "Waiting for PayPal" : `Waiting for ${otherName(deal)}`;
}

/** When the next step is due, in words; empty when no day is set. */
export function dueWords(deal: DealOverview): string {
  const day = deal.next?.dueDate ?? null;
  if (day === null) return "";
  return `${deal.next?.overdue === true ? "Was due" : "Due"} ${dayWords(day)}`;
}

/** Most urgent first: overdue, then the earliest due day, then the most recently changed. */
export function byUrgency(a: DealOverview, b: DealOverview): number {
  const late = Number(b.next?.overdue ?? false) - Number(a.next?.overdue ?? false);
  if (late !== 0) return late;
  const [dueA, dueB] = [a.next?.dueDate ?? "9999", b.next?.dueDate ?? "9999"];
  if (dueA !== dueB) return dueA < dueB ? -1 : 1;
  return b.updatedAt.localeCompare(a.updatedAt);
}

/** Two letters for an avatar, from a name or an email. */
export function initials(name: string): string {
  const words = name.split(/[\s@._-]+/).filter(Boolean);
  const letters = (words[0]?.[0] ?? "?") + (words[1]?.[0] ?? "");
  return letters.toUpperCase();
}

/** The deals whose title or other side matches every word typed, for the quick switcher. */
export function matchingDeals(deals: readonly DealOverview[], typed: string): DealOverview[] {
  const words = typed.toLowerCase().split(/\s+/).filter(Boolean);
  return deals.filter((deal) => {
    const text = `${deal.title} ${otherName(deal)} ${deal.categoryLabel}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
}
