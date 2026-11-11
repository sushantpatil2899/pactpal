import { StatusBadge } from "../design/Badge";
import type { DealOverview, DealStage } from "../overview-api";
import { STAGES, dueWords, initials, otherName, waitingWords } from "./overview-words";

/** A person as two letters on a coloured disc. */
export function Avatar({ name }: { name: string }) {
  // The same name always gets the same of four tints.
  let sum = 0;
  for (let at = 0; at < name.length; at++) sum += name.charCodeAt(at);
  const tint = sum % 4;
  return (
    <span className="pp-avatar" data-tint={tint} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

export function StageBadge({ stage }: { stage: DealStage }) {
  return <StatusBadge status={STAGES[stage].badge}>{STAGES[stage].word}</StatusBadge>;
}

/** How complete a deal's records are, as a number and a bar. Never a prediction. */
export function Records({ score }: { score: number | null }) {
  if (score === null) return null;
  return (
    <span className="pp-records" title={`Records complete: ${String(score)} of 100`}>
      <span className="pp-mono">{score}</span>
      <span className="pp-meter" aria-hidden="true">
        <i style={{ width: `${String(score)}%` }} />
      </span>
      <span className="pp-hidden">of 100 records complete</span>
    </span>
  );
}

/** Unread messages and notices on a deal, as a count; nothing when all is read. */
export function Unread({ deal }: { deal: DealOverview }) {
  const count = deal.unreadMessages + deal.unreadNotifications;
  if (count === 0) return null;
  return (
    <span className="pp-count">
      {count}
      <span className="pp-hidden"> unread</span>
    </span>
  );
}

/** One deal as a row that opens it: who, what is next, when, and where it stands. */
export function DealRow({ deal }: { deal: DealOverview }) {
  const due = dueWords(deal);
  return (
    <a className="pp-deal-row" href={`/deals/${deal.id}`}>
      <Avatar name={otherName(deal)} />
      <span className="pp-deal-main">
        <strong>{deal.title}</strong>
        <small>
          {waitingWords(deal)}
          {deal.next && ` · ${deal.next.text}`}
        </small>
      </span>
      {due !== "" && (
        <span className="pp-due" data-late={deal.next?.overdue === true || undefined}>
          {due}
        </span>
      )}
      <Records score={deal.completeness} />
      <StageBadge stage={deal.stage} />
      <Unread deal={deal} />
    </a>
  );
}
