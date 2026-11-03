import type { EventType, LedgerEntry } from "@pactpal/ledger";

/**
 * The version of the agreed work the score looks at: the signed one once the buyer has signed,
 * otherwise the newest one, so the score helps while drafting.
 */
export interface ScoredAgreement {
  version: number;
  /** How many payment stages that version has. */
  stages: number;
  /** How many exclusions (what the price does not include) it lists. */
  exclusions: number;
  signed: boolean;
}

export interface CompletenessInput {
  /** The deal's whole evidence log, in order. */
  entries: readonly LedgerEntry[];
  /** Undefined before the first version of the agreed work is saved. */
  agreement: ScoredAgreement | undefined;
}

export type ItemStatus = "helping" | "missing" | "not-measured";

export interface CompletenessItem {
  id: string;
  label: string;
  /** What the item is worth. */
  points: number;
  /** What this deal earned of it (0 for items not measured yet). */
  earned: number;
  status: ItemStatus;
  /** What was counted, for example "1 of 2 stages". */
  detail: string;
  /** What to do when the item is missing, or why it is not measured yet. */
  fix?: string;
}

export interface Completeness {
  /** The sum of earned points, out of 100. */
  score: number;
  /** The most a deal can earn today: the points of every item PactPal measures. */
  measurable: number;
  items: CompletenessItem[];
}

/** The facts the items are scored from, read once from the log. */
interface Facts {
  agreement: ScoredAgreement | undefined;
  confirmedFromDraft: boolean;
  accepted: boolean;
  receiptToBuyer: boolean;
  paid: ReadonlySet<number>;
  emailed: ReadonlySet<number>;
  downloaded: ReadonlySet<number>;
  approved: ReadonlySet<number>;
  invoiceEmails: ReadonlySet<string>;
  deliveryEmails: ReadonlySet<string>;
}

/** A payload's field, read defensively: payloads are JSON whose shape depends on the type. */
function field(entry: LedgerEntry, name: string): unknown {
  const { payload } = entry;
  return typeof payload === "object" && payload !== null && !Array.isArray(payload)
    ? payload[name]
    : undefined;
}
const numberField = (entry: LedgerEntry, name: string) => {
  const value = field(entry, name);
  return typeof value === "number" ? value : undefined;
};
const textField = (entry: LedgerEntry, name: string) => {
  const value = field(entry, name);
  return typeof value === "string" ? value : undefined;
};

function readFacts({ entries, agreement }: CompletenessInput): Facts {
  const version = agreement?.version;
  const ofVersion = (entry: LedgerEntry) =>
    version !== undefined && numberField(entry, "version") === version;
  const stageOf = (entry: LedgerEntry) => {
    const stage = numberField(entry, "stage");
    return stage !== undefined && stage >= 1 && stage <= (agreement?.stages ?? 0)
      ? stage
      : undefined;
  };
  // Deliveries of this version, by id: emails and downloads name only the delivery.
  const deliveryStage = new Map<string, number>();
  const facts = {
    agreement,
    confirmedFromDraft: false,
    accepted: false,
    receiptToBuyer: false,
    paid: new Set<number>(),
    emailed: new Set<number>(),
    downloaded: new Set<number>(),
    approved: new Set<number>(),
    invoiceEmails: new Set<string>(),
    deliveryEmails: new Set<string>(),
  };
  /** The stage of this version an entry is about, or of the delivery it names. */
  const stage = (entry: LedgerEntry) => (ofVersion(entry) ? stageOf(entry) : undefined);
  const delivery = (entry: LedgerEntry) => deliveryStage.get(textField(entry, "deliveryId") ?? "");
  const addTo = (set: Set<number>, value: number | undefined) => {
    if (value !== undefined) set.add(value);
  };
  // Only the entry types the score reads; every other type is ignored.
  const readers: Partial<Record<EventType, (entry: LedgerEntry) => void>> = {
    SCOPE_CONFIRMED: (entry) => {
      facts.confirmedFromDraft ||= ofVersion(entry);
    },
    ACCEPTED: (entry) => {
      facts.accepted ||= ofVersion(entry);
    },
    RECEIPT_SENT: (entry) => {
      facts.receiptToBuyer ||= ofVersion(entry) && textField(entry, "to") === "buyer";
    },
    INVOICE_SENT: (entry) => {
      const email = textField(entry, "recipientEmailSha256");
      if (stage(entry) !== undefined && email !== undefined) facts.invoiceEmails.add(email);
    },
    PAYMENT_RECEIVED: (entry) => {
      addTo(facts.paid, stage(entry));
    },
    DELIVERY_SENT: (entry) => {
      const id = textField(entry, "deliveryId");
      const of = stage(entry);
      if (of !== undefined && id !== undefined) deliveryStage.set(id, of);
    },
    DELIVERY_EMAILED: (entry) => {
      const email = textField(entry, "emailSha256");
      const of = delivery(entry);
      addTo(facts.emailed, of);
      if (of !== undefined && email !== undefined) facts.deliveryEmails.add(email);
    },
    DELIVERY_DOWNLOADED: (entry) => {
      if (textField(entry, "sha256") !== undefined) addTo(facts.downloaded, delivery(entry));
    },
    MILESTONE_APPROVED: (entry) => {
      addTo(facts.approved, stage(entry));
    },
  };
  for (const entry of entries) readers[entry.type]?.(entry);
  return facts;
}

