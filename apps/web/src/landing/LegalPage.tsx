import { useEffect } from "react";
import { helpPage } from "../shell/contact";

/** The website's privacy and terms addresses open their pages in PactPal help, kept in one place. */
const PAGES = {
  privacy: { title: "Privacy", help: "privacy" },
  terms: { title: "What PactPal is and is not", help: "limits" },
} as const;

/**
 * `/privacy` and `/terms` send the visitor on to the help site's page, where the full text lives
 * (docs/help), so there is one text to keep right. A link stays in case the move is blocked.
 */
export function LegalPage({ page }: { page: keyof typeof PAGES }) {
  const { title, help } = PAGES[page];
  const to = helpPage(help);
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return (
    <article className="pp-legal" aria-labelledby="pp-legal-title">
      <h1 id="pp-legal-title">{title}</h1>
      <p>
        Opening <a href={to}>{title} in PactPal help</a>…
      </p>
    </article>
  );
}
