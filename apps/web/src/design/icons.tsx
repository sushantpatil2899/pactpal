/** The line icons the app uses, drawn on a 20 by 20 grid in one stroke weight. */
const PATHS = {
  home: "M3 9l7-6 7 6v8H3z",
  deals: "M5 4h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 8h14",
  bell: "M5 8a5 5 0 0 1 10 0c0 5 2 6 2 6H3s2-1 2-6M8 17h4",
  dispute: "M10 3l7 13H3zM10 8v4M10 14v.5",
  chart: "M3 17h14M6 14V9M10 14V4M14 14v-7",
  calendar: "M4 5h12v11H4zM4 8.5h12M7 3v3M13 3v3",
  settings: "M10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10 2v3M10 15v3M2 10h3M15 10h3",
  plus: "M10 4v12M4 10h12",
  search: "M9 3a6 6 0 1 0 0 12A6 6 0 0 0 9 3zM13.5 13.5L17 17",
  sidebar: "M4 4h12a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 4v12",
  exit: "M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M12 7l3 3-3 3M15 10H8",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="pp-icon"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
