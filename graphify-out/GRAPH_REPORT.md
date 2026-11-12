# Graph Report - paypal-hackathon  (2026-11-12)

## Corpus Check
- 807 files · ~519,170 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6217 nodes · 19774 edges · 231 communities (208 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 554 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5392011f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- PayPalRestClient
- testId
- change-order-routes.ts
- DealPage.tsx
- when
- milestone-routes.ts
- access.ts
- receipt.ts
- db/src/index.ts
- claims/src/index.ts
- acceptance-routes.ts
- tools.ts
- deals.ts
- DeliveriesPanel.tsx
- Database
- app.test.ts
- ChangeOrderPanel.tsx
- sandbox-check.ts
- deals/routes.ts
- .query
- postgresContentStore
- vitest
- record.ts
- delivery-routes.ts
- council/src/index.ts
- disputes/task.ts
- qa/src/index.ts
- net/src/index.ts
- eval-judge.ts
- chat-api.ts
- scope-draft/src/testing.ts
- actions.ts
- scope-draft/src/index.ts
- stories.test.ts
- email/src/index.ts
- action-routes.ts
- layouts.tsx
- claim-job.ts
- eval-report.ts
- claim-analyses.ts
- testId
- emailFrom
- buildApp
- chat-routes.ts
- postgres.ts
- listing-routes.ts
- packet-service.ts
- web/package.json
- ledger/src/index.ts
- paypal/src/index.ts
- deadline-rows.ts
- validate.ts
- resend-inbound.ts
- dispute-actions.ts
- postStep
- verify
- delivery-check.test.ts
- timeline/src/index.ts
- PayPalResult
- completeness.ts
- task.test.ts
- DraftReview.tsx
- services
- Deadlines.tsx
- scripts
- db/package.json
- dispute-sync.ts
- overview.ts
- delivery-check-routes.ts
- Insights.tsx
- QuestionsPanel.tsx
- claims/package.json
- invoices.ts
- council-record.ts
- auth/sign-in.ts
- delivery-check/src/index.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- draft-routes.ts
- appeal-items.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- devDependencies
- products/package.json
- change-orders.ts
- ai/package.json
- sandbox-respond-report.ts
- notices.ts
- scripts
- ref_node_crypto
- packet.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- draft-changes.ts
- Agents.tsx
- make_content.py
- scripts
- council/package.json
- sessions.ts
- templates.ts
- landing-words.ts
- design/parts.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- TimelineStep
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- config.ts
- compilerOptions
- Build plan
- image.ts
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- IntakePanel.tsx
- appeal.test.ts
- pdf/package.json
- README.md
- Built (sub-phases 2b to 6h-1)
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
- checker.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- TimelineEditor.tsx
- Nav.tsx
- log-labels.ts
- .prettierrc.json
- products/tsconfig.json
- Tour.tsx
- server/package.json
- docs/tsconfig.json
- Landing.tsx
- injection-runner.ts
- Secret
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- gantt-rows.ts
- Layout
- eval-runner.test.ts
- vite-env.d.ts
- src-app-tsx.md
- Phase 7 (deal space)
- app-link-routes.ts
- design/tokens.ts
- receipt.test.ts
- build.js
- runner.test.ts
- PayPal sandbox notes
- src/intake.ts
- Hero.tsx
- Getting started
- brand/package.json
- @pactpal/ai@workspace:*
- log-labels.test.ts
- request-routes.ts
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
- brand/src/index.ts
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- council
- Pillars.tsx
- draft-job.ts
- src/reminders.ts
- pg@^8.23.1
- zod@^4.6.7
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- listing-routes.ts
- canonical-host.test.ts
- RedisCommands
- source
- @modelcontextprotocol/sdk@1.32.1
- StandInEmailSender
- @fastify/websocket
- @pactpal/council@workspace:*
- @pactpal/db@workspace:*
- @pactpal/ledger@workspace:*
- @pactpal/scope-draft@workspace:*
- @pactpal/score@workspace:*
- @pactpal/timeline@workspace:*
- @pactpal/watcher@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 233 edges
2. `Database` - 134 edges
3. `testId()` - 126 edges
4. `readLedger()` - 94 edges
5. `useMigratedTestDatabase()` - 88 edges
6. `sha256Hex()` - 86 edges
7. `react` - 80 edges
8. `appendLedgerEvent()` - 75 edges
9. `isObject()` - 74 edges
10. `TEST_NOW` - 74 edges

## Surprising Connections (you probably didn't know these)
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts

## Import Cycles
- None detected.

## Communities (231 total, 23 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.06
Nodes (45): signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage, DisputePage (+37 more)

### Community 1 - "PayPalRestClient"
Cohesion: 0.05
Nodes (48): checkMcp(), Receiver, PayPalBuyerTestActions, dollar, setup(), PayPalMcpError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+40 more)

