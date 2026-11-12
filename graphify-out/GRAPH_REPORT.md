# Graph Report - paypal-hackathon  (2026-11-12)

## Corpus Check
- 839 files · ~1,558,428 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6302 nodes · 19947 edges · 216 communities (193 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 555 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c6789f7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- mcp.ts
- qa/src/index.ts
- timeline-routes.ts
- DealPage.tsx
- react
- milestone-routes.ts
- chat.ts
- ListingEditor.tsx
- db/src/index.ts
- claims/src/index.ts
- acceptance-routes.ts
- tools.ts
- layouts.tsx
- DeliveriesPanel.tsx
- Database
- db/src/migrate.ts
- ChangeOrderPanel.tsx
- delivery-routes.ts
- MessagesPage.tsx
- .query
- words/src/index.ts
- vitest
- draft-routes.ts
- scope.ts
- council/src/index.ts
- disputes/task.ts
- message-job.ts
- Secret
- validate.ts
- when
- scope-draft/src/testing.ts
- actions.ts
- change-order-routes.ts
- DeliverPanel.tsx
- resend-inbound.ts
- claim-routes.ts
- deliveries.ts
- claim-routes.ts
- eval-report.ts
- Deadlines.tsx
- testId
- templates.ts
- chat-routes.ts
- claim-job.ts
- postgres.ts
- listing-routes.ts
- dealRoutes
- web/package.json
- ledger/src/index.ts
- ref_zod
- Deadlines.tsx
- draft-job.ts
- src/summary.test.ts
- seller-connections.ts
- postStep
- verify
- retention.ts
- .query
- PayPalResult
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- eval-judge.ts
- scripts
- db/package.json
- dispute-sync.ts
- emailFrom
- deals/routes.ts
- Insights.tsx
- scope-draft/src/index.ts
- claims/package.json
- paypal/src/index.ts
- bus.test.ts
- devDependencies
- delivery-check/src/index.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- Secret
- runtime.ts
- appeal-items.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- Engineering
- products/package.json
- MessagesPanel.tsx
- ai/package.json
- sandbox-respond-report.ts
- notices.ts
- scripts
- sandbox-webhook-report.ts
- packet-service.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- SellerAppPanel.tsx
- Ledger.tsx
- make_content.py
- design/parts.tsx
- council/package.json
- auth/sign-in.ts
- deadline-rows.ts
- landing-words.ts
- pages.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- build.ts
- confirmation.ts
- Engineering standards
- package.json
- Decisions
- server/package.json
- config.ts
- compilerOptions
- Build plan
- sandbox-settle.ts
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- ai-check-report.ts
- PactPal in diagrams
- Try PactPal yourself
- README.md
- log-labels.ts
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
- record.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- The problem, in sellers' own words
- Closing.tsx
- milestones.test.ts
- .prettierrc.json
- products/tsconfig.json
- Landing.tsx
- dependencies
- docs/tsconfig.json
- postgres-listen.test.ts
- scripts
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- Built (sub-phases 2b to 6h-1)
- vite-env.d.ts
- src-app-tsx.md
- design/tokens.ts
- Diagrams
- IntakePanel.tsx
- PayPal sandbox notes
- source
- @fastify/websocket
- Getting started
- brand/package.json
- @modelcontextprotocol/sdk@1.32.1
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- @pactpal/delivery-check@workspace:*
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy
- @pactpal/ai@workspace:*
- council
- @pactpal/pdf@workspace:*
- @pactpal/db@workspace:*
- log-labels.test.ts
- @pactpal/ledger@workspace:*
- @pactpal/net@workspace:*
- @pactpal/timeline@workspace:*
- @pactpal/score@workspace:*
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- @pactpal/watcher@workspace:*
- app.ts
- keyvalue.ts
- pg@^8.23.1
- zod@^4.6.7
- @pactpal/council@workspace:*
- @pactpal/scope-draft@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 235 edges
2. `Database` - 136 edges
3. `testId()` - 127 edges
4. `readLedger()` - 94 edges
5. `useMigratedTestDatabase()` - 90 edges
6. `sha256Hex()` - 86 edges
7. `react` - 80 edges
8. `TEST_NOW` - 76 edges
9. `appendLedgerEvent()` - 75 edges
10. `isObject()` - 74 edges

## Surprising Connections (you probably didn't know these)
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- `Sponsor licences (9k)` --references--> `giveBryntumLicence()`  [INFERRED]
  docs/decisions.md → apps/web/src/schedule/bryntum-licence.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts

## Import Cycles
- None detected.

## Communities (216 total, 23 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.08
Nodes (39): signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage, DisputePage (+31 more)

### Community 1 - "mcp.ts"
Cohesion: 0.15
Nodes (14): checkMcp(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, sseTransport(), fakeServer() (+6 more)

### Community 2 - "qa/src/index.ts"
Cohesion: 0.08
Nodes (42): checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM (+34 more)

### Community 3 - "timeline-routes.ts"
Cohesion: 0.18
Nodes (30): sendTimelineReminders(), dealCompleteness(), judgedScope(), completenessRoutes(), OVERVIEW_LIMIT, overviewOf(), overviewRoutes(), money() (+22 more)

### Community 4 - "DealPage.tsx"
Cohesion: 0.09
Nodes (39): checkLedger(), getDeal(), getMe(), getScope(), LedgerCheck, ScopeTerms, ScopeView, getTimeline() (+31 more)

### Community 5 - "react"
Cohesion: 0.08
Nodes (47): analysesUrl(), AppealCheckView, AppealView, ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), CouncilView (+39 more)

### Community 6 - "milestone-routes.ts"
Cohesion: 0.09
Nodes (43): emailDelivery(), getUserEmail(), milestoneRoutes(), answer(), emailInvoice(), sellerApp(), paypalProblem(), sendBody (+35 more)

### Community 7 - "chat.ts"
Cohesion: 0.05
Nodes (47): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), lastMessages(), lastSeq (+39 more)

