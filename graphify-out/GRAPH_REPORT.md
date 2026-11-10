# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 611 files · ~411,407 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 4878 nodes · 15711 edges · 185 communities (164 shown, 21 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 490 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c166d20`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dispute-actions.ts
- buildApp
- Secret
- readLedger
- PayPalRestClient
- .query
- api.ts
- action-routes.test.ts
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- question-routes.ts
- ref_zod
- ai/src/index.ts
- email/src/index.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- dependencies
- app-link-routes.ts
- delivery-routes.ts
- qa/src/index.ts
- mcp.ts
- QuestionsPanel.tsx
- routes.ts
- council/src/index.ts
- Database
- db/src/index.ts
- notices.ts
- claim-analyses.ts
- react
- scope-draft/src/testing.ts
- appendLedgerEvent
- action-routes.ts
- acceptance.ts
- seller-connections.ts
- packet-service.ts
- words/src/index.ts
- db/src/testing.ts
- injection-runner.ts
- paypal/src/index.ts
- scope-draft/src/council-task.ts
- change-orders.test.ts
- config.ts
- createTestDeal
- DraftReview.tsx
- record.ts
- Secret
- delivery-routes.ts
- qa/src/index.ts
- disputes/test-support.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- src/summary.test.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- scope-draft/src/index.ts
- completeness.ts
- auth/sign-in.ts
- DisputeActions.tsx
- services
- claim-routes.ts
- scripts
- db/package.json
- scope-drafts.ts
- validate.ts
- dispute-sync.ts
- postgres.test.ts
- chat-routes.ts
- claims/package.json
- artifacts.test.ts
- pdf/package.json
- paypal/src/index.ts
- file-routes.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- db/src/migrate.ts
- sessions.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- council-record.ts
- @fastify/helmet
- resend-inbound.ts
- ai/package.json
- claim-job.ts
- eval-judge.ts
- scripts
- sandbox-clients.ts
- @pactpal/live@workspace:*
- server/package.json
- render.ts
- email/package.json
- compilerOptions
- confirmation.ts
- DealPage.tsx
- App.tsx
- intake-routes.ts
- council/package.json
- cli-models.ts
- check-words.ts
- sandbox-check.ts
- @pactpal/watcher@workspace:*
- change-order-routes.ts
- vitest
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- delivery-check.test.ts
- Engineering standards
- package.json
- Decisions
- Layout
- artifacts.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- questions.ts
- paypal-webhook.ts
- image.ts
- runner.test.ts
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
- draft-changes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- .query
- Scope
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- draft
- sellers/disputes.test.ts
- src/intake.ts
- web-pages.test.ts
- log-labels.test.ts
- @pactpal/qa@workspace:*
- @pactpal/score@workspace:*
- @pactpal/words@workspace:*
- instruction-lines.test.ts
- deliveries.test.ts
- eval-runner.ts
- Data model
- @pactpal/net@workspace:*
- @fastify/static
- @pactpal/ai@workspace:*
- @pactpal/council@workspace:*
- @pactpal/db@workspace:*
- @pactpal/ledger@workspace:*
- @pactpal/pdf@workspace:*
- @pactpal/scope-draft@workspace:*
- @pactpal/timeline@workspace:*
- ws

## God Nodes (most connected - your core abstractions)
1. `vitest` - 187 edges
2. `Database` - 114 edges
3. `testId()` - 103 edges
4. `readLedger()` - 86 edges
5. `sha256Hex()` - 77 edges
6. `useMigratedTestDatabase()` - 74 edges
7. `appendLedgerEvent()` - 71 edges
8. `isObject()` - 61 edges
9. `TEST_NOW` - 61 edges
10. `Secret` - 61 edges

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

## Communities (185 total, 21 thin omitted)

### Community 0 - "dispute-actions.ts"
Cohesion: 0.10
Nodes (26): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+18 more)

### Community 1 - "buildApp"
Cohesion: 0.14
Nodes (14): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+6 more)

### Community 2 - "Secret"
Cohesion: 0.07
Nodes (43): defaultHttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork(), policy, Step, urlOf() (+35 more)

