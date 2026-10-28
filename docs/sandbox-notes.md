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
- The official toolkit's dispute tools cover list, get and accept claim. There are no MCP tools for evidence, offers, appeals or messages; PactPal uses REST for those.
- Using the REST API directly is acceptable for the hackathon; PayPal invites feedback on missing MCP tools.

## Reliability

- Refunds on invoice captures intermittently returned `500 INTERNAL_SERVICE_ERROR`. Retry with a stable `PayPal-Request-Id` so retries never duplicate.
- **Webhooks are the source of truth.** Cross-check synchronous responses against webhook events, and mock responses to test asynchronous cases the sandbox does not reproduce.
- OAuth tokens last about nine hours; refresh before they expire.

## Documentation

- `docs.paypal.ai` is deprecated; use `developer.paypal.com` (for disputes: `/disputes/set-up` and `/disputes/test-go-live`).
- Official resources: the AI tools getting-started page on developer.paypal.com, the PayPal Postman collection at postman.com/paypal, and github.com/paypal-examples/docs-examples.
