# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 719 files · ~480,238 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: .css 13, (none) 5, .example 1)

## Summary
- 5531 nodes · 17534 edges · 175 communities (169 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9b9b572a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- paypal/src/index.ts
- acceptance-routes.ts
- app-link-routes.ts
- postgres.test.ts
- styles.ts
- db/src/testing.ts
- Database
- Secret
- chat-api.ts
- draft-routes.ts
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- numberSourceLines
- ai/src/index.ts
- utcDateTime
- sandbox-partner-report.ts
- ScopePanel.tsx
- App.tsx
- PayPalRestClient
- claims/src/check.ts
- qa/src/index.ts
- PayPalRestClient
- DraftReview.tsx
- dependencies
- council/src/index.ts
- .query
- validate.ts
- DealPage.tsx
- database.ts
- words/src/index.ts
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
- config.ts
- claims/src/index.ts
- server/src/index.ts
- claim-job.ts
- tools.ts
- scope-draft/src/index.ts
- web-pages.test.ts
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
- ref_zod
- completeness.ts
- chain-scene.ts
- DisputeActions.tsx
- services
- db/src/migrate.ts
- scripts
- db/package.json
- scope.ts
- claim-routes.ts
- src/summary.test.ts
- web/src/format.ts
- questions.ts
- claims/package.json
- sandbox-respond-report.ts
- SellerAppPanel.tsx
- testSpec
- Pillars.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- seller-connections.ts
- MessagesPanel.tsx
- resend-inbound.ts
- scope-draft/package.json
- paypal/package.json
- question-routes.ts
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
- notifier.ts
- Landing.tsx
- Nav.tsx
- change-order-routes.ts
- council/package.json
- eval-judge.ts
- council
- QuestionsPanel.tsx
- Phase 7 (deal space)
- draft-job.ts
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
- linked-apps.ts
- dependencies
- main.tsx
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
- schema.ts
- Council.tsx
- .prettierrc.json
- products/tsconfig.json
- useRoute.ts
- Hero.tsx
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- Tour.tsx
- sign-in-words.ts
- milestones.ts
- vite-env.d.ts
- devDependencies
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 211 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `react` - 75 edges
8. `isObject()` - 70 edges
9. `TEST_NOW` - 66 edges
10. `Secret` - 65 edges

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

## Communities (175 total, 6 thin omitted)

### Community 0 - "paypal/src/index.ts"
Cohesion: 0.08
Nodes (32): SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem, TestDisputeReason (+24 more)

### Community 1 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (46): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), documentFor(), fingerprinted() (+38 more)

### Community 2 - "app-link-routes.ts"
Cohesion: 0.07
Nodes (33): linkBody, SellerAppLinking, SecretBox, Call, item, json(), Reply, setup() (+25 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 4 - "styles.ts"
Cohesion: 0.10
Nodes (36): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+28 more)

### Community 5 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (70): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+62 more)

### Community 6 - "Database"
Cohesion: 0.10
Nodes (26): ReceiptMailDeps, NotifierOptions, ReminderDeps, Config, DeliveryRouteOptions, FileRouteOptions, IntakeRouteOptions, ClaimJobDeps (+18 more)

### Community 7 - "Secret"
Cohesion: 0.05
Nodes (59): RFC-2606, Engineering, ClientOptions, OpenAiCompatibleClient, EmailFailure, emailMessageSchema, bareAddress(), check (+51 more)

### Community 8 - "chat-api.ts"
Cohesion: 0.05
Nodes (66): BusSignal, Listen, memoryBus(), db, hubOnTestDeal(), HubOptions, LiveHub, LivePage (+58 more)

### Community 9 - "draft-routes.ts"
Cohesion: 0.07
Nodes (48): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+40 more)

### Community 10 - "api.ts"
Cohesion: 0.04
Nodes (108): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), addBuyer() (+100 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.03
Nodes (95): db, agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+87 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.10
Nodes (38): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), listQuery, notificationRoutes() (+30 more)

### Community 13 - "numberSourceLines"
Cohesion: 0.16
Nodes (12): build(), input, numbered, linesOf(), MAX_SOURCE_CHARS, MAX_SOURCE_LINES, NumberedSource, numberSourceLines() (+4 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (44): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+36 more)

### Community 15 - "utcDateTime"
Cohesion: 0.15
Nodes (23): Notifier, answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+15 more)

