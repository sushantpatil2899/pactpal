# Demo plan

The hosted demo ships with three seed deals so judges can explore without setup, plus a sandbox seed script that recreates them in any sandbox. All names, amounts and dates are invented.

## Story 1: Maya, digital artist (main story)

Chris asks Maya on Discord for a full-body character illustration with a transparent background for his game's store page, $240.

1. **Capture.** Maya pastes the two-day chat into PactPal.
2. **Scope.** The council drafts the scope with citations (deliverable from message 14, format from message 22, price from message 31). Deadline, revision limit and exclusions are marked missing. "Clean, modern look" is flagged as subjective and tied to sketch approval. The category check agrees: digital service. Maya adds Nov 20, two revisions, and "no merchandise use, no background art".
3. **Agree.** Chris asks on the acceptance page, "Can I put this on t-shirts?" The answer cites the exclusion: no. He signs. Both get the receipt.
4. **Pay.** Two PayPal invoices, 50% each. Chris pays the deposit from his PayPal balance.
5. **Deliver.** Maya uploads the sketch; the pre-delivery check confirms a full-body character on a transparent background. Chris requests a pose change (revision 1 of 2), then approves the sketch. Maya delivers the final file; Chris downloads it but does not approve. The second invoice is paid. Completeness score: 86/100, "missing: approval of the final".
6. **Dispute.** Chris opens "significantly not as described: not the style I wanted". The claim-vs-record table matches it to the scope line (look approved at sketch stage) and the sketch approval event. Maya removes one exhibit, confirms, and the packet is uploaded.

## Story 2: Daniel, freelance web developer (change order and appeal)

Rosa hires Daniel for a five-page bakery site, $1,500 in three milestones. "Modern, fast-loading" becomes a measurable speed target. After milestone 2, Rosa asks for online ordering and a blog; the message watcher marks both out of scope and drafts a change order. Rosa accepts ordering and declines the blog. A month later she disputes: "the site has no blog". The dispute is resolved in her favor. The appeal check finds evidence not previously submitted (the change order where she declined the blog) and drafts a short appeal.

## Story 3: Jun, digital templates (download log)

Jun sells a spreadsheet template pack. A buyer claims they never received it. The core exhibit is the delivery log: page opened and zip downloaded, with file hash and time. The dispute is created through the sandbox test lab.

## Contrast clip: a thin packet

The same kind of deal with no acceptance, no approvals and a Friends and Family payment request. The payment guard warns, the score stays low, and the packet shows exactly what is missing. Nothing is invented.

## Video script (under 3 minutes)

| Time      | Scene                                                                           | Voiceover idea                                                                                             |
| --------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 0:00–0:20 | A seller reads "I disputed the payment"                                         | "Sellers lose disputes not because they did the work wrong, but because they can't prove what was agreed." |
| 0:20–0:50 | Paste chat → council drafts scope with citations; council panel shows the votes | "Three independent models draft the agreement. Every line cites the chat, and gaps stay blank."            |
| 0:50–1:20 | Buyer asks a question, signs; PayPal invoice paid                               | "One clear screen. A hashed receipt. A real PayPal invoice."                                               |
| 1:20–1:50 | Pre-delivery check, sketch approval, final download; score rises                | "Delivery and approval are recorded as they happen."                                                       |
| 1:50–2:30 | Dispute arrives; claim-vs-record table; packet uploaded via PayPal              | "The evidence already exists. The AI only matches the claim to the record."                                |
| 2:30–2:50 | Appeal check finds one new exhibit                                              | "Appeals need new evidence. PactPal checks first."                                                         |
| 2:50–3:00 | Logo and tagline                                                                | "PactPal: AI that seals the deal."                                                                         |

## Seed script

One command (`pnpm seed:sandbox`) that, against the user's own sandbox apps:

1. Creates the demo deals and their ledger events.
2. Creates and sends milestone invoices from the seller app.
3. Pays them from the buyer business account using PayPal balance.
4. Opens disputes through the buyer business account's REST app.
5. Prints a summary of what was created.

## Honesty rules for the demo

- The demo runs on the PayPal sandbox and says so on screen.
- Anything replayed or mocked (for example a dispute verdict the sandbox cannot produce) is labelled as such in the UI and the video.
- No third-party logos or copyrighted music in the video.
