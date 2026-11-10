# Graph Report - paypal-hackathon  (2026-11-09)

## Corpus Check
- 622 files · ~414,182 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .css 4, .example 1)

## Summary
- 4909 nodes · 15690 edges · 154 communities (149 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 469 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1d3fafc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- postgresContentStore
- deliveries.ts
- seller-clients.ts
- vitest
- parts.tsx
- packets.test.ts
- SourceLine
- checker.ts
- ref_zod
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- DealPage.tsx
- draft-routes.ts
- ai/src/index.ts
- deals/routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- server/package.json
- layouts.tsx
- db/src/disputes.ts
- claims/src/check.ts
- testSpec
- sessions.ts
- paypal-webhook.test.ts
- council/src/index.ts
- Database
- change-orders.ts
- App.tsx
- email/src/index.ts
- validate.ts
- scope-draft/src/testing.ts
- draft-routes.ts
- action-routes.ts
- api.ts
- styles.ts
- packet-service.ts
- words/src/index.ts
- eval-runner.ts
- eval-report.ts
- confirmation.ts
- scope-draft/src/index.ts
- paypal-webhook.ts
- config.ts
- verifyStoredLedger
- DraftReview.tsx
- auth/sign-in.ts
- utcDateTime
- document.ts
- sandbox-partner-report.ts
- sandbox-webhook-report.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- src/intake.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- dependencies
- DisputeActions.tsx
- services
- claim-routes.ts
- scripts
- db/package.json
- net/src/index.ts
- eval-scope.ts
- dispute-sync.ts
- postgres.ts
- sign-in-words.ts
- claims/package.json
- appeal-items.ts
- claim-analyses.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- claim-job.ts
- paypal/src/index.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- AccessTokenProvider
- LiveHub
- resend-inbound.ts
- ai/package.json
- eval-judge.ts
- scripts
- chat-api.ts
- question-routes.ts
- email/package.json
- compilerOptions
- sellers/disputes.test.ts
- runCouncil
- when
- council-record.ts
- council/package.json
- db/src/index.ts
- Row
- app.test.ts
- score/package.json
- PactPal product spec
- devDependencies
- dependencies
- timeline-routes.ts
- Engineering standards
- package.json
- render.ts
- tokens.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- Redesign plan (proposed Phase 7R)
- devDependencies
- devDependencies
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
- change-order-routes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Scope
- QuestionsPanel.tsx
- .prettierrc.json
- Landing page (/ when signed out)
- engines
- PactPal design system
- linked-apps.test.ts

## God Nodes (most connected - your core abstractions)
1. `vitest` - 188 edges
2. `Database` - 114 edges
3. `testId()` - 103 edges
4. `readLedger()` - 86 edges
5. `useMigratedTestDatabase()` - 74 edges
6. `sha256Hex()` - 74 edges
7. `isObject()` - 61 edges
8. `TEST_NOW` - 61 edges
9. `Secret` - 61 edges
10. `appendLedgerEvent()` - 59 edges

## Surprising Connections (you probably didn't know these)
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
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

## Communities (154 total, 5 thin omitted)

### Community 0 - "postgresContentStore"
Cohesion: 0.20
Nodes (15): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+7 more)

### Community 1 - "deliveries.ts"
Cohesion: 0.07
Nodes (47): sentStage(), ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery (+39 more)

### Community 2 - "seller-clients.ts"
Cohesion: 0.28
Nodes (6): authAssertion(), base64Url(), clientsOver(), ownAppClients(), PlatformSellerClients, setup()

### Community 3 - "vitest"
Cohesion: 0.03
Nodes (179): db, SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+171 more)

### Community 4 - "parts.tsx"
Cohesion: 0.18
Nodes (15): LinkProblem, redeemLink(), LogoMark(), Alert(), ButtonLink(), Card(), Look, lookClass() (+7 more)

### Community 5 - "packets.test.ts"
Cohesion: 0.05
Nodes (43): db, disputedDeal(), FILES, GOOD, SummariesView, refusal(), AnalysisNotAllowedError, finishClaimAnalysis (+35 more)

### Community 6 - "SourceLine"
Cohesion: 0.27
Nodes (11): DraftJob, claimLines(), ClaimText, linesOf(), findInstructionLines(), hideInstructionLines(), looksLikeInstruction(), PATTERNS (+3 more)

### Community 7 - "checker.ts"
Cohesion: 0.09
Nodes (19): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), BUTTON_WINDOW_MS, checkKey() (+11 more)

