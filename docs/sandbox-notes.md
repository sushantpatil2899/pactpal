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
- **A dispute opened by hand can start straight at the chargeback stage** (`PP-R-HBM-10196876`, 6 Nov 2026: "significantly not as described" for a $120 invoice payment): stage `CHARGEBACK`, only `accept_claim` and `provide_evidence`, about 10 days to respond, PayPal asking for `PROOF_OF_REFUND` or `OTHER`. Its `messages` were absent; **the buyer's text was the evidence entry `{evidence_type: CREATE, source: SUBMITTED_BY_BUYER, notes}`**. PactPal reads both places since 5k-fix-1.
- **Live run 5k-1 (6 Nov 2026):** six files of about 121 KB in one upload (PDF and PNG, the largest 49 KB) were accepted with type `OTHER` at the chargeback stage; the dispute read `UNDER_REVIEW` / `UNDER_PAYPAL_REVIEW`, the `adjudicate` link appeared 13 minutes after the evidence, and `RESOLVED_SELLER_FAVOUR` showed about 2 minutes after settling.
- **Live run 5k-2 (6 Nov 2026, `PP-R-HVX-10196910`, opened through the buyer's API app):** after a seller message PayPal waits for the buyer and removes `make_offer` until the buyer replies (a reply on the website brought it back). The buyer's later replies show as `BUYER` messages even on an API dispute. An escalation note is kept as an evidence entry of type `OTHER` with no documents; the stage became `CHARGEBACK` about 5 minutes after escalating, and PayPal then requested `PROOF_OF_FULFILLMENT` for "not received", accepted with 4 PDFs. The `adjudicate` link appeared 28 minutes after that evidence.
- The dispute list's `update_time` has whole seconds (`…:33.000Z`); the full dispute has milliseconds (`…:33.997Z`); PactPal compares them to the second since 5k-fix-3.
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

- Set up per app in the developer dashboard (Features → Log in with PayPal): Return URL `https://pactpal-server.onrender.com/auth/paypal/callback`, information requested (full name, email, PayPal account ID), and privacy and user agreement addresses (`https://example.com` is accepted in the sandbox). Done for the seller app on 30 October 2026. PayPal's consent screen then lists "Full name, Email, Account verification status, Payer ID".
- **What works (live, 30 October 2026, 08:51 PM):** the person approves at `https://www.sandbox.paypal.com/connect`; the one-time code is swapped at **`POST /v1/identity/openidconnect/tokenservice`** (`grant_type=authorization_code`, the app's id and secret); the person's details come from **`GET /v1/identity/oauth2/userinfo?schema=paypalv1.1`** with that key. The answer had `user_id`, `name`, `payer_id`, `verified_account` (text) and a list of `emails`.
- **What did not work**, all on 30 October 2026:
  - Swapping at `POST /v1/oauth2/token` succeeds but returns an app-style key (fields `access_token, expires_in, nonce, refresh_token, scope, state, token_type`, no `id_token`, and the whole app's permission list). Every identity address declined it: `oauth2/userinfo?schema=paypalv1.1` and `?schema=openid` with 400 `invalid_request` "Unable to fetch details to serve the request" (debug ids `f207456159ec2`, `f5685119cba80`, `f200111284687`, `f498392a8ad83`), and `openidconnect/userinfo` with 401 (`f637800d0c050`, `f43562496b245`, `f498392b7012a`).
  - With the identity service's key, `oauth2/userinfo?schema=openid` (400) and `openidconnect/userinfo` (401) still declined.
  - The two swap addresses keep codes separately: with a made-up code the identity service answers `400 access_denied: Invalid authorization code`, `/v1/oauth2/token` answers `401 invalid_authz_code: Authorization code not found in cache`.
- **Signing in as the app's own PayPal account does not work fully:** with the seller account (which owns the app) the identity service returns an ID token with PayPal ids (`sub`, `payer_id`) but no email or name, and userinfo declines its key with 400 (debug ids `f6901268204a8`, `f69012698734c`, `f69012632318d`), so PactPal shows "PayPal did not share an email address". Test with any other sandbox account. Real users never sign in as PactPal's own app account.
- With the app's own client-credentials token (no sign-in), both userinfo addresses answer with the app owner's details, which is why the problem only showed in a real sign-in.

- A **new app** answers "invalid client_id or redirect_uri" on PayPal's sign-in page until its Log in with PayPal Return URL is saved (seen 6 Nov 2026 with the new seller app).

## Webhooks

- PactPal's server on Render, `https://pactpal-server.onrender.com/webhooks/paypal`, is registered for the seller app (webhook id `4RE47127PE423000W`, not a secret) for invoice, payment and dispute events. `pnpm sandbox:webhook --list` shows it.
- The first live notification arrived 14 seconds after PayPal created the event, and passed verification.
- The invoice paid notification arrived 12 seconds after PayPal created it, and passed verification.
- **No `CUSTOMER.DISPUTE.*` notification was created for the seller app** for either test dispute (opened through the API or on the website, escalated, decided, appealed), while invoice notifications arrived. PactPal must poll the seller's disputes, not rely on dispute notifications alone.
- When searching Render's Logs, choose "Last 24 hours" or Live tail: a fixed time range hides newer entries.
- **Invoice-paid notifications are acted on (4e).** For `INVOICING.INVOICE.PAID`, PactPal reads the invoice id from `resource.invoice.id` or `resource.id`, then re-reads the invoice from PayPal and records the payment only if its status is `PAID` (PayPal's docs say the notification also fires for partial and pending payments). A processing failure answers 500 so PayPal sends the notification again. Live result (2 Nov 2026): the stage 1 payment of the test deal turned to Paid by itself from PayPal's invoice-paid notification, without pressing "Check payment status", and both payment emails arrived; the stage 2 invoice email arrived with PayPal's link.
- PayPal's sandbox event record (`GET /v1/notifications/webhooks-events` and the single-event lookup) has no delivery results, so confirm delivery in the server's logs on Render (search for the event id).
- **Disputes are found by checking (5a).** A Render Cron Job starts the Workflow task `check-disputes` every 5 minutes; it lists the seller's disputes and reads each new or changed one in full. A dispute is tied to its deal by the seller transaction id in its `disputed_transactions` (compared with the payment id PactPal recorded from the paid invoice) or by the invoice number there (compared with the invoice's `detail.invoice_number`). Checked on 5 Nov 2026 with `PP-R-EMM-10195224` (read only): the paid invoice's payment id (`8K333499C0592283B`) is the dispute's seller transaction id, so the first route works; the dispute's `invoice_number` holds the invoice's **id** (`INV2-SL8Y-L9ZV-Z3TG-G3XH`), not its number (`0004`), so the second route compares it with the invoice id. In the buyer's appeal window that dispute's only allowed action was `provide_supporting_info` (`PRE_ARBITRATION`, `WAITING_FOR_BUYER_RESPONSE`).

## Reliability

- Refunds on invoice captures intermittently returned `500 INTERNAL_SERVICE_ERROR`. Retry with a stable `PayPal-Request-Id` so retries never duplicate.
- **Webhooks are the source of truth.** Cross-check synchronous responses against webhook events, and mock responses to test asynchronous cases the sandbox does not reproduce.
- OAuth tokens last about nine hours; refresh before they expire.

## Documentation

- `docs.paypal.ai` is deprecated; use `developer.paypal.com` (for disputes: `/disputes/set-up` and `/disputes/test-go-live`).
- Official resources: the AI tools getting-started page on developer.paypal.com, the PayPal Postman collection at postman.com/paypal, and github.com/paypal-examples/docs-examples.
- **Dispute emails (5j)** are sent by the dispute check on the workflow service, which needs `RESEND_API_KEY`, `EMAIL_FROM` and `PUBLIC_BASE_URL` (the website's values). Reminders go 72, 24 and 6 hours before the seller's respond-by date; PayPal's sandbox gives 20 days in an inquiry and about 27 hours for an appeal, so an appeal window usually starts with the 24-hour reminder.
