# Privacy

PactPal is a hackathon demo that runs on PayPal's **sandbox**: no real money moves. Use made-up details only. This page says what PactPal keeps, why, for how long, and who else sees it. It is not legal advice.

## What PactPal keeps

| What                                                                                                       | Why                                                        |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Your email, one display name and your PayPal account id (when you sign in with PayPal)                     | To sign you in and to tell you about your deals            |
| Each deal's evidence log: agreed terms, versions, signatures (the typed name), payments, deliveries, steps | So either side can show what was agreed and done           |
| Files you add (chats, deliverables, screenshots) and the deal's chat messages                              | They are the evidence                                      |
| The browser and, when known, the IP address of each recorded action                                        | Part of the evidence of who did what, and when             |
| PayPal's record of a dispute on a deal, including the buyer's messages to PayPal                           | To answer the dispute with the right evidence              |
| AI drafts of the agreed work, which quote the pasted chat                                                  | To suggest terms; the seller decides what is kept          |
| PayPal's notifications as received                                                                         | To process payments and disputes exactly once              |
| A sign-in cookie                                                                                           | To keep you signed in. There are no tracking or ad cookies |

Server logs name records by id and never hold messages, files, addresses or keys.

## How long

A clean-up runs every day ([decisions](decisions.md), Retention and privacy):

| What                                                                                        | Removed                                                 |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| A deal and everything about it (log, files, chat, signatures, disputes, packets, reminders) | **210 days** after the deal's last activity             |
| A deal with a PayPal dispute that is not resolved                                           | Kept until the dispute is resolved, then 210 days later |
| PayPal's raw notifications, and AI drafts with their chat quotes                            | **60 days** after they arrive                           |
| Expired sign-ins and buyer links                                                            | At the next clean-up                                    |

210 days covers PayPal's dispute and chargeback window (about 180 days after a payment) with a buffer. A deal is removed whole, never in part, so a kept deal's evidence always checks out. Your account (email, name) stays while you use PactPal; to have it removed, ask the project owner through the repository.

## Who else sees it

| Service                                                  | What it receives                                                                    |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| PayPal (sandbox)                                         | Invoices, and the evidence a seller chooses to send for a dispute                   |
| AI model hosts: Google Gemini, Groq, Mistral, OpenRouter | Pasted chats, the deal's chat for drafts, and dispute claims, to draft and compare  |
| Resend                                                   | Email addresses and the text of PactPal's emails, to send and receive them          |
| Channel3                                                 | Product page addresses a seller looks up                                            |
| Render                                                   | Everything, as PactPal's host (database, files, background tasks), in Virginia, USA |
| Cloudflare                                               | Each visit's address, as it passes in front of the site                             |

Some AI hosts' free plans may keep what they receive, use it to improve their models, or have people read it; Google says not to send personal data to its free tier. That is why the demo uses made-up chats only. Before any real use, PactPal would move to paid plans that do not train on what they receive ([decisions](decisions.md), Retention and privacy).

What an AI suggests is never sent anywhere by itself: a person confirms every invoice, message and piece of evidence.
