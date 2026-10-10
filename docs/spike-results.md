# Sandbox feasibility tests

Facts to establish against the PayPal sandbox before building on assumptions. For each test, record pass or fail, what exactly happened (including the `PayPal-Debug-Id` for failures), and the fallback chosen.

Status: not started. Waiting on network access to the sandbox from the development environment.

## Accounts and connection

| # | Test | Pass looks like | If it fails | Result |
|---|---|---|---|---|
| S0a | Platform app: call Partner Referrals, onboard a second sandbox business account, then create an invoice and list disputes for it with `PayPal-Auth-Assertion` | Invoice created and disputes listed on the seller's behalf | Seller connects their own sandbox REST app instead | |
| S0b | Do dispute webhooks reach the platform app for a seller onboarded through Partner Referrals? | `CUSTOMER.DISPUTE.CREATED` received | Poll `GET /v1/customer/disputes` per seller | |
| S0c | Does the PayPal MCP server / Agent Toolkit work on behalf of an onboarded seller? | Tool call succeeds for the seller | REST for seller-scoped calls | |
| 1 | Sandbox apps have Customer disputes, Log in with PayPal and Transaction search enabled | Calls return data, no `PERMISSION_DENIED` | Ask in the PayPal Discord | Features enabled in dashboard |

## Invoices and webhooks

| # | Test | Pass looks like | If it fails | Result |
|---|---|---|---|---|
| 2 | Create and send a sandbox invoice; pay it as the sandbox buyer using **PayPal balance** | Invoice paid; webhook received | Check invoicer email and app webhook binding | |
| 3 | Webhook signature verification using the raw body and webhook id | Verification succeeds on real events | Fix raw body handling | |
| 3b | Hosted MCP `create_invoice` vs REST | Note which works; confirm automatic REST fallback | REST only for invoices | |

## Disputes

| # | Test | Pass looks like | If it fails | Result |
|---|---|---|---|---|
| 4 | Buyer business account creates a dispute via `POST /v1/customer/disputes` against a paid invoice | Dispute visible via the Disputes API for the seller | Open the case by hand in the sandbox Resolution Center | |
| 5 | GET the dispute: status, due date, allowed actions, offer types, buyer's claim text | All fields present | Adjust state handling | |
| 6 | Provide evidence with a PDF (try both multipart styles); note size and notes limits | Evidence appears on the dispute | Mark upload unavailable; offer packet download | |
| 7 | Move the case with sandbox helper actions (require evidence, adjudicate) for a balance-funded payment | Status changes; adjudicate available | Document; use labelled replay | |
| 8 | Appeal with a buyer email containing `allowappeal` | Appeal action available and accepted | Show the appeal check without submission, labelled | |
| 9 | Make offer: which offer types are accepted at each stage | Documented per stage | Only suggest allowed types | |

## AI

| # | Test | Pass looks like | If it fails | Result |
|---|---|---|---|---|
| 10 | Scope extraction on three sample threads (art commission, web project, consulting) with the council | Cited fields, correct blanks, vague words flagged | Tune prompts and schema | |
| 11 | Claim-vs-record: does the dispute include the buyer's claim text? | Claim text available | Use reason code plus seller-pasted messages | |
| 12 | Vision check on three sample deliverables against their scope lines | Correct pass/flag | Limit to code checks (format, size, transparency) | |
| 13 | Council vs single model on a fixed test set | Fewer invalid citations with the council | Single model for that task | |

## Packet

| # | Test | Pass looks like | If it fails | Result |
|---|---|---|---|---|
| 14 | Generate a packet PDF with 10 exhibits; check the size meter | Under 10 MB per file | Split or compress | |
