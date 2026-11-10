import { z } from "zod";
import type { Queryable } from "./database.js";

export const NOTIFICATION_KINDS = [
  "message",
  "review-requested",
  "changes-requested",
  "signed",
  "step",
  "step-news",
  "reminder",
  "agent-request",
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];

/**
 * Notifications that only tell the person something (a step approved or done, the agreement
 * signed): they are settled when the person opens the tab they point at. The rest ask the person
 * to act and stay until opened from the list ("message" is settled by reading the chat).
 */
export const NEWS_KINDS: readonly NotificationKind[] = ["signed", "step-news"];

/** The deal space's tabs a notification can open. */
export const DEAL_TABS = ["chat", "scope", "timeline", "files", "disputes", "log"] as const;
export type DealTabName = (typeof DEAL_TABS)[number];

/** The most notifications one list shows. */
export const NOTIFICATION_LIST_SIZE = 50;

export const newNotificationSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  dealId: z.uuid(),
  kind: z.enum(NOTIFICATION_KINDS),
  tab: z.enum(DEAL_TABS),
  /** Plain words shown to the person, cut to 300 characters. */
  text: z
    .string()
    .trim()
    .min(1)
    .transform((text) => (text.length > 300 ? `${text.slice(0, 299)}…` : text)),
});
export type NewNotification = z.input<typeof newNotificationSchema>;

const notificationRow = z.object({
  id: z.string(),
  userId: z.string(),
  dealId: z.string(),
  kind: z.enum(NOTIFICATION_KINDS),
  tab: z.enum(DEAL_TABS),
  text: z.string(),
  createdAt: z.date(),
  readAt: z.date().nullable(),
});
export type Notification = z.output<typeof notificationRow>;

const COLUMNS = `id, user_id AS "userId", deal_id AS "dealId", kind, tab, text,
  created_at AS "createdAt", read_at AS "readAt"`;

/**
 * Adds a notification for one person. A chat message while one is already unread for that
 * person and deal adds nothing (`created: false`), so a busy chat is one notification (and one
 * email) until they read it.
 */
export async function addNotification(
  q: Queryable,
  input: NewNotification,
  now: Date,
): Promise<{ created: boolean }> {
  const n = newNotificationSchema.parse(input);
  const rows = await q.query(
    `INSERT INTO notifications (id, user_id, deal_id, kind, tab, text, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [n.id, n.userId, n.dealId, n.kind, n.tab, n.text, now],
  );
  return { created: rows.length > 0 };
}

/** A person's newest notifications, unread first; only one deal's when `dealId` is given. */
export async function listNotifications(
  q: Queryable,
  userId: string,
  dealId?: string,
): Promise<Notification[]> {
  const rows = await q.query(
    `SELECT ${COLUMNS} FROM notifications
      WHERE user_id = $1 AND ($2::uuid IS NULL OR deal_id = $2)
      ORDER BY (read_at IS NULL) DESC, created_at DESC
      LIMIT $3`,
    [userId, dealId ?? null, NOTIFICATION_LIST_SIZE],
  );
  return rows.map((row) => notificationRow.parse(row));
}

/** Which unread notifications to mark read. */
export type NotificationsToRead =
  /** These ones. */
  | { ids: readonly string[] }
  /** All of one deal's, or only those of one kind. */
  | { dealId: string; kind?: NotificationKind }
  /** One deal's news (`NEWS_KINDS`) that points at a tab, when that tab is opened. */
  | { dealId: string; tab: DealTabName };

/** Marks a person's unread notifications read (see `NotificationsToRead`). Returns how many changed. */
export async function markNotificationsRead(
  q: Queryable,
  userId: string,
  which: NotificationsToRead,
  now: Date,
): Promise<number> {
  if ("ids" in which) {
    const rows = await q.query(
      `UPDATE notifications SET read_at = $2
        WHERE user_id = $1 AND read_at IS NULL AND id::text = ANY(string_to_array($3, ','))
        RETURNING id`,
      [userId, now, which.ids.join(",")],
    );
    return rows.length;
  }
  const kinds = "tab" in which ? NEWS_KINDS : which.kind === undefined ? null : [which.kind];
  const rows = await q.query(
    `UPDATE notifications SET read_at = $2
      WHERE user_id = $1 AND read_at IS NULL AND deal_id = $3
        AND ($4::text IS NULL OR kind = ANY(string_to_array($4, ',')))
        AND ($5::text IS NULL OR tab = $5)
      RETURNING id`,
    [userId, now, which.dealId, kinds?.join(",") ?? null, "tab" in which ? which.tab : null],
  );
  return rows.length;
}
