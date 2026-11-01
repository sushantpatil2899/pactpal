import type { ScopeTerms } from "./api";

/** A date (YYYY-MM-DD) as people read it, e.g. "20 Nov 2026". */
export const dateOf = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    dateStyle: "medium",
    timeZone: "UTC",
  });

/** A version's terms, read-only: shown on the deal page and on the acceptance page. */
export function ScopeDetails({ scope }: { scope: ScopeTerms }) {
  return (
    <>
      <p>
        Version {scope.version} ·{" "}
        <code title="Fingerprint (SHA-256) of this version">
          {scope.contentSha256.slice(0, 12)}…
        </code>
      </p>
      <p>{scope.summary}</p>
      <h4>What will be delivered</h4>
      <ul>
        {scope.deliverables.map((item, n) => (
          <li key={n}>{item}</li>
        ))}
      </ul>
      {scope.exclusions.length > 0 && (
        <>
          <h4>Not included</h4>
          <ul>
            {scope.exclusions.map((item, n) => (
              <li key={n}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {scope.revisionsIncluded !== null && <p>Revisions included: {scope.revisionsIncluded}</p>}
      {scope.dueDate !== null && <p>Due: {dateOf(scope.dueDate)}</p>}
      <table>
        <caption>Payment stages</caption>
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Amount ({scope.currency})</th>
            <th scope="col">Due</th>
          </tr>
        </thead>
        <tbody>
          {scope.milestones.map((stage, n) => (
            <tr key={n}>
              <td>{stage.title}</td>
              <td>{stage.amount.text}</td>
              <td>{stage.dueDate === null ? "—" : dateOf(stage.dueDate)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{scope.total.text}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </>
  );
}
