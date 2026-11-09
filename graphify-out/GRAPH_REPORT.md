# Graph Report - paypal-hackathon  (2026-11-09)

## Corpus Check
- 617 files · ~412,892 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 5, .css 2, .example 1)

## Summary
- 4886 nodes · 15593 edges · 165 communities (160 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 471 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee6e5cc5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- db/src/index.ts
- .query
- Secret
- test-app.ts
- seed-sandbox.ts
- dispute-actions.ts
- api.ts
- sellers/disputes.test.ts
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- DealPage.tsx
- question-routes.ts
- ai/src/index.ts
- deals/routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- server/package.json
- app.ts
- delivery-routes.ts
- qa/src/index.ts
- testSpec
- claim-analyses.ts
- auth/sign-in.ts
- council/src/index.ts
- Database
- seller-connections.test.ts
- DraftPanel.tsx
- email/src/index.ts
- when
- scope-draft/src/testing.ts
- draft-routes.ts
- action-routes.ts
- styles.ts
- styles.ts
- packet-service.ts
- words/src/index.ts
- scope-routes.ts
- eval-report.ts
- sandbox-clients.ts
- scope-draft/src/index.ts
- app.ts
- config.ts
- db/src/testing.ts
- DraftReview.tsx
- claims.test.ts
- utcDateTime
- resend-inbound.ts
- paypal/src/index.ts
- PayPalRestClient
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
- appeal.test.ts
- delivery-checks.ts
- notices.ts
- postgres.ts
- chat-routes.ts
- claims/package.json
- appeal-items.ts
- log-labels.ts
- render.ts
- dispute-sync.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- response.test.ts
- claim-job.ts
- parseJsonReply
- scope-draft/package.json
- paypal/package.json
- build.js
- eval-scope.ts
- LiveHub
- chat-api.ts
- ai/package.json
- pdf/package.json
- eval-judge.ts
- scripts
- layouts.tsx
- chat-state.ts
- live/src/index.ts
- useLiveChat.ts
- email/package.json
- compilerOptions
- seller-connections.ts
- watcher/src/index.ts
- App.tsx
- ChatTab.tsx
- council/package.json
- parts.tsx
- dispute-routes.ts
- milestones.ts
- sellerAppRoutes
- dispute-email.ts
- db/src/migrate.ts
- score/package.json
- PactPal product spec
- devDependencies
- dependencies
- record.ts
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
- log-labels.test.ts
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
- Decisions
- Scope
- scripts
- delivery-check/src/prompt.ts
- .prettierrc.json
- Landing page (/ when signed out)
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 186 edges
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

## Communities (165 total, 5 thin omitted)

### Community 0 - "db/src/index.ts"
Cohesion: 0.04
Nodes (90): AcceptChange, CHANGE_ORDER_STATUSES, ChangeOrder, ChangeOrderRefusal, ChangeOrderStatus, DeclineChange, ProposeChange, WithdrawChange (+82 more)

### Community 1 - ".query"
Cohesion: 0.03
Nodes (144): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), AcceptanceIntegrityError, AcceptanceNotAllowedError (+136 more)

### Community 2 - "Secret"
Cohesion: 0.04
Nodes (69): bareAddress(), check, InboxNetworkError, receivedAnswer, ReceivedEmails, RESEND_RECEIVED_URL, ResendReceivedEmails, inbox() (+61 more)

### Community 3 - "test-app.ts"
Cohesion: 0.03
Nodes (147): chatDeal(), db, MessageBody, db, Card, db, savedDeal(), send() (+139 more)

### Community 4 - "seed-sandbox.ts"
Cohesion: 0.07
Nodes (39): buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions(), formatPayTimeout() (+31 more)

