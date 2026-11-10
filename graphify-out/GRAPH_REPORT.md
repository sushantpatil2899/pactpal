# Graph Report - paypal-hackathon  (2026-11-09)

## Corpus Check
- 628 files · ~416,599 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 4938 nodes · 15814 edges · 159 communities (154 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 471 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa602b06`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- deals/routes.ts
- deliveries.ts
- AccessTokenProvider
- vitest
- react
- testId
- postgresContentStore
- checker.ts
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
- chat.test.ts
- db/src/disputes.ts
- claims/src/check.ts
- scope.ts
- PacketPanel.tsx
- app.ts
- council/src/index.ts
- Database
- change-orders.ts
- draft-routes.ts
- email/src/index.ts
- validate.ts
- scope-draft/src/testing.ts
- scope-drafts.ts
- action-routes.ts
- api.ts
- styles.ts
- packet-service.ts
- words/src/index.ts
- injection-runner.ts
- eval-report.ts
- Secret
- scope-draft/src/index.ts
- paypal-webhook.ts
- config.ts
- verifyStoredLedger
- DraftReview.tsx
- auth/sign-in.ts
- utcDateTime
- dispute-sync.ts
- sandbox-partner-report.ts
- sandbox-webhook-report.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- packet.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- dependencies
- DisputeActions.tsx
- services
- bus.ts
- scripts
- db/package.json
- net/src/index.ts
- eval-scope.ts
- dispute-sync.ts
- postgres.ts
- milestones.test.ts
- claims/package.json
- appeal-items.ts
- log-labels.ts
- IntakePanel.tsx
- chat-state.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- live/src/index.ts
- claim-job.ts
- paypal/src/index.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- useLiveChat.ts
- LiveHub
- resend-inbound.ts
- ai/package.json
- PaymentsPanel.tsx
- eval-judge.ts
- scripts
- ai-check-report.ts
- isObject
- live-routes.ts
- log-labels.test.ts
- email/package.json
- compilerOptions
- sellers/disputes.test.ts
- runCouncil
- Data model
- Engineering
- council/package.json
- sellerAppRoutes
- Decisions
- db/src/index.ts
- Row
- app.test.ts
- score/package.json
- PactPal product spec
- devDependencies
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
- .prettierrc.json
- Landing page (/ when signed out)
- engines
- PactPal design system
- PayPalRestClient

## God Nodes (most connected - your core abstractions)
1. `vitest` - 190 edges
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

## Communities (159 total, 5 thin omitted)

### Community 0 - "deals/routes.ts"
Cohesion: 0.09
Nodes (41): listQuery, NotificationRouteOptions, notificationRoutes(), readRequest, dealAccess(), visibleDeal(), requireViewer(), changeOrderRoutes() (+33 more)

### Community 1 - "deliveries.ts"
Cohesion: 0.09
Nodes (32): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+24 more)

### Community 2 - "AccessTokenProvider"
Cohesion: 0.13
Nodes (17): Config, TaskWiring, APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers() (+9 more)

### Community 3 - "vitest"
Cohesion: 0.03
Nodes (144): db, SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+136 more)

### Community 4 - "react"
Cohesion: 0.05
Nodes (66): AcceptanceDocument(), AcceptanceDocument, LinkProblem, Me, redeemLink(), ScopeTerms, SIGN_IN_PATH, signOut() (+58 more)

### Community 5 - "testId"
Cohesion: 0.04
Nodes (89): addCard(), signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+81 more)

### Community 6 - "postgresContentStore"
Cohesion: 0.10
Nodes (35): afterQuery, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, dealParams, FoundDeal (+27 more)

### Community 7 - "checker.ts"
Cohesion: 0.12
Nodes (13): BUTTON_WINDOW_MS, checkKey(), CheckRequest, DisputeChecker, renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+5 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (44): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), documentFor(), fingerprinted(), money (+36 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (84): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+76 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (80): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+72 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (57): addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+49 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.10
Nodes (34): checkLedger(), checkMessage(), getDeal(), getMe(), getMessages(), isMessages(), LedgerCheck, MessageReviewView (+26 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.08
Nodes (43): featureAnswers(), step(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), looks(), LookResult (+35 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (44): ClaimJobDeps, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+36 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.08
Nodes (51): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+43 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (41): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList (+33 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.08
Nodes (55): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+47 more)

### Community 18 - "server/package.json"
Cohesion: 0.07
Nodes (29): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+21 more)

### Community 19 - "chat.test.ts"
Cohesion: 0.07
Nodes (29): MAX_MESSAGES_PER_DEAL, MESSAGE_PAGE_SIZE, READ_LOG_INTERVAL_MS, readPositions(), db, dealWithMessages(), readEntries(), db (+21 more)

### Community 20 - "db/src/disputes.ts"
Cohesion: 0.13
Nodes (16): actionList, checkRow, DISPUTE_CHECK_SOURCES, DISPUTE_MATCHES, disputeChanges, DisputeCheckResult, DisputeEvent, disputeLinkSchema (+8 more)

### Community 21 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (27): ClaimText, linesOf(), AGREEMENT, CLAIM, context, ENTRIES, MAYA, PAYPAL (+19 more)

### Community 22 - "scope.ts"
Cohesion: 0.07
Nodes (26): at(), db, ORDERING, proposed(), signature(), SIGNED, buyerProvidesSchema, checkedScopeContentSchema (+18 more)

### Community 23 - "PacketPanel.tsx"
Cohesion: 0.11
Nodes (26): buildPacket(), disputesUrl(), draftSummary(), fileUrl(), getPacketView(), getSummaries(), isBuiltPacket(), isPacketView() (+18 more)

### Community 24 - "app.ts"
Cohesion: 0.10
Nodes (24): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+16 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (47): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+39 more)

### Community 26 - "Database"
Cohesion: 0.08
Nodes (42): ChatBus, Card, DealCards, HubOptions, LivePage, Online, PageState, Notifier (+34 more)

### Community 27 - "change-orders.ts"
Cohesion: 0.03
Nodes (132): disputedDeal(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+124 more)

### Community 28 - "draft-routes.ts"
Cohesion: 0.12
Nodes (26): CHAT_TRANSCRIPT_PREFIX, readBody(), sendRefusal(), decoder, draftParams, draftRoutes(), beginDraft(), sourceFile() (+18 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.08
Nodes (31): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError (+23 more)

### Community 30 - "validate.ts"
Cohesion: 0.12
Nodes (28): allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, UNCLEAR_CATEGORY, amountQuoted(), categoryProblems(), citationProblem(), collectCitations() (+20 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (35): build(), input, numbered, DraftStepKind, EvalCase, linesOf(), baseLines(), BLOCKED_OR_UNCLEAR (+27 more)

### Community 32 - "scope-drafts.ts"
Cohesion: 0.08
Nodes (33): withReadyDraft(), forwardInterruptedQuestions(), MAX_QUESTIONS_PER_DEAL, ANSWER, at(), awaiting(), db, SHA (+25 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.05
Nodes (70): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+62 more)

### Community 34 - "api.ts"
Cohesion: 0.05
Nodes (78): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), AnswerOptionView (+70 more)

### Community 35 - "styles.ts"
Cohesion: 0.11
Nodes (32): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftResponse(), draftStatement(), getAppeal(), getResponses() (+24 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.12
Nodes (35): attachmentHeader(), sendCheckedFile(), sendDownload(), reviewView(), packetFilename(), packetMeter(), pdfNameOf(), planExhibits() (+27 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.10
Nodes (40): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), DisputesView, getClaimAnalyses() (+32 more)

### Community 38 - "injection-runner.ts"
Cohesion: 0.17
Nodes (20): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), JsonSchema (+12 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.12
Nodes (33): councilDeps(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed() (+25 more)

### Community 40 - "Secret"
Cohesion: 0.11
Nodes (12): linkBody, SELLER_APP_PATH, SellerAppLinking, sellerAppView, ConnectApp, inbox(), SecretBox, SecretBoxKeyError (+4 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (47): RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, HIDDEN_LINE_TEXT (+39 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.12
Nodes (19): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+11 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (28): ModelCheck, result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES (+20 more)

### Community 44 - "verifyStoredLedger"
Cohesion: 0.07
Nodes (48): db, dealWithBuyer(), maya, report, db, later, newId(), sellerWithDeal() (+40 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (50): dateTime(), receiptBlocks(), ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark (+42 more)

### Community 46 - "auth/sign-in.ts"
Cohesion: 0.13
Nodes (20): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+12 more)

### Community 47 - "utcDateTime"
Cohesion: 0.17
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+15 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.17
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 49 - "sandbox-partner-report.ts"
Cohesion: 0.08
Nodes (39): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+31 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.07
Nodes (30): DisputeReader, LinkedDisputeAccount, parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations() (+22 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (33): dependencies, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words (+25 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.08
Nodes (41): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+33 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.11
Nodes (30): publishingBus(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+22 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.08
Nodes (31): at(), source(), key(), seller(), draft(), `acceptances`: signed agreements, `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1) (+23 more)

