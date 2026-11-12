# Deploying PactPal to Render

The site lives at **https://pact-pal.app** and its help at **https://help.pact-pal.app** (Render custom domains, DNS at name.com; the old `onrender.com` page addresses move there, while PayPal notifications, `/mcp`, `/api`, `/health` and `/brand` are still answered on the old name). Everything is described in [`render.yaml`](../render.yaml) (a Render Blueprint), in Virginia:

| Render service         | Name                    | What it does                                                                                                                   |
| ---------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Web Service (2 copies) | `pactpal-server`        | The website, API, live chat and MCP server; runs migrations before each deploy                                                 |
| Workflows              | `pactpal-workflows`     | Dispute checks, scope drafts, the dispute councils and the retention clean-up; each AI model call is its own run (`ask-model`) |
| Cron Job               | `pactpal-dispute-check` | Starts a dispute check every 5 minutes                                                                                         |
| Cron Job               | `pactpal-retention`     | Starts the daily retention clean-up ([privacy](privacy.md))                                                                    |
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
