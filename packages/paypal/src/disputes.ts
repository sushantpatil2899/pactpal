import { z } from "zod";
import { DisputeActionNotAllowed, PayPalResponseError } from "./errors.js";
import { checkEvidenceFiles, type EvidenceFile } from "./evidence-files.js";
import { issueList } from "./http.js";
import { payPalAmount, toPayPalMoney, type MinorAmount } from "./money.js";
import { PayPalOperations } from "./operations.js";
import type { PayPalResult } from "./types.js";

const DISPUTES_PATH = "/v1/customer/disputes";
const PAGE_SIZE = 50;
/** Stops a runaway listing; 10 pages of 50 covers any seller in the hackathon. */
export const MAX_DISPUTE_PAGES = 10;

/**
 * One dispute as listed. Reasons, statuses and stages are kept as PayPal's
 * own text so values PayPal adds later are shown rather than rejected.
 */
export interface DisputeSummary {
  disputeId: string;
  /** e.g. "MERCHANDISE_OR_SERVICE_NOT_RECEIVED". */
  reason: string | undefined;
  /** e.g. "WAITING_FOR_SELLER_RESPONSE". */
  status: string;
  /** e.g. "REQUIRED_ACTION". */
  state: string | undefined;
  /** e.g. "INQUIRY", "CHARGEBACK". */
  stage: string | undefined;
  amount: MinorAmount | undefined;
  createdAt: string | undefined;
  updatedAt: string | undefined;
}

export interface DisputeList {
  disputes: DisputeSummary[];
  /** True when the page limit stopped the listing before the last page. */
  truncated: boolean;
}

export interface DisputeMessage {
  /** "BUYER" or "SELLER". */
  postedBy: string;
  postedAt: string | undefined;
  content: string;
}

export interface DisputeDetails extends DisputeSummary {
  channel: string | undefined;
  sellerResponseDueDate: string | undefined;
  buyerResponseDueDate: string | undefined;
  /** How a dispute is matched to its deal: the PayPal transaction and invoice. */
  transactions: {
    sellerTransactionId: string | undefined;
    buyerTransactionId: string | undefined;
    invoiceNumber: string | undefined;
  }[];
  messages: DisputeMessage[];
  /** What the seller may do now, from PayPal's action links, e.g. "provide_evidence". */
  allowedActions: string[];
  /** Offer types PayPal accepts now, e.g. "REFUND". */
  allowedOfferTypes: string[];
  /** Evidence types PayPal asks the seller for (`source: REQUESTED_FROM_SELLER`), e.g. "OTHER". */
  requestedEvidence: string[];
  outcome: string | undefined;
  /** PayPal's reason codes for its decisions (`adjudications[].reason`), e.g. "INELIGIBLE_...". */
  decisionReasons: string[];
  /** Evidence the seller sent, as PayPal lists it (`source: SUBMITTED_BY_SELLER`): type, names. */
  sellerEvidence: { type: string | undefined; documents: string[] }[];
}

const link = z.looseObject({ rel: z.string(), href: z.string().optional() });

const summaryFields = {
  dispute_id: z.string().min(1),
  reason: z.string().optional(),
  status: z.string(),
  dispute_state: z.string().optional(),
  dispute_life_cycle_stage: z.string().optional(),
  dispute_amount: payPalAmount.optional(),
  create_time: z.string().optional(),
  update_time: z.string().optional(),
};

type RawSummary = z.output<z.ZodObject<typeof summaryFields>>;

function toSummary(raw: RawSummary): DisputeSummary {
  return {
    disputeId: raw.dispute_id,
    reason: raw.reason,
    status: raw.status,
    state: raw.dispute_state,
    stage: raw.dispute_life_cycle_stage,
    amount: raw.dispute_amount,
    createdAt: raw.create_time,
    updatedAt: raw.update_time,
  };
}

const disputeSummary = z.looseObject(summaryFields).transform(toSummary);

const disputePage = z.looseObject({
  items: z.array(z.unknown()).default([]),
  links: z.array(link).default([]),
});

