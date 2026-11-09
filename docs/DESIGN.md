# PactPal design system

The visual world is **Sealed Parcel**: every deal is a parcel, labelled as it was agreed and sealed with tape that shows if anyone opens it. Chosen by the owner on 10 November 2026. This file is written before the build and is refreshed from the built screens at the end of the redesign.

Reference systems read for structure only (Stripe, Wise, Mercury, Linear, Notion): one action colour; real product UI as the proof; tabular figures for money; status colours kept apart from the brand colour; surface contrast and rules instead of shadows; plain rectangles for working screens. No palette, logo or look is taken from them.

## The world

| Thing in the world        | What it is in PactPal                                              |
| ------------------------- | ------------------------------------------------------------------ |
| Shipping label            | Any record: an agreement, a receipt, a deal header, a packet cover |
| Label fields (FROM, TO)   | Labelled facts; a field with no source stays visibly blank         |
| Tracking scans            | The evidence log and the timeline: one mark per step, in order     |
| Security tape             | The seal: signing, the primary action, an unchanged log            |
| Tape showing VOID         | The log was changed at this entry                                  |
| Record number and barcode | Fingerprints                                                       |
| Kraft board               | The public ground: the parcel the label sits on                    |

The world is the structure of the page, never decoration on top of it. No drawings of boxes, trucks or envelopes; PactPal is not a courier and nothing on a page may suggest it ships goods.

## How far the world reaches, by surface

| Surface                                          | Mode     | Treatment                                                                                                                                 |
| ------------------------------------------------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Landing page, sign-in                            | Persuade | Full world. Kraft ground, one large label per screen, tape bands that own whole regions, condensed heavy headlines                        |
| Buyer pages (link, acceptance, delivery)         | Read     | One calm label on a label-grey ground, large text, a single tape band for the one action. Nothing else competes                           |
| Dashboard, deals, deal space, disputes, settings | Operate  | Restrained. Label-grey ground, white panels with thin rules, tape green only for the primary action and progress, mono for record numbers |

## Colour

Strategy: committed. Tape green and kraft own whole regions on public pages; working screens stay neutral so status colours can be read.

| Token         | Value     | Role                                                                      |
| ------------- | --------- | ------------------------------------------------------------------------- |
| `label`       | `#F3F4EF` | Label stock: the ground of app and buyer pages, the label on public pages |
| `label-white` | `#FFFFFF` | Panels and inputs on `label`                                              |
| `kraft`       | `#B98E5E` | Public ground                                                             |
| `kraft-deep`  | `#7A5830` | Text and rules on kraft where ink is too strong                           |
| `ink`         | `#0B0C0A` | Text, rules, the dark hand of the logo                                    |
| `ink-soft`    | `#4A4E47` | Secondary text (7.9:1 on `label`)                                         |
| `rule`        | `#C9CCC2` | Thin rules and borders on working screens                                 |
| `tape`        | `#0B8F5C` | Tape bands, progress, scan marks. Carries `ink` text only (4.8:1)         |
| `tape-deep`   | `#086B45` | Primary buttons and green text; carries `label` text (5.9:1)              |
| `void`        | `#FF5A1F` | Changed-log bands and fills. Carries `ink` text only (6.3:1)              |
| `void-deep`   | `#B93A0C` | Warning and error text on `label` (5.2:1)                                 |
| `amber`       | `#8A5A00` | Waiting text; on `amber-wash` `#FBE9B8`                                   |

No blue anywhere. Green is never used to mean "you are protected" or a likely outcome; it means sealed, signed or done.

### Status

Each status has a word, a shape and a colour, so it reads without colour.

| Status          | Word shown        | Shape                                    | Colour                  |
| --------------- | ----------------- | ---------------------------------------- | ----------------------- |
| Draft           | Draft             | Dashed outline, empty circle             | `ink-soft`              |
| Awaiting buyer  | Waiting for buyer | Solid outline, half-filled circle        | `amber` on `amber-wash` |
| Signed          | Signed            | Outline with a tape strip, tick          | `tape-deep` outline     |
| Paid            | Paid              | Filled, tick                             | `label` on `tape-deep`  |
| Delivered       | Delivered         | Filled, double tick                      | `label` on `ink`        |
| Disputed        | Disputed          | Filled, exclamation mark                 | `label` on `void-deep`  |
| Tamper detected | Changed           | Diagonal VOID hatching, broken-link mark | `ink` on `void`         |

## Type

