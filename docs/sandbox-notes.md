# PayPal sandbox notes

Practical lessons about the PayPal sandbox, gathered from the hackathon community channels, PayPal developer advocates' answers and our own setup. Verify against the sandbox before relying on any of them; results are recorded in [spike-results.md](spike-results.md).

## Accounts and apps

- **Use US sandbox accounts.** Sandbox capabilities vary by country; several countries cannot create sandbox business accounts or apps, and only a limited set of countries support direct card payments in the sandbox.
- A **Platform** app can be created from the developer dashboard; doing so automatically creates a sandbox business account that acts as the partner.
- Turn on **Customer disputes** (described in the dashboard as "View, provide evidence, and appeal disputes"), **Log in with PayPal** and **Transaction search** in each app's Features.
- Some partner capabilities (for example fee refunds or vaulting for onboarded sellers) are not enabled by default; PayPal can enable them for a sandbox partner account on request.
- Only the app that created a payment can act on it, and an app's owning account cannot be changed.

## Creating test disputes

- Merchants cannot create disputes against buyers.
- Creating a dispute through the API as a **personal** sandbox buyer currently fails with `No permissions to set target_client_id`. The documented buyer-side consent flow does not offer the disputes scope in the dashboard.
- **What works:** a second sandbox **business** account acts as the buyer, has its own REST app, pays the seller, then calls `POST /v1/customer/disputes` with the buyer-side transaction id, a reason and the dispute amount. This is sandbox-only.
- Opening a case by hand in the sandbox Resolution Center also works.

