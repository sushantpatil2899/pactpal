# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 607 files · ~408,886 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 4863 nodes · 15675 edges · 165 communities (150 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 489 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee6e5cc5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- .query
- buildApp
- Secret
- readLedger
- PayPalRestClient
- .query
- api.ts
- testId
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- DealPage.tsx
- question-routes.ts
- ai/src/index.ts
- routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- dependencies
- sellers/disputes.test.ts
- delivery-routes.ts
- qa/src/index.ts
- receipt.ts
- QuestionsPanel.tsx
- intake-routes.ts
- council/src/index.ts
- Database
- db/src/index.ts
- draft-changes.ts
- claim-analyses.ts
- when
- scope-draft/src/testing.ts
- scope-drafts.ts
- action-routes.ts
- appendLedgerEvent
- timeline-progress.ts
- packet-service.ts
- words/src/index.ts
- db/src/testing.ts
- eval-report.ts
- paypal/src/index.ts
- scope-draft/src/index.ts
- paypal-webhook.ts
- config.ts
- testId
- DraftReview.tsx
- record.ts
- utcDateTime
- qa/src/index.ts
- file-routes.ts
- disputes/test-support.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- AccessTokenProvider
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- auth/sign-in.ts
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-draft/src/council-task.ts
- validate.ts
- notices.ts
- postgres.test.ts
- live-hub.ts
- claims/package.json
- readLedger
- log-labels.ts
- pdf/package.json
- dispute-sync.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- appeal-items.ts
- Secret
- scope-draft/package.json
- paypal/package.json
- build.js
- app-link-routes.ts
- server/package.json
- sandbox-partner-report.ts
- ai/package.json
- parseJsonReply
- eval-judge.ts
- scripts
- sandbox-webhook-report.ts
- @pactpal/live@workspace:*
- server/package.json
- Layout
- email/package.json
- compilerOptions
- confirmation.ts
- DealPage.tsx
- App.tsx
- database.ts
- council/package.json
- render.ts
- postgres-listen.test.ts
- pdf/src/index.ts
- @pactpal/watcher@workspace:*
- change-order-routes.ts
- src/reminders.ts
- score/package.json
- PactPal product spec
- devDependencies
- ai-check-report.ts
- web-pages.test.ts
- Engineering standards
- package.json
- Decisions
- @fastify/websocket
- @pactpal/delivery-check@workspace:*
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- log-labels.test.ts
- @pactpal/paypal@workspace:*
- pg@^8.23.1
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
- progress.ts
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
- @pactpal/net@workspace:*
- @pactpal/qa@workspace:*
- @pactpal/score@workspace:*
- @pactpal/words@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 185 edges
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

## Communities (165 total, 15 thin omitted)

### Community 0 - ".query"
Cohesion: 0.05
Nodes (73): forward(), namedQuestion(), settle(), originOf(), ChatNotAllowedError, insertMessage(), markRead(), nextSeq() (+65 more)

### Community 1 - "buildApp"
Cohesion: 0.10
Nodes (17): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+9 more)

### Community 2 - "Secret"
Cohesion: 0.06
Nodes (52): ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork() (+44 more)

### Community 3 - "readLedger"
Cohesion: 0.05
Nodes (87): SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened (+79 more)

### Community 4 - "PayPalRestClient"
Cohesion: 0.06
Nodes (35): PayPalBuyerTestActions, dollar, setup(), PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest (+27 more)

### Community 5 - ".query"
Cohesion: 0.05
Nodes (66): waitingChange(), `change_orders`: changes to a signed agreement, Acceptance, AcceptChange, acceptChangeSchema, addedCounts(), answer(), CHANGE_ORDER_STATUSES (+58 more)

