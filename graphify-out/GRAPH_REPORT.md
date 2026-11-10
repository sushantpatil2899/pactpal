# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 647 files · ~432,396 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 5170 nodes · 16602 edges · 160 communities (153 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 512 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `622b99aa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DealPage.tsx
- Database
- app-link-routes.ts
- email/src/index.ts
- DraftPanel.tsx
- .query
- api.ts
- src/summary.test.ts
- DraftReview.tsx
- notices.ts
- claims/src/index.ts
- ledger/src/index.ts
- routes.ts
- delivery-check-routes.ts
- ai/src/index.ts
- utcDateTime
- paypal/src/disputes.ts
- ScopePanel.tsx
- message-reviews.ts
- chat-state.ts
- change-order-routes.ts
- draft-job.ts
- paypal-webhook.ts
- paypal/src/index.ts
- draft-job.ts
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- addArtifact
- products/src/index.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- timeline-routes.ts
- scope-draft/src/index.ts
- deliveries.ts
- vitest
- packet-service.ts
- receipt.ts
- Secret
- eval-report.ts
- PayPalRestClient
- validate.ts
- eval-judge.ts
- config.ts
- seller-connections.ts
- acceptance-routes.ts
- milestones.ts
- buildApp
- dispute-sync.ts
- paypal-webhook.test.ts
- disputes/test-support.ts
- web/package.json
- styles.ts
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- progress.ts
- completeness.ts
- seller-app.ts
- DisputeActions.tsx
- services
- src/reminders.ts
- scripts
- db/package.json
- scope.ts
- claim-job.ts
- postgresContentStore
- postgres.ts
- questionRoutes
- claims/package.json
- sandbox-respond-report.ts
- auth/sign-in.ts
- claims/src/check.ts
- routes.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- dispute-email.ts
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- checker.ts
- web-pages.test.ts
- products/package.json
- ref_zod
- ai/package.json
- request-routes.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- detectMediaType
- delivery-check-routes.test.ts
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- @pactpal/pdf@workspace:*
- council/package.json
- QuestionsPanel.tsx
- image.ts
- testId
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- server/package.json
- Engineering standards
- package.json
- Decisions
- server/package.json
- check-words.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- RedisCommands
- code-checks.ts
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
- build.ts
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- docs/tsconfig.json
- log-labels.test.ts
- Phase 7 (deal space)
- Scope

## God Nodes (most connected - your core abstractions)
1. `vitest` - 199 edges
2. `Database` - 123 edges
3. `testId()` - 112 edges
4. `readLedger()` - 90 edges
5. `sha256Hex()` - 84 edges
6. `useMigratedTestDatabase()` - 78 edges
7. `appendLedgerEvent()` - 75 edges
8. `isObject()` - 67 edges
9. `Secret` - 66 edges
10. `TEST_NOW` - 65 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (160 total, 7 thin omitted)

### Community 0 - "DealPage.tsx"
Cohesion: 0.06
Nodes (54): addBuyer(), checkLedger(), createDeal(), errorMessage(), getDeal(), getDealOptions(), getMe(), isDeal() (+46 more)

### Community 1 - "Database"
Cohesion: 0.10
Nodes (31): ReceiptMailDeps, McpRouteOptions, ChatBus, Card, NotificationRouteOptions, Notifier, NotifierOptions, PartyNotice (+23 more)

### Community 2 - "app-link-routes.ts"
Cohesion: 0.08
Nodes (33): Config, linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts() (+25 more)

### Community 3 - "email/src/index.ts"
Cohesion: 0.08
Nodes (29): RFC-2606, ENTITIES, entity(), htmlToText(), emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult (+21 more)

### Community 4 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (52): addFile(), addPastedChat(), DealFile, draftFrom(), draftsUrl(), fileUrl(), getDraftById(), getScope() (+44 more)

### Community 5 - ".query"
Cohesion: 0.03
Nodes (164): AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema, checkedAcceptance() (+156 more)

### Community 6 - "api.ts"
Cohesion: 0.04
Nodes (83): AgentRequestsPanel(), AgentRequestView, answerAgentRequest(), AnswerOptionView, BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus (+75 more)

### Community 7 - "src/summary.test.ts"
Cohesion: 0.09
Nodes (24): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+16 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (54): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+46 more)

