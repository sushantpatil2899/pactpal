# Build plan

The end-to-end build in eight phases, in dependency order. Phases 1–5 form the core loop; 6–7 layer on top; 8 ships it. See [product.md](product.md) for what each feature does.

| #   | Phase                           | What gets built                                                                                                                                                                                                                                                                                                                       | Done when                                                                                                     |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 0   | **Foundations** ✅              | Project skeleton, hash-chained evidence ledger, council vote aggregation, docs                                                                                                                                                                                                                                                        | Done                                                                                                          |
| 1   | **PayPal sandbox and client**   | Run the tests in [spike-results.md](spike-results.md). Real PayPal client (MCP first, REST fallback). Webhook receiver with signature verification. Seed script v1: invoice → pay with balance → open dispute.                                                                                                                        | One command creates a real sandbox dispute, and the spike results are recorded                                |
| 2   | **Server core**                 | Database schema (sellers, buyers, deals, scope versions, milestones, artifacts, ledger, disputes, packets, webhook events). Ledger persisted. File storage with SHA-256 fingerprints. Seller sign-in and buyer magic links.                                                                                                           | A deal can be created and every change appears in a verifiable ledger                                         |
| 3   | **AI layer**                    | Model registry and OpenAI-compatible client. Council runner (answer → validate → anonymize → rank → aggregate) built on `packages/council`. Prompts, JSON schemas, citation validator. First tasks: scope drafting, category check, vague-word rewrites. Prompt-injection test set. Evals harness comparing single model and council. | A pasted chat becomes a cited scope through the council, and evals report a number                            |
| 4   | **Deal lifecycle** (happy path) | New deal (paste, upload, email or Zapier). Scope editor. Buyer acceptance page with Q&A, receipt PDF and email. Milestone invoices and payment webhook. Delivery links with access log, approve or request changes. Pre-delivery check. Message watcher and change orders. Evidence completeness score.                               | The Maya story runs from chat to final download in the sandbox                                                |
| 5   | **Dispute and appeal**          | Dispute intake by webhook or polling, matched to deals. Dispute workspace with deadline and allowed actions. Claim-vs-record (council). Packet PDF builder with size meter. Confirm and upload evidence. Offers limited to allowed types. Appeal check and submission. Deadline reminders on Render Workflows.                        | Maya's and Jun's disputes get real evidence uploads; Daniel's appeal check works (real, or a labelled replay) |
| 6   | **Seller connection**           | "Connect with PayPal" via Partner Referrals with `PayPal-Auth-Assertion`; fallback where sellers connect their own sandbox app                                                                                                                                                                                                        | A second sandbox seller connects and has invoices and disputes handled on their behalf                        |
| 7   | **Agents and partner tools**    | MCP server for agents with confirm tokens. AG Grid tables, Bryntum Gantt and calendar. KERNEL website snapshots. Channel3 product details for goods. Postman workspace. APIMatic SDK and portal from the OpenAPI spec. Zapier intake. Astropods for agent hosting and evals.                                                          | Each partner tool has one real, visible use                                                                   |
| 8   | **Ship**                        | Deploy on Render (app, Postgres, Workflows) with seeded demo deals. README, tools explanation and eval numbers. Security and privacy pass. Demo video. Merge `dev` into `main`, make the repo public, submit on Devpost.                                                                                                              | Submission confirmed, at least a day before the deadline                                                      |

## Dependencies

- **1 → 2 → 3 → 4 → 5 is the critical path.** After phase 5 the full demo story works end to end.
- **Phase 3 can run alongside 1–2**: it needs model keys, not PayPal.
- **Phases 6 and 7 sit on top** and do not block the core loop; the demo can run on a seller's own connected app if partner onboarding is delayed.

## Decision gates

| After   | Decision                                                                                                        |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| Phase 1 | Whether dispute verdicts and appeals can be exercised for real in the sandbox, or are shown as labelled replays |
| Phase 3 | Where the council is worth its cost, based on eval numbers                                                      |
| Phase 6 | Depends on PayPal's answer about sandbox Partner Referrals capabilities                                         |

## Prerequisites

| Needed before | What                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Phase 1       | PayPal sandbox app credentials set as environment variables (names in [`.env.example`](../.env.example)) |
| Phase 3       | API keys for the council's model hosts                                                                   |
| Phase 8       | A Render account                                                                                         |
