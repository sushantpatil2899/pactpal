# Scope

What PactPal does, what it deliberately does not do, and why. If a feature is proposed later, check here first.

## Who can use it, and for what

| Tier | Deals | Status |
|---|---|---|
| 1 | **Services and digital work:** art and design commissions, writing and translation, web and software projects, video and photo editing, consulting and coaching sessions, digital products (templates, presets, courses) | ✅ Supported, main focus |
| 2 | **Small physical goods** from small sellers: handmade or custom-made items | ✅ Supported, with shipment tracking and product details |
| 3 | Deposit bookings (events, catering, photography), monthly retainers and subscriptions, regulated professional services (legal, medical, financial advice) | ⛔ Blocked with a "not supported yet" message; on the roadmap |
| — | Anything prohibited by PayPal's Acceptable Use Policy, plus: gift cards and stored value, crypto, NFTs and investments, vehicles and real estate | ⛔ Blocked |

**How it is enforced**

1. The seller picks a category when creating a deal.
2. While drafting the scope, the AI also classifies what is being sold from the conversation itself. A mismatch is flagged to the seller; a blocked category stops the deal with an explanation.
3. The notice shown is recorded in the evidence ledger.

The prohibited list is checked against PayPal's current Acceptable Use Policy before release; policy wording changes, so the product links to PayPal's page rather than restating it.

## Explicitly out of scope

| Excluded | Why |
|---|---|
| Holding funds, escrow, releasing money on approval | PayPal's user agreement states PayPal is not an escrow agent; holding money raises money-transmission and liability questions. Milestone invoices give the same structure. |
| Filing claims on behalf of buyers | Buyers must file in PayPal's Resolution Center themselves. PactPal can prepare a summary for them, nothing more. |
| Legal advice, tailored legal terms, generating kill fees or IP outcomes | Avoids unauthorized-practice-of-law risk. Sellers supply their own terms; PactPal offers neutral templates and explanations. |
| AI-generated, altered or backdated evidence | It would destroy the one thing the product sells: trust. Only server-recorded events are evidence; corrections are new events. |
| Win probabilities, "you are protected", Seller Protection claims | PayPal's weighting of evidence is not public, and coverage for services is unclear. PactPal shows evidence completeness only. |
| Scraping, browser extensions or unofficial APIs on other platforms | Their terms restrict it. Paste, upload, email forwarding and official webhooks cover those users. |
| Automatic submission to PayPal without human confirmation | Wrong or incomplete evidence is hard to undo. |
| AI agents accepting or signing on a buyer's behalf | Authority and intent become unclear. Agents may prepare; humans sign. |
| Buyer identity verification (KYC) | Heavy and privacy-sensitive. PactPal states honestly that a typed name and IP address are not proof of identity. |
| Email open-tracking pixels | Unreliable because of mail privacy features. Link clicks and downloads are logged instead. |
| Live money and production credentials | The hackathon runs on the PayPal sandbox; the demo is clearly labelled as sandbox. |
| Native mobile apps | A responsive web app is enough. |
| Running models locally | The council uses hosted model APIs only. |

## Roadmap (not built now)

- Tier 3 deals: deposit bookings, retainers and subscriptions, regulated services, with the extra terms and disclaimers they need
- Production partner approval for "Connect with PayPal"
- Connectors for platforms that keep disputes in-house, if official API access is granted
- Hold, reserve and account-limitation appeal pack
- Card issuer and ombudsman escalation summaries
- More languages and jurisdiction-specific acceptance text, reviewed by a lawyer
- A buyer account experience
