import { z } from "zod";

/** The most steps one timeline may have. */
export const MAX_TIMELINE_STEPS = 60;
/** Payment stages and buyer items are numbered from 1, up to 20 each (as the agreement allows). */
const ref = z.number().int().min(1).max(20);
const text = z.string().trim().min(1).max(500);
const dueDate = z.iso.date().optional();

/**
 * One step of the agreed timeline (7f). Steps that are already part of the agreement point at
 * it: what the buyer provides (`item`, from "buyer provides") and payments (`stage`, a payment
 * stage, invoiced through PayPal). The others carry their own words: a review (the seller shares
 * something, such as a sketch, and the buyer approves it or asks for changes), a delivery for a
 * payment stage, or anything else either side does.
 */
export const timelineStepSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("buyer-provides"), item: ref }),
  z.strictObject({ kind: z.literal("review"), text, dueDate }),
  z.strictObject({ kind: z.literal("payment"), stage: ref }),
  z.strictObject({ kind: z.literal("delivery"), stage: ref, text: text.optional(), dueDate }),
  z.strictObject({
    kind: z.literal("other"),
    owner: z.enum(["seller", "buyer"]),
    text,
    dueDate,
  }),
]);
export type TimelineStep = z.output<typeof timelineStepSchema>;
export type TimelineStepKind = TimelineStep["kind"];

export const timelineSchema = z.array(timelineStepSchema).min(1).max(MAX_TIMELINE_STEPS);

/** What the timeline is checked against: the agreement's payment stages and buyer items. */
export interface TimelineParts {
  milestones: readonly { title: string; amountMinor: number; dueDate?: string | undefined }[];
  buyerProvides?: readonly { text: string; dueDate?: string | undefined }[] | undefined;
  timeline?: readonly TimelineStep[] | undefined;
}

export interface TimelineProblem {
  path: (string | number)[];
  message: string;
}

/**
 * What is wrong with a timeline, if anything: every payment stage and every buyer item must
 * appear exactly once, and every step must point at a stage or item the agreement has. A
 * delivery may appear at most once per stage. Pure.
 */
export function timelineProblems(parts: TimelineParts): TimelineProblem[] {
  const { timeline } = parts;
  if (timeline === undefined) return [];
  const problems: TimelineProblem[] = [];
  const stages = parts.milestones.length;
  const items = parts.buyerProvides?.length ?? 0;
  const seen = {
    payment: new Set<number>(),
    "buyer-provides": new Set<number>(),
    delivery: new Set<number>(),
  };
  timeline.forEach((step, n) => {
    const at = (field: string) => ["timeline", n, field];
    if (step.kind === "payment" || step.kind === "delivery") {
      if (step.stage > stages)
        problems.push({ path: at("stage"), message: "no such payment stage" });
      else if (seen[step.kind].has(step.stage)) {
        problems.push({
          path: at("stage"),
          message: `that stage's ${step.kind} is already listed`,
        });
      }
      seen[step.kind].add(step.stage);
    } else if (step.kind === "buyer-provides") {
      if (step.item > items) problems.push({ path: at("item"), message: "no such buyer item" });
      else if (seen["buyer-provides"].has(step.item)) {
        problems.push({ path: at("item"), message: "that item is already listed" });
      }
      seen["buyer-provides"].add(step.item);
    }
  });
  for (let stage = 1; stage <= stages; stage++) {
    if (!seen.payment.has(stage)) {
      problems.push({ path: ["timeline"], message: `payment stage ${String(stage)} is missing` });
    }
  }
  for (let item = 1; item <= items; item++) {
    if (!seen["buyer-provides"].has(item)) {
      problems.push({ path: ["timeline"], message: `buyer item ${String(item)} is missing` });
    }
  }
  return problems;
}

/**
 * The timeline of an agreement: its own when it has one, otherwise the one it always implied
 * (what the buyer provides, then each payment stage in order). Every reader uses this, so an
 * agreement made before timelines existed reads the same as one that lists its steps.
 */
export function timelineOf(parts: TimelineParts): TimelineStep[] {
  if (parts.timeline !== undefined) return [...parts.timeline];
  return [
    ...(parts.buyerProvides ?? []).map((_, n): TimelineStep => ({
      kind: "buyer-provides",
      item: n + 1,
    })),
    ...parts.milestones.map((_, n): TimelineStep => ({ kind: "payment", stage: n + 1 })),
  ];
}

/** Who does a step first: the buyer provides and pays; the seller shares reviews and delivers. */
export function ownerOf(step: TimelineStep): "seller" | "buyer" {
  switch (step.kind) {
    case "buyer-provides":
    case "payment":
      return "buyer";
    case "review":
    case "delivery":
      return "seller";
    case "other":
      return step.owner;
  }
}