### Community 3 - "readLedger"
Cohesion: 0.05
Nodes (76): chatDeal(), db, MessageBody, Card, db, savedDeal(), send(), signedDeal() (+68 more)

### Community 4 - "PayPalRestClient"
Cohesion: 0.08
Nodes (29): connectOwnApp(), LinkedAppClients, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback, invoice, Invoice (+21 more)

### Community 5 - ".query"
Cohesion: 0.06
Nodes (54): waitingChange(), AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+46 more)

### Community 6 - "api.ts"
Cohesion: 0.04
Nodes (114): addBuyer(), addFile(), addPastedChat(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict, CHANGE_STATUSES (+106 more)

### Community 7 - "action-routes.test.ts"
Cohesion: 0.07
Nodes (31): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+23 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (47): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), acceptanceDocumentSchema, currentDocument(), documentFor() (+39 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (73): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), logProgress(), message(), payPalIdOption() (+65 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (68): parseJsonReply(), AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem (+60 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.15
Nodes (28): DISPUTE_EVENT_PREFIX, mediaTypeOf(), FinishClaimAnalysis, canonicalJson(), JsonValue, sha256Hex(), detectMediaType(), FileFingerprint (+20 more)

### Community 12 - "question-routes.ts"
Cohesion: 0.12
Nodes (24): Card, ChatRouteOptions, PartyNotice, featureAnswers(), answerBody, askBody, Attempt, MODELS_PER_QUESTION (+16 more)

### Community 13 - "ref_zod"
Cohesion: 0.08
Nodes (54): DealLookup, dealParams, FoundDeal, Refusal, sendRefusal(), CompletenessRouteOptions, checkBody, checkView() (+46 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (46): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, Engineering (+38 more)

### Community 15 - "email/src/index.ts"
Cohesion: 0.16
Nodes (26): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+18 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (43): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, disputeDetails, DisputeList (+35 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (74): acceptChange(), changeStep(), declineChange(), InvalidFieldsError, ScopeInput, ScopeView, withdrawChange(), AddedStep (+66 more)

### Community 18 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/websocket@^11.3.7, @pactpal/claims@workspace:*, @pactpal/delivery-check@workspace:*, @pactpal/email@workspace:*, @pactpal/paypal@workspace:* (+11 more)

### Community 19 - "app-link-routes.ts"
Cohesion: 0.24
Nodes (14): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+6 more)

### Community 20 - "delivery-routes.ts"
Cohesion: 0.06
Nodes (36): AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile, DeliveryNotAllowedError (+28 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.11
Nodes (35): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+27 more)

### Community 22 - "mcp.ts"
Cohesion: 0.15
Nodes (17): checkMcp(), PayPalMcpError, noAnswer(), setupError(), describe(), McpClientOptions, McpTransportFactory, PayPalMcpClient (+9 more)

### Community 23 - "QuestionsPanel.tsx"
Cohesion: 0.11
Nodes (32): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion() (+24 more)

### Community 24 - "routes.ts"
Cohesion: 0.10
Nodes (47): DealCards, chatNames(), chatRoutes(), notificationRoutes(), Notifier, sendTimelineReminders(), AcceptanceRouteOptions, dealAccess() (+39 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (52): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), TokenUsage, aggregate() (+44 more)

### Community 26 - "Database"
Cohesion: 0.06
Nodes (42): AppOptions, SignInOptions, ChatBus, listQuery, NotificationRouteOptions, readRequest, NotifierOptions, ReminderDeps (+34 more)

### Community 27 - "db/src/index.ts"
Cohesion: 0.04
Nodes (72): body, ChatIntegrityError, ChatMessage, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), CHAT_CHANNEL (+64 more)

### Community 28 - "notices.ts"
Cohesion: 0.11
Nodes (33): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+25 more)

### Community 29 - "claim-analyses.ts"
Cohesion: 0.12
Nodes (16): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+8 more)

