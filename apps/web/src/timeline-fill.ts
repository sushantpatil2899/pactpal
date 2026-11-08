import type { TimelineStep } from "@pactpal/timeline";

/** A drafted timeline step, as the draft view gives it (7g). */
export interface DraftedStep {
  kind: TimelineStep["kind"];
  text: string;
  owner: "seller" | "buyer";
  amount: string | null;
  dueDate: string | null;
  /** The chat lines it quotes. */
  lines?: readonly number[];
}

/** A drafted buyer item, with the chat lines it quotes. */
export interface DraftedItem {
  text: string;
  dueDate?: string;
  lines?: readonly number[];
}

/** What a drafted timeline puts into the form: payment stages, buyer items and the steps. */
export interface TimelinePlan {
  /** One stage per drafted payment; undefined when the draft has no payments. */
  stages: { title: string; amount: string; dueDate?: string }[] | undefined;
  buyerProvides: { text: string; dueDate?: string }[];
  /** Undefined when the draft has no timeline (the form then implies one). */
  timeline: TimelineStep[] | undefined;
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const dated = (dueDate: string | null) => (dueDate === null ? {} : { dueDate });

/**
 * Turns a drafted timeline into the form's parts (7g): each payment becomes a payment stage, in
 * order (a single payment with no amount of its own takes the drafted price; otherwise an
 * amount the chat did not state stays blank for the seller); a "buyer provides" step points at
 * every drafted item quoting one of its chat lines (one step each), else at the item with the
 * same words, else adds one; a delivery is for the next payment after it (or the last). Nothing
 * is invented: words, dates and amounts come from the draft. Pure.
 */
export function planFromDraft(
  steps: readonly DraftedStep[],
  drafted: readonly DraftedItem[],
  price: string | undefined,
): TimelinePlan {
  const buyerProvides = drafted.map((item) => ({
    text: item.text,
    ...(item.dueDate === undefined ? {} : { dueDate: item.dueDate }),
  }));
  if (steps.length === 0) return { stages: undefined, buyerProvides, timeline: undefined };
  const payments = steps.filter((step) => step.kind === "payment");
  const stages =
    payments.length === 0
      ? undefined
      : payments.map((step) => ({
          title: step.text,
          amount: step.amount ?? (payments.length === 1 && price !== undefined ? price : ""),
          ...dated(step.dueDate),
        }));
  let paid = 0;
  const used = new Set<number>();
  /** The items a buyer step stands for: by shared chat lines, else by words, else a new one. */
  const itemsFor = (step: DraftedStep): number[] => {
    const byLines = drafted.flatMap((item, n) =>
      !used.has(n + 1) && item.lines?.some((line) => step.lines?.includes(line)) === true
        ? [n + 1]
        : [],
    );
    if (byLines.length > 0) return byLines;
    const byWords = buyerProvides.findIndex(
      (item, n) => !used.has(n + 1) && same(item.text, step.text),
    );
    if (byWords >= 0) return [byWords + 1];
    buyerProvides.push({ text: step.text, ...dated(step.dueDate) });
    return [buyerProvides.length];
  };
  const timeline = steps.flatMap((step, index): TimelineStep[] => {
    switch (step.kind) {
      case "payment":
        paid += 1;
        return [{ kind: "payment", stage: paid }];
      case "buyer-provides":
        return itemsFor(step).map((item) => {
          used.add(item);
          return { kind: "buyer-provides", item };
        });
      case "delivery": {
        const later = steps.slice(index + 1).some((s) => s.kind === "payment");
        const stage = later ? paid + 1 : Math.max(paid, 1);
        return [{ kind: "delivery", stage, text: step.text, ...dated(step.dueDate) }];
      }
      case "review":
        return [{ kind: "review", text: step.text, ...dated(step.dueDate) }];
      case "other":
        return [{ kind: "other", owner: step.owner, text: step.text, ...dated(step.dueDate) }];
    }
  });
  return { stages, buyerProvides, timeline };
}
