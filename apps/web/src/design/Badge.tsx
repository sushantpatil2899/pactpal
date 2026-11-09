import type { ReactNode } from "react";

/** The states a deal or a record can be in; each has its own word, shape and colour. */
export type Status =
  "draft" | "awaiting" | "signed" | "paid" | "delivered" | "disputed" | "changed";

const TICK = "M3 8.5l3 3 7-7";

/** Each status's word and its shape, drawn on a 16 by 16 grid. */
const STATUSES: Record<Status, { word: string; shape: ReactNode }> = {
  draft: { word: "Draft", shape: <circle cx="8" cy="8" r="5.5" strokeDasharray="2.5 2" /> },
  awaiting: {
    word: "Waiting for buyer",
    shape: (
      <>
        <circle cx="8" cy="8" r="5.5" />
        <path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
      </>
    ),
  },
  signed: { word: "Signed", shape: <path d={TICK} /> },
  paid: { word: "Paid", shape: <path d={TICK} /> },
  delivered: { word: "Delivered", shape: <path d="M1 8.5l3 3 7-7M7 11.5l7-7" /> },
  disputed: { word: "Disputed", shape: <path d="M8 2.5v7M8 12.5v1" /> },
  changed: { word: "Changed", shape: <path d="M2 8h4M10 8h4M7 4l-1 2M9 12l1-2" /> },
};

/** A status as a small tag: the word, a shape and a colour, so it reads without colour. */
export function StatusBadge({ status, children }: { status: Status; children?: ReactNode }) {
  const { word, shape } = STATUSES[status];
  return (
    <span className={`pp-badge pp-badge-${status}`}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        focusable="false"
      >
        {shape}
      </svg>
      {children ?? word}
    </span>
  );
}
