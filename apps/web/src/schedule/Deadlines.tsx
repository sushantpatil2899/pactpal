import { BryntumScheduler, type BryntumSchedulerProps } from "@bryntum/gantt-react";
import { useEffect, useMemo, useState } from "react";
import { getDisputePage } from "../api";
import type { DealOverview } from "../overview-api";
import { navigate } from "../router/useRoute";
import { BAR_COLOURS, TODAY_LINE } from "./bar-colours";
import { addDays, daysBetween } from "./days";
import { deadlineRows, hasEvidence } from "./deadline-rows";
import "./bryntum.css";

const COLUMNS: BryntumSchedulerProps["columns"] = [
  { text: "Deal", field: "name", width: 230 },
  { text: "With", field: "otherSide", width: 130 },
];

// A deadline is one day wide, so what it is reads beside the bar.
const LABELS = { right: { field: "name" } };

/** Per open dispute, whether the seller has prepared any evidence; read from each dispute. */
function useEvidence(deals: readonly DealOverview[]): Record<string, boolean> {
  const [evidence, setEvidence] = useState<Record<string, boolean>>({});
  useEffect(() => {
    let current = true;
    for (const deal of deals) {
      const id = deal.dispute?.disputeId;
      if (id === undefined || deal.role !== "seller") continue;
      getDisputePage(deal.id, id).then(
        (page) => {
          if (current) setEvidence((known) => ({ ...known, [id]: hasEvidence(page.events) }));
        },
        () => undefined,
      );
    }
    return () => {
      current = false;
    };
  }, [deals]);
  return evidence;
}

/**
 * Every dated step and dispute deadline across the person's deals, one row per deal (Bryntum
 * Scheduler). A dispute deadline with no evidence prepared stands out. Clicking opens the deal.
 */
export function Deadlines({ deals }: { deals: DealOverview[] }) {
  const evidence = useEvidence(deals);
  const found = useMemo(
    () => deadlineRows(deals, evidence, new Date().toISOString().slice(0, 10)),
    [deals, evidence],
  );
  const resources = useMemo(
    () => found.rows.map((row) => ({ id: row.id, name: row.deal, otherSide: row.otherSide })),
    [found],
  );
  const events = useMemo(
    () =>
      found.events.map((event) => ({
        id: event.id,
        resourceId: event.dealId,
        name: event.name,
        startDate: event.day,
        endDate: addDays(event.day, 1),
        eventColor: BAR_COLOURS[event.kind],
        path: event.path,
      })),
    [found],
  );
  return (
    <div className="pp-deadlines pp-bryntum pp-vendor">
      <BryntumScheduler
        resources={resources}
        events={events}
        columns={COLUMNS}
        startDate={found.start}
        endDate={found.end}
        viewPreset={daysBetween(found.start, found.end) <= 42 ? "weekAndDayLetter" : "weekAndMonth"}
        readOnly
        autoHeight
        eventStyle="filled"
        timeRangesFeature={TODAY_LINE}
        labelsFeature={LABELS}
        rowHeight={48}
        barMargin={8}
        onEventClick={({ eventRecord }) => {
          const path: unknown = eventRecord.get("path");
          if (typeof path === "string") navigate(path);
        }}
      />
    </div>
  );
}
