import type { LedgerEntryView } from "./api";

/** Plain words for the evidence log's event types; unknown types are shown as they are. */
const EVENT_LABELS: Record<string, string> = {
  DEAL_CREATED: "Deal created",
  BUYER_ADDED: "Buyer added",
  SOURCE_ADDED: "Source added",
  DELIVERABLE_ADDED: "Delivery file added",
  SCOPE_VERSIONED: "Agreed work saved",
  SCOPE_DRAFTED: "AI draft made",
  SCOPE_CONFIRMED: "Agreed work confirmed from an AI draft",
  ACCEPTANCE_REQUESTED: "Sent to the buyer for acceptance",
  ACCEPTANCE_WITHDRAWN: "Acceptance request withdrawn",
  ACCEPTED: "Buyer signed",
  DECLINED: "Buyer declined",
  RECEIPT_SENT: "Receipt emailed",
  INVOICE_SENT: "Invoice sent",
  PAYMENT_RECEIVED: "Payment received",
  DELIVERY_SENT: "Delivery sent",
  DELIVERY_EMAILED: "Delivery emailed to the buyer",
  DELIVERY_VIEWED: "Delivery opened",
  DELIVERY_DOWNLOADED: "File downloaded",
  MILESTONE_APPROVED: "Approved",
  CHANGE_REQUESTED: "Changes requested",
  CHANGE_ORDER_PROPOSED: "Change order proposed",
  CHANGE_ORDER_ACCEPTED: "Change order accepted",
  CHANGE_ORDER_DECLINED: "Change order declined",
  CHANGE_ORDER_WITHDRAWN: "Change order withdrawn",
  NOTE_ADDED: "Note added",
};

/** An entry's details, read defensively: the payload's shape depends on the type. */
class Fields {
  private readonly values: Record<string, unknown>;
  constructor(payload: unknown) {
    this.values =
      typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {};
  }
  number(name: string): number | undefined {
    const value = this.values[name];
    return typeof value === "number" ? value : undefined;
  }
  text(name: string): string | undefined {
    const value = this.values[name];
    return typeof value === "string" ? value : undefined;
  }
  has(name: string): boolean {
    return name in this.values;
  }
  flag(name: string): boolean {
    return this.values[name] === true;
  }
}

/** Which delivery an entry is about: its stage and its number among that stage's deliveries. */
interface DeliveryNumber {
  stage: number;
  n: number;
}

/** Where a change request stood against the revisions the agreement includes. */
function revisionWords(fields: Fields): string {
  const revision = fields.number("revision");
  if (revision === undefined) return "";
  const included = fields.number("revisionsIncluded");
  if (included === undefined) {
    return fields.has("revisionsIncluded")
      ? `, revision ${String(revision)}, no revision limit stated`
      : `, revision ${String(revision)}`;
  }
  return fields.flag("beyondIncluded")
    ? `, revision ${String(revision)}, beyond the ${String(included)} included`
    : `, revision ${String(revision)} of ${String(included)}`;
}

/** The label for entries that name no delivery: a version, a recipient or stage, or a file name. */
function plainLabel(label: string, fields: Fields): string {
  const version = fields.number("version");
  const filename = fields.text("filename");
  const to = fields.text("to");
  const stage = fields.number("stage");
  if (version !== undefined) {
    if (to === "buyer" || to === "seller") {
      return `${label} to the ${to} (version ${String(version)})`;
    }
    // A stage's entries happen under a signed agreement, whose version this is.
    return stage === undefined
      ? `${label} (version ${String(version)})`
      : `${label} for stage ${String(stage)} (agreement version ${String(version)})`;
  }
  return filename === undefined ? label : `${label}: ${filename}`;
}

/** The label for an entry about a numbered delivery, or undefined when the type names none. */
function deliveryLabel(
  type: string,
  fields: Fields,
  { stage, n }: DeliveryNumber,
): string | undefined {
  const which = `Delivery ${String(n)} for stage ${String(stage)}`;
  const version = fields.number("version");
  const agreement = version === undefined ? "" : ` (agreement version ${String(version)})`;
  const filename = fields.text("filename");
  switch (type) {
    case "DELIVERY_SENT":
      return `${which} sent${agreement}`;
    case "DELIVERY_EMAILED":
      return `${which} emailed to the buyer`;
    case "DELIVERY_VIEWED":
      return `${which} opened`;
    case "DELIVERY_DOWNLOADED":
      return filename === undefined
        ? `File downloaded (delivery ${String(n)} for stage ${String(stage)})`
        : `File downloaded: ${filename} (delivery ${String(n)} for stage ${String(stage)})`;
    case "MILESTONE_APPROVED":
      return `${which} approved${agreement}`;
    case "CHANGE_REQUESTED":
      return `Changes requested for delivery ${String(n)} of stage ${String(stage)}${revisionWords(fields)}${agreement}`;
    default:
      return undefined;
  }
}

/**
 * Plain-words labels for a deal's evidence log, in order. Deliveries are numbered per stage, in
 * log order (the log cannot be reordered), so every entry about a delivery
 * can say which one it is. Worked out for display only; nothing stored changes.
 */
export function logLabels(entries: readonly LedgerEntryView[]): string[] {
  const numbers = new Map<string, DeliveryNumber>();
  const perStage = new Map<string, number>();
  return entries.map((entry) => {
    const fields = new Fields(entry.payload);
    const deliveryId = fields.text("deliveryId");
    const version = fields.number("version");
    const stage = fields.number("stage");
    if (
      entry.type === "DELIVERY_SENT" &&
      deliveryId !== undefined &&
      version !== undefined &&
      stage !== undefined
    ) {
      // A stage is the same stage in every version (change orders only add), so deliveries
      // are numbered per stage across versions.
      const key = String(stage);
      const n = (perStage.get(key) ?? 0) + 1;
      perStage.set(key, n);
      numbers.set(deliveryId, { stage, n });
    }
    const label = EVENT_LABELS[entry.type] ?? entry.type;
    const delivery = deliveryId === undefined ? undefined : numbers.get(deliveryId);
    const aboutDelivery =
      delivery === undefined ? undefined : deliveryLabel(entry.type, fields, delivery);
    return aboutDelivery ?? plainLabel(label, fields);
  });
}
