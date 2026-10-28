# Decisions

A running log of design decisions and the reasons behind them. Newest decisions are added at the bottom of each section.

## Product

| Decision | Reason |
|---|---|
| Name: **PactPal** | Follows PayPal's two-part pattern (what you do + why you trust it). No conflicting product or USPTO mark found; `pactpal.com` was available at the time of checking. |
| Primary user is the **seller** (freelancer, creator, small business paid via PayPal) | Buyers open disputes; sellers are the ones who need a defense. Buyer features are advisory only. |
| Core idea: create evidence **at the time of the deal**, not after a dispute opens | Existing dispute tools rebuild evidence after the fact. Records made with the buyer's explicit agreement are stronger and cheaper. |
| No escrow, no holding funds | PayPal's user agreement states PayPal is not an escrow agent, and holding funds raises money-transmission questions. Milestone invoices give the same structure. |
| No buyer-side claim filing | Buyers must file claims themselves in PayPal's Resolution Center. |
| Never promise outcomes | The product reports "evidence completeness", never "you will win" or that Seller Protection applies. |
| Sellers can use PactPal for **services and digital work** (focus) and **small physical goods** | These are where PayPal disputes reach sellers directly and proof of scope, delivery and approval is hardest. Physical goods with tracking already have stronger protection, so they are supported but not the focus. |
| **Deposit bookings, retainers and regulated services are blocked** ("not supported yet") | More dispute-prone and rule-heavy (cancellation terms, professional regulation). On the roadmap. |
| PayPal-prohibited categories and high-risk extras are blocked | Gift cards and stored value, crypto, NFTs and investments, vehicles and real estate, plus everything in PayPal's Acceptable Use Policy. See [scope.md](scope.md). |

## AI

| Decision | Reason |
|---|---|
| AI drafts, humans decide | AI never creates evidence, timestamps or approvals. Every send to a buyer or to PayPal needs explicit confirmation. |
| Citations or blank | Every AI-drafted field or sentence must cite a source line or ledger event id; otherwise it stays blank. Code checks this. |
| AI across the whole deal | Scope drafting from chat, pre-delivery scope check, message watcher for scope creep, buyer Q&A answered only from the agreement, claim-vs-record breakdown when a dispute opens, appeal check. |
| **LLM council** for high-stakes tasks (scope extraction, claim-vs-record, appeal statement) | Independent models cross-check each other. Answers failing code validation are dropped, the rest are anonymized and ranked by every member, a Borda count picks one whole answer, and low agreement flags the result for human review. Prior work: Karpathy's LLM Council and Mixture-of-Agents research. |
| Single fast model for frequent tasks (message watcher, buyer Q&A) | Latency and cost. |
| **Open-model council** (different families, e.g. Llama, Mistral, Qwen) via hosted APIs | Diversity across model families, low cost. The registry accepts any OpenAI-compatible endpoint, so closed models can be added if evals show a gap. Hosted only, no local mode. |
| Measure, don't claim | Evals compare single-model and council results on a fixed test set before any claim is made in the submission. |
| **AI category check** | While drafting the scope, the AI also classifies what is actually being sold from the conversation. A mismatch with the seller's chosen category is flagged; a blocked category stops the deal. The notice is logged in the ledger. |
| Proposed council hosts: Llama via Groq, Mistral via Mistral's API, Qwen via OpenRouter | Three model families from three different companies, each with a free tier or low cost. Pending sign-up; the registry makes swapping a host a config change. |

## PayPal integration

| Decision | Reason |
|---|---|
| **MCP first, REST fallback** | Each operation tries a PayPal MCP tool first (Agent Toolkit or the hosted sandbox MCP) and falls back to REST if the tool is missing, errors or times out. Operations without an MCP tool (evidence, offers, appeals, messages, webhook verification) use REST directly. The transport used is recorded and shown. |
| Sellers connect their own PayPal account | Main path: Partner Referrals ("Connect with PayPal") with invoicing and dispute permissions, calling on the seller's behalf with `PayPal-Auth-Assertion` (payer id, not email). Fallback: the seller connects their own sandbox REST app. |
| Webhooks as the source of truth, polling as backup | Dispute webhooks may not reach a platform for every seller; the dispute list is polled per seller as a backup. |
| Read allowed actions from PayPal every time | Allowed actions and offer types change with dispute state; never assume them. Dispute writes are sent one at a time. |
| US sandbox accounts | Sandbox capabilities vary by country; US accounts support the full flow. |
| Test disputes via a second business account | A sandbox business account acting as the buyer can create disputes through its own REST app. Packaged as a sandbox seed script. |

## Engineering

| Decision | Reason |
|---|---|
| TypeScript end to end (React + Vite, Node + Fastify, Postgres) | One language; first-class support in the partner tools and the PayPal Agent Toolkit. |
| Hash-chained, append-only ledger | Each entry includes the previous entry's hash, so edits, backdating and deletions are detectable. Corrections are new events. |
| MIT license | Simple and widely understood. |

## Partner tools

| Tool | Use |
|---|---|
| Render | Hosting, plus Workflows for reminders, dispute polling and AI jobs |
| Zapier MCP | Gmail and Discord messages into the message watcher |
| Postman | Public workspace for the PactPal API and PayPal sandbox calls |
| AG Grid | Deals dashboard, evidence ledger, disputes list, exhibit table |
| Bryntum | Milestone Gantt per deal and a deadline calendar |
| Astropods | Agent hosting, AI gateway and automated evals (pending evaluation) |
| KERNEL | Snapshot of delivered websites as proof of delivery; feeds the pre-delivery check |
| APIMatic | SDKs and developer portal generated from the PactPal OpenAPI spec |
| Channel3 | Product details for physical-goods deals, so "not as described" claims can be checked |
| Elastic | Only if credits last through judging |
