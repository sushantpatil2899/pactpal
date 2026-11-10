import { useEffect, useState } from "react";
import { getScope, type ScopeView } from "../api";
import { getTimeline, type TimelineView } from "../chat-api";

export interface DealTimeline {
  /** Undefined while loading. */
  timeline: TimelineView | undefined;
  /** Null when no agreement is written yet. */
  scope: ScopeView | null | undefined;
}

/** The deal's steps, read again whenever `refreshKey` changes. */
export function useDealTimeline(dealId: string, refreshKey: number): DealTimeline {
  const [state, setState] = useState<DealTimeline>({ timeline: undefined, scope: undefined });
  useEffect(() => {
    let current = true;
    const scope = getScope(dealId).catch(() => null);
    Promise.all([getTimeline(dealId), scope]).then(
      ([timeline, found]) => {
        if (current) setState({ timeline, scope: found });
      },
      () => undefined,
    );
    return () => {
      current = false;
    };
  }, [dealId, refreshKey]);
  return state;
}
