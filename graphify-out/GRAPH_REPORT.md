# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 697 files · ~452,788 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .css 9, (none) 5, .example 1)

## Summary
- 5386 nodes · 17253 edges · 164 communities (158 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 510 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ef5977e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- appeal-items.ts
- Database
- net/src/index.ts
- postgres.test.ts
- styles.ts
- .query
- readLedger
- email/src/index.ts
- DraftReview.tsx
- sellers/disputes.test.ts
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- scope-draft/src/index.ts
- ai/src/index.ts
- utcDateTime
- paypal/src/index.ts
- ScopePanel.tsx
- App.tsx
- mcp.ts
- acceptance-routes.ts
- review.ts
- PayPalRestClient
- DraftReview.tsx
- dependencies
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- DealPage.tsx
- vitest
- web/src/format.ts
- scope-draft/src/testing.ts
- eval-scope.ts
- delivery-routes.ts
- DealsTable.tsx
- disputes/test-support.ts
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- notices.ts
- testId
- sandbox-partner-report.ts
- config.ts
- app-link-routes.ts
- change-order-routes.ts
- .query
- buildApp
- paypal/src/disputes.ts
- claim-analyses.ts
- action-routes.test.ts
- web/package.json
- Deadlines.tsx
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- ref_zod
- completeness.ts
- layouts.tsx
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- addArtifact
- claim-routes.ts
- paypal-webhook.ts
- resend-inbound.ts
- deliveries.ts
- claims/package.json
- sandbox-respond-report.ts
- QuestionsPanel.tsx
- claims/src/index.ts
- scenes.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- delivery-check-routes.test.ts
- draft
- database.ts
- scope-draft/package.json
- paypal/package.json
- question-routes.ts
- Landing.tsx
- products/package.json
- auth/sign-in.ts
- ai/package.json
- db/src/index.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- testSpec
- SellerAppPanel.tsx
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- IntakePanel.tsx
- disputes/summary.test.ts
- bus.ts
- council/package.json
- app-link-routes.ts
- dispute-view.ts
- plainCode
- draft-changes.ts
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
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
- App.tsx
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
- .prettierrc.json
- products/tsconfig.json
- src/intake.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- Data model
- Scope
- vite-env.d.ts
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 208 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `isObject()` - 70 edges
8. `TEST_NOW` - 66 edges
9. `Secret` - 65 edges
10. `appendLedgerEvent()` - 63 edges

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

## Communities (164 total, 6 thin omitted)

### Community 0 - "appeal-items.ts"
Cohesion: 0.13
Nodes (17): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+9 more)

