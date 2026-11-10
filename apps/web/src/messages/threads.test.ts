import { describe, expect, it } from "vitest";
import type { DealOverview } from "../overview-api";
import type { LastMessage } from "./messages-api";
import {
  chatAddress,
  chosenDeal,
  groupByPerson,
  lastWords,
  matchingPeople,
  noteAddress,
  whenWords,
} from "./threads";

const deal = (over: Partial<DealOverview> & { id: string }): DealOverview => ({
  title: "Logo",
  kind: "service",
  category: "art_design",
  categoryLabel: "Art and design",
  currency: "USD",
  status: "active",
  createdAt: "2026-11-01T09:00:00Z",
  hasBuyer: true,
  role: "seller",
  buyer: { name: "Chris Okafor", email: "chris@example.com" },
  updatedAt: "2026-11-01T10:00:00Z",
  amount: null,
  stage: "in_progress",
  next: null,
  stepsDone: 0,
  stepsTotal: 0,
  completeness: null,
  unreadMessages: 0,
  unreadNotifications: 0,
  dispute: null,
  ...over,
});
const said = (text: string, at: string, role: LastMessage["role"] = "buyer"): LastMessage => ({
  seq: 1,
  role,
  kind: role === "system" ? "notice" : "text",
  text,
  at,
});

const cover = deal({ id: "a", title: "Book cover", unreadMessages: 2 });
const blog = deal({
  id: "b",
  title: "Blog translation",
  buyer: { name: "Chris Okafor", email: "CHRIS@example.com" },
});
const logo = deal({
  id: "c",
  title: "Logo refresh",
  buyer: { name: null, email: "dan@example.com" },
});
const draft = deal({ id: "d", title: "Icons", buyer: null, hasBuyer: false });
const lasts = new Map([
  ["a", said("Love the sketch", "2026-11-09T10:00:00Z")],
  ["b", said("Thanks!", "2026-11-10T09:00:00Z", "seller")],
  ["c", null],
]);

describe("conversations grouped by person", () => {
  it("puts one person's deals together, the most recently active person and chat first", () => {
    const people = groupByPerson([cover, blog, logo, draft], lasts);
    expect(people.map((p) => p.name)).toEqual(["Chris Okafor", "dan@example.com"]);
    expect(people[0]?.threads.map((t) => t.deal.id)).toEqual(["b", "a"]);
    expect(people[0]?.unread).toBe(2);
    expect(people[0]?.email).toBe("chris@example.com");
    // A chat with no messages yet counts from the deal's last change.
    expect(people[1]?.at).toBe(logo.updatedAt);
  });

  it("leaves out a deal with nobody on the other side, and clears chats opened just now", () => {
    const people = groupByPerson([cover, draft], lasts, new Set(["a"]));
    expect(people).toHaveLength(1);
    expect(people[0]?.unread).toBe(0);
  });

  it("groups a buyer's deals by their seller", () => {
    const bought = deal({ id: "e", role: "buyer", buyer: null, seller: { name: "Maya Lin" } });
    expect(groupByPerson([bought], new Map())[0]).toMatchObject({
      name: "Maya Lin",
      email: undefined,
    });
  });

  it("finds people by name or email, and chats by title or message", () => {
    const people = groupByPerson([cover, blog, logo], lasts);
    expect(matchingPeople(people, "").length).toBe(2);
    expect(matchingPeople(people, "dan").map((p) => p.name)).toEqual(["dan@example.com"]);
    const sketch = matchingPeople(people, "sketch");
    expect(sketch.map((p) => p.threads.map((t) => t.deal.id))).toEqual([["a"]]);
    expect(matchingPeople(people, "nothing like this")).toEqual([]);
  });
});

describe("the words and addresses of a chat", () => {
  it("says who wrote the newest message", () => {
    const [chris] = groupByPerson([cover, blog], lasts);
    expect(chris?.threads.map(lastWords)).toEqual(["You: Thanks!", "Love the sketch"]);
    const notice = { deal: cover, last: said("Chris signed", "x", "system"), unread: 0, at: "x" };
    expect(lastWords(notice)).toBe("PactPal: Chris signed");
    expect(lastWords({ ...notice, last: null })).toBe("No messages yet");
  });

  it("opens chat news in Messages and other news on the deal's tab", () => {
    expect(chatAddress("a b")).toBe("/messages?deal=a%20b");
    expect(noteAddress({ dealId: "a", tab: "chat" })).toBe("/messages?deal=a");
    expect(noteAddress({ dealId: "a", tab: "timeline" })).toBe("/deals/a#timeline");
  });

  it("takes the chosen chat from the address only when it is one of the person's", () => {
    const people = groupByPerson([cover, blog], lasts);
    expect(chosenDeal("?deal=a", people)).toBe("a");
    expect(chosenDeal("?deal=zzz", people)).toBeUndefined();
    expect(chosenDeal("", people)).toBeUndefined();
  });

  it("gives the time for today and the day otherwise", () => {
    const now = new Date("2026-11-10T15:00:00Z");
    expect(whenWords("2026-11-10T08:05:00Z", now)).toBe("08:05 UTC");
    expect(whenWords("2026-11-09T08:05:00Z", now)).toMatch(/9 Nov/);
  });
});