type Measure = (facts: Facts) => { earned: number; detail: string; fix?: string };

/** The stages (1..n) not in a set. */
const stagesMissing = (done: ReadonlySet<number>, stages: number) =>
  Array.from({ length: stages }, (_, i) => i + 1).filter((stage) => !done.has(stage));

/** "stage 2", "stages 2 and 3", "stages 1, 2 and 3". */
function stageWords(stages: number[]): string {
  const names = stages.map(String);
  const last = names.pop() ?? "";
  return names.length === 0 ? `stage ${last}` : `stages ${names.join(", ")} and ${last}`;
}

/** An item earned stage by stage, in proportion and rounded down. */
const perStage =
  (points: number, pick: (facts: Facts) => ReadonlySet<number>, fix: (stages: string) => string) =>
  (facts: Facts) => {
    const stages = facts.agreement?.stages ?? 0;
    if (stages === 0) {
      return { earned: 0, detail: "no payment stages yet", fix: "Save the agreed work first." };
    }
    const missing = stagesMissing(pick(facts), stages);
    const done = stages - missing.length;
    return {
      earned: Math.floor((points * done) / stages),
      detail: `${String(done)} of ${String(stages)} ${stages === 1 ? "stage" : "stages"}`,
      ...(missing.length === 0 ? {} : { fix: fix(stageWords(missing)) }),
    };
  };

/** A term of the agreement itself: fixable before signing, fixed once signed. */
const termOf =
  (points: number, has: (facts: Facts) => boolean, before: string, signedWithout: string) =>
  (facts: Facts) => {
    if (has(facts)) return { earned: points, detail: "yes" };
    if (facts.agreement === undefined) {
      return { earned: 0, detail: "no agreed work yet", fix: "Save the agreed work first." };
    }
    return { earned: 0, detail: "no", fix: facts.agreement.signed ? signedWithout : before };
  };

const SIGNED_ONLY =
  "The signed agreement cannot change; only a new signed version (a change order) can add this.";

