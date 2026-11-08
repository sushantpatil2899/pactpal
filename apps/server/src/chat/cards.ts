import { postNotice, type ChatNotice, type Database, type Deal } from "@pactpal/db";
import type { Party } from "@pactpal/live";
import type { FastifyBaseLogger } from "fastify";
import type { ChatBus } from "./bus.js";
import type { Notifier, PartyNotice } from "./notifier.js";

/** What a card says and who it is for. */
export interface Card {
  /** The side that needs to know (the other side of whoever acted). */
  to: Party;
  notice: ChatNotice;
  /** The words shown in the chat and in the notification. */
  body: string;
  /** The log entry the card announces. */
  ledgerSeq?: number;
  /** How the notification reads and opens; `email` only where no other email goes out. */
  notification: Omit<PartyNotice, "text">;
}

/**
 * PactPal's cards in a deal's chat (7j, 7k, 7l): a card is posted in the chat, open pages are
 * told at once, and the other side gets a notification. A card announces a step that has already
 * happened and is logged; if posting it fails, the step stands and the failure is logged.
 */
export class DealCards {
  constructor(
    private readonly options: {
      db: Database;
      bus: ChatBus;
      notifier: Notifier;
      clock: () => Date;
      newId: () => string;
      log: FastifyBaseLogger;
    },
  ) {}

  async post(deal: Deal, card: Card): Promise<void> {
    const { db, bus, notifier, clock, newId, log } = this.options;
    try {
      await db.transaction((tx) =>
        postNotice(
          tx,
          {
            id: newId(),
            dealId: deal.id,
            body: card.body,
            notice: card.notice,
            ...(card.ledgerSeq === undefined ? {} : { ledgerSeq: card.ledgerSeq }),
          },
          clock(),
        ),
      );
      await bus.publish({ type: "messages", dealId: deal.id });
    } catch (error) {
      log.error(
        { dealId: deal.id, err: error instanceof Error ? error.name : "unknown" },
        "Chat card failed",
      );
    }
    await notifier.notify(deal, card.to, { ...card.notification, text: card.body });
  }
}
