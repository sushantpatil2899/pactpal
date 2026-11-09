import {
  asStepUpdates,
  getDeal,
  listStepUpdates,
  recordReminder,
  runningDealIds,
  type Database,
} from "@pactpal/db";
import type { EmailSender } from "@pactpal/email";
import { STEP_KIND_WORDS, dueReminders, timelineOf, timelineProgress } from "@pactpal/timeline";
import { dayWords } from "@pactpal/words";
import { stepTerms } from "../deals/scope-view.js";
import { stageFacts } from "../deals/timeline-routes.js";
import { signedRecord } from "../payments/signed-record.js";
import type { LogSink } from "../log-sink.js";
import type { ChatBus } from "./bus.js";
import { Notifier } from "./notifier.js";

export interface ReminderDeps {
  db: Database;
  bus: ChatBus;
  email: EmailSender;
  publicBaseUrl: string | undefined;
  clock: () => Date;
  newId: () => string;
  log: LogSink;
}

/**
 * Sends today's timeline reminders (7l), from the 5-minute background check: for each running
 * deal, every step due within two days or late, not done and waiting for someone, gets one
 * reminder a day: a logged card in the chat, a notification and an email to whoever it waits for.
 * One deal's failure is logged and the others still run.
 */
export async function sendTimelineReminders(deps: ReminderDeps): Promise<{ sent: number }> {
  const { db, bus, clock, newId, log } = deps;
  const notifier = new Notifier({ ...deps, isOnline: () => false });
  let sent = 0;
  for (const dealId of await runningDealIds(db)) {
    try {
      const deal = await getDeal(db, dealId);
      const record = deal && (await signedRecord(db, deal));
      if (!deal || !record) continue;
      const { content } = record.scope;
      const steps = stepTerms(content, deal.currency);
      const progress = timelineProgress(
        timelineOf(content),
        asStepUpdates(await listStepUpdates(db, deal.id)),
        await stageFacts(db, deal.id),
      );
      for (const due of dueReminders(steps, progress, clock())) {
        const step = steps[due.step - 1];
        const what = step ? `${STEP_KIND_WORDS[step.kind]}: "${step.title}"` : "";
        const words = `Reminder: step ${String(due.step)} (${what}) ${due.kind === "overdue" ? "was due on" : "is due on"} ${dayWords(due.dueDate)} and is waiting for the ${due.to}.`;
        const { created } = await recordReminder(
          db,
          { ...due, dealId: deal.id, cardId: newId(), words },
          clock(),
        );
        if (!created) continue;
        sent += 1;
        await bus.publish({ type: "messages", dealId: deal.id });
        await notifier.notify(deal, due.to, {
          kind: "reminder",
          tab: "timeline",
          text: words,
          email: {
            subject: `Reminder: "${deal.title}", step ${String(due.step)}`,
            lines: [words, "Open the deal's timeline to see what is needed."],
          },
        });
      }
    } catch (error) {
      log.error(
        { dealId, err: error instanceof Error ? error.name : "unknown" },
        "Timeline reminders failed for a deal",
      );
    }
  }
  if (sent > 0) log.info({ sent }, "Timeline reminders sent");
  return { sent };
}
