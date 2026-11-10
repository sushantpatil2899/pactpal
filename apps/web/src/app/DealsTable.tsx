import {
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type ICellRendererParams,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { dayWords } from "@pactpal/words";
import type { DealOverview } from "../overview-api";
import { navigate } from "../router/useRoute";
import { giveAgLicence } from "./ag-licence";
import { STAGES, otherName, waitingWords } from "./overview-words";
import { Records, StageBadge, Unread } from "./parts";

giveAgLicence();
ModuleRegistry.registerModules([AllEnterpriseModule]);

// The grid takes its look from the design tokens, so it follows the light and dark themes.
const theme = themeQuartz.withParams({
  backgroundColor: "var(--color-surface)",
  foregroundColor: "var(--color-ink)",
  borderColor: "var(--color-line)",
  headerBackgroundColor: "var(--color-surface-2)",
  headerTextColor: "var(--color-ink-3)",
  rowHoverColor: "var(--color-surface-2)",
  accentColor: "var(--color-accent)",
  fontFamily: "inherit",
  fontSize: 14,
  headerFontSize: 12,
  rowHeight: 52,
  wrapperBorderRadius: 16,
  browserColorScheme: "inherit",
});

// The licensed extras: choose and group columns, filter by value, count what is shown, export.
const SIDE_BAR = { toolPanels: ["columns", "filters"], defaultToolPanel: "" };
const STATUS_BAR = {
  statusPanels: [{ statusPanel: "agTotalAndFilteredRowCountComponent", align: "left" as const }],
};
const EXPORT = { fileName: "pactpal-deals" };

type Cell = ICellRendererParams<DealOverview>;

const COLUMNS: ColDef<DealOverview>[] = [
  {
    headerName: "Deal",
    valueGetter: ({ data }) =>
      data ? `${data.title} ${otherName(data)} ${data.categoryLabel}` : "",
    cellRenderer: ({ data }: Cell) =>
      data && (
        <span className="pp-cell-deal">
          <strong>{data.title}</strong>
          <small>
            {otherName(data)} · {data.categoryLabel}
          </small>
        </span>
      ),
    flex: 2,
    minWidth: 230,
  },
  {
    headerName: "Stage",
    valueGetter: ({ data }) => (data ? STAGES[data.stage].word : ""),
    cellRenderer: ({ data }: Cell) => data && <StageBadge stage={data.stage} />,
    filter: "agSetColumnFilter",
    enableRowGroup: true,
    width: 170,
  },
  {
    headerName: "Next",
    valueGetter: ({ data }) => (data ? waitingWords(data) : ""),
    tooltipValueGetter: ({ data }) => data?.next?.text ?? "",
    filter: "agSetColumnFilter",
    enableRowGroup: true,
    flex: 1,
    minWidth: 130,
  },
  {
    headerName: "Due",
    valueGetter: ({ data }) => data?.next?.dueDate ?? null,
    valueFormatter: ({ value }: { value: string | null }) =>
      value === null ? "" : dayWords(value),
    // Deals with a due day first, earliest at the top; the rest keep their order.
    comparator: (a: string | null, b: string | null) => (a ?? "9999").localeCompare(b ?? "9999"),
    cellClassRules: { "pp-cell-late": ({ data }) => data?.next?.overdue === true },
    sort: "asc",
    width: 112,
  },
  {
    headerName: "Amount",
    valueGetter: ({ data }) => data?.amount?.minor ?? null,
    valueFormatter: ({ data }) => (data?.amount ? `${data.amount.text} ${data.currency}` : ""),
    type: "rightAligned",
    width: 124,
  },
  {
    headerName: "Records",
    headerTooltip: "How complete the deal's records are, out of 100. Not a prediction.",
    field: "completeness",
    cellRenderer: ({ data }: Cell) => data && <Records score={data.completeness} />,
    width: 112,
  },
  {
    headerName: "Unread",
    valueGetter: ({ data }) => (data ? data.unreadMessages + data.unreadNotifications : 0),
    cellRenderer: ({ data }: Cell) => data && <Unread deal={data} />,
    width: 84,
  },
];

/** The deals as a sortable table; a row opens its deal. Loaded only on the Deals page. */
export function DealsTable({ deals, search }: { deals: DealOverview[]; search: string }) {
  return (
    <AgGridReact<DealOverview>
      theme={theme}
      rowData={deals}
      columnDefs={COLUMNS}
      quickFilterText={search}
      getRowId={({ data }) => data.id}
      domLayout="autoHeight"
      suppressCellFocus={false}
      sideBar={SIDE_BAR}
      statusBar={STATUS_BAR}
      rowGroupPanelShow="onlyWhenGrouping"
      groupDisplayType="groupRows"
      groupDefaultExpanded={1}
      defaultExcelExportParams={EXPORT}
      defaultCsvExportParams={EXPORT}
      rowClass="pp-grid-row"
      overlayNoRowsTemplate="No deals match."
      onRowClicked={({ data }) => {
        if (data) navigate(`/deals/${data.id}`);
      }}
      onCellKeyDown={({ data, event }) => {
        if (data && event instanceof KeyboardEvent && event.key === "Enter") {
          navigate(`/deals/${data.id}`);
        }
      }}
    />
  );
}
