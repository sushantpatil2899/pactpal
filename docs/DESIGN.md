# PactPal design system

A calm, modern product look: soft rounded cards on cool neutral grounds, fine hairlines, one emerald-to-teal gradient for actions and progress, and violet for anything the AI drafted. It comes in a light and a dark theme. Chosen by the owner on 10 November 2026 from a mock-up of the deal space, after the first direction ("Sealed Parcel": square ruled labels on kraft) was built for three screens and judged plain, boxy and childish.

Reference systems read for structure only (Stripe, Wise, Mercury, Linear, Notion): one action colour; real product UI as the proof; tabular figures for money; status colours kept apart from the action colour; depth from surface contrast and soft shadow. No palette, logo or look is taken from them.

## Principles

1. **The record is the hero.** Screens show real terms, messages and fingerprints, not illustrations.
2. **Colour has jobs.** Green: the one action, progress, signed and done. Violet: drafted by AI, and its citations. Amber: waiting. Red: a problem, a dispute, a changed log. Nothing is coloured for decoration.
3. **Calm where trust is decided.** Signing and delivery pages have one action and nothing that competes with it.
4. **Honest states.** A field with no source says so. The completeness score is never shown beside words about outcomes.

## Surfaces by audience

| Surface                                          | Layout                                                                 | Notes                                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Landing page, sign-in                            | Public: a soft wash of the accent behind the top of the page           | The landing page carries the scroll-driven story; larger type, the same cards and parts |
| Buyer pages (link, terms to sign, delivery)      | One column, 46rem wide, a plain top bar                                | One card per record, one highlighted band for the one action                            |
| Dashboard, deals, deal space, disputes, settings | A rail of sections and open deals beside the page; a top bar on phones | Dense but quiet: cards, tiles, a segmented switcher                                     |

## Colour

Tokens live in `apps/web/src/design/tokens.ts`, in a light and a dark set; the pairings below are tested for 4.5:1 contrast in both.

| Token                                 | Light                | Dark                 | Role                                              |
| ------------------------------------- | -------------------- | -------------------- | ------------------------------------------------- |
| `bg`                                  | `#f4f6f8`            | `#0a0c10`            | Page ground                                       |
| `bg-sunk`                             | `#eceff3`            | `#0e1116`            | The rail, tab tracks, code                        |
| `surface`                             | `#ffffff`            | `#12161c`            | Cards, inputs, buttons                            |
| `surface-2`                           | `#f8fafb`            | `#171c24`            | Tiles and bands inside a card                     |
| `line`, `line-strong`                 | ink at 8% and 16%    | white at 7% and 15%  | Hairlines; control borders                        |
| `ink`, `ink-2`, `ink-3`               | `#0d1219` and greys  | `#eef2f6` and greys  | Text, secondary text, captions                    |
| `accent`, `accent-2`                  | `#0fa97a`, `#0b8f8c` | `#22c997`, `#17b3b0` | Progress, marks, glows (not for body text)        |
| `accent-strong` pair with `on-accent` | deep greens, white   | bright greens, ink   | The primary button's gradient and its text        |
| `accent-ink`                          | `#087a58`            | `#4fdcb0`            | Green text and links                              |
| `ai`, `on-ai`, `ai-ink`               | `#6d5cf6` family     | `#8f81ff` family     | AI drafts, AI cards in the chat, citation numbers |
| `wait`, `wait-ink`                    | amber                | amber                | Waiting for someone                               |
| `alert`, `on-alert`, `alert-ink`      | red                  | red                  | Problems, disputes, a changed log                 |

No blue anywhere, so nothing reads as PayPal's brand. Washes are made in CSS with `color-mix` from these tokens. Green never means "you are protected" or a likely outcome.

### Status

Each status has a word, a shape and a colour, so it reads without colour.