### Community 8 - "ListingEditor.tsx"
Cohesion: 0.38
Nodes (8): isListingPreview(), ListingPreview, ListingView, lookUpListing(), saveListingPhotos(), fileUrl(), ListingCard(), ListingEditor()

### Community 9 - "db/src/index.ts"
Cohesion: 0.02
Nodes (157): db, disputeTypes(), PayPalWebhookOptions, event, headers, rawBody, report, setup() (+149 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (66): Prepared, candidates(), parseJsonReply(), tryParse(), AppealCheck, AppealContext, checkAppeal(), readAppeal() (+58 more)

### Community 11 - "acceptance-routes.ts"
Cohesion: 0.11
Nodes (31): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload (+23 more)

### Community 12 - "tools.ts"
Cohesion: 0.14
Nodes (17): AgentTool, ask(), choicesSchema, dealId, dealPath(), disputeId, disputePath(), failed() (+9 more)

### Community 13 - "layouts.tsx"
Cohesion: 0.06
Nodes (65): DealSummary, Me, Money, CommandPalette(), PLACES, Dashboard(), DealList(), Cell (+57 more)

### Community 14 - "DeliveriesPanel.tsx"
Cohesion: 0.21
Nodes (19): AnswerBox(), Revisions, revisionWords(), approveDelivery(), deliveriesUrl(), DeliveriesView, deliveryFileUrl(), deliveryStep() (+11 more)

### Community 15 - "Database"
Cohesion: 0.06
Nodes (43): McpRouteOptions, AppOptions, SignInOptions, ChatBus, Card, HubOptions, listQuery, NotificationRouteOptions (+35 more)

### Community 16 - "db/src/migrate.ts"
Cohesion: 0.22
Nodes (13): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, MigrationStatus, migrationStatus() (+5 more)

### Community 17 - "ChangeOrderPanel.tsx"
Cohesion: 0.07
Nodes (66): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), InvalidFieldsError, isChangeOrders(), proposeChange() (+58 more)

### Community 18 - "delivery-routes.ts"
Cohesion: 0.08
Nodes (43): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+35 more)

### Community 19 - "MessagesPage.tsx"
Cohesion: 0.14
Nodes (23): useWide(), LastMessage, MessagesPage(), People(), plainClick(), Thread(), useLastMessages(), chatAddress() (+15 more)

### Community 20 - ".query"
Cohesion: 0.03
Nodes (144): waitingChange(), questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView() (+136 more)

### Community 21 - "words/src/index.ts"
Cohesion: 0.06
Nodes (59): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, BRANDED_RECEIPTS_FROM, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks() (+51 more)

### Community 22 - "vitest"
Cohesion: 0.02
Nodes (213): db, agentDeal(), db, ToolResult, chatDeal(), db, MessageBody, db (+205 more)

