# Engineering standards

The bar for every change in this repository. Rules marked **[gate]** are enforced automatically by `pnpm verify` (locally and in CI); the rest are checked in review. A change is done only when `pnpm verify` passes.

## 1. Architecture and structure

- **One responsibility per package.** `packages/*` hold reusable, framework-free building blocks (ledger, council, PayPal access). `apps/*` compose them into deliverables (server, web).
- **Dependency direction:** apps → packages, never packages → apps; apps never import each other; no circular dependencies. **[gate: dependency-cruiser]**
- **Pure core, effects at the edges.** Business rules (scope checks, scoring, vote aggregation, ledger hashing) are pure functions over plain data. IO (HTTP, database, PayPal, model APIs, file storage, clock, randomness) sits behind small interfaces and is injected, so the core is testable without mocks of the world.
- **Ports and adapters for external systems.** Each external service has one interface in a package (for example `PayPalClient`) and one or more adapters (MCP, REST). Callers depend on the interface only.
- **No hidden global state.** Configuration is read and validated once at startup and passed down.
- **Public API per package** is its `src/index.ts`; other packages import only from there.

## 2. No duplication

- **[gate: jscpd, threshold 0 for blocks ≥ 50 tokens]** across apps and packages, including tests.
- Shared logic lives in a package. Shared test data lives in a fixture or a small builder in the test file.
- Types are declared once and imported; schemas are the single source of truth for both validation and types (derive types from zod schemas rather than writing both).
- Prefer configuration and data tables over repeated branches.

## 3. TypeScript

- **[gate]** `strict` mode with `noUncheckedIndexedAccess`; typescript-eslint `strictTypeChecked` and `stylisticTypeChecked`.
- No `any`, no non-null assertions (`!`) in source (allowed in tests), no unchecked casts of external data.
- **Validate at every boundary** (HTTP input, webhooks, environment, model output, PayPal responses) with zod; trust types only after validation.
- Model failure explicitly: discriminated unions for results (`{ ok: true, ... } | { ok: false, ... }`) in domain code; typed error classes at the edges. Never swallow errors.
- No floating promises; every promise is awaited or explicitly handled. **[gate]**
- Named exports only; `import type` for type-only imports. **[gate]**
- Exhaustive handling of unions (`switch` with exhaustiveness checks). **[gate]**
- Small functions with clear names; comments explain _why_, not _what_.

## 4. Server (Node + Fastify)

- Routes are grouped into Fastify plugins by feature; each route declares a JSON schema (generated from zod) for params, body and response.
- Webhook routes verify signatures against the raw body before parsing, and are idempotent (deduplicate by event id).
- Outbound calls have timeouts, retries with backoff only for idempotent requests, and idempotency keys (`PayPal-Request-Id`) for writes.
- Structured logging through the Fastify logger (pino); never log secrets, tokens or personal data. `console` is not used. **[gate]**
- Graceful shutdown: close the server and database pool on `SIGTERM`.
- Health and readiness endpoints for the platform.

## 5. Web (React)

- Function components and hooks; state lives as close to where it is used as possible.
- Server data is fetched through one typed API client, never ad hoc `fetch` calls in components.
- Accessible by default: semantic HTML, labelled controls, keyboard navigation, sufficient contrast.
- No secrets in the client bundle.

## 6. Data

- Postgres with versioned, forward-only migrations; schema changes only through migrations.
- Multi-step writes run in a transaction. The evidence ledger is append-only: no updates or deletes, corrections are new events.
- Money is stored as integer minor units with a currency code, never as floating point.
- Timestamps are UTC and taken on the server.

## 7. Security and privacy

- Secrets only in environment variables, never in code, logs or the repository; `.env` is git-ignored.
- Least privilege for every credential and scope.
- All model input built from user content is treated as untrusted (prompt injection): delimited, never executed as instructions, output validated.
- Collect the minimum personal data; document retention.
- **[gate]** `pnpm audit --prod` reports no known vulnerabilities.

## 8. Testing

- Domain logic: unit tests for behaviour, including edge cases and failure paths.
- Adapters: integration tests against recorded fixtures or the sandbox.
- **[gate]** Coverage of `packages/*` at least 90% for lines, branches, functions and statements.
- Tests are deterministic: inject clock and randomness.

## 9. Infrastructure and delivery

- Twelve-factor: configuration from the environment, stateless processes, logs to stdout.
- Infrastructure as code (`render.yaml`) for every hosted component.
- **[gate]** CI runs `pnpm verify` on every push and pull request; a red build is fixed before new work.
- Reproducible installs: committed lockfile, `pnpm install --frozen-lockfile` in CI.

## 10. Documentation and change hygiene

- Every design decision is recorded with its reason in [decisions.md](decisions.md).
- Public package APIs have doc comments.
- Small, focused commits with imperative messages describing the change.
- **[gate]** Prettier formatting.

## The verify gate

```bash
pnpm verify
```

Runs, in order: Prettier check, type-check, lint, tests with coverage, duplicate-code detection, dependency-boundary rules, production dependency audit. Each step can also be run on its own (`format:check`, `typecheck`, `lint`, `test:coverage`, `dup`, `deps:check`, `audit:prod`).
