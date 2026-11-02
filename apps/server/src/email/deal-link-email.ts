import type { EmailMessage } from "@pactpal/email";

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
  const until = input.expiresAt.toISOString().slice(0, 10);
  return {
    kind: "deal-link",
    to: input.to,
    subject: `${input.sellerName} shared "${input.dealTitle}" with you on PactPal`,
    text: [
      `${input.sellerName} uses PactPal to keep a clear record of what you agree and what is delivered.`,
      "",
      `Open the deal "${input.dealTitle}":`,
      dealLinkUrl(input.publicBaseUrl, input.token),
      "",
      `This private link works until ${until} (UTC) and only opens this deal. Please do not forward it.`,
      "PactPal records when the link is used. A typed name and an IP address are not proof of identity.",
      "",
      "PactPal (sandbox). Not legal advice.",
    ].join("\n"),
  };
}
