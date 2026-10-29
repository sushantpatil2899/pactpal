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

| Doc                                                              | What it covers                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| [`docs/product.md`](docs/product.md)                             | Product spec: flow, AI roles, ledger, evidence packet, screens |
| [`docs/scope.md`](docs/scope.md)                                 | Supported deals, what is out of scope and why, roadmap         |
| [`docs/engineering-standards.md`](docs/engineering-standards.md) | Engineering standards and the verify gate                      |
| [`docs/build-plan.md`](docs/build-plan.md)                       | End-to-end build phases, dependencies and decision gates       |
| [`docs/decisions.md`](docs/decisions.md)                         | Design decisions and their reasons                             |
| [`docs/sandbox-notes.md`](docs/sandbox-notes.md)                 | PayPal sandbox lessons learned                                 |
| [`docs/spike-results.md`](docs/spike-results.md)                 | Sandbox feasibility tests                                      |
| [`docs/demo.md`](docs/demo.md)                                   | Demo stories, video script, seed script                        |

## Running locally

Requirements: Node 22+, pnpm 10+.

```bash
pnpm install
cp .env.example .env   # fill in your own sandbox credentials
pnpm test              # ledger, council and server tests
pnpm dev               # server on :3000, web on Vite's default port
```

`GET /health` reports which environment variables are still missing.

## Deploying to Render

The server is described in [`render.yaml`](render.yaml) (a Render Blueprint).

1. In Render, choose **New → Blueprint**, pick this repository and the `dev` branch.
2. Enter the values Render asks for: `PAYPAL_SELLER_CLIENT_ID` and `PAYPAL_SELLER_CLIENT_SECRET` (leave `PAYPAL_WEBHOOK_ID` empty at first).
3. Register the service's notification address with PayPal, then set the printed id as `PAYPAL_WEBHOOK_ID` in Render:

```bash
pnpm sandbox:webhook --register https://<your-service>.onrender.com/webhooks/paypal --send
```

`pnpm sandbox:webhook --events` shows PayPal's record of recent notifications and whether they were delivered.

## Quality

Every change must pass one command, locally and in CI:

```bash
pnpm verify
```

It checks formatting, types, strict linting, tests with coverage, duplicate code, architecture boundaries and known vulnerabilities. The rules are in [`docs/engineering-standards.md`](docs/engineering-standards.md).

## Disclaimer

PactPal is a record-keeping tool, not a law firm, and nothing it produces is legal advice. It runs against the PayPal sandbox only. It reports how complete a seller's records are; it never predicts or guarantees a dispute outcome.

## License

[MIT](LICENSE)
