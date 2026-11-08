import { stepLine } from "@pactpal/words";
import { useEffect, useState } from "react";
import { getScope, type ScopeView } from "./api";

/**
 * The deal's timeline (7f): every agreed step in order, from the newest version, saying whether
 * the buyer has signed it yet. Payment and delivery details follow below it on the tab.
 */
export function TimelineTab({
  dealId,
  revision,
  signed,
}: {
  dealId: string;
  revision: number;
  signed: boolean;
}) {
  const [scope, setScope] = useState<ScopeView | null | undefined>();
  useEffect(() => {
    getScope(dealId).then(setScope, () => {
      setScope(null);
    });
  }, [dealId, revision]);
  if (scope === undefined) return <p aria-busy="true">Loading the timeline…</p>;
  return (
    <section aria-labelledby="timeline-heading">
      <h3 id="timeline-heading">Timeline</h3>
      {scope === null ? (
        <p>No agreement yet: the timeline appears once the seller writes the agreed work.</p>
      ) : (
        <>
          <p>
            Version {scope.version} · {signed ? "signed by the buyer" : "not signed yet"}
          </p>
          <ol style={{ listStyle: "none", paddingLeft: 0 }}>
            {scope.steps.map((step) => (
              <li key={step.n} style={{ margin: "0.4rem 0" }}>
                {stepLine(step, scope.currency)}
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
