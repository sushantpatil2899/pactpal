import type { CouncilView } from "./api";
import { CouncilPanel, ReviewFlag } from "./CouncilPanel";

/**
 * A council draft of cited sentences and a note (5f summary, 5i-2 appeal statement): each sentence
 * with the log entries it rests on, the note, and how the council worked.
 */
export function CitedDraft({
  council,
  sentences,
  note,
  noteLabel,
}: {
  council: CouncilView | null;
  sentences: readonly { text: string; record: readonly { n: number; text: string }[] }[];
  note: string;
  noteLabel: string;
}) {
  return (
    <>
      <ReviewFlag council={council} />
      <ol>
        {sentences.map((sentence, i) => (
          <li key={i}>
            {sentence.text}{" "}
            <small>
              (
              {sentence.record.length === 0
                ? "no log entry"
                : `log entries: ${sentence.record.map((entry) => entry.text).join("; ")}`}
              )
            </small>
          </li>
        ))}
      </ol>
      <p>
        <strong>{noteLabel}</strong> (you can change it before anything is sent):
      </p>
      <blockquote style={{ whiteSpace: "pre-wrap" }}>{note}</blockquote>
      {council !== null && <CouncilPanel council={council} />}
    </>
  );
}
