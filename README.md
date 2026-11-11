# PactPal

**AI that seals the deal.** PactPal turns a deal made anywhere (a chat, an email, a platform message) into a signed, timestamped record tied to a PayPal invoice. When a buyer later opens a dispute, that record becomes a ready evidence packet, and an appeal check if the decision goes the wrong way.

Built for the [Build What's Next with PayPal and AI](https://paypalaihackathon.devpost.com/) hackathon.

## Status

Early development. What exists today:

| Part               | State                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `packages/ledger`  | Hash-chained, append-only evidence ledger with tamper verification                         |
| `packages/council` | Vote aggregation for the LLM council (Borda count, agreement score)                        |
| `packages/paypal`  | PayPal access: login, invoices, disputes, answers, notifications; MCP first, REST fallback |
| `apps/server`      | Fastify server: health check, verified PayPal notifications, sandbox commands              |
| `apps/web`         | React app placeholder                                                                      |

## Docs

| Doc                                                              | What it covers                                                       |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| [`docs/product.md`](docs/product.md)                             | Product spec: flow, AI roles, ledger, evidence packet, screens       |
| [`docs/scope.md`](docs/scope.md)                                 | Supported deals, what is out of scope and why, roadmap               |
| [`docs/engineering-standards.md`](docs/engineering-standards.md) | Engineering standards and the verify gate                            |
| [`docs/build-plan.md`](docs/build-plan.md)                       | End-to-end build phases, dependencies and decision gates             |
| [`docs/decisions.md`](docs/decisions.md)                         | Design decisions and their reasons                                   |
| [`docs/sandbox-notes.md`](docs/sandbox-notes.md)                 | PayPal sandbox lessons learned                                       |
| [`docs/spike-results.md`](docs/spike-results.md)                 | Sandbox feasibility tests                                            |
| [`hackathon/demo-plan.md`](hackathon/demo-plan.md)               | Hackathon only: demo stories, cast, seed plan (not on the docs site) |

## Running locally

Requirements: Node 22+, pnpm 10+.

```bash
pnpm install
cp .env.example .env   # fill in your own sandbox credentials
pnpm test              # ledger, council and server tests
pnpm dev               # server on :3000, web on Vite's default port
```

`GET /health` reports which environment variables are still missing.

## Connect your agent (MCP)

PactPal is also an MCP server, so an AI assistant can work with your deals. On the home page, under "Connect your AI agent", make an agent key, then add the server:

```bash
claude mcp add --transport http pactpal https://<your site>/mcp --header "Authorization: Bearer ppk_..."
```

For Claude Desktop or Cursor, add a remote server with the URL `https://<your site>/mcp` and the header `Authorization: Bearer ppk_...`. To try it by hand, run `npx @modelcontextprotocol/inspector` and connect with "Streamable HTTP" to the same URL and header.

The agent can read deals and disputes, create draft deals and build evidence packets. To send an invoice or evidence to PayPal it only asks: approve the request on the deal page, then give the agent the one-time code shown there. See [docs/product.md](docs/product.md#mcp-server-for-agents).

## Product listings (Channel3)

For goods and digital products, paste the product's listing link on the deal's Agreement tab ("What's being sold"). PactPal reads it through Channel3 and the buyer signs the listing's details with the rest of the agreement. Set `CHANNEL3_API_KEY` (see `.env.example`); without it the box says lookup is not set up.

## Deploying to Render

The site lives at **https://pact-pal.app** and its help at **https://help.pact-pal.app** (Render custom domains, DNS at name.com; the old `onrender.com` page addresses move there, while PayPal notifications, `/mcp`, `/api`, `/health` and `/brand` are still answered on the old name). Everything is described in [`render.yaml`](render.yaml) (a Render Blueprint), in Virginia:

| Render service         | Name                    | What it does                                                                                                                   |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Web Service (2 copies) | `pactpal-server`        | The website, API, live chat and MCP server; runs migrations before each deploy                                                 |
| Workflows              | `pactpal-workflows`     | Dispute checks, scope drafts, the dispute councils and the retention clean-up; each AI model call is its own run (`ask-model`) |
| Cron Job               | `pactpal-dispute-check` | Starts a dispute check every 5 minutes                                                                                         |
| Cron Job               | `pactpal-retention`     | Starts the daily retention clean-up ([privacy](docs/privacy.md))                                                               |
| Postgres 16            | `pactpal-db`            | Deals, the evidence log, files, chat and jobs                                                                                  |
| Key Value              | `pactpal-kv`            | Agent call counts and cached product listings, shared by both copies                                                           |
| Static Site            | `pactpal-docs`          | These docs as a website                                                                                                        |
| Environment Group      | `pactpal-shared`        | Keys the website, Workflows and the Cron Job all need, kept once                                                               |

1. In Render, create the Environment Group `pactpal-shared` (**Environment Groups → New**) with `PAYPAL_SELLER_CLIENT_ID`, `PAYPAL_SELLER_CLIENT_SECRET`, the AI keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `MISTRAL_API_KEY`, `OPENROUTER_API_KEY`), `RESEND_API_KEY`, `EMAIL_FROM`, `PUBLIC_BASE_URL`, `SELLER_KEYS_ENCRYPTION_KEY` and `RENDER_API_KEY`. Secrets cannot be written in `render.yaml`, so the group is made by hand.
2. Choose **New → Blueprint**, pick this repository and the `dev` branch, and enter the values Render asks for (leave `PAYPAL_WEBHOOK_ID` empty at first). On `pactpal-server` this includes the AG Grid / AG Studio and Bryntum licence keys (`VITE_AG_LICENCE_KEY` for AG Studio, `VITE_AG_GRID_LICENCE_KEY` for AG Grid Enterprise, `VITE_BRYNTUM_LICENCE_KEY`): they are read while the pages are built and ship inside them, as both vendors intend, so change them and then redeploy. The current keys are trials ending 24 and 26 Dec 2026; without them the charts show the vendors' trial marks.
3. Register the service's notification address with PayPal, then set the printed id as `PAYPAL_WEBHOOK_ID` in Render:

```bash
pnpm sandbox:webhook --register https://<your-service>.onrender.com/webhooks/paypal --send
```

`pnpm sandbox:webhook --events` shows PayPal's record of recent notifications and whether they were delivered.

## Changing emails

Every email's wording and look lives in [`templates/`](templates), not in code:

| File                             | What it sets                                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `templates/brand.json`           | Product name, logo address, colours, footer lines, help and privacy links                                                                                   |
| `templates/emails/layout.html`   | The design every email shares                                                                                                                               |
| `templates/emails/<kind>.txt`    | One email: `subject:`, `tag:`, `tone:` (`ok`, `wait`, `alert`, `ai`, `info`), `heading:`, `button:` (label \| link), `fact:` lines, then `---` and the text |
| `templates/brand/logo-email.png` | The logo emails show                                                                                                                                        |

Fields such as `{{dealTitle}}` are filled in for each email; `{{#message}}…{{/message}}` shows a part only when there is a message. The same file gives the designed email and its plain-text copy. Edit, run `pnpm test` (a broken template or a field the email does not have fails it), push, and Render redeploys in a few minutes. The sandbox notice is added to every email and cannot be removed. The receipt and evidence packet PDFs are evidence, so their look is fixed in code for each document format.

## Quality

Every change must pass one command, locally and in CI:

```bash
pnpm verify
```

It checks formatting, types, strict linting, tests with coverage, duplicate code, architecture boundaries and known vulnerabilities. The rules are in [`docs/engineering-standards.md`](docs/engineering-standards.md).

## Code map

[`graphify-out/`](graphify-out) holds a map of the code (files, functions, types and the links between them) built by [graphify](https://github.com/Graphify-Labs/graphify) from the source alone, offline. Open `graphify-out/graph.html` in a browser to explore it, or read `graphify-out/GRAPH_REPORT.md` for a summary.

Requirements: Python 3.10+ and [uv](https://docs.astral.sh/uv/).

```bash
uv tool install graphifyy==0.9.103   # the package name has two y's
pnpm graph                           # rebuild the map after code changes
graphify query "how is a ledger event appended"
graphify explain "appendLedgerEvent()"
graphify path "DealPage.tsx" "appendLedgerEvent()"
```

The map is committed and rebuilt before each commit; after a merge conflict in `graphify-out/`, run `pnpm graph` and commit the result.

## Disclaimer

PactPal is a record-keeping tool, not a law firm, and nothing it produces is legal advice. It runs against the PayPal sandbox only. It reports how complete a seller's records are; it never predicts or guarantees a dispute outcome.

## License

[MIT](LICENSE)
