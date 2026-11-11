# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 770 files · ~511,181 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 5908 nodes · 18486 edges · 200 communities (194 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 520 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `177b00a5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- design/parts.tsx
- paypal/src/index.ts
- appendLedgerEvent
- layouts.tsx
- DeliverPanel.tsx
- sandbox-partner-report.ts
- delivery-routes.ts
- record.ts
- dayWords
- utcDateTime
- claims/src/index.ts
- mcp.ts
- db/src/testing.ts
- chat.ts
- change-orders.ts
- DealPage.tsx
- server/src/index.ts
- ScopePanel.tsx
- ref_zod
- question-routes.ts
- email/src/index.ts
- draft-job.ts
- Secret
- timeline-routes.ts
- tools.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- PayPalRestClient
- packet.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- notices.ts
- scope-draft/src/index.ts
- App.tsx
- Deadlines.tsx
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- errors.ts
- getUser
- build.js
- config.ts
- live-hub.ts
- postgres.ts
- products/src/index.ts
- chat-state.ts
- dependencies
- ledger/src/index.ts
- vitest
- web/package.json
- deals/routes.ts
- resend-inbound.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- paypal-webhook.ts
- scripts
- db/package.json
- scope-drafts.ts
- Insights.tsx
- draft-routes.ts
- auth/sign-in.ts
- disputes/test-support.ts
- claims/package.json
- sandbox-respond-report.ts
- app.ts
- live/src/index.ts
- checker.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- vitest
- eval-runner.ts
- seller-connections.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- Database
- ai/package.json
- chat-api.ts
- linked-apps.test.ts
- scripts
- sandbox-webhook-report.ts
- bus.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- check-words.ts
- db/src/index.ts
- pdf/package.json
- IntakePanel.tsx
- council/package.json
- scope-draft/src/council-task.ts
- build.ts
- react
- runtime.ts
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- QuestionsPanel.tsx
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- markWords
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- overview.ts
- Layout
- ChangeOrderPanel
- README.md
- MessagesPanel.tsx
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
- claim-job.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- draft-changes.ts
- confirmation.ts
- image.ts
- .prettierrc.json
- products/tsconfig.json
- keyvalue.ts
- server/package.json
- docs/tsconfig.json
- TimelineStep
- retention.ts
- deliveries.test.ts
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- sellerAppRoutes
- devDependencies
- ref_zod
- vite-env.d.ts
- src-app-tsx.md
- engines
- TimelineEditor.tsx
- design/tokens.ts
- scripts
- vite.config.ts
- log-labels.test.ts
- Getting started
- brand/package.json
- dependencies
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy

## God Nodes (most connected - your core abstractions)
1. `vitest` - 221 edges
2. `Database` - 129 edges
3. `testId()` - 119 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 83 edges
6. `sha256Hex()` - 83 edges
7. `react` - 79 edges
8. `isObject()` - 74 edges
9. `TEST_NOW` - 68 edges
10. `Secret` - 66 edges

## Surprising Connections (you probably didn't know these)
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (200 total, 6 thin omitted)

### Community 0 - "design/parts.tsx"
Cohesion: 0.10
Nodes (34): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+26 more)

### Community 1 - "paypal/src/index.ts"
Cohesion: 0.11
Nodes (29): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem (+21 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.04
Nodes (111): waitingChange(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+103 more)

### Community 3 - "layouts.tsx"
Cohesion: 0.05
Nodes (107): DealSummary, Me, Money, App(), CommandPalette(), PLACES, Dashboard(), DealList() (+99 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.07
Nodes (46): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+38 more)

### Community 5 - "sandbox-partner-report.ts"
Cohesion: 0.08
Nodes (39): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+31 more)

### Community 6 - "delivery-routes.ts"
Cohesion: 0.08
Nodes (43): sendRefusal(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+35 more)

### Community 7 - "record.ts"
Cohesion: 0.33
Nodes (9): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+1 more)

### Community 8 - "dayWords"
Cohesion: 0.27
Nodes (12): receiptBlocks(), isListingPreview(), ListingPreview, ListingView, lookUpListing(), saveListingPhotos(), fileUrl(), ListingCard() (+4 more)