| Role             | Face                                | Use                                                                         |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| Display and text | Archivo (variable width and weight) | Headlines condensed (width 75) at weight 800; text at normal width, 400/600 |
| Records          | Martian Mono                        | Fingerprints, record numbers, times, amounts in tables                      |

Both are open-licence and self-hosted. Field captions (FROM, TO, CONTENTS) are 12–13 px, weight 700, upper case, tracked +4%. Money and counts use tabular figures. The completeness score is set in fixed digit positions in the mono face.

Scale (px): 13, 15, 17 (body), 20, 24, 32, 44, 64, 96, 128. Public headlines run 64–128; working screens stop at 32. Body lines are 60–75 characters.

## Space, shape, depth

- Spacing steps (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Sections on public pages are 96–128 apart; working screens use 16–32.
- Corners are square: labels, panels, buttons and inputs have radius 0 on public and buyer pages and 2 px on working screens. Full rounding is reserved for the logo's fingers, scan marks and status badges.
- Rules: 3 px `ink` on labels (public, buyer); 1 px `rule` on working screens. A label's fields are divided by rules, not by gaps or cards.
- Depth: none. No drop shadows on content. Only overlays (menus, the deal switcher) lift, with `0 8px 24px rgb(11 12 10 / 0.16)`.
- Tape bands are rotated 1–2° on public pages only; never on working screens or buyer pages.

## Components

| Component   | Rule                                                                                                                             |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Button      | Primary: `tape-deep` fill, `label` text. Secondary: 2 px `ink` outline. One primary per view. Minimum 44 px tall                 |
| Label       | The record container: caption row, ruled fields, optional record number and barcode. Used for agreements, receipts, deal headers |
| Field       | Caption above value. Unsourced value shows "Not in the source. Left blank." in `ink-soft`, never an empty box                    |
| Citation    | A numbered mark beside a field; hovering or focusing it highlights the source line with a `tape` edge                            |
| Scan mark   | A circle in the margin column: empty, half or filled. A filled mark never empties again                                          |
| Tape band   | Carries the one primary action or a sealed/changed state. Text on it is `ink`                                                    |
| Badge       | The seven statuses above, plus counts                                                                                            |
| Alert       | A 2 px outline in the status colour on white, the word first ("Changed at entry 4"), `role="alert"` or `role="status"`           |
| Tabs        | Text tabs with a 3 px `ink` underline on the current one; arrow keys move between them                                           |
| Empty state | A blank label with its captions and one sentence saying what will appear and the one action that starts it                       |
| Skeleton    | Ruled label outlines in `rule`; no shimmer                                                                                       |
| Focus       | 3 px `ink` outline with a 2 px `label` gap, on every interactive element                                                         |

## Logo

The owner's handshake-heart, redrawn as an SVG: the left hand in `ink`, the right hand in `tape`, the palm in `tape-deep`. On dark grounds the left hand becomes `label`. The wordmark is "PactPal" in Archivo condensed 800. Minimum size 20 px high; no PayPal marks or colours beside it.

## Motion

- Durations 120, 200 and 320 ms; ease-out. Motion shows a state changing (a field filling, a mark closing, tape sealing); nothing moves for decoration.
- Landing page: scroll-linked. The deal's label stays pinned while sections advance it; each section closes one scan mark in the margin column, numbered 01–13. Marks and filled fields persist when scrolling back.
- The trust moment: an altered log entry turns its tape to VOID hatching and every later entry breaks from the chain.
- Phones: no pinning; each section reveals once as it enters.
- `prefers-reduced-motion`: every scroll-linked state renders in its final form; no pinning, no rotation changes.
- Nothing hijacks the scroll wheel, the keyboard, find-in-page or anchor links, and nothing shifts layout after load.

## Voice

Plain, short, exact. Say what was recorded, never what will happen. No exclamation marks. Words PactPal never uses: legally binding, court proof, guaranteed, protected, win.

## Do and don't

- Do let one label carry one record, with every fact in a captioned field.
- Do keep green for sealed, signed and done, and orange for changed and disputed.
- Do show real product screens with invented people (Maya, Chris, Daniel, Rosa, Jun) as the proof.
- Don't draw parcels, trucks, stamps of approval or anything that reads as shipping.
- Don't add shadows, gradients, glass or rounded cards.
- Don't use heavy black boxes on working screens; the label look is for public and buyer pages.
- Don't put the completeness score at the centre of a page or beside words about outcomes.
