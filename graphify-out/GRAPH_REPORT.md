# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 644 files · ~422,779 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 5, .css 5, .example 1)

## Summary
- 5030 nodes · 16173 edges · 160 communities (154 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 480 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `706a0827`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- resend-inbound.ts
- overview-words.ts
- PayPalRestClient
- vitest
- react
- testId
- deals/routes.ts
- AcceptancePanel.tsx
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- MessagesPanel.tsx
- question-routes.ts
- ai/src/index.ts
- deals/routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- server/package.json
- vitest
- AccessTokenProvider
- dispute-actions.ts
- claims/src/check.ts
- email/src/index.ts
- Database
- council/src/index.ts
- Database
- .query
- words/src/index.ts
- email/src/index.ts
- validate.ts
- scope-draft/src/testing.ts
- scope-drafts.ts
- action-routes.ts
- api.ts
- questions.ts
- packet-service.ts
- when
- scope-draft/src/prompt.ts
- eval-report.ts
- eval-scope.ts
- scope-draft/src/index.ts
- render-blueprint.test.ts
- config.ts
- db/src/index.ts
- DraftReview.tsx
- QuestionsPanel.tsx
- utcDateTime
- dispute-sync.ts
- sandbox-partner-report.ts
- sandbox-webhook-report.ts
- web/package.json
- DeliverPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- appeal-items.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- dependencies
- DisputeActions.tsx
- services
- Insights.tsx
- scripts
- db/package.json
- errors.ts
- testSpec
- dispute-sync.ts
- postgres.ts
- message-reviews.ts
- claims/package.json
- dependencies
- log-labels.ts
- IntakePanel.tsx
- theme.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- chat-api.ts
- claim-job.ts
- paypal/src/index.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- dispute-email.ts
- live-hub.ts
- SellerAppPanel.tsx
- ai/package.json
- milestone-routes.ts
- eval-judge.ts
- scripts
- devDependencies
- DealPage.tsx
- scripts
- log-labels.test.ts
- email/package.json
- compilerOptions
- linked-apps.test.ts
- runCouncil
- Data model
- draft-job.ts
- council/package.json
- vite-env.d.ts
- Decisions
- checker.ts
- seller
- db/src/migrate.ts
- score/package.json
- PactPal product spec
- devDependencies
- council
- timeline-routes.ts
- Engineering standards
- package.json
- render.ts
- tokens.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- Redesign plan (proposed Phase 7R)
- sign-in-words.ts
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
- question-routes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Scope
- .prettierrc.json
- Landing page (/ when signed out)
- engines
- PactPal design system

## God Nodes (most connected - your core abstractions)
1. `vitest` - 192 edges
2. `Database` - 117 edges
3. `testId()` - 103 edges
4. `readLedger()` - 86 edges
5. `useMigratedTestDatabase()` - 75 edges
6. `sha256Hex()` - 74 edges
7. `isObject()` - 64 edges
8. `TEST_NOW` - 62 edges
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

## Communities (160 total, 6 thin omitted)

### Community 0 - "resend-inbound.ts"
Cohesion: 0.21
Nodes (11): createIntakeDeal(), intakeFilename(), intakeEmail(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes() (+3 more)

### Community 1 - "overview-words.ts"
Cohesion: 0.12
Nodes (30): DealSummary, Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), theme (+22 more)

### Community 2 - "PayPalRestClient"
Cohesion: 0.10
Nodes (23): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), disputes (+15 more)

### Community 3 - "vitest"
Cohesion: 0.04
Nodes (90): chatDeal(), db, MessageBody, db, Card, db, savedDeal(), send() (+82 more)

### Community 4 - "react"
Cohesion: 0.06
Nodes (89): AnswerBox(), Revisions, revisionWords(), approveDelivery(), createDeal(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+81 more)

### Community 5 - "testId"
Cohesion: 0.05
Nodes (69): queuedDrafting(), signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+61 more)

### Community 6 - "deals/routes.ts"
Cohesion: 0.07
Nodes (56): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatRouteOptions, postBody, REFUSALS, liveQuery, LiveRouteOptions, liveRoutes() (+48 more)