### Community 9 - "utcDateTime"
Cohesion: 0.17
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (58): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages(), appealSource() (+50 more)

### Community 11 - "mcp.ts"
Cohesion: 0.09
Nodes (30): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+22 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (72): dealWithBuyer(), db, db, goodsDeal(), SCOPE, WEBP, capturingEmail(), db (+64 more)

### Community 13 - "chat.ts"
Cohesion: 0.07
Nodes (36): addCard(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+28 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.06
Nodes (39): documentFingerprint(), at(), db, document(), savedDeal(), work, at(), db (+31 more)

### Community 15 - "DealPage.tsx"
Cohesion: 0.09
Nodes (37): checkLedger(), getMe(), getScope(), LedgerCheck, ScopeTerms, ScopeView, markNotificationsRead(), TimelineView (+29 more)

### Community 16 - "server/src/index.ts"
Cohesion: 0.11
Nodes (24): APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, DISPUTE_TASK_NAME, DRAFT_TASK_NAME (+16 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.10
Nodes (45): ChangeOrdersView, ChangeOrderView, ChangeView, DeliverableKind, InvalidFieldsError, saveScope(), AddedStep, AddedStepRows() (+37 more)

### Community 18 - "ref_zod"
Cohesion: 0.06
Nodes (60): ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork() (+52 more)

### Community 19 - "question-routes.ts"
Cohesion: 0.07
Nodes (38): answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, attempt(), forward(), namedQuestion() (+30 more)

### Community 20 - "email/src/index.ts"
Cohesion: 0.09
Nodes (30): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError (+22 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.11
Nodes (33): runPrepared(), toCouncilRecord(), toJson(), usage, DraftJob, JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+25 more)

### Community 22 - "Secret"
Cohesion: 0.08
Nodes (19): linkBody, SELLER_APP_PATH, SellerAppLinking, sellerAppView, box, db, keys, SCOPES (+11 more)

### Community 23 - "timeline-routes.ts"
Cohesion: 0.18
Nodes (29): sendTimelineReminders(), view(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), OVERVIEW_LIMIT (+21 more)

### Community 24 - "tools.ts"
Cohesion: 0.09
Nodes (31): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+23 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.07
Nodes (59): draft(), unchanged(), `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, Engineering, TokenUsage, aggregate(), AggregateOptions (+51 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.11
Nodes (28): publishingBus(), result, loadConfigOrExit(), Config, formatErrors(), loadConfig(), CronStart, runCronJob() (+20 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.23
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, migrationStatus, readApplied() (+4 more)

### Community 28 - "PayPalRestClient"
Cohesion: 0.09
Nodes (24): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+16 more)

### Community 29 - "packet.ts"
Cohesion: 0.08
Nodes (31): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, ADDED_BY (+23 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.06
Nodes (71): AppealCheckView, AppealView, checkDisputes(), CouncilView, DisputesView, draftResponse(), getAppeal(), getResponses() (+63 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (45): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), scopeDraftCouncilTask() (+37 more)

### Community 32 - "notices.ts"
Cohesion: 0.12
Nodes (31): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+23 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (79): chosenDraft(), councilRecordSchema, isUnranked(), categoryLabels, describeDraft(), DraftView, priceMinor(), claimLines() (+71 more)

### Community 34 - "App.tsx"
Cohesion: 0.10
Nodes (33): signOut(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage, InsightsPage (+25 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.11
Nodes (25): StageView, BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent (+17 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.06
Nodes (65): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), documentFor(), fingerprinted() (+57 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.19
Nodes (11): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+3 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.08
Nodes (41): checkAnalysis(), ClaimContext, invalid(), readAnalysis(), AGREEMENT, CLAIM, context, ENTRIES (+33 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.09
Nodes (41): draftCategories, DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection() (+33 more)

### Community 40 - "errors.ts"
Cohesion: 0.08
Nodes (28): PayPalBuyerTestActions, dollar, setup(), MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer (+20 more)

### Community 41 - "getUser"
Cohesion: 0.12
Nodes (21): McpRouteOptions, Card, Notifier, PartyNotice, emailDelivery(), getUserEmail(), emailInvoice(), categoryLabels (+13 more)

### Community 42 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 43 - "config.ts"
Cohesion: 0.09
Nodes (23): ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue, isAiPart() (+15 more)

### Community 44 - "live-hub.ts"
Cohesion: 0.16
Nodes (9): BusSignal, LiveHub, LivePage, Online, PageState, warn(), LiveRouteOptions, markRead() (+1 more)

### Community 45 - "postgres.ts"
Cohesion: 0.11
Nodes (14): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgClient (+6 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.09
Nodes (27): LISTING_CACHE_SECONDS, ListingRouteOptions, LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, photosBody, SharedStore, Channel3Lookup (+19 more)

### Community 47 - "chat-state.ts"
Cohesion: 0.14
Nodes (24): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+16 more)

### Community 48 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+14 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.04
Nodes (79): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), agentBodySha256(), addArtifact(), ARTIFACT_KINDS (+71 more)

### Community 50 - "vitest"
Cohesion: 0.04
Nodes (129): db, agentDeal(), db, mcpClient(), ToolResult, chatDeal(), db, MessageBody (+121 more)

### Community 51 - "web/package.json"
Cohesion: 0.09
Nodes (21): @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/brand, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher (+13 more)

### Community 52 - "deals/routes.ts"
Cohesion: 0.08
Nodes (62): emailReceiptQuietly(), afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, chatRoutes(), messageView(), postBody, REFUSALS (+54 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.12
Nodes (25): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+17 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.08
Nodes (30): review(), at(), source(), seller(), `agent_requests`: what an agent asks the seller to let it do (8c), `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement (+22 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.06
Nodes (62): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+54 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (23): DeliveryCheckView, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, Transparency (+15 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.10
Nodes (34): allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate, steps (+26 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (38): disputes, parsed, USAGE, { rest, mcp, fallback, close }, send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, 1. Architecture and structure (+30 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.07
Nodes (40): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+32 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.09
Nodes (32): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, ChatLines(), ChatPane(), HIGHLIGHT (+24 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (22): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+14 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.08
Nodes (33): waitingDraft(), forwardInterruptedQuestions(), MAX_QUESTIONS_PER_DEAL, ANSWER, at(), awaiting(), db, SHA (+25 more)

### Community 68 - "Insights.tsx"
Cohesion: 0.08
Nodes (30): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, title(), InsightRow, Insights() (+22 more)

### Community 69 - "draft-routes.ts"
Cohesion: 0.08
Nodes (37): checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), looks(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+29 more)

### Community 70 - "auth/sign-in.ts"
Cohesion: 0.08
Nodes (42): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, db, backHome(), CALLBACK_PATH, callbackQuery (+34 more)

### Community 71 - "disputes/test-support.ts"
Cohesion: 0.03
Nodes (107): types(), entriesOf(), invoiceEntries(), queuedDrafting(), ActionsView, confirmed(), db, disputedDeal() (+99 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (56): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+48 more)

### Community 74 - "app.ts"
Cohesion: 0.10
Nodes (22): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+14 more)

### Community 75 - "live/src/index.ts"
Cohesion: 0.16
Nodes (20): liveQuery, liveRoutes(), check(), originAllowed(), rawText(), rateLimiter(), bySide, chatMessageSchema (+12 more)

### Community 76 - "checker.ts"
Cohesion: 0.11
Nodes (17): BUTTON_WINDOW_MS, checkKey(), CheckRequest, ClaimRunner, inProcessChecker(), renderClaimRunner(), renderDraftStarter(), sameWorkflowTask() (+9 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.06
Nodes (36): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+28 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "vitest"
Cohesion: 0.06
Nodes (52): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, ClaimJobDeps (+44 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 83 - "seller-connections.ts"
Cohesion: 0.13
Nodes (21): linkedSeller(), `acceptances`: signed agreements, `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow (+13 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.11
Nodes (14): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+6 more)

### Community 87 - "postStep"
Cohesion: 0.16
Nodes (28): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+20 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "Database"
Cohesion: 0.05
Nodes (73): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), AppOptions, SignInOptions (+65 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "chat-api.ts"
Cohesion: 0.13
Nodes (22): StepView, getPastedChats(), getTimeline(), isChat(), isMessage(), isNotification(), isPasted(), isRunningStep() (+14 more)

### Community 92 - "linked-apps.test.ts"
Cohesion: 0.18
Nodes (17): signedPayPal(), fakeWriter(), app, fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup() (+9 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "bus.ts"
Cohesion: 0.15
Nodes (12): Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), CHAT_CHANNEL, ChatEvent (+4 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (126): AgentRequestsPanel(), addBuyer(), addPastedChat(), AgentRequestView, analysesUrl(), answerAgentRequest(), AnswerOptionView, buildPacket() (+118 more)

### Community 97 - "render.ts"
Cohesion: 0.13
Nodes (19): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+11 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

### Community 101 - "db/src/index.ts"
Cohesion: 0.03
Nodes (126): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest(), claimAgentRequest(), createAgentRequest() (+118 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "IntakePanel.tsx"
Cohesion: 0.12
Nodes (26): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+18 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "scope-draft/src/council-task.ts"
Cohesion: 0.15
Nodes (18): JsonSchema, RankingPromptInput, RANK_CRITERIA, ScopeDraftTask, buildScopeDraftMessages(), listOf(), renderChat(), SCOPE_DRAFT_PROMPT_VERSION (+10 more)

### Community 106 - "build.ts"
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, marked

### Community 107 - "react"
Cohesion: 0.03
Nodes (107): BrandLogo(), BrandName, LOGOS, BUILD, Gate, sceneOf(), SEND, Agents() (+99 more)

### Community 108 - "runtime.ts"
Cohesion: 0.22
Nodes (11): logProgress(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), MAX_CONCURRENT_COUNCILS, clients, parsed (+3 more)

### Community 109 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 110 - "Demo plan"
Cohesion: 0.12
Nodes (16): Buyers (each: a sandbox **Personal** account with the same email, to pay invoices), Cast, Chats, Demo plan, Maya's book of deals (written work only), Rules, Sellers (each: a sandbox **Business** account plus a REST app linked in PactPal), Story 1: Maya and Chris, a clean deal (nothing goes wrong) (+8 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "QuestionsPanel.tsx"
Cohesion: 0.21
Nodes (16): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+8 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.25
Nodes (8): AI, Decisions, Demo (9b), Partner tools, Product, Redesign (Phase 7R), Render (9R), Retention and privacy (9c)

### Community 119 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+23 more)

### Community 120 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "markWords"
Cohesion: 0.21
Nodes (10): ChangeSummary(), ChangeFacts, changeLines(), dayOrNone(), NONE, LineMark, markedLine(), markWords() (+2 more)

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

### Community 128 - "docs/package.json"
Cohesion: 0.11
Nodes (17): devDependencies, tsx, @types/node, @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/brand, tsx (+9 more)

### Community 129 - "overview.ts"
Cohesion: 0.20
Nodes (9): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), StepProgress (+1 more)

### Community 130 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 131 - "ChangeOrderPanel"
Cohesion: 0.19
Nodes (15): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), isChangeOrders(), proposeChange(), withdrawChange() (+7 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

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

### Community 150 - "claim-job.ts"
Cohesion: 0.09
Nodes (55): appealApplies(), appealFacts(), RunnerBusyError, Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf() (+47 more)

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

### Community 158 - "draft-changes.ts"
Cohesion: 0.21
Nodes (12): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+4 more)

### Community 159 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 160 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "keyvalue.ts"
Cohesion: 0.21
Nodes (5): connectKeyValue(), keyValueStore(), memoryStore(), RedisCommands, redis

### Community 165 - "server/package.json"
Cohesion: 0.06
Nodes (32): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+24 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "TimelineStep"
Cohesion: 0.23
Nodes (10): ChangeProposal, ScopeInput, DraftFill, dated(), DraftedItem, DraftedStep, planFromDraft(), same() (+2 more)

### Community 168 - "retention.ts"
Cohesion: 0.24
Nodes (11): `retention_runs`: each daily clean-up (9c), allowPurge(), countOf(), Cutoff, dealsDue(), LOOSE_DATA, LooseKind, purgeDeal() (+3 more)

### Community 169 - "deliveries.test.ts"
Cohesion: 0.22
Nodes (10): ArtifactKind, AnswerInput, at(), db, delivered(), png, store, types() (+2 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (19): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+11 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "sellerAppRoutes"
Cohesion: 0.60
Nodes (6): paypalUnavailable(), sellerAppRoutes(), registerAlerts(), removeAlerts(), sellerWebhookUrl(), setOwnAppWebhook()

### Community 174 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react

### Community 175 - "ref_zod"
Cohesion: 0.07
Nodes (47): DealCards, ChatRouteOptions, AcceptanceRouteOptions, DealLookup, dealParams, featureAnswers(), FoundDeal, Refusal (+39 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "TimelineEditor.tsx"
Cohesion: 0.47
Nodes (5): LABEL, OwnFields(), pointedWords(), StepTargets, TimelineEditor()

### Community 180 - "design/tokens.ts"
Cohesion: 0.19
Nodes (19): applyTokens(), MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg() (+11 more)

### Community 181 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 186 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 189 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, marked, mermaid, @pactpal/brand

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

## Knowledge Gaps
- **134 isolated node(s):** `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`, `@pactpal/brand`, `mermaid` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1995 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `layouts.tsx`, `DeliverPanel.tsx`, `sandbox-partner-report.ts`, `dayWords`, `utcDateTime`, `claims/src/index.ts`, `mcp.ts`, `db/src/testing.ts`, `chat.ts`, `change-orders.ts`, `DealPage.tsx`, `ref_zod`, `email/src/index.ts`, `draft-job.ts`, `Secret`, `council/src/index.ts`, `db/src/migrate.ts`, `PayPalRestClient`, `packet.ts`, `web/src/format.ts`, `scope-draft/src/testing.ts`, `scope-draft/src/index.ts`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `errors.ts`, `build.js`, `config.ts`, `postgres.ts`, `products/src/index.ts`, `chat-state.ts`, `ledger/src/index.ts`, `resend-inbound.ts`, `action-routes.ts`, `timeline/src/index.ts`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `paypal-webhook.ts`, `scope-drafts.ts`, `Insights.tsx`, `auth/sign-in.ts`, `disputes/test-support.ts`, `sandbox-respond-report.ts`, `app.ts`, `live/src/index.ts`, `checker.ts`, `vitest`, `seller-connections.ts`, `Database`, `linked-apps.test.ts`, `sandbox-webhook-report.ts`, `bus.ts`, `api.ts`, `render.ts`, `check-words.ts`, `db/src/index.ts`, `IntakePanel.tsx`, `scope-draft/src/council-task.ts`, `react`, `runtime.ts`, `Ledger.tsx`, `package.json`, `markWords`, `overview.ts`, `MessagesPanel.tsx`, `draft-changes.ts`, `confirmation.ts`, `keyvalue.ts`, `TimelineStep`, `deliveries.test.ts`, `pages.ts`, `design/tokens.ts`, `log-labels.test.ts`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `design/parts.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1014799154334038 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `Built (sub-phases 2b to 6h-1)`, `timeline-routes.ts`, `council/src/index.ts`, `paypal/src/index.ts`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10512820512820513 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `paypal/src/index.ts`, `delivery-routes.ts`, `ref_zod`, `email/src/index.ts`, `Secret`, `PayPalRestClient`, `packet.ts`, `web/src/format.ts`, `scope-draft/src/index.ts`, `ledger/src/index.ts`, `vitest`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `paypal/src/index.ts`, `vitest`, `seller-connections.ts`, `Database`, `linked-apps.test.ts`, `Decisions`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.03553719008264463 - nodes in this community are weakly interconnected._