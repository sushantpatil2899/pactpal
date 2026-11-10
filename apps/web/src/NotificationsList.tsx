import { useEffect, useState, type ReactNode } from "react";
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
  empty,
  onOpen,
}: {
  dealId?: string;
  refreshKey: number;
  /** Shown once the list is known to be empty; nothing by default. */
  empty?: ReactNode;
  onOpen: (note: NotificationView) => void;
}) {
  const [notes, setNotes] = useState<NotificationView[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getNotifications(dealId).then(
      (all) => {
        setNotes(all.filter((note) => !note.read));
        setLoaded(true);
      },
      () => undefined,
    );
  }, [dealId, refreshKey]);
  if (notes.length === 0) return loaded ? (empty ?? null) : null;
  const open = (note: NotificationView) => {
    setNotes((current) => current.filter((n) => n.id !== note.id));
    markNotificationsRead({ ids: [note.id] }).catch(() => undefined);
    onOpen(note);
  };
  return (
    <section aria-labelledby="notifications" className="pp-needs">
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
