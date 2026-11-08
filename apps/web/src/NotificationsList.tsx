import { useEffect, useState } from "react";
import { getNotifications, markNotificationsRead, type NotificationView } from "./chat-api";
import { when } from "./format";

/**
 * What needs the person: unread notifications, newest first, for one deal or all of them. Each
 * opens what it is about and is then marked read. `refreshKey` changes when the server says the
 * list changed (a live nudge), so it is read again.
 */
export function NotificationsList({
  dealId,
  refreshKey,
  onOpen,
}: {
  dealId?: string;
  refreshKey: number;
  onOpen: (note: NotificationView) => void;
}) {
  const [notes, setNotes] = useState<NotificationView[]>([]);
  useEffect(() => {
    getNotifications(dealId).then(
      (all) => {
        setNotes(all.filter((note) => !note.read));
      },
      () => undefined,
    );
  }, [dealId, refreshKey]);
  if (notes.length === 0) return null;
  const open = (note: NotificationView) => {
    setNotes((current) => current.filter((n) => n.id !== note.id));
    markNotificationsRead({ ids: [note.id] }).catch(() => undefined);
    onOpen(note);
  };
  return (
    <section
      aria-labelledby="notifications"
      style={{ border: "1px solid #b58900", padding: "0 0.75rem", borderRadius: 8 }}
    >
      <h3 id="notifications">Needs you ({notes.length})</h3>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {note.text} <small>({when(note.createdAt)})</small>{" "}
            <button
              type="button"
              onClick={() => {
                open(note);
              }}
            >
              Open
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
