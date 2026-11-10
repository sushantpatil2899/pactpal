/**
 * The landing page's words. Kept here, apart from the layout, so the honesty rules in
 * docs/product.md can be checked in one place: no promise of any dispute outcome, no "legally
 * binding", no prediction, and PayPal named only as the service sellers are paid through.
 */

export const HERO = {
  lede: "A council of AI models drafts your agreement from the chat and checks each other's work. PayPal moves the money. Every step is sealed into a chain nobody can quietly edit.",
} as const;

/** Who sells through PactPal: cycled in the hero's line, one at a time. */
export const TRADES = [
  "logo designer",
  "translator",
  "app developer",
  "video editor",
  "illustrator",
  "candle maker",
  "consultant",
  "template seller",
  "photo retoucher",
  "jewellery maker",
  "copywriter",
  "web designer",
] as const;

/** The four things every deal gets, said before anything is explained. */
export const PILLARS = [
  {
    id: "draft",
    title: "An agreement drafted from the chat",
    body: "Five AI models read your conversation and draft the terms. Every term cites the line it came from, or stays blank.",
    link: "#council",
  },
  {
    id: "paid",
    title: "Paid through PayPal, milestone by milestone",
    body: "One PayPal invoice for each agreed stage, straight to your own PayPal account. Payments land in the record as they happen.",
    link: "#how",
  },
  {
    id: "sealed",
    title: "A record nobody can quietly edit",
    body: "Every message, signature, payment and delivery is sealed into a chain of SHA-256 fingerprints. Change one and it shows.",
    link: "#ledger",
  },
  {
    id: "dispute",
    title: "Ready if a buyer disputes",
    body: "PactPal spots the dispute, counts down to PayPal's deadline, matches the claim to the record and builds the packet you confirm.",
    link: "#how",
  },
] as const;

/** The trades drifting around "who it's for", each with a deal it might send through PactPal. */
export const STICKERS = [
  {
    trade: "Logo designer",
    icon: "pen",
    deal: "Logo refresh",
    amount: "450.00 USD",
    steps: "3 stages",
  },
  {
    trade: "Video editor",
    icon: "film",
    deal: "Podcast edit, ep. 12",
    amount: "180.00 USD",
    steps: "2 stages",
  },
  {
    trade: "App developer",
    icon: "code",
    deal: "Booking app MVP",
    amount: "3,200.00 USD",
    steps: "5 stages",
  },
  {
    trade: "Jewellery maker",
    icon: "ring",
    deal: "Silver ring, size 7",
    amount: "95.00 USD",
    steps: "made and shipped",
  },
  {
    trade: "Translator",
    icon: "speech",
    deal: "Blog translation, 6 posts",
    amount: "540.00 USD",
    steps: "2 stages",
  },
  {
    trade: "Photographer",
    icon: "camera",
    deal: "Product photos, 40 images",
    amount: "1,200.00 USD",
    steps: "3 stages",
  },
  {
    trade: "Template seller",
    icon: "grid",
    deal: "Notion client portal",
    amount: "39.00 USD",
    steps: "one download",
  },
  {
    trade: "Consultant",
    icon: "chart",
    deal: "Pricing review",
    amount: "750.00 USD",
    steps: "2 sessions",
  },
  {
    trade: "Candle maker",
    icon: "flame",
    deal: "Wedding favours, 80 candles",
    amount: "620.00 USD",
    steps: "deposit and balance",
  },
] as const;

export type StickerIcon = (typeof STICKERS)[number]["icon"];

