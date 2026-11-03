import { useEffect, useState } from "react";
import { getCompleteness, type CompletenessItem, type CompletenessView } from "./api";
import { WRAP } from "./styles";

const points = (item: CompletenessItem) => `${String(item.earned)} of ${String(item.points)}`;

/**
 * The seller's evidence completeness score: what helps, what is missing and how to fix it, and
 * what PactPal cannot measure yet. Read again whenever the evidence log grows (`logLength`).
 */
export function CompletenessPanel({ dealId, logLength }: { dealId: string; logLength: number }) {
  const [view, setView] = useState<CompletenessView | undefined>();
  const [problem, setProblem] = useState<string | undefined>();
  useEffect(() => {
    getCompleteness(dealId).then(
      (loaded) => {
        setView(loaded);
        setProblem(undefined);
      },
      (error: unknown) => {
        setProblem(error instanceof Error ? error.message : "Could not load the score.");
      },
    );
  }, [dealId, logLength]);

  if (problem) return <p role="alert">{problem}</p>;
  if (!view) return null;
  const helping = view.items.filter((item) => item.status === "helping");
  const missing = view.items.filter((item) => item.status === "missing");
  const later = view.items.filter((item) => item.status === "not-measured");
  const laterPoints = later.reduce((sum, item) => sum + item.points, 0);
  return (
    <section aria-labelledby="completeness" style={WRAP}>
      <h3 id="completeness">Evidence completeness: {view.score} / 100</h3>
      <p>
        How complete this deal&apos;s records are. It does not predict the outcome of any dispute.
      </p>
      {helping.length > 0 && (
        <>
          <h4>Helping</h4>
          <ul>
            {helping.map((item) => (
              <li key={item.id}>
                ✓ {item.label} ({points(item)})
              </li>
            ))}
          </ul>
        </>
      )}
      {missing.length > 0 && (
        <>
          <h4>Missing, and how to fix it</h4>
          <ul>
            {missing.map((item) => (
              <li key={item.id}>
                {item.label}: {item.detail} ({points(item)}). {item.fix}
              </li>
            ))}
          </ul>
        </>
      )}
      {later.length > 0 && (
        <details>
          <summary>Not measured yet ({laterPoints} points)</summary>
          <ul>
            {later.map((item) => (
              <li key={item.id}>
                {item.label} ({item.points}): {item.fix}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
