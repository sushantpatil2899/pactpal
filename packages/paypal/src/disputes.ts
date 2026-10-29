import { z } from "zod";
import { PayPalResponseError } from "./errors.js";
import { issueList } from "./http.js";
import { payPalAmount, type MinorAmount } from "./money.js";
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
  outcome: string | undefined;
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
    outcome: raw.dispute_outcome?.outcome_code,
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

/**
 * The seller's disputes, read from PayPal every time. Each read tries
 * PayPal's MCP tool first and falls back to the REST API.
 */
export class PayPalDisputes extends PayPalOperations {
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
}
