import type { EmailMessage } from "@pactpal/email";
import { emailFrom } from "./templates.js";

/** The page that opens a buyer link; the secret goes after `#`, so it never reaches the server's logs. */
export const LINK_PAGE = "/link";

export interface DealLinkEmailInput {
  publicBaseUrl: string;
  to: string;
  token: string;
  dealTitle: string;
  sellerName: string;
  expiresAt: Date;
}

/** The address a buyer opens. */
export const dealLinkUrl = (publicBaseUrl: string, token: string): string =>
  `${publicBaseUrl}${LINK_PAGE}#t=${token}`;

/** The email that sends a buyer their private link to one deal. */
export function dealLinkEmail(input: DealLinkEmailInput): EmailMessage {
  return {
    kind: "deal-link",
    to: input.to,
    ...emailFrom("deal-link", {
      sellerName: input.sellerName,
      dealTitle: input.dealTitle,
      link: dealLinkUrl(input.publicBaseUrl, input.token),
      until: input.expiresAt.toISOString().slice(0, 10),
    }),
  };
}
