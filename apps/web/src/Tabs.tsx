import { useCallback, useEffect, useState, type KeyboardEvent, type ReactNode } from "react";
import { tabForKey, tabFromHash } from "./tab-address";

export interface TabDefinition {
  id: string;
  label: string;
}

/** The open tab, kept in the address (`#scope`) so links and the back button reach it. */
export function useTabInAddress<T extends string>(
  allowed: readonly T[],
  fallback: T,
): [T, (tab: T) => void] {
  const [tab, setTab] = useState<T>(() => tabFromHash(window.location.hash, allowed, fallback));
  useEffect(() => {
    const onHash = () => {
      setTab(tabFromHash(window.location.hash, allowed, fallback));
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
    };
  }, [allowed, fallback]);
  const open = useCallback((next: T) => {
    setTab(next);
    window.history.replaceState(null, "", `#${next}`);
  }, []);
  return [tab, open];
}

/** A row of tabs, used with the arrow keys as well as by clicking. */
export function Tabs<T extends string>({
  tabs,
  current,
  onChange,
  label,
}: {
  tabs: readonly (TabDefinition & { id: T })[];
  current: T;
  onChange: (tab: T) => void;
  label: string;
}) {
  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next = tabForKey(
      event.key,
      tabs.map((tab) => tab.id),
      current,
    );
    if (next === undefined) return;
    event.preventDefault();
    onChange(next);
    document.getElementById(`tab-${next}`)?.focus();
  };
  return (
    <div
      role="tablist"
      aria-label={label}
      style={{ display: "flex", flexWrap: "wrap", gap: 4, borderBottom: "1px solid #ccc" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          type="button"
          role="tab"
          aria-selected={tab.id === current}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === current ? 0 : -1}
          onClick={() => {
            onChange(tab.id);
          }}
          onKeyDown={onKey}
          style={{ fontWeight: tab.id === current ? "bold" : "normal" }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/** One tab's content; kept on the page while hidden, so what was typed there survives. */
export function TabPanel({
  id,
  current,
  children,
}: {
  id: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <div role="tabpanel" id={`panel-${id}`} aria-labelledby={`tab-${id}`} hidden={id !== current}>
      {children}
    </div>
  );
}
