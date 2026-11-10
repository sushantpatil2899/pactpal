import {
  getLatestScope,
  readLedger,
  type Database,
  type Deal,
  type ScopeVersion,
} from "@pactpal/db";
import { completenessScore, type Completeness } from "@pactpal/score";
import { timelineOf } from "@pactpal/timeline";
import { signedRecord } from "../payments/signed-record.js";

/** The version a deal is judged by: the signed one, or before signing the newest. */
export async function judgedScope(
  db: Database,
  deal: Deal,
): Promise<{ scope: ScopeVersion | undefined; signed: boolean }> {
  const record = await signedRecord(db, deal);
  return {
    scope: record?.scope ?? (await getLatestScope(db, deal.id)),
    signed: record !== undefined,
  };
}

/**
 * A deal's evidence completeness, worked out from its evidence log and the version it is judged
 * by on every request; never stored.
 */
export async function dealCompleteness(
  db: Database,
  deal: Deal,
  { scope, signed }: { scope: ScopeVersion | undefined; signed: boolean },
): Promise<Completeness> {
  return completenessScore({
    entries: await readLedger(db, deal.id),
    agreement: scope && {
      version: scope.version,
      stages: scope.content.milestones.length,
      exclusions: scope.content.exclusions.length,
      lines: scope.content.deliverables.length,
      markedLines: (scope.content.deliverableKinds ?? []).filter((mark) => mark !== null).length,
      signed,
      // Steps people record (7k); payments and deliveries have items of their own.
      manualSteps: timelineOf(scope.content).flatMap((step, i) =>
        step.kind === "payment" || step.kind === "delivery" ? [] : [i + 1],
      ),
    },
  });
}
