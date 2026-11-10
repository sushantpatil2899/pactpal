/**
 * The landing page's words. Kept here, apart from the layout, so the honesty rules in
 * docs/product.md can be checked in one place: no promise of any dispute outcome, no "legally
 * binding", no prediction, and PayPal named only as the service sellers are paid through.
 */

/** The story told down the page; each step has a scene drawn beside it. */
export type SceneId =
  "problem" | "capture" | "scope" | "agree" | "paid" | "deliver" | "ledger" | "dispute" | "score";

export interface StoryStep {
  id: SceneId;
  /** The anchor the navigation links to, when the step starts a part of the page. */
  anchor?: string;
  eyebrow: string;
  title: string;
  body: string;
  points?: readonly string[];
}

export const HERO = {
  lede: "A council of AI models drafts your agreement from the chat and checks each other's work. PayPal moves the money. Every step is sealed into a chain nobody can quietly edit.",
} as const;

export const STORY: readonly StoryStep[] = [
  {
    id: "problem",
    eyebrow: "The problem",
    title: "PayPal knows the money moved. Not what you agreed.",
    body: "The terms live in a chat, an email thread or a platform inbox. When a buyer opens a dispute, you have days to rebuild the story from screenshots, under a deadline, and the record is only as good as what you can still find.",
  },
  {
    id: "capture",
    eyebrow: "1 · Capture",
    title: "Start from wherever the deal was made.",
    body: "Paste a chat, upload an export, forward an email to the deal's own address, or talk in the deal's live chat. Every message and file is kept with the time it arrived.",
  },
  {
    id: "scope",
    eyebrow: "2 · Scope",
    title: "An agreement drafted from the chat, line by line.",
    body: "Several AI models draft the scope and rank each other's drafts. Every field cites the exact line it came from. Anything nobody said stays blank, and vague words like “print ready” are flagged with a measurable rewrite.",
    points: [
      "Low agreement between the models goes to you for review",
      "Nothing reaches the buyer until you confirm it",
    ],
  },
  {
    id: "agree",
    eyebrow: "3 · Agree",
    title: "The buyer reads every term on one page and signs.",
    body: "No account and no password. They open the link in their email, ask questions or request changes, type their name and sign. Both sides get a receipt with the page's fingerprint.",
  },
  {
    id: "paid",
    anchor: "get",
    eyebrow: "4 · Get paid",
    title: "One PayPal invoice for each milestone you agreed.",
    body: "The amounts and due days come from the signed agreement, so the invoice matches the terms. Payments land in your own PayPal account; PactPal never holds the money.",
  },
  {
    id: "deliver",
    eyebrow: "5 · Deliver",
    title: "A delivery link that records what happened.",
    body: "When the buyer opens or downloads your files, it is recorded. They approve the work or ask for changes, within the revision rounds you agreed, and each step on the timeline is ticked off.",
  },
  {
    id: "ledger",
    eyebrow: "6 · The record",
    title: "A log where every entry seals the one before it.",
    body: "Each message, signature, payment and delivery is written to an append only log, and each entry carries the fingerprint of the last. Change one entry and the chain breaks at that exact point, for anyone who checks.",
  },
  {
    id: "dispute",
    eyebrow: "7 · If a dispute opens",
    title: "The claim, matched statement by statement to the record.",
    body: "PactPal shows which agreement lines and log entries speak to each thing the buyer says, or plainly that no record covers it. It builds an evidence packet that you review and confirm before anything goes to PayPal.",
    points: [
      "If PayPal decides for the buyer, an appeal is drafted only when there is evidence that was not sent before",
      "When there is none, PactPal says so",
    ],
  },
  {
    id: "score",
    eyebrow: "8 · Completeness",
    title: "See how complete your records are, at a glance.",
    body: "A score from 0 to 100 fills as steps are recorded: a signed agreement, paid invoices, delivered files, answers. It measures how complete the record is. It does not predict any outcome.",
  },
];

export const TAGLINE =
  "Every term traced to the chat it came from. Every step sealed in a record nobody can quietly edit.";

