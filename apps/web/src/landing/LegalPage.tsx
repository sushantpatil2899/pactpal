import { CONTACT } from "../shell/contact";

const PAGES = {
  privacy: {
    title: "Privacy",
    lines: [
      "When you sign in with PayPal, PayPal shares your name, your email address and your PayPal account's id with PactPal. Your password stays with PayPal.",
      "Deals hold what you and your buyer put in them: messages, files, the agreement, signatures, payment and delivery records. Each is kept in the deal's evidence log.",
      "Buyers do not create an account. When a buyer signs, PactPal records the time, their internet address and their browser with the signature.",
      "PactPal uses AI models to draft agreements and dispute notes from a deal's contents. Those drafts are shown to the seller, who decides what is sent.",
    ],
  },
  terms: {
    title: "Terms",
    lines: [
      "PactPal is a record keeping tool for sellers paid through PayPal. It is not a law firm, does not give legal advice and is not escrow.",
      "PactPal does not predict or promise the outcome of any dispute. A records completeness score measures how complete a deal's records are, nothing more.",
      "Everything an AI model drafts is a draft. You review and confirm it before it is sent to a buyer or to PayPal.",
      "PactPal currently runs in test mode. No real money moves.",
    ],
  },
} as const;

/**
 * The privacy and terms pages: short and plain, and marked as a first version until the owner
 * publishes the full text. They claim nothing that has not been decided (no retention period).
 */
export function LegalPage({ page }: { page: keyof typeof PAGES }) {
  const { title, lines } = PAGES[page];
  return (
    <article className="pp-legal" aria-labelledby="pp-legal-title">
      <p>
        <a href="/">Back to PactPal</a>
      </p>
      <h1 id="pp-legal-title">{title}</h1>
      <p data-tone="note-block">A first, short version. The full text will replace it.</p>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
      <p>
        Questions: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>
    </article>
  );
}
