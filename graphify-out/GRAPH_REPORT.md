# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 782 files · ~497,013 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6025 nodes · 18884 edges · 222 communities (201 shown, 21 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 546 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `557310c8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- paypal/src/index.ts
- appendLedgerEvent
- Insights.tsx
- QuestionsPanel.tsx
- DealPage.tsx
- action-routes.ts
- sellers/disputes.test.ts
- words/src/index.ts
- templates.ts
- claims/src/index.ts
- ledger/src/index.ts
- db/src/testing.ts
- dispute-sync.ts
- change-order-routes.ts
- Dashboard.tsx
- disputes/task.ts
- ScopePanel.tsx
- HttpDeps
- disputes/test-support.ts
- threads.ts
- createSignedTestDeal
- postStep
- notices.ts
- tools.ts
- council/src/index.ts
- message-job.ts
- db/src/migrate.ts
- scope.ts
- emailFrom
- when
- scope-draft/src/testing.ts
- validate.ts
- readLedger
- App.tsx
- Deadlines.tsx
- packet-service.ts
- deliveries.ts
- mcp.ts
- eval-report.ts
- users.ts
- layouts.tsx
- testSpec
- config.ts
- notifier.ts
- database.ts
- products/src/index.ts
- db/src/index.ts
- qa/src/index.ts
- api.ts
- test-app.ts
- web/package.json
- deals/routes.ts
- PayPalRestClient
- Built (sub-phases 2b to 6h-1)
- postgresContentStore
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- claim-job.ts
- DraftReview.tsx
- services
- Pillars.tsx
- scripts
- db/package.json
- paypal/src/index.ts
- landing-words.ts
- Database
- Agents.tsx
- sandbox-partner-report.ts
- claims/package.json
- sandbox-respond-report.ts
- auth/sign-in.ts
- dispute-actions.ts
- questions.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- pages.ts
- eval-runner.ts
- scope-draft/src/index.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- live-hub.ts
- products/package.json
- milestone-routes.ts
- ai/package.json
- invoices.ts
- app-link-routes.ts
- scripts
- ref_node_crypto
- timeline-progress.ts
- DraftPanel.tsx
- vitest
- email/package.json
- compilerOptions
- render.ts
- checker.ts
- resend-inbound.ts
- sandbox-check.ts
- council/package.json
- DealGantt.tsx
- .query
- react
- gantt-rows.ts
- build.js
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- ref_zod
- paypal-webhook.ts
- Engineering standards
- package.json
- devDependencies
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- keyvalue.ts
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- acceptance.test.ts
- build.ts
- brand/src/index.ts
- Closing.tsx
- README.md
- Redesign plan (proposed Phase 7R)
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
- email/src/index.ts
- ai/src/index.ts
- net/src/index.ts
- .prettierrc.json
- products/tsconfig.json
- IntakePanel.tsx
- buildApp
- docs/tsconfig.json
- acceptance-routes.ts
- Phase 7 (deal space)
- pdf/package.json
- SellerAppPanel.tsx
- docs/package.json
- index.md
- bus.ts
- PayPal sandbox notes
- draft-changes.ts
- vite-env.d.ts
- src-app-tsx.md
- Secret
- council
- brand/src/index.ts
- Layout
- scripts
- render.test.ts
- @fastify/cookie
- @fastify/helmet
- log-labels.test.ts
- Getting started
- brand/package.json
- app.ts
- server/package.json
- dependency-cruiser@^16.10.4
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- jscpd@^4.3.0
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy
- Decisions
- appeal-items.ts
- receipt.test.ts
- source
- @pactpal/qa@workspace:*
- @pactpal/claims@workspace:*
- @pactpal/words@workspace:*
- @pactpal/db@workspace:*
- devDependencies
- @pactpal/products@workspace:*
- redis
- ws
- @pactpal/ai@workspace:*
- @pactpal/council@workspace:*
- @pactpal/delivery-check@workspace:*
- @pactpal/scope-draft@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 227 edges
2. `Database` - 129 edges
3. `testId()` - 119 edges
4. `readLedger()` - 90 edges
5. `sha256Hex()` - 86 edges
6. `useMigratedTestDatabase()` - 83 edges
7. `react` - 80 edges
8. `appendLedgerEvent()` - 75 edges
9. `isObject()` - 74 edges
10. `TEST_NOW` - 68 edges

## Surprising Connections (you probably didn't know these)
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts

## Import Cycles
- None detected.

## Communities (222 total, 21 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.13
Nodes (36): createDeal(), LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), NewDealPage(), byUrgency() (+28 more)

