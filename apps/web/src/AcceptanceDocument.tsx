import type { AcceptanceDocument as Document } from "./api";
import { Field, Card } from "./design/parts";
import { ScopeDetails } from "./ScopeDetails";

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
      <Card className="pp-terms">
        <header>
          <h4 className="pp-terms-title">{document.title}</h4>
          <div className="pp-facts">
            <Field caption="Seller">{document.sellerName}</Field>
            <Field caption="Category">{document.category}</Field>
          </div>
        </header>
        <div>
          <ScopeDetails scope={document.terms} dealId={document.dealId} />
        </div>
        <aside aria-labelledby="acceptance-notice" className="pp-notice">
          <h4 id="acceptance-notice">{document.notice.title}</h4>
          <ul>
            {document.notice.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </aside>
        <p className="pp-fingerprint">
          Page fingerprint (SHA-256): <code>{documentSha256}</code>
        </p>
      </Card>
    </article>
  );
}