### Community 1 - "Database"
Cohesion: 0.11
Nodes (30): AppOptions, SignInOptions, ChatBus, HubOptions, NotificationRouteOptions, NotifierOptions, ReminderDeps, ChangeOrderRouteOptions (+22 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.04
Nodes (70): linkedSeller(), ClientOptions, bareAddress(), RESEND_RECEIVED_URL, ResendReceivedEmails, inbox(), ResendOptions, json() (+62 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.05
Nodes (43): result, Row, connectPostgres(), databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions (+35 more)

### Community 4 - "styles.ts"
Cohesion: 0.15
Nodes (27): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+19 more)

### Community 5 - ".query"
Cohesion: 0.03
Nodes (104): `change_orders`: changes to a signed agreement, Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema (+96 more)

### Community 6 - "readLedger"
Cohesion: 0.06
Nodes (38): db, Answered, db, DeliveriesView, DeliveryView, entriesOf(), png(), signedDeal() (+30 more)

### Community 7 - "email/src/index.ts"
Cohesion: 0.09
Nodes (29): RFC-2606, ENTITIES, entity(), htmlToText(), emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult (+21 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.10
Nodes (31): addFile(), addPastedChat(), DealFile, draftsUrl(), DraftView, fileUrl(), getDraftById(), getScope() (+23 more)

### Community 9 - "sellers/disputes.test.ts"
Cohesion: 0.09
Nodes (36): db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, fakeWriter(), sentStage(), fakeAppWebhooks() (+28 more)

### Community 10 - "api.ts"
Cohesion: 0.04
Nodes (110): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), addBuyer() (+102 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (66): agentBodySha256(), ARTIFACT_KINDS, ArtifactKind, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed() (+58 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.09
Nodes (41): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, documentFor(), fingerprinted(), money, AgentRequestRouteOptions, agentRequestRoutes() (+33 more)

### Community 13 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (98): councilRecordSchema, isUnranked(), DraftJob, PROMPT_VERSIONS, categoryLabels, describeDraft(), DraftView, priceMinor() (+90 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (44): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+36 more)

### Community 15 - "utcDateTime"
Cohesion: 0.17
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+15 more)

### Community 16 - "paypal/src/index.ts"
Cohesion: 0.05
Nodes (47): LinkedDisputeAccount, authAssertion(), base64Url(), EvidenceFileError, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile (+39 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (76): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+68 more)

### Community 18 - "App.tsx"
Cohesion: 0.12
Nodes (38): AcceptanceDocument(), AcceptanceDocument, LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), NewDealPage() (+30 more)

### Community 19 - "mcp.ts"
Cohesion: 0.08
Nodes (30): APP_KEYS, PayPalApp, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS (+22 more)

### Community 20 - "acceptance-routes.ts"
Cohesion: 0.10
Nodes (33): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload (+25 more)

### Community 21 - "review.ts"
Cohesion: 0.08
Nodes (44): toCouncilRecord(), JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), LABEL_WORDS, revisionNote() (+36 more)

