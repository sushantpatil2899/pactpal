# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 708 files · ~458,514 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 17 file(s) not represented in the graph (top: .css 11, (none) 5, .example 1)

## Summary
- 5462 nodes · 17387 edges · 168 communities (162 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 503 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4ef08393`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- paypal/src/index.ts
- Database
- net/src/index.ts
- postgres.test.ts
- styles.ts
- .query
- layouts.tsx
- Secret
- seller-app.ts
- sellers/disputes.test.ts
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- scope-draft/src/index.ts
- vitest
- utcDateTime
- claim-analyses.ts
- ScopePanel.tsx
- App.tsx
- mcp.ts
- deals.ts
- qa/src/index.ts
- PayPalRestClient
- DraftReview.tsx
- dependencies
- council/src/index.ts
- acceptance.ts
- validate.ts
- DealPage.tsx
- testId
- web/src/format.ts
- scope-draft/src/testing.ts
- injection-runner.ts
- delivery-routes.ts
- DealsTable.tsx
- disputes/test-support.ts
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- dispute-sync.ts
- schema.ts
- sandbox-partner-report.ts
- config.ts
- PacketPanel.tsx
- change-order-routes.ts
- dispute-actions.ts
- paypal-webhook.ts
- paypal/src/disputes.ts
- db/src/index.ts
- vitest
- web/package.json
- Deadlines.tsx
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- delivery-routes.ts
- completeness.ts
- chain-scene.ts
- DisputeActions.tsx
- services
- db/src/migrate.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-job.ts
- questions.ts
- resend-inbound.ts
- appendLedgerEvent
- claims/package.json
- sandbox-respond-report.ts
- SellerAppPanel.tsx
- claims/src/index.ts
- Pillars.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- readLedger
- formatErrors
- milestones.ts
- scope-draft/package.json
- paypal/package.json
- claims/src/index.ts
- Landing.tsx
- products/package.json
- app.ts
- ai/package.json
- agent-requests.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- council
- MessagesPanel.tsx
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- web-pages.test.ts
- db/src/testing.ts
- render-blueprint.test.ts
- council/package.json
- eval-judge.ts
- .query
- when
- app.test.ts
- draft-job.ts
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- Phase 7 (deal space)
- Engineering standards
- package.json
- Decisions
- server/package.json
- Insights.tsx
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- dependencies
- live/src/index.ts
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
- Ledger.tsx
- confirmation.ts
- .prettierrc.json
- products/tsconfig.json
- Council.tsx
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- Scope
- vite-env.d.ts
- devDependencies
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 209 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `isObject()` - 70 edges
8. `react` - 69 edges
9. `TEST_NOW` - 66 edges
10. `Secret` - 65 edges

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

## Communities (168 total, 6 thin omitted)

### Community 0 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (40): SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem (+32 more)

### Community 1 - "Database"
Cohesion: 0.06
Nodes (52): ReceiptMailDeps, McpRouteOptions, ChatBus, Card, DealCards, HubOptions, NotificationRouteOptions, Notifier (+44 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.06
Nodes (57): Config, ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+49 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.11
Nodes (14): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgClient (+6 more)

### Community 4 - "styles.ts"
Cohesion: 0.08
Nodes (45): AnswerBox(), Revisions, revisionWords(), addFile(), addPastedChat(), approveDelivery(), checksUrl(), deliveriesUrl() (+37 more)

### Community 5 - ".query"
Cohesion: 0.04
Nodes (65): waitingChange(), `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder (+57 more)

### Community 6 - "layouts.tsx"
Cohesion: 0.11
Nodes (24): Me, IconName, PATHS, applyTheme(), isDark(), nextTheme(), ORDER, readTheme() (+16 more)

### Community 7 - "Secret"
Cohesion: 0.05
Nodes (35): RFC-2606, EmailFailure, bareAddress(), check, InboxNetworkError, ReadResult, receivedAnswer, ReceivedEmail (+27 more)

### Community 8 - "seller-app.ts"
Cohesion: 0.12
Nodes (22): APP_KEYS, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection(), formatSandboxReport() (+14 more)

### Community 9 - "sellers/disputes.test.ts"
Cohesion: 0.09
Nodes (31): db, invoiceEntries(), signedPayPal(), StageView, fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db (+23 more)

### Community 10 - "api.ts"
Cohesion: 0.04
Nodes (93): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), AgentRequestView (+85 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (65): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), DISPUTE_EVENT_PREFIX, agentBodySha256(), ARTIFACT_KINDS (+57 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.06
Nodes (84): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+76 more)