### Community 1 - "paypal/src/index.ts"
Cohesion: 0.09
Nodes (24): dollar, setup(), PayPalErrorDetail, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback (+16 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (74): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema (+66 more)

### Community 3 - "Insights.tsx"
Cohesion: 0.13
Nodes (20): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+12 more)

### Community 4 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 5 - "DealPage.tsx"
Cohesion: 0.07
Nodes (57): addPastedChat(), checkLedger(), DealFile, draftsUrl(), fileUrl(), getDeal(), getDraftById(), getMe() (+49 more)

### Community 6 - "action-routes.ts"
Cohesion: 0.08
Nodes (42): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+34 more)

### Community 7 - "sellers/disputes.test.ts"
Cohesion: 0.08
Nodes (34): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), fakeWriter(), paypalState() (+26 more)

### Community 8 - "words/src/index.ts"
Cohesion: 0.15
Nodes (23): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), AgreementPage, ChangeFacts (+15 more)

### Community 9 - "templates.ts"
Cohesion: 0.09
Nodes (33): EMAIL_LOGO_PATH, emailLogo(), EmailTemplates, loadEmailTemplates(), templatesDir(), loaded, app, root (+25 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (58): Prepared, parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages() (+50 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.08
Nodes (49): sharp@0.35.5, isPicture(), lookUp(), MAX_PHOTO_SIDE, toJpeg(), DISPUTE_EVENT_PREFIX, mediaTypeOf(), ACTORS (+41 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.06
Nodes (55): db, agentDeal(), db, mcpClient(), ToolResult, db, SESSION_COOKIE, db (+47 more)

### Community 13 - "dispute-sync.ts"
Cohesion: 0.04
Nodes (75): checkView(), disputeParams, disputeRoutes(), changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond() (+67 more)

### Community 14 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (36): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody (+28 more)

### Community 15 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (38): DealSummary, Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT (+30 more)

### Community 16 - "disputes/task.ts"
Cohesion: 0.07
Nodes (55): publishingBus(), pickModels(), selectedClientsOrExit(), CronStart, runCronJob(), renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME (+47 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (73): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+65 more)

### Community 18 - "HttpDeps"
Cohesion: 0.08
Nodes (39): ClientOptions, ResendReceivedEmails, ResendOptions, HttpDeps, RetryPolicy, Call, item, json() (+31 more)

### Community 19 - "disputes/test-support.ts"
Cohesion: 0.07
Nodes (47): answer, AppealView, db, FILES, inProcessClaimRunner(), AnalysesView, db, disputedDeal() (+39 more)

### Community 20 - "threads.ts"
Cohesion: 0.15
Nodes (22): useWide(), LastMessage, MessagesPage(), People(), plainClick(), Thread(), useLastMessages(), chatAddress() (+14 more)

### Community 21 - "createSignedTestDeal"
Cohesion: 0.09
Nodes (28): db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View, db (+20 more)

### Community 22 - "postStep"
Cohesion: 0.15
Nodes (30): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+22 more)

### Community 23 - "notices.ts"
Cohesion: 0.38
Nodes (10): emailFor(), disputeChangedEmail(), disputeDecidedEmail(), DisputeEmailFacts, disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+2 more)

### Community 24 - "tools.ts"
Cohesion: 0.04
Nodes (80): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentTool, ask() (+72 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (44): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+36 more)

### Community 26 - "message-job.ts"
Cohesion: 0.12
Nodes (30): DraftJob, JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), ClaimContext, ClaimText, linesOf() (+22 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.18
Nodes (14): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+6 more)

### Community 28 - "scope.ts"
Cohesion: 0.11
Nodes (20): AgreementListing, agreementListingSchema, buyerProvidesSchema, checkedVersion(), confirmedFromSchema, deliverableKindSchema, insertScopeVersion(), lastVersion (+12 more)

### Community 29 - "emailFrom"
Cohesion: 0.16
Nodes (27): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+19 more)