### Community 6 - "api.ts"
Cohesion: 0.04
Nodes (107): addBuyer(), addPastedChat(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus (+99 more)

### Community 7 - "testId"
Cohesion: 0.07
Nodes (29): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+21 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (35): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+27 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (61): AMOUNT_OPTIONS, amountOption(), disputeIdOption, issuesText(), message(), readChecked(), readOptions(), describeRoute() (+53 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (63): AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages(), appealSource() (+55 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.07
Nodes (53): DISPUTE_EVENT_PREFIX, ARTIFACT_KINDS, ArtifactKind, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed() (+45 more)

### Community 12 - "DealPage.tsx"
Cohesion: 0.06
Nodes (64): StepView, chatUrl(), ChatView, getChat(), getPastedChats(), getTimeline(), isChat(), isMessage() (+56 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.05
Nodes (90): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, ChatRouteOptions, postBody, REFUSALS, liveQuery, LiveRouteOptions (+82 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.09
Nodes (34): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, providerCode(), reply, responseFormat() (+26 more)

### Community 15 - "routes.ts"
Cohesion: 0.07
Nodes (57): chatNames(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+49 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (42): send(), `buyer_questions`: questions about the agreement before signing, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails, DisputeList (+34 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (75): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+67 more)

### Community 18 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/static@^10.1.8, @pactpal/council@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:*, @pactpal/pdf@workspace:* (+11 more)

### Community 19 - "sellers/disputes.test.ts"
Cohesion: 0.13
Nodes (23): fakeWriter(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), box, db (+15 more)

### Community 20 - "delivery-routes.ts"
Cohesion: 0.10
Nodes (35): answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile (+27 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.10
Nodes (38): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+30 more)

### Community 22 - "receipt.ts"
Cohesion: 0.17
Nodes (14): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks() (+6 more)

### Community 23 - "QuestionsPanel.tsx"
Cohesion: 0.12
Nodes (30): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+22 more)

### Community 24 - "intake-routes.ts"
Cohesion: 0.10
Nodes (36): chatRoutes(), notificationRoutes(), dealAccess(), visibleDeal(), readBody(), requireViewer(), createIntakeDeal(), intakeFilename() (+28 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (46): JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "Database"
Cohesion: 0.06
Nodes (59): ReceiptMailDeps, AppOptions, SignInOptions, ChatBus, publishingBus(), HubOptions, listQuery, NotificationRouteOptions (+51 more)

### Community 27 - "db/src/index.ts"
Cohesion: 0.04
Nodes (79): PayPalWebhookOptions, body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), CHAT_CHANNEL (+71 more)

### Community 28 - "draft-changes.ts"
Cohesion: 0.15
Nodes (16): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+8 more)

### Community 29 - "claim-analyses.ts"
Cohesion: 0.08
Nodes (26): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+18 more)

### Community 30 - "when"
Cohesion: 0.06
Nodes (76): analysesUrl(), AppealCheckView, AppealView, checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+68 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (35): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind, EvalCase (+27 more)

### Community 32 - "scope-drafts.ts"
Cohesion: 0.10
Nodes (29): checkedDraft(), countRow, DraftIntegrityError, DraftNotAllowedError, DraftRecord, DraftRefusal, draftRow, DraftStateError (+21 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.07
Nodes (42): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+34 more)

### Community 34 - "appendLedgerEvent"
Cohesion: 0.07
Nodes (55): AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema, checkedAcceptance() (+47 more)

### Community 35 - "timeline-progress.ts"
Cohesion: 0.15
Nodes (14): dealIdRow, EVENT_FOR, fileRef, filesOf(), NewReminder, NewStepUpdate, recordStepUpdate(), reminderSchema (+6 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.07
Nodes (49): failedOutcome(), newestReady(), send(), appealGaps(), missingFromPacket(), docItemId(), aiBlocks(), dateTime() (+41 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.17
Nodes (18): AcceptanceDocument(), AcceptanceDocument, ScopeTerms, dateOf, ScopeDetails(), AgreementPage, ChangeFacts, changeLines() (+10 more)

### Community 38 - "db/src/testing.ts"
Cohesion: 0.09
Nodes (37): db, STEPS, StepView, TimelineView, db, db, refusal(), db (+29 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.13
Nodes (31): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+23 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (40): searchTime(), PayPalErrorDetail, CheckedEvidenceFile, EvidenceFile, Actor, createdInvoice, DraftInvoice, invoiceDetails (+32 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (42): councilRecordSchema, usage, categoryLabels, describeDraft(), DraftView, priceMinor(), allowedCategoryIds(), BLOCKED_CATEGORIES (+34 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.13
Nodes (15): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+7 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (25): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+17 more)

### Community 44 - "testId"
Cohesion: 0.06
Nodes (47): db, dealWithBuyer(), db, newDeal, sellerDeal(), setup(), signedIn(), checkDeps() (+39 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (37): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+29 more)

### Community 46 - "record.ts"
Cohesion: 0.09
Nodes (32): checkAnalysis(), ClaimAnalysis, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, linesOf(), AGREEMENT (+24 more)

### Community 47 - "utcDateTime"
Cohesion: 0.13
Nodes (28): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+20 more)

### Community 48 - "qa/src/index.ts"
Cohesion: 0.19
Nodes (16): attempt(), AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema, withoutLinePrefix() (+8 more)

### Community 49 - "file-routes.ts"
Cohesion: 0.18
Nodes (14): liveRoutes(), check(), originAllowed(), rawText(), addedByRole(), FILE_NAME_HEADER, fileNameFrom(), fileParams (+6 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.11
Nodes (31): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+23 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.07
Nodes (46): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+38 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.07
Nodes (33): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), Config, formatErrors() (+25 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (24): at(), source(), key(), seller(), `acceptances`: signed agreements, `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), `deal_messages`: the deal's chat (7b) (+16 more)

### Community 55 - "AccessTokenProvider"
Cohesion: 0.08
Nodes (27): checks, APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+19 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (54): DeliveryCheckView, factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile (+46 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.17
Nodes (20): addedSteps(), dueDate, MAX_TIMELINE_STEPS, moveStep(), ownerOf(), ref, resolveTimeline(), STEP_KIND_WORDS (+12 more)

### Community 59 - "mcp.ts"
Cohesion: 0.11
Nodes (25): APP_KEYS, checkAsSellerApp(), checkMcp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+17 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (24): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+16 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.16
Nodes (28): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+20 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.10
Nodes (55): appealApplies(), appealFacts(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS (+47 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.10
Nodes (25): dependencies, @pactpal/ledger@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13, @types/node@^22.10.2 (+17 more)

### Community 67 - "scope-draft/src/council-task.ts"
Cohesion: 0.12
Nodes (26): RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction() (+18 more)

### Community 68 - "validate.ts"
Cohesion: 0.16
Nodes (24): Citation, draftTimelineOf(), amountQuoted(), citationProblem(), collectCitations(), invalid(), listCitations(), Located (+16 more)

### Community 69 - "notices.ts"
Cohesion: 0.07
Nodes (51): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+43 more)

### Community 70 - "postgres.test.ts"
Cohesion: 0.08
Nodes (28): result, Row, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError (+20 more)

### Community 71 - "live-hub.ts"
Cohesion: 0.09
Nodes (18): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal() (+10 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "readLedger"
Cohesion: 0.08
Nodes (26): db, Answered, db, DeliveriesView, DeliveryView, entriesOf(), png(), db (+18 more)

### Community 74 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 75 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 76 - "dispute-sync.ts"
Cohesion: 0.07
Nodes (36): CHECK_INTERVAL_MS, disputeOf(), checkView(), disputeParams, disputeRoutes(), disputePageView(), disputeSummaryView(), openedAt() (+28 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (23): Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+15 more)

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
Cohesion: 0.06
Nodes (53): councilDeps(), councilRecordOf(), isRankingRequest(), model(), db, isRanking(), member(), ReviewView (+45 more)

### Community 82 - "appeal-items.ts"
Cohesion: 0.22
Nodes (10): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, ADDED_BY (+2 more)

### Community 83 - "Secret"
Cohesion: 0.05
Nodes (38): sellerKeyBox(), RFC-2606, Engineering, OpenAiCompatibleClient, bareAddress(), check, InboxNetworkError, ReadResult (+30 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @pactpal/ledger (+11 more)

### Community 86 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 87 - "app-link-routes.ts"
Cohesion: 0.11
Nodes (29): linkBody, paypalUnavailable(), SELLER_APP_PATH, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView, sellerAppView() (+21 more)

### Community 88 - "server/package.json"
Cohesion: 0.12
Nodes (16): @fastify/helmet@^13.2.0, @pactpal/ai@workspace:*, @pactpal/claims@workspace:*, @pactpal/ledger@workspace:*, ws@^8.22.2, zod@^4.6.7, @pactpal/ai, @pactpal/ledger (+8 more)

### Community 89 - "sandbox-partner-report.ts"
Cohesion: 0.13
Nodes (27): Checked, payPalIdOption(), rows(), actFor(), message(), parsed, partners, platform (+19 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "parseJsonReply"
Cohesion: 0.12
Nodes (21): Prepared, parseJsonReply(), checkSummary(), PacketSummary, packetSummarySchema, readSummary(), buildSummaryMessages(), ExhibitLine (+13 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.13
Nodes (24): draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf(), EVAL_CASES, buyerProvidesScore() (+16 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.11
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 96 - "server/package.json"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, @types/node, esbuild, tsx (+1 more)

### Community 97 - "Layout"
Cohesion: 0.30
Nodes (4): breakWord(), drawable(), drawBlock(), Layout

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "confirmation.ts"
Cohesion: 0.27
Nodes (10): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+2 more)

### Community 101 - "DealPage.tsx"
Cohesion: 0.09
Nodes (34): checkLedger(), checkMessage(), CompletenessItem, CompletenessView, getCompleteness(), getMe(), getMessages(), isCompleteness() (+26 more)

### Community 102 - "App.tsx"
Cohesion: 0.09
Nodes (27): getSellerApp(), LinkProblem, linkSellerApp(), Me, redeemLink(), SellerAppLink, SellerAppProblem, SellerAppState (+19 more)

### Community 103 - "database.ts"
Cohesion: 0.06
Nodes (53): contentRow, Queryable, lockedDeal, AddBuyer, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS (+45 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "render.ts"
Cohesion: 0.18
Nodes (12): CharacterSet, columnWidths(), Fonts, INK, MUTED, needsReplacing(), RenderedPdf, renderPdf() (+4 more)

### Community 106 - "postgres-listen.test.ts"
Cohesion: 0.20
Nodes (5): fakeClient(), Handler, setup(), listenPostgres(), PgListenClient

### Community 107 - "pdf/src/index.ts"
Cohesion: 0.29
Nodes (6): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, AT

### Community 109 - "change-order-routes.ts"
Cohesion: 0.07
Nodes (57): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, sendTimelineReminders() (+49 more)

### Community 110 - "src/reminders.ts"
Cohesion: 0.25
Nodes (8): StepProgress, addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now, ResolvedStep

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "ai-check-report.ts"
Cohesion: 0.40
Nodes (7): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec

### Community 115 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.50
Nodes (4): AI, Decisions, Partner tools, Product

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

### Community 128 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

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

### Community 150 - "progress.ts"
Cohesion: 0.11
Nodes (16): review(), `claim_analyses`: council comparisons of a dispute claim with the record, Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere, council() (+8 more)

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

## Knowledge Gaps
- **22 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1413 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `testSpec` to `log-labels.test.ts`, `buildApp`, `.query`, `readLedger`, `Secret`, `.query`, `api.ts`, `testId`, `PayPalRestClient`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `DealPage.tsx`, `ai/src/index.ts`, `routes.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `sellers/disputes.test.ts`, `delivery-routes.ts`, `qa/src/index.ts`, `receipt.ts`, `progress.ts`, `council/src/index.ts`, `db/src/index.ts`, `draft-changes.ts`, `when`, `scope-draft/src/testing.ts`, `scope-drafts.ts`, `action-routes.ts`, `appendLedgerEvent`, `packet-service.ts`, `words/src/index.ts`, `db/src/testing.ts`, `eval-report.ts`, `paypal/src/index.ts`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `testId`, `DraftReview.tsx`, `record.ts`, `utcDateTime`, `qa/src/index.ts`, `disputes/test-support.ts`, `DeliveriesPanel.tsx`, `AccessTokenProvider`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `auth/sign-in.ts`, `scope-draft/src/council-task.ts`, `validate.ts`, `notices.ts`, `postgres.test.ts`, `live-hub.ts`, `readLedger`, `dispute-sync.ts`, `appeal-items.ts`, `Secret`, `app-link-routes.ts`, `sandbox-partner-report.ts`, `parseJsonReply`, `sandbox-webhook-report.ts`, `confirmation.ts`, `DealPage.tsx`, `App.tsx`, `postgres-listen.test.ts`, `pdf/src/index.ts`, `src/reminders.ts`, `devDependencies`, `ai-check-report.ts`, `web-pages.test.ts`, `package.json`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `.query` be split into smaller, more focused modules?**
  _Cohesion score 0.0490743461651484 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `notices.ts`, `Secret`, `README.md`, `change-order-routes.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `buildApp` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Secret` to `log-labels.test.ts`, `Secret`, `readLedger`, `PayPalRestClient`, `ledger/src/index.ts`, `question-routes.ts`, `ai/src/index.ts`, `routes.ts`, `paypal/src/disputes.ts`, `progress.ts`, `council/src/index.ts`, `Database`, `draft-changes.ts`, `when`, `paypal/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `claim-job.ts`, `scope-draft/src/council-task.ts`, `appeal-items.ts`, `app-link-routes.ts`, `parseJsonReply`, `change-order-routes.ts`, `Decisions`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.06392405063291139 - nodes in this community are weakly interconnected._