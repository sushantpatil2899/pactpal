# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 726 files · ~483,915 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 20 file(s) not represented in the graph (top: .css 14, (none) 5, .example 1)

## Summary
- 5580 nodes · 17737 edges · 173 communities (168 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 506 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43c5ab4e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- paypal/src/index.ts
- acceptance-routes.ts
- net/src/index.ts
- postgres.test.ts
- styles.ts
- appendLedgerEvent
- Database
- ref_zod
- live/src/index.ts
- chat-routes.ts
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- vitest
- ai/src/index.ts
- utcDateTime
- sandbox-partner-report.ts
- ScopePanel.tsx
- App.tsx
- invoices.ts
- .query
- qa/src/index.ts
- mcp.ts
- DraftReview.tsx
- dependencies
- council/src/index.ts
- change-orders.ts
- artifacts.ts
- DealPage.tsx
- database.ts
- words/src/index.ts
- scope-draft/src/testing.ts
- claim-routes.test.ts
- delivery-routes.ts
- DealsTable.tsx
- disputes/test-support.ts
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- dispute-sync.ts
- config.ts
- claims/src/index.ts
- server/src/index.ts
- claim-job.ts
- tools.ts
- scope-draft/src/index.ts
- MessagesPage.tsx
- paypal/src/disputes.ts
- db/src/index.ts
- notices.ts
- web/package.json
- Deadlines.tsx
- auth/sign-in.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- question-routes.ts
- completeness.ts
- chain-scene.ts
- DisputeActions.tsx
- services
- db/src/migrate.ts
- scripts
- db/package.json
- scope.ts
- claim-routes.ts
- deliveries.ts
- web/src/format.ts
- questions.ts
- claims/package.json
- sandbox-respond-report.ts
- DraftPanel.tsx
- dispute-view.ts
- Pillars.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- seller-connections.ts
- MessagesPanel.tsx
- postgresContentStore
- scope-draft/package.json
- paypal/package.json
- sandbox-check.ts
- landing-words.ts
- products/package.json
- app.ts
- ai/package.json
- paypal-webhook.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- sandbox-clients.ts
- appeal-items.ts
- render.ts
- email/package.json
- compilerOptions
- readLedger
- Landing.tsx
- Nav.tsx
- change-order-routes.ts
- council/package.json
- eval-judge.ts
- council
- AcceptancePanel.tsx
- Phase 7 (deal space)
- pdf/package.json
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- Scope
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
- delivery-check.test.ts
- dependencies
- layouts.tsx
- IntakePanel.tsx
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
- App.tsx
- image.ts
- Council.tsx
- .prettierrc.json
- products/tsconfig.json
- Layout
- Hero.tsx
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- check-words.ts
- milestones.ts
- vite-env.d.ts
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 214 edges
2. `Database` - 127 edges
3. `testId()` - 113 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 81 edges
6. `sha256Hex()` - 78 edges
7. `react` - 76 edges
8. `isObject()` - 74 edges
9. `TEST_NOW` - 67 edges
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

## Communities (173 total, 5 thin omitted)

### Community 0 - "paypal/src/index.ts"
Cohesion: 0.08
Nodes (30): DisputeActionNotAllowed, EvidenceFileError, PayPalApiError, PayPalErrorDetail, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile (+22 more)

### Community 1 - "acceptance-routes.ts"
Cohesion: 0.14
Nodes (27): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload (+19 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.06
Nodes (60): checks, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+52 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.09
Nodes (17): Queryable, Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres() (+9 more)

### Community 4 - "styles.ts"
Cohesion: 0.08
Nodes (43): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+35 more)

### Community 5 - "appendLedgerEvent"
Cohesion: 0.07
Nodes (59): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError (+51 more)

### Community 6 - "Database"
Cohesion: 0.09
Nodes (31): McpRouteOptions, ChatBus, Card, DealCards, HubOptions, NotificationRouteOptions, Notifier, NotifierOptions (+23 more)

### Community 7 - "ref_zod"
Cohesion: 0.06
Nodes (43): app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), RFC-2606, recordWebhookEvent() (+35 more)

### Community 8 - "live/src/index.ts"
Cohesion: 0.10
Nodes (37): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+29 more)

### Community 9 - "chat-routes.ts"
Cohesion: 0.08
Nodes (31): BusSignal, afterQuery, ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+23 more)