### Community 16 - "sandbox-partner-report.ts"
Cohesion: 0.08
Nodes (40): valueOrExit(), rows(), actFor(), message(), parsed, partners, platform, argsSchema (+32 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (75): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+67 more)

### Community 18 - "App.tsx"
Cohesion: 0.10
Nodes (45): AcceptanceDocument(), AcceptanceDocument, createDeal(), getDealOptions(), LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard() (+37 more)

### Community 19 - "PayPalRestClient"
Cohesion: 0.07
Nodes (34): PayPalBuyerTestActions, dollar, setup(), PayPalMcpError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback (+26 more)

### Community 20 - "claims/src/check.ts"
Cohesion: 0.08
Nodes (38): MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM (+30 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.18
Nodes (21): quoteOnLine(), withoutLinePrefix(), messageReviewCouncilTask(), MessageReviewTask, RANK_CRITERIA, buildReviewMessages(), MESSAGE_PROMPT_VERSION, recordLines() (+13 more)

### Community 22 - "PayPalRestClient"
Cohesion: 0.07
Nodes (36): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+28 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.04
Nodes (72): addFile(), addPastedChat(), ChangeProposal, ChatLine, Citation, DealFile, DraftCandidate, DraftCategory (+64 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): ChatFailureKind, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+39 more)

### Community 26 - ".query"
Cohesion: 0.03
Nodes (128): addCard(), originOf(), recordReceiptSent(), AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind (+120 more)

### Community 27 - "validate.ts"
Cohesion: 0.12
Nodes (28): allowedCategoryIds(), BLOCKED_IDS, UNCLEAR_CATEGORY, paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares (+20 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.10
Nodes (32): checkLedger(), getDeal(), LedgerCheck, listDeals(), ScopeTerms, ScopeView, markNotificationsRead(), TimelineView (+24 more)

### Community 29 - "database.ts"
Cohesion: 0.04
Nodes (82): db, dealWithBuyer(), maya, report, db, goodsDeal(), SCOPE, WEBP (+74 more)

### Community 30 - "words/src/index.ts"
Cohesion: 0.11
Nodes (37): analysesUrl(), checkDisputes(), compareClaim(), DisputesView, getClaimAnalyses(), getDisputes(), isDisputes(), Analysis() (+29 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.12
Nodes (33): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), baseLines() (+25 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.19
Nodes (12): logProgress(), DroppedDraft, droppedSection(), ruleOf(), clients, councilFailures(), counts(), formatInjectionReport() (+4 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.08
Nodes (58): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+50 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.10
Nodes (33): DealSummary, Money, CommandPalette(), PLACES, Cell, COLUMNS, EXPORT, SIDE_BAR (+25 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.04
Nodes (75): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+67 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (42): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+34 more)

### Community 37 - "receipt.ts"
Cohesion: 0.09
Nodes (37): dateTime(), receiptBlocks(), checkPayments(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, sendInvoice() (+29 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.14
Nodes (19): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+11 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.15
Nodes (31): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+23 more)

### Community 40 - "dispute-sync.ts"
Cohesion: 0.18
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 41 - "config.ts"
Cohesion: 0.08
Nodes (34): result, loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS (+26 more)

### Community 42 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (71): PacketFacts, AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem (+63 more)

### Community 43 - "server/src/index.ts"
Cohesion: 0.07
Nodes (38): log, BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), renderWorkflowChecker(), RunnerBusyError (+30 more)

### Community 44 - "claim-job.ts"
Cohesion: 0.32
Nodes (19): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+11 more)

### Community 45 - "tools.ts"
Cohesion: 0.09
Nodes (30): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), McpRouteOptions, mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS (+22 more)

### Community 46 - "scope-draft/src/index.ts"
Cohesion: 0.09
Nodes (39): JsonSchema, ClaimText, BLOCKED_CATEGORIES, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, DraftSourceParts, messageLines() (+31 more)

### Community 47 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (43): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeDetails (+35 more)

### Community 49 - "db/src/index.ts"
Cohesion: 0.03
Nodes (102): ScopeChange, body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), lastSeq (+94 more)

### Community 50 - "notices.ts"
Cohesion: 0.12
Nodes (31): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+23 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (30): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+22 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.09
Nodes (34): getDisputePage(), isDisputePage(), StageView, StepView, RunningStepView, BAR_COLOURS, TODAY_LINE, addDays() (+26 more)

