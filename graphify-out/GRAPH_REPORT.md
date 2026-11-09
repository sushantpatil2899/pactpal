# Graph Report - paypal-hackathon  (2026-11-09)

## Corpus Check
- 620 files · ~413,625 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 5, .css 3, .example 1)

## Summary
- 4893 nodes · 15618 edges · 161 communities (156 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 471 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40e90aa5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- deals.ts
- .query
- Secret
- test-app.ts
- paypal/src/index.ts
- dispute-actions.ts
- SellerAppPanel.tsx
- sellers/disputes.test.ts
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- DealPage.tsx
- ref_zod
- ai/src/index.ts
- deals/routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- server/package.json
- sellers/disputes.test.ts
- testId
- qa/src/index.ts
- testSpec
- readLedger
- app.ts
- council/src/index.ts
- Database
- change-orders.ts
- isObject
- email/src/index.ts
- when
- scope-draft/src/testing.ts
- draft-routes.ts
- action-routes.ts
- api.ts
- styles.ts
- packet-service.ts
- words/src/index.ts
- errors.ts
- eval-report.ts
- sandbox-clients.ts
- scope-draft/src/index.ts
- paypal-webhook.ts
- config.ts
- db/src/testing.ts
- DraftReview.tsx
- scope.ts
- utcDateTime
- deals/routes.ts
- sandbox-partner-report.ts
- sandbox-webhook-report.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- IntakePanel.tsx
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- dependencies
- DisputeActions.tsx
- services
- claim-routes.ts
- scripts
- db/package.json
- appeal-routes.test.ts
- delivery-checks.ts
- dispute-sync.ts
- postgres.test.ts
- chat-routes.ts
- claims/package.json
- appeal-items.ts
- claim-analyses.ts
- render.ts
- questions.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- client.ts
- claim-job.ts
- db/src/disputes.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- ledger-store.ts
- LiveHub
- resend-inbound.ts
- ai/package.json
- pdf/package.json
- eval-judge.ts
- scripts
- layouts.tsx
- live/src/index.ts
- MessagesPanel.tsx
- questionRoutes
- email/package.json
- compilerOptions
- seller-connections.ts
- runCouncil
- App.tsx
- secret-box.test.ts
- council/package.json
- parts.tsx
- dispute-view.ts
- db/src/index.ts
- sign-in-words.ts
- createTestDatabase
- app.test.ts
- score/package.json
- PactPal product spec
- devDependencies
- dependencies
- Engineering standards
- package.json
- LinkPage.tsx
- receipt.ts
- tokens.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- Redesign plan (proposed Phase 7R)
- devDependencies
- devDependencies
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
- change-order-routes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Scope
- scripts
- .prettierrc.json
- Landing page (/ when signed out)
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 187 edges
2. `Database` - 114 edges
3. `testId()` - 103 edges
4. `readLedger()` - 86 edges
5. `useMigratedTestDatabase()` - 74 edges
6. `sha256Hex()` - 74 edges
7. `isObject()` - 61 edges
8. `TEST_NOW` - 61 edges
9. `Secret` - 61 edges
10. `appendLedgerEvent()` - 59 edges

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

## Communities (161 total, 5 thin omitted)

### Community 0 - "deals.ts"
Cohesion: 0.06
Nodes (53): addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CATEGORIES, DEAL_CURRENCIES, DEAL_KINDS, DealCategory (+45 more)

### Community 1 - ".query"
Cohesion: 0.08
Nodes (59): declineTerms, lockFor(), originOf(), recordReceiptSent(), requestAcceptance, setStatus(), waitingVersion(), withdrawAcceptance (+51 more)

### Community 2 - "Secret"
Cohesion: 0.06
Nodes (63): PayPal integration, ClientOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork() (+55 more)

### Community 3 - "test-app.ts"
Cohesion: 0.04
Nodes (95): SESSION_COOKIE, chatDeal(), db, MessageBody, opened, openLiveDeal(), Card, db (+87 more)

### Community 4 - "paypal/src/index.ts"
Cohesion: 0.08
Nodes (38): day(), StageInvoice, InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS (+30 more)

### Community 5 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (21): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+13 more)

### Community 6 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 7 - "sellers/disputes.test.ts"
Cohesion: 0.11
Nodes (30): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+22 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (27): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+19 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.07
Nodes (51): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+43 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (69): parseJsonReply(), ChatOutcome, AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem (+61 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.08
Nodes (46): addArtifact(), ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, artifactRow, assertBuyerRoom(), assertFileAllowed(), assertRoom() (+38 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.09
Nodes (37): addBuyer(), checkLedger(), checkPayments(), DealSummary, errorMessage(), getMilestones(), isMilestones(), LedgerCheck (+29 more)

### Community 13 - "ref_zod"
Cohesion: 0.10
Nodes (34): LiveRouteOptions, DealLookup, ChangeOrderRouteOptions, checkBody, DeliveryCheckRouteOptions, LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+26 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.11
Nodes (28): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, candidates() (+20 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.07
Nodes (61): ChatNames, accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+53 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.07
Nodes (39): send(), `buyer_questions`: questions about the agreement before signing, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList, DisputeMessage (+31 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (61): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+53 more)

### Community 18 - "server/package.json"
Cohesion: 0.07
Nodes (29): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+21 more)

### Community 19 - "sellers/disputes.test.ts"
Cohesion: 0.10
Nodes (28): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), CheckRequest, fakeWriter() (+20 more)

### Community 20 - "testId"
Cohesion: 0.08
Nodes (28): db, newDeal, sellerDeal(), setup(), signedIn(), checkDeps(), linkApp(), newId() (+20 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.08
Nodes (43): checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, AGREEMENT (+35 more)

### Community 22 - "testSpec"
Cohesion: 0.05
Nodes (56): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), clients() (+48 more)

### Community 23 - "readLedger"
Cohesion: 0.05
Nodes (50): db, db, invoiceEntries(), signedPayPal(), StageView, disputeTypes(), capturingEmail(), db (+42 more)

### Community 24 - "app.ts"
Cohesion: 0.07
Nodes (37): buildApp(), requestLog(), socketOrigin(), LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, setup() (+29 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (45): Prepared, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+37 more)

### Community 26 - "Database"
Cohesion: 0.05
Nodes (59): ReceiptMailDeps, AppOptions, SignInOptions, BusSignal, ChatBus, Listen, listeners(), memoryBus() (+51 more)

### Community 27 - "change-orders.ts"
Cohesion: 0.06
Nodes (45): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+37 more)

### Community 28 - "isObject"
Cohesion: 0.09
Nodes (46): createDeal(), draftFrom(), getDeal(), getDealOptions(), getLedger(), isAppeal(), isCouncil(), isCouncilJob() (+38 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.07
Nodes (39): seller(), linkedSeller(), RFC-2606, `deal_messages`: the deal's chat (7b), `ledger_entries`: the evidence log, Engineering, emailAttachmentSchema, EmailFailure (+31 more)

### Community 30 - "when"
Cohesion: 0.12
Nodes (38): analysesUrl(), checkDisputes(), compareClaim(), disputesUrl(), DisputesView, getClaimAnalyses(), getDisputePage(), getDisputes() (+30 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.06
Nodes (60): draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf(), chatCaseRuns(), InjectionOptions (+52 more)

### Community 32 - "draft-routes.ts"
Cohesion: 0.08
Nodes (36): db, withReadyDraft(), postgresContentStore(), MAX_QUESTIONS_PER_DEAL, ANSWER, at(), awaiting(), db (+28 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.09
Nodes (41): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+33 more)

### Community 34 - "api.ts"
Cohesion: 0.05
Nodes (73): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+65 more)

### Community 35 - "styles.ts"
Cohesion: 0.08
Nodes (49): AppealCheckView, AppealView, buildPacket(), checkAppeal(), CouncilView, draftResponse(), draftStatement(), draftSummary() (+41 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.18
Nodes (14): ScopeTerms, dateOf, ScopeDetails(), ChangeFacts, changeLines(), dayOrNone(), dayWords(), NONE (+6 more)

### Community 38 - "errors.ts"
Cohesion: 0.08
Nodes (25): PayPalBuyerTestActions, dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+17 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.09
Nodes (41): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), aloneRow(), aloneSection() (+33 more)

### Community 40 - "sandbox-clients.ts"
Cohesion: 0.13
Nodes (18): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), disputes (+10 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (89): councilRecordOf(), compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided() (+81 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.11
Nodes (20): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], paypalUnavailable(), sellerAppRoutes(), registerAlerts() (+12 more)

### Community 43 - "config.ts"
Cohesion: 0.11
Nodes (26): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, FEATURES (+18 more)

### Community 44 - "db/src/testing.ts"
Cohesion: 0.07
Nodes (49): db, CALLBACK_PATH, RETURN_COOKIE, STATE_COOKIE, db, dealWithBuyer(), maya, report (+41 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (53): addPastedChat(), ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent, DraftMark (+45 more)

### Community 46 - "scope.ts"
Cohesion: 0.06
Nodes (39): waitingChange(), acceptance, deal, scope, `change_orders`: changes to a signed agreement, changeOf(), listChangeOrders(), at() (+31 more)

### Community 47 - "utcDateTime"
Cohesion: 0.17
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 48 - "deals/routes.ts"
Cohesion: 0.09
Nodes (43): acceptanceDocument, chatRoutes(), liveQuery, liveRoutes(), check(), originAllowed(), rawText(), notificationRoutes() (+35 more)

### Community 49 - "sandbox-partner-report.ts"
Cohesion: 0.08
Nodes (39): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+31 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 51 - "web/package.json"
Cohesion: 0.11
Nodes (17): @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words, name, private, type (+9 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.08
Nodes (43): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+35 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.11
Nodes (29): publishingBus(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+21 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.05
Nodes (53): review(), paid(), at(), source(), key(), LedgerEntryView, draft(), deliveryLabel() (+45 more)

### Community 55 - "IntakePanel.tsx"
Cohesion: 0.20
Nodes (14): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+6 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.05
Nodes (63): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), looks(), DeliveryCheckView, factsWords() (+55 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.05
Nodes (67): DealCards, Notifier, sendTimelineReminders(), AcceptanceRouteOptions, money(), scopeTerms(), scopeView(), stepTerms() (+59 more)

### Community 59 - "mcp.ts"
Cohesion: 0.09
Nodes (32): APP_KEYS, PayPalApp, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS (+24 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.15
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+20 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.22
Nodes (22): appealApplies(), appealFacts(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+14 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "appeal-routes.test.ts"
Cohesion: 0.10
Nodes (23): answer, AppealView, db, FILES, ChoicesView, db, disputedDeal(), png() (+15 more)

### Community 68 - "delivery-checks.ts"
Cohesion: 0.15
Nodes (12): sellerStageStep, checkedFileSchema, checkRow, DeliveryCheck, DeliveryCheckNotAllowedError, DeliveryCheckRefusal, listDeliveryChecks(), MAX_CHECKS_PER_DEAL (+4 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.07
Nodes (48): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+40 more)

### Community 70 - "postgres.test.ts"
Cohesion: 0.06
Nodes (33): PayPalWebhookOptions, CHAT_CHANNEL, ChatEvent, chatEventSchema, parseChatEvent(), party, publishChatEvent(), Queryable (+25 more)

### Community 71 - "chat-routes.ts"
Cohesion: 0.08
Nodes (39): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatRouteOptions, messageView(), postBody, REFUSALS, sendRefusal(), attachmentHeader() (+31 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "appeal-items.ts"
Cohesion: 0.13
Nodes (15): appealGaps(), missingFromPacket(), AlreadySent, appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId(), HeldDocument (+7 more)

### Community 74 - "claim-analyses.ts"
Cohesion: 0.09
Nodes (24): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+16 more)

### Community 75 - "render.ts"
Cohesion: 0.12
Nodes (17): Colour, Components, Do and don't, How far the world reaches, by surface, Logo, Motion, PactPal design system, Space, shape, depth (+9 more)

### Community 76 - "questions.ts"
Cohesion: 0.11
Nodes (24): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+16 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (23): Moving a dispute to a verdict, Accounts and connection, AI, Disputes, Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+15 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "client.ts"
Cohesion: 0.15
Nodes (14): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode(), reply (+6 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.30
Nodes (19): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+11 more)

### Community 83 - "db/src/disputes.ts"
Cohesion: 0.10
Nodes (20): actionList, checkRow, DISPUTE_CHECK_SOURCES, DISPUTE_MATCHES, disputeChanges, DisputeCheck, DisputeCheckResult, DisputeEvent (+12 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.11
Nodes (18): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+10 more)

### Community 86 - "build.js"
Cohesion: 0.17
Nodes (8): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), webSource, esbuild

### Community 87 - "ledger-store.ts"
Cohesion: 0.11
Nodes (18): ACTORS, assertActorAllowed(), assertMayAct(), dealParties, entryRow, LedgerActorError, LedgerConflictError, MAX_PACKETS_PER_DISPUTE (+10 more)

### Community 88 - "LiveHub"
Cohesion: 0.19
Nodes (5): LiveHub, LivePage, warn(), Party, ServerFrame

### Community 89 - "resend-inbound.ts"
Cohesion: 0.18
Nodes (12): intakeEmail(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, ResendInboundOptions, resendInboundRoutes(), ENTITIES (+4 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "layouts.tsx"
Cohesion: 0.33
Nodes (10): Me, Logo(), LogoMark(), Account(), AppLayout(), BuyerLayout(), Footer(), PublicLayout() (+2 more)

### Community 95 - "live/src/index.ts"
Cohesion: 0.10
Nodes (37): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+29 more)

### Community 96 - "MessagesPanel.tsx"
Cohesion: 0.28
Nodes (10): checkMessage(), getMessages(), isMessages(), messagesUrl(), MessagesView, LABEL_WORDS, revisionNote(), ALERT (+2 more)

### Community 97 - "questionRoutes"
Cohesion: 0.33
Nodes (9): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), listQuestions() (+1 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "seller-connections.ts"
Cohesion: 0.14
Nodes (23): activeConnection(), claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow, disconnectSeller() (+15 more)

### Community 101 - "runCouncil"
Cohesion: 0.11
Nodes (35): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+27 more)

### Community 102 - "App.tsx"
Cohesion: 0.21
Nodes (16): getMe(), signOut(), App(), dealPage(), Session, signInBack, inAppPath(), LinkClick (+8 more)

### Community 103 - "secret-box.test.ts"
Cohesion: 0.28
Nodes (4): SecretBoxKeyError, box, KEY, OTHER_KEY

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "parts.tsx"
Cohesion: 0.25
Nodes (9): Alert(), Button(), ButtonLink(), Field(), Label(), Look, lookClass(), LookProps (+1 more)

### Community 106 - "dispute-view.ts"
Cohesion: 0.15
Nodes (18): CHECK_INTERVAL_MS, DisputeChecker, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputeFieldsOf(), DisputeMessageView (+10 more)

### Community 107 - "db/src/index.ts"
Cohesion: 0.04
Nodes (76): ARTIFACT_KINDS, ArtifactRejection, BUYER_MEDIA_TYPES, newArtifactSchema, body, ChatIntegrityError, chatNoticeSchema, ChatRefusal (+68 more)

### Community 108 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 109 - "createTestDatabase"
Cohesion: 0.60
Nodes (3): createTestDatabase(), Engine, queryOn()

### Community 110 - "app.test.ts"
Cohesion: 0.12
Nodes (19): closeOnSignals(), report, setup(), result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate() (+11 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @fontsource-variable/archivo, @fontsource-variable/martian-mono, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words (+2 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "LinkPage.tsx"
Cohesion: 0.25
Nodes (7): LinkProblem, redeemLink(), SIGN_IN_PATH, initialSecret, LinkPage(), PROBLEMS, View

### Community 119 - "receipt.ts"
Cohesion: 0.10
Nodes (26): acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), ReceiptIntegrityError (+18 more)

### Community 120 - "tokens.ts"
Cohesion: 0.36
Nodes (7): applyTokens(), contrast(), luminance(), token(), tokenCss(), TokenName, TOKENS

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.18
Nodes (11): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+3 more)

### Community 123 - "PayPal sandbox notes"
Cohesion: 0.20
Nodes (10): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, PayPal sandbox notes, Reliability (+2 more)

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

### Community 128 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 130 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 131 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react

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

### Community 150 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (35): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, documentFor(), fingerprinted(), money, featureAnswers(), step(), acceptBody (+27 more)

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

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 159 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1615 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `db/src/testing.ts` to `Secret`, `test-app.ts`, `paypal/src/index.ts`, `SellerAppPanel.tsx`, `sellers/disputes.test.ts`, `sandbox-respond-report.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `sellers/disputes.test.ts`, `testId`, `qa/src/index.ts`, `testSpec`, `readLedger`, `app.ts`, `council/src/index.ts`, `Database`, `email/src/index.ts`, `when`, `scope-draft/src/testing.ts`, `draft-routes.ts`, `packet-service.ts`, `words/src/index.ts`, `errors.ts`, `eval-report.ts`, `sandbox-clients.ts`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `DraftReview.tsx`, `scope.ts`, `utcDateTime`, `sandbox-partner-report.ts`, `sandbox-webhook-report.ts`, `DeliveriesPanel.tsx`, `Built (sub-phases 2b to 6h-1)`, `IntakePanel.tsx`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `DisputeActions.tsx`, `appeal-routes.test.ts`, `dispute-sync.ts`, `postgres.test.ts`, `appeal-items.ts`, `client.ts`, `build.js`, `resend-inbound.ts`, `live/src/index.ts`, `MessagesPanel.tsx`, `seller-connections.ts`, `runCouncil`, `App.tsx`, `secret-box.test.ts`, `sign-in-words.ts`, `app.test.ts`, `package.json`, `receipt.ts`, `tokens.ts`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `deals.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05706214689265537 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `.query` be split into smaller, more focused modules?**
  _Cohesion score 0.08269230769230769 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `deals.ts`, `.query`, `test-app.ts`, `dispute-actions.ts`, `sellers/disputes.test.ts`, `acceptance-routes.ts`, `ledger/src/index.ts`, `ref_zod`, `deals/routes.ts`, `testId`, `change-order-routes.ts`, `app.ts`, `change-orders.ts`, `draft-routes.ts`, `action-routes.ts`, `packet-service.ts`, `db/src/testing.ts`, `scope.ts`, `deals/routes.ts`, `server/src/index.ts`, `timeline/src/index.ts`, `delivery-checks.ts`, `dispute-sync.ts`, `postgres.test.ts`, `chat-routes.ts`, `appeal-items.ts`, `claim-analyses.ts`, `questions.ts`, `claim-job.ts`, `db/src/disputes.ts`, `ledger-store.ts`, `resend-inbound.ts`, `seller-connections.ts`, `runCouncil`, `db/src/index.ts`, `app.test.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.05603960396039604 - nodes in this community are weakly interconnected._