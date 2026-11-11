# Demo plan

The hosted demo is filled with real deals made by a seed script through PactPal's own code, on PayPal's **sandbox** (no real money moves). Six stories cover every outcome a seller meets; Maya, the showcase seller, also has a book of about 18 lighter deals so the dashboard, Insights and "Needs you" have real data to show. All people, businesses and addresses are invented. Agreed with the owner on 10–11 Nov 2026.

## Rules

- **Nothing inside the app is mocked.** Every deal, message, invoice, payment, delivery and dispute is real: made through PactPal's code and, for money and disputes, through PayPal's sandbox. Illustrative pictures appear only on the landing page and the product tour.
- **No replays.** What the sandbox cannot do on demand (an appeal's final decision) is not shown.
- **Real time.** The server stamps every event with the real time, so a story that would take weeks happens within an hour; the demo page says so. Due dates can be anywhere, so some steps are due in late November and December and two are overdue.
- **Each seller's invoices come from their own PayPal app** (6h), so every invoice carries that seller's name and account.
- The demo runs on the sandbox and says so on screen and in every email.

## Cast

Every person has an address on PactPal's own domain that matches their name; all of them arrive in one shared inbox judges can sign in to.

### Sellers (each: a sandbox **Business** account plus its own REST app, linked in PactPal)

| Seller        | Business (PayPal's name, which allows no apostrophes) | Email                        | Stories           |
| ------------- | ----------------------------------------------------- | ---------------------------- | ----------------- |
| Maya Lin      | Maya Lin Studio: game art and story writing           | `maya.lin@pact-pal.app`      | 1, 6, Maya's book |
| Daniel Okafor | Okafor Web: websites for small businesses             | `daniel.okafor@pact-pal.app` | 2                 |
| Priya Raman   | Priya Raman Retouch: product photo retouching         | `priya.raman@pact-pal.app`   | 3                 |
| Jun Tanaka    | Jun's Sheets (Juns Sheets on PayPal)                  | `jun.tanaka@pact-pal.app`    | 4                 |
| Lena Fischer  | Lena's Vintage Cameras (Lenas Vintage Cameras)        | `lena.fischer@pact-pal.app`  | 5                 |

### Buyers (each: a sandbox **Personal** account with the same email and sandbox balance, to pay invoices)

| Buyer        | Who they are                                  | Email                                 | Deals with           |
| ------------ | --------------------------------------------- | ------------------------------------- | -------------------- |
| Chris Park   | Solo indie game developer ("Lanternlight")    | `chris.park@pact-pal.app`             | Maya (story 1, book) |
| Nora Quinn   | Producer at Lanternfall Games                 | `nora.quinn@pact-pal.app`             | Maya (story 6, book) |
| Ethan Brooks | Founder of Pixel Harbor, a two-person studio  | `ethan.brooks@pact-pal.app`           | Maya (book)          |
| Aisha Khan   | Narrative lead at Moonbyte Studio             | `aisha.khan@pact-pal.app`             | Maya (book)          |
| Rosa Alvarez | Owner of Rosa's Corner Bakery                 | `rosa.alvarez@pact-pal.app`           | Daniel               |
| Tom Becker   | Owner of Ember & Wick, a handmade-candle shop | `tom.becker.allowappeal@pact-pal.app` | Priya                |
| Alex Morgan  | Freelance bookkeeper                          | `alex.morgan@pact-pal.app`            | Jun                  |
| Sam Patel    | Film photography hobbyist                     | `sam.patel@pact-pal.app`              | Lena                 |

Tom's address contains `allowappeal` because PayPal's sandbox offers the seller an appeal only when the buyer's email does (story 3 shows the appeal check on a real appeal).

### How the inboxes work (set up 11 Nov 2026)

All 13 addresses are forwards at name.com to **one Proton Mail inbox**, so judges sign in once and see every email PactPal sent, each addressed to its person. No phone number or account per person was needed. Mail for `pact-pal.app` goes to name.com's mail servers; PactPal's own sending (`send.updates.pact-pal.app`) and forwarding (`in.pact-pal.app`) are separate and unchanged.

### Done by the owner

1. The 13 forwards and the Proton inbox (test email received).
2. 5 sandbox Business accounts and, under each, one Merchant REST app with Invoicing, Customer disputes and Transaction search. The keys stay with the owner; each app is linked in PactPal while signed in as its seller.
3. 8 sandbox Personal accounts with sandbox balance.

## Story 1: Maya and Chris, a clean deal (nothing goes wrong)

Chris asks Maya on Discord for a full-body character, "Wren, the lantern-keeper", for his game's store page: transparent PNG, $240 in two payments.

| Step | What happens                                                                                                                                                                                                              | Feature                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1    | Maya pastes the Discord chat (about 40 lines over two days).                                                                                                                                                              | Pasted chats (7h)                                     |
| 2    | The AI council drafts the agreement: every line quotes the chat; the deadline and revision count are marked as missing until Maya fills them; "clean, modern look" becomes a matter of taste tied to the sketch approval. | Drafting council (3, 7g), checkable lines (4i-2)      |
| 3    | Chris reads it and asks for one change before signing (two revisions, not one); Maya updates from the latest chat.                                                                                                        | Review loop (7j), update from chat (7i)               |
| 4    | On the signing page Chris asks "Can I print Wren on T-shirts?"; the answer quotes the exclusion: no. He signs with his typed name; both get the receipt PDF.                                                              | Buyer questions (4k), signing and receipt (4a, 4b)    |
| 5    | The 50% deposit invoice goes from Maya's own PayPal app; Chris pays; the payment arrives by notification.                                                                                                                 | Own-app invoices (6h-3), payments (4d, 4e)            |
| 6    | About 30 messages in the deal chat while she works. Maya sends the sketch; Chris asks for a new pose (revision 1 of 2) and approves the second sketch.                                                                    | Deal chat (7b, 7c), deliveries and approvals (4f, 4g) |
| 7    | Before the final delivery, the pre-delivery check confirms full body and a transparent background.                                                                                                                        | Pre-delivery check (4l)                               |
| 8    | Final art delivered, downloaded and approved; the second invoice is paid; every timeline step is done; the evidence score is high.                                                                                        | Timeline (7k), evidence score (4h)                    |

**Images:** the three pictures of Wren made by the owner (sketch, revised sketch, final).

## Story 2: Daniel and Rosa, the seller did everything right and wins

Rosa hires Daniel for a five-page bakery website, $1,500 in three stages. They first talk on WhatsApp, then in PactPal.

| Step | What happens                                                                                                                                                                                                  | Feature                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1    | Daniel pastes the WhatsApp chat; the draft turns "fast-loading" into a measurable target and lists what Rosa provides by when (menu text, opening hours, photos).                                             | Drafting, "buyer provides" with dates (4i, 4n)                         |
| 2    | Rosa uploads her menu and opening hours as files.                                                                                                                                                             | Buyer files (5b)                                                       |
| 3    | Rosa signs; stage 1 is paid.                                                                                                                                                                                  |                                                                        |
| 4    | In the chat (40+ messages) Rosa asks for online ordering and a blog. The message watcher marks both as outside the agreement and drafts a change order.                                                       | Message watcher (4m)                                                   |
| 5    | Daniel proposes the change; Rosa accepts online ordering and declines the blog ("not needed for now").                                                                                                        | Change orders (4j)                                                     |
| 6    | Daniel delivers the site (a real, polished bakery website: a zip, and live on its own Render Static Site); Rosa approves; stage 2 is paid.                                                                    | Deliveries (4f, 4g)                                                    |
| 7    | Rosa disputes stage 2: "the blog was never built".                                                                                                                                                            | Disputes in (5a), dispute page (5c)                                    |
| 8    | Claim against the record: the blog was declined in a signed change; the council summarises, picks exhibits and drafts the note; Daniel removes one exhibit, confirms and sends the evidence from his own app. | Claim vs record (5d), summary (5f), packet (5e), confirm and send (5g) |
| 9    | The owner decides the case for the seller on the sandbox site. Daniel gets the decision email.                                                                                                                | Dispute emails (5j)                                                    |

## Story 3: Priya and Tom, the seller got it wrong and PactPal says so

Tom orders 6 retouched product photos on white backgrounds for his candle shop, 2 revision rounds, within 5 days, $180 in one payment. Most of the talk is in PactPal's chat (about 35 messages).

| Step | What happens                                                                                                                                                          | Feature                                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1    | Tom uploads his 6 raw photos as files.                                                                                                                                | Buyer files (5b)                            |
| 2    | The deadline passes; PactPal sends reminders to Priya by email and in the chat.                                                                                       | Reminders (7l)                              |
| 3    | Priya delivers late, with 4 of 6 photos, two still showing shadows; Tom asks for changes; she sends nothing more and goes quiet in the chat.                          | Deliveries, revisions (4f, 4g)              |
| 4    | Tom disputes: "not as described".                                                                                                                                     |                                             |
| 5    | Claim against the record sides with Tom: the agreement says 6 clean photos by the date; the log shows 4, late. The suggested action is a partial refund, not a fight. | Claim vs record (5d), message or offer (5h) |
| 6    | Priya offers a partial refund; Tom declines; the owner decides the case for the buyer on the sandbox site.                                                            |                                             |
| 7    | The appeal check finds no evidence that was not already sent and says an appeal would not help. The evidence score stays low and lists exactly what is missing.       | Appeal check (5i), evidence score (4h)      |

**Images:** the owner's 6 raw candle photos; the seed makes the "after" versions (white background), leaving two with shadows as the story needs.

## Story 4: Jun and Alex, "never received" against a download log

Alex buys Jun's spreadsheet pack (budget planner, invoice tracker, content calendar), $45. They talked in a marketplace inbox; Jun adds a **screenshot** of that thread, which PactPal reads into text for him to check.

| Step | What happens                                                                                                                       | Feature                |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1    | The screenshot is read into a chat transcript; the draft is made from it.                                                          | Screenshots (4o)       |
| 2    | Alex signs and pays. Jun delivers the zip; Alex opens the page and downloads it (logged with the file's fingerprint and the time). | Delivery log (4f)      |
| 3    | Alex disputes: "item not received". The packet's core exhibit is the download record. The owner decides for the seller.            | Packet (5e), send (5g) |

**Files:** real `.xlsx` templates made by the seed; the marketplace screenshot drawn by the seed (an invented inbox design, no real brand).

## Story 5: Lena and Sam, physical goods and the listing as evidence

Sam orders a 1970s film camera on Lena's shop; her order form sends the order to her private "deal from text" key and a draft deal appears (a forwarded email cannot be used: forwarding accepts only mail sent from the seller's own address). She adds the camera's product page with Channel3: "What's being sold" fills in, and the photos are saved as evidence. The camera is a Pentax K1000 with a Pentax-A 50mm f/2; its product page ([Coastal Film Lab](https://www.coastalfilmlab.com/products/pentax-k1000-35mm-slr-film-camera-pentax-a-50mm-f-2-lens)) lists it at $299.99 and says the lens has "slight haze". Lena sells it for **$185**, and the signed agreement says why: "Sold for $185, below the listed price of $299.99, as is because of the haze on the rear lens element".

| Step | What happens                                                                                                                                               | Feature                           |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1    | The order form's text becomes a draft deal.                                                                                                                | Deal from text (4p)               |
| 2    | Channel3 lookup; listing details and photos in the agreement.                                                                                              | Channel3 (8e)                     |
| 3    | Timeline: pay, ship with tracking number (a step Lena marks done with the number), receive.                                                                | Timeline (7f, 7k)                 |
| 4    | Sam pays, receives, then disputes "not as described: lens haze". The packet shows the signed agreement quoting the haze. The owner decides for the seller. | Claim vs record (5d), packet (5e) |

**Images:** the owner's 3 camera photos, plus the product page's photos from Channel3.

## Story 6: Maya's AI agent, with Maya's approval

Maya uses an AI agent (any MCP client, such as Claude Desktop) with her PactPal agent key.

| Step | What happens                                                                                                                                                        | Feature                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1    | The agent lists her deals and creates a draft deal for Nora from pasted text.                                                                                       | MCP read and prepare tools (8a, 8b) |
| 2    | It asks to send Nora's deposit invoice. Maya gets a notification and an email, sees exactly what would be sent, approves, and reads the one-time code to the agent. | Approve-and-code (8c)               |
| 3    | The agent confirms with the code; the invoice goes from Maya's own app; the log shows who asked and who approved.                                                   |                                     |

The seed makes these calls as the agent would; the live run with a real agent (8d) is filmed for the video.

## Maya's book of deals (written work only)

Every deliverable is a document the seed writes (1–4 pages, PDF or text). Buyers: Chris (C), Nora (N), Ethan (E), Aisha (A). Dates are due dates of the open step; "paid" means paid in the sandbox.

| #   | Deal                                          | Buyer | Amount          | Where it stands                                      | Due                         |
| --- | --------------------------------------------- | ----- | --------------- | ---------------------------------------------------- | --------------------------- |
| 1   | Wren's backstory and personality sheet        | C     | $120            | Completed, paid, approved                            |                             |
| 2   | Lanternlight store-page copy (short and long) | C     | $90             | Completed, paid, approved                            |                             |
| 3   | NPC dialogue: the harbour market (40 lines)   | N     | $180            | Completed, paid, approved                            |                             |
| 4   | Item descriptions: 30 relics                  | E     | $150            | Completed, paid, approved                            |                             |
| 5   | World-lore bible, part 1                      | N     | $600 (2 stages) | In progress, stage 1 paid                            | 28 Nov                      |
| 6   | Quest text: the drowned lighthouse            | A     | $240            | In progress, waiting for Aisha's outline             | **6 Nov, overdue (buyer)**  |
| 7   | Character voice guide for 4 companions        | A     | $300            | In progress, first draft due                         | **9 Nov, overdue (seller)** |
| 8   | Steam page localisation brief                 | E     | $80             | In progress, review requested                        | 20 Nov                      |
| 9   | Tutorial script and tooltips                  | C     | $160            | In progress, revision asked                          | 24 Nov                      |
| 10  | Art style guide (text)                        | N     | $220            | In progress, deposit paid                            | 5 Dec                       |
| 11  | Patch notes voice and template                | E     | $60             | Waiting for Ethan's signature                        |                             |
| 12  | Boss encounter barks (60 lines)               | A     | $140            | Waiting for Aisha's signature; she asked a question  |                             |
| 13  | Licence and usage terms sheet for fan art     | C     | $70             | Waiting for Chris's signature                        |                             |
| 14  | Kickstarter campaign text                     | E     | $250            | Draft, made from a pasted chat                       |                             |
| 15  | Codex entries: 12 creatures                   | N     | $200            | Draft, made by Maya's intake key from her order form |                             |
| 16  | Trailer voice-over script                     | A     | $110            | Draft                                                |                             |
| 17  | Achievement names and descriptions            | C     | $75             | Declined by Chris ("not this month")                 |                             |
| 18  | Press kit "about the game"                    | E     | $95             | Completed, paid, Ethan approved after one revision   |                             |

This gives Insights a spread of buyers, amounts, stages, "waiting on" and timing, and gives "Needs you" real items: a question to answer, a revision to deliver, an overdue draft, and signatures pending. Overdue and soon-due steps send daily reminder emails, as they would for a real seller.

## Chats

- **Pasted from other apps:** Discord (story 1), WhatsApp (story 2), a marketplace screenshot (story 4), an order form's text (story 5), plain text (story 6, book #14).
- **In PactPal's chat, long enough to scroll:** stories 1 (about 30 messages), 2 (40+), 3 (about 35), and short threads on most book deals.
- Every chat is written for its story: names, dates and amounts match the agreement, and the disputes' key lines (the declined blog, the missed deadline) are in them.

## What is done by hand

| Who         | What                                                                                                          | When                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Owner       | Inboxes, sandbox accounts and apps, first PayPal sign-in per seller                                           | Before the seed                                |
| Owner       | Images for stories 1, 2 (bakery photos), 3 and 5                                                              | Before the seed                                |
| Owner       | Open each dispute as the buyer on the sandbox site (stories 2–5) and decide it with the sandbox's decide link | During the seed, when it pauses and says which |
| Owner       | Pay an invoice as the buyer, if PayPal needs the buyer to log in (checked when the seed is built)             | During the seed                                |
| Seed script | Everything else, through PactPal's own server, as the seller or the buyer                                     | One run, after the redesign merge              |

## Running the seed (9b-2c)

Each story is one run of the `seed-demo` Workflow task with input `{"story": "1"}` (stories `"1"` to `"6"`, and `"book"`); `"dryRun": true` only lists the steps left. A run does all it can, then stops and logs one instruction; do it, then start the same story again. Nothing is ever done twice.

1. Before the first run: every seller has signed in once and linked their app; `hackathon/demo/chats/story5-listing-url.txt` holds the camera's product page address (one Channel3 knows).
2. **"Pay stage N … as <buyer>"**: sign in to the PayPal sandbox as that buyer and pay the invoice at the link given.
3. **"Open a dispute as <buyer>"**: in the sandbox, open it on that payment with the reason and words given.
4. **"Send the evidence / decide"**: in PactPal as the seller, open the dispute and send the packet (or, story 3, offer the partial refund); then decide the case on the sandbox site.
5. A failed AI step (quota, a draft that did not pass PactPal's checks) is retried by running the story again; the seed waits at least 20 seconds between AI steps.

Order: book first (most invoices, one pause for all of them), then stories 1 to 6.

## Video outline (final script in 9f)

Under 3 minutes: the problem (a seller loses a dispute they should win), story 1 in fast motion (chat to signed agreement to paid), story 2's dispute answered from the record, story 3's honest "you should refund", the agent asking Maya for approval, and the dashboard over Maya's book of deals. Sandbox noted on screen; no third-party logos or copyrighted music.