### Community 8 - "ref_zod"
Cohesion: 0.06
Nodes (70): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent() (+62 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (72): AMOUNT_OPTIONS, amountOption(), disputeIdOption, issuesText(), message(), readChecked(), readOptions(), describeRoute() (+64 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (65): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+57 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.15
Nodes (29): DISPUTE_EVENT_PREFIX, mediaTypeOf(), canonicalJson(), JsonValue, sha256Hex(), detectMediaType(), FileFingerprint, hashFile() (+21 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.11
Nodes (34): addBuyer(), checkLedger(), checkPayments(), errorMessage(), getDeal(), getMe(), getMilestones(), isMilestones() (+26 more)

### Community 13 - "draft-routes.ts"
Cohesion: 0.05
Nodes (68): CHAT_TRANSCRIPT_PREFIX, DealLookup, featureAnswers(), step(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes() (+60 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.08
Nodes (41): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+33 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.07
Nodes (57): sendTimelineReminders(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+49 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.05
Nodes (48): send(), `buyer_questions`: questions about the agreement before signing, 1. Architecture and structure, AcceptClaimInput, answered(), collect(), DisputeAction, DisputeAnswer (+40 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (62): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+54 more)

### Community 18 - "server/package.json"
Cohesion: 0.07
Nodes (29): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+21 more)

### Community 19 - "layouts.tsx"
Cohesion: 0.20
Nodes (17): Me, Logo(), applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme(), Theme (+9 more)

### Community 20 - "db/src/disputes.ts"
Cohesion: 0.04
Nodes (60): CHECK_INTERVAL_MS, checkView(), disputeParams, disputeRoutes(), disputePageView(), disputeSummaryView(), openedAt(), ARTIFACT_KINDS (+52 more)

### Community 21 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (30): checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+22 more)

### Community 22 - "testSpec"
Cohesion: 0.05
Nodes (51): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), Prepared (+43 more)

### Community 23 - "sessions.ts"
Cohesion: 0.21
Nodes (16): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, currentSession(), setSessionCookie(), dealBuyer, linkRow (+8 more)

### Community 24 - "paypal-webhook.test.ts"
Cohesion: 0.15
Nodes (10): closeOnSignals(), socketOrigin(), report, setup(), ConfigReport, event, headers, rawBody (+2 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (53): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), Engineering, ChatFailureKind (+45 more)

### Community 26 - "Database"
Cohesion: 0.05
Nodes (76): AppOptions, buildApp(), requestLog(), setup(), SignInOptions, setup(), ChatBus, HubOptions (+68 more)

### Community 27 - "change-orders.ts"
Cohesion: 0.03
Nodes (108): waitingChange(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+100 more)

### Community 28 - "App.tsx"
Cohesion: 0.22
Nodes (15): signOut(), App(), dealPage(), Session, signInBack, inAppPath(), LinkClick, matchRoute() (+7 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.05
Nodes (38): linkedSeller(), RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, bareAddress(), check, InboxNetworkError (+30 more)

### Community 30 - "validate.ts"
Cohesion: 0.16
Nodes (24): Citation, amountQuoted(), categoryProblems(), citationProblem(), collectCitations(), invalid(), listCitations(), Located (+16 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (36): two, input, numbered, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, linesOf() (+28 more)

### Community 32 - "draft-routes.ts"
Cohesion: 0.06
Nodes (52): lockSigned(), DealNotFoundError, buyerProvidesSchema, checkedScopeContentSchema, checkedVersion(), confirmedFromSchema, deliverableKindSchema, checkedDraft() (+44 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.11
Nodes (29): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+21 more)

### Community 34 - "api.ts"
Cohesion: 0.04
Nodes (96): AnswerOptionView, BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus, ChangeOrdersView, ChangeOrderView, ChangeProposal (+88 more)

### Community 35 - "styles.ts"
Cohesion: 0.07
Nodes (49): AppealCheckView, AppealView, buildPacket(), checkAppeal(), CouncilView, draftResponse(), draftStatement(), draftSummary() (+41 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.10
Nodes (40): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), disputesUrl(), DisputesView (+32 more)

### Community 38 - "eval-runner.ts"
Cohesion: 0.18
Nodes (15): runPrepared(), draftCategories, toCouncilRecord(), toJson(), PROMPT_VERSIONS, runDraftJob(), EvalOptions, EvalRecord (+7 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "confirmation.ts"
Cohesion: 0.22
Nodes (13): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+5 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (43): JsonSchema, RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS (+35 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.13
Nodes (16): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+8 more)

### Community 43 - "config.ts"
Cohesion: 0.09
Nodes (31): result, loadConfigOrExit(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars() (+23 more)

### Community 44 - "verifyStoredLedger"
Cohesion: 0.08
Nodes (30): db, dealWithBuyer(), maya, report, db, later, newId(), sellerWithDeal() (+22 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (46): AcceptanceDocument(), AcceptanceDocument, ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, DraftView (+38 more)

### Community 46 - "auth/sign-in.ts"
Cohesion: 0.15
Nodes (14): backHome(), CALLBACK_PATH, callbackQuery, cookieRules, LOGOUT_PATH, ME_PATH, RETURN_COOKIE, sameSecret() (+6 more)

### Community 47 - "utcDateTime"
Cohesion: 0.14
Nodes (27): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+19 more)

### Community 48 - "document.ts"
Cohesion: 0.11
Nodes (26): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, acceptanceDocument, acceptanceDocumentSchema, documentFor(), fingerprinted(), money, acceptedPayload (+18 more)

### Community 49 - "sandbox-partner-report.ts"
Cohesion: 0.07
Nodes (41): Checked, payPalIdOption(), actFor(), message(), parsed, partners, platform, argsSchema (+33 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.07
Nodes (31): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+23 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (22): @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words, name, private, scripts (+14 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.07
Nodes (46): addFile(), addPastedChat(), checksUrl(), DealFile, DeliveryCheckView, DraftContent, draftsUrl(), fileUrl() (+38 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.14
Nodes (18): log, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, DISPUTE_TASK_NAME, jsonLines() (+10 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.05
Nodes (51): review(), paid(), at(), source(), key(), seller(), draft(), deliveryLabel() (+43 more)

### Community 55 - "src/intake.ts"
Cohesion: 0.24
Nodes (9): CATEGORY_IDS, DEAL_CURRENCIES, IntakeKind, IntakeRefusal, keyRow, newAddressCode(), newKeySchema, newSecret() (+1 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (53): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile (+45 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (58): changeView(), money(), scopeTerms(), scopeView(), stepTerms(), view(), dated(), DraftedItem (+50 more)

### Community 59 - "mcp.ts"
Cohesion: 0.09
Nodes (26): checkMcp(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback (+18 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (24): Completeness, CompletenessInput, CompletenessItem, Facts, field(), ItemStatus, Measure, MEASURED (+16 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.17
Nodes (27): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+19 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.13
Nodes (32): actionChoices(), newestReady(), appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob() (+24 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "net/src/index.ts"
Cohesion: 0.07
Nodes (50): ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork() (+42 more)

### Community 68 - "eval-scope.ts"
Cohesion: 0.17
Nodes (14): logProgress(), valueOrExit(), modelNames(), clients, parsed, clients, parsed, councilFailures() (+6 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.06
Nodes (54): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+46 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "appeal-items.ts"
Cohesion: 0.10
Nodes (21): appealGaps(), missingFromPacket(), AlreadySent, appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId(), HeldDocument (+13 more)

### Community 74 - "claim-analyses.ts"
Cohesion: 0.12
Nodes (18): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+10 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (23): Moving a dispute to a verdict, Accounts and connection, AI, Disputes, Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+15 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.23
Nodes (23): appealFacts(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt (+15 more)

### Community 83 - "paypal/src/index.ts"
Cohesion: 0.09
Nodes (30): SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem, TestDisputeReason (+22 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+11 more)

### Community 86 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 87 - "AccessTokenProvider"
Cohesion: 0.13
Nodes (19): APP_KEYS, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+11 more)

### Community 88 - "LiveHub"
Cohesion: 0.08
Nodes (23): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), addCard(), db (+15 more)

### Community 89 - "resend-inbound.ts"
Cohesion: 0.19
Nodes (13): app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), findIntakeKey(), useIntakeKey() (+5 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 95 - "chat-api.ts"
Cohesion: 0.06
Nodes (68): StepView, chatUrl(), ChatView, getChat(), getNotifications(), getPastedChats(), getTimeline(), isChat() (+60 more)

### Community 97 - "question-routes.ts"
Cohesion: 0.15
Nodes (20): answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes(), attempt(), forward() (+12 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "sellers/disputes.test.ts"
Cohesion: 0.10
Nodes (28): box, checkDeps(), db, KEY, linkApp(), newId(), paidFromOwnApp(), `acceptances`: signed agreements (+20 more)

### Community 101 - "runCouncil"
Cohesion: 0.07
Nodes (48): JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), LABEL_WORDS, revisionNote(), MAX_MESSAGE_CHARS, MAX_OFFER_NOTE_CHARS (+40 more)

### Community 102 - "when"
Cohesion: 0.12
Nodes (36): AcceptancePanel(), ReceiptEmails(), AnswerBox(), Revisions, revisionWords(), acceptanceStep(), acceptanceUrl(), AcceptanceView (+28 more)

### Community 103 - "council-record.ts"
Cohesion: 0.17
Nodes (15): councilRecordOf(), CouncilRecord, councilRecordSchema, isUnranked(), usage, categoryLabels, describeDraft(), DraftView (+7 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 107 - "db/src/index.ts"
Cohesion: 0.03
Nodes (138): PayPalWebhookOptions, body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+130 more)

### Community 109 - "Row"
Cohesion: 0.15
Nodes (10): Row, MIGRATIONS, db, PgClient, PgConnection, createTestDatabase(), Engine, queryOn() (+2 more)

### Community 110 - "app.test.ts"
Cohesion: 0.31
Nodes (10): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+2 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher, @pactpal/words (+2 more)

### Community 115 - "timeline-routes.ts"
Cohesion: 0.15
Nodes (17): Card, DealCards, Notifier, PartyNotice, AcceptanceRouteOptions, REFUSALS, stepParams, TimelineRouteOptions (+9 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 119 - "render.ts"
Cohesion: 0.06
Nodes (40): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+32 more)

### Community 120 - "tokens.ts"
Cohesion: 0.24
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.18
Nodes (11): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+3 more)

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

### Community 128 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 130 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 131 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react

### Community 133 - "Demo plan"
Cohesion: 0.22
Nodes (8): Contrast clip: a thin packet, Demo plan, Honesty rules for the demo, Seed script, Story 1: Maya, digital artist (main story), Story 2: Daniel, freelance web developer (change order and appeal), Story 3: Jun, digital templates (download log), Video script (under 3 minutes)

### Community 134 - "PactPal"
Cohesion: 0.22
Nodes (9): Code map, Deploying to Render, Disclaimer, Docs, License, PactPal, Quality, Running locally (+1 more)

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

### Community 150 - "change-order-routes.ts"
Cohesion: 0.11
Nodes (25): ACCEPTANCE_NOTICE_VERSION, acceptBody, changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256 (+17 more)

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

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 160 - "QuestionsPanel.tsx"
Cohesion: 0.21
Nodes (16): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), DealSummary, ForwardReason, getQuestions(), isQuestions(), questionStep() (+8 more)

### Community 169 - "PactPal design system"
Cohesion: 0.15
Nodes (13): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+5 more)

### Community 174 - "linked-apps.test.ts"
Cohesion: 0.12
Nodes (21): signedPayPal(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), apps(), box (+13 more)

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1620 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `deliveries.ts`, `seller-clients.ts`, `packets.test.ts`, `checker.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `deals/routes.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `layouts.tsx`, `db/src/disputes.ts`, `claims/src/check.ts`, `testSpec`, `paypal-webhook.test.ts`, `council/src/index.ts`, `change-orders.ts`, `App.tsx`, `email/src/index.ts`, `validate.ts`, `scope-draft/src/testing.ts`, `draft-routes.ts`, `api.ts`, `styles.ts`, `packet-service.ts`, `words/src/index.ts`, `eval-report.ts`, `confirmation.ts`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `verifyStoredLedger`, `DraftReview.tsx`, `linked-apps.test.ts`, `utcDateTime`, `document.ts`, `sandbox-partner-report.ts`, `sandbox-webhook-report.ts`, `DeliveriesPanel.tsx`, `Built (sub-phases 2b to 6h-1)`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `net/src/index.ts`, `eval-scope.ts`, `dispute-sync.ts`, `postgres.ts`, `sign-in-words.ts`, `appeal-items.ts`, `paypal/src/index.ts`, `build.js`, `AccessTokenProvider`, `LiveHub`, `resend-inbound.ts`, `chat-api.ts`, `sellers/disputes.test.ts`, `runCouncil`, `council-record.ts`, `db/src/index.ts`, `Row`, `app.test.ts`, `package.json`, `render.ts`, `tokens.ts`?**
  _High betweenness centrality (0.231) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `deliveries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06801346801346801 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `postgresContentStore`, `deliveries.ts`, `vitest`, `ref_zod`, `draft-routes.ts`, `deals/routes.ts`, `db/src/disputes.ts`, `change-order-routes.ts`, `sessions.ts`, `paypal-webhook.test.ts`, `change-orders.ts`, `draft-routes.ts`, `packet-service.ts`, `eval-runner.ts`, `verifyStoredLedger`, `auth/sign-in.ts`, `document.ts`, `src/intake.ts`, `claim-routes.ts`, `dispute-sync.ts`, `postgres.ts`, `appeal-items.ts`, `claim-analyses.ts`, `claim-job.ts`, `LiveHub`, `resend-inbound.ts`, `question-routes.ts`, `sellers/disputes.test.ts`, `runCouncil`, `db/src/index.ts`, `Row`, `app.test.ts`, `timeline-routes.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.029043954417640964 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `dispute-sync.ts` to `council/src/index.ts`, `timeline/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `packets.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05117845117845118 - nodes in this community are weakly interconnected._