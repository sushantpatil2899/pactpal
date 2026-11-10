# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 621 files · ~420,505 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 4969 nodes · 16029 edges · 154 communities (149 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 503 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9aab5153`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dispute-actions.ts
- app.ts
- Secret
- readLedger
- errors.ts
- .query
- api.ts
- action-routes.test.ts
- appendLedgerEvent
- sandbox-partner-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- routes.ts
- ref_zod
- ai/src/index.ts
- email/src/index.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- rest.ts
- live/src/index.ts
- change-order-routes.ts
- qa/src/index.ts
- mcp.ts
- AcceptancePanel.tsx
- server/package.json
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- dispute-sync.ts
- database.ts
- DraftReview.tsx
- scope-draft/src/testing.ts
- db/src/index.ts
- questions.ts
- .transaction
- seller-connections.ts
- packet-service.ts
- words/src/index.ts
- vitest
- eval-report.ts
- paypal/src/index.ts
- ledger-store.ts
- change-orders.test.ts
- config.ts
- FilesPanel.tsx
- acceptance-routes.ts
- record.ts
- question-routes.ts
- Database
- dispute-view.ts
- sellers/disputes.test.ts
- web/package.json
- DeliveriesPanel.tsx
- agent-requests.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- scope-draft/src/index.ts
- completeness.ts
- pdf/package.json
- DisputeActions.tsx
- services
- claim-routes.ts
- scripts
- db/package.json
- .query
- injection-report.ts
- QuestionsPanel.tsx
- postgres.ts
- useMigratedTestDatabase
- claims/package.json
- sandbox-respond-report.ts
- delivery-check.test.ts
- SellerAppPanel.tsx
- Layout
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- receipt.ts
- auth/sign-in.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- draft-job.ts
- image.ts
- live-test-support.ts
- ai/package.json
- check-words.ts
- eval-judge.ts
- scripts
- sandbox-webhook-report.ts
- request-routes.ts
- resend-inbound.test.ts
- render.ts
- email/package.json
- compilerOptions
- sandbox-clients.ts
- DealPage.tsx
- react
- tools.ts
- council/package.json
- appeal-items.ts
- timeline-routes.ts
- testId
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- Engineering standards
- package.json
- Decisions
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- paypal-webhook.ts
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
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Scope
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- sellers/disputes.test.ts
- log-labels.test.ts

## God Nodes (most connected - your core abstractions)
1. `vitest` - 190 edges
2. `Database` - 122 edges
3. `testId()` - 108 edges
4. `readLedger()` - 89 edges
5. `sha256Hex()` - 80 edges
6. `useMigratedTestDatabase()` - 77 edges
7. `appendLedgerEvent()` - 75 edges
8. `isObject()` - 64 edges
9. `TEST_NOW` - 64 edges
10. `Secret` - 61 edges

## Surprising Connections (you probably didn't know these)
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts
- ``agent_requests`: what an agent asks the seller to let it do (8c)` --references--> `done()`  [INFERRED]
  docs/data-model.md → packages/timeline/src/progress.ts
- `Deal space (Phase 7)` --references--> `publishingBus()`  [INFERRED]
  docs/decisions.md → apps/server/src/chat/bus.ts
- `Engineering` --references--> `sendDownload()`  [INFERRED]
  docs/decisions.md → apps/server/src/deals/download.ts

## Import Cycles
- None detected.

## Communities (154 total, 5 thin omitted)

### Community 0 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (25): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+17 more)

### Community 1 - "app.ts"
Cohesion: 0.10
Nodes (25): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), SignInOptions (+17 more)

### Community 2 - "Secret"
Cohesion: 0.05
Nodes (45): Config, sendForAcceptance(), signThroughRoutes(), Engineering, ClientOptions, bareAddress(), InboxNetworkError, ResendReceivedEmails (+37 more)

### Community 3 - "readLedger"
Cohesion: 0.08
Nodes (28): Card, db, savedDeal(), send(), signedDeal(), types(), View, Answered (+20 more)

### Community 4 - "errors.ts"
Cohesion: 0.05
Nodes (41): dollar, setup(), MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer, page() (+33 more)

