import type { DeliveryCheckView } from "./api";
import { VERDICT_WORDS, factsWords, requirementWords } from "./check-words";
import { when } from "./format";
import { WRAP } from "./styles";

/**
 * One pre-delivery check: what code read from each file, then for each line what code checked
 * and what the automatic look saw. Advice for the seller only; it never stops a delivery.
 */
export function DeliveryCheckReport({ check }: { check: DeliveryCheckView }) {
  const { report } = check;
  const nameOf = (fileId: string) =>
    report.files.find((f) => f.fileId === fileId)?.filename ?? "a file";
  return (
    <div style={WRAP}>
      <p>
        <strong>Pre-delivery check</strong> (advice for you only; the buyer does not see it), stage{" "}
        {check.stage}, {when(check.checkedAt)}
      </p>
      <ul>
        {report.files.map((f) => (
          <li key={f.fileId}>
            {f.filename}: {factsWords(f.facts)}
          </li>
        ))}
      </ul>
      {report.lines.length === 0 && (
        <p>
          No delivered line is marked &ldquo;can be checked&rdquo; or left unmarked, so there is
          nothing to check.
        </p>
      )}
      {report.lines.map((line) => {
        const code = report.code.find((c) => c.line === line.n)?.results ?? [];
        return (
          <div key={line.n}>
            <p>
              <strong>Line {line.n}:</strong> &ldquo;{line.text}&rdquo;
            </p>
            <ul>
              <li>
                Checked by code:{" "}
                {code.length === 0
                  ? "nothing here for code to check."
                  : code.map(requirementWords).join(" · ")}
              </li>
              {report.looks.map((result) =>
                "unavailable" in result ? (
                  <li key={result.fileId}>
                    Automatic look: not available for {nameOf(result.fileId)}.
                  </li>
                ) : (
                  result.look.lines
                    .filter((l) => l.line === line.n)
                    .map((l) => (
                      <li key={result.fileId}>
                        Automatic look at {nameOf(result.fileId)} (may be wrong):{" "}
                        <strong>{VERDICT_WORDS[l.verdict]}</strong>
                        {l.note === "" ? "" : `: "${l.note}"`}
                      </li>
                    ))
                ),
              )}
            </ul>
          </div>
        );
      })}
      <p>
        <small>A check never stops you sending.</small>
      </p>
    </div>
  );
}