### Community 30 - "when"
Cohesion: 0.06
Nodes (69): analysesUrl(), buildPacket(), checkDisputes(), compareClaim(), CouncilView, disputesUrl(), DisputesView, draftSummary() (+61 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (38): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind, EVAL_CASES (+30 more)

### Community 32 - "validate.ts"
Cohesion: 0.12
Nodes (32): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, DraftStep (+24 more)

### Community 33 - "readLedger"
Cohesion: 0.06
Nodes (34): db, db, invoiceEntries(), signedPayPal(), StageView, disputeTypes(), capturingEmail(), db (+26 more)

### Community 34 - "App.tsx"
Cohesion: 0.10
Nodes (35): signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage, DisputePage (+27 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.22
Nodes (13): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+5 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+38 more)

### Community 37 - "deliveries.ts"
Cohesion: 0.05
Nodes (46): addBuyer(), addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, DEAL_CATEGORIES, DEAL_KINDS, DEAL_STATUSES, DealCategory (+38 more)

### Community 38 - "mcp.ts"
Cohesion: 0.17
Nodes (16): checkMcp(), PayPalMcpError, describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL (+8 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.08
Nodes (47): logProgress(), valueOrExit(), modelNames(), draftCategories, DroppedDraft, droppedSection(), ruleOf(), aloneRow() (+39 more)

### Community 40 - "users.ts"
Cohesion: 0.23
Nodes (13): AddBuyer, isUniqueViolation(), SignedInPerson, SignInResult, signInWithPayPal(), findUserByEmail(), findUserByPayPalId(), linkPayPal() (+5 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.09
Nodes (31): Me, Icon(), IconName, PATHS, Logo(), applyTheme(), nextTheme(), ORDER (+23 more)

### Community 42 - "testSpec"
Cohesion: 0.04
Nodes (62): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+54 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (27): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors() (+19 more)

### Community 44 - "notifier.ts"
Cohesion: 0.06
Nodes (59): listDeals(), chatUrl(), ChatView, getChat(), getNotifications(), getPastedChats(), isChat(), isMessage() (+51 more)

### Community 45 - "database.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.11
Nodes (22): BASE, LISTING, Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3() (+14 more)

### Community 47 - "db/src/index.ts"
Cohesion: 0.03
Nodes (102): PayPalWebhookOptions, ARTIFACT_KINDS, ArtifactKind, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed() (+94 more)

### Community 48 - "qa/src/index.ts"
Cohesion: 0.08
Nodes (36): checkAnalysis(), ClaimAnalysis, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+28 more)

### Community 49 - "api.ts"
Cohesion: 0.04
Nodes (105): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView (+97 more)

### Community 50 - "test-app.ts"
Cohesion: 0.04
Nodes (86): chatDeal(), db, MessageBody, Card, db, savedDeal(), send(), signedDeal() (+78 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (50): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+42 more)

### Community 52 - "deals/routes.ts"
Cohesion: 0.08
Nodes (40): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), dealAccess(), visibleDeal() (+32 more)

### Community 53 - "PayPalRestClient"
Cohesion: 0.09
Nodes (23): checks, APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+15 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (22): seller(), outcome(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work (+14 more)

### Community 55 - "postgresContentStore"
Cohesion: 0.05
Nodes (50): CheckView, db, FAILED, shown, store, db, withReadyDraft(), waitingDraft() (+42 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (54): DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS (+46 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (73): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), DealOverview, dealOverview() (+65 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (44): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails (+36 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "claim-job.ts"
Cohesion: 0.10
Nodes (55): appealApplies(), appealFacts(), RunnerBusyError, Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf() (+47 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (48): ChangeProposal, ChatLine, Citation, CompletenessItem, CompletenessView, DraftCandidate, DraftCategory, DraftMark (+40 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Pillars.tsx"
Cohesion: 0.17
Nodes (17): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+9 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "paypal/src/index.ts"
Cohesion: 0.09
Nodes (25): Actor, links, lookupAnswer, MerchantLookup, MerchantStatus, ownAccountId(), ownerAnswer, PartnerFeature (+17 more)

### Community 68 - "landing-words.ts"
Cohesion: 0.08
Nodes (38): LogoMark(), BUILD, Gate, SEND, Audience(), GLYPHS, SPOTS, Sticker() (+30 more)

### Community 69 - "Database"
Cohesion: 0.09
Nodes (35): ReceiptMailDeps, McpRouteOptions, AgentContext, ChatBus, Card, DealCards, ChatRouteOptions, HubOptions (+27 more)

### Community 70 - "Agents.tsx"
Cohesion: 0.11
Nodes (28): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+20 more)

### Community 71 - "sandbox-partner-report.ts"
Cohesion: 0.15
Nodes (26): payPalIdOption(), rows(), actFor(), message(), parsed, partners, platform, argsSchema (+18 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (66): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), readChecked(), readOptions() (+58 more)

### Community 74 - "auth/sign-in.ts"
Cohesion: 0.13
Nodes (19): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+11 more)

### Community 75 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (25): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+17 more)

### Community 76 - "questions.ts"
Cohesion: 0.09
Nodes (27): namedQuestion(), AiAnswer, aiAnswerSchema, AnswerQuestion, answerQuestion(), answerQuestionSchema, askQuestionSchema, BuyerQuestion (+19 more)

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

### Community 81 - "pages.ts"
Cohesion: 0.17
Nodes (20): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+12 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.12
Nodes (28): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+20 more)

### Community 83 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (70): councilRecordSchema, isUnranked(), usage, categoryLabels, describeDraft(), draftView(), DraftView, priceMinor() (+62 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "live-hub.ts"
Cohesion: 0.10
Nodes (18): messageView(), LiveHub, LivePage, Online, PageState, liveQuery, LiveRouteOptions, liveRoutes() (+10 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "milestone-routes.ts"
Cohesion: 0.06
Nodes (76): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+68 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "invoices.ts"
Cohesion: 0.10
Nodes (21): BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, transactionList, createdInvoice (+13 more)

### Community 92 - "app-link-routes.ts"
Cohesion: 0.18
Nodes (13): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+5 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "ref_node_crypto"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "timeline-progress.ts"
Cohesion: 0.06
Nodes (40): body, ChatIntegrityError, ChatMessage, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+32 more)

### Community 96 - "DraftPanel.tsx"
Cohesion: 0.10
Nodes (35): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+27 more)

### Community 97 - "vitest"
Cohesion: 0.18
Nodes (11): db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page(), db, NoteBody (+3 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "render.ts"
Cohesion: 0.10
Nodes (20): ACCENT_INK, Branding, breakWord(), CharacterSet, columnWidths(), drawable(), Fonts, INK (+12 more)

### Community 101 - "checker.ts"
Cohesion: 0.12
Nodes (15): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), renderDraftStarter(), sameWorkflowTask(), SCHEDULE_WINDOW_MS (+7 more)

### Community 102 - "resend-inbound.ts"
Cohesion: 0.22
Nodes (11): createIntakeDeal(), intakeFilename(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), ENTITIES (+3 more)

### Community 103 - "sandbox-check.ts"
Cohesion: 0.22
Nodes (13): APP_KEYS, PayPalApp, checkAsSellerApp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+5 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "DealGantt.tsx"
Cohesion: 0.14
Nodes (16): getDisputePage(), isDisputePage(), BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, COLUMNS, LABELS (+8 more)

### Community 106 - ".query"
Cohesion: 0.09
Nodes (35): listPackets(), allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA, LooseKind (+27 more)

### Community 107 - "react"
Cohesion: 0.05
Nodes (39): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+31 more)

### Community 108 - "gantt-rows.ts"
Cohesion: 0.21
Nodes (9): StageView, StepView, RunningStepView, doneDay(), GanttLink, ganttRows(), GanttTask, noteFor() (+1 more)

### Community 109 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 110 - "Demo plan"
Cohesion: 0.11
Nodes (17): Buyers (each: a sandbox **Personal** account with the same email and sandbox balance, to pay invoices), Cast, Chats, Demo plan, Done by the owner, How the inboxes work (set up 11 Nov 2026), Maya's book of deals (written work only), Rules (+9 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "ref_zod"
Cohesion: 0.05
Nodes (87): DealLookup, dealParams, featureAnswers(), FoundDeal, readBody(), Refusal, sendRefusal(), ChangeOrderRouteOptions (+79 more)

### Community 115 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (19): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+11 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, fastify@^5.12.7, @fastify/websocket@^11.3.7, @pactpal/email@workspace:*, @pactpal/live@workspace:*, @pactpal/pdf@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:* (+11 more)

### Community 120 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

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

### Community 128 - "acceptance.test.ts"
Cohesion: 0.27
Nodes (8): at(), db, document(), savedDeal(), work, saveScopeVersion(), ScopeContentInput, ScopeNotAllowedError

### Community 129 - "build.ts"
Cohesion: 0.25
Nodes (7): css, dist, faces, FONTS, home, problems, root

### Community 130 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 131 - "Closing.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

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

### Community 158 - "email/src/index.ts"
Cohesion: 0.09
Nodes (31): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, ReadResult (+23 more)

### Community 159 - "ai/src/index.ts"
Cohesion: 0.09
Nodes (31): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, REQUEST (+23 more)

### Community 160 - "net/src/index.ts"
Cohesion: 0.22
Nodes (13): defaultHttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork(), policy, Step, urlOf() (+5 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "IntakePanel.tsx"
Cohesion: 0.10
Nodes (25): checkMessage(), DealOptions, getIntakeKey(), getMessages(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey() (+17 more)

### Community 165 - "buildApp"
Cohesion: 0.11
Nodes (19): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+11 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (50): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent() (+42 more)

### Community 168 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 169 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 170 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 171 - "docs/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @fontsource/instrument-serif@5.3.0, @fontsource-variable/geist@5.3.0, @fontsource-variable/geist-mono@5.3.0, marked@18.1.1, mermaid@12.2.0, @pactpal/brand@workspace:*, devDependencies (+17 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "bus.ts"
Cohesion: 0.20
Nodes (10): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal() (+2 more)

### Community 174 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 175 - "draft-changes.ts"
Cohesion: 0.21
Nodes (12): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+4 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "Secret"
Cohesion: 0.07
Nodes (24): linkedSeller(), Engineering, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient (+16 more)

### Community 179 - "council"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 180 - "brand/src/index.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 182 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 183 - "render.test.ts"
Cohesion: 0.26
Nodes (7): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, RenderedPdf, AT

### Community 186 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 189 - "app.ts"
Cohesion: 0.09
Nodes (28): AppOptions, SignInOptions, Config, DealOptions, DisputeWriter, ClaimRunner, DisputeChecker, DraftStarter (+20 more)

### Community 190 - "server/package.json"
Cohesion: 0.12
Nodes (16): @fastify/static@^10.1.8, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, @pactpal/paypal@workspace:*, @pactpal/watcher@workspace:*, @modelcontextprotocol/sdk, @pactpal/ledger (+8 more)

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

### Community 206 - "Decisions"
Cohesion: 0.20
Nodes (10): AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product, Redesign (Phase 7R) (+2 more)

### Community 207 - "appeal-items.ts"
Cohesion: 0.20
Nodes (11): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, ADDED_BY (+3 more)

### Community 208 - "receipt.test.ts"
Cohesion: 0.24
Nodes (8): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, receiptFormatAt(), document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

### Community 209 - "source"
Cohesion: 0.33
Nodes (6): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8)

### Community 214 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1796 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `Insights.tsx`, `DealPage.tsx`, `action-routes.ts`, `sellers/disputes.test.ts`, `words/src/index.ts`, `templates.ts`, `ledger/src/index.ts`, `db/src/testing.ts`, `dispute-sync.ts`, `Dashboard.tsx`, `disputes/task.ts`, `ScopePanel.tsx`, `HttpDeps`, `disputes/test-support.ts`, `threads.ts`, `createSignedTestDeal`, `tools.ts`, `council/src/index.ts`, `message-job.ts`, `db/src/migrate.ts`, `emailFrom`, `when`, `scope-draft/src/testing.ts`, `validate.ts`, `readLedger`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `mcp.ts`, `eval-report.ts`, `layouts.tsx`, `testSpec`, `config.ts`, `notifier.ts`, `database.ts`, `products/src/index.ts`, `qa/src/index.ts`, `test-app.ts`, `PayPalRestClient`, `postgresContentStore`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `DraftReview.tsx`, `paypal/src/index.ts`, `landing-words.ts`, `Agents.tsx`, `sandbox-partner-report.ts`, `sandbox-respond-report.ts`, `pages.ts`, `eval-runner.ts`, `scope-draft/src/index.ts`, `milestone-routes.ts`, `invoices.ts`, `ref_node_crypto`, `DraftPanel.tsx`, `checker.ts`, `resend-inbound.ts`, `sandbox-check.ts`, `DealGantt.tsx`, `.query`, `react`, `gantt-rows.ts`, `devDependencies`, `paypal-webhook.ts`, `package.json`, `keyvalue.ts`, `acceptance.test.ts`, `Closing.tsx`, `email/src/index.ts`, `ai/src/index.ts`, `net/src/index.ts`, `IntakePanel.tsx`, `buildApp`, `SellerAppPanel.tsx`, `bus.ts`, `draft-changes.ts`, `Secret`, `brand/src/index.ts`, `render.test.ts`, `log-labels.test.ts`, `appeal-items.ts`, `receipt.test.ts`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1321353065539112 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `DealGantt.tsx`, `source`, `Secret`, `timeline/src/index.ts`, `paypal/src/index.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0931174089068826 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Secret` to `sellers/disputes.test.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `council/src/index.ts`, `email/src/index.ts`, `when`, `ai/src/index.ts`, `acceptance-routes.ts`, `testSpec`, `test-app.ts`, `council`, `PayPalRestClient`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `paypal/src/index.ts`, `claim-job.ts`, `Database`, `Decisions`, `appeal-items.ts`, `scope-draft/src/index.ts`, `invoices.ts`, `.query`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.050957481337228175 - nodes in this community are weakly interconnected._