### Community 55 - "packet.ts"
Cohesion: 0.13
Nodes (20): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+12 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (53): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile, CheckLine (+45 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (55): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), ScopeInput (+47 more)

### Community 59 - "mcp.ts"
Cohesion: 0.09
Nodes (32): APP_KEYS, PayPalApp, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS (+24 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (26): EventType, Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus (+18 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.17
Nodes (27): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+19 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "bus.ts"
Cohesion: 0.15
Nodes (12): Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), CHAT_CHANNEL, ChatEvent (+4 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "net/src/index.ts"
Cohesion: 0.06
Nodes (54): ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+46 more)

### Community 68 - "eval-scope.ts"
Cohesion: 0.11
Nodes (23): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), isRankingRequest(), councilClients(), clients (+15 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.12
Nodes (31): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+23 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "milestones.test.ts"
Cohesion: 0.21
Nodes (13): db, payments(), sentStage(), markInvoicePaid(), markInvoiceSent(), MilestoneNotAllowedError, refuse(), stageRow() (+5 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "appeal-items.ts"
Cohesion: 0.16
Nodes (14): appealGaps(), missingFromPacket(), AlreadySent, appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId(), HeldDocument (+6 more)

### Community 74 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 75 - "IntakePanel.tsx"
Cohesion: 0.20
Nodes (14): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+6 more)

### Community 76 - "chat-state.ts"
Cohesion: 0.23
Nodes (13): ChatView, ChatAction, chatReducer(), ChatState, Connection, initialChat, onFrame(), PendingMessage (+5 more)

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

### Community 81 - "live/src/index.ts"
Cohesion: 0.25
Nodes (13): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+5 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.12
Nodes (46): appealApplies(), appealFacts(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS (+38 more)

### Community 83 - "paypal/src/index.ts"
Cohesion: 0.11
Nodes (21): EvidenceFileError, PayPalApiError, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf (+13 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.11
Nodes (18): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+10 more)

### Community 86 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 87 - "useLiveChat.ts"
Cohesion: 0.27
Nodes (10): chatUrl(), getChat(), liveUrl(), postChat(), lastSeq(), reconnectDelay(), LiveChat, useLiveChat() (+2 more)

### Community 88 - "LiveHub"
Cohesion: 0.18
Nodes (5): BusSignal, LiveHub, warn(), LiveRouteOptions, ServerFrame

### Community 89 - "resend-inbound.ts"
Cohesion: 0.24
Nodes (9): envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), ENTITIES, entity(), htmlToText() (+1 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "PaymentsPanel.tsx"
Cohesion: 0.30
Nodes (11): checkPayments(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, sendInvoice(), StageView, PaymentsPanel() (+3 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.11
Nodes (30): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+22 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "ai-check-report.ts"
Cohesion: 0.43
Nodes (6): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), summarizeOutcome(), spec

### Community 95 - "isObject"
Cohesion: 0.06
Nodes (68): addBuyer(), addPastedChat(), createDeal(), DealFile, DealSummary, draftFrom(), draftsUrl(), DraftView (+60 more)

### Community 96 - "live-routes.ts"
Cohesion: 0.39
Nodes (6): liveQuery, liveRoutes(), check(), originAllowed(), rawText(), rateLimiter()

### Community 97 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "sellers/disputes.test.ts"
Cohesion: 0.10
Nodes (32): signedPayPal(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode, apps(), box, CONNECTION, db (+24 more)

### Community 101 - "runCouncil"
Cohesion: 0.08
Nodes (46): DraftJob, MESSAGE_PROMPT_VERSIONS, MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis() (+38 more)

### Community 102 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 103 - "Engineering"
Cohesion: 0.13
Nodes (20): councilRecordOf(), draftCategories, CouncilRecord, councilRecordSchema, isUnranked(), two, toCouncilRecord(), usage (+12 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "sellerAppRoutes"
Cohesion: 0.60
Nodes (6): paypalUnavailable(), sellerAppRoutes(), registerAlerts(), removeAlerts(), sellerWebhookUrl(), setOwnAppWebhook()

### Community 106 - "Decisions"
Cohesion: 0.40
Nodes (5): AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 107 - "db/src/index.ts"
Cohesion: 0.03
Nodes (118): ScopeChange, ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord (+110 more)

### Community 109 - "Row"
Cohesion: 0.29
Nodes (6): Row, createTestDatabase(), Engine, queryOn(), TestDatabase, useTestDatabase()

### Community 110 - "app.test.ts"
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

### Community 115 - "timeline-routes.ts"
Cohesion: 0.18
Nodes (27): sendTimelineReminders(), view(), changeView(), dealCompleteness(), judgedScope(), completenessRoutes(), OVERVIEW_LIMIT, overviewOf() (+19 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 119 - "render.ts"
Cohesion: 0.06
Nodes (40): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+32 more)

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

### Community 150 - "change-order-routes.ts"
Cohesion: 0.13
Nodes (21): ACCEPTANCE_NOTICE_VERSION, acceptBody, changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256 (+13 more)

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

### Community 174 - "PayPalRestClient"
Cohesion: 0.07
Nodes (28): PayPalBuyerTestActions, dollar, setup(), PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback (+20 more)

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1630 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `deliveries.ts`, `AccessTokenProvider`, `react`, `testId`, `checker.ts`, `acceptance-routes.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `deals/routes.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `chat.test.ts`, `claims/src/check.ts`, `scope.ts`, `PacketPanel.tsx`, `app.ts`, `council/src/index.ts`, `change-orders.ts`, `email/src/index.ts`, `validate.ts`, `scope-draft/src/testing.ts`, `scope-drafts.ts`, `api.ts`, `words/src/index.ts`, `injection-runner.ts`, `eval-report.ts`, `Secret`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `verifyStoredLedger`, `DraftReview.tsx`, `PayPalRestClient`, `utcDateTime`, `dispute-sync.ts`, `sandbox-partner-report.ts`, `sandbox-webhook-report.ts`, `DeliveriesPanel.tsx`, `packet.ts`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `bus.ts`, `net/src/index.ts`, `eval-scope.ts`, `postgres.ts`, `milestones.test.ts`, `appeal-items.ts`, `IntakePanel.tsx`, `chat-state.ts`, `live/src/index.ts`, `paypal/src/index.ts`, `build.js`, `resend-inbound.ts`, `eval-judge.ts`, `ai-check-report.ts`, `log-labels.test.ts`, `sellers/disputes.test.ts`, `runCouncil`, `Engineering`, `db/src/index.ts`, `app.test.ts`, `package.json`, `render.ts`, `tokens.ts`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `deals/routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09065679925994449 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `deals/routes.ts`, `deliveries.ts`, `AccessTokenProvider`, `vitest`, `testId`, `postgresContentStore`, `acceptance-routes.ts`, `ledger/src/index.ts`, `question-routes.ts`, `ai/src/index.ts`, `deals/routes.ts`, `chat.test.ts`, `db/src/disputes.ts`, `change-order-routes.ts`, `scope.ts`, `app.ts`, `change-orders.ts`, `draft-routes.ts`, `scope-drafts.ts`, `action-routes.ts`, `packet-service.ts`, `Secret`, `verifyStoredLedger`, `auth/sign-in.ts`, `dispute-sync.ts`, `sandbox-webhook-report.ts`, `server/src/index.ts`, `bus.ts`, `dispute-sync.ts`, `postgres.ts`, `appeal-items.ts`, `claim-job.ts`, `resend-inbound.ts`, `sellers/disputes.test.ts`, `runCouncil`, `Engineering`, `db/src/index.ts`, `Row`, `app.test.ts`, `timeline-routes.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `deliveries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08907563025210084 - nodes in this community are weakly interconnected._
- **Why does `fastify` connect `postgresContentStore` to `deals/routes.ts`, `vitest`, `acceptance-routes.ts`, `question-routes.ts`, `deals/routes.ts`, `server/package.json`, `change-order-routes.ts`, `app.ts`, `Database`, `draft-routes.ts`, `action-routes.ts`, `packet-service.ts`, `Secret`, `paypal-webhook.ts`, `auth/sign-in.ts`, `claim-job.ts`, `resend-inbound.ts`, `live-routes.ts`, `timeline-routes.ts`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Should `AccessTokenProvider` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._