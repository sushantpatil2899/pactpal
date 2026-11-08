import {
  MESSAGE_PAGE_SIZE,
  getDeal,
  listMessages,
  markNotificationsRead,
  markRead,
  readPositions,
  type Database,
} from "@pactpal/db";
import { otherParty, type Party, type ServerFrame } from "@pactpal/live";
import type { BusSignal, ChatBus } from "./bus.js";
import { chatNames, messageView } from "./chat-routes.js";

/** One open page: whose it is, on which deal, and how to reach it. */
export interface LivePage {
  dealId: string;
  userId: string;
  role: Party;
  send(frame: ServerFrame): void;
}

interface PageState {
  page: LivePage;
  /** The last message position this page has been sent. */
  sentSeq: number;
  /** The last position its person said they read. */
  readSeq: number;
  /** Sends to one page one at a time, so messages never arrive twice or out of order. */
  queue: Promise<void>;
}

export interface HubOptions {
  db: Database;
  bus: ChatBus;
  /** This server copy's id, so presence from other copies is counted apart. */
  serverId: string;
  clock: () => Date;
  log: { warn(details: object, message: string): void };
}

type Online = Record<Party, boolean>;

/**
 * The open chat pages on this server copy. It sends each page the messages it has not had yet
 * whenever the bus says a deal's chat changed, passes typing and presence to the other side's
 * pages and read changes to every page of the deal. Presence counts pages here and remembers which other copies have the
 * deal open, so a person counts as online while any page of theirs is open anywhere.
 */
export class LiveHub {
  private readonly pages = new Map<string, Set<PageState>>();
  /** For each deal and side, the other server copies with a page open. */
  private readonly remote = new Map<string, Record<Party, Set<string>>>();
  private readonly unsubscribe: () => void;

  constructor(private readonly options: HubOptions) {
    this.unsubscribe = options.bus.subscribe((signal) => {
      this.onSignal(signal);
    });
  }

  /** Adds a page, tells it where things stand and sends the messages after `afterSeq`. */
  async join(page: LivePage, afterSeq: number): Promise<() => Promise<void>> {
    const { db } = this.options;
    const state: PageState = { page, sentSeq: afterSeq, readSeq: 0, queue: Promise.resolve() };
    const firstHere = this.localCount(page.dealId, page.role) === 0;
    const set = this.pages.get(page.dealId) ?? new Set<PageState>();
    set.add(state);
    this.pages.set(page.dealId, set);
    const deal = await getDeal(db, page.dealId);
    const read = deal ? await readPositions(db, deal) : { seller: 0, buyer: 0 };
    state.readSeq = read[page.role];
    page.send({ type: "hello", role: page.role, online: this.online(page.dealId), read });
    this.push(state);
    if (firstHere) await this.announcePresence(page, true);
    return () => this.leave(state);
  }

  /** The page's person is typing (or stopped); only the other side is told. */
  async typing(page: LivePage, typing: boolean): Promise<void> {
    await this.options.bus.publish({
      type: "typing",
      dealId: page.dealId,
      role: page.role,
      typing,
    });
  }

  /** The page's person read up to `seq`; recorded, and the other side told when it moved. */
  async read(page: LivePage, seq: number): Promise<void> {
    const state = this.stateOf(page);
    const { readSeq, moved } = await markRead(
      this.options.db,
      { dealId: page.dealId, userId: page.userId, seq },
      this.options.clock(),
    );
    if (state) state.readSeq = readSeq;
    // Reading the chat settles its message notifications; the person's other pages are told.
    const settled = await markNotificationsRead(
      this.options.db,
      page.userId,
      { dealId: page.dealId, kind: "message" },
      this.options.clock(),
    );
    if (settled > 0) await this.options.bus.publish({ type: "notify", userId: page.userId });
    if (moved) {
      await this.options.bus.publish({
        type: "read",
        dealId: page.dealId,
        role: page.role,
        seq: readSeq,
      });
    }
  }

  /** Pages open on this copy, for tests and shutdown. */
  pageCount(): number {
    let count = 0;
    for (const set of this.pages.values()) count += set.size;
    return count;
  }

  close(): void {
    this.unsubscribe();
  }