### Community 22 - "PayPalRestClient"
Cohesion: 0.07
Nodes (25): PayPalBuyerTestActions, dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+17 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (35): ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ChatLines(), ChatPane() (+27 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): Engineering, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+39 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.12
Nodes (26): publishingBus(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+18 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.29
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, migrationStatus, readApplied() (+3 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.05
Nodes (80): checkLedger(), getMe(), LedgerCheck, LedgerEntryView, ScopeTerms, ScopeView, StageView, StepView (+72 more)

### Community 29 - "vitest"
Cohesion: 0.06
Nodes (53): db, agentDeal(), db, mcpClient(), ToolResult, db, db, waiting() (+45 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.07
Nodes (62): analysesUrl(), checkDisputes(), compareClaim(), CouncilView, disputesUrl(), DisputesView, draftResponse(), draftSummary() (+54 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.05
Nodes (79): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+71 more)

### Community 32 - "eval-scope.ts"
Cohesion: 0.28
Nodes (10): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), clients, parsed (+2 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (57): emailAnswer(), emailDelivery(), milestoneRoutes(), answer(), emailInvoice(), sellerApp(), paypalProblem(), sendBody (+49 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.09
Nodes (39): Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR (+31 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.06
Nodes (61): queuedDrafting(), BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError (+53 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "receipt.ts"
Cohesion: 0.13
Nodes (29): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), DraftBody(), Quotes() (+21 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.12
Nodes (21): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, ProductLookup, fakeChannel3(), NOW (+13 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.10
Nodes (40): draftCategories, DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection() (+32 more)

### Community 40 - "notices.ts"
Cohesion: 0.13
Nodes (23): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+15 more)

### Community 41 - "testId"
Cohesion: 0.09
Nodes (31): CALLBACK_PATH, RETURN_COOKIE, STATE_COOKIE, db, dealWithBuyer(), maya, report, setup() (+23 more)

### Community 42 - "sandbox-partner-report.ts"
Cohesion: 0.12
Nodes (32): rows(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+24 more)

### Community 43 - "config.ts"
Cohesion: 0.11
Nodes (26): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, FEATURES (+18 more)

### Community 44 - "app-link-routes.ts"
Cohesion: 0.11
Nodes (25): disputeWriters(), InvoiceAccount, LinkedApp, linkedDisputeAccounts(), NoInvoiceAccount, claimAccount(), confirmConnection(), ConfirmRefusal (+17 more)

### Community 45 - "change-order-routes.ts"
Cohesion: 0.14
Nodes (20): acceptBody, changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256, checkedContent() (+12 more)

### Community 46 - ".query"
Cohesion: 0.06
Nodes (62): answerAgentRequest(), claimAgentRequest(), createAgentRequest(), finishAgentRequest(), lockedRequest(), typedCode(), ChatNotAllowedError, insertMessage() (+54 more)

### Community 47 - "buildApp"
Cohesion: 0.11
Nodes (20): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), ConfigReport (+12 more)

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (42): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeDetails (+34 more)

### Community 49 - "claim-analyses.ts"
Cohesion: 0.08
Nodes (25): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+17 more)

### Community 50 - "action-routes.test.ts"
Cohesion: 0.09
Nodes (20): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+12 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (30): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline (+22 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.12
Nodes (29): BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow (+21 more)

### Community 53 - "tools.ts"
Cohesion: 0.07
Nodes (38): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), McpRouteOptions, mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS (+30 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (22): key(), seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks (+14 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.10
Nodes (36): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+28 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.05
Nodes (63): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), DeliveryCheckView, factsWords(), FORMAT_WORDS (+55 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (74): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), dealOverview, DealStage (+66 more)

### Community 59 - "ref_zod"
Cohesion: 0.05
Nodes (85): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatRouteOptions, chatRoutes(), postBody, REFUSALS, rateLimiter(), DealLookup (+77 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "layouts.tsx"
Cohesion: 0.14
Nodes (17): Me, IconName, PATHS, applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme() (+9 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+23 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.26
Nodes (22): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+14 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "addArtifact"
Cohesion: 0.09
Nodes (28): councilOf(), db, draftedAs(), idOf(), readDraft(), sellerDeal(), store, View (+20 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.19
Nodes (22): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+14 more)

### Community 69 - "paypal-webhook.ts"
Cohesion: 0.13
Nodes (16): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+8 more)

### Community 70 - "resend-inbound.ts"
Cohesion: 0.14
Nodes (21): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+13 more)

### Community 71 - "deliveries.ts"
Cohesion: 0.08
Nodes (50): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+42 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (73): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+65 more)

### Community 74 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.05
Nodes (94): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+86 more)

### Community 76 - "scenes.tsx"
Cohesion: 0.17
Nodes (23): Status, StatusBadge(), STATUSES, AgreeScene(), at(), Bubble(), CaptureScene(), CHAT_LINES (+15 more)

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

### Community 81 - "delivery-check-routes.test.ts"
Cohesion: 0.10
Nodes (19): CheckView, db, FAILED, shown, store, db, FAILED, lineOf() (+11 more)

### Community 82 - "draft"
Cohesion: 0.22
Nodes (8): title(), draft(), missing, scope, unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 83 - "database.ts"
Cohesion: 0.06
Nodes (36): contentRow, Queryable, lockedDeal, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, DEAL_CATEGORIES, DEAL_KINDS (+28 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "question-routes.ts"
Cohesion: 0.14
Nodes (22): step(), changeOrderRoutes(), waitingChange(), answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams (+14 more)

### Community 87 - "Landing.tsx"
Cohesion: 0.19
Nodes (16): Landing(), NAV, signIn(), Tagline(), AUDIENCE, FAQ, HERO, LIMITS (+8 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "auth/sign-in.ts"
Cohesion: 0.15
Nodes (17): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), callbackQuery, cookieRules, currentSession() (+9 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "db/src/index.ts"
Cohesion: 0.05
Nodes (68): PayPalWebhookOptions, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+60 more)

### Community 92 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "testSpec"
Cohesion: 0.05
Nodes (56): councilDeps(), councilRecordOf(), isRankingRequest(), model(), db, isRanking(), member(), ReviewView (+48 more)

### Community 96 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (45): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), dependencies, pdf-lib, zod (+37 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.07
Nodes (33): BusSignal, Listen, addCard(), db, hubOnTestDeal(), ChatNames, messageView(), LiveHub (+25 more)

### Community 101 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

### Community 102 - "disputes/summary.test.ts"
Cohesion: 0.18
Nodes (10): db, disputedDeal(), FILES, GOOD, SummariesView, AnalysisNotAllowedError, finishClaimAnalysis, startClaimAnalysis (+2 more)

### Community 103 - "bus.ts"
Cohesion: 0.24
Nodes (9): listeners(), memoryBus(), postgresBus(), CHAT_CHANNEL, ChatEvent, chatEventSchema, parseChatEvent(), party (+1 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "app-link-routes.ts"
Cohesion: 0.30
Nodes (11): linkBody, paypalUnavailable(), SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts(), ConnectApp (+3 more)

### Community 106 - "dispute-view.ts"
Cohesion: 0.24
Nodes (10): disputeFieldsOf(), DisputeMessageView, disputePageView(), disputeSummaryView(), keptFields, openedAt(), requestedEvidenceOf(), SELLER_ANSWERS (+2 more)

### Community 107 - "plainCode"
Cohesion: 0.18
Nodes (22): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+14 more)

### Community 108 - "draft-changes.ts"
Cohesion: 0.33
Nodes (9): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+1 more)

### Community 110 - "test-app.ts"
Cohesion: 0.05
Nodes (74): db, SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+66 more)

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
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
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
Cohesion: 0.10
Nodes (28): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+20 more)

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
Cohesion: 0.11
Nodes (18): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+10 more)