const disputeDetails = z
  .looseObject({
    ...summaryFields,
    dispute_channel: z.string().optional(),
    seller_response_due_date: z.string().optional(),
    buyer_response_due_date: z.string().optional(),
    disputed_transactions: z
      .array(
        z.looseObject({
          seller_transaction_id: z.string().optional(),
          buyer_transaction_id: z.string().optional(),
          invoice_number: z.string().optional(),
        }),
      )
      .default([]),
    messages: z
      .array(
        z.looseObject({
          posted_by: z.string(),
          time_posted: z.string().optional(),
          content: z.string().default(""),
        }),
      )
      .default([]),
    allowed_response_options: z
      .looseObject({
        make_offer: z.looseObject({ offer_types: z.array(z.string()).default([]) }).optional(),
      })
      .optional(),
    links: z.array(link).default([]),
    evidences: z
      .array(
        z.looseObject({
          evidence_type: z.string().optional(),
          source: z.string().optional(),
          documents: z.array(z.looseObject({ name: z.string().optional() })).default([]),
        }),
      )
      .default([]),
    adjudications: z.array(z.looseObject({ reason: z.string().optional() })).default([]),
    dispute_outcome: z.looseObject({ outcome_code: z.string().optional() }).optional(),
  })
  .transform((raw): DisputeDetails => ({
    ...toSummary(raw),
    channel: raw.dispute_channel,
    sellerResponseDueDate: raw.seller_response_due_date,
    buyerResponseDueDate: raw.buyer_response_due_date,
    transactions: raw.disputed_transactions.map((transaction) => ({
      sellerTransactionId: transaction.seller_transaction_id,
      buyerTransactionId: transaction.buyer_transaction_id,
      invoiceNumber: transaction.invoice_number,
    })),
    messages: raw.messages.map((message) => ({
      postedBy: message.posted_by,
      postedAt: message.time_posted,
      content: message.content,
    })),
    allowedActions: raw.links.map((l) => l.rel).filter((rel) => rel !== "self"),
    allowedOfferTypes: raw.allowed_response_options?.make_offer?.offer_types ?? [],
    // Only a type the dispute requests is accepted (EVIDENCE_TYPE_IS_NOT_ALLOWED otherwise).
    requestedEvidence: [
      ...new Set(
        raw.evidences.flatMap((e) =>
          e.source === "REQUESTED_FROM_SELLER" && e.evidence_type !== undefined
            ? [e.evidence_type]
            : [],
        ),
      ),
    ],
    outcome: raw.dispute_outcome?.outcome_code,
    decisionReasons: raw.adjudications.flatMap((a) => (a.reason === undefined ? [] : [a.reason])),
    sellerEvidence: raw.evidences
      .filter((e) => e.source === "SUBMITTED_BY_SELLER")
      .map((e) => ({
        type: e.evidence_type,
        documents: e.documents.flatMap((d) => (d.name === undefined ? [] : [d.name])),
      })),
  }));

type Page = z.output<typeof disputePage>;

/** Reads pages until there is no "next" link or the page limit is reached, then checks every item. */
async function collect(
  operation: string,
  fetchPage: (page: number, next: string | undefined) => Promise<Page>,
): Promise<DisputeList> {
  const items: unknown[] = [];
  let next: string | undefined;
  for (let page = 1; page <= MAX_DISPUTE_PAGES; page++) {
    const { items: pageItems, links } = await fetchPage(page, next);
    items.push(...pageItems);
    next = links.find((l) => l.rel === "next")?.href;
    if (next === undefined) return { disputes: parseItems(operation, items), truncated: false };
  }
  return { disputes: parseItems(operation, items), truncated: true };
}

function parseItems(operation: string, items: unknown[]): DisputeSummary[] {
  const parsed = z.array(disputeSummary).safeParse(items);
  if (!parsed.success) throw new PayPalResponseError(operation, issueList(parsed.error), undefined);
  return parsed.data;
}

/** Seller answers to a dispute, by the action name PayPal uses in its links. */
export type DisputeAction =
  "provide_evidence" | "make_offer" | "accept_claim" | "appeal" | "escalate" | "send_message";

/** Sandbox-only actions that stand in for PayPal's own staff; see `PayPalSandboxDisputes`. */
export type SandboxDisputeAction = "require_evidence" | "adjudicate";

export interface EvidenceInput {
  /** PayPal's evidence type, e.g. "PROOF_OF_FULFILLMENT" or "OTHER". */
  evidenceType: string;
  notes: string;
  files: readonly EvidenceFile[];
  /** Stable key so retries never send the answer twice. */
  requestId: string;
}

export interface OfferInput {
  /** Must be one of the dispute's allowed offer types, e.g. "REFUND". */
  offerType: string;
  amount: MinorAmount;
  note: string;
  requestId: string;
}

export interface EscalateInput {
  note: string;
  requestId: string;
}

export interface MessageInput {
  /** The seller's message to the buyer, as PayPal shows it in the case. */
  message: string;
  requestId: string;
}

