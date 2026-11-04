import { useEffect, useState, type FormEvent } from "react";
import {
  answerBuyerQuestion,
  askAboutAgreement,
  askSellerInstead,
  getAcceptance,
  getQuestions,
  type DealSummary,
  type ForwardReason,
  type QuestionView,
  type QuestionsView,
} from "./api";
import { when } from "./format";
import { FULL_WIDTH, WRAP } from "./styles";

const ALERT = { color: "#8a1c1c" } as const;

/** Why a question reached the seller, in the seller's words. */
const FORWARD_WORDS: Record<ForwardReason, string> = {
  "not-in-agreement": "the agreement does not answer it",
  "quote-not-found": "the automatic answer could not be checked against the agreement",
  "no-model": "no automatic answer was available",
  "buyer-asked": "the buyer asked for your answer",
};

/** The checked automatic answer, with the agreement's words it relies on. */
function AutomaticAnswer({ answer }: { answer: NonNullable<QuestionView["answer"]> }) {
  return (
    <>
      <p>
        <strong>Automatic answer from the agreement&apos;s text:</strong> {answer.text}
      </p>
      <ul>
        {answer.citations.map((c, n) => (
          <li key={n}>
            From the agreement: line {c.line} &ldquo;{c.quote}&rdquo;
          </li>
        ))}
      </ul>
      <p>
        <small>The agreement itself is what you sign. This is not legal advice.</small>
      </p>
    </>
  );
}

/** The seller's answer box for a question sent to them. */
function SellerAnswerBox({ busy, onSend }: { busy: boolean; onSend: (answer: string) => void }) {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = new FormData(event.currentTarget).get("answer");
    onSend(typeof text === "string" ? text : "");
  };
  return (
    <form onSubmit={onSubmit}>
      <p>
        <label>
          Your answer (the buyer sees it)
          <textarea name="answer" required maxLength={2000} rows={3} style={FULL_WIDTH} />
        </label>
      </p>
      <button type="submit" disabled={busy}>
        Send the answer
      </button>
    </form>
  );
}

/**
 * Buyer questions about the agreement. On the signing page the buyer asks; a checked automatic
 * answer from the agreement's text shows at once, or the question goes to the seller, who answers
 * here. Both sides see every question. `revision` changes when the agreement is read again.
 */
export function QuestionsPanel({
  deal,
  revision,
  onChange,
}: {
  deal: DealSummary;
  revision: number;
  onChange: () => void;
}) {
  const [view, setView] = useState<QuestionsView | undefined>();
  // The fingerprint of the page the buyer is asked to sign, so a question is about what they see.
  const [documentSha256, setDocumentSha256] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const buyer = deal.role === "buyer";

  useEffect(() => {
    getQuestions(deal.id).then(setView, () => undefined);
    if (buyer && deal.status === "awaiting_acceptance") {
      getAcceptance(deal.id).then(
        (acceptance) => {
          setDocumentSha256(acceptance.documentSha256);
        },
        () => undefined,
      );
    }
  }, [deal.id, deal.status, buyer, revision]);

  const run = (work: Promise<QuestionsView>, after?: () => void) => {
    setBusy(true);
    setProblem(undefined);
    work.then(
      (updated) => {
        setBusy(false);
        setView(updated);
        after?.();
        onChange();
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };

  if (!view) return null;
  const canAsk = view.canAsk && documentSha256 !== null;
  if (view.questions.length === 0 && !canAsk) return null;

  const onAsk = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (documentSha256 === null) return;
    run(askAboutAgreement(deal.id, { question: draft, documentSha256 }), () => {
      setDraft("");
    });
  };

  return (
    <section aria-labelledby="questions">
      <h3 id="questions">
        {buyer ? "Questions about this agreement" : "Questions from the buyer"}
      </h3>
      {problem && (
        <p role="alert" style={ALERT}>
          {problem}
        </p>
      )}
      <ol style={WRAP}>
        {view.questions.map((q) => (
          <li key={q.id}>
            <p>
              <strong>{buyer ? "You asked" : "The buyer asked"}</strong> on {when(q.askedAt)}{" "}
              (version {q.version}): &ldquo;{q.question}&rdquo;
            </p>
            {q.answer && <AutomaticAnswer answer={q.answer} />}
            {q.status === "asked" && (
              <p aria-busy="true">Looking for the answer in the agreement…</p>
            )}
            {q.status === "answered" && buyer && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  run(askSellerInstead(deal.id, q.id));
                }}
              >
                Ask the seller instead
              </button>
            )}
            {q.status === "forwarded" &&
              (buyer ? (
                <p role="status">
                  Your question was sent to the seller. Their answer will appear here.
                </p>
              ) : (
                <>
                  <p>Sent to you because {FORWARD_WORDS[q.forwardReason ?? "no-model"]}.</p>
                  <SellerAnswerBox
                    busy={busy}
                    onSend={(answer) => {
                      run(answerBuyerQuestion(deal.id, q.id, answer));
                    }}
                  />
                </>
              ))}
            {q.sellerAnswer !== null && (
              <p>
                <strong>Answer from {buyer ? (deal.seller?.name ?? "the seller") : "you"}:</strong>{" "}
                {q.sellerAnswer}
              </p>
            )}
          </li>
        ))}
      </ol>
      {canAsk && (
        <form onSubmit={onAsk}>
          <p>
            <label>
              Ask a question about this agreement
              <textarea
                name="question"
                required
                maxLength={500}
                rows={2}
                style={FULL_WIDTH}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value);
                }}
              />
            </label>
          </p>
          <button type="submit" disabled={busy}>
            {busy ? "Looking in the agreement…" : "Ask"}
          </button>
        </form>
      )}
    </section>
  );
}