### Community 30 - "react"
Cohesion: 0.06
Nodes (71): analysesUrl(), AppealCheckView, AppealView, checkAppeal(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement (+63 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (31): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, linesOf(), baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+23 more)

### Community 32 - "appendLedgerEvent"
Cohesion: 0.07
Nodes (45): ContentMismatchError, contentRow, Queryable, lockedDeal, AddBuyer, addBuyer(), addBuyerSchema, BuyerNotAllowedError (+37 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.08
Nodes (40): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+32 more)

### Community 34 - "acceptance.ts"
Cohesion: 0.08
Nodes (45): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema (+37 more)

### Community 35 - "seller-connections.ts"
Cohesion: 0.13
Nodes (20): `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow, endConnection() (+12 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (48): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+40 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.13
Nodes (25): AcceptanceDocument, checkPayments(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, ScopeTerms, sendInvoice() (+17 more)

### Community 38 - "db/src/testing.ts"
Cohesion: 0.07
Nodes (49): disputeTypes(), payments(), db, dealWithMessages(), readEntries(), db, refusal(), AnalysisNotAllowedError (+41 more)

### Community 39 - "injection-runner.ts"
Cohesion: 0.12
Nodes (34): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+26 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (44): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+36 more)

### Community 41 - "scope-draft/src/council-task.ts"
Cohesion: 0.13
Nodes (22): JsonSchema, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input, numbered, buildScopeDraftMessages() (+14 more)

### Community 42 - "change-orders.test.ts"
Cohesion: 0.14
Nodes (15): sentStage(), at(), db, ORDERING, proposed(), signature(), SIGNED, markInvoiceSent() (+7 more)

### Community 43 - "config.ts"
Cohesion: 0.11
Nodes (24): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+16 more)

### Community 44 - "createTestDeal"
Cohesion: 0.07
Nodes (43): dealWithBuyer(), db, newDeal, sellerDeal(), setup(), signedIn(), at(), db (+35 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.09
Nodes (32): ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, FillChat, fillFrom() (+24 more)

### Community 46 - "record.ts"
Cohesion: 0.09
Nodes (30): checkAnalysis(), claimAnalysisSchema, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, AGREEMENT, CLAIM (+22 more)

### Community 47 - "Secret"
Cohesion: 0.05
Nodes (45): RFC-2606, ClientOptions, EmailFailure, emailMessageSchema, bareAddress(), check, InboxNetworkError, ReadResult (+37 more)

### Community 48 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (60): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, DeliveryRouteOptions, deliveryRoutes(), answer() (+52 more)

### Community 49 - "qa/src/index.ts"
Cohesion: 0.17
Nodes (19): attempt(), markedPrompt(), AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema (+11 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.12
Nodes (29): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+21 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.10
Nodes (34): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+26 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.11
Nodes (29): publishingBus(), formatErrors(), log, renderWorkflowChecker(), TaskStarter, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME (+21 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (25): at(), source(), key(), seller(), `acceptances`: signed agreements, `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement (+17 more)

### Community 55 - "src/summary.test.ts"
Cohesion: 0.09
Nodes (20): context, GOOD, input, ITEMS, RECORD, ClaimAnalysis, comparisonRows(), comparisonText() (+12 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (23): CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, Transparency, checkableLines() (+15 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.10
Nodes (32): Deal space (Phase 7), allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepProgress, StepState (+24 more)

### Community 59 - "scope-draft/src/index.ts"
Cohesion: 0.09
Nodes (30): DraftSourceParts, messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, citation, citations, commonFields (+22 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (23): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+15 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (31): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), isDisputeActions() (+23 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.15
Nodes (27): appealApplies(), analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob(), councilView (+19 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @pactpal/ledger@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13, @types/node@^22.10.2 (+17 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.13
Nodes (21): checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftRecord, DraftRefusal, draftRow, DraftStateError (+13 more)

### Community 68 - "validate.ts"
Cohesion: 0.12
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, DraftStep (+23 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.06
Nodes (50): CHECK_INTERVAL_MS, checkView(), disputeParams, disputeRoutes(), changedSince(), Counts, readTooSoon(), readVersionOf() (+42 more)

### Community 70 - "postgres.test.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 71 - "chat-routes.ts"
Cohesion: 0.05
Nodes (43): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal() (+35 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "artifacts.test.ts"
Cohesion: 0.17
Nodes (9): ARTIFACT_LIMITS, ArtifactLimits, NewArtifact, chat, counts(), db, file(), pdf (+1 more)

### Community 74 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 75 - "paypal/src/index.ts"
Cohesion: 0.08
Nodes (28): EvidenceFileError, PayPalErrorDetail, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf (+20 more)

### Community 76 - "file-routes.ts"
Cohesion: 0.16
Nodes (14): attachmentHeader(), sendCheckedFile(), sendDownload(), addedByRole(), FILE_NAME_HEADER, fileNameFrom(), fileParams, FileRouteOptions (+6 more)

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
Cohesion: 0.07
Nodes (43): councilDeps(), isRankingRequest(), CheckView, db, FAILED, model(), shown, store (+35 more)

### Community 82 - "db/src/migrate.ts"
Cohesion: 0.18
Nodes (14): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus() (+6 more)

### Community 83 - "sessions.ts"
Cohesion: 0.21
Nodes (13): dealBuyer, LINK_LIFETIME_MS, LinkNotAllowedError, linkRow, RedeemResult, createSession(), deleteSession(), findSession() (+5 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (18): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @pactpal/ledger (+10 more)

### Community 86 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 87 - "council-record.ts"
Cohesion: 0.14
Nodes (17): councilRecordOf(), CouncilRecord, councilRecordSchema, two, usage, categoryLabels, describeDraft(), DraftView (+9 more)

### Community 89 - "resend-inbound.ts"
Cohesion: 0.19
Nodes (13): app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), findIntakeKey(), useIntakeKey() (+5 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "claim-job.ts"
Cohesion: 0.14
Nodes (32): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+24 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-clients.ts"
Cohesion: 0.06
Nodes (38): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+30 more)

### Community 96 - "server/package.json"
Cohesion: 0.19
Nodes (13): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, @types/node, name, private (+5 more)

### Community 97 - "render.ts"
Cohesion: 0.15
Nodes (17): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+9 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 101 - "DealPage.tsx"
Cohesion: 0.05
Nodes (78): checkLedger(), checkMessage(), getDeal(), getMe(), getMessages(), isMessages(), LedgerCheck, MessageReviewView (+70 more)

### Community 102 - "App.tsx"
Cohesion: 0.09
Nodes (27): getSellerApp(), LinkProblem, linkSellerApp(), Me, redeemLink(), SellerAppLink, SellerAppProblem, SellerAppState (+19 more)

### Community 103 - "intake-routes.ts"
Cohesion: 0.22
Nodes (14): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+6 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "cli-models.ts"
Cohesion: 0.60
Nodes (4): loadConfigOrExit(), pickModels(), selectedClientsOrExit(), councilClients()

### Community 106 - "check-words.ts"
Cohesion: 0.22
Nodes (13): DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS (+5 more)

### Community 107 - "sandbox-check.ts"
Cohesion: 0.09
Nodes (25): APP_KEYS, Config, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS (+17 more)

### Community 109 - "change-order-routes.ts"
Cohesion: 0.12
Nodes (24): acceptBody, ChangeOrderRouteOptions, changeParams, declineBody, proposeBody, ProposeBody, proposedContent(), REFUSALS (+16 more)

### Community 110 - "vitest"
Cohesion: 0.09
Nodes (25): db, SESSION_COOKIE, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page() (+17 more)

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

### Community 115 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.50
Nodes (4): AI, Decisions, Partner tools, Product

### Community 119 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 120 - "artifacts.ts"
Cohesion: 0.18
Nodes (12): ARTIFACT_KINDS, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed(), assertRoom(), BUYER_MEDIA_TYPES (+4 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.18
Nodes (11): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+3 more)

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

### Community 128 - "questions.ts"
Cohesion: 0.07
Nodes (40): forward(), namedQuestion(), settle(), view(), questionView(), AiAnswer, aiAnswerSchema, AnswerQuestion (+32 more)

### Community 129 - "paypal-webhook.ts"
Cohesion: 0.21
Nodes (10): envelope, ParsedJson, parseJson(), paypalWebhookRoutes(), receive(), Receiver, SELLER_WEBHOOK_PATH, SellerAlertLookup (+2 more)

### Community 130 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 131 - "runner.test.ts"
Cohesion: 0.24
Nodes (8): council(), deps(), DRAFTS, isRankingCall(), ranking(), rankingRequests(), shown(), task

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

### Community 150 - "draft-changes.ts"
Cohesion: 0.22
Nodes (11): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+3 more)

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

### Community 157 - ".query"
Cohesion: 0.08
Nodes (35): ChatNotAllowedError, insertMessage(), markRead(), nextSeq(), postMessage(), postNotice(), StartClaimAnalysis, lockDeal() (+27 more)

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 163 - "draft"
Cohesion: 0.40
Nodes (5): draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 164 - "sellers/disputes.test.ts"
Cohesion: 0.10
Nodes (34): db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, fakeAppWebhooks(), fakePayPal(), FakePayPalMode (+26 more)

### Community 165 - "src/intake.ts"
Cohesion: 0.27
Nodes (9): CATEGORY_IDS, IntakeKind, IntakeRefusal, keyRow, makeIntakeKey(), newAddressCode(), newKeySchema, newSecret() (+1 more)

### Community 166 - "web-pages.test.ts"
Cohesion: 0.12
Nodes (9): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], app, root, webSource (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 171 - "instruction-lines.test.ts"
Cohesion: 0.38
Nodes (7): findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction(), PATTERNS, linesOf(), withoutInvisible()

### Community 172 - "deliveries.test.ts"
Cohesion: 0.28
Nodes (8): ArtifactKind, at(), db, delivered(), png, store, types(), withFiles()

### Community 173 - "eval-runner.ts"
Cohesion: 0.36
Nodes (6): draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf()

### Community 174 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

## Knowledge Gaps
- **22 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1419 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `questions.ts`, `buildApp`, `Secret`, `readLedger`, `runner.test.ts`, `PayPalRestClient`, `api.ts`, `action-routes.test.ts`, `acceptance-routes.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `ref_zod`, `ai/src/index.ts`, `email/src/index.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `qa/src/index.ts`, `draft-changes.ts`, `mcp.ts`, `council/src/index.ts`, `notices.ts`, `scope-draft/src/testing.ts`, `action-routes.ts`, `seller-connections.ts`, `sellers/disputes.test.ts`, `packet-service.ts`, `web-pages.test.ts`, `injection-runner.ts`, `paypal/src/index.ts`, `log-labels.test.ts`, `change-orders.test.ts`, `config.ts`, `createTestDeal`, `DraftReview.tsx`, `record.ts`, `db/src/testing.ts`, `delivery-routes.ts`, `deliveries.test.ts`, `disputes/test-support.ts`, `Secret`, `DeliveriesPanel.tsx`, `qa/src/index.ts`, `src/summary.test.ts`, `timeline/src/index.ts`, `scope-draft/src/index.ts`, `completeness.ts`, `auth/sign-in.ts`, `words/src/index.ts`, `DisputeActions.tsx`, `validate.ts`, `dispute-sync.ts`, `postgres.test.ts`, `chat-routes.ts`, `artifacts.test.ts`, `paypal/src/index.ts`, `scope-draft/src/council-task.ts`, `testSpec`, `db/src/migrate.ts`, `sessions.ts`, `council-record.ts`, `resend-inbound.ts`, `claim-job.ts`, `instruction-lines.test.ts`, `sandbox-clients.ts`, `render.ts`, `confirmation.ts`, `DealPage.tsx`, `App.tsx`, `check-words.ts`, `sandbox-check.ts`, `devDependencies`, `delivery-check.test.ts`, `package.json`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dispute-actions.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `timeline/src/index.ts`, `README.md`, `ai/src/index.ts`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Should `buildApp` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `ai/src/index.ts` to `Secret`, `readLedger`, `runner.test.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `question-routes.ts`, `paypal/src/disputes.ts`, `qa/src/index.ts`, `council/src/index.ts`, `Database`, `notices.ts`, `react`, `draft`, `seller-connections.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `instruction-lines.test.ts`, `Secret`, `Built (sub-phases 2b to 6h-1)`, `DisputeActions.tsx`, `file-routes.ts`, `claim-job.ts`, `sandbox-check.ts`, `change-order-routes.ts`, `Decisions`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.06841046277665996 - nodes in this community are weakly interconnected._