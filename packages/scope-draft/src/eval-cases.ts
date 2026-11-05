import { GIFT_CARD_CHAT } from "./injection-cases.js";
import { MAYA_CHAT, SUNRISE_CHAT } from "./maya-fixtures.js";
import type { DeliverableMark } from "./schema.js";

/**
 * What a chat really says, written by hand. Line numbers count the non-blank lines of the chat,
 * as the drafting prompt numbers them. `null` means the chat gives no usable value, so a draft
 * must leave the field missing.
 */
export interface EvalGold {
  /** The agreed total in the deal currency, or null (none stated, or only in another currency). */
  price: { amount: string; currency: string; line: number } | null;
  /** The due date as YYYY-MM-DD, only when the chat states day, month and year. */
  dueDate: string | null;
  /** The number of included revision rounds, only when the chat gives a number. */
  revisions: number | null;
  /** Category ids a draft may name (more than one for blocked goods, where any blocked id is right). */
  category: readonly string[];
  /** One group of lines per thing delivered; citing any line of a group covers it. */
  deliverables: readonly (readonly number[])[];
  /** One group of lines per exclusion. */
  exclusions: readonly (readonly number[])[];
  /** Vague phrases, each with the wordings that count as finding it. */
  vague: readonly (readonly string[])[];
  /** What the buyer must provide (prompt version 3): its lines and the date the chat gives, if any. */
  buyerProvides: readonly { lines: readonly number[]; dueDate: string | null }[];
  /** The mark each deliverable group should get, where the chat makes it clear (null: no answer). */
  marks: readonly (DeliverableMark | null)[];
}

/** A made-up chat with its right answer. */
export interface EvalCase {
  id: string;
  /** What makes the case interesting, in plain words. */
  title: string;
  chat: string;
  dealCurrency: string;
  gold: EvalGold;
}

const chat = (...lines: string[]) => `${lines.join("\n")}\n`;

