# Graph Report - paypal-hackathon  (2026-11-09)

## Corpus Check
- 607 files · ~406,247 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 4845 nodes · 15629 edges · 163 communities (157 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 488 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `daa94bbe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- db/src/index.ts
- change-order-routes.ts
- Secret
- test-app.ts
- paypal/src/index.ts
- .query
- api.ts
- disputes/test-support.ts
- Database
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- DealPage.tsx
- question-routes.ts
- ai/src/index.ts
- routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- server/package.json
- milestone-routes.ts
- delivery-routes.ts
- qa/src/index.ts
- testSpec
- db/src/testing.ts
- deals.ts
- council/src/index.ts
- timeline-routes.ts
- vitest
- DraftPanel.tsx
- email/src/index.ts
- when
- scope-draft/src/testing.ts
- draft-routes.ts
- action-routes.ts
- action-routes.test.ts
- styles.ts
- packet-service.ts
- words/src/index.ts
- injection-runner.ts
- eval-report.ts
- seed-sandbox.ts
- scope-draft/src/index.ts
- app.ts
- config.ts
- testId
- DraftReview.tsx
- record.ts
- utcDateTime
- resend-inbound.ts
- AccessTokenProvider
- sandbox-webhook-report.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- PayPalRestClient
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- auth/sign-in.ts
- DisputeActions.tsx
- services
- claim-routes.ts
- scripts
- db/package.json
- scope-draft/src/council-task.ts
- validate.ts
- notices.ts
- postgres.test.ts
- live-hub.ts
- claims/package.json
- appeal-items.ts
- log-labels.ts
- render.ts
- dispute-sync.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- src/summary.test.ts
- claim-job.ts
- PacketPanel.tsx
- scope-draft/package.json
- paypal/package.json
- build.js
- runtime.ts
- LiveHub
- chat-api.ts
- ai/package.json
- pdf/package.json
- eval-judge.ts
- scripts
- draft-view.ts
- chat-state.ts
- live/src/index.ts
- packet-routes.ts
- email/package.json
- compilerOptions
- confirmation.ts
- MessagesPanel.tsx
- SellerAppPanel.tsx
- ChatTab.tsx
- council/package.json
- Layout
- readLedger
- milestones.test.ts
- app-link-routes.ts
- progress.ts
- db/src/migrate.ts
- score/package.json
- PactPal product spec
- devDependencies
- instruction-lines.test.ts
- image.ts
- Engineering standards
- package.json
- postgres-listen.test.ts
- delivery-check/src/testing.ts
- TimelineStep
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- questionRoutes
- live-routes.ts
- check-words.ts
- TimelineEditor.tsx
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
- Data model
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Decisions
- Scope
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json

## God Nodes (most connected - your core abstractions)
1. `vitest` - 185 edges
2. `Database` - 114 edges
3. `testId()` - 103 edges
4. `readLedger()` - 86 edges
5. `sha256Hex()` - 77 edges
6. `useMigratedTestDatabase()` - 74 edges
7. `appendLedgerEvent()` - 71 edges
8. `isObject()` - 61 edges
9. `TEST_NOW` - 61 edges
10. `Secret` - 61 edges

## Surprising Connections (you probably didn't know these)
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts
- `Deal space (Phase 7)` --references--> `publishingBus()`  [INFERRED]
  docs/decisions.md → apps/server/src/chat/bus.ts
- `Engineering` --references--> `sendDownload()`  [INFERRED]
  docs/decisions.md → apps/server/src/deals/download.ts

## Import Cycles
- None detected.

## Communities (163 total, 6 thin omitted)

### Community 0 - "db/src/index.ts"
Cohesion: 0.02
Nodes (138): result, body, ChatIntegrityError, ChatMessage, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+130 more)

### Community 1 - "change-order-routes.ts"
Cohesion: 0.04
Nodes (98): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody, changeOrderRoutes() (+90 more)

### Community 2 - "Secret"
Cohesion: 0.04
Nodes (66): sellerKeyBox(), ClientOptions, ResendReceivedEmails, inbox(), ResendOptions, json(), network(), defaultHttpDeps (+58 more)

### Community 3 - "test-app.ts"
Cohesion: 0.04
Nodes (89): chatDeal(), db, MessageBody, councilRecordOf(), Card, db, savedDeal(), send() (+81 more)

### Community 4 - "paypal/src/index.ts"
Cohesion: 0.04
Nodes (69): BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, dollar, setup() (+61 more)

### Community 5 - ".query"
Cohesion: 0.04
Nodes (87): DeclineTerms, originOf(), RequestAcceptance, WithdrawAcceptance, ChatNotAllowedError, insertMessage(), markRead(), nextSeq() (+79 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (87): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), AnswerOptionView (+79 more)

### Community 7 - "disputes/test-support.ts"
Cohesion: 0.06
Nodes (67): signThroughRoutes(), disputedDeal(), BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError (+59 more)

### Community 8 - "Database"
Cohesion: 0.05
Nodes (79): ACCEPTANCE_NOTICE, AcceptanceDocument, acceptanceDocumentSchema, currentDocument(), acceptedPayload, buildReceipt(), dateTime(), emailReceipt() (+71 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (72): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), logProgress(), message(), payPalIdOption() (+64 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (64): parseJsonReply(), AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem (+56 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (63): DISPUTE_EVENT_PREFIX, ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+55 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.06
Nodes (60): addBuyer(), checkLedger(), CompletenessItem, CompletenessView, createDeal(), DealSummary, getCompleteness(), getDeal() (+52 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.06
Nodes (60): DealLookup, dealParams, featureAnswers(), FoundDeal, readBody(), Refusal, sendRefusal(), CompletenessRouteOptions (+52 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.06
Nodes (49): modelMemory(), MODELS_PER_IMAGE, Engineering, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError (+41 more)

### Community 15 - "routes.ts"
Cohesion: 0.07
Nodes (61): afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody (+53 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.07
Nodes (41): InvoiceArgs, send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer (+33 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.08
Nodes (58): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+50 more)

### Community 18 - "server/package.json"
Cohesion: 0.04
Nodes (64): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @fastify/static@^10.1.8, @fastify/websocket@^11.3.7, @pactpal/ai@workspace:*, @pactpal/claims@workspace:* (+56 more)

### Community 19 - "milestone-routes.ts"
Cohesion: 0.07
Nodes (49): AppOptions, MilestoneRouteOptions, milestoneRoutes(), answer(), sellerApp(), paypalProblem(), sendBody, SendOutcome (+41 more)

### Community 20 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (54): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, DeliveryRouteOptions, deliveryRoutes(), answer() (+46 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.09
Nodes (44): DraftJob, MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AnswerRefusal (+36 more)

### Community 22 - "testSpec"
Cohesion: 0.07
Nodes (40): councilDeps(), isRankingRequest(), model(), db, isRanking(), member(), ReviewView, View (+32 more)

### Community 23 - "db/src/testing.ts"
Cohesion: 0.07
Nodes (43): db, refusal(), postgresContentStore(), db, PNG, refusal(), signedWithFile(), db (+35 more)

### Community 24 - "deals.ts"
Cohesion: 0.06
Nodes (49): AddBuyer, addBuyer(), addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CATEGORIES, DEAL_CURRENCIES (+41 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (41): JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+33 more)

### Community 26 - "timeline-routes.ts"
Cohesion: 0.09
Nodes (35): ChatBus, Card, DealCards, HubOptions, Notifier, NotifierOptions, PartyNotice, ReminderDeps (+27 more)

### Community 27 - "vitest"
Cohesion: 0.07
Nodes (32): db, SESSION_COOKIE, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page() (+24 more)

### Community 28 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (40): addFile(), addPastedChat(), DealFile, DraftContent, draftFrom(), draftsUrl(), DraftView, fileUrl() (+32 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.08
Nodes (32): ChangeOrderRouteOptions, ResendInboundOptions, RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, EmailSender, SendResult (+24 more)

### Community 30 - "when"
Cohesion: 0.10
Nodes (39): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), DisputesView, getClaimAnalyses() (+31 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (31): two, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+23 more)

### Community 32 - "draft-routes.ts"
Cohesion: 0.07
Nodes (37): decoder, draftParams, fromChatBody, REFUSALS, startBody, Artifact, ArtifactIntegrityError, DealNotFoundError (+29 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.09
Nodes (38): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+30 more)

### Community 34 - "action-routes.test.ts"
Cohesion: 0.06
Nodes (31): ActionsView, confirmed(), db, FILES, sha(), answer, AppealView, db (+23 more)

### Community 35 - "styles.ts"
Cohesion: 0.10
Nodes (36): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftResponse(), draftStatement(), getAppeal(), getResponses() (+28 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.11
Nodes (35): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+27 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.11
Nodes (29): AcceptanceDocument(), AcceptanceDocument, checkPayments(), errorMessage(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView (+21 more)

### Community 38 - "injection-runner.ts"
Cohesion: 0.11
Nodes (30): ClaimJobDeps, runPrepared(), draftCategories, toCouncilRecord(), toJson(), usage, JobLog, PROMPT_VERSIONS (+22 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.13
Nodes (32): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+24 more)

### Community 40 - "seed-sandbox.ts"
Cohesion: 0.09
Nodes (30): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+22 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.09
Nodes (30): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, linesOf(), linesOf() (+22 more)

### Community 42 - "app.ts"
Cohesion: 0.09
Nodes (28): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), ConfigReport (+20 more)

### Community 43 - "config.ts"
Cohesion: 0.08
Nodes (31): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+23 more)

### Community 44 - "testId"
Cohesion: 0.11
Nodes (28): dealWithBuyer(), db, newDeal, sellerDeal(), setup(), signedIn(), db, later (+20 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.10
Nodes (30): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, ChatLines(), ChatPane(), HIGHLIGHT (+22 more)

### Community 46 - "record.ts"
Cohesion: 0.09
Nodes (29): looks(), AGREEMENT, CLAIM, context, ENTRIES, MAYA, PAYPAL, RECORD (+21 more)

### Community 47 - "utcDateTime"
Cohesion: 0.17
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+15 more)

### Community 48 - "resend-inbound.ts"
Cohesion: 0.10
Nodes (28): listQuery, NotificationRouteOptions, notificationRoutes(), readRequest, requireViewer(), createIntakeDeal(), intakeFilename(), bearerOf() (+20 more)

### Community 49 - "AccessTokenProvider"
Cohesion: 0.11
Nodes (22): APP_KEYS, Config, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+14 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (23): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+15 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.13
Nodes (30): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+22 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.12
Nodes (27): formatErrors(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+19 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.07
Nodes (33): paid(), at(), source(), key(), seller(), outcome(), draft(), `acceptances`: signed agreements (+25 more)

### Community 55 - "PayPalRestClient"
Cohesion: 0.12
Nodes (14): authAssertion(), base64Url(), McpFallback, reasonOf(), setup(), PayPalInvoices, route(), PayPalOperations (+6 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (24): CheckedFile, CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, IMAGE (+16 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.13
Nodes (25): StepProgress, addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now, addedSteps() (+17 more)

### Community 59 - "mcp.ts"
Cohesion: 0.14
Nodes (19): checkMcp(), PayPalMcpError, noAnswer(), setupError(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory (+11 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (24): Completeness, CompletenessInput, CompletenessItem, Facts, field(), ItemStatus, Measure, MEASURED (+16 more)

### Community 61 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (25): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+17 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.17
Nodes (27): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+19 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.18
Nodes (24): appealApplies(), ClaimRunner, analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob() (+16 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @pactpal/ledger@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13, @types/node@^22.10.2 (+17 more)

### Community 67 - "scope-draft/src/council-task.ts"
Cohesion: 0.13
Nodes (20): RANK_CRITERIA, ScopeDraftTask, build(), input, numbered, TEST_CATEGORIES, buildScopeDraftMessages(), listOf() (+12 more)

### Community 68 - "validate.ts"
Cohesion: 0.14
Nodes (24): Citation, amountQuoted(), categoryProblems(), citationProblem(), collectCitations(), invalid(), listCitations(), Located (+16 more)

### Community 69 - "notices.ts"
Cohesion: 0.18
Nodes (23): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+15 more)

### Community 70 - "postgres.test.ts"
Cohesion: 0.12
Nodes (13): Row, MAX_INTAKE_DEALS_PER_DAY, useIntakeKey(), databaseFromPool(), ListenOptions, PgClient, PgConnection, PgPool (+5 more)

### Community 71 - "live-hub.ts"
Cohesion: 0.14
Nodes (15): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), addCard(), db (+7 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "appeal-items.ts"
Cohesion: 0.13
Nodes (18): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+10 more)

### Community 74 - "log-labels.ts"
Cohesion: 0.17
Nodes (16): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+8 more)

### Community 75 - "render.ts"
Cohesion: 0.15
Nodes (17): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+9 more)

### Community 76 - "dispute-sync.ts"
Cohesion: 0.17
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (22): Accounts and connection, AI, Disputes, Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026), Fixes for the injection findings (sub-phase 3fb, 1 November 2026) (+14 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.11
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/ledger@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 81 - "src/summary.test.ts"
Cohesion: 0.10
Nodes (18): context, GOOD, input, ITEMS, RECORD, ClaimAnalysis, context, GOOD (+10 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.32
Nodes (18): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+10 more)

### Community 83 - "PacketPanel.tsx"
Cohesion: 0.18
Nodes (17): buildPacket(), disputesUrl(), draftSummary(), getPacketView(), getSummaries(), isSummaries(), PacketChoice, packetFileUrl() (+9 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (18): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @pactpal/ledger (+10 more)

### Community 86 - "build.js"
Cohesion: 0.12
Nodes (9): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+1 more)

### Community 87 - "runtime.ts"
Cohesion: 0.21
Nodes (12): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, loadConfigOrExit() (+4 more)

### Community 89 - "chat-api.ts"
Cohesion: 0.24
Nodes (16): StepView, chatUrl(), getChat(), isChat(), isMessage(), liveUrl(), postChat(), RunningStepView (+8 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.23
Nodes (17): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+9 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "draft-view.ts"
Cohesion: 0.18
Nodes (14): chosenDraft(), councilRecordSchema, isUnranked(), categoryLabels, describeDraft(), draftView(), DraftView, priceMinor() (+6 more)

### Community 95 - "chat-state.ts"
Cohesion: 0.21
Nodes (14): ChatView, ChatAction, chatReducer(), ChatState, Connection, initialChat, lastSeenByOther(), onFrame() (+6 more)

### Community 96 - "live/src/index.ts"
Cohesion: 0.23
Nodes (14): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+6 more)

### Community 97 - "packet-routes.ts"
Cohesion: 0.18
Nodes (14): disputeOf(), disputeParams, sellersDispute(), packetFilename(), buildBody, exhibitParams, packetParams, packetRoutes() (+6 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "confirmation.ts"
Cohesion: 0.24
Nodes (12): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+4 more)

### Community 101 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 102 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 103 - "ChatTab.tsx"
Cohesion: 0.18
Nodes (11): getPastedChats(), isPasted(), PastedChat, bubble(), ChatTab(), CONNECTION_WORDS, DealTab, Message() (+3 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 106 - "readLedger"
Cohesion: 0.16
Nodes (11): db, invoiceEntries(), signedPayPal(), StageView, disputeTypes(), payments(), counts(), db (+3 more)

### Community 107 - "milestones.test.ts"
Cohesion: 0.24
Nodes (11): sentStage(), markInvoicePaid(), markInvoiceSent(), MilestoneNotAllowedError, refuse(), stageRow(), StartInvoice, startInvoice() (+3 more)

### Community 108 - "app-link-routes.ts"
Cohesion: 0.25
Nodes (13): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+5 more)

### Community 109 - "progress.ts"
Cohesion: 0.24
Nodes (11): Deal space (Phase 7), allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate (+3 more)

### Community 110 - "db/src/migrate.ts"
Cohesion: 0.29
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+3 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "instruction-lines.test.ts"
Cohesion: 0.31
Nodes (9): claimLines(), ClaimText, linesOf(), findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction(), PATTERNS (+1 more)

### Community 115 - "image.ts"
Cohesion: 0.33
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "postgres-listen.test.ts"
Cohesion: 0.20
Nodes (5): fakeClient(), Handler, setup(), listenPostgres(), PgListenClient

### Community 119 - "delivery-check/src/testing.ts"
Cohesion: 0.20
Nodes (9): BPP, chunk(), figure(), filterRows(), jpeg(), png(), PngOptions, SIGNATURE (+1 more)

### Community 120 - "TimelineStep"
Cohesion: 0.29
Nodes (8): ScopeInput, dated(), DraftedItem, DraftedStep, planFromDraft(), same(), TimelinePlan, TimelineStep

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.18
Nodes (11): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+3 more)

### Community 123 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 124 - "ledger/package.json"
Cohesion: 0.20
Nodes (10): devDependencies, @types/node@^22.10.2, @types/node, main, name, private, scripts, typecheck (+2 more)

### Community 125 - "live/package.json"
Cohesion: 0.20
Nodes (10): dependencies, zod@^4.6.7, zod, main, name, private, scripts, typecheck (+2 more)

### Community 126 - "net/package.json"
Cohesion: 0.20
Nodes (10): devDependencies, @types/node@^22.10.2, @types/node, main, name, private, scripts, typecheck (+2 more)

### Community 127 - "timeline/package.json"
Cohesion: 0.20
Nodes (10): dependencies, zod@^4.6.7, zod, main, name, private, scripts, typecheck (+2 more)

### Community 128 - "questionRoutes"
Cohesion: 0.33
Nodes (10): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), listQuestions() (+2 more)

### Community 129 - "live-routes.ts"
Cohesion: 0.33
Nodes (7): liveQuery, LiveRouteOptions, liveRoutes(), check(), originAllowed(), rawText(), rateLimiter()

### Community 130 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, LookVerdict

### Community 131 - "TimelineEditor.tsx"
Cohesion: 0.31
Nodes (8): LABEL, OwnFields(), pointedWords(), StepTargets, TimelineEditor(), MAX_TIMELINE_STEPS, moveStep(), STEP_KIND_WORDS

### Community 133 - "Demo plan"
Cohesion: 0.22
Nodes (8): Contrast clip: a thin packet, Demo plan, Honesty rules for the demo, Seed script, Story 1: Maya, digital artist (main story), Story 2: Daniel, freelance web developer (change order and appeal), Story 3: Jun, digital templates (download log), Video script (under 3 minutes)

### Community 134 - "PactPal"
Cohesion: 0.22
Nodes (9): Code map, Deploying to Render, Disclaimer, Docs, License, PactPal, Quality, Running locally (+1 more)

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

### Community 150 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

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

### Community 157 - "Decisions"
Cohesion: 0.50
Nodes (4): AI, Decisions, Partner tools, Product

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **22 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1408 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `change-order-routes.ts`, `check-words.ts`, `test-app.ts`, `Secret`, `paypal/src/index.ts`, `api.ts`, `disputes/test-support.ts`, `Database`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `ScopePanel.tsx`, `milestone-routes.ts`, `delivery-routes.ts`, `qa/src/index.ts`, `testSpec`, `db/src/testing.ts`, `council/src/index.ts`, `DraftPanel.tsx`, `email/src/index.ts`, `when`, `scope-draft/src/testing.ts`, `draft-routes.ts`, `action-routes.ts`, `action-routes.test.ts`, `packet-service.ts`, `words/src/index.ts`, `eval-report.ts`, `seed-sandbox.ts`, `scope-draft/src/index.ts`, `app.ts`, `config.ts`, `testId`, `DraftReview.tsx`, `record.ts`, `utcDateTime`, `resend-inbound.ts`, `AccessTokenProvider`, `sandbox-webhook-report.ts`, `PayPalRestClient`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `auth/sign-in.ts`, `scope-draft/src/council-task.ts`, `validate.ts`, `postgres.test.ts`, `live-hub.ts`, `appeal-items.ts`, `log-labels.ts`, `render.ts`, `dispute-sync.ts`, `src/summary.test.ts`, `PacketPanel.tsx`, `build.js`, `runtime.ts`, `draft-view.ts`, `chat-state.ts`, `live/src/index.ts`, `confirmation.ts`, `MessagesPanel.tsx`, `SellerAppPanel.tsx`, `readLedger`, `milestones.test.ts`, `progress.ts`, `db/src/migrate.ts`, `devDependencies`, `instruction-lines.test.ts`, `package.json`, `postgres-listen.test.ts`, `TimelineStep`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.02407790813587915 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `change-order-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.036036036036036036 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `README.md`, `progress.ts`, `ai/src/index.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.0438984438984439 - nodes in this community are weakly interconnected._