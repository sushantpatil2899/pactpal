# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 768 files · ~506,057 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 5896 nodes · 18429 edges · 206 communities (201 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 519 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2d0cd497`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- src/intake.ts
- appendLedgerEvent
- Dashboard.tsx
- DeliveriesPanel.tsx
- sandbox-partner-report.ts
- notices.ts
- MessagesPage.tsx
- receipt.ts
- email/src/index.ts
- claims/src/index.ts
- draft-routes.ts
- testId
- SellerAppPanel.tsx
- change-orders.ts
- readChecked
- PayPalResult
- ScopePanel.tsx
- ref_zod
- question-routes.ts
- deliveries.ts
- draft-job.ts
- resend-inbound.ts
- when
- Database
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- app-link-routes.ts
- ai/src/index.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- App.tsx
- deadline-rows.ts
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- errors.ts
- layouts.tsx
- build.js
- config.ts
- notifier.ts
- acceptance-routes.ts
- products/src/index.ts
- Insights.tsx
- scope-draft/src/council-task.ts
- ledger/src/index.ts
- test-app.ts
- web/package.json
- chat-routes.ts
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- sellers/disputes.test.ts
- DraftReview.tsx
- services
- seller-connections.ts
- scripts
- db/package.json
- postgresContentStore
- retention.test.ts
- deals/routes.ts
- postgres.ts
- TEST_NOW
- claims/package.json
- sandbox-respond-report.ts
- Database
- verifyStoredLedger
- Landing.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- eval-runner.ts
- disputes/test-support.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- routes.ts
- ai/package.json
- question-routes.test.ts
- readLedger
- scripts
- sandbox-webhook-report.ts
- src/summary.test.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- Secret
- db/src/index.ts
- pdf/package.json
- landing-words.ts
- council/package.json
- DealPage.tsx
- dependencies
- AgentPanel.tsx
- appeal-items.ts
- draft
- auth/sign-in.ts
- score/package.json
- PactPal product spec
- devDependencies
- dispute-actions.ts
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- AcceptancePanel.tsx
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- keyvalue.ts
- Layout
- Nav.tsx
- README.md
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
- claim-job.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- vitest
- Pillars.tsx
- image.ts
- .prettierrc.json
- products/tsconfig.json
- Hero.tsx
- server/package.json
- docs/tsconfig.json
- MessagesPanel.tsx
- IntakePanel.tsx
- injection-check.ts
- Deadlines.tsx
- pages.ts
- index.md
- Redesign plan (proposed Phase 7R)
- QuestionsPanel.tsx
- resend-inbound.test.ts
- vite-env.d.ts
- src-app-tsx.md
- engines
- draft-changes.ts
- design/tokens.ts
- PayPal sandbox notes
- gantt-rows.ts
- brand/src/index.ts
- devDependencies
- build.ts
- log-labels.test.ts
- Getting started
- brand/package.json
- dependencies
- scripts
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- devDependencies
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy
- check-words.ts

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

## Communities (206 total, 5 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.13
Nodes (33): LinkProblem, redeemLink(), SIGN_IN_PATH, NewDealPage(), STAGE_ORDER, Deadlines, DeadlinesPage(), DealsPage() (+25 more)

### Community 1 - "src/intake.ts"
Cohesion: 0.07
Nodes (41): CATEGORY_IDS, DEAL_CURRENCIES, findIntakeKey(), IntakeKind, IntakeRefusal, keyRow, MAX_INTAKE_DEALS_PER_DAY, newAddressCode() (+33 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.06
Nodes (66): AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance(), declineTerms, declineTermsSchema, documentFingerprint() (+58 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (42): Money, CommandPalette(), PLACES, Dashboard(), DealList(), Cell, COLUMNS, DealsTable() (+34 more)

### Community 4 - "DeliveriesPanel.tsx"
Cohesion: 0.11
Nodes (33): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+25 more)

### Community 5 - "sandbox-partner-report.ts"
Cohesion: 0.08
Nodes (39): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+31 more)

### Community 6 - "notices.ts"
Cohesion: 0.13
Nodes (23): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+15 more)