export interface AcceptClaimInput {
  note: string;
  /** A partial refund; omitted for a full refund. */
  refundAmount?: MinorAmount;
  requestId: string;
}

/** PayPal accepted the answer; its reply only links back to the dispute. */
export interface DisputeAnswer {
  disputeId: string;
}

// PayPal answers a dispute write with links back to the dispute (or, for some sandbox
// actions, an empty body); nothing else is needed from it.
const answered = (disputeId: string) =>
  z
    .looseObject({ links: z.array(link).default([]) })
    .optional()
    .transform((): DisputeAnswer => ({ disputeId }));

// PayPal's MCP accept tool only takes a short note of letters, digits, "_" and "-".
const MCP_NOTE = /^[A-Za-z0-9_-]{1,255}$/;

/** PayPal's multipart layout: an "input" JSON part describing the evidence, then file1, file2, ... */
function evidenceForm(
  evidenceType: string,
  notes: string,
  files: readonly EvidenceFile[],
): FormData {
  const checked = checkEvidenceFiles(files);
  const input = {
    evidences: [
      {
        evidence_type: evidenceType,
        notes,
        documents: checked.map(({ filename }) => ({ name: filename })),
      },
    ],
  };
  const form = new FormData();
  form.append("input", new Blob([JSON.stringify(input)], { type: "application/json" }));
  checked.forEach(({ filename, bytes, contentType }, i) => {
    form.append(`file${i + 1}`, new Blob([new Uint8Array(bytes)], { type: contentType }), filename);
  });
  return form;
}

/**
 * The seller's disputes, read from PayPal every time. Each read tries
 * PayPal's MCP tool first and falls back to the REST API.
 *
 * Answers (evidence, offers, accepting a claim, escalating, appeals) re-read the dispute
 * first and are refused unless PayPal allows them right now, and answers to
 * the same dispute are sent one at a time.
 */
export class PayPalDisputes extends PayPalOperations {
  readonly #queues = new Map<string, Promise<unknown>>();

  /** All disputes, newest first as PayPal returns them, up to the page limit. */
  async list(): Promise<PayPalResult<DisputeList>> {
    const mcp = this.mcp;
    let debugId: string | undefined;
    return this.fallback.run({
      operation: "list disputes",
      kind: "read",
      mcp: mcp && {
        call: () =>
          collect("MCP list_disputes", async (page) =>
            disputePage.parse(await mcp.callTool("list_disputes", { page, page_size: PAGE_SIZE })),
          ),
        schema: z.custom<DisputeList>(),
      },
      rest: async () => {
        const data = await collect(`GET ${DISPUTES_PATH}`, async (_page, next) => {
          const url = next === undefined ? undefined : new URL(next);
          const response = await this.rest.request({
            method: "GET",
            path: url?.pathname ?? DISPUTES_PATH,
            query: url ? Object.fromEntries(url.searchParams) : { page_size: PAGE_SIZE },
            schema: disputePage,
          });
          debugId = response.debugId;
          return response.data;
        });
        return { data, debugId };
      },
    });
  }

  /** One dispute in full, including what the seller may do right now. */
  async get(disputeId: string): Promise<PayPalResult<DisputeDetails>> {
    return this.fallback.run({
      operation: "get dispute",
      kind: "read",
      mcp: this.mcpCall("get_dispute", disputeDetails, { dispute_id: disputeId }),
      rest: () =>
        this.rest.request({
          method: "GET",
          path: `${DISPUTES_PATH}/${encodeURIComponent(disputeId)}`,
          schema: disputeDetails,
        }),
    });
  }

  /** Sends evidence: notes plus PDF, PNG, JPEG or GIF files (checked before upload). */
  async provideEvidence(
    disputeId: string,
    input: EvidenceInput,
  ): Promise<PayPalResult<DisputeAnswer>> {
    const form = evidenceForm(input.evidenceType, input.notes, input.files);
    return this.answer(disputeId, "provide_evidence", undefined, () =>
      this.restOnly(this.post(disputeId, "provide-evidence", input.requestId, { form })),
    );
  }

  /** Offers the buyer a refund of the given type, if PayPal allows that type now. */
  async makeOffer(disputeId: string, input: OfferInput): Promise<PayPalResult<DisputeAnswer>> {
    const body = {
      note: input.note,
      offer_type: input.offerType,
      offer_amount: toPayPalMoney(input.amount),
    };
    return this.answer(disputeId, "make_offer", input.offerType, () =>
      this.restOnly(this.post(disputeId, "make-offer", input.requestId, { body })),
    );
  }

