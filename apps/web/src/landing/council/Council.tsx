import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const at = (i: number) => ({ "--i": i }) as CSSProperties;

const STEPS = [
  {
    title: "Each model drafts on its own",
    body: "Five models from five different families read the chat and draft the agreement separately, citing a chat line for every term.",
  },
  {
    title: "Code checks every citation",
    body: "Before any vote, code checks each citation against the chat. A draft that points at a line that is not there is thrown out.",
  },
  {
    title: "Names hidden, every model ranks",
    body: "The drafts that pass are anonymised, and every model ranks the others. A model's vote on its own draft is ignored.",
  },
  {
    title: "One whole draft wins",
    body: "A Borda count picks a single draft from start to finish. Drafts are never stitched together.",
  },
  {
    title: "Disagreement comes to you",
    body: "When the rankings disagree, the draft is flagged for your review. Nothing reaches your buyer until you confirm it.",
  },
] as const;

const MODELS = ["Gemini", "Qwen", "GPT OSS", "Mistral", "Nemotron"];
const BAD = "Mistral";
const LINES = ["Due 28 Nov", "2 revisions", "600.00 USD"];
const CHAT = [
  "L1  Cover by the 28th?",
  "L2  Two revisions, 600 in three parts",
  "L3  Square web version too",
];

/** Five drafts being written at once, each term citing a chat line. */
function Drafting({ reject }: { reject?: boolean }) {
  return (
    <div className="pp-lp-models" data-reject={reject}>
      {MODELS.map((model, m) => (
        <div key={model} className="pp-lp-model" style={at(m)} data-bad={model === BAD}>
          <header>
            <i /> {model}
          </header>
          {LINES.map((line, l) => (
            <p key={line} style={at(m + l * 2)}>
              <span>{line}</span>
              <b>{model === BAD && l === 2 ? "L9" : `L${String(Math.min(l + 1, 2))}`}</b>
            </p>
          ))}
          {model === BAD && <em>Line 9 is not in the chat. Thrown out by code.</em>}
        </div>
      ))}
    </div>
  );
}

const BALLOTS = [
  ["Gemini", "2 › 4 › 3"],
  ["Qwen", "2 › 1 › 4"],
  ["GPT OSS", "1 › 2 › 4"],
  ["Nemotron", "2 › 1 › 3"],
];

function Ranking() {
  return (
    <div className="pp-lp-ballots">
      <div className="pp-lp-drafts">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} style={at(n)}>
            <b>Draft {n}</b>
            <small>author hidden</small>
          </span>
        ))}
      </div>
      <ul>
        {BALLOTS.map(([who, order], i) => (
          <li key={who} style={at(i)}>
            {who} ranks <code>{order}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SCORES = [
  ["Draft 2", 10],
  ["Draft 1", 7],
  ["Draft 4", 4],
  ["Draft 3", 3],
] as const;

function Borda() {
  return (
    <div className="pp-lp-borda">
      {SCORES.map(([draft, points], i) => (
        <div
          key={draft}
          style={{ ...at(i), "--w": points / 10 } as CSSProperties}
          data-win={i === 0}
        >
          <span>{draft}</span>
          <i />
          <b>{points}</b>
        </div>
      ))}
      <p>Chosen whole. Never merged.</p>
    </div>
  );
}

function Agreement() {
  return (
    <div className="pp-lp-dials">
      {[
        { w: 0.78, word: "The models agree. The draft comes to you to confirm.", tone: "ok" },
        { w: 0.31, word: "The models disagree. Flagged for your review.", tone: "flag" },
      ].map((dial, i) => (
        <figure
          key={dial.tone}
          data-tone={dial.tone}
          style={{ ...at(i), "--w": dial.w } as CSSProperties}
        >
          <div className="pp-lp-dial">
            <i />
            <b>{dial.w.toFixed(2)}</b>
          </div>
          <figcaption>
            <small>Agreement between the rankings</small>
            {dial.word}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

const VISUALS: readonly ReactNode[] = [
  <Drafting key="1" />,
  <Drafting key="2" reject />,
  <Ranking key="3" />,
  <Borda key="4" />,
  <Agreement key="5" />,
];

/**
 * The AI council, step by step: the steps stay pinned on the left and light up in turn while
 * each one plays out on the right. The visuals run only while their step is the active one.
 */
export function Council() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const panel of panels.current) if (panel) watch.observe(panel);
    return () => {
      watch.disconnect();
    };
  }, []);
  return (
    <section id="council" className="pp-lp-council pp-scope-dark" aria-labelledby="pp-lp-council">
      <div className="pp-lp-council-side">
        <p className="pp-lp-kicker">
          <i /> The AI council
        </p>
        <h2 id="pp-lp-council" className="pp-lp-display">
          Five models draft.
          <br />
          <em>They check each other.</em>
        </h2>
        <div className="pp-lp-chat" aria-label="The chat they read">
          {CHAT.map((line) => (
            <code key={line}>{line}</code>
          ))}
        </div>
        <ol className="pp-lp-steps-nav">
          {STEPS.map((step, i) => (
            <li key={step.title} data-active={i === active} data-done={i < active}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <b>{step.title}</b>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="pp-lp-council-stage">
        {VISUALS.map((visual, i) => (
          <div
            key={STEPS[i]?.title}
            ref={(el) => {
              panels.current[i] = el;
            }}
            data-step={i}
            data-active={i === active}
            className="pp-lp-council-panel"
          >
            <p className="pp-lp-panel-title">
              <span>{String(i + 1).padStart(2, "0")}</span> {STEPS[i]?.title}
            </p>
            <figure role="img" aria-label={STEPS[i]?.body} className="pp-lp-glass">
              {visual}
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