/** The items PactPal measures, worth 81 of the 100 points. */
const MEASURED: { id: string; label: string; points: number; measure: Measure }[] = [
  {
    id: "scope-citations",
    label: "Agreed work confirmed from the chat, with quotes",
    points: 10,
    measure: termOf(
      10,
      (f) => f.confirmedFromDraft,
      "Draft the agreed work from the chat and confirm it before sending it for signature.",
      SIGNED_ONLY,
    ),
  },
  {
    id: "exclusions",
    label: "What the price does not include is listed",
    points: 8,
    measure: termOf(
      8,
      (f) => (f.agreement?.exclusions ?? 0) > 0,
      "List what the price does not include before sending it for signature.",
      SIGNED_ONLY,
    ),
  },
  {
    id: "acceptance",
    label: "Buyer signed and the receipt was emailed to them",
    points: 15,
    measure: (f) => {
      const signed = f.accepted && f.agreement?.signed === true;
      const earned = (signed ? 10 : 0) + (signed && f.receiptToBuyer ? 5 : 0);
      if (!signed) {
        return {
          earned,
          detail: "not signed yet",
          fix: "Send the agreed work to the buyer to sign.",
        };
      }
      return f.receiptToBuyer
        ? { earned, detail: "signed, receipt emailed" }
        : {
            earned,
            detail: "signed, receipt not emailed to the buyer",
            fix: "Email the receipt again from the Agreement section.",
          };
    },
  },
  {
    id: "payment",
    label: "Paid through PayPal invoices",
    points: 10,
    measure: perStage(
      10,
      (f) => f.paid,
      (stages) => `Send the invoice for ${stages} through PactPal and wait for PayPal's payment.`,
    ),
  },
  {
    id: "delivery-emailed",
    label: "Delivery emailed to the buyer's recorded address",
    points: 10,
    measure: perStage(
      10,
      (f) => f.emailed,
      (stages) => `Deliver ${stages} through PactPal so it is emailed to the buyer.`,
    ),
  },
  {
    id: "delivery-access",
    label: "Buyer's downloads logged with each file's fingerprint",
    points: 12,
    measure: perStage(
      12,
      (f) => f.downloaded,
      (stages) => `Ask the buyer to download the delivery for ${stages}.`,
    ),
  },
  {
    id: "approvals",
    label: "Stages approved by the buyer",
    points: 12,
    measure: perStage(
      12,
      (f) => f.approved,
      (stages) => `Ask the buyer to approve the delivery for ${stages}.`,
    ),
  },
  {
    id: "email-match",
    label: "Delivery email matches the PayPal invoice email",
    points: 4,
    measure: (f) => {
      if (f.invoiceEmails.size === 0 || f.deliveryEmails.size === 0) {
        return {
          earned: 0,
          detail: "needs an invoice and an emailed delivery",
          fix: "Send an invoice and a delivery through PactPal.",
        };
      }
      const same = new Set([...f.invoiceEmails, ...f.deliveryEmails]).size === 1;
      return same
        ? { earned: 4, detail: "same address" }
        : {
            earned: 0,
            detail: "different addresses",
            fix: "Send invoices and deliveries to the same buyer email.",
          };
    },
  },
];

/** Items in product.md that PactPal cannot measure yet, worth the other 19 points. */
const NOT_MEASURED: { id: string; label: string; points: number; fix: string }[] = [
  {
    id: "checkable-lines",
    label: "Checkable lines (objective or process; subjective lines tied to approvals)",
    points: 12,
    fix: "Comes with the agreement editor.",
  },
  {
    id: "coverage-notice",
    label: "Coverage notice shown",
    points: 3,
    fix: "Comes with the payment guard.",
  },
  { id: "retention", label: "Retention settings in place", points: 4, fix: "Comes in Phase 8." },
];

/**
 * How complete a deal's records are, from 0 to 100, with what helps, what is missing and how to
 * fix it, and what PactPal cannot measure yet (worth 0 until it can). Worked out from the log
 * every time; never stored and never a prediction of any outcome.
 */
export function completenessScore(input: CompletenessInput): Completeness {
  const facts = readFacts(input);
  const measured: CompletenessItem[] = MEASURED.map(({ id, label, points, measure }) => {
    const { earned, detail, fix } = measure(facts);
    const status: ItemStatus = earned === points ? "helping" : "missing";
    return { id, label, points, earned, status, detail, ...(fix === undefined ? {} : { fix }) };
  });
  const later: CompletenessItem[] = NOT_MEASURED.map(({ id, label, points, fix }) => ({
    id,
    label,
    points,
    earned: 0,
    status: "not-measured",
    detail: "not measured yet",
    fix,
  }));
  return {
    score: measured.reduce((sum, item) => sum + item.earned, 0),
    measurable: MEASURED.reduce((sum, item) => sum + item.points, 0),
    items: [...measured, ...later],
  };
}