### Community 7 - "AcceptancePanel.tsx"
Cohesion: 0.25
Nodes (15): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), declineTerms(), emailReceiptAgain() (+7 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.06
Nodes (63): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), documentFor(), fingerprinted(), money (+55 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (79): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+71 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (58): parseJsonReply(), tryParse(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages() (+50 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.04
Nodes (89): DISPUTE_EVENT_PREFIX, db, addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+81 more)

### Community 12 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.07
Nodes (55): ChatNames, chatRoutes(), featureAnswers(), step(), sendRefusal(), checkBody, checkView(), DeliveryCheckRouteOptions (+47 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.08
Nodes (41): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+33 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.09
Nodes (46): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+38 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (43): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeDetails (+35 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.08
Nodes (59): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), InvalidFieldsError, isChangeOrders() (+51 more)

### Community 18 - "server/package.json"
Cohesion: 0.06
Nodes (30): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+22 more)

### Community 19 - "vitest"
Cohesion: 0.03
Nodes (116): db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, db, liveDeal() (+108 more)

### Community 20 - "AccessTokenProvider"
Cohesion: 0.10
Nodes (23): APP_KEYS, Config, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+15 more)

### Community 21 - "dispute-actions.ts"
Cohesion: 0.10
Nodes (24): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+16 more)

### Community 22 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (30): checkAnalysis(), claimAnalysisSchema, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+22 more)

### Community 23 - "email/src/index.ts"
Cohesion: 0.15
Nodes (18): emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError, ReadResult (+10 more)

### Community 24 - "Database"
Cohesion: 0.04
Nodes (82): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), LinkOptions (+74 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.11
Nodes (37): ChatOutcome, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+29 more)

### Community 26 - "Database"
Cohesion: 0.09
Nodes (31): ReceiptMailDeps, Card, DealCards, Notifier, NotifierOptions, PartyNotice, ReminderDeps, AcceptanceRouteOptions (+23 more)

### Community 27 - ".query"
Cohesion: 0.03
Nodes (145): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+137 more)