### Community 23 - "draft-routes.ts"
Cohesion: 0.07
Nodes (48): dealParams, featureAnswers(), FoundDeal, Refusal, sendRefusal(), draftParams, draftRoutes(), beginDraft() (+40 more)

### Community 24 - "scope.ts"
Cohesion: 0.06
Nodes (34): at(), db, ORDERING, proposed(), signature(), SIGNED, BASE, LISTING (+26 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (54): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), ChatFailureKind (+46 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.05
Nodes (74): publishingBus(), Config, formatErrors(), CronStart, runCronJob(), BUTTON_WINDOW_MS, checkKey(), CheckRequest (+66 more)

### Community 27 - "message-job.ts"
Cohesion: 0.13
Nodes (27): toCouncilRecord(), JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), failMessageReview(), finishMessageReview(), messageReviewCouncilTask() (+19 more)

### Community 28 - "Secret"
Cohesion: 0.05
Nodes (70): RFC-2606, ClientOptions, EmailFailure, bareAddress(), check, InboxNetworkError, receivedAnswer, ReceivedEmails (+62 more)

### Community 29 - "validate.ts"
Cohesion: 0.10
Nodes (36): allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, CategoryVerdict, UNCLEAR_CATEGORY, paymentFromShare(), Share, shareOf() (+28 more)

### Community 30 - "when"
Cohesion: 0.10
Nodes (37): chatUrl(), ChatView, getChat(), getPastedChats(), isChat(), isMessage(), isPasted(), liveUrl() (+29 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (33): build(), input, numbered, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, SCORED_FIELDS (+25 more)

### Community 32 - "actions.ts"
Cohesion: 0.06
Nodes (121): RouteAnswer, FILE_NAME_HEADER, addBuyer(), AgreementForm, answerDelivery(), askQuestion(), callAs(), chat() (+113 more)

### Community 33 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (33): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody (+25 more)

### Community 34 - "DeliverPanel.tsx"
Cohesion: 0.11
Nodes (27): addFile(), addPastedChat(), checksUrl(), fileUrl(), getDeliveryChecks(), isChecks(), isFile(), isReading() (+19 more)

### Community 35 - "resend-inbound.ts"
Cohesion: 0.13
Nodes (23): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+15 more)

### Community 36 - "claim-routes.ts"
Cohesion: 0.06
Nodes (61): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+53 more)

### Community 37 - "deliveries.ts"
Cohesion: 0.08
Nodes (25): AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile, DeliveryNotAllowedError (+17 more)

### Community 38 - "claim-routes.ts"
Cohesion: 0.11
Nodes (35): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+27 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.10
Nodes (40): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+32 more)

### Community 40 - "Deadlines.tsx"
Cohesion: 0.17
Nodes (13): BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, hasEvidence(), COLUMNS, LABELS, useEvidence() (+5 more)

### Community 41 - "testId"
Cohesion: 0.05
Nodes (64): mcpClient(), dealWithBuyer(), addCard(), Conversation, db, db, goodsDeal(), SCOPE (+56 more)

### Community 42 - "templates.ts"
Cohesion: 0.10
Nodes (35): NOTICE_LOOK, EmailTemplates, loadEmailTemplates(), emailAttachmentSchema, emailMessageSchema, SendResult, ReadResult, ReceivedEmail (+27 more)

### Community 43 - "chat-routes.ts"
Cohesion: 0.07
Nodes (37): afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+29 more)

### Community 44 - "claim-job.ts"
Cohesion: 0.25
Nodes (22): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+14 more)

### Community 45 - "postgres.ts"
Cohesion: 0.14
Nodes (10): Row, databaseFromPool(), ListenOptions, PgClient, PgConnection, PgPool, PostgresOptions, queryOn() (+2 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.14
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, fakeChannel3(), NOW, attributeName(), capped() (+12 more)

### Community 47 - "dealRoutes"
Cohesion: 0.16
Nodes (20): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), dealAccess(), visibleDeal() (+12 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (50): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+42 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.03
Nodes (113): isPicture(), LISTING_CACHE_SECONDS, listingRoutes(), lookUp(), photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS (+105 more)

### Community 50 - "ref_zod"
Cohesion: 0.05
Nodes (44): dollar, setup(), Call, item, json(), Reply, setup(), tokenReply() (+36 more)

### Community 51 - "Deadlines.tsx"
Cohesion: 0.21
Nodes (9): StageView, StepView, RunningStepView, doneDay(), GanttLink, ganttRows(), GanttTask, noteFor() (+1 more)

### Community 52 - "draft-job.ts"
Cohesion: 0.16
Nodes (16): councilRecordOf(), draftCategories, CouncilRecord, councilRecordSchema, isUnranked(), two, usage, DraftJob (+8 more)

### Community 53 - "src/summary.test.ts"
Cohesion: 0.10
Nodes (17): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+9 more)

