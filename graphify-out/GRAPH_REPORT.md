# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 607 files · ~409,271 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 4864 nodes · 15676 edges · 169 communities (148 shown, 21 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02fb8e7b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dispute-actions.ts
- buildApp
- Secret
- readLedger
- PayPalRestClient
- .query
- api.ts
- testId
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- DealPage.tsx
- question-routes.ts
- ai/src/index.ts
- routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- dependencies
- sellers/disputes.test.ts
- delivery-routes.ts
- qa/src/index.ts
- receipt.ts
- QuestionsPanel.tsx
- routes.ts
- council/src/index.ts
- Database
- db/src/index.ts
- DisputePage.tsx
- claim-analyses.ts
- react
- scope-draft/src/testing.ts
- scope-drafts.ts
- action-routes.ts
- appendLedgerEvent
- timeline-progress.ts
- packet-service.ts
- words/src/index.ts
- db/src/testing.ts
- eval-report.ts
- paypal/src/index.ts
- scope-draft/src/index.ts
- paypal-webhook.ts
- config.ts
- testId
- DraftReview.tsx
- claims.test.ts
- utcDateTime
- readChecked
- instruction-lines.test.ts
- disputes/test-support.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- AccessTokenProvider
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- auth/sign-in.ts
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-draft/src/council-task.ts
- validate.ts
- notices.ts
- postgres.test.ts
- live-hub.ts
- claims/package.json
- readLedger
- invoices.ts
- pdf/package.json
- dispute-view.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- db/src/migrate.ts
- client.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- council-record.ts
- @fastify/helmet
- packets.ts
- ai/package.json
- parseJsonReply
- eval-judge.ts
- scripts
- sandbox-webhook-report.ts
- @pactpal/live@workspace:*
- server/package.json
- render.ts
- email/package.json
- compilerOptions
- confirmation.ts
- DealPage.tsx
- App.tsx
- deals.ts
- council/package.json
- eval-scope.ts
- MessagesPanel.tsx
- sandbox-check.ts
- @pactpal/watcher@workspace:*
- change-order-routes.ts
- vitest
- score/package.json
- PactPal product spec
- devDependencies
- injection-report.ts
- resend-inbound.test.ts
- Engineering standards
- package.json
- dispute-sync.ts
- @fastify/websocket
- @pactpal/delivery-check@workspace:*
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- listQuestions
- @pactpal/paypal@workspace:*
- pg@^8.23.1
- @pactpal/ai@workspace:*
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
- @pactpal/ledger@workspace:*
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- @pactpal/pdf@workspace:*
- Scope
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- @pactpal/scope-draft@workspace:*
- @pactpal/timeline@workspace:*
- zod@^4.6.7
- @pactpal/qa@workspace:*
- @pactpal/score@workspace:*
- @pactpal/words@workspace:*

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

## Communities (169 total, 21 thin omitted)

### Community 0 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (24): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+16 more)

### Community 1 - "buildApp"
Cohesion: 0.10
Nodes (26): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+18 more)

### Community 2 - "Secret"
Cohesion: 0.05
Nodes (66): ClientOptions, ResendEmailSender, ResendOptions, message, sender(), json(), network(), defaultHttpDeps (+58 more)

### Community 3 - "readLedger"
Cohesion: 0.05
Nodes (74): chatDeal(), db, MessageBody, savedDeal(), db, ORDERING, OrderView, signedDeal() (+66 more)

### Community 4 - "PayPalRestClient"
Cohesion: 0.06
Nodes (35): openedDispute, PayPalBuyerTestActions, searchTime(), dollar, setup(), transactionList, MAX_DISPUTE_PAGES, accepted (+27 more)

### Community 5 - ".query"
Cohesion: 0.05
Nodes (67): waitingChange(), AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+59 more)

