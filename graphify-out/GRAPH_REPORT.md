# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 675 files · ~444,062 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 5, .css 5, .example 1)

## Summary
- 5264 nodes · 16902 edges · 179 communities (172 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 499 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12e75540`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- fastify
- Database
- net/src/index.ts
- question-routes.ts
- DraftPanel.tsx
- .query
- api.ts
- db/src/testing.ts
- DraftReview.tsx
- testId
- claims/src/index.ts
- ledger/src/index.ts
- deals/routes.ts
- question-routes.ts
- ai/src/index.ts
- utcDateTime
- PayPalResult
- ScopePanel.tsx
- App.tsx
- Dashboard.tsx
- change-order-routes.ts
- review.ts
- mcp.ts
- vitest
- dependencies
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- notices.ts
- readLedger
- web/src/format.ts
- scope-draft/src/testing.ts
- injection-report.ts
- instruction-lines.test.ts
- Insights.tsx
- createSignedTestDeal
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- paypal/src/index.ts
- validate.ts
- eval-judge.ts
- Secret
- seller-connections.ts
- acceptance-routes.ts
- dispute-actions.ts
- buildApp
- dispute-sync.ts
- council-record.ts
- disputes/test-support.ts
- web/package.json
- when
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- scope-draft/src/index.ts
- completeness.ts
- layouts.tsx
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-routes.ts
- paypal-webhook.ts
- postgres.ts
- parseJsonReply
- claims/package.json
- sandbox-respond-report.ts
- injection-runner.ts
- qa/src/index.ts
- scope.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- mcp-routes.ts
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- resend-inbound.ts
- pdf/package.json
- products/package.json
- partners.ts
- ai/package.json
- acceptance.test.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- src/summary.test.ts
- delivery-check-routes.test.ts
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- isObject
- db/src/disputes.ts
- draft-job.ts
- council/package.json
- Layout
- email/src/index.ts
- words/src/index.ts
- appeal-items.ts
- image.ts
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- server/package.json
- Engineering standards
- package.json
- Decisions
- server/package.json
- check-words.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- app-link-routes.ts
- dependencies
- MessagesPanel.tsx
- useRoute.ts
- Demo plan
- PactPal
- words/package.json
- server/tsconfig.json
- ai/tsconfig.json
- claims/tsconfig.json
- db/tsconfig.json
- delivery-check/tsconfig.json
- email/tsconfig.json
- ledger/tsconfig.json
- net/tsconfig.json
- pdf/tsconfig.json
- qa/tsconfig.json
- scope-draft/tsconfig.json
- score/tsconfig.json
- watcher/tsconfig.json
- tsconfig.json
- PactPal design system
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- sessions.ts
- runner.test.ts
- src/intake.ts
- match.ts
- .prettierrc.json
- products/tsconfig.json
- auth/sign-in.ts
- web-pages.test.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- record.ts
- dispute-notices.ts
- appeal-coverage.ts
- auth/links.ts
- Data model
- sign-in-words.ts
- Scope
- vite-env.d.ts
- PacketNotAllowedError
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 203 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `isObject()` - 70 edges
8. `TEST_NOW` - 66 edges
9. `Secret` - 65 edges
10. `appendLedgerEvent()` - 63 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (179 total, 7 thin omitted)

### Community 0 - "fastify"
Cohesion: 0.05
Nodes (61): BusSignal, afterQuery, ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+53 more)

### Community 1 - "Database"
Cohesion: 0.06
Nodes (57): ReceiptMailDeps, McpRouteOptions, AgentContext, AppOptions, SignInOptions, ChatBus, listeners(), postgresBus() (+49 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.06
Nodes (62): ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+54 more)

### Community 3 - "question-routes.ts"
Cohesion: 0.08
Nodes (38): answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes(), forward(), namedQuestion() (+30 more)

### Community 4 - "DraftPanel.tsx"
Cohesion: 0.09
Nodes (37): addFile(), addPastedChat(), checksUrl(), DealFile, draftsUrl(), fileUrl(), getDeliveryChecks(), getDraftById() (+29 more)

### Community 5 - ".query"
Cohesion: 0.04
Nodes (124): fingerprinted(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+116 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (82): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), AnswerOptionView (+74 more)

### Community 7 - "db/src/testing.ts"
Cohesion: 0.06
Nodes (40): db, db, disputedDeal(), FILES, GOOD, SummariesView, db, waiting() (+32 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (49): ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView, ChatLines() (+41 more)

### Community 9 - "testId"
Cohesion: 0.08
Nodes (41): agentDeal(), db, mcpClient(), ToolResult, db, dealWithBuyer(), db, goodsDeal() (+33 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (62): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages(), appealSource() (+54 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (72): isPicture(), ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+64 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.04
Nodes (99): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), listQuery, notificationRoutes() (+91 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.04
Nodes (90): CHAT_TRANSCRIPT_PREFIX, LiveRouteOptions, AcceptanceRouteOptions, DealLookup, FoundDeal, sendRefusal(), ChangeOrderRouteOptions, checkBody (+82 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.09
Nodes (35): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, providerCode(), reply, responseFormat() (+27 more)

### Community 15 - "utcDateTime"
Cohesion: 0.18
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 16 - "PayPalResult"
Cohesion: 0.08
Nodes (26): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, Disputes, Live test 5k-1: the Maya story end to end (4q), 6 November 2026, Live test 5k-2: Jun (digital product, not received), 6 November 2026, answered(), evidenceForm() (+18 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (77): acceptChange(), changeOrdersUrl(), ChangeProposal, changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope() (+69 more)

### Community 18 - "App.tsx"
Cohesion: 0.12
Nodes (41): LinkProblem, redeemLink(), SIGN_IN_PATH, signOut(), App(), Dashboard(), dealPage(), DealRoute (+33 more)

### Community 19 - "Dashboard.tsx"
Cohesion: 0.11
Nodes (35): Money, CommandPalette(), PLACES, DealList(), Cell, COLUMNS, DealsTable(), theme (+27 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.06
Nodes (69): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, documentFor(), money, document, signed() (+61 more)

### Community 21 - "review.ts"
Cohesion: 0.19
Nodes (20): messageReviewCouncilTask(), MessageReviewTask, RANK_CRITERIA, buildReviewMessages(), MESSAGE_PROMPT_VERSION, recordLines(), reviewSource(), WorkRecord (+12 more)

### Community 22 - "mcp.ts"
Cohesion: 0.09
Nodes (28): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+20 more)

### Community 23 - "vitest"
Cohesion: 0.09
Nodes (24): db, db, ORDERING, OrderView, View, capturingEmail(), db, sentStage() (+16 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (48): ClaimJobDeps, ChatOutcome, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize() (+40 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.03
Nodes (85): publishingBus(), result, logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit() (+77 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.22
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+4 more)

### Community 28 - "notices.ts"
Cohesion: 0.21
Nodes (15): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+7 more)

### Community 29 - "readLedger"
Cohesion: 0.06
Nodes (38): disputeTypes(), payments(), ArtifactLimits, NewArtifact, chat, counts(), db, file() (+30 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.07
Nodes (56): analysesUrl(), AppealCheckView, AppealView, buildPacket(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+48 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (28): two, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+20 more)

### Community 32 - "injection-report.ts"
Cohesion: 0.23
Nodes (10): DroppedDraft, droppedSection(), ruleOf(), councilFailures(), counts(), formatInjectionReport(), InjectionRun, models() (+2 more)

### Community 33 - "instruction-lines.test.ts"
Cohesion: 0.12
Nodes (24): JsonSchema, claimLines(), linesOf(), RANK_CRITERIA, ScopeDraftTask, findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines() (+16 more)

### Community 34 - "Insights.tsx"
Cohesion: 0.10
Nodes (28): count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep(), look() (+20 more)

### Community 35 - "createSignedTestDeal"
Cohesion: 0.14
Nodes (23): db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, fakeWriter(), fakeAppWebhooks(), fakePayPal() (+15 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (42): buildReceipt(), ReceiptIntegrityError, aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut (+34 more)

### Community 37 - "receipt.ts"
Cohesion: 0.09
Nodes (33): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), AcceptanceDocument(), AcceptanceDocument (+25 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.12
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.04
Nodes (78): BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, dollar, setup() (+70 more)

### Community 41 - "validate.ts"
Cohesion: 0.12
Nodes (31): UNCLEAR_CATEGORY, paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation (+23 more)

### Community 42 - "eval-judge.ts"
Cohesion: 0.12
Nodes (28): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+20 more)

### Community 43 - "Secret"
Cohesion: 0.10
Nodes (15): Engineering, OpenAiCompatibleClient, bareAddress(), inbox(), ResendEmailSender, message, sender(), json() (+7 more)

### Community 44 - "seller-connections.ts"
Cohesion: 0.14
Nodes (20): linkedSeller(), `acceptances`: signed agreements, `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow (+12 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (27): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+19 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.12
Nodes (26): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+18 more)

### Community 47 - "buildApp"
Cohesion: 0.10
Nodes (18): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+10 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.28
Nodes (12): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+4 more)

