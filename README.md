# PactPal

**AI that seals the deal.** PactPal turns a deal made anywhere (a chat, an email, a platform message) into a signed, timestamped record tied to a PayPal invoice. When a buyer later opens a dispute, that record becomes a ready evidence packet, and an appeal check if the decision goes the wrong way.

Built for the [Build What's Next with PayPal and AI](https://paypalaihackathon.devpost.com/) hackathon.

## Status

Early development. What exists today:

| Part | State |
|---|---|
| `packages/ledger` | Hash-chained, append-only evidence ledger with tamper verification |
| `packages/council` | Vote aggregation for the LLM council (Borda count, agreement score) |
| `packages/paypal` | Interface for the PayPal access layer (MCP first, REST fallback) |
| `apps/server` | Fastify server with a health check |
| `apps/web` | React app placeholder |

See [`docs/decisions.md`](docs/decisions.md) for the design decisions and [`docs/spike-results.md`](docs/spike-results.md) for sandbox feasibility tests.

## Running locally

Requirements: Node 22+, pnpm 10+.

```bash
pnpm install
cp .env.example .env   # fill in your own sandbox credentials
pnpm test              # ledger, council and server tests
pnpm dev               # server on :3000, web on Vite's default port
```

`GET /health` reports which environment variables are still missing.

## Disclaimer

PactPal is a record-keeping tool, not a law firm, and nothing it produces is legal advice. It runs against the PayPal sandbox only. It reports how complete a seller's records are; it never predicts or guarantees a dispute outcome.

## License

[MIT](LICENSE)