/** A step as people read it: its number, kind, who acts first, words and due date. */
export interface ResolvedStep {
  /** 1, 2, 3 ... in timeline order. */
  n: number;
  kind: TimelineStepKind;
  owner: "seller" | "buyer";
  title: string;
  dueDate: string | null;
  /** The payment stage a payment or delivery step is for. */
  stage: number | null;
  /** A payment step's amount, in minor units. */
  amountMinor: number | null;
}

/** The timeline with each step's words, amount and date read from the agreement. Pure. */
export function resolveTimeline(parts: TimelineParts): ResolvedStep[] {
  return timelineOf(parts).map((step, index) => {
    const base = {
      n: index + 1,
      kind: step.kind,
      owner: ownerOf(step),
      stage: null,
      amountMinor: null,
    };
    switch (step.kind) {
      case "buyer-provides": {
        const item = parts.buyerProvides?.[step.item - 1];
        return { ...base, title: item?.text ?? "", dueDate: item?.dueDate ?? null };
      }
      case "payment": {
        const stage = parts.milestones[step.stage - 1];
        return {
          ...base,
          title: stage?.title ?? "",
          dueDate: stage?.dueDate ?? null,
          stage: step.stage,
          amountMinor: stage?.amountMinor ?? null,
        };
      }
      case "delivery": {
        const stage = parts.milestones[step.stage - 1];
        return {
          ...base,
          title: step.text ?? `Delivery for "${stage?.title ?? ""}"`,
          dueDate: step.dueDate ?? null,
          stage: step.stage,
        };
      }
      case "review":
      case "other":
        return { ...base, title: step.text, dueDate: step.dueDate ?? null };
    }
  });
}

/**
 * Brings a timeline in line with the agreement's counts after stages or buyer items were added
 * or removed: steps pointing past the end are dropped, and stages or items with no step are
 * added at the end, in order. Used by the editor and when a draft is used. Pure.
 */
export function syncTimeline(
  timeline: readonly TimelineStep[],
  stageCount: number,
  itemCount: number,
): TimelineStep[] {
  const kept = timeline.filter((step) => {
    if (step.kind === "payment" || step.kind === "delivery") return step.stage <= stageCount;
    if (step.kind === "buyer-provides") return step.item <= itemCount;
    return true;
  });
  const hasItem = (item: number) =>
    kept.some((s) => s.kind === "buyer-provides" && s.item === item);
  const hasPayment = (stage: number) => kept.some((s) => s.kind === "payment" && s.stage === stage);
  const missingItems = Array.from({ length: itemCount }, (_, n) => n + 1)
    .filter((item) => !hasItem(item))
    .map((item): TimelineStep => ({ kind: "buyer-provides", item }));
  const missingPayments = Array.from({ length: stageCount }, (_, n) => n + 1)
    .filter((stage) => !hasPayment(stage))
    .map((stage): TimelineStep => ({ kind: "payment", stage }));
  return [...kept, ...missingItems, ...missingPayments];
}

/** Moves step `from` (0-based) one place up (-1) or down (+1); unchanged at either end. */
export function moveStep<T>(steps: readonly T[], from: number, by: -1 | 1): T[] {
  const to = from + by;
  const next = [...steps];
  const step = next[from];
  if (step === undefined || to < 0 || to >= next.length) return next;
  next.splice(from, 1);
  next.splice(to, 0, step);
  return next;
}

/** Plain words for each kind of step. */
export const STEP_KIND_WORDS: Record<TimelineStepKind, string> = {
  "buyer-provides": "Buyer provides",
  review: "Review (seller shares, buyer approves)",
  payment: "Payment",
  delivery: "Delivery",
  other: "Other step",
};

/**
 * The steps a change adds to a signed timeline: the signed steps must stay first, in order and
 * unchanged, and new steps may follow. When neither side lists its own steps there is nothing
 * to compare (the implied timelines follow the stages and items). Undefined when the change
 * alters or removes a signed step. Pure.
 */
export function addedSteps(
  signed: TimelineParts,
  proposed: TimelineParts,
): TimelineStep[] | undefined {
  if (signed.timeline === undefined && proposed.timeline === undefined) return [];
  const before = timelineOf(signed);
  const after = timelineOf(proposed);
  if (after.length < before.length) return undefined;
  const same = before.every((step, n) => JSON.stringify(step) === JSON.stringify(after[n]));
  return same ? after.slice(before.length) : undefined;
}