/** How a deal goes, in five moves. */
export const MOVES = [
  {
    id: "capture",
    word: "Capture",
    title: "Start from wherever you agreed it",
    body: "Paste the chat, upload an export or a screenshot, forward the email, or talk in the deal's live chat. Every message keeps its time.",
  },
  {
    id: "agree",
    word: "Agree",
    title: "Your buyer reads it all and signs",
    body: "The council's draft, checked by you, goes to your buyer as one page. No account: they ask questions, type their name and sign.",
  },
  {
    id: "paid",
    word: "Get paid",
    title: "An invoice for every stage",
    body: "PayPal invoices for each milestone, with amounts and due days from the signed terms. Reminders go out before anything is late.",
  },
  {
    id: "deliver",
    word: "Deliver",
    title: "Hand over work that proves itself",
    body: "Send files through a tracked link. Opens and downloads are recorded, and your buyer approves or asks for changes within the agreed rounds.",
  },
  {
    id: "protected",
    word: "Protected",
    title: "If a dispute opens, you're ready",
    body: "PactPal sees it through PayPal, counts down to the deadline, lines the claim up against the record and builds the packet you send.",
  },
] as const;

export const TAGLINE =
  "Every term traced to the chat it came from. Every step sealed in a record nobody can quietly edit.";

/** What PactPal does not handle yet, said plainly. */
export const NOT_YET = ["regulated professional services", "subscriptions", "deposits for events"];

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
  { event: "MESSAGE_SENT", detail: "Logo refresh · live chat", hash: "9f2c…a71e" },
  {
    event: "SCOPE_CONFIRMED",
    detail: "Booking app MVP · council 4 of 5 agreed",
    hash: "71ae…c04d",
  },
  { event: "ACCEPTED", detail: "Silver ring, size 7 · typed name", hash: "c04d…5be8" },
  { event: "INVOICE_SENT", detail: "Product photos · PayPal invoice, stage 1", hash: "5be8…e219" },
  {
    event: "PAYMENT_RECEIVED",
    detail: "Podcast edit · PayPal webhook, verified",
    hash: "e219…a7d3",
  },
  { event: "DELIVERY_SENT", detail: "Blog translation · 6 files", hash: "a7d3…3c91" },
  { event: "REMINDER_SENT", detail: "Wedding favours · balance due tomorrow", hash: "3c91…b40f" },
  { event: "STEP_APPROVED", detail: "Pricing review · session 1", hash: "b40f…68ea" },
];

/** How money and proof move between PayPal and PactPal, node by node. */
export const RAILS = [
  {
    step: "Sign in",
    title: "Sign in with PayPal",
    body: "PayPal shares your name, email and account id. Your password stays with PayPal.",
  },
  {
    step: "Invoice",
    title: "An invoice for each milestone",
    body: "Amounts and due days come from the signed agreement, sent through PayPal Invoicing.",
  },
  {
    step: "Pay",
    title: "Your buyer pays on PayPal",
    body: "Straight into your own PayPal account. PactPal never holds the money.",
  },
  {
    step: "Verify",
    title: "PayPal tells PactPal",
    body: "A webhook, its signature checked, says the payment arrived.",
  },
  {
    step: "Seal",
    title: "Sealed in the log",
    body: "PAYMENT_RECEIVED is written to the chain, fingerprinted with everything before it.",
  },
  {
    step: "Dispute",
    title: "Disputes, through PayPal",
    body: "Seen the moment they open. Evidence, offers and appeals go back through PayPal, after you confirm.",
  },
] as const;

/** A buyer's claim, and what the record says about each part of it. */
export const CLAIM = {
  text: "The cover is the wrong size, you promised a matching bookmark, and it arrived late.",
  /** Word positions (from 0) of the three statements PactPal matches. */
  parts: [
    {
      words: [3, 4, 5],
      said: "the wrong size",
      found: ["Agreement line 4 · 6 × 9 in at 300 dpi", "Log #0419 · Chris approved the proof"],
    },
    { words: [7, 8, 9, 10], said: "promised a matching bookmark", found: [] },
    { words: [13, 14], said: "arrived late", found: ["Log #0421 · delivered 27 Nov, due 28 Nov"] },
  ],
} as const;