- The create request must include `extensions.merchandize_dispute_properties.issue_type` (`SERVICE` or `PRODUCT`; "merchandize" is PayPal's spelling); without it PayPal answers `400 INVALID_REQUEST` with the detail `MISSING_ISSUE_TYPE`. A plain JSON body works. `pnpm seed:sandbox` sends `merchant_contacted: true`, `merchant_contacted_outcome: "NO_RESPONSE"` and `issue_type: SERVICE` by default.
- A new dispute starts as `OPEN` / `UNDER_PAYPAL_REVIEW` at the `INQUIRY` stage with no seller actions or due date, and is not in the seller's dispute list yet; the single-dispute lookup works at once and shows both transaction ids and the invoice id. After PayPal's short review (about 3½ minutes on 29 October) it becomes `WAITING_FOR_SELLER_RESPONSE` with a 20-day seller due date, appears in the list, and allows `escalate`, `accept_claim`, `send_message` and `make_offer`, but not `provide_evidence`.
- The buyer's `message` sent with the create request did not appear in the dispute's messages.
- Transaction search lags by hours: on 29 October its data was last refreshed at 14:29:59 UTC, after which a payment made later in the afternoon was not found. Copy the buyer's transaction id from the buyer's sandbox Activity page instead.
- Pay sandbox invoices in a browser on a computer: on a phone the PayPal app takes over the pay button and cannot open sandbox links.

## Moving a dispute to a verdict

- When a card-funded dispute is escalated it can become a **chargeback**, where the sandbox adjudicate action may never appear and require-evidence may fail. Use **PayPal balance** as the funding source when a verdict is needed (for example to test appeals).
- The sandbox escalation timing depends on the amount; small test amounts escalate within days.
- Appeal availability can be controlled in tests with special text in the buyer's email address (`allowappeal`, `noappeal`), per PayPal's dispute testing guide.

## Responding to disputes

- **Read allowed actions from the dispute every time** (the HATEOAS links). They change with the dispute's state.
- Offer types are limited: at the inquiry stage of a "not as described" dispute, only `REFUND` and `REFUND_WITH_RETURN` were offered; other types return `INVALID_OFFER_TYPE`.
- After any seller write (message, offer), the dispute can enter a short `UNDER_REVIEW` window that refuses a second write. **Send dispute writes one at a time.**
- Evidence files: PDF, JPG, GIF or PNG, under 10 MB each; a total size limit applies. Exact limits are to be confirmed in the sandbox.

## Acting on behalf of a seller

- With `PayPal-Auth-Assertion`, identify the account with **`payer_id`** (and `sub`), not email: `{"iss": "<client-id>", "payer_id": "<payer-id>", "sub": "<payer-id>"}`.

## MCP and REST

- The hosted sandbox MCP server (`mcp.sandbox.paypal.com`) loads its tools, but in early October 2026 every call failed with `PAYPAL_API_SETUP_ERROR` "Unsupported cache mode: default" while REST calls with the same token worked. PactPal falls back to REST automatically.
- Re-checked on 28 October 2026 with each app's client-credentials token: the documented streamable HTTP address `https://mcp.sandbox.paypal.com/http` returns 404, while `https://mcp.sandbox.paypal.com/sse` connects (server "PayPal MCP Agent") and lists 46 tools for the seller, buyer business and platform apps. Tool calls (`list_invoices`, `list_disputes`) still fail with `PAYPAL_API_SETUP_ERROR` "Unsupported cache mode: default". `pnpm sandbox:check` repeats this check.
- PayPal's MCP tools take no request id, so a write sent over MCP cannot be recognised as a repeat by REST. PactPal therefore falls back to REST for a write only when MCP certainly did not do the work.
- **Observation (not reported upstream by us):** PayPal's maintainer traced the error to a component of the hosted server (axios 1.20.0) sending a fetch cache setting that Cloudflare Workers reject, and deployed a fix on 9 October ([paypal/AI-Toolkit#34](https://github.com/paypal/AI-Toolkit/issues/34), closed 13 October). On 28 October it fails again: `list_invoices` and `list_disputes` at 21:48 UTC for all three apps, and again at 21:51 UTC after the seller app's token was revoked (`/v1/oauth2/token/terminate`) and a new 9-hour token issued. The same question was raised in the hackathon Discord (#dev-questions). Our connection matches PayPal's official `.mcp.json` (`/sse` with a Bearer token). The local server `@paypal/mcp` 1.8.1 (agent toolkit 1.11.0) answered `list_disputes` with the same token. Until the hosted server recovers, every PactPal call is served over REST; `pnpm sandbox:check` shows when MCP works again.
- The official toolkit's dispute tools cover list, get and accept claim. There are no MCP tools for evidence, offers, appeals or messages; PactPal uses REST for those.
- Using the REST API directly is acceptable for the hackathon; PayPal invites feedback on missing MCP tools.

## Webhooks

- PactPal's server on Render, `https://pactpal-server.onrender.com/webhooks/paypal`, is registered for the seller app (webhook id `4RE47127PE423000W`, not a secret) for invoice, payment and dispute events. `pnpm sandbox:webhook --list` shows it.
- The first live notification arrived 14 seconds after PayPal created the event, and passed verification.
- The invoice paid notification arrived 12 seconds after PayPal created it, and passed verification.
- **No `CUSTOMER.DISPUTE.CREATED` was created for the seller app** when a buyer opened a dispute through the API on 29 October: PayPal's event record had only the invoice events 48 minutes later, and the server logged nothing. PactPal must also poll the seller's disputes, not rely on dispute notifications alone.
- When searching Render's Logs, choose "Last 24 hours" or Live tail: a fixed time range hides newer entries.
- PayPal's sandbox event record (`GET /v1/notifications/webhooks-events` and the single-event lookup) has no delivery results, so confirm delivery in the server's logs on Render (search for the event id).

## Reliability

- Refunds on invoice captures intermittently returned `500 INTERNAL_SERVICE_ERROR`. Retry with a stable `PayPal-Request-Id` so retries never duplicate.
- **Webhooks are the source of truth.** Cross-check synchronous responses against webhook events, and mock responses to test asynchronous cases the sandbox does not reproduce.
- OAuth tokens last about nine hours; refresh before they expire.

## Documentation

- `docs.paypal.ai` is deprecated; use `developer.paypal.com` (for disputes: `/disputes/set-up` and `/disputes/test-go-live`).
- Official resources: the AI tools getting-started page on developer.paypal.com, the PayPal Postman collection at postman.com/paypal, and github.com/paypal-examples/docs-examples.
