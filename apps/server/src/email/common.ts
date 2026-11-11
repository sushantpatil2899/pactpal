import { SANDBOX_NOTICE } from "@pactpal/email";

/** The last line of every PactPal email (added by the templates, 9h). */
export const SANDBOX_FOOTER = SANDBOX_NOTICE;

/** A date and time in UTC as emails show it, e.g. "2 Nov 2026, 18:40" (callers add "UTC"). */
export const utcDateTime = (at: Date): string =>
  at.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });

/** What every email about one payment stage needs to say. */
export interface StageFacts {
  dealTitle: string;
  stage: number;
  stageCount: number;
  stageTitle: string;
  /** e.g. "150.00" */
  amountText: string;
  currency: string;
}

/** e.g. "stage 1 of 2" */
export const stageOf = (facts: StageFacts): string =>
  `stage ${String(facts.stage)} of ${String(facts.stageCount)}`;

/** e.g. "150.00 USD" */
export const amountOf = (facts: StageFacts): string => `${facts.amountText} ${facts.currency}`;