### Community 13 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (38): ChatMessage, claimLines(), linesOf(), RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, messageLines(), minuteOf() (+30 more)

### Community 14 - "vitest"
Cohesion: 0.04
Nodes (93): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, councilDeps() (+85 more)

### Community 15 - "utcDateTime"
Cohesion: 0.14
Nodes (26): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+18 more)

### Community 16 - "claim-analyses.ts"
Cohesion: 0.10
Nodes (22): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+14 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (73): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+65 more)

### Community 18 - "App.tsx"
Cohesion: 0.07
Nodes (62): AcceptanceDocument(), AcceptanceDocument, createDeal(), getDealOptions(), getMe(), LinkProblem, redeemLink(), SIGN_IN_PATH (+54 more)

### Community 19 - "mcp.ts"
Cohesion: 0.19
Nodes (13): checkMcp(), describe(), McpClientOptions, McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL, fakeServer(), setup() (+5 more)

### Community 20 - "deals.ts"
Cohesion: 0.12
Nodes (22): addBuyer, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, DEAL_KINDS, DealCategory, dealParties, dealRow (+14 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.11
Nodes (34): AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema, withoutLinePrefix(), numberedText() (+26 more)

### Community 22 - "PayPalRestClient"
Cohesion: 0.06
Nodes (35): Engineering, dollar, setup(), PayPalApiError, PayPalErrorDetail, PayPalMcpError, PayPalNetworkError, PayPalResponseError (+27 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (53): ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent, DraftMark, draftsUrl() (+45 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): ChatFailureKind, JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize() (+39 more)

### Community 26 - "acceptance.ts"
Cohesion: 0.07
Nodes (34): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError (+26 more)

### Community 27 - "validate.ts"
Cohesion: 0.11
Nodes (34): allowedCategoryIds(), TEST_CATEGORIES, paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES (+26 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.06
Nodes (65): addBuyer(), checkLedger(), checkPayments(), errorMessage(), getDeal(), getMilestones(), isDeal(), isMilestones() (+57 more)

### Community 29 - "testId"
Cohesion: 0.05
Nodes (70): REDEEM_PATH, db, setup(), CALLBACK_PATH, RETURN_COOKIE, STATE_COOKIE, db, dealWithBuyer() (+62 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.08
Nodes (44): analysesUrl(), AppealCheckView, AppealView, checkAppeal(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+36 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.13
Nodes (30): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), scopeDraftCouncilTask() (+22 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.13
Nodes (18): logProgress(), valueOrExit(), modelNames(), DroppedDraft, droppedSection(), ruleOf(), clients, parsed (+10 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (61): ACCEPTANCE_DOCUMENT_FORMAT, acceptanceDocument, documentFor(), fingerprinted(), money, view(), accessSummary(), deliveryRoutes() (+53 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.09
Nodes (43): Money, CommandPalette(), PLACES, Dashboard(), DealList(), Cell, COLUMNS, DealsTable() (+35 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.11
Nodes (30): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+22 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.11
Nodes (38): buildReceipt(), ReceiptIntegrityError, aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut (+30 more)

### Community 37 - "receipt.ts"
Cohesion: 0.12
Nodes (32): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+24 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.13
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (29): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+21 more)

### Community 40 - "dispute-sync.ts"
Cohesion: 0.07
Nodes (51): LinkedDisputeAccount, changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails (+43 more)

### Community 41 - "schema.ts"
Cohesion: 0.11
Nodes (19): DraftStepKind, EvalCase, EvalGold, linesOf(), GIFT_CARD_CHAT, ALL_MISSING_DRAFT, MAYA_CHAT, SUNRISE_CHAT (+11 more)

### Community 42 - "sandbox-partner-report.ts"
Cohesion: 0.10
Nodes (35): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+27 more)

### Community 43 - "config.ts"
Cohesion: 0.11
Nodes (24): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+16 more)

### Community 44 - "PacketPanel.tsx"
Cohesion: 0.15
Nodes (19): buildPacket(), draftSummary(), getPacketView(), getSummaries(), isBuiltPacket(), isPacketView(), isSummaries(), PacketChoice (+11 more)

### Community 45 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (31): ACCEPTANCE_NOTICE_VERSION, AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser() (+23 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (22): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+14 more)

### Community 47 - "paypal-webhook.ts"
Cohesion: 0.14
Nodes (18): envelope, ParsedJson, parseJson(), PayPalWebhookOptions, paypalWebhookRoutes(), receive(), record(), SELLER_WEBHOOK_PATH (+10 more)

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (39): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, DisputeList, DisputeMessage (+31 more)

### Community 49 - "db/src/index.ts"
Cohesion: 0.04
Nodes (85): addCard(), body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), CHAT_CHANNEL (+77 more)

### Community 50 - "vitest"
Cohesion: 0.08
Nodes (33): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+25 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (33): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+25 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.09
Nodes (34): getDisputePage(), isDisputePage(), StageView, StepView, RunningStepView, BAR_COLOURS, TODAY_LINE, addDays() (+26 more)

### Community 53 - "tools.ts"
Cohesion: 0.08
Nodes (33): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+25 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (21): key(), seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks (+13 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.08
Nodes (41): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+33 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (59): looks(), DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS (+51 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (54): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), ChangeProposal (+46 more)

### Community 59 - "delivery-routes.ts"
Cohesion: 0.05
Nodes (72): featureAnswers(), step(), FoundDeal, sendRefusal(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes() (+64 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "chain-scene.ts"
Cohesion: 0.11
Nodes (14): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+6 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.18
Nodes (26): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+18 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "db/src/migrate.ts"
Cohesion: 0.18
Nodes (15): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, migrationStatus (+7 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.13
Nodes (17): checkedDraft(), countRow, DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow, DraftStateError, failRunningDrafts() (+9 more)

### Community 68 - "claim-job.ts"
Cohesion: 0.08
Nodes (60): AlreadySent, appealApplies(), appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS (+52 more)

### Community 69 - "questions.ts"
Cohesion: 0.11
Nodes (16): AiAnswer, aiAnswerSchema, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS, forwardQuestionSchema (+8 more)

### Community 70 - "resend-inbound.ts"
Cohesion: 0.11
Nodes (26): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+18 more)

### Community 71 - "appendLedgerEvent"
Cohesion: 0.06
Nodes (73): acceptTerms, declineTerms, lockFor(), originOf(), recordReceiptSent(), requestAcceptance, setStatus(), signaturePayload() (+65 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (71): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+63 more)

### Community 74 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (44): Prepared, candidates(), parseJsonReply(), tryParse(), AppealCheck, checkAppeal(), readAppeal(), AppealTask (+36 more)

### Community 76 - "Pillars.tsx"
Cohesion: 0.27
Nodes (11): at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed(), VISUALS (+3 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (26): Moving a dispute to a verdict, Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026) (+18 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "readLedger"
Cohesion: 0.06
Nodes (35): db, db, draftedAs(), idOf(), readDraft(), store, View, disputeTypes() (+27 more)

### Community 82 - "formatErrors"
Cohesion: 0.27
Nodes (8): loadConfigOrExit(), pickModels(), selectedClientsOrExit(), formatErrors(), log, renderWorkflowChecker(), startScheduledCheck(), councilClients()

### Community 83 - "milestones.ts"
Cohesion: 0.11
Nodes (25): sentStage(), DEAL_STATUSES, DealNotFoundError, InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid() (+17 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (71): PacketFacts, MessageJob, AppealContext, APPEAL_PROMPT_VERSION, AppealItem, appealMessages(), buildAppealMessages(), checkAnalysis() (+63 more)

### Community 87 - "Landing.tsx"
Cohesion: 0.09
Nodes (32): Audience(), GLYPHS, SPOTS, Sticker(), Council(), Hero(), Ticker(), useChainScene() (+24 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "app.ts"
Cohesion: 0.04
Nodes (87): AppOptions, buildApp(), requestLog(), socketOrigin(), LinkOptions, linkRoutes(), redeemBody, backHome() (+79 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "agent-requests.ts"
Cohesion: 0.09
Nodes (34): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest(), claimAgentRequest(), lockedRequest() (+26 more)

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.06
Nodes (40): APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, DISPUTE_TASK_NAME, jsonLines(), disputeLog (+32 more)

### Community 95 - "council"
Cohesion: 0.22
Nodes (9): title(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, council() (+1 more)

### Community 96 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 97 - "render.ts"
Cohesion: 0.06
Nodes (39): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+31 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.09
Nodes (18): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), db, hubOnTestDeal() (+10 more)

### Community 101 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 102 - "db/src/testing.ts"
Cohesion: 0.07
Nodes (36): disputedDeal(), db, refusal(), AnalysisNotAllowedError, finishClaimAnalysis, startClaimAnalysis, db, disputed() (+28 more)

### Community 103 - "render-blueprint.test.ts"
Cohesion: 0.25
Nodes (6): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], PAYPAL_WEBHOOK_PATH

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 106 - ".query"
Cohesion: 0.11
Nodes (41): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), CHECK_INTERVAL_MS, OVERVIEW_LIMIT (+33 more)

### Community 107 - "when"
Cohesion: 0.09
Nodes (40): checkDisputes(), disputesUrl(), DisputesView, getDisputes(), getPastedChats(), isPasted(), PastedChat, lastSeenByOther() (+32 more)

### Community 108 - "app.test.ts"
Cohesion: 0.33
Nodes (4): closeOnSignals(), report, setup(), ConfigReport

### Community 109 - "draft-job.ts"
Cohesion: 0.20
Nodes (13): runPrepared(), draftCategories, CouncilRecord, toCouncilRecord(), toJson(), usage, DraftJob, JobLog (+5 more)

### Community 110 - "test-app.ts"
Cohesion: 0.04
Nodes (93): agentDeal(), db, mcpClient(), ToolResult, SESSION_COOKIE, chatDeal(), db, MessageBody (+85 more)

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

### Community 115 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.18
Nodes (11): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8), AI, Decisions (+3 more)

### Community 119 - "server/package.json"
Cohesion: 0.06
Nodes (32): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+24 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.11
Nodes (26): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+18 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

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

### Community 129 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 130 - "live/src/index.ts"
Cohesion: 0.10
Nodes (37): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+29 more)

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

### Community 157 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 159 - "confirmation.ts"
Cohesion: 0.12
Nodes (21): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+13 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Council.tsx"
Cohesion: 0.21
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 176 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

## Knowledge Gaps
- **121 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1789 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `live/src/index.ts`, `postgres.test.ts`, `styles.ts`, `.query`, `layouts.tsx`, `Secret`, `seller-app.ts`, `sellers/disputes.test.ts`, `api.ts`, `ledger/src/index.ts`, `net/src/index.ts`, `scope-draft/src/index.ts`, `utcDateTime`, `ScopePanel.tsx`, `App.tsx`, `mcp.ts`, `qa/src/index.ts`, `PayPalRestClient`, `DraftReview.tsx`, `council/src/index.ts`, `acceptance.ts`, `validate.ts`, `DealPage.tsx`, `testId`, `Ledger.tsx`, `confirmation.ts`, `injection-runner.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `disputes/test-support.ts`, `packet-service.ts`, `scope-draft/src/testing.ts`, `products/src/index.ts`, `eval-report.ts`, `dispute-sync.ts`, `log-labels.test.ts`, `sandbox-partner-report.ts`, `config.ts`, `schema.ts`, `receipt.ts`, `PacketPanel.tsx`, `paypal-webhook.ts`, `paypal/src/disputes.ts`, `vitest`, `Deadlines.tsx`, `action-routes.ts`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `delivery-routes.ts`, `completeness.ts`, `db/src/migrate.ts`, `claim-job.ts`, `resend-inbound.ts`, `appendLedgerEvent`, `sandbox-respond-report.ts`, `SellerAppPanel.tsx`, `claims/src/index.ts`, `readLedger`, `claims/src/index.ts`, `Landing.tsx`, `app.ts`, `sandbox-webhook-report.ts`, `MessagesPanel.tsx`, `render.ts`, `live-hub.ts`, `web-pages.test.ts`, `db/src/testing.ts`, `render-blueprint.test.ts`, `when`, `app.test.ts`, `test-app.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07205513784461152 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `timeline/src/index.ts`, `README.md`, `PayPalRestClient`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.06467661691542288 - nodes in this community are weakly interconnected._
- **Why does `react` connect `DealPage.tsx` to `live/src/index.ts`, `styles.ts`, `layouts.tsx`, `api.ts`, `ScopePanel.tsx`, `App.tsx`, `DraftReview.tsx`, `Ledger.tsx`, `web/src/format.ts`, `DealsTable.tsx`, `Council.tsx`, `receipt.ts`, `PacketPanel.tsx`, `web/package.json`, `Deadlines.tsx`, `DisputeActions.tsx`, `SellerAppPanel.tsx`, `Pillars.tsx`, `Landing.tsx`, `MessagesPanel.tsx`, `when`, `Insights.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055822466254861584 - nodes in this community are weakly interconnected._