| Status          | Word shown        | Shape              | Colour               |
| --------------- | ----------------- | ------------------ | -------------------- |
| Draft           | Draft             | Dashed circle      | Grey, dashed outline |
| Awaiting buyer  | Waiting for buyer | Half-filled circle | Amber wash           |
| Signed          | Signed            | Tick               | Green wash           |
| Paid            | Paid              | Tick               | Green wash           |
| Delivered       | Delivered         | Double tick        | Ink, filled          |
| Disputed        | Disputed          | Exclamation mark   | Red wash             |
| Tamper detected | Changed           | Broken link        | Red, filled          |

## Type

Geist for text and interface, Geist Mono for fingerprints, record numbers and amounts in tables. Both are open-licence and self-hosted. Body is 15 px; headings 17, 20 and 24 at weight 650 with tight tracking; public and buyer headlines 28 to 40 px. Captions are 12 px. Numbers are tabular everywhere.

## Shape, depth, space

- Radius: 16 px cards, 12 px tiles and bands, 10 px controls, full for badges and avatars.
- Depth: two soft shadows. `shadow-1` on cards and the open tab; `shadow-2` on the sign-in card and overlays. In the dark theme depth comes mostly from surface steps and an inner top highlight.
- Spacing steps (px): 4, 8, 12, 16, 24, 32, 48, 64, 96.
- Borders are 1 px hairlines. No heavy rules, no hard offset shadows.

## Components

| Component      | Rule                                                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Button         | Primary: the green gradient with a soft glow; one per view. Secondary: surface with a hairline. Quiet: text only. 40 px tall, 48 px when large |
| Card           | One record or task. Rows inside are divided by hairlines                                                                                       |
| Band           | The row of a card that holds its one action, on `surface-2`; the signing band is tinted green                                                  |
| Field and tile | A caption above a value, on a soft tile. An unsourced value reads "Not in the source. Left blank." with a dashed outline                       |
| Citation       | A small violet number beside a term; hovering or focusing it highlights the chat line it came from                                             |
| AI card        | Violet wash, a spark mark, what the AI prepared and one button. Always a draft, never an action taken                                          |
| Progress strip | Numbered nodes joined by a line; done nodes are filled green with a tick, the current one has a ring; the next action sits at its right        |
| Tabs           | A segmented control: one sunk track, the open tab lifted out of it                                                                             |
| Badge          | The seven statuses above, as pills                                                                                                             |
| Alert          | A tinted, rounded box: green for confirmations (`role="status"`), red for problems (`role="alert"`), the word first                            |
| Empty state    | A dashed box with one sentence on what will appear and how to start                                                                            |
| Skeleton       | Rounded bars that breathe slowly; no shimmer sweep                                                                                             |
| Focus          | A 2 px accent outline; inputs get an accent border and a soft ring                                                                             |

## Logo

The owner's handshake-heart, redrawn as an SVG with gradients: the hands in bright and deep green, the last finger in violet. The wordmark is "PactPal" in Geist at weight 700. No PayPal marks or colours beside it.

## Themes

The app follows the device's light or dark setting; a switch in the footer cycles device, light and dark and is remembered. Every screen is checked in both.

## Motion

- Durations 120, 200 and 320 ms with an ease-out curve. Buttons lift one pixel on hover; the current step's ring pulses slowly; typing dots bob.
- Motion shows a state changing (a field filling, a step completing, a citation lighting its source); nothing moves for decoration.
- Landing page: scroll-linked, with one deal advancing section by section. Phones get simple reveals instead of pinning.
- `prefers-reduced-motion`: animations and transitions are switched off and scroll-linked states render in their final form.
- Nothing hijacks the scroll wheel, the keyboard, find-in-page or anchor links, and nothing shifts layout after load.

## Voice

Plain, short, exact. Say what was recorded, never what will happen. No exclamation marks. Words PactPal never uses: legally binding, court proof, guaranteed, protected, win.

## Do and don't

- Do give each view one primary action.
- Do keep violet for AI drafts and their citations only.
- Do show real product screens with invented people (Maya, Chris, Daniel, Rosa, Jun) as the proof.
- Don't use heavy black borders, square boxes or flat saturated colour fields.
- Don't hard-code colours in components; use the tokens, so both themes work.
- Don't put the completeness score at the centre of a page or beside words about outcomes.
