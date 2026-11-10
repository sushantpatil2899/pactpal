import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { dueWords, waitingWords } from "../app/overview-words";
import { Avatar, StageBadge } from "../app/parts";
import type { Overview } from "../app/useOverview";
import { ChatTab } from "../ChatTab";
import { Alert, ButtonLink, EmptyState, Skeleton } from "../design/parts";
import { useWide } from "../design/useWide";
import type { DealOverview } from "../overview-api";
import { navigate } from "../router/useRoute";
import { useLiveChat } from "../useLiveChat";
import { listConversations, type LastMessage } from "./messages-api";
import {
  chatAddress,
  chosenDeal,
  groupByPerson,
  lastWords,
  matchingPeople,
  whenWords,
  type Person,
} from "./threads";
import "../deal/deal.css";
import "./messages.css";

/** How often the list asks again for each chat's newest message. */
const LIST_EVERY_MS = 30_000;

/** The newest message of every chat, asked again every half minute while the page is open. */
function useLastMessages(): [Map<string, LastMessage | null> | undefined, string | undefined] {
  const [lasts, setLasts] = useState<Map<string, LastMessage | null>>();
  const [problem, setProblem] = useState<string>();
  useEffect(() => {
    let current = true;
    const load = () => {
      listConversations().then(
        (conversations) => {
          if (!current) return;
          setLasts(new Map(conversations.map((c) => [c.dealId, c.last])));
          setProblem(undefined);
        },
        (error: unknown) => {
          if (current) setProblem(error instanceof Error ? error.message : "Could not load.");
        },
      );
    };
    load();
    const timer = window.setInterval(load, LIST_EVERY_MS);
    return () => {
      current = false;
      window.clearInterval(timer);
    };
  }, []);
  return [lasts, problem];
}

