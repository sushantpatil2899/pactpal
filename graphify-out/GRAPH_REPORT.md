# Graph Report - paypal-hackathon  (2026-11-09)

## Corpus Check
- 620 files · ~413,838 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 4894 nodes · 15653 edges · 180 communities (175 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 471 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b60248c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- postgresContentStore
- deliveries.ts
- PayPalRestClient
- vitest
- seed-sandbox.ts
- .query
- instruction-lines.test.ts
- dispute-sync.ts
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
- paypal/src/index.ts
- artifacts.ts
- claims/src/check.ts
- testSpec
- readChecked
- app.ts
- council/src/index.ts
- Database
- change-orders.ts
- chat-api.ts
- email/src/index.ts
- validate.ts
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
- sha256Hex
- DraftReview.tsx
- linked-apps.ts
- utcDateTime
- deals/routes.ts
- sandbox-partner-report.ts
- sandbox-webhook-report.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- react
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
- rest.ts
- eval-scope.ts
- notices.ts
- postgres.ts
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
- invoices.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- Engineering
- LiveHub
- resend-inbound.ts
- ai/package.json
- pdf/package.json
- eval-judge.ts
- scripts
- src/summary.test.ts
- chat-state.ts
- MessagesPanel.tsx
- question-routes.ts
- email/package.json
- compilerOptions
- createSignedTestDeal
- runCouncil
- App.tsx
- draft-job.ts
- council/package.json
- app-link-routes.ts
- dispute-routes.ts
- db/src/index.ts
- net/src/index.ts
- Row
- app.test.ts
- score/package.json
- PactPal product spec
- devDependencies
- dependencies
- timeline-routes.ts
- Engineering standards
- package.json
- evidence-files.ts
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
- AcceptancePanel.tsx
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
- log-labels.ts
- Scope
- scripts
- QuestionsPanel.tsx
- .prettierrc.json
- Landing page (/ when signed out)
- engines
- live/src/index.ts
- action-service.ts
- image.ts
- bus.ts
- PactPal design system
- delivery-check.test.ts
- ChatTab.tsx
- useLiveChat.ts
- completeness.test.ts
- connection.test.ts
- log-labels.test.ts
- render.test.ts
- main.tsx
- Data model
- council

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
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts
- `Deal space (Phase 7)` --references--> `publishingBus()`  [INFERRED]
  docs/decisions.md → apps/server/src/chat/bus.ts

## Import Cycles
- None detected.

## Communities (180 total, 5 thin omitted)

### Community 0 - "postgresContentStore"
Cohesion: 0.14
Nodes (23): listQuery, notificationRoutes(), readRequest, readBody(), requireViewer(), createIntakeDeal(), intakeFilename(), bearerOf() (+15 more)

### Community 1 - "deliveries.ts"
Cohesion: 0.09
Nodes (38): answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile (+30 more)

### Community 2 - "PayPalRestClient"
Cohesion: 0.11
Nodes (24): Config, ClientOptions, ResendReceivedEmails, ResendOptions, HttpDeps, RetryPolicy, PayPalAppCredentials, LOGIN_SCOPES (+16 more)

### Community 3 - "vitest"
Cohesion: 0.03
Nodes (188): db, SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+180 more)

### Community 4 - "seed-sandbox.ts"
Cohesion: 0.09
Nodes (29): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+21 more)

### Community 5 - ".query"
Cohesion: 0.04
Nodes (86): addCard(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+78 more)

### Community 6 - "instruction-lines.test.ts"
Cohesion: 0.11
Nodes (30): JsonSchema, ClaimText, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input, numbered (+22 more)

