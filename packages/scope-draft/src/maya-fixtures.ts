import type { ScopeDraftV4 } from "./schema.js";

/** A made-up Discord chat (the "Maya" story in docs/demo.md): price stated, no deadline, no revision limit. */
export const MAYA_CHAT = `Chris: hey Maya! love your art, are you taking commissions right now?
Maya: Hi Chris, thank you! Yes, I have a couple of slots open.
Chris: I'm making a game and need a full-body character illustration for the store page
Chris: something with a clean, modern look
Maya: Sounds fun! Can you tell me a bit about the character?
Chris: She's a space courier, short silver hair, orange jacket
Chris: I'll send a reference board in a minute
Chris: [attachment: reference-board.png]
Maya: Got it, thanks! What format do you need the final in?
Chris: PNG with a transparent background, at least 3000 px tall
Maya: Okay. Is it only for the store page?
Chris: yes, just the store page for now
Maya: Then I'll keep it to that. No merchandise use and no background art
Chris: that's fine with me
Chris: what would it cost?
Maya: For one full-body character, transparent background, it's $240 total
Chris: ok that works. can I pay half now and half when it's done?
Maya: Sure, 50% up front and 50% on delivery
Chris: great
Maya: I'll send a rough sketch first so you can approve the pose before I do the final
Chris: perfect
Chris: I need it soon though, ideally a quick turnaround
Maya: I'll do my best to be quick!
Chris: thanks Maya!
`;

/** The supported categories as the caller would pass them (from `DEAL_CATEGORIES`). */
export const TEST_CATEGORIES = [
  { id: "art-and-design", label: "Art and design commission" },
  { id: "web-and-software", label: "Web and software project" },
] as const;

/** A correct draft of `MAYA_CHAT`: cited where the chat says it, missing where it does not. */
export const MAYA_DRAFT: ScopeDraftV4 = {
  format: 4,
  summary: {
    status: "found",
    value:
      "Maya will create one full-body character illustration with a transparent background for the store page of Chris's game.",
    citations: [
      { line: 3, quote: "need a full-body character illustration for the store page" },
      { line: 10, quote: "PNG with a transparent background" },
    ],
  },
  deliverables: [
    {
      text: "One full-body illustration of a space courier, PNG with a transparent background, at least 3000 px tall",
      citations: [
        { line: 10, quote: "PNG with a transparent background, at least 3000 px tall" },
        { line: 6, quote: "She's a space courier" },
      ],
      mark: "objective",
    },
    {
      text: "A rough sketch for approving the pose before the final",
      citations: [{ line: 20, quote: "send a rough sketch first so you can approve the pose" }],
      mark: "process",
    },
  ],
  exclusions: [
    { text: "No merchandise use", citations: [{ line: 13, quote: "No merchandise use" }] },
    { text: "No background art", citations: [{ line: 13, quote: "no background art" }] },
  ],
  buyerProvides: [],
  price: {
    status: "found",
    amount: "240.00",
    currency: "USD",
    citations: [{ line: 16, quote: "it's $240 total" }],
  },
  paymentTerms: {
    status: "found",
    value: "50% up front and 50% on delivery",
    citations: [{ line: 18, quote: "50% up front and 50% on delivery" }],
  },
  dueDate: { status: "missing" },
  revisionsIncluded: { status: "missing" },
  vagueTerms: [
    {
      phrase: "clean, modern look",
      kind: "subjective",
      suggestedRewrite:
        "The buyer approves the sketch, including the overall look, before the final work starts",
      citations: [{ line: 4, quote: "clean, modern look" }],
    },
    {
      phrase: "quick turnaround",
      kind: "unmeasurable",
      suggestedRewrite:
        "The final is delivered within a stated number of days after the sketch is approved",
      citations: [{ line: 22, quote: "quick turnaround" }],
    },
  ],
  category: {
    id: "art-and-design",
    citations: [{ line: 3, quote: "full-body character illustration" }],
    note: "A custom illustration commission.",
  },
  timeline: [
    {
      kind: "payment",
      text: "Half up front",
      owner: "buyer",
      amount: null,
      dueDate: null,
      citations: [{ line: 18, quote: "50% up front" }],
    },
    {
      kind: "review",
      text: "Rough sketch to approve the pose",
      owner: "seller",
      amount: null,
      dueDate: null,
      citations: [{ line: 20, quote: "send a rough sketch first so you can approve the pose" }],
    },
    {
      kind: "delivery",
      text: "Final illustration",
      owner: "seller",
      amount: null,
      dueDate: null,
      citations: [{ line: 20, quote: "before I do the final" }],
    },
    {
      kind: "payment",
      text: "Half on delivery",
      owner: "buyer",
      amount: null,
      dueDate: null,
      citations: [{ line: 18, quote: "50% on delivery" }],
    },
  ],
};

/** A draft in which the chat stated nothing: every field missing, every list empty. */
export const ALL_MISSING_DRAFT: ScopeDraftV4 = {
  format: 4,
  summary: { status: "missing" },
  deliverables: [],
  exclusions: [],
  buyerProvides: [],
  price: { status: "missing" },
  paymentTerms: { status: "missing" },
  dueDate: { status: "missing" },
  revisionsIncluded: { status: "missing" },
  vagueTerms: [],
  category: { id: "unclear", citations: [], note: "" },
  timeline: [],
};

/** A second made-up chat (a bakery website), used to check that ordinary chats are left alone. */
export const SUNRISE_CHAT = `Rosa: Hi Daniel, I got your name from Priya. I need a simple website for my bakery, Sunrise Bakes.
Daniel: Hi Rosa! Happy to help. What do you need on it?
Rosa: Three pages: Home, Menu and Contact. Mobile friendly please.
Rosa: And I want it to look fresh and professional
Daniel: Sure. Do you already have a domain and hosting?
Rosa: I have the domain sunrisebakes.example, no hosting yet
Daniel: I can set up hosting on my own account for the first year, that's included
Rosa: Great. What would it cost?
Daniel: For the three pages with hosting set up, it's $900 in total
Rosa: That works for me
Daniel: I'd ask for 40% up front and the rest when you approve the finished site
Rosa: ok, deal
Daniel: I can have it live by Friday 12 December 2026
Rosa: Perfect, that's before the holiday rush
Daniel: I'm including two rounds of changes after the first draft
Rosa: Can you also add an online ordering page later?
Daniel: Online ordering isn't part of this price, we can quote it separately
Rosa: Fine. And no logo design needed, I already have one
Daniel: Right, logo isn't included. I'll also need your menu text and photos by 20 November 2026
Rosa: I'll send them next week
Daniel: And you'll need to be fast with feedback, I need replies within a couple of days
Rosa: No problem!
`;
