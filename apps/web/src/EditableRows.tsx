import type { Dispatch, ReactNode, SetStateAction } from "react";

/**
 * A list of rows the seller can add to and remove from (payment stages, what the buyer provides).
 * `children` draws one row's fields; `change` updates that row.
 */
export function EditableRows<Row>({
  rows,
  setRows,
  min,
  max,
  empty,
  addLabel,
  removeLabel,
  children,
}: {
  rows: Row[];
  setRows: Dispatch<SetStateAction<Row[]>>;
  min: number;
  max: number;
  empty: Row;
  addLabel: string;
  removeLabel: (number: number) => string;
  children: (row: Row, index: number, change: (change: Partial<Row>) => void) => ReactNode;
}) {
  const change = (index: number) => (update: Partial<Row>) => {
    setRows((all) => all.map((row, n) => (n === index ? { ...row, ...update } : row)));
  };
  return (
    <>
      {rows.map((row, n) => (
        <p key={n}>
          {children(row, n, change(n))}{" "}
          {rows.length > min && (
            <button
              type="button"
              onClick={() => {
                setRows((all) => all.filter((_, i) => i !== n));
              }}
            >
              {removeLabel(n + 1)}
            </button>
          )}
        </p>
      ))}
      {rows.length < max && (
        <button
          type="button"
          onClick={() => {
            setRows((all) => [...all, { ...empty }]);
          }}
        >
          {addLabel}
        </button>
      )}
    </>
  );
}