### Community 5 - ".query"
Cohesion: 0.05
Nodes (58): waitingChange(), AcceptChange, acceptChangeSchema, addedCounts(), answer(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder (+50 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (98): addBuyer(), analysesUrl(), answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict, CHANGE_STATUSES (+90 more)

### Community 7 - "action-routes.test.ts"
Cohesion: 0.08
Nodes (33): db, buyerVisitors(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+25 more)

### Community 8 - "appendLedgerEvent"
Cohesion: 0.07
Nodes (50): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema (+42 more)

### Community 9 - "sandbox-partner-report.ts"
Cohesion: 0.14
Nodes (24): Checked, payPalIdOption(), actFor(), message(), parsed, partners, platform, argsSchema (+16 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (56): parseJsonReply(), tryParse(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), appealMessages(), appealSource() (+48 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.10
Nodes (38): agentBodySha256(), mediaTypeOf(), FinishClaimAnalysis, finishClaimAnalysis(), ContentMismatchError, db, store, canonicalJson() (+30 more)

### Community 12 - "routes.ts"
Cohesion: 0.08
Nodes (56): AcceptanceDocument, acceptanceDocument(), chatNames(), listQuery, notificationRoutes(), readRequest, dealAccess(), visibleDeal() (+48 more)

### Community 13 - "ref_zod"
Cohesion: 0.04
Nodes (103): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, ChatRouteOptions, chatRoutes(), postBody, REFUSALS, liveQuery (+95 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (47): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, loadConfigOrExit() (+39 more)

### Community 15 - "email/src/index.ts"
Cohesion: 0.08
Nodes (42): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+34 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.08
Nodes (32): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, 1. Architecture and structure, answered(), collect(), DisputeAnswer, disputeDetails (+24 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (68): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+60 more)

### Community 18 - "rest.ts"
Cohesion: 0.07
Nodes (36): checks, defaultHttpDeps, DEFAULT_RETRY_POLICY, Call, item, json(), Reply, setup() (+28 more)

### Community 19 - "live/src/index.ts"
Cohesion: 0.07
Nodes (52): chatUrl(), ChatView, getChat(), getPastedChats(), isChat(), isMessage(), isPasted(), liveUrl() (+44 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (47): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, documentFor(), fingerprinted(), money, sendTimelineReminders(), acceptBody, changeOrderRoutes() (+39 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.08
Nodes (48): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS, MessageJob (+40 more)

### Community 22 - "mcp.ts"
Cohesion: 0.10
Nodes (28): APP_KEYS, checkAsSellerApp(), checkMcp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+20 more)

### Community 23 - "AcceptancePanel.tsx"
Cohesion: 0.24
Nodes (16): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), declineTerms() (+8 more)

### Community 24 - "server/package.json"
Cohesion: 0.04
Nodes (66): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @fastify/static@^10.1.8, @fastify/websocket@^11.3.7, @modelcontextprotocol/sdk@1.32.1, @pactpal/ai@workspace:* (+58 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (48): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+40 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.11
Nodes (28): publishingBus(), formatErrors(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME (+20 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.23
Nodes (13): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+5 more)

### Community 28 - "dispute-sync.ts"
Cohesion: 0.06
Nodes (53): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+45 more)

### Community 29 - "database.ts"
Cohesion: 0.05
Nodes (52): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+44 more)

### Community 30 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (62): AppealCheckView, AppealView, ChatLine, Citation, CouncilView, DraftCandidate, DraftCategory, DraftMark (+54 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (41): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind (+33 more)

### Community 32 - "db/src/index.ts"
Cohesion: 0.04
Nodes (92): listeners(), postgresBus(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole (+84 more)

### Community 33 - "questions.ts"
Cohesion: 0.09
Nodes (34): originOf(), AiAnswer, aiAnswerSchema, answerQuestion(), answerQuestionSchema, AskQuestion, askQuestion(), askQuestionSchema (+26 more)

### Community 34 - ".transaction"
Cohesion: 0.10
Nodes (36): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+28 more)

### Community 35 - "seller-connections.ts"
Cohesion: 0.10
Nodes (27): paypalUnavailable(), sellerAppRoutes(), registerAlerts(), removeAlerts(), sellerAppView(), linkedSeller(), sellerWebhookUrl(), claimAccount() (+19 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (61): buildReceipt(), ReceiptIntegrityError, appealFacts(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf() (+53 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.09
Nodes (42): ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, getDisputePage(), Analysis(), ClaimPanel(), Statement(), ADDED_BY (+34 more)

### Community 38 - "vitest"
Cohesion: 0.10
Nodes (30): db, STEPS, StepView, TimelineView, refusal(), disputed(), db, PNG (+22 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.35
Nodes (16): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+8 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (50): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS (+42 more)

### Community 41 - "ledger-store.ts"
Cohesion: 0.08
Nodes (31): addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+23 more)

### Community 42 - "change-orders.test.ts"
Cohesion: 0.09
Nodes (26): db, ORDERING, OrderView, View, `change_orders`: changes to a signed agreement, at(), db, ORDERING (+18 more)

### Community 43 - "config.ts"
Cohesion: 0.11
Nodes (23): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+15 more)

### Community 44 - "FilesPanel.tsx"
Cohesion: 0.13
Nodes (19): addFile(), addPastedChat(), fileUrl(), isFile(), isReading(), listFiles(), MAX_FILE_BYTES, readScreenshots() (+11 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (27): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent() (+19 more)

### Community 46 - "record.ts"
Cohesion: 0.10
Nodes (30): checkAnalysis(), invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, AGREEMENT, CLAIM, context (+22 more)

### Community 47 - "question-routes.ts"
Cohesion: 0.15
Nodes (21): answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes(), attempt(), forward() (+13 more)

### Community 48 - "Database"
Cohesion: 0.06
Nodes (56): DeliveryRouteOptions, MilestoneRouteOptions, milestoneRoutes(), answer(), sellerApp(), paypalProblem(), sendBody, SendOutcome (+48 more)

### Community 49 - "dispute-view.ts"
Cohesion: 0.14
Nodes (20): CHECK_INTERVAL_MS, disputeOf(), checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputeFieldsOf(), DisputeMessageView (+12 more)

### Community 50 - "sellers/disputes.test.ts"
Cohesion: 0.07
Nodes (42): chatDeal(), db, models(), store, queuedDrafting(), BUTTON_WINDOW_MS, checkKey(), CheckRequest (+34 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.09
Nodes (39): AnswerBox(), Revisions, revisionWords(), AcceptanceDocument, AgentRequestView, approveDelivery(), checksUrl(), deliveriesUrl() (+31 more)

### Community 53 - "agent-requests.ts"
Cohesion: 0.15
Nodes (19): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest(), claimAgentRequest(), createAgentRequest() (+11 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.08
Nodes (32): at(), source(), key(), seller(), draft(), unchanged(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c) (+24 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (39): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+31 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (24): DeliveryCheckView, CheckedFile, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES (+16 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.05
Nodes (68): ChangeProposal, DraftContent, ScopeInput, ScopeTerms, ScopeView, StepView, RunningStepView, draftChanges() (+60 more)

### Community 59 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (94): chosenDraft(), compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided() (+86 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (32): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+24 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.12
Nodes (31): appealApplies(), ClaimRunner, analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob() (+23 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @pactpal/ledger@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13, @types/node@^22.10.2 (+17 more)

### Community 67 - ".query"
Cohesion: 0.11
Nodes (30): db, sellerDeal(), withReadyDraft(), checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError (+22 more)

### Community 68 - "injection-report.ts"
Cohesion: 0.23
Nodes (10): DroppedDraft, droppedSection(), ruleOf(), councilFailures(), counts(), formatInjectionReport(), InjectionRun, models() (+2 more)

### Community 69 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 70 - "postgres.ts"
Cohesion: 0.08
Nodes (17): listArtifacts(), Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres() (+9 more)

### Community 71 - "useMigratedTestDatabase"
Cohesion: 0.09
Nodes (15): Listen, memoryBus(), addCard(), db, hubOnTestDeal(), db, db, pdf (+7 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (60): AMOUNT_OPTIONS, amountOption(), disputeIdOption, issuesText(), logProgress(), message(), readChecked(), readOptions() (+52 more)

### Community 74 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 75 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 76 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

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

### Community 81 - "testSpec"
Cohesion: 0.03
Nodes (95): councilDeps(), councilRecordOf(), isRankingRequest(), CheckView, db, FAILED, model(), shown (+87 more)

### Community 82 - "receipt.ts"
Cohesion: 0.18
Nodes (11): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), document (+3 more)

### Community 83 - "auth/sign-in.ts"
Cohesion: 0.05
Nodes (61): LinkOptions, linkRoutes(), redeemBody, backHome(), callbackQuery, cookieRules, currentSession(), LOGOUT_PATH (+53 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "build.js"
Cohesion: 0.12
Nodes (9): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+1 more)

### Community 87 - "draft-job.ts"
Cohesion: 0.12
Nodes (23): PROMPT_VERSIONS, JsonSchema, RankingPromptInput, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input (+15 more)

### Community 88 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 89 - "live-test-support.ts"
Cohesion: 0.31
Nodes (8): db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page(), db, NoteBody

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "check-words.ts"
Cohesion: 0.36
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport()

### Community 92 - "eval-judge.ts"
Cohesion: 0.10
Nodes (33): draftCategories, alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions (+25 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "request-routes.ts"
Cohesion: 0.28
Nodes (8): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser(), AgentRequest

### Community 96 - "resend-inbound.test.ts"
Cohesion: 0.32
Nodes (6): RESEND_INBOUND_PATH, db, forwarding(), inbox(), SECRET_BYTES, listDealsForUser()

### Community 97 - "render.ts"
Cohesion: 0.15
Nodes (17): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+9 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "sandbox-clients.ts"
Cohesion: 0.11
Nodes (22): PayPalApp, APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+14 more)

### Community 101 - "DealPage.tsx"
Cohesion: 0.09
Nodes (41): AgentRequestsPanel(), checkDisputes(), checkLedger(), checkMessage(), disputesUrl(), DisputesView, getDisputes(), getMessages() (+33 more)

### Community 102 - "react"
Cohesion: 0.08
Nodes (34): DealOptions, getDealOptions(), getIntakeKey(), getMe(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey() (+26 more)

### Community 103 - "tools.ts"
Cohesion: 0.05
Nodes (58): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+50 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 108 - "appeal-items.ts"
Cohesion: 0.20
Nodes (11): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, ADDED_BY (+3 more)

### Community 109 - "timeline-routes.ts"
Cohesion: 0.07
Nodes (23): McpRouteOptions, BusSignal, ChatBus, Card, DealCards, messageView(), HubOptions, LiveHub (+15 more)

### Community 110 - "testId"
Cohesion: 0.05
Nodes (60): mcpClient(), ToolResult, REDEEM_PATH, db, setup(), CALLBACK_PATH, RETURN_COOKIE, SESSION_COOKIE (+52 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.40
Nodes (5): Agents (Phase 8), AI, Decisions, Partner tools, Product

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

### Community 129 - "paypal-webhook.ts"
Cohesion: 0.13
Nodes (15): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+7 more)

### Community 133 - "Demo plan"
Cohesion: 0.22
Nodes (8): Contrast clip: a thin packet, Demo plan, Honesty rules for the demo, Seed script, Story 1: Maya, digital artist (main story), Story 2: Daniel, freelance web developer (change order and appeal), Story 3: Jun, digital templates (download log), Video script (under 3 minutes)

### Community 134 - "PactPal"
Cohesion: 0.20
Nodes (10): Code map, Connect your agent (MCP), Deploying to Render, Disclaimer, Docs, License, PactPal, Quality (+2 more)

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

### Community 164 - "sellers/disputes.test.ts"
Cohesion: 0.09
Nodes (41): agentDeal(), db, signedDeal(), db, signedDeal(), signedDeal(), sellerDeal(), sellerDeal() (+33 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.20
Nodes (11): review(), changes(), entry(), sent(), Data model, `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `message_reviews`: council reviews of the buyer's messages (+3 more)

## Knowledge Gaps
- **22 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1443 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `testSpec` to `app.ts`, `paypal-webhook.ts`, `readLedger`, `Secret`, `errors.ts`, `action-routes.test.ts`, `appendLedgerEvent`, `sandbox-partner-report.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `email/src/index.ts`, `ScopePanel.tsx`, `rest.ts`, `live/src/index.ts`, `qa/src/index.ts`, `mcp.ts`, `council/src/index.ts`, `db/src/migrate.ts`, `dispute-sync.ts`, `DraftReview.tsx`, `scope-draft/src/testing.ts`, `db/src/index.ts`, `questions.ts`, `.transaction`, `seller-connections.ts`, `sellers/disputes.test.ts`, `packet-service.ts`, `vitest`, `log-labels.test.ts`, `paypal/src/index.ts`, `ledger-store.ts`, `change-orders.test.ts`, `config.ts`, `FilesPanel.tsx`, `words/src/index.ts`, `record.ts`, `Database`, `sellers/disputes.test.ts`, `agent-requests.ts`, `action-routes.ts`, `timeline/src/index.ts`, `scope-draft/src/index.ts`, `completeness.ts`, `DisputeActions.tsx`, `claim-routes.ts`, `.query`, `injection-report.ts`, `postgres.ts`, `useMigratedTestDatabase`, `sandbox-respond-report.ts`, `delivery-check.test.ts`, `SellerAppPanel.tsx`, `receipt.ts`, `auth/sign-in.ts`, `build.js`, `draft-job.ts`, `live-test-support.ts`, `check-words.ts`, `eval-judge.ts`, `sandbox-webhook-report.ts`, `resend-inbound.test.ts`, `render.ts`, `sandbox-clients.ts`, `DealPage.tsx`, `react`, `tools.ts`, `appeal-items.ts`, `testId`, `devDependencies`, `package.json`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dispute-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10826210826210826 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Secret` to `errors.ts`, `words/src/index.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `ledger/src/index.ts`, `appeal-items.ts`, `ref_zod`, `ai/src/index.ts`, `Database`, `testSpec`, `paypal/src/disputes.ts`, `rest.ts`, `Built (sub-phases 2b to 6h-1)`, `Decisions`, `council/src/index.ts`, `scope-draft/src/index.ts`, `DraftReview.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10338680926916222 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `timeline/src/index.ts`, `Secret`, `README.md`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.05348101265822785 - nodes in this community are weakly interconnected._