### Community 9 - "notices.ts"
Cohesion: 0.13
Nodes (22): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+14 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (58): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+50 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (66): agentBodySha256(), ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError, AnalysisRefusal, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+58 more)

### Community 12 - "routes.ts"
Cohesion: 0.06
Nodes (67): ACCEPTANCE_DOCUMENT_FORMAT, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, accessSummary(), answerView() (+59 more)

### Community 13 - "delivery-check-routes.ts"
Cohesion: 0.13
Nodes (25): DealLookup, checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+17 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.17
Nodes (19): candidates(), JsonReply, tryParse(), DEFAULT_MODEL, median(), ModelRecord, rankModels(), RECENT_FAILURE_MS (+11 more)

### Community 15 - "utcDateTime"
Cohesion: 0.17
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+15 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (44): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails (+36 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (66): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), InvalidFieldsError, isChangeOrders(), proposeChange() (+58 more)

### Community 18 - "message-reviews.ts"
Cohesion: 0.06
Nodes (39): MAX_MESSAGES_PER_DEAL, MESSAGE_PAGE_SIZE, db, refusal(), analysisRow, councilJobColumns, councilJobFields(), sellerStageStep (+31 more)

### Community 19 - "chat-state.ts"
Cohesion: 0.10
Nodes (37): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+29 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.10
Nodes (30): featureAnswers(), acceptBody, ChangeOrderRouteOptions, changeOrderRoutes(), view(), waitingChange(), changeParams, changeView() (+22 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.09
Nodes (43): MESSAGE_PROMPT_VERSIONS, MessageJob, ClaimContext, AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine() (+35 more)

### Community 22 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (18): blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""], workflowSection (+10 more)

### Community 23 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (47): SeedArgs, Engineering, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem (+39 more)

### Community 24 - "draft-job.ts"
Cohesion: 0.29
Nodes (7): draftCategories, toCouncilRecord(), DraftJob, JobLog, runDraftJob(), runMessageJob(), DEAL_CATEGORIES

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): ChatFailureKind, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+39 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.11
Nodes (26): APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, DISPUTE_TASK_NAME, DRAFT_TASK_NAME (+18 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.26
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 28 - "addArtifact"
Cohesion: 0.09
Nodes (24): waitingDraft(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactKind, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+16 more)

### Community 29 - "products/src/index.ts"
Cohesion: 0.12
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.05
Nodes (82): analysesUrl(), AppealCheckView, AppealView, buildPacket(), checkAppeal(), checkDisputes(), compareClaim(), CouncilView (+74 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (43): councilRecordOf(), two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens() (+35 more)

### Community 32 - "timeline-routes.ts"
Cohesion: 0.25
Nodes (19): sendTimelineReminders(), money(), scopeTerms(), scopeView(), stepTerms(), REFUSALS, stageFacts(), stepParams (+11 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (67): CouncilRecord, councilRecordSchema, usage, categoryLabels, describeDraft(), DraftView, priceMinor(), JsonSchema (+59 more)

### Community 34 - "deliveries.ts"
Cohesion: 0.09
Nodes (32): answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile (+24 more)

### Community 35 - "vitest"
Cohesion: 0.03
Nodes (156): agentDeal(), db, db, SESSION_COOKIE, chatDeal(), db, MessageBody, db (+148 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "receipt.ts"
Cohesion: 0.07
Nodes (44): acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), ReceiptIntegrityError (+36 more)

### Community 38 - "Secret"
Cohesion: 0.04
Nodes (72): sellerKeyBox(), AI_RETRY_POLICY, ClientOptions, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient (+64 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.07
Nodes (52): logProgress(), modelNames(), pickModels(), selectedClientsOrExit(), DroppedDraft, droppedSection(), ruleOf(), aloneRow() (+44 more)

### Community 40 - "PayPalRestClient"
Cohesion: 0.05
Nodes (39): Receiver, PayPalBuyerTestActions, dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY (+31 more)

### Community 41 - "validate.ts"
Cohesion: 0.14
Nodes (27): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+19 more)

### Community 42 - "eval-judge.ts"
Cohesion: 0.12
Nodes (28): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+20 more)

### Community 43 - "config.ts"
Cohesion: 0.09
Nodes (29): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors() (+21 more)

### Community 44 - "seller-connections.ts"
Cohesion: 0.12
Nodes (24): linkApp(), paidFromOwnApp(), linkedSeller(), claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase (+16 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.09
Nodes (39): ACCEPTANCE_NOTICE_VERSION, currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent() (+31 more)

### Community 46 - "milestones.ts"
Cohesion: 0.08
Nodes (31): sentStage(), at(), db, ORDERING, proposed(), signature(), SIGNED, dropFailedInvoice() (+23 more)

### Community 47 - "buildApp"
Cohesion: 0.18
Nodes (10): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+2 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.18
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 49 - "paypal-webhook.test.ts"
Cohesion: 0.22
Nodes (9): PayPalWebhookOptions, event, headers, rawBody, report, setup(), NewWebhookEvent, newWebhookEventSchema (+1 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.05
Nodes (64): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+56 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "styles.ts"
Cohesion: 0.07
Nodes (50): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checkMessage(), checksUrl(), deliveriesUrl(), DeliveriesView (+42 more)

### Community 53 - "tools.ts"
Cohesion: 0.10
Nodes (28): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+20 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (28): key(), seller(), draft(), unchanged(), `acceptances`: signed agreements, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record (+20 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.06
Nodes (58): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+50 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.18
Nodes (15): looks(), CheckLine, LineCodeResult, Transparency, Mark, CheckedLook, checkLook(), Look (+7 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.17
Nodes (20): addedSteps(), dueDate, MAX_TIMELINE_STEPS, moveStep(), ownerOf(), ref, resolveTimeline(), STEP_KIND_WORDS (+12 more)

### Community 59 - "progress.ts"
Cohesion: 0.20
Nodes (8): `agent_requests`: what an agent asks the seller to let it do (8c), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate, steps

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "seller-app.ts"
Cohesion: 0.10
Nodes (25): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+17 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.16
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), escalateDispute(), getDisputeActions(), isActionAnswer() (+20 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (39): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+31 more)

### Community 64 - "src/reminders.ts"
Cohesion: 0.25
Nodes (8): StepProgress, addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now, ResolvedStep

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "scope.ts"
Cohesion: 0.04
Nodes (63): withReadyDraft(), BASE, LISTING, forwardInterruptedQuestions(), MAX_QUESTIONS_PER_DEAL, ANSWER, at(), awaiting() (+55 more)

### Community 68 - "claim-job.ts"
Cohesion: 0.13
Nodes (44): appealApplies(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt (+36 more)

### Community 69 - "postgresContentStore"
Cohesion: 0.08
Nodes (49): chatNames(), chatRoutes(), requireViewer(), sendRefusal(), draftParams, draftRoutes(), beginDraft(), sourceFile() (+41 more)

### Community 70 - "postgres.ts"
Cohesion: 0.10
Nodes (13): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient, PgConnection (+5 more)

### Community 71 - "questionRoutes"
Cohesion: 0.39
Nodes (8): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), listQuestions()

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (102): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+94 more)

### Community 74 - "auth/sign-in.ts"
Cohesion: 0.05
Nodes (69): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+61 more)

### Community 75 - "claims/src/check.ts"
Cohesion: 0.09
Nodes (32): checkAnalysis(), claimAnalysisSchema, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, linesOf(), AGREEMENT (+24 more)

### Community 76 - "routes.ts"
Cohesion: 0.06
Nodes (46): AppOptions, SignInOptions, publishingBus(), DraftRouteOptions, ListingRouteOptions, MilestoneRouteOptions, addBuyerBody, BUYER_REFUSALS (+38 more)

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
Nodes (45): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, councilDeps() (+37 more)

### Community 82 - "dispute-email.ts"
Cohesion: 0.47
Nodes (9): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), DisputeEmailFacts, disputeOpenedEmail(), disputeReminderEmail(), email() (+1 more)

### Community 83 - "db/src/index.ts"
Cohesion: 0.04
Nodes (86): result, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+78 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "checker.ts"
Cohesion: 0.12
Nodes (15): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), renderDraftStarter(), RunnerBusyError, sameWorkflowTask() (+7 more)

### Community 87 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "ref_zod"
Cohesion: 0.05
Nodes (63): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, ChatRouteOptions, postBody, REFUSALS, listQuery, notificationRoutes() (+55 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "request-routes.ts"
Cohesion: 0.32
Nodes (7): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser()

### Community 92 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.11
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 95 - "detectMediaType"
Cohesion: 0.17
Nodes (16): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), mediaTypeOf(), detectMediaType(), FileFingerprint (+8 more)

### Community 96 - "delivery-check-routes.test.ts"
Cohesion: 0.18
Nodes (12): CheckedFile, IMAGE, LINES, ImageFacts, BPP, chunk(), figure(), filterRows() (+4 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (46): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), Acceptance, dependencies, pdf-lib@1.17.1 (+38 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.07
Nodes (22): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), messageView() (+14 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "QuestionsPanel.tsx"
Cohesion: 0.12
Nodes (31): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+23 more)

### Community 109 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 110 - "testId"
Cohesion: 0.07
Nodes (45): mcpClient(), ToolResult, dealWithBuyer(), addCard(), db, goodsDeal(), SCOPE, WEBP (+37 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 115 - "server/package.json"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.33
Nodes (6): Agents (Phase 8), AI, Decisions, Partner tools, Product, Render (9R)

### Community 119 - "server/package.json"
Cohesion: 0.05
Nodes (60): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @fastify/static@^10.1.8, @fastify/websocket@^11.3.7, @modelcontextprotocol/sdk@1.32.1, @pactpal/ai@workspace:* (+52 more)

### Community 120 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

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

### Community 128 - "docs/package.json"
Cohesion: 0.15
Nodes (15): dependencies, marked@18.1.1, devDependencies, tsx@^4.19.2, @types/node@^22.10.2, tsx, @types/node, name (+7 more)

### Community 130 - "code-checks.ts"
Cohesion: 0.31
Nodes (9): codeChecks(), judge(), largest(), MEDIA_TYPES, CheckedFormat, FORMATS, lineRequirements(), number() (+1 more)

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

### Community 157 - "build.ts"
Cohesion: 0.35
Nodes (8): dist, root, escapeHtml(), pageHtml(), PAGES, REPOSITORY, resolve(), rewriteLinks()

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 168 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 169 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **24 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1515 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `DealPage.tsx`, `app-link-routes.ts`, `email/src/index.ts`, `DraftPanel.tsx`, `.query`, `api.ts`, `src/summary.test.ts`, `DraftReview.tsx`, `ledger/src/index.ts`, `routes.ts`, `ai/src/index.ts`, `utcDateTime`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `message-reviews.ts`, `chat-state.ts`, `draft-job.ts`, `paypal-webhook.ts`, `paypal/src/index.ts`, `council/src/index.ts`, `db/src/migrate.ts`, `addArtifact`, `build.ts`, `products/src/index.ts`, `scope-draft/src/testing.ts`, `web/src/format.ts`, `scope-draft/src/index.ts`, `deliveries.ts`, `packet-service.ts`, `receipt.ts`, `Secret`, `eval-report.ts`, `log-labels.test.ts`, `PayPalRestClient`, `eval-judge.ts`, `config.ts`, `seller-connections.ts`, `validate.ts`, `milestones.ts`, `buildApp`, `dispute-sync.ts`, `paypal-webhook.test.ts`, `disputes/test-support.ts`, `styles.ts`, `action-routes.ts`, `timeline/src/index.ts`, `progress.ts`, `completeness.ts`, `seller-app.ts`, `src/reminders.ts`, `scope.ts`, `postgresContentStore`, `postgres.ts`, `sandbox-respond-report.ts`, `auth/sign-in.ts`, `claims/src/check.ts`, `testSpec`, `db/src/index.ts`, `checker.ts`, `web-pages.test.ts`, `sandbox-webhook-report.ts`, `detectMediaType`, `delivery-check-routes.test.ts`, `render.ts`, `live-hub.ts`, `testId`, `devDependencies`, `package.json`, `check-words.ts`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DealPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06241519674355495 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `paypal/src/index.ts` to `Database`, `app-link-routes.ts`, `email/src/index.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `paypal/src/disputes.ts`, `change-order-routes.ts`, `council/src/index.ts`, `web/src/format.ts`, `scope-draft/src/index.ts`, `vitest`, `Secret`, `log-labels.test.ts`, `seller-connections.ts`, `disputes/test-support.ts`, `Built (sub-phases 2b to 6h-1)`, `action-routes.ts`, `seller-app.ts`, `testSpec`, `ref_zod`, `Decisions`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.1014799154334038 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `timeline-routes.ts`, `paypal/src/disputes.ts`, `README.md`, `paypal/src/index.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `app-link-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._