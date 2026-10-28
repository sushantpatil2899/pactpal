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
 * Interface only for now; implementations come once the sandbox is reachable.
 */

export { SANDBOX_API_BASE_URL, Secret, type PayPalAppCredentials } from "./credentials.js";

export type Transport = "mcp" | "rest";

export interface PayPalResult<T> {
  data: T;
  transport: Transport;
  /** Set when MCP was tried first and REST had to take over. */
  fallbackReason?: string;
  /** PayPal-Debug-Id header from REST responses, for support threads. */
  debugId?: string;
}

/** Who the call is made for: the platform itself, or a connected seller. */
export type Actor = { kind: "platform" } | { kind: "seller"; merchantId: string };

export interface Money {
  currency_code: string;
  value: string;
}

export interface InvoiceDraft {
  recipientEmail: string;
  amount: Money;
  description: string;
  /** Scope version id and hash, written into the invoice note and terms. */
  scopeReference: string;
  /** Stable key so retries never create duplicate invoices. */
  requestId: string;
}

export interface DisputeSummary {
  disputeId: string;
  reason: string;
  status: string;
  stage?: string;
  amount: Money;
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
    input: { offerType: string; amount: Money; note: string },
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
