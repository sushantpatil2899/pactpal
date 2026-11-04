import { createDealLink, getUser, type Database, type Deal } from "@pactpal/db";
import type { EmailMessage, EmailSender } from "@pactpal/email";
import { sha256Hex } from "@pactpal/ledger";
import type { FastifyBaseLogger } from "fastify";
import { nameOf } from "../deals/parties.js";
import { dealLinkUrl } from "./deal-link-email.js";

/** What sending an email about one deal needs. `what` names the email in log lines. */
export interface DealMail {
  db: Database;
  deal: Deal;
  email: EmailSender;
  clock: () => Date;
  log: FastifyBaseLogger;
  what: string;
}

/** A fresh private link for the buyer, as an email built around it needs it. */
export interface BuyerLink {
  to: string;
  sellerName: string;
  link: string;
  linkExpiresAt: Date;
  /** Part of the email's idempotency key: a retry with the same link is one email. */
  linkKey: string;
}

const failed = ({ deal, log, what }: DealMail, error: unknown) => {
  log.error(
    { dealId: deal.id, err: error instanceof Error ? error.name : "unknown" },
    `${what} failed`,
  );
};

/**
 * Emails the buyer with a fresh private link into the deal (a new link cancels older ones).
 * The step that sent it stands whatever happens here; the result says how it went, `off`
 * when email is not set up or the server does not know its public address.
 */
export async function emailBuyerWithLink(
  mail: DealMail,
  publicBaseUrl: string | undefined,
  build: (link: BuyerLink) => EmailMessage,
): Promise<"sent" | "failed" | "off"> {
  const { db, deal, email, clock, log, what } = mail;
  if (!email.live || publicBaseUrl === undefined) return "off";
  try {
    if (deal.buyerId === undefined) return "failed";
    const [buyer, seller] = await Promise.all([
      getUser(db, deal.buyerId),
      getUser(db, deal.sellerId),
    ]);
    if (!buyer) return "failed";
    const link = await createDealLink(db, { dealId: deal.id, userId: buyer.id }, clock());
    const sent = await email.send(
      build({
        to: buyer.email,
        sellerName: nameOf(seller, "Seller"),
        link: dealLinkUrl(publicBaseUrl, link.token),
        linkExpiresAt: link.expiresAt,
        linkKey: sha256Hex(link.token).slice(0, 16),
      }),
    );
    if (!sent.ok) {
      log.warn({ dealId: deal.id, reason: sent.reason }, `${what} not sent`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    failed(mail, error);
    return "failed";
  }
}

/** Emails the seller; a failure is logged, never undoing the step that sent it. */
export async function emailSellerQuietly(
  mail: DealMail,
  build: (to: string) => EmailMessage,
): Promise<void> {
  const { db, deal, email, log, what } = mail;
  try {
    const seller = await getUser(db, deal.sellerId);
    if (!seller) return;
    const sent = await email.send(build(seller.email));
    if (!sent.ok && email.live) {
      log.warn({ dealId: deal.id, reason: sent.reason }, `${what} not sent`);
    }
  } catch (error) {
    failed(mail, error);
  }
}
