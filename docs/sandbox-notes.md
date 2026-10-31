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

What worked on 29–30 October 2026 (`pnpm sandbox:respond`, each step a dry run unless `--send`):

1. Wait for PayPal's first review (about 3½ minutes), then **escalate** (`--escalate`, a real seller action). The dispute moved to stage `CHARGEBACK`, not `ARBITRATION`, for a balance-funded and a bank-funded payment alike, with only `provide_evidence` and `accept_claim` allowed, and no offers.
2. **Provide evidence** (`--evidence OTHER --file ...`). Use a type the dispute requests from the seller (its `evidences` entries with `source: REQUESTED_FROM_SELLER`); others fail with `EVIDENCE_TYPE_IS_NOT_ALLOWED`.
3. Wait for the sandbox-only links `adjudicate` and `require_evidence`: they appeared 12–25 minutes after the evidence, while the dispute was `UNDER_REVIEW`. Earlier community advice that they never appear for chargebacks did not hold here.
4. **Adjudicate** (`--settle seller|buyer`). The outcome was recorded within about a minute: `RESOLVED_SELLER_FAVOUR` released the seller's hold; `BUYER_FAVOR` refunded the buyer from the seller.
5. **Appeal** (only after a buyer-favour verdict, and only when the buyer's email contains `allowappeal`): the dispute moved to `PRE_ARBITRATION` with `appeal` as the only action and about 27 hours to respond. `--appeal --file ...` was accepted.
6. **Decide the appeal** (`--settle seller|buyer`): the `adjudicate` link reappeared about 10 minutes after the appeal. Deciding for the seller did not close the case; it moved to `WAITING_FOR_BUYER_RESPONSE` (still `PRE_ARBITRATION`) with about 27 hours for the buyer to respond, and the refund stayed with the buyer meanwhile.

- Appeal availability is controlled with special text in the buyer's email address (`allowappeal`, `noappeal`), per PayPal's dispute testing guide.
- A new sandbox **personal** buyer can pay invoices and open disputes by hand on `sandbox.paypal.com` (Resolution Center → Report a problem); no REST app is needed. PayPal balance was shown as "unavailable at this time" for a brand-new personal account; a linked bank account worked.
- A dispute opened by hand shows the buyer's text as a `BUYER` message; one opened through the API does not.
- The buyer's view on the sandbox website stops at the first verdict ("closed in your favor") and never shows the appeal or offers a way to respond to it.

## Responding to disputes

- **Read allowed actions from the dispute every time** (the HATEOAS links). They change with the dispute's state.
- Offer types are limited: at the inquiry stage of a "not as described" dispute, only `REFUND` and `REFUND_WITH_RETURN` were offered; other types return `INVALID_OFFER_TYPE`.
- After any seller write (message, offer), the dispute can enter a short `UNDER_REVIEW` window that refuses a second write. **Send dispute writes one at a time.**
- Evidence files: PDF, JPG, GIF or PNG, under 10 MB each; a total size limit applies. A 604-byte PDF was accepted; the exact limits were not tested.
- Allowed offer types by stage ("not as described"): inquiry `REFUND`, `REFUND_WITH_RETURN`; chargeback none; pre-arbitration none (appeal only).

## Acting on behalf of a seller

- With `PayPal-Auth-Assertion`, identify the account with **`payer_id`** (and `sub`), not email: `{"iss": "<client-id>", "payer_id": "<payer-id>", "sub": "<payer-id>"}`.

## MCP and REST

- The hosted sandbox MCP server (`mcp.sandbox.paypal.com`) loads its tools, but in early October 2026 every call failed with `PAYPAL_API_SETUP_ERROR` "Unsupported cache mode: default" while REST calls with the same token worked. PactPal falls back to REST automatically.
- Re-checked on 28 October 2026 with each app's client-credentials token: the documented streamable HTTP address `https://mcp.sandbox.paypal.com/http` returns 404, while `https://mcp.sandbox.paypal.com/sse` connects (server "PayPal MCP Agent") and lists 46 tools for the seller, buyer business and platform apps. Tool calls (`list_invoices`, `list_disputes`) still fail with `PAYPAL_API_SETUP_ERROR` "Unsupported cache mode: default". `pnpm sandbox:check` repeats this check.
- PayPal's MCP tools take no request id, so a write sent over MCP cannot be recognised as a repeat by REST. PactPal therefore falls back to REST for a write only when MCP certainly did not do the work.
- **Observation (not reported upstream by us):** PayPal's maintainer traced the error to a component of the hosted server (axios 1.20.0) sending a fetch cache setting that Cloudflare Workers reject, and deployed a fix on 9 October ([paypal/AI-Toolkit#34](https://github.com/paypal/AI-Toolkit/issues/34), closed 13 October). On 28 October it fails again: `list_invoices` and `list_disputes` at 21:48 UTC for all three apps, and again at 21:51 UTC after the seller app's token was revoked (`/v1/oauth2/token/terminate`) and a new 9-hour token issued. The same question was raised in the hackathon Discord (#dev-questions). Our connection matches PayPal's official `.mcp.json` (`/sse` with a Bearer token). The local server `@paypal/mcp` 1.8.1 (agent toolkit 1.11.0) answered `list_disputes` with the same token. Until the hosted server recovers, every PactPal call is served over REST; `pnpm sandbox:check` shows when MCP works again.
- The official toolkit's dispute tools cover list, get and accept claim. There are no MCP tools for evidence, offers, appeals or messages; PactPal uses REST for those.
- Using the REST API directly is acceptable for the hackathon; PayPal invites feedback on missing MCP tools.

## Log in with PayPal

- Set up per app in the developer dashboard (Features → Log in with PayPal): Return URL `https://pactpal-server.onrender.com/auth/paypal/callback`, information requested (name, email, PayPal account ID), and privacy and user agreement addresses (`https://example.com` is accepted in the sandbox). Done for the seller app on 30 October 2026.
- The sign-in page is `https://www.sandbox.paypal.com/connect`. The one-time code is swapped at `POST /v1/oauth2/token` (`grant_type=authorization_code`) with the app's id and secret; a made-up code is refused with `invalid_authz_code`.
- **The person's token was refused (401) at `GET /v1/identity/openidconnect/userinfo`** (the Identity API reference's address) on both live tries on 30 October 2026 (debug ids `f637800d0c050` and `f43562496b245`), even though the code exchange had succeeded. The Log in with PayPal integration guide uses `GET /v1/identity/oauth2/userinfo?schema=paypalv1.1`, so PactPal asks there first and uses the reference address only as a fallback. With the app's own token both addresses answer, so this only shows up in a real sign-in.
- With the app's own token the answer has `user_id`, `sub`, `name`, `email`, `email_verified` (true/false), `payer_id`, and `verified` and `verified_account` as the text `"true"`. The guide documents an older shape with a list of `emails`; PactPal reads both.

## Webhooks

- PactPal's server on Render, `https://pactpal-server.onrender.com/webhooks/paypal`, is registered for the seller app (webhook id `4RE47127PE423000W`, not a secret) for invoice, payment and dispute events. `pnpm sandbox:webhook --list` shows it.
- The first live notification arrived 14 seconds after PayPal created the event, and passed verification.
- The invoice paid notification arrived 12 seconds after PayPal created it, and passed verification.
- **No `CUSTOMER.DISPUTE.*` notification was created for the seller app** for either test dispute (opened through the API or on the website, escalated, decided, appealed), while invoice notifications arrived. PactPal must poll the seller's disputes, not rely on dispute notifications alone.
- When searching Render's Logs, choose "Last 24 hours" or Live tail: a fixed time range hides newer entries.
- PayPal's sandbox event record (`GET /v1/notifications/webhooks-events` and the single-event lookup) has no delivery results, so confirm delivery in the server's logs on Render (search for the event id).

## Reliability

- Refunds on invoice captures intermittently returned `500 INTERNAL_SERVICE_ERROR`. Retry with a stable `PayPal-Request-Id` so retries never duplicate.
- **Webhooks are the source of truth.** Cross-check synchronous responses against webhook events, and mock responses to test asynchronous cases the sandbox does not reproduce.
- OAuth tokens last about nine hours; refresh before they expire.

## Documentation

- `docs.paypal.ai` is deprecated; use `developer.paypal.com` (for disputes: `/disputes/set-up` and `/disputes/test-go-live`).
- Official resources: the AI tools getting-started page on developer.paypal.com, the PayPal Postman collection at postman.com/paypal, and github.com/paypal-examples/docs-examples.
