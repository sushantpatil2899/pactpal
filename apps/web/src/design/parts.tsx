import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Look = "primary" | "secondary" | "quiet";

const lookClass = (look: Look, large: boolean, extra?: string): string =>
  [
    "pp-button",
    look === "primary" && "pp-button-primary",
    look === "quiet" && "pp-button-quiet",
    large && "pp-button-large",
    extra,
  ]
    .filter(Boolean)
    .join(" ");

interface LookProps {
  /** One primary action per view; everything else is secondary or quiet. */
  look?: Look;
  large?: boolean;
}

/** A button in one of the system's three looks. */
export function Button({
  look = "secondary",
  large = false,
  className,
  type = "button",
  ...rest
}: LookProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={lookClass(look, large, className)} {...rest} />;
}

/** A link that looks like a button, for actions that go to another address. */
export function ButtonLink({
  look = "secondary",
  large = false,
  className,
  children,
  ...rest
}: LookProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={lookClass(look, large, className)} {...rest}>
      {children}
    </a>
  );
}

/** A card: the container for one record or task. Each child is one of its ruled rows. */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={["pp-card", className].filter(Boolean).join(" ")}>{children}</div>;
}

/** A captioned fact on a card. A fact with no source says so instead of staying empty. */
export function Field({ caption, children }: { caption: string; children?: ReactNode }) {
  return (
    <div>
      <span className="pp-caption">{caption}</span>
      {children ?? <span>Not in the source. Left blank.</span>}
    </div>
  );
}

/** A message the person must see: a problem (announced at once) or a quiet confirmation. */
export function Alert({ problem = false, children }: { problem?: boolean; children: ReactNode }) {
  return <p role={problem ? "alert" : "status"}>{children}</p>;
}

/** What a list or panel shows before it has anything: what will appear, and how to start. */
export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="pp-empty">{children}</div>;
}

/** Ruled placeholder lines while something loads; the words are for screen readers. */
export function Skeleton({ label, lines = 3 }: { label: string; lines?: number }) {
  return (
    <div className="pp-skeleton" aria-busy="true">
      <span className="pp-hidden">{label}</span>
      {Array.from({ length: lines }, (_, at) => (
        <i key={at} />
      ))}
    </div>
  );
}
