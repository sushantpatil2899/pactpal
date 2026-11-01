import type { ScopeDraft } from "./schema.js";

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
export const MAYA_DRAFT: ScopeDraft = {
  format: 2,
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
    },
    {
      text: "A rough sketch for approving the pose before the final",
      citations: [{ line: 20, quote: "send a rough sketch first so you can approve the pose" }],
    },
  ],
  exclusions: [
    { text: "No merchandise use", citations: [{ line: 13, quote: "No merchandise use" }] },
    { text: "No background art", citations: [{ line: 13, quote: "no background art" }] },
  ],
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
};

/** A draft in which the chat stated nothing: every field missing, every list empty. */
export const ALL_MISSING_DRAFT: ScopeDraft = {
  format: 2,
  summary: { status: "missing" },
  deliverables: [],
  exclusions: [],
  price: { status: "missing" },
  paymentTerms: { status: "missing" },
  dueDate: { status: "missing" },
  revisionsIncluded: { status: "missing" },
  vagueTerms: [],
  category: { id: "unclear", citations: [], note: "" },
};