  private async leave(state: PageState): Promise<void> {
    const { page } = state;
    const set = this.pages.get(page.dealId);
    set?.delete(state);
    if (set?.size === 0) this.pages.delete(page.dealId);
    // The last position read reaches the log when the page closes.
    if (state.readSeq > 0) {
      await markRead(
        this.options.db,
        { dealId: page.dealId, userId: page.userId, seq: state.readSeq, flush: true },
        this.options.clock(),
      );
    }
    if (this.localCount(page.dealId, page.role) === 0) await this.announcePresence(page, false);
  }

  private async announcePresence(page: LivePage, online: boolean): Promise<void> {
    await this.options.bus.publish({
      type: "presence",
      dealId: page.dealId,
      role: page.role,
      online,
      server: this.options.serverId,
    });
  }

  private onSignal(signal: BusSignal): void {
    switch (signal.type) {
      case "resync":
        for (const set of this.pages.values()) for (const state of set) this.push(state);
        return;
      case "messages":
        for (const state of this.pages.get(signal.dealId) ?? []) this.push(state);
        return;
      case "typing":
        this.toOtherSide(signal.dealId, signal.role, {
          type: "typing",
          role: signal.role,
          typing: signal.typing,
        });
        return;
      case "read":
        // Both sides: the reader's own pages (other tabs) count what is still new from it.
        for (const state of this.pages.get(signal.dealId) ?? []) {
          state.page.send({ type: "read", role: signal.role, seq: signal.seq });
        }
        return;
      case "presence":
        this.onPresence(signal.dealId, signal.role, signal.online, signal.server);
        return;
      case "notify":
        for (const set of this.pages.values()) {
          for (const state of set)
            if (state.page.userId === signal.userId) state.page.send({ type: "notify" });
        }
        return;
    }
  }

  private onPresence(dealId: string, role: Party, online: boolean, server: string): void {
    if (server !== this.options.serverId) {
      const remote = this.remote.get(dealId) ?? { seller: new Set(), buyer: new Set() };
      if (online) remote[role].add(server);
      else remote[role].delete(server);
      this.remote.set(dealId, remote);
    }
    this.toOtherSide(dealId, role, {
      type: "presence",
      role,
      online: this.online(dealId)[role],
    });
  }

  /** Whether that side has a page of the deal open on any server copy. */
  isOnline(dealId: string, role: Party): boolean {
    return this.online(dealId)[role];
  }

  private online(dealId: string): Online {
    const remote = this.remote.get(dealId);
    const is = (role: Party) => this.localCount(dealId, role) > 0 || (remote?.[role].size ?? 0) > 0;
    return { seller: is("seller"), buyer: is("buyer") };
  }

  private localCount(dealId: string, role: Party): number {
    return [...(this.pages.get(dealId) ?? [])].filter((state) => state.page.role === role).length;
  }

  private stateOf(page: LivePage): PageState | undefined {
    return [...(this.pages.get(page.dealId) ?? [])].find((state) => state.page === page);
  }

  private toOtherSide(dealId: string, role: Party, frame: ServerFrame): void {
    for (const state of this.pages.get(dealId) ?? []) {
      if (state.page.role === otherParty(role)) state.page.send(frame);
    }
  }

  /** Sends the page every message after the last one it has, one batch at a time. */
  private push(state: PageState): void {
    state.queue = state.queue
      .then(async () => {
        const { db } = this.options;
        const messages = await listMessages(db, state.page.dealId, state.sentSeq);
        if (messages.length === 0) return;
        const deal = await getDeal(db, state.page.dealId);
        if (!deal) return;
        const names = await chatNames(db, deal);
        state.sentSeq = messages.at(-1)?.seq ?? state.sentSeq;
        state.page.send({
          type: "messages",
          messages: messages.map((message) => messageView(message, names)),
        });
        // A page more than one batch behind gets the rest straight after.
        if (messages.length >= MESSAGE_PAGE_SIZE) this.push(state);
      })
      .catch((error: unknown) => {
        this.options.log.warn(
          { err: error instanceof Error ? error.message : "unknown" },
          "Could not send chat messages to a page",
        );
      });
  }
}
