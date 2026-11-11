import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "../design/icons";
import type { DealOverview } from "../overview-api";
import { navigate } from "../router/useRoute";
import { HELP_URL } from "../shell/contact";
import { matchingDeals, otherName, waitingWords } from "./overview-words";

const PLACES = [
  { path: "/", title: "Dashboard" },
  { path: "/deals", title: "Deals" },
  { path: "/messages", title: "Messages" },
  { path: "/new", title: "New deal" },
  { path: "/notifications", title: "Needs you" },
  { path: "/disputes", title: "Disputes" },
  { path: "/deadlines", title: "Deadlines" },
  { path: "/insights", title: "Insights" },
  { path: "/settings", title: "Settings" },
  { path: "/settings#agent", title: "Connect your AI agent" },
  { path: HELP_URL, title: "Help" },
];

/**
 * The quick switcher: ⌘K (Ctrl+K) or its button opens it; type to find a deal or a section, move
 * with the arrow keys, press Enter to go. Escape closes it.
 */
export function CommandPalette({ deals }: { deals: readonly DealOverview[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [typed, setTyped] = useState("");
  const [at, setAt] = useState(0);

  const open = () => {
    setTyped("");
    setAt(0);
    dialog.current?.showModal();
  };
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const word = typed.trim().toLowerCase();
  const items = [
    ...matchingDeals(deals, typed).map((deal) => ({
      path: `/deals/${deal.id}`,
      title: deal.title,
      note: [otherName(deal), waitingWords(deal)].filter(Boolean).join(" · "),
    })),
    ...PLACES.filter((place) => place.title.toLowerCase().includes(word)).map((place) => ({
      ...place,
      note: "Section",
    })),
  ].slice(0, 12);

  const go = (path: string) => {
    dialog.current?.close();
    // Help is its own site, opened beside the app.
    if (/^https?:/.test(path)) window.open(path, "_blank", "noopener");
    else navigate(path);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    const chosen = items[at];
    if (step !== undefined && items.length > 0) {
      event.preventDefault();
      setAt((at + step + items.length) % items.length);
    } else if (event.key === "Enter" && chosen) {
      event.preventDefault();
      go(chosen.path);
    }
  };

  return (
    <>
      <button type="button" className="pp-jump" onClick={open} data-tip="Jump to a deal  ⌘K">
        <Icon name="search" />
        <span>Jump to a deal</span>
        <kbd>⌘K</kbd>
      </button>
      <dialog ref={dialog} className="pp-palette" aria-label="Jump to a deal or a section">
        <input
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={items[at] ? `palette-${String(at)}` : undefined}
          aria-label="Find a deal or a section"
          placeholder="Find a deal or a section"
          value={typed}
          onChange={(event) => {
            setTyped(event.target.value);
            setAt(0);
          }}
          onKeyDown={onKeyDown}
        />
        <ul id="palette-list" role="listbox" aria-label="Results">
          {items.map((item, index) => (
            <li
              key={item.path}
              id={`palette-${String(index)}`}
              role="option"
              aria-selected={index === at}
              onClick={() => {
                go(item.path);
              }}
              onMouseEnter={() => {
                setAt(index);
              }}
            >
              <strong>{item.title}</strong>
              <small>{item.note}</small>
            </li>
          ))}
          {items.length === 0 && <li className="pp-palette-none">Nothing matches.</li>}
        </ul>
      </dialog>
    </>
  );
}
