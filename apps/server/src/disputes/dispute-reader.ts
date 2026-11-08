import type { PayPalDisputes } from "@pactpal/paypal";

/** The PayPal reads a dispute check makes. */
export type DisputeReader = Pick<PayPalDisputes, "list" | "get">;

/** A seller's own linked app to check (6h-5): its link, its PayPal account and its reader. */
export interface LinkedDisputeAccount {
  connectionId: string;
  merchantId: string;
  disputes: DisputeReader;
}
