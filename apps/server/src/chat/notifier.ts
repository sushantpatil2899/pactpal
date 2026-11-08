import {
  addNotification,
  type Database,
  type DealTabName,
  type Deal,
  type NotificationKind,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import type { Party } from "@pactpal/live";
import type { FastifyBaseLogger } from "fastify";
import { utcDateTime } from "../email/common.js";
import { emailBuyerWithLink, emailSellerQuietly } from "../email/deal-mail.js";
import { notificationEmail } from "../email/notification-email.js";
import type { ChatBus } from "./bus.js";

/** Something that needs one side of a deal: shown in the app and, when it says so, emailed. */
export interface PartyNotice {
  kind: NotificationKind;
  /** The tab it opens. */
  tab: DealTabName;
  /** Shown in the app's list. */
  text: string;
  /** The email's subject and opening lines; never a chat message's words. None: in the app only. */
  email?: { subject: string; lines: string[] };
}

export interface NotifierOptions {
  db: Database;
  bus: ChatBus;
  email: EmailSender;
  clock: () => Date;
  newId: () => string;
  log: FastifyBaseLogger;
  publicBaseUrl: string | undefined;
  /** Whether that side has the deal open now (a message to them is then not emailed). */
  isOnline: (dealId: string, role: Party) => boolean;
}

/**
 * Tells one side of a deal that something needs them (7e): a notification in the app, a nudge
 * to their open pages, and an email (the buyer's with a fresh private link). A chat message is
 * emailed only when they are away and have no unread message notification for the deal
 * already, so a busy chat sends one email until they read it. Nothing here can undo the step
 * that caused it: failures are logged.
 */
export class Notifier {
  constructor(private readonly options: NotifierOptions) {}

  async notify(deal: Deal, to: Party, notice: PartyNotice): Promise<void> {
    const { db, bus, clock, newId, log } = this.options;
    const userId = to === "seller" ? deal.sellerId : deal.buyerId;
    if (userId === undefined) return;
    try {
      const id = newId();
      const { created } = await addNotification(
        db,
        { id, userId, dealId: deal.id, kind: notice.kind, tab: notice.tab, text: notice.text },
        clock(),
      );
      await bus.publish({ type: "notify", userId });
      const away = !this.options.isOnline(deal.id, to);
      if (created && notice.email && (notice.kind !== "message" || away)) {
        await this.email(deal, to, notice.email, notice, id);
      }
    } catch (error) {
      log.error(
        { dealId: deal.id, err: error instanceof Error ? error.name : "unknown" },
        "Notification failed",
      );
    }
  }

  private async email(
    deal: Deal,
    to: Party,
    words: { subject: string; lines: string[] },
    notice: PartyNotice,
    id: string,
  ): Promise<void> {
    const { db, email, clock, log, publicBaseUrl } = this.options;
    if (publicBaseUrl === undefined) return;
    const mail = { db, deal, email, clock, log, what: `Notice email (${notice.kind})` };
    const base = { kind: notice.kind, subject: words.subject, lines: words.lines };
    if (to === "buyer") {
      await emailBuyerWithLink(mail, publicBaseUrl, (link) =>
        notificationEmail({
          ...base,
          to: link.to,
          link: link.link,
          linkNote: `Open the deal (private link, works until ${utcDateTime(link.linkExpiresAt)} UTC, this deal only; please do not forward it):`,
          idempotencyKey: `notice:${id}:${link.linkKey}`,
        }),
      );
      return;
    }
    await emailSellerQuietly(mail, (address) =>
      notificationEmail({
        ...base,
        to: address,
        link: `${publicBaseUrl}/deals/${deal.id}#${notice.tab}`,
        idempotencyKey: `notice:${id}`,
      }),
    );
  }
}