### Community 7 - "dispute-sync.ts"
Cohesion: 0.14
Nodes (22): DisputeReader, LinkedDisputeAccount, changedSince(), Counts, DisputeSyncDeps, readTooSoon(), readVersionOf(), sameSecond() (+14 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (46): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), fingerprinted(), money (+38 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.10
Nodes (38): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), readChecked(), readOptions() (+30 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (52): Prepared, AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+44 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.22
Nodes (18): DISPUTE_EVENT_PREFIX, canonicalJson(), JsonValue, verifyFile(), Actor, appendEvent(), computeEntryHash(), EVENT_TYPES (+10 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.12
Nodes (30): addBuyer(), checkLedger(), checkPayments(), DealSummary, errorMessage(), getDeal(), getMilestones(), isMilestones() (+22 more)

### Community 13 - "ref_zod"
Cohesion: 0.10
Nodes (35): LiveRouteOptions, DealLookup, ChangeOrderRouteOptions, checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), looks() (+27 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.12
Nodes (26): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, candidates() (+18 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.09
Nodes (50): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+42 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.07
Nodes (39): send(), `buyer_questions`: questions about the agreement before signing, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList, DisputeMessage (+31 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (60): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+52 more)

### Community 18 - "server/package.json"
Cohesion: 0.07
Nodes (29): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+21 more)

### Community 19 - "paypal/src/index.ts"
Cohesion: 0.09
Nodes (24): PayPalApiError, CheckedEvidenceFile, EvidenceFile, Actor, links, lookupAnswer, MerchantLookup, MerchantStatus (+16 more)

### Community 20 - "artifacts.ts"
Cohesion: 0.09
Nodes (23): ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactKind, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+15 more)

### Community 21 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (29): checkAnalysis(), invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context, ENTRIES (+21 more)

### Community 22 - "testSpec"
Cohesion: 0.06
Nodes (49): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+41 more)

### Community 23 - "readChecked"
Cohesion: 0.12
Nodes (28): addPastedChat(), DealFile, DraftContent, draftFrom(), draftsUrl(), DraftView, getDraftById(), getScope() (+20 more)

### Community 24 - "app.ts"
Cohesion: 0.10
Nodes (23): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+15 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (46): ChatFailureKind, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "Database"
Cohesion: 0.10
Nodes (31): ReceiptMailDeps, AppOptions, SignInOptions, ChatBus, Card, HubOptions, NotificationRouteOptions, Notifier (+23 more)

### Community 27 - "change-orders.ts"
Cohesion: 0.04
Nodes (108): AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance(), declineTerms (+100 more)

