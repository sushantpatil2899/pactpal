/**
 * PayPal access layer: MCP first, REST as fallback.
 *
 * Each operation is attempted through a PayPal MCP tool when one exists for it
 * (Agent Toolkit or the hosted sandbox MCP server). If the tool is missing,
 * errors or times out, the same operation is retried over the REST API.
 * Operations with no MCP tool (evidence, offers, appeals, messages, webhook
 * verification) go straight to REST. Every result records which transport
 * served it so the UI can show it.
 *
 * The REST layer below (token cache, retries, response checks) is in place;
 * the operations of `PayPalClient` are built on top of it.
 */

export { SANDBOX_API_BASE_URL, Secret, type PayPalAppCredentials } from "./credentials.js";
export {
  PayPalApiError,
  PayPalMcpError,
  PayPalNetworkError,
  PayPalResponseError,
  type PayPalErrorDetail,
} from "./errors.js";
export { defaultHttpDeps, type HttpDeps } from "./http.js";
export { DEFAULT_RETRY_POLICY, type RetryPolicy } from "./retry.js";
export { AccessTokenProvider, type AccessToken, type AccessTokenOptions } from "./token.js";
export {
  PayPalRestClient,
  type ReadRequest,
  type RestClientOptions,
  type RestRequest,
  type RestResponse,
  type WriteRequest,
} from "./rest.js";
export { FEATURE_SCOPES, grantedFeatures } from "./scopes.js";
import type { InvoiceDraft } from "./invoices.js";
import type { MinorAmount, PayPalMoney } from "./money.js";
import type { PayPalResult } from "./types.js";

export type { PayPalResult, Transport } from "./types.js";
export { fromPayPalMoney, toPayPalMoney, type MinorAmount, type PayPalMoney } from "./money.js";
export {
  InvoiceSendError,
  PayPalInvoices,
  type InvoiceDetails,
  type InvoiceDraft,
  type Route,
  type SentInvoice,
} from "./invoices.js";
export {
  SANDBOX_MCP_SSE_URL,
  PayPalMcpClient,
  sseTransport,
  type McpClientOptions,
  type McpTransportFactory,
} from "./mcp.js";
export {
  DEFAULT_FALLBACK_POLICY,
  McpFallback,
  type FallbackPolicy,
  type FallbackRequest,
} from "./fallback.js";

/** Who the call is made for: the platform itself, or a connected seller. */
export type Actor = { kind: "platform" } | { kind: "seller"; merchantId: string };

export interface DisputeSummary {
  disputeId: string;
  reason: string;
  status: string;
  stage?: string;
  amount: PayPalMoney;
  sellerResponseDueDate?: string;
  /** Actions PayPal currently allows, read from the HATEOAS links. */
  allowedActions: string[];
  /** Offer types PayPal currently accepts, if an offer is allowed. */
  allowedOfferTypes: string[];
  transactionIds: string[];
}

export interface EvidenceFile {
  filename: string;
  contentType: "application/pdf" | "image/png" | "image/jpeg" | "image/gif";
  bytes: Uint8Array;
}

export interface PayPalClient {
  createAndSendInvoice(
    actor: Actor,
    draft: InvoiceDraft,
  ): Promise<PayPalResult<{ invoiceId: string }>>;
  listDisputes(actor: Actor): Promise<PayPalResult<DisputeSummary[]>>;
  getDispute(actor: Actor, disputeId: string): Promise<PayPalResult<DisputeSummary>>;
  provideEvidence(
    actor: Actor,
    disputeId: string,
    input: { evidenceType: string; notes: string; files: EvidenceFile[] },
  ): Promise<PayPalResult<{ accepted: boolean }>>;
  makeOffer(
    actor: Actor,
    disputeId: string,
    input: { offerType: string; amount: MinorAmount; note: string },
  ): Promise<PayPalResult<{ accepted: boolean }>>;
  appeal(
    actor: Actor,
    disputeId: string,
    input: { notes: string; files: EvidenceFile[] },
  ): Promise<PayPalResult<{ accepted: boolean }>>;
  verifyWebhook(
    rawBody: string,
    headers: Record<string, string>,
  ): Promise<PayPalResult<{ valid: boolean }>>;
}