### Community 131 - "App.tsx"
Cohesion: 0.11
Nodes (27): signOut(), App(), dealPage(), DealRoute, isDealRoute(), Landing, Session, signInBack (+19 more)

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

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "src/intake.ts"
Cohesion: 0.08
Nodes (40): CATEGORY_IDS, DEAL_CURRENCIES, findIntakeKey(), IntakeKind, IntakeRefusal, keyRow, makeIntakeKey(), MAX_INTAKE_DEALS_PER_DAY (+32 more)

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 172 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **120 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1763 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `appeal-items.ts`, `net/src/index.ts`, `App.tsx`, `postgres.test.ts`, `.query`, `readLedger`, `email/src/index.ts`, `DraftReview.tsx`, `sellers/disputes.test.ts`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `ai/src/index.ts`, `utcDateTime`, `paypal/src/index.ts`, `ScopePanel.tsx`, `mcp.ts`, `review.ts`, `PayPalRestClient`, `DraftReview.tsx`, `council/src/index.ts`, `db/src/migrate.ts`, `DealPage.tsx`, `scope-draft/src/testing.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `disputes/test-support.ts`, `packet-service.ts`, `receipt.ts`, `products/src/index.ts`, `eval-report.ts`, `log-labels.test.ts`, `testId`, `sandbox-partner-report.ts`, `config.ts`, `app-link-routes.ts`, `buildApp`, `paypal/src/disputes.ts`, `action-routes.test.ts`, `Deadlines.tsx`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `completeness.ts`, `layouts.tsx`, `DisputeActions.tsx`, `addArtifact`, `paypal-webhook.ts`, `deliveries.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `delivery-check-routes.test.ts`, `draft`, `Landing.tsx`, `build.js`, `sandbox-webhook-report.ts`, `testSpec`, `SellerAppPanel.tsx`, `render.ts`, `live-hub.ts`, `IntakePanel.tsx`, `disputes/summary.test.ts`, `plainCode`, `test-app.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appeal-items.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `council/src/index.ts`, `timeline/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `appeal-items.ts`, `Database`, `net/src/index.ts`, `email/src/index.ts`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `ai/src/index.ts`, `paypal/src/index.ts`, `PayPalRestClient`, `web/src/format.ts`, `log-labels.test.ts`, `app-link-routes.ts`, `paypal/src/disputes.ts`, `Built (sub-phases 2b to 6h-1)`, `ref_zod`, `draft`, `testSpec`, `plainCode`, `test-app.ts`, `Decisions`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0409158650589351 - nodes in this community are weakly interconnected._