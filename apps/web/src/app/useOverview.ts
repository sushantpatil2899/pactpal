import { useEffect, useState } from "react";
import { listDealOverview, type DealOverview } from "../overview-api";

export interface Overview {
  /** Undefined while the first answer is on its way. */
  deals: DealOverview[] | undefined;
  problem: string | undefined;
}

/**
 * The seller's deals with what the rail and the dashboard show for each. Read again whenever
 * `refreshKey` changes (the page changed), keeping the last answer on screen meanwhile.
 */
export function useOverview(enabled: boolean, refreshKey: string): Overview {
  const [overview, setOverview] = useState<Overview>({ deals: undefined, problem: undefined });
  useEffect(() => {
    if (!enabled) return;
    let current = true;
    listDealOverview().then(
      (deals) => {
        if (current) setOverview({ deals, problem: undefined });
      },
      (error: unknown) => {
        const problem = error instanceof Error ? error.message : "Could not load your deals.";
        if (current) setOverview((last) => ({ deals: last.deals, problem }));
      },
    );
    return () => {
      current = false;
    };
  }, [enabled, refreshKey]);
  return overview;
}