### Community 7 - "MessagesPage.tsx"
Cohesion: 0.14
Nodes (25): Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People(), plainClick() (+17 more)

### Community 8 - "receipt.ts"
Cohesion: 0.09
Nodes (37): receiptBlocks(), AcceptanceDocument, checkPayments(), getMilestones(), isListingPreview(), isMilestones(), ListingPreview, ListingView (+29 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.08
Nodes (45): answerEmail(), AnswerFacts, revisionLine(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+37 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (68): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+60 more)

### Community 11 - "draft-routes.ts"
Cohesion: 0.11
Nodes (30): draftParams, draftRoutes(), beginDraft(), sourceFile(), fromChatBody, REFUSALS, startBody, sellerModelStep() (+22 more)

### Community 12 - "testId"
Cohesion: 0.06
Nodes (55): db, CALLBACK_PATH, RETURN_COOKIE, SESSION_COOKIE, STATE_COOKIE, db, dealWithBuyer(), maya (+47 more)

### Community 13 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.04
Nodes (85): acceptBody, waitingChange(), changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256 (+77 more)

### Community 15 - "readChecked"
Cohesion: 0.08
Nodes (39): DealSummary, getScope(), listDeals(), listFiles(), readChecked(), ScopeTerms, ScopeView, StageView (+31 more)

### Community 16 - "PayPalResult"
Cohesion: 0.08
Nodes (25): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), DisputeAnswer, DisputeList, EscalateInput, evidenceForm() (+17 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (71): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+63 more)

### Community 18 - "ref_zod"
Cohesion: 0.06
Nodes (46): defaultHttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork(), policy, Step, urlOf() (+38 more)

### Community 19 - "question-routes.ts"
Cohesion: 0.07
Nodes (44): featureAnswers(), step(), answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes() (+36 more)

### Community 20 - "deliveries.ts"
Cohesion: 0.11
Nodes (29): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, DeliveryFile, DeliveryNotAllowedError (+21 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.10
Nodes (41): DraftJob, MESSAGE_PROMPT_VERSIONS, MessageJob, ClaimContext, markedPrompt(), AnswerRefusal, CheckedAnswer, citation (+33 more)

### Community 22 - "resend-inbound.ts"
Cohesion: 0.08
Nodes (32): listQuery, NotificationRouteOptions, notificationRoutes(), readRequest, requireViewer(), ConversationRouteOptions, conversationRoutes(), preview() (+24 more)

### Community 23 - "when"
Cohesion: 0.10
Nodes (46): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+38 more)

### Community 24 - "Database"
Cohesion: 0.09
Nodes (36): ReceiptMailDeps, ReminderDeps, ChangeOrderRouteOptions, DeliveryRouteOptions, FileRouteOptions, ClaimJobDeps, DisputeReader, LinkedDisputeAccount (+28 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (45): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+37 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.05
Nodes (58): loadConfigOrExit(), pickModels(), selectedClientsOrExit(), formatErrors(), CronStart, runCronJob(), BUTTON_WINDOW_MS, checkKey() (+50 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.26
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+3 more)

### Community 28 - "app-link-routes.ts"
Cohesion: 0.06
Nodes (38): APP_KEYS, Config, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+30 more)

### Community 29 - "ai/src/index.ts"
Cohesion: 0.11
Nodes (29): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, candidates() (+21 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.10
Nodes (39): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftResponse(), draftStatement(), getAppeal(), getResponses() (+31 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.12
Nodes (33): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), baseLines() (+25 more)

### Community 32 - "validate.ts"
Cohesion: 0.10
Nodes (35): allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, UNCLEAR_CATEGORY, paymentFromShare(), Share, shareOf(), sharesIn() (+27 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (38): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+30 more)

### Community 34 - "App.tsx"
Cohesion: 0.10
Nodes (35): signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage (+27 more)

### Community 35 - "deadline-rows.ts"
Cohesion: 0.22
Nodes (13): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+5 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (48): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+40 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.16
Nodes (12): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+4 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.14
Nodes (20): checkAnalysis(), claimAnalysisSchema, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+12 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.14
Nodes (32): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+24 more)

