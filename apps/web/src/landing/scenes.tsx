import type { CSSProperties, ReactNode } from "react";
import { Avatar } from "../app/parts";
import { StatusBadge } from "../design/Badge";
import type { SceneId } from "./landing-words";

/**
 * The small product views drawn beside each part of the story, made from the app's own parts
 * and invented data (Maya sells a book cover to Chris). They are pictures of the product, so
 * assistive technology reads each one's label instead of its contents.
 */

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="pp-lp-frame" aria-label={label} role="img">
      {children}
    </figure>
  );
}

/** Its place in a list, for staggered motion. */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

const Cite = ({ n }: { n: number }) => <span className="pp-lp-cite">{n}</span>;

/** A row of a small card: a caption on the left, a value on the right. */
const Row = ({ label, children, tone }: { label: string; children: ReactNode; tone?: string }) => (
  <div className="pp-lp-row" data-tone={tone}>
    <span>{label}</span>
    <b>{children}</b>
  </div>
);

function ProblemScene() {
  return (
    <Frame label="A payment record that shows the money but not what was agreed or delivered">
      <div className="pp-lp-card">
        <Row label="Payment received">600.00 USD</Row>
        <Row label="What was agreed" tone="gap">
          Not on record
        </Row>
        <Row label="What was delivered" tone="gap">
          Not on record
        </Row>
        <Row label="Dispute opened" tone="alert">
          Respond in 3 days
        </Row>
      </div>
      <p className="pp-lp-note">The proof is somewhere in 214 chat messages.</p>
    </Frame>
  );
}

const SOURCES = ["Pasted chat", "Uploaded export", "Forwarded email", "Live chat"];

function CaptureScene() {
  return (
    <Frame label="Four ways a deal arrives, all leading into one deal">
      <ul className="pp-lp-sources">
        {SOURCES.map((source, i) => (
          <li key={source} style={at(i)}>
            {source}
          </li>
        ))}
      </ul>
      <div className="pp-lp-card">
        <header>
          <Avatar name="Chris Okafor" />
          <b>Book cover, The Long Tide</b>
        </header>
        <Row label="Messages">214, each with its time</Row>
        <Row label="Files">3 references</Row>
      </div>
    </Frame>
  );
}

const CHAT_LINES = [
  "Cover by the 28th, print and web sizes",
  "Two revision rounds, 600 in three parts",
  "Square web version too",
];

function ScopeScene() {
  return (
    <Frame label="Chat lines on the left, each agreement field citing the line it came from">
      <ol className="pp-lp-lines">
        {CHAT_LINES.map((line, i) => (
          <li key={line} style={at(i)}>
            {line}
          </li>
        ))}
      </ol>
      <div className="pp-lp-card">
        <Row label="Due">
          28 Nov <Cite n={1} />
        </Row>
        <Row label="Revisions">
          2 included <Cite n={2} />
        </Row>
        <Row label="Usage rights" tone="gap">
          Not in the chat. Left blank.
        </Row>
        <div className="pp-lp-flag">
          <b>“print ready” is vague</b>
          <span>Suggested: 6 × 9 in at 300 dpi, CMYK PDF with bleed</span>
        </div>
      </div>
    </Frame>
  );
}

function AgreeScene() {
  return (
    <Frame label="The buyer's signing page with the key terms, a typed name and a receipt">
      <div className="pp-lp-card">
        <header>
          <b>Terms to agree to</b>
          <StatusBadge status="awaiting">Waiting for you</StatusBadge>
        </header>
        <Row label="Total">600.00 USD in 3 parts</Row>
        <Row label="Due">28 Nov 2026</Row>
        <div className="pp-lp-sign">
          <span className="pp-lp-typed">Chris Okafor</span>
          <span className="pp-button pp-button-primary">I agree and sign</span>
        </div>
      </div>
      <p className="pp-lp-receipt">
        Receipt sent to both sides · fingerprint <code>4be1…7d7d</code>
      </p>
    </Frame>
  );
}

