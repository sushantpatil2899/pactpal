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

/** The five things PactPal gives, said before anything is explained. */
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
    link: "#paypal",
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
    link: "#disputes",
  },
  {
    id: "agent",
    title: "Your own AI agent, working for you",
    body: "Connect Claude, Cursor or any MCP assistant. It reads your deals and builds packets. Anything it sends waits for a code only you can give.",
    link: "#agents",
  },
] as const;

/** The assistants named on the agent section: product names, said only as facts. */
export const AGENT_CLIENTS = ["Claude Code", "Claude Desktop", "Cursor", "Any MCP client"] as const;

/**
 * One run of an agent working a dispute, as the agent section plays it: each call, what PactPal
 * answers, and what the scene does. `gate` stops the run until the visitor (or the timer)
 * approves; `refused` shows a tool that does not exist.
 */
export const AGENT_RUN: readonly {
  call: string;
  answer: string;
  kind: "read" | "build" | "gate" | "send" | "refused";
}[] = [
  { call: "list_deals", answer: "7 deals · 1 dispute, respond within 26 h", kind: "read" },
  {
    call: "get_dispute PP-R-ABC-1",
    answer: "Not as described · 180.00 USD · PayPal allows evidence",
    kind: "read",
  },
  {
    call: "draft_evidence_packet",
    answer: "Packet built · 4 exhibits · 3.4 MB · nothing sent",
    kind: "build",
  },
  {
    call: "request_send_evidence",
    answer: "Waiting for Maya to approve on the deal",
    kind: "gate",
  },
  {
    call: "confirm_action code=482913",
    answer: "Sent to PayPal · sealed #0431 · key …a91f",
    kind: "send",
  },
  { call: "make_offer", answer: "No such tool. Offers stay with the seller.", kind: "refused" },
];

/** What an agent can and cannot do, short, for the agent section. */
export const AGENT_CAN = [
  "Read deals and disputes",
  "Draft deals from a chat",
  "Build evidence packets",
  "Ask you to send an invoice or evidence",
] as const;

export const AGENT_CANNOT = [
  "Send anything without your code",
  "Sign, accept or act for a buyer",
  "Message buyers, make offers or appeal",
  "Take orders from what buyers write",
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
    title: "Only the data it needs, for as long as it needs it",
    body: "From PayPal: your name, your email and your account id. Your password stays with PayPal. A deal is deleted 210 days after its last activity, never while a dispute is open.",
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
    a: "You propose a change order from the deal. Once your buyer accepts it, the new version of the agreement and its timeline replace the old one, and both versions stay in the record.",
  },
  {
    q: "Can my own AI assistant work with PactPal?",
    a: "Yes. PactPal is an MCP server, so Claude, Cursor or another assistant can connect with a key from your settings. It can read your deals and disputes, create drafts and build evidence packets. Anything it wants to send to PayPal waits for a one time code only you can give it.",
  },
  {
    q: "How long does PactPal keep my deals?",
    a: "A deal and everything in it is deleted 210 days after its last activity, which covers PayPal's dispute window. A deal with an open dispute is kept until it is resolved. AI drafts are deleted after 60 days. A deal is always removed whole, so what is kept still checks out.",
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
      { x: 30, y: 23, text: "Needs you, first" },
      { x: 76, y: 59, text: "Overdue, in red" },
      { x: 88, y: 6, text: "Start a deal from a chat" },
    ],
  },
  {
    id: "deal",
    title: "Deal space",
    body: "The live chat pinned beside the agreement, the timeline, files and the evidence log.",
    url: "pact-pal.app/deals/book-cover",
    notes: [
      { x: 40, y: 17, text: "Every step at a glance" },
      { x: 26, y: 62, text: "Live chat, every message kept" },
      { x: 80, y: 62, text: "Timeline chart" },
    ],
  },
  {
    id: "messages",
    title: "Messages",
    body: "Every deal's chat in one place, grouped by the person you deal with, beside the deal it belongs to.",
    url: "pact-pal.app/messages",
    notes: [
      { x: 32, y: 21, text: "Grouped by person" },
      { x: 60, y: 50, text: "The deal's own chat" },
      { x: 87, y: 14, text: "Where the deal stands" },
    ],
  },
  {
    id: "reminders",
    title: "Reminders",
    body: "Payments due, approvals waiting, dispute deadlines: they come to you, in the app and by email.",
    url: "pact-pal.app/notifications",
    notes: [
      { x: 82, y: 15, text: "Overdue deposit" },
      { x: 66, y: 23, text: "Dispute deadline in 24 hours" },
    ],
  },
  {
    id: "deadlines",
    title: "Deadlines",
    body: "Every dated step and dispute deadline on one calendar. A dispute with no evidence yet turns red.",
    url: "pact-pal.app/deadlines",
    notes: [
      { x: 53, y: 27, text: "Late steps" },
      { x: 64, y: 18, text: "Today" },
    ],
  },
  {
    id: "dispute",
    title: "Disputes window",
    body: "The time left to respond, the claim against the record, the packet and what PayPal allows now.",
    url: "pact-pal.app/deals/podcast/disputes",
    notes: [
      { x: 77, y: 23, text: "Time left to respond" },
      { x: 44, y: 61, text: "Claim against the record" },
      { x: 83, y: 34, text: "What PayPal allows now" },
    ],
  },
  {
    id: "deals",
    title: "Deals table",
    body: "Search, filter, group and export every deal you have.",
    url: "pact-pal.app/deals",
    notes: [
      { x: 52, y: 12, text: "Search and filter" },
      { x: 82, y: 30, text: "Records complete, per deal" },
    ],
  },
  {
    id: "insights",
    title: "Insights",
    body: "Charts of your own deals: by stage, by amount, by who they are waiting on.",
    url: "pact-pal.app/insights",
    notes: [
      { x: 34, y: 40, text: "Deals by stage" },
      { x: 71, y: 42, text: "Amounts per currency" },
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
