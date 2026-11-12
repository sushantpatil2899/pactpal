import { getDispute, type Database } from "@pactpal/db";
import type { SecretBox } from "@pactpal/net";
import {
  DisputeActionNotAllowed,
  type DisputeParty,
  type PayPalSandboxDisputes,
} from "@pactpal/paypal";
import { randomUUID } from "node:crypto";
import { connectSandboxApp } from "./connect-app.js";
import { LinkedApps, disputeWriters, type ConnectApp } from "./linked-apps.js";

/** What asking PayPal's sandbox to decide a dispute came to. */
export type SettleResult =
  { kind: "asked" } | { kind: "not-allowed" } | { kind: "failed"; reason: string };

/** Settles one sandbox dispute in a side's favour (the demo seed, 9b-2c). */
export type SandboxSettle = (disputeId: string, winner: DisputeParty) => Promise<SettleResult>;

type Settler = Pick<PayPalSandboxDisputes, "adjudicate">;
const canSettle = (client: object): client is Settler =>
  typeof Reflect.get(client, "adjudicate") === "function";

/**
 * PayPal's sandbox "settle dispute" step, made through the seller app the disputed stage was
 * invoiced from (its keys stay sealed in the database), as PayPal's staff would decide it. Only the
 * demo seed uses it, and PayPal accepts it only in the sandbox.
 */
export function sandboxSettler(
  db: Database,
  box: SecretBox,
  connect: ConnectApp = connectSandboxApp,
  newId: () => string = randomUUID,
): SandboxSettle {
  const writerFor = disputeWriters(undefined, new LinkedApps(db, box, connect));
  return async (disputeId, winner) => {
    const dispute = await getDispute(db, disputeId);
    const writer = dispute && (await writerFor(db, dispute));
    if (!writer || !canSettle(writer)) {
      return { kind: "failed", reason: "no linked seller app answers this dispute" };
    }
    try {
      await writer.adjudicate(disputeId, winner, newId());
      return { kind: "asked" };
    } catch (error) {
      if (error instanceof DisputeActionNotAllowed) return { kind: "not-allowed" };
      return { kind: "failed", reason: error instanceof Error ? error.name : "unknown error" };
    }
  };
}