### Community 53 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (25): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+17 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (19): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deal_messages`: the deal's chat (7b), `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes (+11 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.10
Nodes (37): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+29 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (54): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), CheckedFile, CheckLine, codeChecks() (+46 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (67): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), dealOverview, DealStage (+59 more)

### Community 59 - "ref_zod"
Cohesion: 0.07
Nodes (51): liveQuery, LiveRouteOptions, liveRoutes(), check(), originAllowed(), rawText(), DealLookup, dealParams (+43 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "chain-scene.ts"
Cohesion: 0.11
Nodes (14): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+6 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.15
Nodes (29): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions(), isActionAnswer() (+21 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "db/src/migrate.ts"
Cohesion: 0.31
Nodes (10): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+2 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope.ts"
Cohesion: 0.05
Nodes (57): BASE, LISTING, AgreementListing, agreementListingSchema, buyerProvidesSchema, checkedScopeContentSchema, checkedVersion(), confirmedFromSchema (+49 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.13
Nodes (30): appealApplies(), analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob(), councilView (+22 more)

### Community 69 - "src/summary.test.ts"
Cohesion: 0.22
Nodes (9): ClaimAnalysis, comparisonRows(), comparisonText(), ANALYSIS, context, EXHIBITS, GOOD, RECORD (+1 more)

### Community 70 - "web/src/format.ts"
Cohesion: 0.11
Nodes (32): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftResponse(), getAppeal(), getResponses(), getStatements() (+24 more)

### Community 71 - "questions.ts"
Cohesion: 0.08
Nodes (31): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+23 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (57): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+49 more)

### Community 74 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 75 - "testSpec"
Cohesion: 0.05
Nodes (53): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+45 more)

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
Cohesion: 0.11
Nodes (23): linkedSeller(), `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow (+15 more)

### Community 82 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 83 - "resend-inbound.ts"
Cohesion: 0.16
Nodes (14): createIntakeDeal(), intakeFilename(), app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes() (+6 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "question-routes.ts"
Cohesion: 0.13
Nodes (26): featureAnswers(), step(), changeOrderRoutes(), view(), waitingChange(), answerBody, askBody, Attempt (+18 more)

### Community 87 - "landing-words.ts"
Cohesion: 0.16
Nodes (20): Audience(), GLYPHS, SPOTS, Sticker(), Dispute(), drift(), CLAIM, FAQ (+12 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "app.ts"
Cohesion: 0.09
Nodes (29): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+21 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "paypal-webhook.ts"
Cohesion: 0.11
Nodes (21): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+13 more)

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.12
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 95 - "sandbox-clients.ts"
Cohesion: 0.14
Nodes (17): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+9 more)

### Community 96 - "appeal-items.ts"
Cohesion: 0.16
Nodes (16): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+8 more)

### Community 97 - "render.ts"
Cohesion: 0.06
Nodes (39): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+31 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "notifier.ts"
Cohesion: 0.15
Nodes (16): ChatBus, listeners(), postgresBus(), publishingBus(), Card, NotificationRouteOptions, PartyNotice, ChatNotice (+8 more)

### Community 101 - "Landing.tsx"
Cohesion: 0.14
Nodes (14): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+6 more)

### Community 102 - "Nav.tsx"
Cohesion: 0.30
Nodes (11): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+3 more)

### Community 103 - "change-order-routes.ts"
Cohesion: 0.14
Nodes (19): acceptBody, ChangeOrderRouteOptions, changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256 (+11 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-judge.ts"
Cohesion: 0.12
Nodes (30): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+22 more)

### Community 106 - "council"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 107 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 108 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 109 - "draft-job.ts"
Cohesion: 0.15
Nodes (19): runPrepared(), draftCategories, councilRecordSchema, isUnranked(), toCouncilRecord(), toJson(), usage, DraftJob (+11 more)

### Community 110 - "test-app.ts"
Cohesion: 0.03
Nodes (157): db, agentDeal(), db, mcpClient(), ToolResult, db, SESSION_COOKIE, chatDeal() (+149 more)

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
Cohesion: 0.18
Nodes (11): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8), AI, Decisions (+3 more)

### Community 119 - "server/package.json"
Cohesion: 0.06
Nodes (32): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+24 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.10
Nodes (27): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+19 more)

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

### Community 128 - "linked-apps.ts"
Cohesion: 0.13
Nodes (12): MilestoneRouteOptions, DisputeReader, LinkedDisputeAccount, InvoiceSender, connectOwnApp(), InvoiceAccount, InvoiceAccounts, LinkedApp (+4 more)

### Community 129 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 130 - "main.tsx"
Cohesion: 0.16
Nodes (14): applyTheme(), isDark(), nextTheme(), ORDER, readTheme(), savedTheme(), Theme, now() (+6 more)

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
Nodes (48): getMe(), Me, signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage (+40 more)

### Community 159 - "schema.ts"
Cohesion: 0.11
Nodes (16): DraftStepKind, EvalGold, linesOf(), citations, commonFields, DELIVERABLE_MARKS, DeliverableMark, DRAFT_STEP_KINDS (+8 more)

### Community 160 - "Council.tsx"
Cohesion: 0.19
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

### Community 165 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 169 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 170 - "milestones.ts"
Cohesion: 0.12
Nodes (23): sentStage(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid(), markInvoiceSent() (+15 more)

### Community 175 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 176 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

## Knowledge Gaps
- **121 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1809 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `test-app.ts` to `paypal/src/index.ts`, `acceptance-routes.ts`, `main.tsx`, `IntakePanel.tsx`, `styles.ts`, `db/src/testing.ts`, `postgres.test.ts`, `Secret`, `chat-api.ts`, `app-link-routes.ts`, `api.ts`, `ledger/src/index.ts`, `numberSourceLines`, `ai/src/index.ts`, `utcDateTime`, `sandbox-partner-report.ts`, `ScopePanel.tsx`, `PayPalRestClient`, `claims/src/check.ts`, `qa/src/index.ts`, `PayPalRestClient`, `DraftReview.tsx`, `words/src/index.ts`, `council/src/index.ts`, `.query`, `validate.ts`, `DealPage.tsx`, `database.ts`, `Ledger.tsx`, `scope-draft/src/testing.ts`, `injection-runner.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `disputes/test-support.ts`, `packet-service.ts`, `useRoute.ts`, `App.tsx`, `eval-report.ts`, `dispute-sync.ts`, `config.ts`, `log-labels.test.ts`, `server/src/index.ts`, `sign-in-words.ts`, `milestones.ts`, `products/src/index.ts`, `web-pages.test.ts`, `paypal/src/disputes.ts`, `db/src/index.ts`, `scope-draft/src/index.ts`, `Deadlines.tsx`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `receipt.ts`, `completeness.ts`, `schema.ts`, `db/src/migrate.ts`, `scope.ts`, `src/summary.test.ts`, `questions.ts`, `sandbox-respond-report.ts`, `SellerAppPanel.tsx`, `testSpec`, `seller-connections.ts`, `MessagesPanel.tsx`, `resend-inbound.ts`, `landing-words.ts`, `app.ts`, `paypal-webhook.ts`, `sandbox-webhook-report.ts`, `sandbox-clients.ts`, `appeal-items.ts`, `render.ts`, `Nav.tsx`, `eval-judge.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.262) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08078231292517007 - nodes in this community are weakly interconnected._
- **Why does `react` connect `DealPage.tsx` to `main.tsx`, `IntakePanel.tsx`, `styles.ts`, `chat-api.ts`, `api.ts`, `ScopePanel.tsx`, `App.tsx`, `DraftReview.tsx`, `Ledger.tsx`, `words/src/index.ts`, `App.tsx`, `Council.tsx`, `DealsTable.tsx`, `useRoute.ts`, `Hero.tsx`, `receipt.ts`, `Tour.tsx`, `web/package.json`, `Deadlines.tsx`, `DisputeActions.tsx`, `web/src/format.ts`, `SellerAppPanel.tsx`, `Pillars.tsx`, `MessagesPanel.tsx`, `landing-words.ts`, `Landing.tsx`, `Nav.tsx`, `QuestionsPanel.tsx`, `Insights.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `acceptance-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07039187227866474 - nodes in this community are weakly interconnected._
- **Why does `@electric-sql/pglite` connect `db/package.json` to `db/src/testing.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `app-link-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06623376623376623 - nodes in this community are weakly interconnected._