### Community 5 - "dispute-actions.ts"
Cohesion: 0.12
Nodes (21): actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind, DisputeActionNotAllowedError (+13 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (76): analysesUrl(), AnswerOptionView, BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus, ChangeProposal, checkMessage() (+68 more)

### Community 7 - "sellers/disputes.test.ts"
Cohesion: 0.13
Nodes (29): inProcessChecker(), disputedDeal(), db, DisputesView, paidDeal(), failureCode(), syncDisputes(), checker() (+21 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (23): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+15 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (66): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+58 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.11
Nodes (34): AppealContext, draftCouncilTask(), RecordLine, ResponseContext, ResponseDraft, buildResponseMessages(), MAX_MESSAGE_CHARS, MAX_OFFER_NOTE_CHARS (+26 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.04
Nodes (77): DISPUTE_EVENT_PREFIX, db, Artifact, ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactIntegrityError, ArtifactLimits, ArtifactRejectedError (+69 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.15
Nodes (21): checkLedger(), fileUrl(), getDeal(), getMe(), LedgerCheck, MAX_FILE_BYTES, DEAL_TABS, DealPage() (+13 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.05
Nodes (65): CHAT_TRANSCRIPT_PREFIX, DealLookup, featureAnswers(), step(), sendRefusal(), ChangeOrderRouteOptions, CompletenessRouteOptions, checkBody (+57 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.06
Nodes (48): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, ClaimJobDeps (+40 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.07
Nodes (72): listQuery, notificationRoutes(), readRequest, acceptanceRoutes(), dealAccess(), visibleDeal(), dealParams, FoundDeal (+64 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (46): InvoiceArgs, send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer (+38 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.08
Nodes (55): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+47 more)

### Community 18 - "server/package.json"
Cohesion: 0.07
Nodes (29): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+21 more)

### Community 19 - "app.ts"
Cohesion: 0.03
Nodes (86): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+78 more)

### Community 20 - "delivery-routes.ts"
Cohesion: 0.09
Nodes (31): ArtifactKind, AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile (+23 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.10
Nodes (38): MessageJob, checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText (+30 more)

### Community 22 - "testSpec"
Cohesion: 0.06
Nodes (49): isRankingRequest(), CheckView, db, FAILED, model(), shown, store, db (+41 more)

### Community 23 - "claim-analyses.ts"
Cohesion: 0.04
Nodes (60): db, disputedDeal(), FILES, GOOD, SummariesView, MAX_MESSAGES_PER_DEAL, MESSAGE_PAGE_SIZE, db (+52 more)

### Community 24 - "auth/sign-in.ts"
Cohesion: 0.07
Nodes (45): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+37 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (46): Engineering, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "Database"
Cohesion: 0.08
Nodes (41): ReceiptMailDeps, ChatBus, listeners(), memoryBus(), postgresBus(), Card, DealCards, HubOptions (+33 more)

### Community 27 - "seller-connections.test.ts"
Cohesion: 0.31
Nodes (7): `deliveries` and `delivery_files`: delivered work, startConnection(), attempt(), db, link(), newId(), SCOPES

### Community 28 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (46): addBuyer(), addFile(), addPastedChat(), DealFile, draftFrom(), draftsUrl(), errorMessage(), getDraftById() (+38 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.09
Nodes (25): RFC-2606, ENTITIES, entity(), htmlToText(), emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult (+17 more)

### Community 30 - "when"
Cohesion: 0.08
Nodes (47): buildPacket(), checkDisputes(), disputesUrl(), DisputesView, draftSummary(), getDisputePage(), getDisputes(), getPacketView() (+39 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (40): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind, EVAL_CASES (+32 more)

### Community 32 - "draft-routes.ts"
Cohesion: 0.07
Nodes (41): forwardInterruptedQuestions(), ANSWER, at(), awaiting(), db, SHA, checkedDraft(), countRow (+33 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.08
Nodes (42): reviewView(), acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+34 more)

### Community 34 - "styles.ts"
Cohesion: 0.10
Nodes (35): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+27 more)

### Community 35 - "styles.ts"
Cohesion: 0.09
Nodes (40): AppealCheckView, AppealView, checkAppeal(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, draftResponse() (+32 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.12
Nodes (26): checkPayments(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, sendInvoice(), StageView, DraftFill (+18 more)

### Community 38 - "scope-routes.ts"
Cohesion: 0.11
Nodes (25): councilDeps(), councilRecordOf(), chosenDraft(), SCOPE_REFUSALS, scopeBody, CouncilRecord, councilRecordSchema, isUnranked() (+17 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.15
Nodes (30): draftCategories, aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed() (+22 more)

### Community 40 - "sandbox-clients.ts"
Cohesion: 0.08
Nodes (30): formatErrors(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+22 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (75): JsonSchema, RankingPromptInput, allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, UNCLEAR_CATEGORY, RANK_CRITERIA, scopeDraftCouncilTask() (+67 more)

### Community 42 - "app.ts"
Cohesion: 0.13
Nodes (19): envelope, ParsedJson, parseJson(), PayPalWebhookOptions, paypalWebhookRoutes(), receive(), record(), SELLER_WEBHOOK_PATH (+11 more)

### Community 43 - "config.ts"
Cohesion: 0.06
Nodes (44): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS, appVars(), FEATURES, formatReport() (+36 more)

### Community 44 - "db/src/testing.ts"
Cohesion: 0.06
Nodes (50): db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, addCard(), db (+42 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (37): ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView, ChatLines() (+29 more)

### Community 46 - "claims.test.ts"
Cohesion: 0.18
Nodes (9): AGREEMENT, CLAIM, context, ENTRIES, MAYA, PAYPAL, RECORD, CLAIM_PROMPT_VERSION (+1 more)

### Community 47 - "utcDateTime"
Cohesion: 0.17
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 48 - "resend-inbound.ts"
Cohesion: 0.15
Nodes (21): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+13 more)

### Community 49 - "paypal/src/index.ts"
Cohesion: 0.08
Nodes (32): EvidenceFileError, PayPalErrorDetail, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf (+24 more)

### Community 50 - "PayPalRestClient"
Cohesion: 0.06
Nodes (27): Receiver, PayPalBuyerTestActions, dollar, setup(), McpFallback, PayPalOperations, partnerPath(), PayPalPartners (+19 more)

### Community 51 - "web/package.json"
Cohesion: 0.11
Nodes (17): @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words, name, private, type (+9 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.14
Nodes (29): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+21 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.09
Nodes (26): log, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, DISPUTE_TASK_NAME, jsonLines() (+18 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.07
Nodes (33): at(), source(), key(), seller(), outcome(), draft(), `acceptances`: signed agreements, `artifacts` and `file_contents`: the deal's files (+25 more)

### Community 55 - "IntakePanel.tsx"
Cohesion: 0.12
Nodes (24): createDeal(), DealOptions, getDealOptions(), getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isDeal() (+16 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.07
Nodes (51): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport() (+43 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (61): sendTimelineReminders(), messageRoutes(), revisionsOf(), workRecord(), REFUSALS, stageFacts(), stepParams, timelineRoutes() (+53 more)

### Community 59 - "mcp.ts"
Cohesion: 0.11
Nodes (23): checkMcp(), PayPalMcpError, DEFAULT_FALLBACK_POLICY, FallbackRequest, invoice, noAnswer(), setup(), setupError() (+15 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.17
Nodes (27): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+19 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.12
Nodes (32): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+24 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "appeal.test.ts"
Cohesion: 0.14
Nodes (19): AppealCheck, AppealItem, appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask(), AppealTask, RANK_CRITERIA (+11 more)

### Community 68 - "delivery-checks.ts"
Cohesion: 0.12
Nodes (17): sellerStageStep, checkedFileSchema, checkRow, DeliveryCheck, DeliveryCheckNotAllowedError, DeliveryCheckRefusal, listDeliveryChecks(), MAX_CHECKS_PER_DEAL (+9 more)

### Community 69 - "notices.ts"
Cohesion: 0.13
Nodes (22): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+14 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "chat-routes.ts"
Cohesion: 0.11
Nodes (26): afterQuery, ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, Online (+18 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "appeal-items.ts"
Cohesion: 0.19
Nodes (13): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+5 more)

### Community 74 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 75 - "render.ts"
Cohesion: 0.07
Nodes (35): Colour, Components, Do and don't, How far the world reaches, by surface, Logo, Motion, PactPal design system, Space, shape, depth (+27 more)

### Community 76 - "dispute-sync.ts"
Cohesion: 0.19
Nodes (17): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+9 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (22): Accounts and connection, AI, Disputes, Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026), Fixes for the injection findings (sub-phase 3fb, 1 November 2026) (+14 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "response.test.ts"
Cohesion: 0.15
Nodes (11): context, GOOD, input, OPTIONS, RECORD, context, GOOD, input (+3 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.29
Nodes (21): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+13 more)

### Community 83 - "parseJsonReply"
Cohesion: 0.33
Nodes (14): parseJsonReply(), tryParse(), checkAppeal(), readAppeal(), checkResponse(), readResponse(), checkStatement(), readStatement() (+6 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.11
Nodes (18): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+10 more)

### Community 86 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 87 - "eval-scope.ts"
Cohesion: 0.13
Nodes (19): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), cryptoCouncilDeps() (+11 more)

### Community 88 - "LiveHub"
Cohesion: 0.12
Nodes (8): BusSignal, Listen, db, hubOnTestDeal(), LiveHub, LivePage, LiveRouteOptions, ServerFrame

### Community 89 - "chat-api.ts"
Cohesion: 0.29
Nodes (11): StepView, chatUrl(), getChat(), getPastedChats(), isChat(), isMessage(), isPasted(), postChat() (+3 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.12
Nodes (28): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+20 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "layouts.tsx"
Cohesion: 0.31
Nodes (11): Me, Logo(), LogoMark(), Account(), AppLayout(), BuyerLayout(), Footer(), PublicLayout() (+3 more)

### Community 95 - "chat-state.ts"
Cohesion: 0.23
Nodes (12): ChatView, ChatAction, chatReducer(), Connection, initialChat, onFrame(), PendingMessage, hello (+4 more)

### Community 96 - "live/src/index.ts"
Cohesion: 0.18
Nodes (17): liveQuery, liveRoutes(), check(), originAllowed(), rawText(), bySide, chatMessageSchema, ClientFrame (+9 more)

### Community 97 - "useLiveChat.ts"
Cohesion: 0.29
Nodes (9): liveUrl(), ChatState, lastSeq(), reconnectDelay(), LiveChat, useLiveChat(), connect(), loadHistory() (+1 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "seller-connections.ts"
Cohesion: 0.24
Nodes (11): claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow, disconnectSeller(), endConnection(), first() (+3 more)

### Community 101 - "watcher/src/index.ts"
Cohesion: 0.18
Nodes (18): LABEL_WORDS, revisionNote(), messageReviewCouncilTask(), MessageReviewTask, RANK_CRITERIA, buildReviewMessages(), MESSAGE_PROMPT_VERSION, recordLines() (+10 more)

### Community 102 - "App.tsx"
Cohesion: 0.20
Nodes (15): signOut(), App(), dealPage(), initialProblem, Session, SIGN_IN_PROBLEMS, inAppPath(), LinkClick (+7 more)

### Community 103 - "ChatTab.tsx"
Cohesion: 0.31
Nodes (9): PastedChat, lastSeenByOther(), bubble(), ChatTab(), CONNECTION_WORDS, DealTab, Message(), NOTICE_TABS (+1 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "parts.tsx"
Cohesion: 0.22
Nodes (6): Alert(), Button(), ButtonLink(), Look, lookClass(), LookProps

### Community 106 - "dispute-routes.ts"
Cohesion: 0.29
Nodes (9): CHECK_INTERVAL_MS, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputePageView(), disputeSummaryView(), openedAt() (+1 more)

### Community 107 - "milestones.ts"
Cohesion: 0.12
Nodes (23): sentStage(), dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid() (+15 more)

### Community 108 - "sellerAppRoutes"
Cohesion: 0.60
Nodes (6): paypalUnavailable(), sellerAppRoutes(), registerAlerts(), removeAlerts(), sellerWebhookUrl(), setOwnAppWebhook()

### Community 109 - "dispute-email.ts"
Cohesion: 0.47
Nodes (9): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), DisputeEmailFacts, disputeOpenedEmail(), disputeReminderEmail(), email() (+1 more)

### Community 110 - "db/src/migrate.ts"
Cohesion: 0.27
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

### Community 115 - "record.ts"
Cohesion: 0.33
Nodes (9): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+1 more)

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
Cohesion: 0.15
Nodes (16): ACCEPTANCE_NOTICE, acceptanceDocument, acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT (+8 more)

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

### Community 128 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 129 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

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
Cohesion: 0.09
Nodes (38): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, documentFor(), fingerprinted(), money, acceptBody, changeOrderRoutes(), view() (+30 more)

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
Cohesion: 0.40
Nodes (5): AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 159 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 160 - "delivery-check/src/prompt.ts"
Cohesion: 0.50
Nodes (4): buildLookMessages(), LOOK_PROMPT_VERSION, LookPrompt, userMessage()

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1617 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `test-app.ts` to `db/src/index.ts`, `log-labels.test.ts`, `.query`, `Secret`, `seed-sandbox.ts`, `dispute-actions.ts`, `api.ts`, `sellers/disputes.test.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `app.ts`, `delivery-routes.ts`, `qa/src/index.ts`, `testSpec`, `claim-analyses.ts`, `change-order-routes.ts`, `council/src/index.ts`, `auth/sign-in.ts`, `seller-connections.test.ts`, `DraftPanel.tsx`, `email/src/index.ts`, `when`, `scope-draft/src/testing.ts`, `draft-routes.ts`, `action-routes.ts`, `packet-service.ts`, `words/src/index.ts`, `scope-routes.ts`, `eval-report.ts`, `sandbox-clients.ts`, `scope-draft/src/index.ts`, `app.ts`, `config.ts`, `db/src/testing.ts`, `DraftReview.tsx`, `claims.test.ts`, `utcDateTime`, `paypal/src/index.ts`, `PayPalRestClient`, `server/src/index.ts`, `IntakePanel.tsx`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `appeal.test.ts`, `delivery-checks.ts`, `postgres.ts`, `appeal-items.ts`, `render.ts`, `dispute-sync.ts`, `response.test.ts`, `eval-scope.ts`, `LiveHub`, `eval-judge.ts`, `chat-state.ts`, `live/src/index.ts`, `watcher/src/index.ts`, `App.tsx`, `milestones.ts`, `db/src/migrate.ts`, `package.json`, `receipt.ts`, `tokens.ts`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `db/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0351388079984469 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `council/src/index.ts`, `timeline/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Should `.query` be split into smaller, more focused modules?**
  _Cohesion score 0.031055900621118012 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `db/src/index.ts`, `.query`, `test-app.ts`, `dispute-actions.ts`, `sellers/disputes.test.ts`, `acceptance-routes.ts`, `ledger/src/index.ts`, `question-routes.ts`, `ai/src/index.ts`, `deals/routes.ts`, `app.ts`, `delivery-routes.ts`, `change-order-routes.ts`, `claim-analyses.ts`, `auth/sign-in.ts`, `draft-routes.ts`, `action-routes.ts`, `packet-service.ts`, `scope-routes.ts`, `db/src/testing.ts`, `resend-inbound.ts`, `timeline/src/index.ts`, `delivery-checks.ts`, `notices.ts`, `postgres.ts`, `chat-routes.ts`, `appeal-items.ts`, `dispute-sync.ts`, `claim-job.ts`, `seller-connections.ts`, `milestones.ts`, `db/src/migrate.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.04288240495137047 - nodes in this community are weakly interconnected._