### Community 28 - "words/src/index.ts"
Cohesion: 0.16
Nodes (20): AcceptanceDocument(), AcceptanceDocument, ScopeTerms, Field(), dateOf, ScopeDetails(), AgreementPage, ChangeFacts (+12 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.04
Nodes (74): RFC-2606, ClientOptions, EmailNetworkError, errorAnswer, errorName(), isReservedTestAddress(), reasonFor(), RESEND_EMAILS_URL (+66 more)

### Community 30 - "validate.ts"
Cohesion: 0.13
Nodes (28): allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, UNCLEAR_CATEGORY, Citation, amountQuoted(), categoryProblems(), citationProblem() (+20 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.07
Nodes (50): draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf(), chatCaseRuns(), InjectionOptions (+42 more)

### Community 32 - "scope-drafts.ts"
Cohesion: 0.08
Nodes (36): db, sellerDeal(), withReadyDraft(), forwardInterruptedQuestions(), ANSWER, at(), awaiting(), db (+28 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.09
Nodes (38): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+30 more)

### Community 34 - "api.ts"
Cohesion: 0.04
Nodes (108): addBuyer(), analysesUrl(), AnswerOptionView, AppealCheckView, AppealView, buildPacket(), BuiltPacket, CategoryVerdict (+100 more)

### Community 35 - "questions.ts"
Cohesion: 0.11
Nodes (23): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+15 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.11
Nodes (38): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+30 more)

### Community 37 - "when"
Cohesion: 0.08
Nodes (52): checkDisputes(), CouncilView, DisputesView, getDisputes(), isDisputes(), PacketSummariesView, PacketSummaryView, AppealPanel() (+44 more)

### Community 38 - "scope-draft/src/prompt.ts"
Cohesion: 0.14
Nodes (21): ChatMessage, JsonSchema, BALLOT_SCHEMA_NAME, ballotSchema(), buildRankingMessages(), COUNCIL_RANK_PROMPT_VERSION, isValidMarker(), markerProblem() (+13 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "eval-scope.ts"
Cohesion: 0.15
Nodes (17): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), clients, parsed (+9 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (43): ClaimText, RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS (+35 more)

### Community 42 - "render-blueprint.test.ts"
Cohesion: 0.12
Nodes (9): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], app, root, webSource (+1 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (27): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors() (+19 more)

### Community 44 - "db/src/index.ts"
Cohesion: 0.02
Nodes (157): addCard(), sentStage(), ScopeChange, body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal (+149 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (44): addPastedChat(), ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent, DraftMark (+36 more)

### Community 46 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 47 - "utcDateTime"
Cohesion: 0.18
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.19
Nodes (17): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+9 more)

### Community 49 - "sandbox-partner-report.ts"
Cohesion: 0.11
Nodes (29): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+21 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 51 - "web/package.json"
Cohesion: 0.09
Nodes (19): @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words, name, private, type (+11 more)

### Community 52 - "DeliverPanel.tsx"
Cohesion: 0.11
Nodes (26): addFile(), checksUrl(), fileUrl(), getDeliveryChecks(), isChecks(), isFile(), isReading(), listFiles() (+18 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.10
Nodes (31): publishingBus(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+23 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (20): at(), source(), key(), `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `delivery_checks`: the seller's pre-delivery checks, `dispute_checks`: each check of the seller's disputes (+12 more)

### Community 55 - "appeal-items.ts"
Cohesion: 0.20
Nodes (11): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, ADDED_BY (+3 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (52): DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS (+44 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (56): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), dated() (+48 more)

### Community 59 - "mcp.ts"
Cohesion: 0.17
Nodes (16): checkMcp(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL, sseTransport() (+8 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (32): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+24 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "Insights.tsx"
Cohesion: 0.20
Nodes (13): count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep(), look() (+5 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "errors.ts"
Cohesion: 0.10
Nodes (21): dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest (+13 more)

### Community 68 - "testSpec"
Cohesion: 0.05
Nodes (58): councilDeps(), isRankingRequest(), model(), db, isRanking(), member(), ReviewView, View (+50 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.13
Nodes (22): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+14 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "message-reviews.ts"
Cohesion: 0.17
Nodes (12): failMessageReview(), failRunningMessageReviews(), finishMessageReview(), listMessageReviews(), MAX_REVIEWS_PER_DEAL, MessageReviewRecord, ReviewNotAllowedError, ReviewRefusal (+4 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, ag-grid-community, ag-grid-react, ag-studio, ag-studio-react, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/delivery-check (+6 more)

### Community 74 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 75 - "IntakePanel.tsx"
Cohesion: 0.20
Nodes (14): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+6 more)

### Community 76 - "theme.ts"
Cohesion: 0.31
Nodes (8): isDark(), nextTheme(), ORDER, readTheme(), savedTheme(), Theme, now(), useDark()

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

### Community 81 - "chat-api.ts"
Cohesion: 0.07
Nodes (58): StepView, chatUrl(), ChatView, getChat(), getPastedChats(), isChat(), isMessage(), isNotification() (+50 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.10
Nodes (54): appealApplies(), appealFacts(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS (+46 more)

### Community 83 - "paypal/src/index.ts"
Cohesion: 0.11
Nodes (21): EvidenceFileError, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf, Actor (+13 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.11
Nodes (18): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+10 more)

### Community 86 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 87 - "dispute-email.ts"
Cohesion: 0.47
Nodes (9): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), DisputeEmailFacts, disputeOpenedEmail(), disputeReminderEmail(), email() (+1 more)

### Community 88 - "live-hub.ts"
Cohesion: 0.09
Nodes (19): BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal() (+11 more)

### Community 89 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "milestone-routes.ts"
Cohesion: 0.08
Nodes (35): DealLookup, ChangeOrderRouteOptions, attachmentHeader(), sendCheckedFile(), sendDownload(), CHECK_INTERVAL_MS, MilestoneRouteOptions, paypalProblem() (+27 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.12
Nodes (28): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+20 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 95 - "DealPage.tsx"
Cohesion: 0.10
Nodes (31): checkLedger(), getDeal(), getLedger(), getMe(), isDeal(), isEntry(), LedgerCheck, listDeals() (+23 more)

### Community 96 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 97 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "linked-apps.test.ts"
Cohesion: 0.07
Nodes (43): signedPayPal(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), SELLER_APP_PATH, sellerAppView (+35 more)

### Community 101 - "runCouncil"
Cohesion: 0.09
Nodes (43): MESSAGE_PROMPT_VERSIONS, MessageJob, markedPrompt(), buildLookMessages(), LOOK_PROMPT_VERSION, LookPrompt, userMessage(), AnswerRefusal (+35 more)

### Community 102 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 103 - "draft-job.ts"
Cohesion: 0.13
Nodes (20): councilRecordOf(), beginDraft(), CouncilRecord, councilRecordSchema, isUnranked(), two, toCouncilRecord(), usage (+12 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 106 - "Decisions"
Cohesion: 0.40
Nodes (5): AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 107 - "checker.ts"
Cohesion: 0.14
Nodes (11): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+3 more)

### Community 109 - "seller"
Cohesion: 0.31
Nodes (9): seller(), `acceptances`: signed agreements, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `ledger_entries`: the evidence log, Engineering, candidates(), link() (+1 more)

### Community 110 - "db/src/migrate.ts"
Cohesion: 0.31
Nodes (10): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+2 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "council"
Cohesion: 0.29
Nodes (7): title(), draft(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, council(), deps()

### Community 115 - "timeline-routes.ts"
Cohesion: 0.18
Nodes (23): sendTimelineReminders(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), overviewOf(), money(), scopeTerms() (+15 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 119 - "render.ts"
Cohesion: 0.05
Nodes (45): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), dependencies, pdf-lib, zod (+37 more)

### Community 120 - "tokens.ts"
Cohesion: 0.24
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

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

### Community 129 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 130 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

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

### Community 150 - "question-routes.ts"
Cohesion: 0.16
Nodes (17): answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes(), attempt(), forward() (+9 more)

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

### Community 169 - "PactPal design system"
Cohesion: 0.15
Nodes (13): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+5 more)

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1648 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `resend-inbound.ts`, `overview-words.ts`, `sign-in-words.ts`, `vitest`, `react`, `testId`, `PayPalRestClient`, `sandbox-respond-report.ts`, `ledger/src/index.ts`, `MessagesPanel.tsx`, `ai/src/index.ts`, `deals/routes.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `AccessTokenProvider`, `dispute-actions.ts`, `claims/src/check.ts`, `email/src/index.ts`, `Database`, `council/src/index.ts`, `.query`, `words/src/index.ts`, `email/src/index.ts`, `validate.ts`, `scope-draft/src/testing.ts`, `scope-drafts.ts`, `action-routes.ts`, `packet-service.ts`, `when`, `scope-draft/src/prompt.ts`, `eval-report.ts`, `eval-scope.ts`, `scope-draft/src/index.ts`, `render-blueprint.test.ts`, `config.ts`, `DraftReview.tsx`, `utcDateTime`, `dispute-sync.ts`, `sandbox-partner-report.ts`, `sandbox-webhook-report.ts`, `DeliverPanel.tsx`, `appeal-items.ts`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `DisputeActions.tsx`, `errors.ts`, `testSpec`, `postgres.ts`, `message-reviews.ts`, `IntakePanel.tsx`, `theme.ts`, `chat-api.ts`, `paypal/src/index.ts`, `live-hub.ts`, `SellerAppPanel.tsx`, `eval-judge.ts`, `DealPage.tsx`, `log-labels.test.ts`, `linked-apps.test.ts`, `runCouncil`, `draft-job.ts`, `checker.ts`, `db/src/migrate.ts`, `package.json`, `render.ts`, `tokens.ts`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `overview-words.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12311265969802555 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `resend-inbound.ts`, `vitest`, `testId`, `deals/routes.ts`, `acceptance-routes.ts`, `ledger/src/index.ts`, `question-routes.ts`, `deals/routes.ts`, `vitest`, `dispute-actions.ts`, `question-routes.ts`, `Database`, `.query`, `scope-drafts.ts`, `action-routes.ts`, `questions.ts`, `packet-service.ts`, `db/src/index.ts`, `dispute-sync.ts`, `server/src/index.ts`, `appeal-items.ts`, `dispute-sync.ts`, `postgres.ts`, `message-reviews.ts`, `claim-job.ts`, `live-hub.ts`, `milestone-routes.ts`, `linked-apps.test.ts`, `runCouncil`, `draft-job.ts`, `db/src/migrate.ts`, `timeline-routes.ts`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `PayPalRestClient` be split into smaller, more focused modules?**
  _Cohesion score 0.10241820768136557 - nodes in this community are weakly interconnected._
- **Why does `fastify` connect `acceptance-routes.ts` to `resend-inbound.ts`, `action-routes.ts`, `vitest`, `deals/routes.ts`, `question-routes.ts`, `deals/routes.ts`, `server/package.json`, `timeline-routes.ts`, `vitest`, `claim-job.ts`, `question-routes.ts`, `Database`, `Database`, `milestone-routes.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.039414414414414414 - nodes in this community are weakly interconnected._