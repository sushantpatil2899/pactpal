/** A place on the landing page the navigation can take a visitor to. */
export interface NavLink {
  id: string;
  label: string;
  /** One line under the label, in the menus. */
  note?: string;
}

/** A top-level item: one place, or a group of places shown in a menu. */
export interface NavItem extends NavLink {
  children?: readonly NavLink[];
}

/** The landing page's sections that have an anchor, from the top of the page down. */
export const PAGE_ORDER = [
  "get",
  "for",
  "how",
  "council",
  "paypal",
  "ledger",
  "disputes",
  "agents",
  "app",
  "buyer",
  "features",
  "trust",
  "faq",
] as const;

/** The navigation, in page order. A group's own link goes to its first place. */
export const NAV: readonly NavItem[] = [
  { id: "get", label: "What you get" },
  { id: "for", label: "Who it's for" },
  {
    id: "how",
    label: "How it works",
    children: [
      { id: "how", label: "The five steps", note: "One deal, from chat to final payment" },
      { id: "council", label: "AI council", note: "Five models draft and check each other" },
      { id: "paypal", label: "PayPal", note: "Moves the money and keeps the proof" },
      { id: "ledger", label: "Evidence log", note: "Change one entry and watch it break" },
      { id: "disputes", label: "Disputes", note: "Every claim checked against the record" },
      { id: "agents", label: "AI agents", note: "Your own assistant, never unsupervised" },
    ],
  },
  {
    id: "app",
    label: "The app",
    children: [
      { id: "app", label: "Product tour", note: "Dashboard, timeline, chat, reminders" },
      { id: "buyer", label: "For your buyer", note: "One link by email, no account" },
      { id: "features", label: "Everything included", note: "What every deal comes with" },
    ],
  },
  { id: "trust", label: "Trust" },
  { id: "faq", label: "FAQ" },
];

/** Every place the navigation links to, in the order a visitor meets them. */
export const navPlaces = (nav: readonly NavItem[] = NAV): string[] =>
  nav.flatMap((item) => (item.children ? item.children.map((child) => child.id) : [item.id]));

/** The top-level item that holds a section, for highlighting where the visitor is. */
export function navOwner(sectionId: string | null, nav: readonly NavItem[] = NAV): string | null {
  if (sectionId === null) return null;
  const owner = nav.find(
    (item) => item.id === sectionId || item.children?.some((child) => child.id === sectionId),
  );
  return owner?.id ?? null;
}