export const EVAL_CASES: readonly EvalCase[] = [
  {
    id: "maya",
    title: "A clear commission: price, payment split, exclusions, no date",
    chat: MAYA_CHAT,
    dealCurrency: "USD",
    gold: {
      price: { amount: "240.00", currency: "USD", line: 16 },
      dueDate: null,
      revisions: null,
      category: ["art-and-design"],
      deliverables: [[3, 6, 10], [20]],
      exclusions: [[13]],
      vague: [["clean, modern look"], ["quick turnaround"]],
      buyerProvides: [],
      marks: ["objective", "process"],
    },
  },
  {
    id: "sunrise",
    title: "A website with a date, two revisions, exclusions and a buyer duty",
    chat: SUNRISE_CHAT,
    dealCurrency: "USD",
    gold: {
      price: { amount: "900.00", currency: "USD", line: 9 },
      dueDate: "2026-12-12",
      revisions: 2,
      category: ["web-and-software"],
      deliverables: [[3], [7]],
      exclusions: [[17], [18, 19]],
      vague: [["fresh and professional"], ["fast with feedback"]],
      buyerProvides: [{ lines: [19, 20], dueDate: "2026-11-20" }],
      marks: ["objective", "objective"],
    },
  },
  {
    id: "price-changed",
    title: "The price changes in the chat; the last agreed price counts",
    chat: chat(
      "Leo: Hi Nadia, I saw your portfolio. Can you write product descriptions for my online tea shop?",
      "Nadia: Hi Leo! Sure. How many products?",
      "Leo: Twenty descriptions, about 80 words each",
      "Nadia: For twenty descriptions I'd charge $300",
      "Leo: That's a bit more than I planned. Could you do $260?",
      "Nadia: Hmm. If you send me the product list in one go, I can do $260",
      "Leo: Yes, I'll send one spreadsheet",
      "Nadia: Then $260 total, final price",
      "Leo: Deal, thank you!",
      "Nadia: I'll deliver as a Google Doc, one section per product",
      "Leo: Perfect",
    ),
    dealCurrency: "USD",
    gold: {
      price: { amount: "260.00", currency: "USD", line: 8 },
      dueDate: null,
      revisions: null,
      category: ["writing-and-translation"],
      deliverables: [[1, 3], [10]],
      exclusions: [],
      vague: [],
      buyerProvides: [{ lines: [6, 7], dueDate: null }],
      marks: ["objective", "objective"],
    },
  },
  {
    id: "no-price",
    title: "Everything is agreed except the price",
    chat: chat(
      "Tomas: Hi Alicia, I need a 30 second explainer video edited from my raw footage",
      "Alicia: Happy to help. How long is the raw footage?",
      "Tomas: About 12 minutes, shot on a phone",
      "Alicia: Fine. I'll cut it to 30 seconds with captions and your logo at the end",
      "Tomas: Great. Please send it as an MP4, 1080p",
      "Alicia: Will do. I won't be able to reshoot or add music from a paid library",
      "Tomas: That's fine, I have my own music track",
      "Alicia: Perfect, send it over",
      "Tomas: What do I owe you?",
      "Alicia: Let's talk about the price once I've seen the footage",
      "Tomas: ok",
    ),
    dealCurrency: "USD",
    gold: {
      price: null,
      dueDate: null,
      revisions: null,
      category: ["video-and-photo"],
      deliverables: [[4], [5]],
      exclusions: [[6]],
      vague: [],
      buyerProvides: [
        { lines: [1, 3], dueDate: null },
        { lines: [7], dueDate: null },
      ],
      marks: ["objective", "objective"],
    },
  },
  {
    id: "relative-date",
    title: "A date like 'by Friday' and 'a few changes' are not a date or a number",
    chat: chat(
      "Ben: Hi Ines, I'd like a logo for my dog-walking business",
      "Ines: Hi Ben! I do logos for $180, with two concepts to choose from",
      "Ben: Sounds good. Can I have it by Friday?",
      "Ines: I can aim for that",
      "Ben: And I want to be able to ask for a few changes afterwards",
      "Ines: Sure, a few small changes are fine",
      "Ben: Great. Please send SVG and PNG files",
      "Ines: Will do, SVG and PNG",
      "Ben: ok, let's go",
    ),
    dealCurrency: "USD",
    gold: {
      price: { amount: "180.00", currency: "USD", line: 2 },
      dueDate: null,
      revisions: null,
      category: ["art-and-design"],
      deliverables: [[2], [7, 8]],
      exclusions: [],
      vague: [["a few changes", "a few small changes"], ["by friday"]],
      buyerProvides: [],
      marks: ["objective", "objective"],
    },
  },
  {
    id: "dates-and-revisions",
    title: "A full date and revisions given in words",
    chat: chat(
      "Carla: Hi Omar, I need my thesis chapter translated from Portuguese to English",
      "Omar: Hi Carla! How long is it?",
      "Carla: 6,000 words",
      "Omar: That's $540 for the full chapter",
      "Carla: ok. When could you have it ready?",
      "Omar: I can deliver on 18 January 2027",
      "Carla: That works, my deadline is end of January",
      "Omar: And I include three rounds of corrections after you read it",
      "Carla: Three rounds, perfect",
      "Omar: Note that I don't proofread your original text, only translate it",
      "Carla: Understood",
    ),
    dealCurrency: "USD",
    gold: {
      price: { amount: "540.00", currency: "USD", line: 4 },
      dueDate: "2027-01-18",
      revisions: 3,
      category: ["writing-and-translation"],
      deliverables: [[1, 3, 4]],
      exclusions: [[10]],
      vague: [],
      buyerProvides: [],
      marks: ["objective"],
    },
  },
  {
    id: "foreign-currency",
    title: "The price is in euros but the deal is in dollars",
    chat: chat(
      "Jonas: Hi Mia, can you design a poster for our school concert?",
      "Mia: Hi Jonas! Sure. A3 size, print-ready PDF?",
      "Jonas: Yes please",
      "Mia: I'd charge 95 euros for the poster",
      "Jonas: That's fine for us",
      "Mia: I'll send a first version in a few days",
      "Jonas: Thanks, we only need it for this one concert",
      "Mia: Understood, no reuse for later concerts without asking me",
    ),
    dealCurrency: "USD",
    gold: {
      price: null,
      dueDate: null,
      revisions: null,
      category: ["art-and-design"],
      deliverables: [[1, 2]],
      exclusions: [[7, 8]],
      vague: [["a few days"]],
      buyerProvides: [],
      marks: ["objective"],
    },
  },
  {
    id: "small-talk",
    title: "A short job buried in small talk",
    chat: chat(
      "Priya: hey Sam, how was your weekend?",
      "Sam: pretty good, went hiking. you?",
      "Priya: lazy, watched a series all day lol",
      "Sam: nice. So about the thing I asked, can you do it?",
      "Priya: the bio for your website?",
      "Sam: yes, about 300 words, friendly tone",
      "Priya: sure, that's fun",
      "Sam: haha thanks. My dog was barking all morning btw",
      "Priya: oh no, mine too when the neighbours came",
      "Sam: anyway, what does it cost?",
      "Priya: $120 for the bio, one finished version",
      "Sam: ok sounds fair",
      "Priya: I'll send it as a Word file",
      "Sam: great. Can't wait for the new season to start",
      "Priya: me neither! Let's talk next week about the about page",
      "Sam: sounds good, bye!",
    ),
    dealCurrency: "USD",
    gold: {
      price: { amount: "120.00", currency: "USD", line: 11 },
      dueDate: null,
      revisions: null,
      category: ["writing-and-translation"],
      deliverables: [[5, 6, 11], [13]],
      exclusions: [],
      vague: [["friendly tone"]],
      buyerProvides: [],
      marks: [null, "objective"],
    },
  },
  {
    id: "spanish",
    title: "A chat in Spanish: quotes must be copied in Spanish",
    chat: chat(
      "Lucía: Hola Marco, necesito un logotipo para mi cafetería",
      "Marco: Hola Lucía, claro. Te cobro $150 por el logotipo",
      "Lucía: Me parece bien",
      "Marco: Te lo entrego el 15 de diciembre de 2026",
      "Lucía: Perfecto",
      "Marco: Incluyo dos revisiones después de la primera propuesta",
      "Lucía: Genial. ¿Me lo das en formato PNG y SVG?",
      "Marco: Sí, en PNG y SVG",
      "Lucía: No necesito el diseño de tarjetas de visita",
      "Marco: Entendido, eso no está incluido",
    ),
    dealCurrency: "USD",
    gold: {
      price: { amount: "150.00", currency: "USD", line: 2 },
      dueDate: "2026-12-15",
      revisions: 2,
      category: ["art-and-design"],
      deliverables: [
        [1, 2],
        [7, 8],
      ],
      exclusions: [[9, 10]],
      vague: [],
      buyerProvides: [],
      marks: [null, "objective"],
    },
  },
  {
    id: "software-vague",
    title: "A website job full of vague wishes, two payments and exclusions",
    chat: chat(
      "Hana: Hi Erik, I need a booking website for my yoga studio",
      "Erik: Hi Hana! What should it do?",
      "Hana: Visitors should see the class schedule and book a spot",
      "Hana: It should be easy to use and load quickly",
      "Erik: Sure. I can build it for $2,400 in total",
      "Hana: ok. Can I pay in two parts?",
      "Erik: $1,200 to start and $1,200 when you approve the finished site",
      "Hana: Fine",
      "Erik: Payment processing for the bookings is not included, that would be extra",
      "Hana: ok, we can take payment at the studio",
      "Erik: Also I won't write the text for the pages, you provide it",
      "Hana: Sure, I'll write it",
      "Erik: And I'd like it to look modern and clean",
      "Hana: Yes please, nothing too busy",
      "Erik: I'll have a first version ready for you to see soon",
      "Hana: Great",
    ),
    dealCurrency: "USD",
    gold: {
      price: { amount: "2400.00", currency: "USD", line: 5 },
      dueDate: null,
      revisions: null,
      category: ["web-and-software"],
      deliverables: [[1, 3]],
      exclusions: [[9], [11]],
      vague: [
        ["easy to use"],
        ["load quickly"],
        ["modern and clean", "look modern and clean"],
        ["soon"],
      ],
      buyerProvides: [{ lines: [11, 12], dueDate: null }],
      marks: ["objective"],
    },
  },
  {
    id: "gift-card",
    title: "A sale of goods PactPal does not support",
    chat: GIFT_CARD_CHAT,
    dealCurrency: "USD",
    gold: {
      price: { amount: "450.00", currency: "USD", line: 5 },
      dueDate: null,
      revisions: null,
      category: ["gift-cards-stored-value", "other-prohibited"],
      deliverables: [[3]],
      exclusions: [],
      vague: [],
      buyerProvides: [],
      marks: [null],
    },
  },
];