  /**
   * Accepts the claim and refunds the buyer. A full refund with a short note
   * tries PayPal's MCP tool first; otherwise only REST can do it.
   */
  async acceptClaim(
    disputeId: string,
    input: AcceptClaimInput,
  ): Promise<PayPalResult<DisputeAnswer>> {
    const body = {
      note: input.note,
      ...(input.refundAmount && { refund_amount: toPayPalMoney(input.refundAmount) }),
    };
    const mcpUsable = input.refundAmount === undefined && MCP_NOTE.test(input.note);
    return this.answer(disputeId, "accept_claim", undefined, () =>
      this.fallback.run({
        operation: "accept claim",
        kind: "write",
        mcp: mcpUsable
          ? this.mcpCall(
              "accept_dispute_claim",
              z.unknown().transform(() => ({ disputeId })),
              {
                dispute_id: disputeId,
                note: input.note,
              },
            )
          : undefined,
        rest: () => this.post(disputeId, "accept-claim", input.requestId, { body }),
      }),
    );
  }

  /**
   * Sends the buyer a message in the case (inquiry stage only). PayPal's reference names no field
   * for the text; it is sent as JSON `{ "message": ... }` (to be confirmed by the first real send).
   */
  async sendMessage(disputeId: string, input: MessageInput): Promise<PayPalResult<DisputeAnswer>> {
    const body = { message: input.message };
    return this.answer(disputeId, "send_message", undefined, () =>
      this.restOnly(this.post(disputeId, "send-message", input.requestId, { body })),
    );
  }

  /** Turns an inquiry into a PayPal claim, which PayPal then decides. */
  async escalate(disputeId: string, input: EscalateInput): Promise<PayPalResult<DisputeAnswer>> {
    const body = { note: input.note };
    return this.answer(disputeId, "escalate", undefined, () =>
      this.restOnly(this.post(disputeId, "escalate", input.requestId, { body })),
    );
  }

  /** Appeals a decision against the seller, with notes and files like evidence. */
  async appeal(disputeId: string, input: EvidenceInput): Promise<PayPalResult<DisputeAnswer>> {
    const form = evidenceForm(input.evidenceType, input.notes, input.files);
    return this.answer(disputeId, "appeal", undefined, () =>
      this.restOnly(this.post(disputeId, "appeal", input.requestId, { form })),
    );
  }

  /**
   * Runs one answer: waits for earlier answers to the same dispute, re-reads
   * the dispute, and sends only if PayPal allows the action (and offer type).
   */
  protected async answer(
    disputeId: string,
    action: DisputeAction | SandboxDisputeAction,
    offerType: string | undefined,
    send: () => Promise<PayPalResult<DisputeAnswer>>,
  ): Promise<PayPalResult<DisputeAnswer>> {
    return this.#oneAtATime(disputeId, async () => {
      const { data: dispute } = await this.get(disputeId);
      if (!dispute.allowedActions.includes(action)) {
        throw new DisputeActionNotAllowed(disputeId, action, dispute.allowedActions);
      }
      if (offerType !== undefined && !dispute.allowedOfferTypes.includes(offerType)) {
        throw new DisputeActionNotAllowed(
          disputeId,
          `${action} ${offerType}`,
          dispute.allowedOfferTypes,
        );
      }
      return send();
    });
  }

  protected post(
    disputeId: string,
    action: string,
    requestId: string,
    payload: { body: unknown } | { form: FormData },
  ) {
    return this.rest.request({
      method: "POST",
      path: `${DISPUTES_PATH}/${encodeURIComponent(disputeId)}/${action}`,
      requestId,
      schema: answered(disputeId),
      ...payload,
    });
  }

  /** Evidence, offers, escalation and appeals have no MCP tool, so they go to REST directly. */
  protected async restOnly(
    sending: Promise<{ data: DisputeAnswer; debugId: string | undefined }>,
  ): Promise<PayPalResult<DisputeAnswer>> {
    const { data, debugId } = await sending;
    return { data, transport: "rest", debugId };
  }

  async #oneAtATime<T>(disputeId: string, work: () => Promise<T>): Promise<T> {
    const previous = this.#queues.get(disputeId) ?? Promise.resolve();
    // A failed earlier answer must not block later ones, so its error is ignored here.
    const run = previous.catch(() => undefined).then(work);
    this.#queues.set(disputeId, run);
    try {
      return await run;
    } finally {
      if (this.#queues.get(disputeId) === run) this.#queues.delete(disputeId);
    }
  }
}