### Community 40 - "errors.ts"
Cohesion: 0.10
Nodes (25): checkMcp(), PayPalErrorDetail, PayPalMcpError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, reasonOf(), invoice (+17 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.08
Nodes (31): Me, IconName, applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme(), Theme (+23 more)

### Community 42 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 43 - "config.ts"
Cohesion: 0.07
Nodes (34): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+26 more)

### Community 44 - "notifier.ts"
Cohesion: 0.05
Nodes (50): McpRouteOptions, BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), publishingBus() (+42 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.06
Nodes (59): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), fingerprinted(), money (+51 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.12
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 47 - "Insights.tsx"
Cohesion: 0.15
Nodes (18): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+10 more)

### Community 48 - "scope-draft/src/council-task.ts"
Cohesion: 0.10
Nodes (29): claimLines(), ClaimText, linesOf(), RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input (+21 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.09
Nodes (36): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), mediaTypeOf(), detectMediaType(), FileFingerprint (+28 more)

### Community 50 - "test-app.ts"
Cohesion: 0.05
Nodes (73): agentDeal(), db, mcpClient(), ToolResult, chatDeal(), db, MessageBody, Card (+65 more)

### Community 51 - "web/package.json"
Cohesion: 0.09
Nodes (22): @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/brand, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher (+14 more)

### Community 52 - "chat-routes.ts"
Cohesion: 0.05
Nodes (55): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatRouteOptions, messageView(), postBody, REFUSALS, attachmentHeader(), sendCheckedFile() (+47 more)

### Community 53 - "tools.ts"
Cohesion: 0.10
Nodes (29): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+21 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.08
Nodes (30): review(), at(), source(), seller(), `agent_requests`: what an agent asks the seller to let it do (8c), `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), Data model (+22 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (41): sendRefusal(), acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+33 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.15
Nodes (20): CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, Transparency, Mark, CheckedLook (+12 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.05
Nodes (86): ChatNames, chatRoutes(), sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes() (+78 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (52): argsSchema, InvoiceArgs, SeedArgs, Engineering, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime() (+44 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "sellers/disputes.test.ts"
Cohesion: 0.12
Nodes (22): db, invoiceEntries(), signedPayPal(), StageView, sentStage(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode (+14 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (41): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ScopeInput (+33 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "seller-connections.ts"
Cohesion: 0.09
Nodes (38): councilSummary, messageBody, messageRoutes(), reviewView(), revisionsOf(), workRecord(), REFUSALS, runMessageJob() (+30 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "postgresContentStore"
Cohesion: 0.08
Nodes (34): db, models(), store, councilOf(), db, draftedAs(), idOf(), readDraft() (+26 more)

### Community 68 - "retention.test.ts"
Cohesion: 0.15
Nodes (16): `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), allowPurge(), countOf(), Cutoff, DEAL_TABLES, LOOSE_DATA, LooseKind (+8 more)

### Community 69 - "deals/routes.ts"
Cohesion: 0.05
Nodes (72): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), DealCards, AcceptanceRouteOptions (+64 more)

### Community 70 - "postgres.ts"
Cohesion: 0.16
Nodes (11): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+3 more)

### Community 71 - "TEST_NOW"
Cohesion: 0.12
Nodes (27): AnalysesView, db, disputedDeal(), db, DisputesView, paidDeal(), failureCode(), syncDisputes() (+19 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (69): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+61 more)

### Community 74 - "Database"
Cohesion: 0.04
Nodes (71): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+63 more)

### Community 75 - "verifyStoredLedger"
Cohesion: 0.10
Nodes (25): AnalysisNotAllowedError, db, disputed(), refusal(), db, disputed(), FILE, refusal() (+17 more)

### Community 76 - "Landing.tsx"
Cohesion: 0.06
Nodes (30): Audience(), Sticker(), Agreement(), at(), BALLOTS, Borda(), CHAT, Council() (+22 more)

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

### Community 81 - "testSpec"
Cohesion: 0.06
Nodes (46): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+38 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.13
Nodes (23): DraftStepKind, EvalCase, EvalGold, buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet() (+15 more)