const STAGES: { title: string; amount: string; status: string; tone?: string }[] = [
  { title: "Deposit", amount: "200.00", status: "Paid", tone: "done" },
  { title: "Sketch approved", amount: "200.00", status: "Invoice sent" },
  { title: "Final files", amount: "200.00", status: "Not invoiced yet", tone: "gap" },
];

function PaidScene() {
  return (
    <Frame label="Three PayPal invoices, one for each agreed milestone">
      <div className="pp-lp-card">
        <header>
          <b>Payment stages</b>
        </header>
        {STAGES.map((stage) => (
          <Row key={stage.title} label={`${stage.title} · ${stage.amount} USD`} tone={stage.tone}>
            {stage.status}
          </Row>
        ))}
      </div>
    </Frame>
  );
}

const STEPS = ["Deposit", "References", "Sketch", "Final files"];

function DeliverScene() {
  return (
    <Frame label="A delivery that was opened and downloaded, with the timeline steps ticking off">
      <ol className="pp-lp-steps">
        {STEPS.map((step, i) => (
          <li key={step} style={at(i)}>
            <span aria-hidden="true">{i + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      <div className="pp-lp-card">
        <header>
          <b>cover-final.pdf</b>
          <StatusBadge status="delivered">Delivered</StatusBadge>
        </header>
        <Row label="Opened">2 times</Row>
        <Row label="Downloaded">27 Nov, 18:04</Row>
        <Row label="Revision rounds">1 of 2 used</Row>
      </div>
    </Frame>
  );
}

const ENTRIES = [
  ["Agreement v2 signed by Chris", "9f2c"],
  ["Deposit paid, 200.00 USD", "71ae"],
  ["Sketch shared for review", "c04d"],
  ["Sketch approved by Chris", "5be8"],
  ["Final files delivered", "e219"],
] as const;

/** The trust moment: one entry changes, and the chain breaks from there on. */
function LedgerScene() {
  return (
    <Frame label="An evidence log where changing one entry breaks the chain from that entry on">
      <ol className="pp-lp-chain">
        {ENTRIES.map(([text, hash], i) => (
          <li key={hash} data-after={i > 2} data-changed={i === 2}>
            <span className="pp-lp-entry">
              {text}
              {i === 2 && <span className="pp-lp-edit">Sketch never shared</span>}
            </span>
            <code>{hash}…</code>
          </li>
        ))}
      </ol>
      <p className="pp-lp-check">
        <span>All 5 entries match their fingerprints</span>
        <span>Changed at entry 3: the chain no longer matches</span>
      </p>
    </Frame>
  );
}

function DisputeScene() {
  return (
    <Frame label="A buyer's claim matched to the record, with one statement no record covers">
      <div className="pp-lp-card pp-lp-claim">
        <p>“The cover is not the size we agreed.”</p>
        <Row label="Agreement line 4 · log entry 12" tone="done">
          Covered
        </Row>
      </div>
      <div className="pp-lp-card pp-lp-claim">
        <p>“You promised a back cover.”</p>
        <Row label="Agreement and log" tone="gap">
          No record covers this
        </Row>
      </div>
      <p className="pp-lp-note">
        Evidence packet ready, 4 exhibits. You confirm before it is sent.
      </p>
    </Frame>
  );
}

function ScoreScene() {
  return (
    <Frame label="A records completeness score filling up as steps are recorded">
      <div className="pp-lp-gauge">
        <span className="pp-lp-score" />
        <small>of 100</small>
      </div>
      <p className="pp-lp-note">Records complete. Not a prediction of any outcome.</p>
    </Frame>
  );
}

export const SCENES: Record<SceneId, () => ReactNode> = {
  problem: ProblemScene,
  capture: CaptureScene,
  scope: ScopeScene,
  agree: AgreeScene,
  paid: PaidScene,
  deliver: DeliverScene,
  ledger: LedgerScene,
  dispute: DisputeScene,
  score: ScoreScene,
};