### Community 28 - "chat-api.ts"
Cohesion: 0.25
Nodes (13): chatUrl(), getChat(), getTimeline(), isChat(), isMessage(), isRunningStep(), isTimeline(), postChat() (+5 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.08
Nodes (34): DealLinkEmailInput, LINK_PAGE, RFC-2606, emailAttachmentSchema, EmailFailure, EmailMessage, emailMessageSchema, SendResult (+26 more)

### Community 30 - "validate.ts"
Cohesion: 0.12
Nodes (30): allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, UNCLEAR_CATEGORY, MAYA_CHAT, Citation, amountQuoted(), categoryProblems() (+22 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (38): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced() (+30 more)

### Community 32 - "draft-routes.ts"
Cohesion: 0.09
Nodes (31): checkedScopeContentSchema, checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow (+23 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.11
Nodes (32): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+24 more)

### Community 34 - "api.ts"
Cohesion: 0.04
Nodes (89): AnswerOptionView, AppealCheckView, AppealView, buildPacket(), BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus (+81 more)

### Community 35 - "styles.ts"
Cohesion: 0.08
Nodes (50): analysesUrl(), checkDisputes(), compareClaim(), CouncilView, DisputesView, draftResponse(), getAppeal(), getClaimAnalyses() (+42 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+38 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.10
Nodes (35): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+27 more)

### Community 38 - "errors.ts"
Cohesion: 0.11
Nodes (19): dollar, PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback (+11 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (29): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+21 more)

### Community 40 - "sandbox-clients.ts"
Cohesion: 0.12
Nodes (19): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), disputes (+11 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (30): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, EvalCase, linesOf() (+22 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.08
Nodes (21): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], app, root, webSource (+13 more)

### Community 43 - "config.ts"
Cohesion: 0.08
Nodes (37): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS, appVars(), FEATURES (+29 more)

### Community 44 - "sha256Hex"
Cohesion: 0.04
Nodes (76): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+68 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.12
Nodes (25): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, FillChat, fillFrom(), FillSources (+17 more)

### Community 46 - "linked-apps.ts"
Cohesion: 0.09
Nodes (18): MilestoneRouteOptions, InvoiceSender, checkInvoicePaid(), CheckSource, INVOICE_PAID_EVENT, paidNotification, PaymentCheck, connectOwnApp() (+10 more)

### Community 47 - "utcDateTime"
Cohesion: 0.17
Nodes (21): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+13 more)

### Community 48 - "deals/routes.ts"
Cohesion: 0.09
Nodes (43): afterQuery, ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, LivePage (+35 more)

### Community 49 - "sandbox-partner-report.ts"
Cohesion: 0.15
Nodes (23): payPalIdOption(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+15 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.12
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 51 - "web/package.json"
Cohesion: 0.14
Nodes (13): @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words, name, private, type (+5 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.09
Nodes (33): addFile(), checksUrl(), fileUrl(), getDeliveryChecks(), isChecks(), isFile(), isReading(), MAX_FILE_BYTES (+25 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.08
Nodes (34): log, BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), renderWorkflowChecker(), RunnerBusyError, sameWorkflowTask() (+26 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (25): at(), source(), key(), seller(), `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deal_messages`: the deal's chat (7b) (+17 more)

### Community 55 - "react"
Cohesion: 0.10
Nodes (27): createDeal(), DealOptions, getDealOptions(), getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isDeal() (+19 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (22): CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, checkableLines(), Mark (+14 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (51): StepView, RunningStepView, dated(), DraftedItem, DraftedStep, planFromDraft(), same(), TimelinePlan (+43 more)

### Community 59 - "mcp.ts"
Cohesion: 0.14
Nodes (16): checkMcp(), message(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL (+8 more)

### Community 60 - "completeness.ts"
Cohesion: 0.17
Nodes (17): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+9 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (32): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+24 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.21
Nodes (22): appealApplies(), analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob(), councilView (+14 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "rest.ts"
Cohesion: 0.18
Nodes (18): SANDBOX_API_BASE_URL, debugIdOf(), errorBody, parseJson(), parseResponse(), sendWithRetry(), toApiError(), flag (+10 more)

### Community 68 - "eval-scope.ts"
Cohesion: 0.14
Nodes (18): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), clients, parsed (+10 more)

### Community 69 - "notices.ts"
Cohesion: 0.13
Nodes (23): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+15 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "chat-routes.ts"
Cohesion: 0.11
Nodes (29): CHAT_TRANSCRIPT_PREFIX, sendRefusal(), attachmentHeader(), sendCheckedFile(), sendDownload(), decoder, draftParams, draftRoutes() (+21 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "appeal-items.ts"
Cohesion: 0.13
Nodes (18): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+10 more)

### Community 74 - "claim-analyses.ts"
Cohesion: 0.13
Nodes (15): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+7 more)

### Community 75 - "render.ts"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 76 - "questions.ts"
Cohesion: 0.06
Nodes (37): db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View, AiAnswer (+29 more)

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
Cohesion: 0.09
Nodes (20): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode(), reply (+12 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.22
Nodes (23): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+15 more)

### Community 83 - "invoices.ts"
Cohesion: 0.14
Nodes (16): createdInvoice, DraftInvoice, InvoiceDraft, invoiceNote(), InvoiceSendError, PayPalInvoices, SentInvoice, draft (+8 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+11 more)

### Community 86 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 87 - "Engineering"
Cohesion: 0.11
Nodes (17): checkAsSellerApp(), checks, AI, Decisions, Engineering, Partner tools, PayPal integration, Product (+9 more)

### Community 88 - "LiveHub"
Cohesion: 0.13
Nodes (6): BusSignal, Listen, db, hubOnTestDeal(), LiveHub, ServerFrame

### Community 89 - "resend-inbound.ts"
Cohesion: 0.22
Nodes (10): intakeEmail(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), ENTITIES, entity() (+2 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.14
Nodes (26): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+18 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "src/summary.test.ts"
Cohesion: 0.14
Nodes (19): checkSummary(), PacketSummary, packetSummarySchema, readSummary(), buildSummaryMessages(), ExhibitLine, MAX_NOTE_CHARS, SUMMARY_PROMPT_VERSION (+11 more)

### Community 95 - "chat-state.ts"
Cohesion: 0.21
Nodes (14): ChatView, ChatAction, chatReducer(), ChatState, Connection, initialChat, lastSeenByOther(), onFrame() (+6 more)

### Community 96 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 97 - "question-routes.ts"
Cohesion: 0.13
Nodes (25): featureAnswers(), step(), answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes() (+17 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "createSignedTestDeal"
Cohesion: 0.07
Nodes (48): db, signedDeal(), signedPayPal(), StageView, db, sentStage(), fakeAppWebhooks(), fakePayPal() (+40 more)

### Community 101 - "runCouncil"
Cohesion: 0.09
Nodes (41): MESSAGE_PROMPT_VERSIONS, MessageJob, DraftFill, AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine() (+33 more)

### Community 102 - "App.tsx"
Cohesion: 0.06
Nodes (64): AnswerBox(), Revisions, revisionWords(), approveDelivery(), deliveriesUrl(), DeliveriesView, deliveryFileUrl(), deliveryStep() (+56 more)

### Community 103 - "draft-job.ts"
Cohesion: 0.16
Nodes (17): runPrepared(), draftCategories, councilRecordSchema, toCouncilRecord(), toJson(), usage, DraftJob, JobLog (+9 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "app-link-routes.ts"
Cohesion: 0.17
Nodes (16): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+8 more)

### Community 106 - "dispute-routes.ts"
Cohesion: 0.33
Nodes (8): CHECK_INTERVAL_MS, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputePageView(), disputeSummaryView(), DisputeCheck

### Community 107 - "db/src/index.ts"
Cohesion: 0.03
Nodes (129): ContentMismatchError, contentRow, Queryable, lockedDeal, addBuyer, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal (+121 more)

### Community 108 - "net/src/index.ts"
Cohesion: 0.22
Nodes (13): defaultHttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork(), policy, Step, urlOf() (+5 more)

### Community 109 - "Row"
Cohesion: 0.21
Nodes (8): Row, PgClient, PgConnection, createTestDatabase(), Engine, queryOn(), TestDatabase, useTestDatabase()

### Community 110 - "app.test.ts"
Cohesion: 0.26
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+3 more)

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

### Community 115 - "timeline-routes.ts"
Cohesion: 0.19
Nodes (17): DealCards, AcceptanceRouteOptions, money(), scopeTerms(), scopeView(), stepTerms(), REFUSALS, stepParams (+9 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "evidence-files.ts"
Cohesion: 0.17
Nodes (14): mediaTypeOf(), detectMediaType(), FileFingerprint, hashFile(), isAllowedWhitespace(), isControl(), isPlainFileName(), isPlainText() (+6 more)

### Community 119 - "receipt.ts"
Cohesion: 0.18
Nodes (16): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+8 more)

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

### Community 129 - "AcceptancePanel.tsx"
Cohesion: 0.25
Nodes (15): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), declineTerms(), emailReceiptAgain() (+7 more)

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
Cohesion: 0.13
Nodes (25): documentFor(), acceptBody, changeOrderRoutes(), view(), waitingChange(), changeParams, changeView(), declineBody (+17 more)

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

### Community 157 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 159 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 160 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 165 - "live/src/index.ts"
Cohesion: 0.25
Nodes (13): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+5 more)

### Community 166 - "action-service.ts"
Cohesion: 0.16
Nodes (13): deliverAction(), failedOutcome(), newestReady(), send(), DisputeMessageView, keptFields, openedAt(), SELLER_ANSWERS (+5 more)

### Community 167 - "image.ts"
Cohesion: 0.28
Nodes (14): CheckedFile, ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader (+6 more)

### Community 168 - "bus.ts"
Cohesion: 0.23
Nodes (10): listeners(), memoryBus(), postgresBus(), publishingBus(), CHAT_CHANNEL, ChatEvent, chatEventSchema, parseChatEvent() (+2 more)

### Community 169 - "PactPal design system"
Cohesion: 0.18
Nodes (12): Colour, Components, Do and don't, How far the world reaches, by surface, Logo, Motion, PactPal design system, Space, shape, depth (+4 more)

### Community 170 - "delivery-check.test.ts"
Cohesion: 0.22
Nodes (10): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+2 more)

### Community 171 - "ChatTab.tsx"
Cohesion: 0.27
Nodes (10): getPastedChats(), isPasted(), PastedChat, bubble(), ChatTab(), CONNECTION_WORDS, DealTab, Message() (+2 more)

### Community 172 - "useLiveChat.ts"
Cohesion: 0.33
Nodes (7): liveUrl(), lastSeq(), reconnectDelay(), LiveChat, useLiveChat(), connect(), loadHistory()

### Community 173 - "completeness.test.ts"
Cohesion: 0.29
Nodes (8): agreed(), BUYER_EMAIL, entry(), FILE, OTHER_EMAIL, said(), signed, stageDone()

### Community 174 - "connection.test.ts"
Cohesion: 0.28
Nodes (6): Call, item, json(), Reply, setup(), tokenReply()

### Community 175 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 176 - "render.test.ts"
Cohesion: 0.29
Nodes (3): AT, pdfTextLines(), pdf-lib

### Community 177 - "main.tsx"
Cohesion: 0.29
Nodes (4): root, @fontsource-variable/archivo, @fontsource-variable/martian-mono, react-dom

### Community 178 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 179 - "council"
Cohesion: 0.33
Nodes (6): draft(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, council(), deps()

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1614 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `deliveries.ts`, `PayPalRestClient`, `seed-sandbox.ts`, `.query`, `instruction-lines.test.ts`, `dispute-sync.ts`, `acceptance-routes.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `deals/routes.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `paypal/src/index.ts`, `artifacts.ts`, `claims/src/check.ts`, `testSpec`, `readChecked`, `app.ts`, `council/src/index.ts`, `change-orders.ts`, `email/src/index.ts`, `validate.ts`, `scope-draft/src/testing.ts`, `draft-routes.ts`, `api.ts`, `packet-service.ts`, `live/src/index.ts`, `errors.ts`, `eval-report.ts`, `sandbox-clients.ts`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `sha256Hex`, `DraftReview.tsx`, `delivery-check.test.ts`, `utcDateTime`, `log-labels.test.ts`, `sandbox-partner-report.ts`, `sandbox-webhook-report.ts`, `connection.test.ts`, `DeliveriesPanel.tsx`, `server/src/index.ts`, `render.test.ts`, `react`, `timeline/src/index.ts`, `mcp.ts`, `words/src/index.ts`, `DisputeActions.tsx`, `rest.ts`, `eval-scope.ts`, `postgres.ts`, `appeal-items.ts`, `questions.ts`, `client.ts`, `invoices.ts`, `Engineering`, `LiveHub`, `resend-inbound.ts`, `eval-judge.ts`, `src/summary.test.ts`, `chat-state.ts`, `MessagesPanel.tsx`, `createSignedTestDeal`, `runCouncil`, `App.tsx`, `completeness.test.ts`, `db/src/index.ts`, `net/src/index.ts`, `app.test.ts`, `package.json`, `evidence-files.ts`, `tokens.ts`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `postgresContentStore` be split into smaller, more focused modules?**
  _Cohesion score 0.13538461538461538 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `deliveries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0859465737514518 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `postgresContentStore`, `deliveries.ts`, `vitest`, `.query`, `dispute-sync.ts`, `acceptance-routes.ts`, `ref_zod`, `deals/routes.ts`, `artifacts.ts`, `change-order-routes.ts`, `app.ts`, `change-orders.ts`, `draft-routes.ts`, `packet-service.ts`, `action-service.ts`, `bus.ts`, `sha256Hex`, `linked-apps.ts`, `deals/routes.ts`, `server/src/index.ts`, `notices.ts`, `postgres.ts`, `chat-routes.ts`, `appeal-items.ts`, `claim-analyses.ts`, `questions.ts`, `claim-job.ts`, `resend-inbound.ts`, `question-routes.ts`, `createSignedTestDeal`, `runCouncil`, `draft-job.ts`, `app-link-routes.ts`, `db/src/index.ts`, `Row`, `app.test.ts`, `timeline-routes.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `PayPalRestClient` be split into smaller, more focused modules?**
  _Cohesion score 0.10668563300142248 - nodes in this community are weakly interconnected._