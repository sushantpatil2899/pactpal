import type { Citation, DraftCategory, DraftContent, DraftView } from "./api";
import { ChatPane } from "./ChatPane";
import { CouncilPanel } from "./CouncilPanel";
import { fillFrom, type DraftFill } from "./draft-fill";
import { lineNumbers } from "./format";
import { WRAP } from "./styles";

const muted = { color: "#555", fontSize: 14 } as const;

/** The quotes behind a statement: the line number and the words copied from that line. */
function Quotes({ citations }: { citations: Citation[] }) {
  return (
    <ul style={{ ...muted, margin: "0 0 0.5rem" }} aria-label="From the chat">
      {citations.map((citation, n) => (
        <li key={n}>
          line {citation.line}: &ldquo;{citation.quote}&rdquo;
        </li>
      ))}
    </ul>
  );
}

const capitalised = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const NOT_STATED = <em>not stated in the chat</em>;

/** Names of the single-value fields the chat did not state, in plain words. */
function missingFields(draft: DraftContent): string[] {
  const missing: [string, boolean][] = [
    ["a summary", draft.summary.status === "missing"],
    ["the price", draft.price.status === "missing"],
    ["how payment works", draft.paymentTerms.status === "missing"],
    ["a due date", draft.dueDate.status === "missing"],
    ["the number of revisions", draft.revisionsIncluded.status === "missing"],
    ["what will be delivered", draft.deliverables.length === 0],
    ["what is not included", draft.exclusions.length === 0],
  ];
  return missing.filter(([, isMissing]) => isMissing).map(([name]) => name);
}

/** The notice about what the models think is being sold, compared with the deal's category. */
function CategoryNotice({
  category,
  dealCategory,
}: {
  category: DraftCategory | null;
  dealCategory: string;
}) {
  if (category === null) return null;
  switch (category.verdict) {
    case "agrees":
      return (
        <p role="status">
          What is being sold: {category.label}. This matches the category you chose.
        </p>
      );
    case "mismatch":
      return (
        <p role="alert">
          The chat looks like &ldquo;{category.label}&rdquo;, but this deal is in &ldquo;
          {dealCategory}&rdquo;. Check which one is right before you go on.
        </p>
      );
    case "blocked":
      return (
        <p role="alert">
          The chat looks like something PactPal does not support yet: &ldquo;{category.label}
          &rdquo;. For now PactPal supports services, digital work and small handmade goods. Do not
          send this deal to a buyer.
        </p>
      );
    case "unclear":
      return <p role="status">The chat does not make clear what is being sold.</p>;
  }
}

/** Tells the seller when the models did not fully agree, or when only one of them produced a usable draft. */
function ReviewNotice({ view }: { view: DraftView }) {
  const usable = view.council?.answers.filter((answer) => answer.status === "valid").length;
  if (usable === 1) {
    return (
      <p role="alert">
        Only one model produced a usable draft, so nothing was cross-checked. Read every line
        carefully.
      </p>
    );
  }
  if (view.needsReview !== true) return null;
  return (
    <p role="alert">
      The models did not fully agree, so read every line carefully: {view.reviewReasons.join("; ")}.
    </p>
  );
}

/** Names the chat lines that look like orders to an AI; they were hidden from the models and cannot be quoted. */
function HiddenLinesNotice({ hidden }: { hidden: number[] }) {
  if (hidden.length === 0) return null;
  const words =
    hidden.length === 1
      ? {
          look: "looks like an instruction",
          term: "a deal term",
          they: "It was",
          them: "it",
          is: "it is",
        }
      : {
          look: "look like instructions",
          term: "deal terms",
          they: "They were",
          them: "them",
          is: "they are",
        };
  return (
    <p role="alert">
      <strong>{capitalised(lineNumbers(hidden))}</strong> of this chat {words.look} to an AI, not{" "}
      {words.term}. {words.they} hidden from the AI and cannot be quoted. Check {words.them}: if{" "}
      {words.is} normal chat, whatever {words.them === "it" ? "it" : "they"} said is missing from
      the draft.
    </p>
  );
}