/** The app's main screens, in the order the tour shows them. */
export const TOUR = [
  {
    id: "dashboard",
    title: "Dashboard",
    body: "What needs you, what is overdue and what you are waiting on, across every deal.",
    url: "pact-pal.app",
    notes: [
      { x: 30, y: 21, text: "Needs you, first" },
      { x: 72, y: 47, text: "Overdue, in red" },
      { x: 88, y: 5, text: "Start a deal from a chat" },
    ],
  },
  {
    id: "deal",
    title: "Deal space",
    body: "The live chat pinned beside the agreement, the timeline, files and the evidence log.",
    url: "pact-pal.app/deals/book-cover",
    notes: [
      { x: 34, y: 17, text: "Every step at a glance" },
      { x: 30, y: 58, text: "Live chat, every message kept" },
      { x: 76, y: 50, text: "Timeline chart" },
    ],
  },
  {
    id: "reminders",
    title: "Reminders",
    body: "Payments due, approvals waiting, dispute deadlines: they come to you, in the app and by email.",
    url: "pact-pal.app/notifications",
    notes: [
      { x: 82, y: 9, text: "Overdue deposit" },
      { x: 80, y: 36, text: "Dispute deadline in 24 hours" },
    ],
  },
  {
    id: "deadlines",
    title: "Deadlines",
    body: "Every dated step and dispute deadline on one calendar. A dispute with no evidence yet turns red.",
    url: "pact-pal.app/deadlines",
    notes: [
      { x: 64, y: 22, text: "Late steps" },
      { x: 76, y: 44, text: "Today" },
    ],
  },
  {
    id: "dispute",
    title: "Disputes window",
    body: "The time left to respond, the claim against the record, the packet and what PayPal allows now.",
    url: "pact-pal.app/deals/podcast/disputes",
    notes: [
      { x: 74, y: 24, text: "Time left to respond" },
      { x: 34, y: 66, text: "Claim against the record" },
      { x: 84, y: 48, text: "What PayPal allows now" },
    ],
  },
  {
    id: "deals",
    title: "Deals table",
    body: "Search, filter, group and export every deal you have.",
    url: "pact-pal.app/deals",
    notes: [
      { x: 52, y: 13, text: "Search and filter" },
      { x: 72, y: 31, text: "Records complete, per deal" },
    ],
  },
  {
    id: "insights",
    title: "Insights",
    body: "Charts of your own deals: by stage, by amount, by who they are waiting on.",
    url: "pact-pal.app/insights",
    notes: [
      { x: 28, y: 50, text: "Deals by stage" },
      { x: 68, y: 50, text: "Amounts per currency" },
    ],
  },
] as const;

/** What the buyer does, with no account. */
export const BUYER_STEPS = [
  "Open the link in their email",
  "Read every term on one page",
  "Ask questions, answered from the agreement",
  "Type their name and sign",
  "Pay each PayPal invoice",
  "Approve the work or ask for changes",
] as const;

/** Everything else in the box, one tile each. */
export const FEATURES = [
  {
    id: "chat",
    title: "Live chat",
    body: "Typing, online and seen marks. Every message is kept as evidence.",
  },
  {
    id: "remind",
    title: "Reminders",
    body: "Before payments, approvals and dispute deadlines: 72, 24 and 6 hours.",
  },
  { id: "switch", title: "Jump to any deal", body: "Press ⌘K, type a name, land in the deal." },
  {
    id: "screenshot",
    title: "Screenshot reader",
    body: "Drop in a screenshot of a chat; PactPal reads the lines.",
  },
  {
    id: "forward",
    title: "Email forwarding",
    body: "Forward an email thread to the deal's own address.",
  },
  {
    id: "check",
    title: "Pre-delivery check",
    body: "Before you send, your files are checked against the agreed lines.",
  },
  {
    id: "change",
    title: "Change orders",
    body: "New terms, agreed by both, with every version kept.",
  },
  {
    id: "qa",
    title: "Buyer questions",
    body: "Answered from the agreement, with the line cited, or passed to you.",
  },
  {
    id: "agents",
    title: "AI agents",
    body: "Connect your own agent. Anything it sends waits for a code only you can give it.",
  },
  {
    id: "score",
    title: "Completeness score",
    body: "How complete each deal's records are, and what would make them more so.",
  },
] as const;