### Community 2 - "testId"
Cohesion: 0.04
Nodes (82): db, signedPayPal(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+74 more)

### Community 3 - "change-order-routes.ts"
Cohesion: 0.10
Nodes (32): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody (+24 more)

### Community 4 - "DealPage.tsx"
Cohesion: 0.08
Nodes (47): checkLedger(), getDeal(), getMe(), LedgerCheck, listDeals(), ScopeTerms, ScopeView, StepView (+39 more)

### Community 5 - "when"
Cohesion: 0.06
Nodes (76): analysesUrl(), AppealCheckView, AppealView, checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+68 more)

### Community 6 - "milestone-routes.ts"
Cohesion: 0.12
Nodes (25): answer(), sellerApp(), paypalProblem(), sendBody, SendOutcome, sendToPayPal(), stageParams, stageView() (+17 more)

### Community 7 - "access.ts"
Cohesion: 0.13
Nodes (38): sendTimelineReminders(), dealAccess(), dealParams, FoundDeal, Refusal, dealCompleteness(), judgedScope(), completenessRoutes() (+30 more)

### Community 8 - "receipt.ts"
Cohesion: 0.11
Nodes (33): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+25 more)

### Community 9 - "db/src/index.ts"
Cohesion: 0.02
Nodes (172): disputeRoutes(), sendDisputeNotices(), sentStage(), ArtifactKind, listArtifacts(), CHAT_CHANNEL, chatEventSchema, parseChatEvent() (+164 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.10
Nodes (50): Prepared, candidates(), JsonReply, parseJsonReply(), tryParse(), ChatOutcome, AppealCheck, AppealContext (+42 more)

### Community 11 - "acceptance-routes.ts"
Cohesion: 0.09
Nodes (34): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent() (+26 more)

### Community 12 - "tools.ts"
Cohesion: 0.10
Nodes (30): actingAs(), routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext (+22 more)

### Community 13 - "deals.ts"
Cohesion: 0.10
Nodes (30): seedContext(), AddBuyer, addBuyer(), addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, DEAL_KINDS, DealCategory (+22 more)

### Community 14 - "DeliveriesPanel.tsx"
Cohesion: 0.08
Nodes (43): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), CompletenessItem, CompletenessView, deliveriesUrl() (+35 more)

### Community 15 - "Database"
Cohesion: 0.06
Nodes (51): McpRouteOptions, AppOptions, SignInOptions, Notifier, NotifierOptions, ReminderDeps, DealLookup, ChangeOrderRouteOptions (+43 more)

### Community 16 - "app.test.ts"
Cohesion: 0.12
Nodes (21): closeOnSignals(), socketOrigin(), report, setup(), ConfigReport, result, assertUnchanged(), assertWellFormed() (+13 more)

### Community 17 - "ChangeOrderPanel.tsx"
Cohesion: 0.06
Nodes (70): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+62 more)

### Community 18 - "sandbox-check.ts"
Cohesion: 0.12
Nodes (21): APP_KEYS, PayPalApp, checkAsSellerApp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+13 more)

### Community 19 - "deals/routes.ts"
Cohesion: 0.08
Nodes (53): notificationRoutes(), visibleDeal(), readBody(), requireViewer(), ConversationRouteOptions, conversationRoutes(), preview(), PREVIEW_CHARS (+45 more)

### Community 20 - ".query"
Cohesion: 0.03
Nodes (135): disputedDeal(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema (+127 more)

### Community 21 - "postgresContentStore"
Cohesion: 0.08
Nodes (36): afterQuery, chatNames(), ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, attachmentHeader() (+28 more)

### Community 22 - "vitest"
Cohesion: 0.03
Nodes (163): agentDeal(), db, db, chatDeal(), db, MessageBody, db, liveDeal() (+155 more)

### Community 23 - "record.ts"
Cohesion: 0.10
Nodes (28): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+20 more)

