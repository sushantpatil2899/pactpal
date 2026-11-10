# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 690 files · ~448,284 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .css 7, (none) 5, .example 1)

## Summary
- 5336 nodes · 17114 edges · 173 communities (166 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `01ac012f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dispute-view.ts
- Database
- net/src/index.ts
- question-routes.ts
- styles.ts
- change-orders.ts
- AcceptancePanel.tsx
- vitest
- DraftReview.tsx
- testId
- qa/src/index.ts
- ledger/src/index.ts
- deals/routes.ts
- claim-analyses.ts
- ai/src/index.ts
- email/src/index.ts
- seed-sandbox.ts
- ScopePanel.tsx
- App.tsx
- react
- timeline-routes.ts
- review.ts
- Engineering
- vitest
- dependencies
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- DealPage.tsx
- readLedger
- web/src/format.ts
- scope-draft/src/testing.ts
- injection-runner.ts
- delivery-routes.ts
- DealsTable.tsx
- .query
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- paypal/src/disputes.ts
- validate.ts
- eval-judge.ts
- config.ts
- seller-connections.ts
- ref_zod
- dispute-actions.ts
- buildApp
- dispute-sync.ts
- eval-runner.test.ts
- disputes/test-support.ts
- web/package.json
- Deadlines.tsx
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- delivery-check-routes.ts
- completeness.ts
- main.tsx
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-routes.ts
- paypal-webhook.ts
- postgres.ts
- deliveries.ts
- claims/package.json
- sandbox-respond-report.ts
- question-routes.ts
- claims/src/index.ts
- scope.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- question-routes.test.ts
- parseJsonReply
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- resend-inbound.ts
- pdf/package.json
- products/package.json
- paypal/src/index.ts
- ai/package.json
- chat.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- testSpec
- delivery-check-routes.test.ts
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- api.ts
- IntakePanel.tsx
- scope-draft/src/index.ts
- council/package.json
- Layout
- draft-routes.test.ts
- words/src/index.ts
- SellerAppPanel.tsx
- image.ts
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- users.ts
- Engineering standards
- package.json
- Decisions
- server/package.json
- tokens.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- sellerAppRoutes
- dependencies
- MessagesPanel.tsx
- useRoute.ts
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
- acceptance-routes.test.ts
- request-routes.ts
- ledger-store.ts
- authAssertion
- .prettierrc.json
- products/tsconfig.json
- auth/sign-in.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- Data model
- sign-in-words.ts
- Scope
- vite-env.d.ts
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 207 edges
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

## Communities (173 total, 7 thin omitted)

### Community 0 - "dispute-view.ts"
Cohesion: 0.13
Nodes (21): addedByRole(), fileView(), CHECK_INTERVAL_MS, DisputeChecker, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes() (+13 more)

### Community 1 - "Database"
Cohesion: 0.06
Nodes (36): BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db (+28 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.04
Nodes (72): ResendInboundOptions, bareAddress(), check, InboxNetworkError, receivedAnswer, ReceivedEmails, RESEND_RECEIVED_URL, ResendReceivedEmails (+64 more)

### Community 3 - "question-routes.ts"
Cohesion: 0.11
Nodes (24): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+16 more)

### Community 4 - "styles.ts"
Cohesion: 0.08
Nodes (45): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+37 more)

### Community 5 - "change-orders.ts"
Cohesion: 0.05
Nodes (63): ACCEPTANCE_NOTICE, acceptanceDocument, document, signed(), SIGNED_AT, signedPayload(), Acceptance, AcceptanceIntegrityError (+55 more)

### Community 6 - "AcceptancePanel.tsx"
Cohesion: 0.11
Nodes (33): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+25 more)

### Community 7 - "vitest"
Cohesion: 0.07
Nodes (29): db, db, mcpClient(), ToolResult, db, liveDeal(), closePagesAfterEach(), opened (+21 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (54): addFile(), addPastedChat(), ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent (+46 more)

### Community 9 - "testId"
Cohesion: 0.07
Nodes (45): db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, db, goodsDeal() (+37 more)

### Community 10 - "qa/src/index.ts"
Cohesion: 0.10
Nodes (31): Prepared, appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask(), RANK_CRITERIA, draftCouncilTask(), ResponseDraft (+23 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.08
Nodes (51): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), DISPUTE_EVENT_PREFIX, agentBodySha256(), ARTIFACT_KINDS (+43 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.06
Nodes (87): emailReceiptQuietly(), afterQuery, ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+79 more)

### Community 13 - "claim-analyses.ts"
Cohesion: 0.08
Nodes (28): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+20 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (45): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+37 more)

### Community 15 - "email/src/index.ts"
Cohesion: 0.06
Nodes (52): FILE_NAME_HEADER, fileNameFrom(), fileParams, FileRouteOptions, REFUSALS, uploadQuery, answerEmail(), AnswerFacts (+44 more)

### Community 16 - "seed-sandbox.ts"
Cohesion: 0.08
Nodes (37): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+29 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (66): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), InvalidFieldsError, isChangeOrders(), proposeChange() (+58 more)

### Community 18 - "App.tsx"
Cohesion: 0.12
Nodes (45): createDeal(), getDealOptions(), redeemLink(), SIGN_IN_PATH, signOut(), App(), Dashboard(), DealList() (+37 more)

### Community 19 - "react"
Cohesion: 0.11
Nodes (35): Me, CommandPalette(), PLACES, byUrgency(), dueWords(), initials(), isOpen(), matchingDeals() (+27 more)

### Community 20 - "timeline-routes.ts"
Cohesion: 0.18
Nodes (25): DealCards, sendTimelineReminders(), changeView(), dealCompleteness(), OVERVIEW_LIMIT, overviewOf(), money(), scopeTerms() (+17 more)

### Community 21 - "review.ts"
Cohesion: 0.11
Nodes (35): MessageJob, MessageReviewView, checkAnalysis(), invalid(), MAX_STATEMENTS, readAnalysis(), AnswerRefusal, checkAnswer() (+27 more)

### Community 22 - "Engineering"
Cohesion: 0.06
Nodes (42): checkMcp(), Engineering, dollar, setup(), PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+34 more)

### Community 23 - "vitest"
Cohesion: 0.08
Nodes (27): db, db, ORDERING, OrderView, View, capturingEmail(), db, sentStage() (+19 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): ChatImage, JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize() (+39 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.05
Nodes (59): AppOptions, SignInOptions, publishingBus(), Config, MilestoneRouteOptions, DealOptions, log, DisputeWriter (+51 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.14
Nodes (17): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, migrationStatus, readApplied() (+9 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.06
Nodes (55): checkLedger(), getDeal(), getMe(), getScope(), LedgerCheck, listDeals(), ScopeTerms, ScopeView (+47 more)

### Community 29 - "readLedger"
Cohesion: 0.06
Nodes (45): disputeTypes(), payments(), ARTIFACT_LIMITS, ArtifactLimits, NewArtifact, chat, counts(), db (+37 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.07
Nodes (62): analysesUrl(), AppealCheckView, AppealView, checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+54 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (44): build(), input, numbered, DraftStepKind, EvalCase, EvalGold, linesOf(), baseLines() (+36 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.09
Nodes (32): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), clients, parsed (+24 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.06
Nodes (58): ACCEPTANCE_DOCUMENT_FORMAT, currentDocument(), documentFor(), fingerprinted(), money, view(), judgedScope(), completenessRoutes() (+50 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.08
Nodes (34): Money, giveAgLicence(), Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR, STATUS_BAR (+26 more)

### Community 35 - ".query"
Cohesion: 0.09
Nodes (55): acceptTerms, declineTerms, lockFor(), originOf(), recordReceiptSent(), requestAcceptance, setStatus(), waitingVersion() (+47 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (52): buildReceipt(), emailReceipt(), ReceiptIntegrityError, attachmentHeader(), sendDownload(), aiBlocks(), dateTime(), ExhibitPlan (+44 more)

### Community 37 - "receipt.ts"
Cohesion: 0.12
Nodes (31): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+23 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.09
Nodes (28): ListingRouteOptions, LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, photosBody, BASE, LISTING, Channel3Lookup (+20 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.13
Nodes (33): draftCategories, DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection() (+25 more)

### Community 40 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (40): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList (+32 more)

### Community 41 - "validate.ts"
Cohesion: 0.07
Nodes (46): RANK_CRITERIA, ScopeDraftTask, paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES (+38 more)

### Community 42 - "eval-judge.ts"
Cohesion: 0.12
Nodes (29): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+21 more)

### Community 43 - "config.ts"
Cohesion: 0.06
Nodes (46): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS, appVars(), FEATURES (+38 more)

### Community 44 - "seller-connections.ts"
Cohesion: 0.19
Nodes (13): claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow, endConnection(), first(), keysRow (+5 more)

### Community 45 - "ref_zod"
Cohesion: 0.07
Nodes (40): ACCEPTANCE_NOTICE_VERSION, MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role, ROLES (+32 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.13
Nodes (18): actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind, DisputeActionNotAllowedError (+10 more)

### Community 47 - "buildApp"
Cohesion: 0.09
Nodes (23): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+15 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.17
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 49 - "eval-runner.test.ts"
Cohesion: 0.17
Nodes (11): councilDeps(), councilRecordOf(), isRankingRequest(), CouncilRecord, two, clients(), down, invented (+3 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.05
Nodes (62): queuedDrafting(), signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+54 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (25): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline (+17 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.12
Nodes (29): getDisputePage(), BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent (+21 more)

### Community 53 - "tools.ts"
Cohesion: 0.09
Nodes (31): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), McpRouteOptions, mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS (+23 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (27): key(), seller(), title(), draft(), unchanged(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1) (+19 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.07
Nodes (48): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+40 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.12
Nodes (28): checkView(), deliveryCheckRoutes(), looks(), CheckedFile, CheckLine, codeChecks(), judge(), largest() (+20 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.05
Nodes (58): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), ChangeProposal (+50 more)

### Community 59 - "delivery-check-routes.ts"
Cohesion: 0.10
Nodes (29): DealLookup, ChangeOrderRouteOptions, CompletenessRouteOptions, checkBody, DeliveryCheckRouteOptions, LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+21 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "main.tsx"
Cohesion: 0.16
Nodes (14): applyTheme(), isDark(), nextTheme(), ORDER, readTheme(), savedTheme(), Theme, now() (+6 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+23 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.14
Nodes (32): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+24 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.09
Nodes (30): db, sellerDeal(), withReadyDraft(), addArtifact(), ArtifactKind, at(), db, delivered() (+22 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.14
Nodes (29): appealApplies(), ClaimRunner, analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob() (+21 more)

### Community 69 - "paypal-webhook.ts"
Cohesion: 0.14
Nodes (15): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+7 more)

### Community 70 - "postgres.ts"
Cohesion: 0.08
Nodes (20): result, connect(), Row, MIGRATIONS, connectPostgres(), databaseFromPool(), fakeClient(), Handler (+12 more)

### Community 71 - "deliveries.ts"
Cohesion: 0.06
Nodes (29): AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile, DeliveryNotAllowedError (+21 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (80): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+72 more)

### Community 74 - "question-routes.ts"
Cohesion: 0.14
Nodes (23): featureAnswers(), step(), changeOrderRoutes(), waitingChange(), answerBody, askBody, Attempt, MODELS_PER_QUESTION (+15 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (48): AppealContext, AppealTask, ClaimAnalysis, ClaimContext, AGREEMENT, CLAIM, context, ENTRIES (+40 more)

### Community 76 - "scope.ts"
Cohesion: 0.11
Nodes (21): AgreementListing, agreementListingSchema, buyerProvidesSchema, checkedVersion(), confirmedFromSchema, deliverableKindSchema, insertScopeVersion(), lastVersion (+13 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (25): Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+17 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "question-routes.test.ts"
Cohesion: 0.14
Nodes (15): awaitingDeal(), db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View (+7 more)

### Community 82 - "parseJsonReply"
Cohesion: 0.28
Nodes (16): parseJsonReply(), AppealCheck, checkAppeal(), readAppeal(), checkResponse(), readResponse(), AppealStatement, checkStatement() (+8 more)

### Community 83 - "db/src/index.ts"
Cohesion: 0.03
Nodes (88): sendDisputeNotices(), app, PayPalWebhookOptions, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestKind, AgentRequestRefusal (+80 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "resend-inbound.ts"
Cohesion: 0.20
Nodes (13): createIntakeDeal(), intakeFilename(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), findIntakeKey() (+5 more)

### Community 87 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (39): FakePayPalMode, DisputeActionNotAllowed, EvidenceFileError, PayPalApiError, PayPalErrorDetail, PayPalNetworkError, CheckedEvidenceFile, checkEvidenceFiles() (+31 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "chat.ts"
Cohesion: 0.13
Nodes (17): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), lastSeq, listAllMessages() (+9 more)

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (24): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+16 more)

### Community 95 - "testSpec"
Cohesion: 0.06
Nodes (47): model(), isRanking(), member(), model(), model(), `claim_analyses`: council comparisons of a dispute claim with the record, spec, FakeChatClient (+39 more)

### Community 96 - "delivery-check-routes.test.ts"
Cohesion: 0.21
Nodes (10): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+2 more)

### Community 97 - "render.ts"
Cohesion: 0.12
Nodes (19): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, columnWidths(), Fonts (+11 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.09
Nodes (42): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+34 more)

### Community 101 - "api.ts"
Cohesion: 0.05
Nodes (93): AgentRequestsPanel(), addBuyer(), AgentRequestView, answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict (+85 more)

### Community 102 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

### Community 103 - "scope-draft/src/index.ts"
Cohesion: 0.06
Nodes (64): CHAT_TRANSCRIPT_PREFIX, sendRefusal(), sendCheckedFile(), decoder, draftParams, draftRoutes(), beginDraft(), sourceFile() (+56 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Layout"
Cohesion: 0.30
Nodes (4): breakWord(), drawable(), drawBlock(), Layout

### Community 106 - "draft-routes.test.ts"
Cohesion: 0.17
Nodes (14): chatDeal(), db, models(), store, councilOf(), db, draftedAs(), idOf() (+6 more)

### Community 107 - "words/src/index.ts"
Cohesion: 0.12
Nodes (31): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+23 more)

### Community 108 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 109 - "image.ts"
Cohesion: 0.35
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 110 - "test-app.ts"
Cohesion: 0.05
Nodes (76): agentDeal(), chatDeal(), db, MessageBody, signedDeal(), db, CheckView, db (+68 more)

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

### Community 115 - "users.ts"
Cohesion: 0.25
Nodes (13): isUniqueViolation(), SignedInPerson, SignInResult, signInWithPayPal(), findUserByEmail(), findUserByPayPalId(), linkPayPal(), NewUser (+5 more)

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
Cohesion: 0.05
Nodes (36): devDependencies, esbuild, tsx, @types/node, @types/ws, @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council (+28 more)

### Community 120 - "tokens.ts"
Cohesion: 0.24
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

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

### Community 128 - "sellerAppRoutes"
Cohesion: 0.60
Nodes (6): paypalUnavailable(), sellerAppRoutes(), registerAlerts(), removeAlerts(), sellerWebhookUrl(), setOwnAppWebhook()

### Community 129 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+9 more)

### Community 130 - "MessagesPanel.tsx"
Cohesion: 0.28
Nodes (10): checkMessage(), getMessages(), isMessages(), messagesUrl(), MessagesView, LABEL_WORDS, revisionNote(), ALERT (+2 more)

### Community 131 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

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

### Community 157 - "acceptance-routes.test.ts"
Cohesion: 0.25
Nodes (10): Card, db, savedDeal(), send(), signedDeal(), types(), View, work() (+2 more)

### Community 158 - "request-routes.ts"
Cohesion: 0.27
Nodes (9): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser(), AgentRequest (+1 more)

### Community 159 - "ledger-store.ts"
Cohesion: 0.07
Nodes (41): Queryable, lockedDeal, addBuyerSchema, BuyerRefusal, CATEGORY_IDS, DEAL_CURRENCIES, DEAL_KINDS, DEAL_STATUSES (+33 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (32): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+24 more)

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 172 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 173 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **120 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1754 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Database`, `MessagesPanel.tsx`, `useRoute.ts`, `styles.ts`, `change-orders.ts`, `net/src/index.ts`, `DraftReview.tsx`, `testId`, `qa/src/index.ts`, `ledger/src/index.ts`, `claim-analyses.ts`, `ai/src/index.ts`, `email/src/index.ts`, `seed-sandbox.ts`, `ScopePanel.tsx`, `react`, `review.ts`, `Engineering`, `vitest`, `council/src/index.ts`, `server/src/index.ts`, `db/src/migrate.ts`, `DealPage.tsx`, `acceptance-routes.test.ts`, `readLedger`, `scope-draft/src/testing.ts`, `injection-runner.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `authAssertion`, `packet-service.ts`, `receipt.ts`, `products/src/index.ts`, `eval-report.ts`, `log-labels.test.ts`, `paypal/src/disputes.ts`, `eval-judge.ts`, `config.ts`, `validate.ts`, `sign-in-words.ts`, `buildApp`, `dispute-sync.ts`, `eval-runner.test.ts`, `disputes/test-support.ts`, `Deadlines.tsx`, `action-routes.ts`, `timeline/src/index.ts`, `completeness.ts`, `main.tsx`, `DisputeActions.tsx`, `claim-job.ts`, `scope-drafts.ts`, `paypal-webhook.ts`, `postgres.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `question-routes.test.ts`, `db/src/index.ts`, `resend-inbound.ts`, `paypal/src/index.ts`, `sandbox-webhook-report.ts`, `testSpec`, `delivery-check-routes.test.ts`, `render.ts`, `live-hub.ts`, `IntakePanel.tsx`, `scope-draft/src/index.ts`, `draft-routes.test.ts`, `words/src/index.ts`, `SellerAppPanel.tsx`, `test-app.ts`, `package.json`, `tokens.ts`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dispute-view.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13043478260869565 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Engineering` to `net/src/index.ts`, `qa/src/index.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `email/src/index.ts`, `seed-sandbox.ts`, `council/src/index.ts`, `acceptance-routes.test.ts`, `web/src/format.ts`, `packet-service.ts`, `log-labels.test.ts`, `paypal/src/disputes.ts`, `ref_zod`, `disputes/test-support.ts`, `Built (sub-phases 2b to 6h-1)`, `claim-job.ts`, `paypal/src/index.ts`, `testSpec`, `scope-draft/src/index.ts`, `words/src/index.ts`, `Decisions`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.06025039123630673 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `timeline/src/index.ts`, `README.md`, `Engineering`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.040969488188976375 - nodes in this community are weakly interconnected._