### Community 6 - "api.ts"
Cohesion: 0.04
Nodes (96): analysesUrl(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus, compareClaim() (+88 more)

### Community 7 - "testId"
Cohesion: 0.08
Nodes (34): signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer (+26 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (50): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent() (+42 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (86): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+78 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.10
Nodes (51): Prepared, PacketFacts, AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION (+43 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.07
Nodes (59): DISPUTE_EVENT_PREFIX, addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactIntegrityError, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+51 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.10
Nodes (33): ChatView, liveUrl(), ChatAction, chatReducer(), ChatState, Connection, initialChat, lastSeq() (+25 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.06
Nodes (70): CHAT_TRANSCRIPT_PREFIX, LiveRouteOptions, DealLookup, featureAnswers(), readBody(), sendRefusal(), checkBody, checkView() (+62 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.11
Nodes (30): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, attempt() (+22 more)

### Community 15 - "routes.ts"
Cohesion: 0.07
Nodes (56): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+48 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.08
Nodes (33): send(), `buyer_questions`: questions about the agreement before signing, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails, DisputeList (+25 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (76): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+68 more)

### Community 18 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/council@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:* (+10 more)

### Community 19 - "sellers/disputes.test.ts"
Cohesion: 0.07
Nodes (47): fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), linkBody, paypalUnavailable(), SELLER_APP_PATH (+39 more)

### Community 20 - "delivery-routes.ts"
Cohesion: 0.08
Nodes (40): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+32 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.07
Nodes (54): DraftJob, MESSAGE_PROMPT_VERSIONS, MessageJob, checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS (+46 more)

### Community 22 - "receipt.ts"
Cohesion: 0.18
Nodes (13): acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), ReceiptIntegrityError (+5 more)

### Community 23 - "QuestionsPanel.tsx"
Cohesion: 0.12
Nodes (30): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion() (+22 more)

### Community 24 - "routes.ts"
Cohesion: 0.10
Nodes (37): chatRoutes(), liveQuery, liveRoutes(), check(), originAllowed(), rawText(), rateLimiter(), dealAccess() (+29 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (44): Engineering, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+36 more)

### Community 26 - "Database"
Cohesion: 0.15
Nodes (15): DealCards, ReminderDeps, AcceptanceRouteOptions, ChangeOrderRouteOptions, DeliveryRouteOptions, MilestoneRouteOptions, TimelineRouteOptions, DisputeSyncDeps (+7 more)

### Community 27 - "db/src/index.ts"
Cohesion: 0.04
Nodes (79): sentStage(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+71 more)

### Community 28 - "DisputePage.tsx"
Cohesion: 0.12
Nodes (36): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+28 more)

### Community 29 - "claim-analyses.ts"
Cohesion: 0.05
Nodes (42): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+34 more)

### Community 30 - "react"
Cohesion: 0.10
Nodes (38): AppealCheckView, AppealView, checkAppeal(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, draftResponse() (+30 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (32): draftCategories, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced() (+24 more)

### Community 32 - "scope-drafts.ts"
Cohesion: 0.10
Nodes (29): checkedDraft(), countRow, DraftIntegrityError, DraftNotAllowedError, DraftRecord, DraftRefusal, draftRow, DraftStateError (+21 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.10
Nodes (37): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+29 more)

### Community 34 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (74): forward(), settle(), Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms (+66 more)

### Community 35 - "timeline-progress.ts"
Cohesion: 0.15
Nodes (14): dealIdRow, EVENT_FOR, fileRef, filesOf(), NewReminder, NewStepUpdate, recordStepUpdate(), reminderSchema (+6 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (43): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+35 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.08
Nodes (42): AcceptanceDocument, checkPayments(), DraftCategory, getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, sendInvoice() (+34 more)

### Community 38 - "db/src/testing.ts"
Cohesion: 0.06
Nodes (45): db, listMessages(), db, refusal(), db, disputed(), db, store (+37 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (29): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+21 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (34): DisputeActionNotAllowed, EvidenceFileError, PayPalErrorDetail, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES (+26 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.10
Nodes (27): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, citation, citations (+19 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.13
Nodes (15): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+7 more)

### Community 43 - "config.ts"
Cohesion: 0.11
Nodes (24): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+16 more)

### Community 44 - "testId"
Cohesion: 0.05
Nodes (56): db, dealWithBuyer(), db, newDeal, sellerDeal(), setup(), signedIn(), `change_orders`: changes to a signed agreement (+48 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (36): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftContent, DraftMark, DraftView, ScopeInput (+28 more)

### Community 46 - "claims.test.ts"
Cohesion: 0.07
Nodes (28): context, GOOD, input, ITEMS, RECORD, AGREEMENT, CLAIM, context (+20 more)

### Community 47 - "utcDateTime"
Cohesion: 0.06
Nodes (61): createIntakeDeal(), intakeFilename(), answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail() (+53 more)

### Community 48 - "readChecked"
Cohesion: 0.10
Nodes (33): addBuyer(), addFile(), addPastedChat(), DealFile, draftsUrl(), errorMessage(), fileUrl(), getDraftById() (+25 more)

### Community 49 - "instruction-lines.test.ts"
Cohesion: 0.11
Nodes (23): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, linesOf(), GIFT_CARD_CHAT, findInstructionLines(), HIDDEN_LINE_TEXT (+15 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.11
Nodes (27): inProcessChecker(), AnalysesView, db, disputedDeal(), disputeRoutes(), db, DisputesView, paidDeal() (+19 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.11
Nodes (36): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+28 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.05
Nodes (51): publishingBus(), Config, log, BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), renderWorkflowChecker() (+43 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.05
Nodes (53): review(), paid(), at(), source(), key(), seller(), draft(), unchanged() (+45 more)

### Community 55 - "AccessTokenProvider"
Cohesion: 0.12
Nodes (19): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), disputes (+11 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.07
Nodes (45): CheckedFile, CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, IMAGE (+37 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (54): Notifier, sendTimelineReminders(), money(), scopeTerms(), scopeView(), stepTerms(), REFUSALS, stageFacts() (+46 more)

### Community 59 - "mcp.ts"
Cohesion: 0.15
Nodes (18): checkAsSellerApp(), checkMcp(), checks, message(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory (+10 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "auth/sign-in.ts"
Cohesion: 0.09
Nodes (39): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+31 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.15
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+20 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.07
Nodes (66): AlreadySent, appealApplies(), appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS (+58 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @pactpal/ledger@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13, @types/node@^22.10.2 (+17 more)

### Community 67 - "scope-draft/src/council-task.ts"
Cohesion: 0.17
Nodes (16): JsonSchema, RANK_CRITERIA, ScopeDraftTask, buildScopeDraftMessages(), listOf(), SCOPE_DRAFT_PROMPT_VERSION, ScopeDraftPrompt, ScopeDraftPromptInput (+8 more)

### Community 68 - "validate.ts"
Cohesion: 0.18
Nodes (22): Citation, draftTimelineOf(), amountQuoted(), categoryProblems(), citationProblem(), collectCitations(), invalid(), listCitations() (+14 more)

### Community 69 - "notices.ts"
Cohesion: 0.13
Nodes (23): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+15 more)

### Community 70 - "postgres.test.ts"
Cohesion: 0.05
Nodes (34): Queryable, Row, CATEGORY_IDS, DEAL_CURRENCIES, currentIntakeKey(), findIntakeKey(), IntakeKey, IntakeKind (+26 more)

### Community 71 - "live-hub.ts"
Cohesion: 0.06
Nodes (31): BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db (+23 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "readLedger"
Cohesion: 0.07
Nodes (33): ACCEPTANCE_NOTICE, db, Card, db, send(), signedDeal(), types(), View (+25 more)

### Community 74 - "invoices.ts"
Cohesion: 0.12
Nodes (20): createdInvoice, DraftInvoice, invoiceDetails, InvoiceDraft, invoiceNote(), InvoiceSendError, PayPalInvoices, route() (+12 more)

### Community 75 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 76 - "dispute-view.ts"
Cohesion: 0.12
Nodes (19): CHECK_INTERVAL_MS, DisputeChecker, disputeOf(), disputeParams, checkView(), disputeParams, DisputeRouteOptions, disputeFieldsOf() (+11 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (24): Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+16 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.11
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/ledger@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 81 - "testSpec"
Cohesion: 0.07
Nodes (39): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), clients() (+31 more)

### Community 82 - "db/src/migrate.ts"
Cohesion: 0.14
Nodes (18): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus() (+10 more)

### Community 83 - "client.ts"
Cohesion: 0.09
Nodes (18): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode(), reply (+10 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @pactpal/ledger (+11 more)

### Community 86 - "build.js"
Cohesion: 0.12
Nodes (9): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+1 more)

### Community 87 - "council-record.ts"
Cohesion: 0.14
Nodes (18): councilRecordOf(), CouncilRecord, councilRecordSchema, isUnranked(), two, usage, categoryLabels, describeDraft() (+10 more)

### Community 89 - "packets.ts"
Cohesion: 0.12
Nodes (15): ContentMismatchError, contentRow, ContentStore, EvidencePacket, listPackets(), MAX_PACKETS_PER_DISPUTE, NewPacket, newPacketSchema (+7 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "parseJsonReply"
Cohesion: 0.11
Nodes (27): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+19 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.23
Nodes (17): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+9 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.12
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 96 - "server/package.json"
Cohesion: 0.19
Nodes (13): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, @types/node, name, private (+5 more)

### Community 97 - "render.ts"
Cohesion: 0.10
Nodes (22): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, breakWord(), CharacterSet, columnWidths() (+14 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "confirmation.ts"
Cohesion: 0.27
Nodes (10): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+2 more)

### Community 101 - "DealPage.tsx"
Cohesion: 0.07
Nodes (52): checkLedger(), getDeal(), getMe(), LedgerCheck, LedgerEntryView, StepView, chatUrl(), getChat() (+44 more)

### Community 102 - "App.tsx"
Cohesion: 0.09
Nodes (27): getSellerApp(), LinkProblem, linkSellerApp(), Me, redeemLink(), SellerAppLink, SellerAppProblem, SellerAppState (+19 more)

### Community 103 - "deals.ts"
Cohesion: 0.10
Nodes (27): AddBuyer, addBuyer(), addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, DEAL_CATEGORIES, DEAL_KINDS, DealCategory (+19 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-scope.ts"
Cohesion: 0.23
Nodes (12): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), formatErrors(), councilClients() (+4 more)

### Community 106 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 107 - "sandbox-check.ts"
Cohesion: 0.25
Nodes (11): APP_KEYS, PayPalApp, result, APP_LABELS, appSection(), formatSandboxReport(), LoginCheck, MCP_TEST_TOOL (+3 more)

### Community 109 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (34): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody (+26 more)

### Community 110 - "vitest"
Cohesion: 0.27
Nodes (9): db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page(), db, NoteBody (+1 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "injection-report.ts"
Cohesion: 0.31
Nodes (7): councilFailures(), counts(), formatInjectionReport(), InjectionRun, models(), RESULTS, RunRecord

### Community 115 - "resend-inbound.test.ts"
Cohesion: 0.33
Nodes (5): RESEND_INBOUND_PATH, db, forwarding(), inbox(), SECRET_BYTES

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "dispute-sync.ts"
Cohesion: 0.13
Nodes (23): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+15 more)

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

### Community 128 - "listQuestions"
Cohesion: 0.50
Nodes (4): namedQuestion(), view(), questionView(), listQuestions()

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

## Knowledge Gaps
- **22 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1414 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `buildApp`, `Secret`, `readLedger`, `PayPalRestClient`, `api.ts`, `testId`, `sandbox-respond-report.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `routes.ts`, `ScopePanel.tsx`, `sellers/disputes.test.ts`, `delivery-routes.ts`, `qa/src/index.ts`, `receipt.ts`, `council/src/index.ts`, `DisputePage.tsx`, `scope-draft/src/testing.ts`, `scope-drafts.ts`, `action-routes.ts`, `packet-service.ts`, `words/src/index.ts`, `db/src/testing.ts`, `eval-report.ts`, `paypal/src/index.ts`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `testId`, `DraftReview.tsx`, `claims.test.ts`, `utcDateTime`, `readChecked`, `instruction-lines.test.ts`, `disputes/test-support.ts`, `DeliveriesPanel.tsx`, `server/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `AccessTokenProvider`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `auth/sign-in.ts`, `DisputeActions.tsx`, `claim-job.ts`, `scope-draft/src/council-task.ts`, `postgres.test.ts`, `live-hub.ts`, `readLedger`, `invoices.ts`, `testSpec`, `db/src/migrate.ts`, `client.ts`, `build.js`, `council-record.ts`, `parseJsonReply`, `sandbox-webhook-report.ts`, `render.ts`, `confirmation.ts`, `DealPage.tsx`, `App.tsx`, `MessagesPanel.tsx`, `sandbox-check.ts`, `devDependencies`, `injection-report.ts`, `resend-inbound.test.ts`, `package.json`, `dispute-sync.ts`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dispute-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11384615384615385 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `dispute-sync.ts` to `council/src/index.ts`, `timeline/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `buildApp` be split into smaller, more focused modules?**
  _Cohesion score 0.10416666666666667 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `Secret`, `PayPalRestClient`, `testId`, `acceptance-routes.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `routes.ts`, `paypal/src/disputes.ts`, `sellers/disputes.test.ts`, `Database`, `DisputePage.tsx`, `react`, `instruction-lines.test.ts`, `Built (sub-phases 2b to 6h-1)`, `claim-job.ts`, `readLedger`, `invoices.ts`, `testSpec`, `client.ts`, `council-record.ts`, `dispute-sync.ts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.04914004914004914 - nodes in this community are weakly interconnected._