### Community 24 - "delivery-routes.ts"
Cohesion: 0.11
Nodes (34): sendRefusal(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+26 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (46): JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.10
Nodes (30): Config, CronStart, runCronJob(), SEED_TASK_NAME, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME (+22 more)

### Community 27 - "qa/src/index.ts"
Cohesion: 0.08
Nodes (51): MESSAGE_PROMPT_VERSIONS, MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText (+43 more)

### Community 28 - "net/src/index.ts"
Cohesion: 0.06
Nodes (59): checks, ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+51 more)

### Community 29 - "eval-judge.ts"
Cohesion: 0.11
Nodes (30): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+22 more)

### Community 30 - "chat-api.ts"
Cohesion: 0.07
Nodes (54): chatUrl(), ChatView, getChat(), getNotifications(), getPastedChats(), isChat(), isMessage(), isNotification() (+46 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (34): two, input, numbered, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines() (+26 more)

### Community 32 - "actions.ts"
Cohesion: 0.06
Nodes (117): RouteAnswer, FILE_NAME_HEADER, addBuyer(), AgreementForm, answerDelivery(), askQuestion(), callAs(), chat() (+109 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.06
Nodes (54): claimLines(), linesOf(), RANK_CRITERIA, ScopeDraftTask, findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction() (+46 more)

### Community 34 - "stories.test.ts"
Cohesion: 0.12
Nodes (23): BOOK, db, runOptions, seedApp(), runStory(), contentReader(), databaseProgress(), demoContentDir() (+15 more)

### Community 35 - "email/src/index.ts"
Cohesion: 0.09
Nodes (34): NOTICE_LOOK, EmailTemplates, ENTITIES, entity(), htmlToText(), emailAttachmentSchema, ReadResult, ReceivedEmail (+26 more)

### Community 36 - "action-routes.ts"
Cohesion: 0.09
Nodes (41): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+33 more)

### Community 37 - "layouts.tsx"
Cohesion: 0.05
Nodes (101): Me, Money, CommandPalette(), PLACES, Dashboard(), DealList(), Cell, COLUMNS (+93 more)

### Community 38 - "claim-job.ts"
Cohesion: 0.12
Nodes (44): appealApplies(), appealFacts(), RunnerBusyError, Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf() (+36 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.13
Nodes (33): draftCategories, aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed() (+25 more)

### Community 40 - "claim-analyses.ts"
Cohesion: 0.05
Nodes (43): refusal(), ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord (+35 more)

### Community 41 - "testId"
Cohesion: 0.06
Nodes (56): mcpClient(), ToolResult, dealWithBuyer(), addCard(), db, goodsDeal(), SCOPE, WEBP (+48 more)

### Community 42 - "emailFrom"
Cohesion: 0.18
Nodes (24): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+16 more)

### Community 43 - "buildApp"
Cohesion: 0.11
Nodes (21): buildApp(), requestLog(), setup(), setup(), envelope, ParsedJson, parseJson(), PayPalWebhookOptions (+13 more)

### Community 44 - "chat-routes.ts"
Cohesion: 0.07
Nodes (26): BusSignal, ChatBus, Listen, listeners(), memoryBus(), db, hubOnTestDeal(), HubOptions (+18 more)

### Community 45 - "postgres.ts"
Cohesion: 0.08
Nodes (18): connect(), Row, connectPostgres(), databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions (+10 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.13
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, fakeChannel3(), NOW, attributeName(), capped() (+12 more)

### Community 47 - "packet-service.ts"
Cohesion: 0.17
Nodes (25): packetFilename(), packetMeter(), pdfNameOf(), planExhibits(), renderPacket(), buildBody, exhibitParams, packetParams (+17 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (48): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+40 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.04
Nodes (91): one(), DISPUTE_EVENT_PREFIX, db, agentBodySha256(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactIntegrityError, ArtifactLimits (+83 more)

### Community 50 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (32): formatLinkPreview(), DisputeActionNotAllowed, EvidenceFileError, PayPalApiError, PayPalErrorDetail, PayPalNetworkError, CheckedEvidenceFile, checkEvidenceFiles() (+24 more)

### Community 51 - "deadline-rows.ts"
Cohesion: 0.29
Nodes (11): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+3 more)

### Community 52 - "validate.ts"
Cohesion: 0.15
Nodes (25): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+17 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.17
Nodes (20): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+12 more)

### Community 54 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (22): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+14 more)

### Community 55 - "postStep"
Cohesion: 0.13
Nodes (32): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+24 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.12
Nodes (27): Deal space (Phase 7), allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate (+19 more)

### Community 59 - "PayPalResult"
Cohesion: 0.06
Nodes (40): send(), `buyer_questions`: questions about the agreement before signing, Engineering, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer (+32 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "task.test.ts"
Cohesion: 0.10
Nodes (28): model(), isRanking(), member(), model(), model(), db, env, treeOfRuns() (+20 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.12
Nodes (26): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, DraftView, FillChat, fillFrom() (+18 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Deadlines.tsx"
Cohesion: 0.17
Nodes (11): @bryntum/scheduler-react-enterprise@8.0.0, BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, hasEvidence(), COLUMNS, LABELS (+3 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "dispute-sync.ts"
Cohesion: 0.15
Nodes (21): DisputeReader, LinkedDisputeAccount, changedSince(), Counts, DisputeSyncDeps, readTooSoon(), readVersionOf(), sameSecond() (+13 more)

### Community 68 - "overview.ts"
Cohesion: 0.26
Nodes (9): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+1 more)

### Community 69 - "delivery-check-routes.ts"
Cohesion: 0.14
Nodes (24): featureAnswers(), checkBody, checkView(), deliveryCheckRoutes(), looks(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+16 more)

### Community 70 - "Insights.tsx"
Cohesion: 0.13
Nodes (20): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+12 more)

### Community 71 - "QuestionsPanel.tsx"
Cohesion: 0.21
Nodes (16): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), DealSummary, ForwardReason, getQuestions(), isQuestions(), questionStep() (+8 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "invoices.ts"
Cohesion: 0.07
Nodes (34): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem (+26 more)

### Community 74 - "council-record.ts"
Cohesion: 0.16
Nodes (16): chosenDraft(), CouncilRecord, councilRecordSchema, isUnranked(), usage, categoryLabels, describeDraft(), draftView() (+8 more)

### Community 75 - "auth/sign-in.ts"
Cohesion: 0.13
Nodes (19): backHome(), CALLBACK_PATH, callbackQuery, cookieRules, LOGOUT_PATH, ME_PATH, RETURN_COOKIE, sameSecret() (+11 more)

### Community 76 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (23): CheckedFile, CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, ImageFacts (+15 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (25): Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+17 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.11
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/ledger@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.12
Nodes (21): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2 (+13 more)

### Community 81 - "ai/src/index.ts"
Cohesion: 0.13
Nodes (25): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, DEFAULT_MODEL (+17 more)

### Community 82 - "draft-routes.ts"
Cohesion: 0.14
Nodes (20): CHAT_TRANSCRIPT_PREFIX, draftParams, draftRoutes(), beginDraft(), sourceFile(), fromChatBody, REFUSALS, startBody (+12 more)

### Community 83 - "appeal-items.ts"
Cohesion: 0.11
Nodes (18): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, ADDED_BY (+10 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "change-orders.ts"
Cohesion: 0.04
Nodes (66): AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError, ChangeOrderRefusal (+58 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (95): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+87 more)

### Community 92 - "notices.ts"
Cohesion: 0.28
Nodes (13): DueNotice, emailFor(), EVENT_KINDS, NOTICE_WINDOW_MS, REMINDER_MARKS, withoutRepeats(), disputeChangedEmail(), disputeDecidedEmail() (+5 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "ref_node_crypto"
Cohesion: 0.11
Nodes (16): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+8 more)

### Community 95 - "packet.ts"
Cohesion: 0.12
Nodes (21): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, exhibitWhat(), HOW_TO_CHECK, LeftOut, ORDER (+13 more)

### Community 96 - "api.ts"
Cohesion: 0.03
Nodes (130): AgentRequestsPanel(), addBuyer(), addFile(), addPastedChat(), AgentRequestView, answerAgentRequest(), AnswerOptionView, buildPacket() (+122 more)

### Community 97 - "render.ts"
Cohesion: 0.10
Nodes (25): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, ACCENT_INK, Branding, CharacterSet (+17 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "draft-changes.ts"
Cohesion: 0.19
Nodes (13): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+5 more)

### Community 101 - "Agents.tsx"
Cohesion: 0.15
Nodes (15): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+7 more)

### Community 103 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "sessions.ts"
Cohesion: 0.21
Nodes (15): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, currentSession(), setSessionCookie(), dealBuyer, linkRow (+7 more)

### Community 106 - "templates.ts"
Cohesion: 0.19
Nodes (11): EMAIL_LOGO_PATH, emailLogo(), loadEmailTemplates(), repoFolder(), templatesDir(), loaded, app, root (+3 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.13
Nodes (26): LogoMark(), Audience(), GLYPHS, SPOTS, Sticker(), at(), Closing(), LIMIT_GLYPHS (+18 more)

### Community 108 - "design/parts.tsx"
Cohesion: 0.10
Nodes (36): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+28 more)

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

### Community 114 - "TimelineStep"
Cohesion: 0.23
Nodes (10): ChangeProposal, ScopeInput, DraftFill, dated(), DraftedItem, DraftedStep, planFromDraft(), same() (+2 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.20
Nodes (10): AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product, Redesign (Phase 7R) (+2 more)

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @pactpal/email@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:*, @pactpal/words@workspace:* (+10 more)

### Community 120 - "config.ts"
Cohesion: 0.06
Nodes (39): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors() (+31 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

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

### Community 129 - "IntakePanel.tsx"
Cohesion: 0.13
Nodes (24): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+16 more)

### Community 130 - "appeal.test.ts"
Cohesion: 0.11
Nodes (16): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+8 more)

### Community 131 - "pdf/package.json"
Cohesion: 0.13
Nodes (16): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+8 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (22): seller(), outcome(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record, `deal_messages`: the deal's chat (7b) (+14 more)

### Community 134 - "PactPal"
Cohesion: 0.17
Nodes (12): Changing emails, Code map, Connect your agent (MCP), Deploying to Render, Disclaimer, Docs, License, PactPal (+4 more)

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

### Community 150 - "checker.ts"
Cohesion: 0.10
Nodes (25): postgresBus(), publishingBus(), BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), inProcessClaimRunner(), renderClaimRunner() (+17 more)

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

### Community 158 - "TimelineEditor.tsx"
Cohesion: 0.36
Nodes (7): LABEL, OwnFields(), pointedWords(), StepTargets, TimelineEditor(), MAX_TIMELINE_STEPS, moveStep()

### Community 159 - "Nav.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

### Community 160 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Tour.tsx"
Cohesion: 0.09
Nodes (18): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+10 more)

### Community 165 - "server/package.json"
Cohesion: 0.13
Nodes (14): @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/live@workspace:*, @pactpal/qa@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/qa, name (+6 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "Landing.tsx"
Cohesion: 0.15
Nodes (8): ART, at(), dots(), Features(), at(), Moves(), SHOTS, useScrollStory()

### Community 168 - "injection-runner.ts"
Cohesion: 0.11
Nodes (26): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), DroppedDraft, droppedSection(), ruleOf() (+18 more)

### Community 169 - "Secret"
Cohesion: 0.05
Nodes (42): RFC-2606, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+34 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.12
Nodes (27): css, dist, faces, FONTS, home, problems, root, anchorOf() (+19 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "gantt-rows.ts"
Cohesion: 0.17
Nodes (14): StageView, RunningStepView, COLUMNS, DealGantt(), LOCKED, presetFor(), STATE_WORDS, doneDay() (+6 more)

### Community 174 - "Layout"
Cohesion: 0.25
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 175 - "eval-runner.test.ts"
Cohesion: 0.19
Nodes (10): councilDeps(), councilRecordOf(), isRankingRequest(), down, invented, wrongCategory, chatLines(), draftFor() (+2 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 179 - "app-link-routes.ts"
Cohesion: 0.22
Nodes (13): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+5 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "receipt.test.ts"
Cohesion: 0.24
Nodes (10): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, buildReceipt(), receiptFormatAt(), ReceiptIntegrityError, document, signed(), SIGNED_AT (+2 more)

### Community 182 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 183 - "runner.test.ts"
Cohesion: 0.24
Nodes (8): council(), deps(), DRAFTS, isRankingCall(), ranking(), rankingRequests(), shown(), task

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 185 - "src/intake.ts"
Cohesion: 0.24
Nodes (10): CATEGORY_IDS, DEAL_CURRENCIES, IntakeKind, IntakeRefusal, keyRow, newAddressCode(), newKeySchema, newSecret() (+2 more)

### Community 186 - "Hero.tsx"
Cohesion: 0.27
Nodes (9): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters() (+1 more)

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 190 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 191 - "request-routes.ts"
Cohesion: 0.27
Nodes (9): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser(), AgentRequest (+1 more)

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

### Community 206 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 209 - "council"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 210 - "Pillars.tsx"
Cohesion: 0.17
Nodes (17): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+9 more)

### Community 211 - "draft-job.ts"
Cohesion: 0.38
Nodes (7): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, runDraftJob(), runMessageJob()

### Community 212 - "src/reminders.ts"
Cohesion: 0.27
Nodes (7): addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now, ResolvedStep

### Community 217 - "listing-routes.ts"
Cohesion: 0.18
Nodes (15): isPicture(), LISTING_CACHE_SECONDS, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+7 more)

### Community 218 - "canonical-host.test.ts"
Cohesion: 0.53
Nodes (4): canonicalRedirect(), NEVER_MOVED, registerCanonicalHost(), move()

### Community 219 - "RedisCommands"
Cohesion: 0.24
Nodes (3): keyValueStore(), memoryStore(), RedisCommands

### Community 220 - "source"
Cohesion: 0.33
Nodes (6): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1842 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `PayPalRestClient`, `testId`, `DealPage.tsx`, `when`, `milestone-routes.ts`, `receipt.ts`, `db/src/index.ts`, `deals.ts`, `DeliveriesPanel.tsx`, `app.test.ts`, `ChangeOrderPanel.tsx`, `sandbox-check.ts`, `.query`, `record.ts`, `council/src/index.ts`, `qa/src/index.ts`, `net/src/index.ts`, `eval-judge.ts`, `chat-api.ts`, `scope-draft/src/testing.ts`, `actions.ts`, `scope-draft/src/index.ts`, `stories.test.ts`, `email/src/index.ts`, `action-routes.ts`, `layouts.tsx`, `eval-report.ts`, `claim-analyses.ts`, `testId`, `emailFrom`, `buildApp`, `chat-routes.ts`, `postgres.ts`, `listing-routes.ts`, `ledger/src/index.ts`, `paypal/src/index.ts`, `deadline-rows.ts`, `validate.ts`, `postStep`, `delivery-check.test.ts`, `timeline/src/index.ts`, `PayPalResult`, `completeness.ts`, `task.test.ts`, `DraftReview.tsx`, `Deadlines.tsx`, `dispute-sync.ts`, `overview.ts`, `Insights.tsx`, `invoices.ts`, `council-record.ts`, `auth/sign-in.ts`, `ai/src/index.ts`, `draft-routes.ts`, `appeal-items.ts`, `change-orders.ts`, `sandbox-respond-report.ts`, `ref_node_crypto`, `packet.ts`, `api.ts`, `render.ts`, `draft-changes.ts`, `Agents.tsx`, `templates.ts`, `landing-words.ts`, `devDependencies`, `TimelineStep`, `Ledger.tsx`, `package.json`, `config.ts`, `IntakePanel.tsx`, `appeal.test.ts`, `checker.ts`, `Nav.tsx`, `injection-runner.ts`, `Secret`, `pages.ts`, `gantt-rows.ts`, `eval-runner.test.ts`, `design/tokens.ts`, `receipt.test.ts`, `runner.test.ts`, `log-labels.test.ts`, `src/reminders.ts`, `listing-routes.ts`, `canonical-host.test.ts`, `RedisCommands`?**
  _High betweenness centrality (0.234) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06110102843315184 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `Deadlines.tsx`, `README.md`, `timeline/src/index.ts`, `PayPalResult`, `source`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `PayPalRestClient` be split into smaller, more focused modules?**
  _Cohesion score 0.04715189873417722 - nodes in this community are weakly interconnected._
- **Why does `react` connect `DealPage.tsx` to `App.tsx`, `IntakePanel.tsx`, `when`, `receipt.ts`, `DeliveriesPanel.tsx`, `ChangeOrderPanel.tsx`, `chat-api.ts`, `Nav.tsx`, `Tour.tsx`, `layouts.tsx`, `Landing.tsx`, `gantt-rows.ts`, `web/package.json`, `postStep`, `Hero.tsx`, `Deadlines.tsx`, `Insights.tsx`, `QuestionsPanel.tsx`, `brand/src/index.ts`, `Pillars.tsx`, `api.ts`, `Agents.tsx`, `landing-words.ts`, `design/parts.tsx`, `Ledger.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `testId` be split into smaller, more focused modules?**
  _Cohesion score 0.0425160163075131 - nodes in this community are weakly interconnected._