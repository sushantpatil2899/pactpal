import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { checkChain, sealChain, shortHash, type DemoEntry, type EntryCheck } from "./ledger-chain";

const ENTRIES: readonly DemoEntry[] = [
  { type: "ACCEPTED", actor: "Chris", at: "2 Nov, 11:00", text: "Signed agreement version 2" },
  {
    type: "PAYMENT_RECEIVED",
    actor: "PayPal",
    at: "4 Nov, 10:00",
    text: "Deposit paid, 200.00 USD",
  },
  {
    type: "STEP_SUBMITTED",
    actor: "Maya",
    at: "11 Nov, 15:00",
    text: "Pencil sketch shared for review",
  },
  { type: "STEP_APPROVED", actor: "Chris", at: "12 Nov, 09:40", text: "Sketch approved by Chris" },
  { type: "DELIVERY_SENT", actor: "Maya", at: "27 Nov, 18:02", text: "cover-final.pdf, 8.2 MB" },
  { type: "DELIVERY_OPENED", actor: "Chris", at: "27 Nov, 18:04", text: "Opened and downloaded" },
];

/** The edit the page makes by itself if the visitor has not tried one: the approval, rewritten. */
const DEMO = { at: 3, text: "Sketch never shared" };
const STEP_MS = 320;
const TYPE_MS = 55;

const CHECK_WORDS: Record<EntryCheck, string> = {
  sealed: "Matches",
  changed: "Changed",
  after: "Can't be trusted",
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The trust moment, for real: six entries of a deal's log, sealed with SHA-256 in the visitor's
 * own browser. Any entry can be edited; checking the log walks down the chain and stops at the
 * first entry whose hash no longer matches what was recorded.
 */
export function Ledger() {
  const [texts, setTexts] = useState(() => ENTRIES.map((entry) => entry.text));
  const [recorded, setRecorded] = useState<string[]>([]);
  const [now, setNow] = useState<string[]>([]);
  // How far the check has walked (-1 before it starts) and whether it has finished.
  const [scan, setScan] = useState({ at: -1, done: false });
  const touched = useRef(false);
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    void sealChain(ENTRIES).then((hashes) => {
      setRecorded(hashes);
      setNow(hashes);
    });
  }, []);

  useEffect(() => {
    let current = true;
    void sealChain(ENTRIES.map((entry, i) => ({ ...entry, text: texts[i] ?? entry.text }))).then(
      (hashes) => {
        if (current) setNow(hashes);
      },
    );
    return () => {
      current = false;
    };
  }, [texts]);

  const checks = recorded.length === 0 ? [] : checkChain(recorded, now);
  const changedAt = checks.indexOf("changed");

  const runCheck = useCallback(async () => {
    setScan({ at: -1, done: false });
    for (let i = 0; i < ENTRIES.length; i++) {
      setScan({ at: i, done: false });
      await wait(STEP_MS);
    }
    setScan({ at: ENTRIES.length, done: true });
  }, []);

  const edit = (i: number, text: string) => {
    setTexts((all) => all.map((t, j) => (j === i ? text : t)));
    setScan({ at: -1, done: false });
  };

  // If the visitor has not touched it by the time it is in view, the page makes the edit itself.
  useEffect(() => {
    const el = section.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stopped = false;
    const watch = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        watch.disconnect();
        void (async () => {
          await wait(1400);
          const from = ENTRIES[DEMO.at]?.text ?? "";
          for (let n = from.length; n >= 0 && !stopped && !touched.current; n--) {
            edit(DEMO.at, from.slice(0, n));
            await wait(TYPE_MS / 2);
          }
          for (let n = 1; n <= DEMO.text.length && !stopped && !touched.current; n++) {
            edit(DEMO.at, DEMO.text.slice(0, n));
            await wait(TYPE_MS);
          }
          if (!stopped && !touched.current) {
            await wait(500);
            await runCheck();
          }
        })();
      },
      { threshold: 0.45 },
    );
    watch.observe(el);
    return () => {
      stopped = true;
      watch.disconnect();
    };
  }, [runCheck]);

  const reset = () => {
    touched.current = true;
    setTexts(ENTRIES.map((entry) => entry.text));
    setScan({ at: -1, done: false });
  };

  const verdict =
    changedAt === -1
      ? `All ${String(ENTRIES.length)} entries match their fingerprints.`
      : `Changed at entry ${String(changedAt + 1)}. The chain no longer matches from there on.`;

  return (
    <section ref={section} className="pp-lp-ledger pp-scope-dark" aria-labelledby="pp-lp-ledger">
      <div className="pp-lp-ledger-copy" data-reveal>
        <p className="pp-lp-kicker">
          <i /> The evidence log
        </p>
        <h2 id="pp-lp-ledger" className="pp-lp-display">
          Change one entry.
          <br />
          <em>Watch the chain break.</em>
        </h2>
        <p>
          Every message, signature, PayPal payment and delivery is written to an append only log.
          Each entry carries the SHA-256 fingerprint of the one before it, so editing, backdating or
          deleting anything breaks the chain at that exact entry, for anyone who checks.
        </p>
        <p className="pp-lp-try">
          Try it: edit any line on the right. The hashing runs in your browser, for real.
        </p>
        <div className="pp-lp-ledger-actions">
          <button
            type="button"
            className="pp-button pp-button-primary"
            onClick={() => {
              touched.current = true;
              void runCheck();
            }}
          >
            Check this log
          </button>
          <button type="button" className="pp-button" onClick={reset}>
            Put it back
          </button>
        </div>
        <p
          className="pp-lp-verdict"
          role="status"
          data-state={scan.done ? (changedAt === -1 ? "ok" : "broken") : "idle"}
        >
          {scan.done ? verdict : scan.at >= 0 ? `Checking entry ${String(scan.at + 1)}…` : " "}
        </p>
      </div>
      <ol className="pp-lp-chainlist">
        {ENTRIES.map((entry, i) => {
          const check = checks[i] ?? "sealed";
          const scanned = scan.at > i || scan.done;
          const shown = scanned || check === "changed" ? check : "sealed";
          return (
            <li
              key={entry.type + entry.at}
              data-check={shown}
              data-scanning={scan.at === i && !scan.done}
              style={{ "--i": i } as CSSProperties}
            >
              <header>
                <b>#{String(415 + i).padStart(4, "0")}</b>
                <span>{entry.type}</span>
                <small>
                  {entry.actor} · {entry.at}
                </small>
                <em>{scanned ? CHECK_WORDS[check] : check === "changed" ? "Edited" : "Sealed"}</em>
              </header>
              <label>
                <span className="pp-hidden">Entry {i + 1}</span>
                <input
                  value={texts[i] ?? ""}
                  spellCheck={false}
                  onChange={(event) => {
                    touched.current = true;
                    edit(i, event.target.value);
                  }}
                />
              </label>
              <footer>
                <span>prev {shortHash(i === 0 ? "0".repeat(64) : (recorded[i - 1] ?? ""))}</span>
                <span>
                  hash <code>{shortHash(now[i] ?? "")}</code>
                  {now[i] !== recorded[i] && <s>{shortHash(recorded[i] ?? "")}</s>}
                </span>
              </footer>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
