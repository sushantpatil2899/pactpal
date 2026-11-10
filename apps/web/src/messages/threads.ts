import { dayWords } from "@pactpal/words";
import { otherName } from "../app/overview-words";
import type { DealOverview } from "../overview-api";
import type { LastMessage } from "./messages-api";

/** One deal's chat in the list: the deal, its newest message and how many are unread. */
export interface Thread {
  deal: DealOverview;
  last: LastMessage | null;
  unread: number;
  /** When it last moved: its newest message, else the deal's last change. */
  at: string;
}

/** Everyone the person deals with, each with the chats of their deals together. */
export interface Person {
  key: string;
  name: string;
  /** The buyer's email, shown to the seller; absent for a seller's name. */
  email: string | undefined;
  threads: Thread[];
  unread: number;
  at: string;
}

const personKey = (deal: DealOverview): string =>
  deal.role === "seller"
    ? `buyer:${(deal.buyer?.email ?? "").toLowerCase()}`
    : `seller:${(deal.seller?.name ?? "").toLowerCase()}`;

const newestFirst = <T extends { at: string }>(a: T, b: T) => b.at.localeCompare(a.at);

/**
 * The deals' chats grouped by the person on the other side, the most recently active person
 * first and their chats newest first. Each deal keeps its own chat; a deal with no one on the
 * other side yet has nobody to talk to and is left out. `read` names chats opened just now, whose
 * unread count the server has not caught up with.
 */
export function groupByPerson(
  deals: readonly DealOverview[],
  lasts: ReadonlyMap<string, LastMessage | null>,
  read: ReadonlySet<string> = new Set(),
): Person[] {
  const people = new Map<string, Person>();
  for (const deal of deals) {
    if (deal.role === "seller" ? !deal.buyer : !deal.seller) continue;
    const last = lasts.get(deal.id) ?? null;
    const thread: Thread = {
      deal,
      last,
      unread: read.has(deal.id) ? 0 : deal.unreadMessages,
      at: last?.at ?? deal.updatedAt,
    };
    const key = personKey(deal);
    const person = people.get(key) ?? {
      key,
      name: otherName(deal),
      email: deal.role === "seller" ? deal.buyer?.email : undefined,
      threads: [],
      unread: 0,
      at: "",
    };
    person.threads.push(thread);
    person.unread += thread.unread;
    if (thread.at > person.at) person.at = thread.at;
    people.set(key, person);
  }
  const all = [...people.values()];
  for (const person of all) person.threads.sort(newestFirst);
  return all.sort(newestFirst);
}

/** The people (and, within them, the chats) matching every word typed. */
export function matchingPeople(people: readonly Person[], typed: string): Person[] {
  const words = typed.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [...people];
  const fits = (text: string) => words.every((word) => text.toLowerCase().includes(word));
  return people.flatMap((person) => {
    const who = `${person.name} ${person.email ?? ""}`;
    if (fits(who)) return [person];
    const threads = person.threads.filter((thread) =>
      fits(`${who} ${thread.deal.title} ${thread.last?.text ?? ""}`),
    );
    return threads.length > 0 ? [{ ...person, threads }] : [];
  });
}

/** Who said the newest message, for the line under a chat in the list. */
export function lastWords(thread: Thread): string {
  const { last, deal } = thread;
  if (!last) return "No messages yet";
  if (last.role === "system") return `PactPal: ${last.text}`;
  return last.role === deal.role ? `You: ${last.text}` : last.text;
}

/** Where a chat opens: the Messages page with that deal's chat chosen. */
export const chatAddress = (dealId: string): string =>
  `/messages?deal=${encodeURIComponent(dealId)}`;

/** Where a notification leads: news about the chat opens Messages, the rest the deal's tab. */
export const noteAddress = (note: { dealId: string; tab: string }): string =>
  note.tab === "chat" ? chatAddress(note.dealId) : `/deals/${note.dealId}#${note.tab}`;

/** The chat the address names, if it is one of the person's. */
export function chosenDeal(search: string, people: readonly Person[]): string | undefined {
  const asked = new URLSearchParams(search).get("deal");
  const all = people.flatMap((person) => person.threads.map((thread) => thread.deal.id));
  return asked !== null && all.includes(asked) ? asked : undefined;
}

/** When a chat last moved, short: the time (UTC) if today, else the day. */
export function whenWords(at: string, now: Date): string {
  const day = at.slice(0, 10);
  return day === now.toISOString().slice(0, 10) ? `${at.slice(11, 16)} UTC` : dayWords(day);
}