/** A plain click on a link to a chat picks it here; other clicks open it as the browser would. */
const plainClick = (event: MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

function People({
  people,
  chosen,
  now,
  onChoose,
}: {
  people: readonly Person[];
  chosen: string | undefined;
  now: Date;
  onChoose: (dealId: string) => void;
}) {
  return (
    <ul className="pp-people">
      {people.map((person) => (
        <li key={person.key}>
          <p className="pp-person">
            <Avatar name={person.name} />
            <span>
              <b>{person.name}</b>
              {person.email !== undefined && person.email !== person.name && (
                <small>{person.email}</small>
              )}
            </span>
            {person.threads.length > 1 && (
              <small className="pp-person-deals">{person.threads.length} deals</small>
            )}
          </p>
          <ul className="pp-threads">
            {person.threads.map((thread) => (
              <li key={thread.deal.id}>
                <a
                  href={chatAddress(thread.deal.id)}
                  aria-current={thread.deal.id === chosen ? "true" : undefined}
                  data-unread={thread.unread > 0}
                  onClick={(event) => {
                    if (!plainClick(event)) return;
                    event.preventDefault();
                    onChoose(thread.deal.id);
                  }}
                >
                  <span className="pp-thread-title">{thread.deal.title}</span>
                  <time dateTime={thread.at}>{whenWords(thread.at, now)}</time>
                  <span className="pp-thread-last">{lastWords(thread)}</span>
                  {thread.unread > 0 && (
                    <span className="pp-count">
                      {thread.unread}
                      <span className="pp-hidden"> unread</span>
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** The chosen chat, live, the same chat the deal space shows; it reports its newest message. */
function Thread({
  deal,
  name,
  onLast,
  onBack,
}: {
  deal: DealOverview;
  name: string;
  onLast: (last: LastMessage) => void;
  onBack: () => void;
}) {
  const chat = useLiveChat(deal.id, { reading: true });
  const newest = chat.state.messages.at(-1);
  useEffect(() => {
    if (!newest) return;
    onLast({
      seq: newest.seq,
      role: newest.role,
      kind: newest.kind,
      text: newest.body.replace(/\s+/g, " ").trim(),
      at: newest.createdAt,
    });
    // Only a new newest message is news for the list.
  }, [newest?.seq]);
  return (
    <section
      className="pp-panel pp-deal-chat pp-messages-thread"
      aria-label={`Chat about ${deal.title}`}
    >
      <div className="pp-messages-bar">
        <button type="button" className="pp-messages-back" onClick={onBack}>
          ← All conversations
        </button>
        <a className="pp-messages-open" href={`/deals/${deal.id}`}>
          Open the deal →
        </a>
      </div>
      <ChatTab
        dealId={deal.id}
        chat={chat}
        otherName={name}
        about={deal.title}
        pasted={false}
        onOpenTab={(tab) => {
          navigate(`/deals/${deal.id}#${tab}`);
        }}
      />
    </section>
  );
}

/** The deal the chat belongs to: where it stands, and the way into its deal space. */
function DealCard({ deal }: { deal: DealOverview }) {
  const waiting = waitingWords(deal);
  const due = dueWords(deal);
  return (
    <aside className="pp-panel pp-messages-deal" aria-label="The deal this chat belongs to">
      <p className="pp-caption">This chat belongs to</p>
      <h2>{deal.title}</h2>
      <StageBadge stage={deal.stage} />
      <dl>
        {deal.amount && (
          <div>
            <dt>Agreed</dt>
            <dd>
              {deal.amount.text} {deal.currency}
            </dd>
          </div>
        )}
        {deal.next && (
          <div>
            <dt>{waiting || "Next"}</dt>
            <dd>
              {deal.next.text}
              {due !== "" && (
                <small className="pp-due" data-late={deal.next.overdue || undefined}>
                  {due}
                </small>
              )}
            </dd>
          </div>
        )}
        {deal.stepsTotal > 0 && (
          <div>
            <dt>Steps</dt>
            <dd>
              {deal.stepsDone} of {deal.stepsTotal} done
            </dd>
          </div>
        )}
      </dl>
      <div className="pp-messages-links">
        <ButtonLink look="primary" href={`/deals/${deal.id}`}>
          Open the deal
        </ButtonLink>
        <a href={`/deals/${deal.id}#timeline`}>Timeline</a>
        <a href={`/deals/${deal.id}#log`}>Evidence log</a>
      </div>
      <p className="pp-messages-note">
        This is the deal&apos;s own chat, the same one its deal space shows. Every message is saved
        in that deal&apos;s evidence log.
      </p>
    </aside>
  );
}

/**
 * Every chat in one place, grouped by the person on the other side, so a reply never needs a
 * trip into the deal first. Each deal keeps its own chat, because its agreement is drafted from
 * it and its evidence log cites it; this page only gathers them. The deal stays named beside it.
 */
export function MessagesPage({ overview }: { overview: Overview }) {
  const [lasts, problem] = useLastMessages();
  const [fresh, setFresh] = useState(new Map<string, LastMessage>());
  const [read, setRead] = useState(new Set<string>());
  const [typed, setTyped] = useState("");
  const [chosen, setChosen] = useState<string>();
  const wide = useWide(50);

  const people = useMemo(() => {
    const merged = new Map(lasts);
    for (const [dealId, last] of fresh) {
      const known = merged.get(dealId);
      if (!known || known.seq < last.seq) merged.set(dealId, last);
    }
    return groupByPerson(overview.deals ?? [], merged, read);
  }, [overview.deals, lasts, fresh, read]);
  const shown = matchingPeople(people, typed);

  const choose = (dealId: string | undefined) => {
    setChosen(dealId);
    if (dealId !== undefined) setRead((was) => new Set(was).add(dealId));
    window.history.replaceState(null, "", dealId === undefined ? "/messages" : chatAddress(dealId));
  };

  // Open the chat the address names, or on a wide screen the most recently active one.
  const ready = overview.deals !== undefined && lasts !== undefined;
  useEffect(() => {
    if (!ready || chosen !== undefined) return;
    const asked = chosenDeal(window.location.search, people);
    const first = people[0]?.threads[0]?.deal.id;
    if (asked !== undefined || wide) choose(asked ?? first);
    // Chosen once, when the list first arrives.
  }, [ready]);

  const thread = people.flatMap((p) => p.threads).find((t) => t.deal.id === chosen);
  const person = people.find((p) => p.threads.some((t) => t.deal.id === chosen));
  const now = new Date();

  if (!ready && overview.problem === undefined && problem === undefined) {
    return <Skeleton label="Loading your conversations…" lines={6} />;
  }
  return (
    <div className="pp-messages" data-showing={thread ? "thread" : "list"}>
      <nav className="pp-panel pp-messages-list" aria-label="Conversations">
        <header>
          <h1>Messages</h1>
          <label>
            <span className="pp-hidden">Find a person or a deal</span>
            <input
              type="search"
              placeholder="Find a person or a deal"
              value={typed}
              onChange={(event) => {
                setTyped(event.target.value);
              }}
            />
          </label>
        </header>
        {(overview.problem ?? problem) !== undefined && (
          <Alert problem>{overview.problem ?? problem}</Alert>
        )}
        {people.length === 0 ? (
          <EmptyState>
            No conversations yet. A deal&apos;s chat starts once its buyer is added.
          </EmptyState>
        ) : shown.length === 0 ? (
          <p className="pp-messages-none">Nobody matches “{typed}”.</p>
        ) : (
          <People people={shown} chosen={chosen} now={now} onChoose={choose} />
        )}
      </nav>
      {thread && person ? (
        <>
          <Thread
            key={thread.deal.id}
            deal={thread.deal}
            name={person.name}
            onLast={(last) => {
              setFresh((was) => new Map(was).set(thread.deal.id, last));
            }}
            onBack={() => {
              choose(undefined);
            }}
          />
          <DealCard deal={thread.deal} />
        </>
      ) : (
        people.length > 0 && (
          <p className="pp-panel pp-messages-pick">Choose a conversation to read it here.</p>
        )
      )}
    </div>
  );
}