### Community 49 - "council-record.ts"
Cohesion: 0.10
Nodes (25): councilDeps(), councilRecordOf(), isRankingRequest(), CouncilRecord, councilRecordSchema, isUnranked(), usage, categoryLabels (+17 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.06
Nodes (56): db, ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer (+48 more)

### Community 51 - "web/package.json"
Cohesion: 0.07
Nodes (28): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline (+20 more)

### Community 52 - "when"
Cohesion: 0.24
Nodes (18): AnswerBox(), Revisions, revisionWords(), approveDelivery(), deliveriesUrl(), DeliveriesView, deliveryFileUrl(), deliveryStep() (+10 more)

### Community 53 - "tools.ts"
Cohesion: 0.11
Nodes (22): AGENT_TOOLS, AgentTool, ask(), choicesSchema, dealId, dealPath(), disputeId, disputePath() (+14 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (26): at(), source(), key(), title(), draft(), unchanged(), `agent_requests`: what an agent asks the seller to let it do (8c), `artifacts` and `file_contents`: the deal's files (+18 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.08
Nodes (43): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+35 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (24): looks(), CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, Transparency, checkableLines() (+16 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (41): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), Deal space (Phase 7) (+33 more)

### Community 59 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (34): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, citations, commonFields (+26 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "layouts.tsx"
Cohesion: 0.15
Nodes (23): Me, Unread(), Icon(), IconName, PATHS, Logo(), applyTheme(), nextTheme() (+15 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+23 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.28
Nodes (20): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+12 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.10
Nodes (28): db, draftedAs(), idOf(), readDraft(), store, View, db, withReadyDraft() (+20 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.23
Nodes (20): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+12 more)

### Community 69 - "paypal-webhook.ts"
Cohesion: 0.18
Nodes (14): envelope, ParsedJson, parseJson(), PayPalWebhookOptions, paypalWebhookRoutes(), receive(), record(), SELLER_WEBHOOK_PATH (+6 more)

### Community 70 - "postgres.ts"
Cohesion: 0.11
Nodes (14): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgClient (+6 more)

### Community 71 - "parseJsonReply"
Cohesion: 0.40
Nodes (7): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (101): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+93 more)

### Community 74 - "injection-runner.ts"
Cohesion: 0.13
Nodes (23): draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf(), chatCaseRuns(), InjectionOptions (+15 more)

### Community 75 - "qa/src/index.ts"
Cohesion: 0.08
Nodes (44): attempt(), checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT (+36 more)

### Community 76 - "scope.ts"
Cohesion: 0.11
Nodes (24): BASE, LISTING, AgreementListing, buyerProvidesSchema, checkedScopeContentSchema, checkedVersion(), confirmedFromSchema, insertScopeVersion() (+16 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (22): Accounts and connection, AI, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026), Fixes for the injection findings (sub-phase 3fb, 1 November 2026) (+14 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "testSpec"
Cohesion: 0.08
Nodes (33): CheckView, db, FAILED, model(), shown, store, db, isRanking() (+25 more)

### Community 82 - "mcp-routes.ts"
Cohesion: 0.29
Nodes (8): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), sellersDealOf(), findIntakeKey()

### Community 83 - "db/src/index.ts"
Cohesion: 0.03
Nodes (107): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, MAX_WRONG_CODES, NewAgentRequest, newRequestSchema (+99 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "resend-inbound.ts"
Cohesion: 0.18
Nodes (14): intakeFilename(), intakeEmail(), app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes() (+6 more)

### Community 87 - "pdf/package.json"
Cohesion: 0.11
Nodes (17): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+9 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "partners.ts"
Cohesion: 0.12
Nodes (15): links, lookupAnswer, MerchantLookup, MerchantStatus, ownerAnswer, PartnerFeature, partnerPath(), PayPalPartners (+7 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "acceptance.test.ts"
Cohesion: 0.28
Nodes (8): at(), db, document(), refusal(), savedDeal(), statusOf(), work, ScopeContentInput

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "src/summary.test.ts"
Cohesion: 0.10
Nodes (17): context, GOOD, input, OPTIONS, RECORD, context, GOOD, input (+9 more)

### Community 96 - "delivery-check-routes.test.ts"
Cohesion: 0.20
Nodes (11): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+3 more)

### Community 97 - "render.ts"
Cohesion: 0.12
Nodes (19): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, columnWidths(), Fonts (+11 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.06
Nodes (44): Listen, memoryBus(), addCard(), db, hubOnTestDeal(), LiveHub, chatUrl(), ChatView (+36 more)

### Community 101 - "isObject"
Cohesion: 0.04
Nodes (97): AgentRequestsPanel(), addBuyer(), AgentRequestView, answerAgentRequest(), checkLedger(), checkPayments(), CompletenessItem, CompletenessView (+89 more)

### Community 102 - "db/src/disputes.ts"
Cohesion: 0.11
Nodes (19): actionList, checkRow, DISPUTE_CHECK_SOURCES, DISPUTE_MATCHES, disputeChanges, DisputeCheck, DisputeCheckResult, DisputeEvent (+11 more)

### Community 103 - "draft-job.ts"
Cohesion: 0.20
Nodes (15): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+7 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Layout"
Cohesion: 0.30
Nodes (4): breakWord(), drawable(), drawBlock(), Layout

### Community 106 - "email/src/index.ts"
Cohesion: 0.10
Nodes (25): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, check, InboxNetworkError, ReadResult (+17 more)

### Community 107 - "words/src/index.ts"
Cohesion: 0.11
Nodes (40): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+32 more)

### Community 108 - "appeal-items.ts"
Cohesion: 0.18
Nodes (14): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+6 more)

### Community 109 - "image.ts"
Cohesion: 0.35
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 110 - "test-app.ts"
Cohesion: 0.05
Nodes (72): SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened (+64 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 115 - "server/package.json"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.33
Nodes (6): Agents (Phase 8), AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 119 - "server/package.json"
Cohesion: 0.06
Nodes (31): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+23 more)

### Community 120 - "check-words.ts"
Cohesion: 0.25
Nodes (11): DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS (+3 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 124 - "ledger/package.json"
Cohesion: 0.18
Nodes (10): devDependencies, @types/node, @types/node, main, name, private, scripts, typecheck (+2 more)

### Community 125 - "live/package.json"
Cohesion: 0.18
Nodes (10): dependencies, zod, zod, main, name, private, scripts, typecheck (+2 more)

### Community 126 - "net/package.json"
Cohesion: 0.18
Nodes (10): devDependencies, @types/node, @types/node, main, name, private, scripts, typecheck (+2 more)

### Community 127 - "timeline/package.json"
Cohesion: 0.18
Nodes (10): dependencies, zod, zod, main, name, private, scripts, typecheck (+2 more)

### Community 128 - "app-link-routes.ts"
Cohesion: 0.18
Nodes (17): currentSession(), linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts() (+9 more)

### Community 129 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, ag-grid-community, ag-grid-react, ag-studio, ag-studio-react, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/delivery-check (+6 more)

### Community 130 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 131 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

### Community 133 - "Demo plan"
Cohesion: 0.22
Nodes (8): Contrast clip: a thin packet, Demo plan, Honesty rules for the demo, Seed script, Story 1: Maya, digital artist (main story), Story 2: Daniel, freelance web developer (change order and appeal), Story 3: Jun, digital templates (download log), Video script (under 3 minutes)

### Community 134 - "PactPal"
Cohesion: 0.18
Nodes (11): Code map, Connect your agent (MCP), Deploying to Render, Disclaimer, Docs, License, PactPal, Product listings (Channel3) (+3 more)

### Community 135 - "words/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 136 - "server/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 137 - "ai/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 138 - "claims/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 139 - "db/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 140 - "delivery-check/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 141 - "email/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 142 - "ledger/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 143 - "net/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 144 - "pdf/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 145 - "qa/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 146 - "scope-draft/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 147 - "score/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 148 - "watcher/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 149 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ./tsconfig.base.json

### Community 150 - "PactPal design system"
Cohesion: 0.15
Nodes (13): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+5 more)

### Community 151 - "council/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 152 - "live/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 153 - "paypal/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 154 - "timeline/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 155 - "words/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 156 - "pnpm-workspace.yaml"
Cohesion: 0.40
Nodes (4): onlyBuiltDependencies, overrides, @fastify/static>glob, packages

### Community 157 - "sessions.ts"
Cohesion: 0.31
Nodes (11): dealBuyer, LINK_LIFETIME_MS, linkRow, redeemDealLink(), RedeemResult, createSession(), deleteSession(), findSession() (+3 more)

### Community 158 - "runner.test.ts"
Cohesion: 0.21
Nodes (9): `claim_analyses`: council comparisons of a dispute claim with the record, council(), deps(), DRAFTS, isRankingCall(), ranking(), rankingRequests(), shown() (+1 more)

### Community 159 - "src/intake.ts"
Cohesion: 0.27
Nodes (9): CATEGORY_IDS, IntakeKind, IntakeRefusal, keyRow, newAddressCode(), newKeySchema, newSecret(), readableCode() (+1 more)

### Community 160 - "match.ts"
Cohesion: 0.33
Nodes (6): DisputedPayments, matchDispute(), NoMatch, paymentKeys(), DisputeLink, PaidStage

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "auth/sign-in.ts"
Cohesion: 0.13
Nodes (18): backHome(), CALLBACK_PATH, callbackQuery, cookieRules, LOGOUT_PATH, ME_PATH, RETURN_COOKIE, sameSecret() (+10 more)

### Community 165 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 168 - "record.ts"
Cohesion: 0.39
Nodes (8): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), WHO

### Community 169 - "dispute-notices.ts"
Cohesion: 0.22
Nodes (8): DisputeEntry, DisputeNotice, entryRow, NewDisputeNotice, newNoticeSchema, NOTICE_KINDS, NoticeKind, noticeRow

### Community 170 - "appeal-coverage.ts"
Cohesion: 0.48
Nodes (4): appealGaps(), missingFromPacket(), docItemId(), appealCheckSchema

### Community 171 - "auth/links.ts"
Cohesion: 0.40
Nodes (5): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, setSessionCookie()

### Community 172 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 173 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **119 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+114 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1728 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `MessagesPanel.tsx`, `useRoute.ts`, `DraftPanel.tsx`, `.query`, `api.ts`, `db/src/testing.ts`, `DraftReview.tsx`, `testId`, `claims/src/index.ts`, `ledger/src/index.ts`, `deals/routes.ts`, `net/src/index.ts`, `ai/src/index.ts`, `utcDateTime`, `PayPalResult`, `ScopePanel.tsx`, `Dashboard.tsx`, `change-order-routes.ts`, `review.ts`, `mcp.ts`, `council/src/index.ts`, `server/src/index.ts`, `db/src/migrate.ts`, `readLedger`, `runner.test.ts`, `scope-draft/src/testing.ts`, `match.ts`, `injection-report.ts`, `Insights.tsx`, `createSignedTestDeal`, `auth/sign-in.ts`, `packet-service.ts`, `web-pages.test.ts`, `eval-report.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `appeal-coverage.ts`, `eval-judge.ts`, `seller-connections.ts`, `sign-in-words.ts`, `dispute-actions.ts`, `buildApp`, `Secret`, `council-record.ts`, `disputes/test-support.ts`, `timeline/src/index.ts`, `scope-draft/src/index.ts`, `completeness.ts`, `layouts.tsx`, `receipt.ts`, `DisputeActions.tsx`, `products/src/index.ts`, `scope-drafts.ts`, `instruction-lines.test.ts`, `postgres.ts`, `parseJsonReply`, `sandbox-respond-report.ts`, `injection-runner.ts`, `qa/src/index.ts`, `scope.ts`, `validate.ts`, `testSpec`, `resend-inbound.ts`, `partners.ts`, `acceptance.test.ts`, `sandbox-webhook-report.ts`, `src/summary.test.ts`, `delivery-check-routes.test.ts`, `render.ts`, `live-hub.ts`, `isObject`, `words/src/index.ts`, `appeal-items.ts`, `test-app.ts`, `package.json`, `check-words.ts`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _119 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `fastify` be split into smaller, more focused modules?**
  _Cohesion score 0.051251956181533644 - nodes in this community are weakly interconnected._
- **Why does `react` connect `web/package.json` to `Insights.tsx`, `MessagesPanel.tsx`, `DraftPanel.tsx`, `isObject`, `api.ts`, `receipt.ts`, `DraftReview.tsx`, `useRoute.ts`, `live-hub.ts`, `words/src/index.ts`, `ScopePanel.tsx`, `App.tsx`, `Dashboard.tsx`, `when`, `DisputeActions.tsx`, `layouts.tsx`, `web/src/format.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.06293706293706294 - nodes in this community are weakly interconnected._
- **Why does `fastify` connect `fastify` to `app-link-routes.ts`, `Database`, `question-routes.ts`, `ledger/src/index.ts`, `deals/routes.ts`, `question-routes.ts`, `change-order-routes.ts`, `auth/sign-in.ts`, `auth/links.ts`, `acceptance-routes.ts`, `buildApp`, `action-routes.ts`, `scope-drafts.ts`, `claim-routes.ts`, `paypal-webhook.ts`, `mcp-routes.ts`, `resend-inbound.ts`, `test-app.ts`, `server/package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05623762376237624 - nodes in this community are weakly interconnected._