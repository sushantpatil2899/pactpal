import { z } from "zod";
import { PayPalApiError } from "./errors.js";
import type { PayPalRestClient } from "./rest.js";

const REFERRALS_PATH = "/v2/customer/partner-referrals";
/**
 * The balances report names the account it is for. The "who is this" address
 * gives only a sign-in id with the app's own login, no payer id (7 Nov 2026).
 */
const BALANCES_PATH = "/v1/reporting/balances";

/**
 * What a seller lets PactPal do when connecting: invoices, reading disputes
 * and answering them. Nothing about payments, refunds or account details
 * (least privilege, docs/decisions.md).
 */
export const PARTNER_FEATURES = [
  "INVOICE_READ_WRITE",
  "READ_SELLER_DISPUTE",
  "UPDATE_SELLER_DISPUTE",
] as const;

export type PartnerFeature = (typeof PARTNER_FEATURES)[number];

export interface ReferralRequest {
  /** PactPal's own id for this connection attempt; PayPal gives it back when looking the seller up. */
  trackingId: string;
  /** Where PayPal sends the seller after they approve. */
  returnUrl: string;
  features: readonly PartnerFeature[];
  requestId: string;
}

export interface Referral {
  /** The "Connect with PayPal" page the seller opens. */
  actionUrl: string;
  debugId: string | undefined;
}

/** Whether a seller has finished connecting for a tracking id, and their PayPal account id once they have. */
export type MerchantLookup = { connected: false } | { connected: true; merchantId: string };

export interface MerchantStatus {
  merchantId: string;
  trackingId: string | undefined;
  /** PayPal's checks on the seller's account; undefined when PayPal did not say. */
  paymentsReceivable: boolean | undefined;
  emailConfirmed: boolean | undefined;
  /** Permission addresses the seller granted, per platform app (by its client id). */
  grants: { partnerClientId: string | undefined; scopes: string[] }[];
}

/** The request body for a connect link: third-party API permissions only, no payment products of our own. */
export function referralBody(request: Omit<ReferralRequest, "requestId">): unknown {
  return {
    tracking_id: request.trackingId,
    operations: [
      {
        operation: "API_INTEGRATION",
        api_integration_preference: {
          rest_api_integration: {
            integration_method: "PAYPAL",
            integration_type: "THIRD_PARTY",
            third_party_details: { features: [...request.features] },
          },
        },
      },
    ],
    products: ["EXPRESS_CHECKOUT"],
    legal_consents: [{ type: "SHARE_DATA_CONSENT", granted: true }],
    partner_config_override: { return_url: request.returnUrl },
  };
}

const links = z.array(z.looseObject({ href: z.string(), rel: z.string() }));

const referralAnswer = z.looseObject({ links }).transform((body, ctx) => {
  const action = body.links.find((link) => link.rel === "action_url")?.href;
  if (action === undefined) {
    ctx.addIssue({ code: "custom", message: "no action_url link" });
    return z.NEVER;
  }
  return action;
});

const ownerAnswer = z.looseObject({ account_id: z.string().min(1) });

const lookupAnswer = z.looseObject({ merchant_id: z.string().min(1).optional() }).optional();

const statusAnswer = z
  .looseObject({
    merchant_id: z.string().min(1),
    tracking_id: z.string().optional(),
    payments_receivable: z.boolean().optional(),
    primary_email_confirmed: z.boolean().optional(),
    oauth_integrations: z
      .array(
        z.looseObject({
          oauth_third_party: z
            .array(
              z.looseObject({
                partner_client_id: z.string().optional(),
                scopes: z.array(z.string()).optional(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
  })
  .transform((body): MerchantStatus => ({
    merchantId: body.merchant_id,
    trackingId: body.tracking_id,
    paymentsReceivable: body.payments_receivable,
    emailConfirmed: body.primary_email_confirmed,
    grants: (body.oauth_integrations ?? []).flatMap((integration) =>
      (integration.oauth_third_party ?? []).map((grant) => ({
        partnerClientId: grant.partner_client_id,
        scopes: grant.scopes ?? [],
      })),
    ),
  }));

const partnerPath = (partnerId: string) =>
  `/v1/customer/partners/${encodeURIComponent(partnerId)}/merchant-integrations`;

/**
 * Connecting other sellers to the platform app through PayPal's Partner
 * Referrals ("Connect with PayPal"). REST only: PayPal has no MCP tools for it.
 */
export class PayPalPartners {
  readonly #rest: Pick<PayPalRestClient, "request">;

  constructor(rest: Pick<PayPalRestClient, "request">) {
    this.#rest = rest;
  }

  /** Asks PayPal for a connect link for one seller. */
  async createReferral(request: ReferralRequest): Promise<Referral> {
    const response = await this.#rest.request({
      method: "POST",
      path: REFERRALS_PATH,
      body: referralBody(request),
      requestId: request.requestId,
      schema: referralAnswer,
    });
    return { actionUrl: response.data, debugId: response.debugId };
  }

  /** The platform account's own PayPal id (the "partner id" in the lookups below). */
  async ownAccountId(): Promise<string> {
    const response = await this.#rest.request({
      method: "GET",
      path: BALANCES_PATH,
      schema: ownerAnswer,
    });
    return response.data.account_id;
  }

  /** Finds the seller who connected with this tracking id; PayPal answers 404 until someone has. */
  async findMerchant(partnerId: string, trackingId: string): Promise<MerchantLookup> {
    try {
      const response = await this.#rest.request({
        method: "GET",
        path: partnerPath(partnerId),
        query: { tracking_id: trackingId },
        schema: lookupAnswer,
      });
      const merchantId = response.data?.merchant_id;
      return merchantId === undefined ? { connected: false } : { connected: true, merchantId };
    } catch (error) {
      if (error instanceof PayPalApiError && error.status === 404) return { connected: false };
      throw error;
    }
  }

  /** What a connected seller granted, and whether their account can be paid. */
  async merchantStatus(partnerId: string, merchantId: string): Promise<MerchantStatus> {
    const response = await this.#rest.request({
      method: "GET",
      path: `${partnerPath(partnerId)}/${encodeURIComponent(merchantId)}`,
      schema: statusAnswer,
    });
    return response.data;
  }
}
