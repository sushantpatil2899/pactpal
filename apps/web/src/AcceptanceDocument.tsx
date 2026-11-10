import type { AcceptanceDocument as Document } from "./api";
import { ScopeDetails } from "./ScopeDetails";
import { WRAP } from "./styles";

/**
 * Exactly what the buyer is asked to agree to, drawn only from the acceptance document, so what
 * the page shows is what is fingerprinted. Used for the seller's preview and the buyer's page.
 */
export function AcceptanceDocument({
  document,
  documentSha256,
}: {
  document: Document;
  documentSha256: string;
}) {
  return (
    <article aria-label="Terms to agree to">
      <h4>{document.title}</h4>
      <p>
        Seller: {document.sellerName} · {document.category}
      </p>
      <ScopeDetails scope={document.terms} dealId={document.dealId} />
      <aside
        aria-labelledby="acceptance-notice"
        style={{ borderLeft: "3px solid #888", paddingLeft: 12 }}
      >
        <h4 id="acceptance-notice">{document.notice.title}</h4>
        <ul>
          {document.notice.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </aside>
      <p style={WRAP}>
        Page fingerprint (SHA-256): <code>{documentSha256}</code>
      </p>
    </article>
  );
}