### Community 54 - "seller-connections.ts"
Cohesion: 0.10
Nodes (31): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+23 more)

### Community 55 - "postStep"
Cohesion: 0.14
Nodes (30): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), escalateDispute(), getDisputeActions() (+22 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "retention.ts"
Cohesion: 0.17
Nodes (15): `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA (+7 more)

### Community 58 - ".query"
Cohesion: 0.05
Nodes (57): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+49 more)

### Community 59 - "PayPalResult"
Cohesion: 0.05
Nodes (49): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), transactionList (+41 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (24): Completeness, CompletenessInput, CompletenessItem, Facts, field(), ItemStatus, Measure, MEASURED (+16 more)

### Community 61 - "testSpec"
Cohesion: 0.06
Nodes (58): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), ModelCall (+50 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (51): ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent, DraftMark, draftsUrl() (+43 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "eval-judge.ts"
Cohesion: 0.22
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "dispute-sync.ts"
Cohesion: 0.09
Nodes (32): RunnerBusyError, AnalysesView, db, disputedDeal(), changedSince(), Counts, failureCode(), readTooSoon() (+24 more)

### Community 68 - "emailFrom"
Cohesion: 0.17
Nodes (26): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+18 more)

### Community 69 - "deals/routes.ts"
Cohesion: 0.07
Nodes (48): LiveRouteOptions, notificationRoutes(), DealLookup, readBody(), CompletenessRouteOptions, checkBody, DeliveryCheckRouteOptions, LookResult (+40 more)

### Community 70 - "Insights.tsx"
Cohesion: 0.11
Nodes (23): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+15 more)

### Community 71 - "scope-draft/src/index.ts"
Cohesion: 0.06
Nodes (57): ClaimText, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines(), minuteOf() (+49 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (40): APP_KEYS, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection(), formatSandboxReport() (+32 more)

### Community 74 - "bus.test.ts"
Cohesion: 0.15
Nodes (13): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), CHAT_CHANNEL (+5 more)

### Community 75 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 76 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (62): checkView(), deliveryCheckRoutes(), looks(), askImageModels(), DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS (+54 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (26): Accounts and connection, AI, Disputes, Drafting and injection evals with prompt version 5 and paid models (9d, 12 November 2026), Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026) (+18 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.11
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/ledger@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 81 - "Secret"
Cohesion: 0.08
Nodes (21): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode(), reply (+13 more)

### Community 82 - "runtime.ts"
Cohesion: 0.22
Nodes (13): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), createDraftingRuntime(), cryptoCouncilDeps() (+5 more)

### Community 83 - "appeal-items.ts"
Cohesion: 0.18
Nodes (14): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+6 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "Engineering"
Cohesion: 0.16
Nodes (12): Engineering, createdInvoice, DraftInvoice, invoiceDetails, invoiceNote(), InvoiceSendError, PayPalInvoices, Route (+4 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (101): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+93 more)

### Community 92 - "notices.ts"
Cohesion: 0.11
Nodes (31): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+23 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "packet-service.ts"
Cohesion: 0.08
Nodes (48): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+40 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (121): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+113 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (46): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+38 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 101 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 103 - "design/parts.tsx"
Cohesion: 0.08
Nodes (39): AcceptanceDocument(), redeemLink(), SIGN_IN_PATH, BrandLogo(), BrandName, LOGOS, LogoMark(), Alert() (+31 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "auth/sign-in.ts"
Cohesion: 0.07
Nodes (52): actingAs(), routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext (+44 more)

### Community 106 - "deadline-rows.ts"
Cohesion: 0.28
Nodes (12): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+4 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.07
Nodes (45): CanCannot(), BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at() (+37 more)

### Community 108 - "pages.tsx"
Cohesion: 0.24
Nodes (18): listDeals(), STAGE_ORDER, Deadlines, DeadlinesPage(), DealsPage(), DealsTable, DisputesPage(), Insights (+10 more)

### Community 109 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

### Community 110 - "Demo plan"
Cohesion: 0.11
Nodes (18): Buyers (each: a sandbox **Personal** account with the same email and sandbox balance, to pay invoices), Cast, Chats, Demo plan, Done by the owner, How the inboxes work (set up 11 Nov 2026), Maya's book of deals (written work only), Rules (+10 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "build.ts"
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, DIAGRAM_SOURCES

### Community 115 - "confirmation.ts"
Cohesion: 0.24
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.20
Nodes (10): AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product, Redesign (Phase 7R) (+2 more)

### Community 119 - "server/package.json"
Cohesion: 0.13
Nodes (14): @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/live@workspace:*, @pactpal/qa@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/qa, name (+6 more)

### Community 120 - "config.ts"
Cohesion: 0.07
Nodes (33): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+25 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "sandbox-settle.ts"
Cohesion: 0.15
Nodes (10): connectSandboxApp(), linkedClients(), Settler, SettleResult, authAssertion(), base64Url(), clientsOver(), ownAppClients() (+2 more)

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

### Community 128 - "docs/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @fontsource/instrument-serif@5.3.0, @fontsource-variable/geist@5.3.0, @fontsource-variable/geist-mono@5.3.0, marked@18.1.1, mermaid@12.2.0, @pactpal/brand@workspace:*, devDependencies (+17 more)

### Community 129 - "ai-check-report.ts"
Cohesion: 0.40
Nodes (7): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec

### Community 130 - "PactPal in diagrams"
Cohesion: 0.22
Nodes (8): A deal from chat to paid, Answering a dispute from the record, How the AI council picks one draft, How the evidence log stays honest, PactPal in diagrams, The whole system, When your AI assistant asks to act, Where it runs

### Community 131 - "Try PactPal yourself"
Cohesion: 0.20
Nodes (9): Before you start, Good to know, Scenarios to try, Six things to open, The demo buyers, The demo sellers, The shared inbox, Try it with your own sandbox accounts (+1 more)

### Community 132 - "README.md"
Cohesion: 0.12
Nodes (11): Code map, Deploying PactPal to Render, Changing emails, How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope (+3 more)

### Community 133 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 134 - "PactPal"
Cohesion: 0.06
Nodes (33): AG Grid: every deal in one table, AG Studio: the Insights dashboard, Against the judging criteria, AI, AI assistants (MCP), AI: from a messy chat to a record PayPal can use, AI that seals the deal., Author (+25 more)

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

### Community 150 - "record.ts"
Cohesion: 0.33
Nodes (9): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+1 more)

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

### Community 157 - "PactPal design system"
Cohesion: 0.14
Nodes (14): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+6 more)

### Community 158 - "The problem, in sellers' own words"
Cohesion: 0.29
Nodes (6): Figures, For the video, How the images were made, Posts, The problem, in sellers' own words, The short version

### Community 159 - "Closing.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

### Community 160 - "milestones.test.ts"
Cohesion: 0.22
Nodes (7): listMilestones(), MilestoneNotAllowedError, refuse(), StartInvoice, db, refusal(), signed()

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Landing.tsx"
Cohesion: 0.06
Nodes (35): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+27 more)

### Community 165 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @pactpal/email@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:*, @pactpal/words@workspace:* (+10 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "postgres-listen.test.ts"
Cohesion: 0.22
Nodes (4): fakeClient(), Handler, setup(), PgListenClient

### Community 168 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.16
Nodes (21): anchorOf(), cards(), contents(), diagramPath(), escapeHtml(), Group, GROUPS, HONESTY (+13 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (20): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks (+12 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 180 - "design/tokens.ts"
Cohesion: 0.20
Nodes (18): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg(), ColorToken (+10 more)

### Community 183 - "IntakePanel.tsx"
Cohesion: 0.14
Nodes (23): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+15 more)

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 185 - "source"
Cohesion: 0.17
Nodes (12): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+4 more)

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 192 - "Connect your AI agent"
Cohesion: 0.33
Nodes (6): 1. Make an agent key, 2. Add PactPal to your assistant, Connect your AI agent, Nothing is sent without you, On the record, What your agent can do

### Community 193 - "When a buyer disputes"
Cohesion: 0.33
Nodes (6): Answer, Build the evidence packet, Check the claim against the record, If the decision goes against you, What you see, When a buyer disputes

### Community 194 - "PactPal help"
Cohesion: 0.33
Nodes (6): PactPal help, Start here, The AI, Trust, Under the hood, Your deals

### Community 195 - "brand/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 197 - "Agreements and the timeline"
Cohesion: 0.40
Nodes (5): Agreements and the timeline, From the chat to an agreement, The timeline, What signing records, When the work changes

### Community 198 - "How PactPal is built"
Cohesion: 0.40
Nodes (5): How a council runs, How PactPal is built, The parts, The rules every change meets, Where it runs

### Community 199 - "For your buyer"
Cohesion: 0.50
Nodes (4): Disputes, For your buyer, One link by email, What signing means

### Community 200 - "Chat, Messages and reminders"
Cohesion: 0.50
Nodes (4): Chat, Messages and reminders, Messages, Reminders, The deal's chat

### Community 201 - "Delivering work"
Cohesion: 0.50
Nodes (4): Approvals and revisions, Delivering work, Physical goods, Send through a tracked link

### Community 202 - "The evidence log"
Cohesion: 0.50
Nodes (4): Check it yourself, The evidence log, The records score, Why nobody can quietly edit it

### Community 203 - "What PactPal is and is not"
Cohesion: 0.50
Nodes (4): PactPal is, PactPal is not, What PactPal is and is not, Which deals suit it

### Community 204 - "Privacy"
Cohesion: 0.50
Nodes (4): How long, Privacy, What PactPal keeps, Who else sees it

### Community 207 - "council"
Cohesion: 0.22
Nodes (9): title(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, council() (+1 more)

### Community 210 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 218 - "app.ts"
Cohesion: 0.04
Nodes (49): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), buildApp(), closeOnSignals() (+41 more)

### Community 219 - "keyvalue.ts"
Cohesion: 0.23
Nodes (4): connectKeyValue(), keyValueStore(), memoryStore(), RedisCommands

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1898 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `mcp.ts`, `qa/src/index.ts`, `DealPage.tsx`, `milestone-routes.ts`, `chat.ts`, `db/src/index.ts`, `claims/src/index.ts`, `layouts.tsx`, `db/src/migrate.ts`, `ChangeOrderPanel.tsx`, `MessagesPage.tsx`, `.query`, `words/src/index.ts`, `scope.ts`, `council/src/index.ts`, `disputes/task.ts`, `message-job.ts`, `Secret`, `validate.ts`, `when`, `scope-draft/src/testing.ts`, `actions.ts`, `DeliverPanel.tsx`, `resend-inbound.ts`, `claim-routes.ts`, `deliveries.ts`, `eval-report.ts`, `Deadlines.tsx`, `testId`, `templates.ts`, `chat-routes.ts`, `listing-routes.ts`, `ledger/src/index.ts`, `ref_zod`, `Deadlines.tsx`, `draft-job.ts`, `src/summary.test.ts`, `seller-connections.ts`, `postStep`, `.query`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `dispute-sync.ts`, `emailFrom`, `Insights.tsx`, `scope-draft/src/index.ts`, `paypal/src/index.ts`, `bus.test.ts`, `delivery-check/src/index.ts`, `Secret`, `appeal-items.ts`, `MessagesPanel.tsx`, `sandbox-respond-report.ts`, `sandbox-webhook-report.ts`, `packet-service.ts`, `render.ts`, `SellerAppPanel.tsx`, `Ledger.tsx`, `auth/sign-in.ts`, `deadline-rows.ts`, `landing-words.ts`, `devDependencies`, `confirmation.ts`, `package.json`, `config.ts`, `sandbox-settle.ts`, `ai-check-report.ts`, `Closing.tsx`, `milestones.test.ts`, `postgres-listen.test.ts`, `pages.ts`, `design/tokens.ts`, `IntakePanel.tsx`, `log-labels.test.ts`, `app.ts`, `keyvalue.ts`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07591836734693877 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `timeline-routes.ts`, `README.md`, `Engineering`, `source`, `PayPalResult`, `retention.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `qa/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08013468013468013 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Engineering` to `react`, `claims/src/index.ts`, `Database`, `delivery-routes.ts`, `words/src/index.ts`, `vitest`, `council/src/index.ts`, `Secret`, `Built (sub-phases 2b to 6h-1)`, `ledger/src/index.ts`, `ref_zod`, `draft-job.ts`, `seller-connections.ts`, `PayPalResult`, `testSpec`, `scope-draft/src/index.ts`, `council`, `Secret`, `log-labels.test.ts`, `appeal-items.ts`, `Decisions`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `DealPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09013605442176871 - nodes in this community are weakly interconnected._