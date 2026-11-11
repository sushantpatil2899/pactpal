import { BryntumGantt, type BryntumGanttProps } from "@bryntum/gantt-react";
import { useMemo } from "react";
import type { StageView } from "../api";
import type { RunningStepView } from "../chat-api";
import { BAR_COLOURS, TODAY_LINE } from "./bar-colours";
import { daysBetween } from "./days";
import { ganttRows } from "./gantt-rows";
import "./bryntum.css";

const STATE_WORDS = {
  done: "Done",
  current: "Current step",
  late: "Late",
  held: "Held up by an earlier step",
  todo: "To do",
};

const COLUMNS: BryntumGanttProps["columns"] = [
  { type: "name", text: "Step", width: 150 },
  { text: "Stands", field: "note", width: 150 },
];
const LOCKED = { locked: { width: 300 } };

/** A scale that keeps the whole chain in view: days for a few weeks, weeks or months beyond. */
function presetFor(days: number): string {
  if (days <= 42) return "weekAndDayLetter";
  return days <= 200 ? "weekAndMonth" : "monthAndYear";
}

/**
 * The signed timeline as a chart (Bryntum Gantt): the steps in order, linked in a chain, so a
 * late step visibly pushes the ones after it. It only shows; steps are updated in the list below.
 */
export function DealGantt({
  steps,
  stages,
}: {
  steps: readonly RunningStepView[];
  stages: readonly StageView[];
}) {
  const rows = useMemo(
    () => ganttRows(steps, stages, new Date().toISOString().slice(0, 10)),
    [steps, stages],
  );
  const project = useMemo(
    () => ({
      // The days come from the record; Bryntum must not move them.
      tasks: rows.tasks.map((task) => ({
        id: task.id,
        name: task.name,
        startDate: task.start,
        endDate: task.end,
        manuallyScheduled: true,
        eventColor: BAR_COLOURS[task.state],
        note:
          task.state === "late" || task.state === "held"
            ? `${STATE_WORDS[task.state]}: ${task.note}`
            : task.note,
      })),
      dependencies: rows.links.map((link) => ({
        id: link.id,
        fromTask: link.from,
        toTask: link.to,
      })),
    }),
    [rows],
  );
  return (
    <div className="pp-gantt pp-bryntum pp-vendor">
      <BryntumGantt
        project={project}
        columns={COLUMNS}
        startDate={rows.start}
        endDate={rows.end}
        viewPreset={presetFor(daysBetween(rows.start, rows.end))}
        subGridConfigs={LOCKED}
        readOnly
        autoHeight
        projectLinesFeature={false}
        timeRangesFeature={TODAY_LINE}
        rowHeight={40}
        barMargin={9}
      />
    </div>
  );
}
