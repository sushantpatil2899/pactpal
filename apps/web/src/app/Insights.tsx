import { studioTheme, type AgReportState, type AgStudioProperties } from "ag-studio";
import { AgStudio } from "ag-studio-react";
import { useMemo, useRef } from "react";
import { Button } from "../design/parts";
import { DARK, LIGHT, SHARED } from "../design/tokens";
import { useDark } from "../design/useDark";
import type { DealOverview } from "../overview-api";
import { giveAgLicence } from "./ag-licence";
import { STARTING_REPORT, dealsSource } from "./insight-report";
import { insightRows } from "./insight-rows";

giveAgLicence();

const SAVED = "pactpal-insights-1";
const NARROW = 900;
const PANELS: AgStudioProperties["panels"] = {
  view: { right: ["filters"] },
  edit: { right: ["edit", "data"] },
};
// Below this canvas width the charts stack in one column.
const STACKED: AgStudioProperties["responsiveLayoutBreakpoints"] = [
  {
    maxWidth: 640,
    layout: (widgets, { columns }) => {
      let yTrack = 0;
      return widgets.map(({ layout }) => {
        const placed = { xTrack: 0, yTrack, xSpan: columns, ySpan: layout.ySpan };
        yTrack += layout.ySpan;
        return placed;
      });
    },
  },
];

/** The person's own arrangement of the charts, kept in this browser; else the starting one. */
function savedReport(): AgReportState {
  try {
    const stored = window.localStorage.getItem(SAVED);
    if (stored !== null) return JSON.parse(stored) as AgReportState;
  } catch {
    // Blocked or unreadable storage: show the starting charts.
  }
  // On a narrow screen the filters start folded away, so the charts have the room.
  return window.innerWidth < NARROW
    ? { ...STARTING_REPORT, panels: { filters: { collapsed: true } } }
    : STARTING_REPORT;
}

function keep(report: AgReportState | undefined): void {
  try {
    if (report) window.localStorage.setItem(SAVED, JSON.stringify(report));
    else window.localStorage.removeItem(SAVED);
  } catch {
    // The arrangement still holds for this visit.
  }
}

// Charts are drawn on a canvas, so they take the tokens' values rather than their CSS names.
function look(dark: boolean) {
  const c = dark ? DARK : LIGHT;
  const series = [
    c["color-accent"],
    c["color-ai"],
    c["color-wait"],
    c["color-accent-2"],
    c["color-alert"],
    c["color-ink-3"],
  ];
  const [one, two, three, four, five, six] = series;
  return studioTheme.withParams({
    browserColorScheme: dark ? "dark" : "light",
    accentColor: c["color-accent"],
    backgroundColor: c["color-surface"],
    foregroundColor: c["color-ink"],
    fontFamily: SHARED["font-text"],
    fontSize: 14,
    studioMinWidth: 300,
    studioWrapperBackgroundColor: c["color-bg-sunk"],
    studioWrapperBorderRadius: 20,
    studioCanvasBackgroundColor: c["color-bg-sunk"],
    studioCanvasFontFamily: SHARED["font-text"],
    studioWidgetBackgroundColor: c["color-surface"],
    studioWidgetBorderRadius: 14,
    studioWidgetTitleFontSize: 15,
    studioWidgetTitleFontWeight: 600,
    chartPaletteFills1Color: one,
    chartPaletteFills2Color: two,
    chartPaletteFills3Color: three,
    chartPaletteFills4Color: four,
    chartPaletteFills5Color: five,
    chartPaletteFills6Color: six,
    chartPaletteStrokes1Color: one,
    chartPaletteStrokes2Color: two,
    chartPaletteStrokes3Color: three,
    chartPaletteStrokes4Color: four,
    chartPaletteStrokes5Color: five,
    chartPaletteStrokes6Color: six,
  });
}

/**
 * Charts of the person's own deals, built with AG Studio and loaded only on the Insights page.
 * While `editing`, the person can rearrange them; the arrangement stays in this browser.
 */
export function Insights({ deals, editing }: { deals: DealOverview[]; editing: boolean }) {
  const dark = useDark();
  const studio = useRef<AgStudio>(null);
  const data = useMemo(() => ({ sources: [dealsSource(insightRows(deals))] }), [deals]);
  const theme = useMemo(() => look(dark), [dark]);
  const initial = useMemo(savedReport, []);
  return (
    <>
      {editing && (
        <p className="pp-insights-note">
          Drag charts to move them, or add your own from the Data panel. Your arrangement is kept in
          this browser.{" "}
          <Button
            look="quiet"
            onClick={() => {
              keep(undefined);
              studio.current?.api.setState(STARTING_REPORT);
            }}
          >
            Reset to the starting charts
          </Button>
        </p>
      )}
      <div className="pp-insights pp-vendor">
        <AgStudio
          ref={studio}
          style={{ height: "100%" }}
          data={data}
          theme={theme}
          initialState={initial}
          panels={PANELS}
          layout={{ minWidth: 220 }}
          responsiveLayoutBreakpoints={STACKED}
          mode={editing ? "edit" : "view"}
          onStateUpdated={({ state, durable }) => {
            if (durable) keep(state);
          }}
        />
      </div>
    </>
  );
}