/** The drafted work with its quotes: summary, delivered, not included, price, dates, wording hints. */
function DraftBody({ draft }: { draft: DraftContent }) {
  return (
    <>
      <h4>Summary</h4>
      {draft.summary.status === "found" ? (
        <>
          <p>{draft.summary.value}</p>
          <Quotes citations={draft.summary.citations} />
        </>
      ) : (
        <p>{NOT_STATED}</p>
      )}

      <h4>What will be delivered</h4>
      {draft.deliverables.length === 0 && <p>{NOT_STATED}</p>}
      <ul>
        {draft.deliverables.map((item, n) => (
          <li key={n}>
            {item.text}
            <Quotes citations={item.citations} />
          </li>
        ))}
      </ul>

      <h4>Not included</h4>
      {draft.exclusions.length === 0 && <p>{NOT_STATED}</p>}
      <ul>
        {draft.exclusions.map((item, n) => (
          <li key={n}>
            {item.text}
            <Quotes citations={item.citations} />
          </li>
        ))}
      </ul>

      <h4>Price and payment</h4>
      {draft.price.status === "found" ? (
        <>
          <p>
            Price: {draft.price.amount} {draft.price.currency}
          </p>
          <Quotes citations={draft.price.citations} />
        </>
      ) : (
        <p>Price: {NOT_STATED}</p>
      )}
      {draft.paymentTerms.status === "found" ? (
        <>
          <p>How payment works: {draft.paymentTerms.value}</p>
          <Quotes citations={draft.paymentTerms.citations} />
        </>
      ) : (
        <p>How payment works: {NOT_STATED}</p>
      )}

      <h4>Dates and revisions</h4>
      {draft.dueDate.status === "found" ? (
        <>
          <p>Due: {draft.dueDate.value}</p>
          <Quotes citations={draft.dueDate.citations} />
        </>
      ) : (
        <p>Due date: {NOT_STATED}</p>
      )}
      {draft.revisionsIncluded.status === "found" ? (
        <>
          <p>Revisions included: {draft.revisionsIncluded.value}</p>
          <Quotes citations={draft.revisionsIncluded.citations} />
        </>
      ) : (
        <p>Revisions included: {NOT_STATED}</p>
      )}

      {draft.vagueTerms.length > 0 && (
        <>
          <h4>Wording that two people could read differently</h4>
          <ul>
            {draft.vagueTerms.map((term, n) => (
              <li key={n}>
                &ldquo;{term.phrase}&rdquo;:{" "}
                {term.kind === "subjective"
                  ? "a matter of taste, so it needs the buyer's approval"
                  : "could be measured but is not"}
                . Suggested wording: {term.suggestedRewrite} <em>(a suggestion, not agreed)</em>
                <Quotes citations={term.citations} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

/** One draft with what the seller should check first, and the button that fills the form from it. */
function CheckedDraft({
  draft,
  category,
  dealCategory,
  fill,
  canUse,
  onUse,
  buttonText,
}: {
  draft: DraftContent;
  category: DraftCategory | null;
  dealCategory: string;
  fill: DraftFill | undefined;
  canUse: boolean;
  onUse: (fill: DraftFill) => void;
  buttonText: string;
}) {
  const missing = missingFields(draft);
  return (
    <>
      <CategoryNotice category={category} dealCategory={dealCategory} />
      {missing.length > 0 && <p>Not stated in the chat: {missing.join(", ")}.</p>}
      <DraftBody draft={draft} />
      {canUse && fill && (
        <p>
          <button
            type="button"
            onClick={() => {
              onUse(fill);
            }}
          >
            {buttonText}
          </button>{" "}
          <span style={muted}>It fills the form below; you check it and save it yourself.</span>
        </p>
      )}
    </>
  );
}

/** Says why there is no chosen draft: the models' drafts could not be ranked, so the seller chooses. */
function UnrankedNotice({ count }: { count: number }) {
  return (
    <p role="alert">
      {count === 2
        ? "Only two models produced a usable draft, so they could not be ranked. Both drafts are below."
        : `The ${String(count)} usable drafts could not be ranked. They are all below.`}{" "}
      Read them and choose the one you want to use.
    </p>
  );
}

/** A finished draft for the seller to check: flags, the drafted work with quotes, wording to fix, the council and the chat. */
export function DraftReview({
  view,
  dealCategory,
  canUse,
  onUse,
}: {
  view: DraftView;
  dealCategory: string;
  canUse: boolean;
  onUse: (fill: DraftFill) => void;
}) {
  const { draft } = view;
  if (draft === null) return null;
  const unranked = view.unranked === true;
  return (
    <div style={WRAP}>
      <p role="note">
        <strong>AI draft: check every line against the chat.</strong> The quotes under each line
        show where it comes from. Nothing here is agreed until you save it and the buyer accepts.
      </p>
      <HiddenLinesNotice hidden={view.source.hiddenLines ?? []} />
      {unranked ? <UnrankedNotice count={view.candidates.length} /> : <ReviewNotice view={view} />}

      {unranked ? (
        view.candidates.map((candidate) => (
          <details key={candidate.label} open>
            <summary>
              <strong>Draft {candidate.label}</strong>{" "}
              <span style={muted}>(from {candidate.modelName})</span>
            </summary>
            <CheckedDraft
              draft={candidate.draft}
              category={candidate.category}
              dealCategory={dealCategory}
              fill={fillFrom(view, candidate)}
              canUse={canUse}
              onUse={onUse}
              buttonText={`Use draft ${candidate.label} in the agreed work`}
            />
          </details>
        ))
      ) : (
        <CheckedDraft
          draft={draft}
          category={view.category}
          dealCategory={dealCategory}
          fill={fillFrom(view)}
          canUse={canUse}
          onUse={onUse}
          buttonText="Use this draft in the agreed work"
        />
      )}

      {view.council !== null && <CouncilPanel council={view.council} />}

      {view.source.lines === null ? (
        <p>The chat could not be shown.</p>
      ) : (
        <ChatPane
          idPrefix="chat-line"
          lines={view.source.lines}
          hidden={view.source.hiddenLines ?? []}
          layout="folded"
        />
      )}
    </div>
  );
}