### Community 83 - "disputes/test-support.ts"
Cohesion: 0.08
Nodes (34): db, ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer (+26 more)

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
Cohesion: 0.15
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+20 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.06
Nodes (70): documentFor(), changeOrderRoutes(), view(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams (+62 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "question-routes.test.ts"
Cohesion: 0.13
Nodes (14): db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View, forwardInterruptedQuestions() (+6 more)

### Community 92 - "readLedger"
Cohesion: 0.08
Nodes (32): db, types(), disputeTypes(), db, capturingEmail(), db, payments(), db (+24 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.09
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "src/summary.test.ts"
Cohesion: 0.09
Nodes (24): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+16 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (95): AgentRequestsPanel(), addBuyer(), addFile(), addPastedChat(), AgentRequestView, answerAgentRequest(), AnswerOptionView, buildPacket() (+87 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "Secret"
Cohesion: 0.06
Nodes (38): linkedSeller(), AI_RETRY_POLICY, ClientOptions, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient (+30 more)

### Community 101 - "db/src/index.ts"
Cohesion: 0.02
Nodes (156): result, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+148 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "landing-words.ts"
Cohesion: 0.08
Nodes (38): CanCannot(), LogoMark(), BUILD, Gate, sceneOf(), SEND, Agents(), at() (+30 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "DealPage.tsx"
Cohesion: 0.06
Nodes (61): checkLedger(), CompletenessItem, CompletenessView, getCompleteness(), getDeal(), getMe(), isCompleteness(), LedgerCheck (+53 more)

### Community 106 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+13 more)

### Community 107 - "AgentPanel.tsx"
Cohesion: 0.29
Nodes (11): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+3 more)

### Community 108 - "appeal-items.ts"
Cohesion: 0.13
Nodes (18): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, disputeFieldsOf() (+10 more)

### Community 109 - "draft"
Cohesion: 0.22
Nodes (8): title(), draft(), missing, scope, unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 110 - "auth/sign-in.ts"
Cohesion: 0.15
Nodes (17): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), callbackQuery, cookieRules, currentSession() (+9 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (23): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+15 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.29
Nodes (7): AI, Decisions, Demo (9b), Partner tools, Product, Redesign (Phase 7R), Render (9R)

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

### Community 123 - "AcceptancePanel.tsx"
Cohesion: 0.24
Nodes (16): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), declineTerms() (+8 more)

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

### Community 129 - "keyvalue.ts"
Cohesion: 0.22
Nodes (5): connectKeyValue(), keyValueStore(), memoryStore(), RedisCommands, redis

### Community 130 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 131 - "Nav.tsx"
Cohesion: 0.28
Nodes (12): Logo(), Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces() (+4 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Demo plan"
Cohesion: 0.12
Nodes (16): Buyers (each: a sandbox **Personal** account with the same email, to pay invoices), Cast, Chats, Demo plan, Maya's book of deals (written work only), Rules, Sellers (each: a sandbox **Business** account plus a REST app linked in PactPal), Story 1: Maya and Chris, a clean deal (nothing goes wrong) (+8 more)

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
Cohesion: 0.13
Nodes (45): appealApplies(), appealFacts(), RunnerBusyError, Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf() (+37 more)

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

### Community 158 - "vitest"
Cohesion: 0.18
Nodes (11): db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page(), db, NoteBody (+3 more)

### Community 159 - "Pillars.tsx"
Cohesion: 0.25
Nodes (12): Agent(), at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed() (+4 more)

### Community 160 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 165 - "server/package.json"
Cohesion: 0.06
Nodes (31): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+23 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "MessagesPanel.tsx"
Cohesion: 0.22
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 168 - "IntakePanel.tsx"
Cohesion: 0.22
Nodes (12): getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret(), turnOffIntakeSecret() (+4 more)

### Community 169 - "injection-check.ts"
Cohesion: 0.17
Nodes (14): logProgress(), modelNames(), DroppedDraft, droppedSection(), ruleOf(), clients, parsed, councilFailures() (+6 more)

### Community 170 - "Deadlines.tsx"
Cohesion: 0.22
Nodes (10): BAR_COLOURS, TODAY_LINE, COLUMNS, LABELS, COLUMNS, DealGantt(), LOCKED, presetFor() (+2 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (19): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+11 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 174 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 175 - "resend-inbound.test.ts"
Cohesion: 0.24
Nodes (8): RESEND_INBOUND_PATH, db, forwarding(), inbox(), SECRET_BYTES, listDealsForUser(), ReadResult, ReceivedEmail

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "draft-changes.ts"
Cohesion: 0.33
Nodes (9): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+1 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "PayPal sandbox notes"
Cohesion: 0.20
Nodes (10): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, PayPal sandbox notes, Reliability (+2 more)

### Community 182 - "gantt-rows.ts"
Cohesion: 0.38
Nodes (6): doneDay(), GanttLink, ganttRows, GanttTask, noteFor(), PAYMENT_WORDS

### Community 183 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 184 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react

### Community 185 - "build.ts"
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, marked

### Community 186 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 189 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, marked, mermaid, @pactpal/brand

### Community 190 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

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

### Community 196 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

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

### Community 208 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

## Knowledge Gaps
- **134 isolated node(s):** `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`, `@pactpal/brand`, `mermaid` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1989 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/intake.ts`, `appendLedgerEvent`, `Dashboard.tsx`, `sandbox-partner-report.ts`, `MessagesPage.tsx`, `receipt.ts`, `email/src/index.ts`, `testId`, `SellerAppPanel.tsx`, `change-orders.ts`, `readChecked`, `PayPalResult`, `ScopePanel.tsx`, `ref_zod`, `deliveries.ts`, `draft-job.ts`, `when`, `Database`, `council/src/index.ts`, `disputes/task.ts`, `db/src/migrate.ts`, `app-link-routes.ts`, `ai/src/index.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `App.tsx`, `deadline-rows.ts`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `errors.ts`, `layouts.tsx`, `build.js`, `config.ts`, `notifier.ts`, `acceptance-routes.ts`, `products/src/index.ts`, `scope-draft/src/council-task.ts`, `ledger/src/index.ts`, `test-app.ts`, `chat-routes.ts`, `action-routes.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `sellers/disputes.test.ts`, `DraftReview.tsx`, `seller-connections.ts`, `postgresContentStore`, `postgres.ts`, `TEST_NOW`, `sandbox-respond-report.ts`, `Database`, `verifyStoredLedger`, `testSpec`, `eval-runner.ts`, `disputes/test-support.ts`, `postStep`, `routes.ts`, `question-routes.test.ts`, `readLedger`, `sandbox-webhook-report.ts`, `src/summary.test.ts`, `api.ts`, `render.ts`, `Secret`, `db/src/index.ts`, `landing-words.ts`, `DealPage.tsx`, `AgentPanel.tsx`, `appeal-items.ts`, `draft`, `Ledger.tsx`, `package.json`, `keyvalue.ts`, `Nav.tsx`, `MessagesPanel.tsx`, `IntakePanel.tsx`, `injection-check.ts`, `pages.ts`, `resend-inbound.test.ts`, `design/tokens.ts`, `log-labels.test.ts`, `check-words.ts`?**
  _High betweenness centrality (0.247) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1294871794871795 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `retention.test.ts`, `PayPalResult`, `Built (sub-phases 2b to 6h-1)`, `timeline/src/index.ts`, `paypal/src/index.ts`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `src/intake.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07215686274509804 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `paypal/src/index.ts` to `change-orders.ts`, `PayPalResult`, `when`, `Database`, `council/src/index.ts`, `app-link-routes.ts`, `ai/src/index.ts`, `web/src/format.ts`, `scope-draft/src/council-task.ts`, `ledger/src/index.ts`, `test-app.ts`, `chat-routes.ts`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `sellers/disputes.test.ts`, `seller-connections.ts`, `testSpec`, `Secret`, `appeal-items.ts`, `draft`, `Decisions`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.06126331811263318 - nodes in this community are weakly interconnected._