export const AUDIENCE = {
  fits: [
    "Digital art and design",
    "Writing and translation",
    "Web and software projects",
    "Video and photo editing",
    "Consulting",
    "Templates and digital products",
    "Handmade goods",
  ],
  notYet: ["Regulated professional services", "Subscriptions", "Deposits for events"],
} as const;

/** What PactPal is and is not, said plainly. */
export const LIMITS: readonly { title: string; body: string }[] = [
  {
    title: "A record keeper, not a lawyer",
    body: "PactPal is not a law firm, gives no legal advice and is not escrow. It records what was agreed, paid and delivered.",
  },
  {
    title: "AI drafts, you decide",
    body: "Every AI answer is a draft. Each term cites its source or stays blank, and you confirm before anything is sent to a buyer or to PayPal.",
  },
  {
    title: "No promises about disputes",
    body: "PactPal never predicts or promises how a dispute ends. It shows what the record holds and where it has gaps.",
  },
  {
    title: "Sign in shows an account, not an identity",
    body: "Signing in with PayPal shows you control a PayPal account. It is not proof of legal identity.",
  },
  {
    title: "Only the data it needs",
    body: "From PayPal: your name, your email and your account id. Your password stays with PayPal. Deals hold what you and your buyer put in them.",
  },
  {
    title: "Test mode for now",
    body: "PactPal currently runs in test mode. No real money moves.",
  },
];

export const FAQ: readonly { q: string; a: string }[] = [
  {
    q: "Do my buyers need an account?",
    a: "No. Each buyer gets one link by email. It opens their deal, where they read the terms, ask questions, sign, pay and approve deliveries.",
  },
  {
    q: "Does PactPal hold the money?",
    a: "No. Payments go through PayPal invoices straight to your own PayPal account. PactPal is not escrow and never touches the funds.",
  },
  {
    q: "Will PactPal win my dispute?",
    a: "Nobody can promise that, and PactPal does not try. It puts what the record shows next to each part of the claim, says where nothing covers it, and builds the packet you choose to send.",
  },
  {
    q: "What does the AI decide?",
    a: "Nothing on its own. It drafts. Every term points to the line it came from or stays blank, models that disagree are flagged for review, and you confirm before anything is sent.",
  },
  {
    q: "Is a signed PactPal agreement a contract?",
    a: "PactPal records what each side agreed to and when, with fingerprints that show the page was not changed. It is not a law firm, so it cannot tell you how that record is treated where you and your buyer are.",
  },
  {
    q: "What if the work changes halfway?",
    a: "Either side can propose a change order. Once both agree, the new version of the agreement and its timeline replace the old one, and both versions stay in the record.",
  },
  {
    q: "What does it cost?",
    a: "PactPal currently runs in test mode and no real money moves. Pricing will be set before it handles real payments.",
  },
  {
    q: "Which kinds of work does it suit?",
    a: "Work agreed in a conversation and delivered in steps: design, writing, software, editing, consulting, digital products and handmade goods. Regulated professional services, subscriptions and event deposits are not supported yet.",
  },
];

/** The tagline split into words, each with its place, for the word by word reveal. */
export function revealWords(text: string): { word: string; i: number }[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word, i) => ({ word, i }));
}

/** The ledger entries that run along the foot of the hero: invented, in the app's own words. */
export const TICKER: readonly { event: string; detail: string; hash: string }[] = [
  { event: "MESSAGE_SENT", detail: "Chris · live chat", hash: "9f2c…a71e" },
  { event: "SCOPE_CONFIRMED", detail: "council 4 of 5 agreed", hash: "71ae…c04d" },
  { event: "ACCEPTED", detail: "typed name, receipt sent", hash: "c04d…5be8" },
  { event: "INVOICE_SENT", detail: "PayPal invoice, stage 1", hash: "5be8…e219" },
  { event: "PAYMENT_RECEIVED", detail: "PayPal webhook, verified", hash: "e219…a7d3" },
  { event: "DELIVERY_SENT", detail: "cover-final.pdf, 8.2 MB", hash: "a7d3…3c91" },
  { event: "DELIVERY_OPENED", detail: "buyer, 2 times", hash: "3c91…b40f" },
  { event: "STEP_APPROVED", detail: "sketch, by Chris", hash: "b40f…68ea" },
];