### Community 10 - "api.ts"
Cohesion: 0.04
Nodes (102): AgentRequestsPanel(), addBuyer(), AgentRequestView, answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict (+94 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.08
Nodes (50): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishClaimAnalysis (+42 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.08
Nodes (57): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), liveQuery, LiveRouteOptions (+49 more)

### Community 13 - "vitest"
Cohesion: 0.04
Nodes (80): agentDeal(), db, mcpClient(), ToolResult, db, SESSION_COOKIE, dealWithBuyer(), db (+72 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.04
Nodes (90): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, councilDeps() (+82 more)

### Community 15 - "utcDateTime"
Cohesion: 0.16
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+15 more)

### Community 16 - "sandbox-partner-report.ts"
Cohesion: 0.14
Nodes (24): Checked, payPalIdOption(), actFor(), message(), parsed, partners, platform, argsSchema (+16 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (74): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+66 more)

### Community 18 - "App.tsx"
Cohesion: 0.12
Nodes (36): createDeal(), getDealOptions(), LinkProblem, redeemLink(), SIGN_IN_PATH, NewDealPage(), STAGE_ORDER, Deadlines (+28 more)

### Community 19 - "invoices.ts"
Cohesion: 0.09
Nodes (22): PayPalBuyerTestActions, searchTime(), dollar, setup(), createdInvoice, DraftInvoice, invoiceNote(), InvoiceSendError (+14 more)

### Community 20 - ".query"
Cohesion: 0.05
Nodes (61): answerAgentRequest(), finishAgentRequest(), lockedRequest(), shownCode(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema (+53 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.07
Nodes (56): runPrepared(), councilRecordSchema, toCouncilRecord(), toJson(), usage, DraftJob, JobLog, PROMPT_VERSIONS (+48 more)

### Community 22 - "mcp.ts"
Cohesion: 0.10
Nodes (24): checkMcp(), PayPalMcpError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, reasonOf(), invoice, noAnswer() (+16 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (42): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+34 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): Engineering, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+39 more)

### Community 26 - "change-orders.ts"
Cohesion: 0.05
Nodes (62): `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+54 more)

### Community 27 - "artifacts.ts"
Cohesion: 0.06
Nodes (38): ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed() (+30 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.06
Nodes (64): checkLedger(), getDeal(), getMe(), LedgerCheck, listDeals(), ScopeTerms, ScopeView, StepView (+56 more)

### Community 29 - "database.ts"
Cohesion: 0.05
Nodes (52): lockedDeal, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CATEGORIES, DEAL_CURRENCIES, DEAL_KINDS (+44 more)

### Community 30 - "words/src/index.ts"
Cohesion: 0.10
Nodes (37): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), DisputesView, getClaimAnalyses() (+29 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (51): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), scopeDraftCouncilTask() (+43 more)

### Community 32 - "claim-routes.test.ts"
Cohesion: 0.11
Nodes (30): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), renderClaimRunner(), renderWorkflowChecker(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+22 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (57): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+49 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.13
Nodes (32): DealSummary, Money, CommandPalette(), PLACES, Dashboard(), DealList(), insightRows(), timing() (+24 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.07
Nodes (36): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+28 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.12
Nodes (35): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+27 more)

### Community 37 - "receipt.ts"
Cohesion: 0.10
Nodes (33): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), AcceptanceDocument(), AcceptanceDocument (+25 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.08
Nodes (35): isPicture(), ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+27 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.08
Nodes (47): logProgress(), valueOrExit(), modelNames(), draftCategories, DroppedDraft, droppedSection(), ruleOf(), aloneRow() (+39 more)

### Community 40 - "dispute-sync.ts"
Cohesion: 0.11
Nodes (24): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+16 more)

### Community 41 - "config.ts"
Cohesion: 0.10
Nodes (29): result, loadConfigOrExit(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars() (+21 more)

### Community 42 - "claims/src/index.ts"
Cohesion: 0.04
Nodes (115): PacketFacts, candidates(), parseJsonReply(), tryParse(), AppealCheck, AppealContext, checkAppeal(), readAppeal() (+107 more)

### Community 43 - "server/src/index.ts"
Cohesion: 0.05
Nodes (58): publishingBus(), Config, log, DisputeWriter, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME (+50 more)

### Community 44 - "claim-job.ts"
Cohesion: 0.32
Nodes (18): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+10 more)

### Community 45 - "tools.ts"
Cohesion: 0.09
Nodes (30): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+22 more)

### Community 46 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (91): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+83 more)

### Community 47 - "MessagesPage.tsx"
Cohesion: 0.12
Nodes (28): StageBadge(), useWide(), Conversation, isConversation(), isLast(), LastMessage, listConversations(), DealCard() (+20 more)

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (41): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeList (+33 more)

### Community 49 - "db/src/index.ts"
Cohesion: 0.04
Nodes (83): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, agentBodySha256(), AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+75 more)

### Community 50 - "notices.ts"
Cohesion: 0.12
Nodes (32): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+24 more)

### Community 51 - "web/package.json"
Cohesion: 0.05
Nodes (43): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+35 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.09
Nodes (31): getDisputePage(), StageView, BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay() (+23 more)

### Community 53 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (24): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+16 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (21): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `claim_analyses`: council comparisons of a dispute claim with the record, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks (+13 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.10
Nodes (36): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+28 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.15
Nodes (20): DeliveryCheckView, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, RequirementResult (+12 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.08
Nodes (39): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), Deal space (Phase 7) (+31 more)

### Community 59 - "question-routes.ts"
Cohesion: 0.07
Nodes (52): DealLookup, featureAnswers(), step(), ChangeOrderRouteOptions, checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes() (+44 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "chain-scene.ts"
Cohesion: 0.11
Nodes (14): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+6 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.10
Nodes (43): acceptDisputeClaim(), answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse() (+35 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "db/src/migrate.ts"
Cohesion: 0.17
Nodes (15): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied() (+7 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope.ts"
Cohesion: 0.08
Nodes (38): db, later, sellerWithDeal(), sellerWithoutBuyer(), createDeal(), DealNotFoundError, checkedDraft(), countRow (+30 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.19
Nodes (23): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+15 more)

### Community 69 - "deliveries.ts"
Cohesion: 0.10
Nodes (31): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+23 more)

### Community 70 - "web/src/format.ts"
Cohesion: 0.12
Nodes (30): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftStatement(), getAppeal(), getResponses(), getStatements() (+22 more)

### Community 71 - "questions.ts"
Cohesion: 0.08
Nodes (30): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+22 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (67): AMOUNT_OPTIONS, amountOption(), disputeIdOption, issuesText(), message(), readChecked(), readOptions(), describeRoute() (+59 more)

### Community 74 - "DraftPanel.tsx"
Cohesion: 0.13
Nodes (22): addPastedChat(), DealFile, draftsUrl(), getDraftById(), listDrafts(), startDraft(), startDraftFromChat(), ChatDraftForm() (+14 more)

### Community 75 - "dispute-view.ts"
Cohesion: 0.16
Nodes (18): CHECK_INTERVAL_MS, disputeOf(), checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), DisputeMessageView, disputePageView() (+10 more)

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

### Community 81 - "seller-connections.ts"
Cohesion: 0.08
Nodes (38): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+30 more)

### Community 82 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 83 - "postgresContentStore"
Cohesion: 0.07
Nodes (44): CHAT_TRANSCRIPT_PREFIX, sendRefusal(), attachmentHeader(), sendCheckedFile(), sendDownload(), decoder, draftParams, draftRoutes() (+36 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "sandbox-check.ts"
Cohesion: 0.18
Nodes (14): APP_KEYS, checkAsSellerApp(), message(), result, APP_LABELS, appSection(), formatSandboxReport(), LoginCheck (+6 more)

### Community 87 - "landing-words.ts"
Cohesion: 0.14
Nodes (24): Audience(), GLYPHS, SPOTS, Sticker(), at(), Closing(), LIMIT_GLYPHS, Tagline() (+16 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "app.ts"
Cohesion: 0.09
Nodes (27): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+19 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "paypal-webhook.ts"
Cohesion: 0.12
Nodes (18): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+10 more)

### Community 92 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "sandbox-clients.ts"
Cohesion: 0.10
Nodes (25): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+17 more)

### Community 96 - "appeal-items.ts"
Cohesion: 0.14
Nodes (16): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+8 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "readLedger"
Cohesion: 0.07
Nodes (26): Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal(), db (+18 more)

### Community 101 - "Landing.tsx"
Cohesion: 0.12
Nodes (16): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+8 more)

### Community 102 - "Nav.tsx"
Cohesion: 0.30
Nodes (11): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+3 more)

### Community 103 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (49): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, documentFor(), fingerprinted(), money, sendTimelineReminders(), acceptBody (+41 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 106 - "council"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 107 - "AcceptancePanel.tsx"
Cohesion: 0.25
Nodes (15): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), declineTerms(), emailReceiptAgain() (+7 more)

### Community 108 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 109 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 110 - "test-app.ts"
Cohesion: 0.04
Nodes (105): chatDeal(), db, MessageBody, Card, db, savedDeal(), send(), signedDeal() (+97 more)

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

### Community 115 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 116 - "Engineering standards"
Cohesion: 0.15
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.20
Nodes (10): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, Agents (Phase 8), AI, Decisions, Partner tools (+2 more)

### Community 119 - "server/package.json"
Cohesion: 0.05
Nodes (36): devDependencies, esbuild, tsx, @types/node, @types/ws, @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council (+28 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.11
Nodes (26): count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep(), look() (+18 more)

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

### Community 128 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 129 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 130 - "layouts.tsx"
Cohesion: 0.11
Nodes (25): Me, IconName, PATHS, applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme() (+17 more)

### Community 131 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

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
Cohesion: 0.14
Nodes (14): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+6 more)

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

### Community 158 - "App.tsx"
Cohesion: 0.08
Nodes (38): signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage (+30 more)

### Community 159 - "image.ts"
Cohesion: 0.28
Nodes (14): CheckedFile, ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader (+6 more)

### Community 160 - "Council.tsx"
Cohesion: 0.09
Nodes (14): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+6 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 165 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 168 - "check-words.ts"
Cohesion: 0.36
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport()

### Community 170 - "milestones.ts"
Cohesion: 0.10
Nodes (26): dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoiceSent(), MILESTONE_STATUSES (+18 more)

### Community 175 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

## Knowledge Gaps
- **121 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1823 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `delivery-check.test.ts`, `paypal/src/index.ts`, `layouts.tsx`, `IntakePanel.tsx`, `styles.ts`, `appendLedgerEvent`, `postgres.test.ts`, `ref_zod`, `live/src/index.ts`, `net/src/index.ts`, `api.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `utcDateTime`, `sandbox-partner-report.ts`, `ScopePanel.tsx`, `invoices.ts`, `.query`, `qa/src/index.ts`, `mcp.ts`, `DraftReview.tsx`, `words/src/index.ts`, `council/src/index.ts`, `change-orders.ts`, `artifacts.ts`, `DealPage.tsx`, `Ledger.tsx`, `App.tsx`, `database.ts`, `claim-routes.test.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `disputes/test-support.ts`, `packet-service.ts`, `scope-draft/src/testing.ts`, `products/src/index.ts`, `eval-report.ts`, `dispute-sync.ts`, `config.ts`, `check-words.ts`, `server/src/index.ts`, `log-labels.test.ts`, `claims/src/index.ts`, `scope-draft/src/index.ts`, `MessagesPage.tsx`, `milestones.ts`, `paypal/src/disputes.ts`, `Deadlines.tsx`, `auth/sign-in.ts`, `timeline/src/index.ts`, `receipt.ts`, `completeness.ts`, `db/src/migrate.ts`, `scope.ts`, `deliveries.ts`, `questions.ts`, `sandbox-respond-report.ts`, `DraftPanel.tsx`, `seller-connections.ts`, `MessagesPanel.tsx`, `sandbox-check.ts`, `landing-words.ts`, `app.ts`, `paypal-webhook.ts`, `build.js`, `sandbox-webhook-report.ts`, `sandbox-clients.ts`, `appeal-items.ts`, `render.ts`, `readLedger`, `Nav.tsx`, `test-app.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07712765957446809 - nodes in this community are weakly interconnected._
- **Why does `react` connect `DealPage.tsx` to `layouts.tsx`, `IntakePanel.tsx`, `styles.ts`, `live/src/index.ts`, `api.ts`, `ScopePanel.tsx`, `App.tsx`, `DraftReview.tsx`, `Ledger.tsx`, `words/src/index.ts`, `App.tsx`, `Council.tsx`, `DealsTable.tsx`, `Hero.tsx`, `receipt.ts`, `MessagesPage.tsx`, `web/package.json`, `Deadlines.tsx`, `DisputeActions.tsx`, `web/src/format.ts`, `DraftPanel.tsx`, `Pillars.tsx`, `MessagesPanel.tsx`, `landing-words.ts`, `Landing.tsx`, `Nav.tsx`, `AcceptancePanel.tsx`, `Insights.tsx`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `acceptance-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `council/src/index.ts`, `timeline/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05513612445664608 - nodes in this community are weakly interconnected._