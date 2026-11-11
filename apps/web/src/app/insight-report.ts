import type { AgDataSourcesDefinition, AgReportState } from "ag-studio";
import type { InsightRow } from "./insight-rows";

type Source = AgDataSourcesDefinition["sources"][number];

/** The deals as AG Studio's one table, each column named as people read it. */
export function dealsSource(rows: InsightRow[]): Source {
  return {
    id: "deals",
    name: "Deals",
    primaryKeyField: "id",
    data: rows,
    fields: [
      { id: "id", name: "Deal id", format: "textFormat", hide: true },
      { id: "deal", name: "Deal", format: "textFormat" },
      { id: "otherSide", name: "Other side", format: "textFormat" },
      { id: "category", name: "Category", format: "textFormat" },
      { id: "stage", name: "Stage", format: "textFormat" },
      { id: "waitingOn", name: "Waiting on", format: "textFormat" },
      { id: "timing", name: "Timing", format: "textFormat" },
      {
        id: "amount",
        name: "Agreed amount",
        format: "decimalFormat",
        formatOptions: { format: new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }) },
      },
      { id: "currency", name: "Currency", format: "textFormat" },
      {
        id: "records",
        name: "Records completeness",
        format: "integerFormat",
        formatOptions: { format: new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }) },
      },
      { id: "stepsDone", name: "Steps done", format: "integerFormat" },
      { id: "stepsTotal", name: "Steps in all", format: "integerFormat" },
      { id: "unread", name: "Unread", format: "integerFormat" },
      { id: "changed", name: "Last changed", format: "dateFormat" },
    ],
  };
}

const count = { id: "deals.id", aggregation: "count" } as const;
const title = (text: string) => ({ title: { enabled: true, text } });

/**
 * The charts a person sees before they change anything. Amounts are split by currency, never
 * added across currencies. Records completeness says how complete the records are, nothing more.
 */
export const STARTING_REPORT: AgReportState = {
  selectedPageId: "overview",
  pages: [
    {
      id: "overview",
      widgets: {
        deals: { type: "value", dataMapping: { value: [count] }, format: title("Deals") },
        records: {
          type: "value",
          dataMapping: { value: [{ id: "deals.records", aggregation: "avg" }] },
          format: title("Records, average out of 100"),
        },
        unread: {
          type: "value",
          dataMapping: { value: [{ id: "deals.unread", aggregation: "sum" }] },
          format: title("Unread"),
        },
        byStage: {
          type: "donut-chart",
          dataMapping: { categoryKey: [{ id: "deals.stage" }], valueKey: [count] },
          format: title("Deals by stage"),
        },
        amounts: {
          type: "bar-chart-grouped",
          dataMapping: {
            categoryKey: [{ id: "deals.stage" }],
            valueKey: [{ id: "deals.amount", aggregation: "sum" }],
            legendKey: [{ id: "deals.currency" }],
          },
          format: title("Agreed amount by stage, per currency"),
        },
        waiting: {
          type: "column-chart-grouped",
          dataMapping: { categoryKey: [{ id: "deals.waitingOn" }], valueKey: [count] },
          format: title("Who deals are waiting on"),
        },
        recordsByStage: {
          type: "bar-chart-grouped",
          dataMapping: {
            categoryKey: [{ id: "deals.stage" }],
            valueKey: [{ id: "deals.records", aggregation: "avg" }],
          },
          format: title("Records by stage, average"),
        },
      },
      widgetLayout: {
        deals: { xTrack: 0, yTrack: 0, xSpan: 8, ySpan: 7 },
        records: { xTrack: 8, yTrack: 0, xSpan: 8, ySpan: 7 },
        unread: { xTrack: 16, yTrack: 0, xSpan: 8, ySpan: 7 },
        byStage: { xTrack: 0, yTrack: 7, xSpan: 9, ySpan: 20 },
        amounts: { xTrack: 9, yTrack: 7, xSpan: 15, ySpan: 20 },
        waiting: { xTrack: 0, yTrack: 27, xSpan: 12, ySpan: 18 },
        recordsByStage: { xTrack: 12, yTrack: 27, xSpan: 12, ySpan: 18 },
      },
      filter: { page: [{ field: { id: "deals.stage" } }, { field: { id: "deals.category" } }] },
    },
  ],
};
