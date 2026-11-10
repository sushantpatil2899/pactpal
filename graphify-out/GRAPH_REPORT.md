# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 636 files · ~427,076 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 5073 nodes · 16341 edges · 179 communities (154 shown, 25 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 508 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `736f1ab9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- file-routes.ts
- Database
- Secret
- receipt.ts
- McpFallback
- appendLedgerEvent
- api.ts
- testId
- DraftReview.tsx
- PayPalRestClient
- claims/src/index.ts
- ledger/src/index.ts
- routes.ts
- question-routes.ts
- ai/src/index.ts
- utcDateTime
- paypal/src/disputes.ts
- ScopePanel.tsx
- PayPalRestClient
- chat-api.ts
- change-order-routes.ts
- qa/src/index.ts
- mcp.ts
- seed-sandbox.ts
- dependencies
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- notices.ts
- message-reviews.test.ts
- when
- scope-draft/src/testing.ts
- .query
- resend.ts
- .transaction
- sellers/disputes.test.ts
- packet-service.ts
- words/src/index.ts
- products/src/index.ts
- eval-report.ts
- paypal/src/index.ts
- validate.ts
- milestones.ts
- config.ts
- FilesPanel.tsx
- acceptance-routes.ts
- dispute-actions.ts
- pdf/package.json
- dispute-sync.ts
- packet-routes.ts
- checker.ts
- web/package.json
- DeliveriesPanel.tsx
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- scope-draft/src/index.ts
- completeness.ts
- postgres-listen.test.ts
- DisputeActions.tsx
- services
- claim-routes.ts
- scripts
- db/package.json
- scope-drafts.ts
- injection-report.ts
- QuestionsPanel.tsx
- postgres.ts
- image.ts
- claims/package.json
- sandbox-respond-report.ts
- delivery-check.test.ts
- claim-job.ts
- DisputePage.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- eval-report.test.ts
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- render-blueprint.test.ts
- client.ts
- products/package.json
- Layout
- ai/package.json
- dealRoutes
- build.js
- scripts
- sandbox-webhook-report.ts
- check-words.ts
- email/src/index.ts
- render.ts
- email/package.json
- compilerOptions
- chat-routes.ts
- DealPage.tsx
- SellerAppPanel.tsx
- resend-inbound.ts
- council/package.json
- dispute-view.ts
- eval-scope.ts
- draft-changes.ts
- appeal-items.ts
- sendTimelineReminders
- vitest
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- server/package.json
- Engineering standards
- package.json
- Decisions
- @fastify/helmet
- @modelcontextprotocol/sdk@1.32.1
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- @pactpal/email@workspace:*
- @pactpal/score@workspace:*
- progress.ts
- @pactpal/timeline@workspace:*
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
- TimelineStep
- Scope
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- app-link-routes.ts
- log-labels.test.ts
- @fastify/cookie
- @fastify/static
- @pactpal/claims@workspace:*
- @pactpal/council@workspace:*
- @pactpal/delivery-check@workspace:*
- @pactpal/ledger@workspace:*
- @pactpal/live@workspace:*
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- @pactpal/products@workspace:*
- @pactpal/scope-draft@workspace:*
- @pactpal/words@workspace:*
- pg@^8.23.1
- zod@^4.6.7

## God Nodes (most connected - your core abstractions)
1. `vitest` - 195 edges
2. `Database` - 122 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `sha256Hex()` - 81 edges
6. `useMigratedTestDatabase()` - 78 edges
7. `appendLedgerEvent()` - 75 edges
8. `isObject()` - 67 edges
9. `TEST_NOW` - 65 edges
10. `Secret` - 65 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
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

## Communities (179 total, 25 thin omitted)

### Community 0 - "file-routes.ts"
Cohesion: 0.13
Nodes (23): attachmentHeader(), sendCheckedFile(), sendDownload(), addedByRole(), FILE_NAME_HEADER, fileNameFrom(), fileParams, fileRoutes() (+15 more)

### Community 1 - "Database"
Cohesion: 0.07
Nodes (48): ReceiptMailDeps, AppOptions, SignInOptions, ChatBus, HubOptions, listQuery, NotificationRouteOptions, readRequest (+40 more)

### Community 2 - "Secret"
Cohesion: 0.06
Nodes (55): ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+47 more)

### Community 3 - "receipt.ts"
Cohesion: 0.16
Nodes (13): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, buildReceipt(), REACHED, RECEIPT_FORMAT, ReceiptIntegrityError, document (+5 more)

### Community 4 - "McpFallback"
Cohesion: 0.09
Nodes (25): dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest (+17 more)

### Community 5 - "appendLedgerEvent"
Cohesion: 0.04
Nodes (65): waitingChange(), `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder (+57 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (98): AgentRequestsPanel(), addBuyer(), AgentRequestView, analysesUrl(), answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket (+90 more)

### Community 7 - "testId"
Cohesion: 0.06
Nodes (54): db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, addCard(), db (+46 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.10
Nodes (31): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, DraftView, ChatLines(), ChatPane() (+23 more)

### Community 9 - "PayPalRestClient"
Cohesion: 0.08
Nodes (25): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+17 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (78): parseJsonReply(), ChatOutcome, AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem (+70 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (78): pictureType(), agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+70 more)

### Community 12 - "routes.ts"
Cohesion: 0.07
Nodes (63): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+55 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.06
Nodes (65): CHAT_TRANSCRIPT_PREFIX, DealLookup, featureAnswers(), readBody(), sendRefusal(), checkBody, checkView(), DeliveryCheckRouteOptions (+57 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.11
Nodes (27): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, candidates() (+19 more)

### Community 15 - "utcDateTime"
Cohesion: 0.17
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+15 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (40): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, disputeDetails, DisputeList (+32 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (69): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+61 more)

### Community 18 - "PayPalRestClient"
Cohesion: 0.11
Nodes (23): APP_KEYS, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+15 more)

### Community 19 - "chat-api.ts"
Cohesion: 0.07
Nodes (58): chatUrl(), ChatView, getChat(), getPastedChats(), getTimeline(), isChat(), isMessage(), isPasted() (+50 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (46): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody (+38 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.05
Nodes (70): attempt(), runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob (+62 more)

### Community 22 - "mcp.ts"
Cohesion: 0.14
Nodes (16): checkMcp(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL, sseTransport() (+8 more)

### Community 23 - "seed-sandbox.ts"
Cohesion: 0.09
Nodes (30): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+22 more)

### Community 24 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fastify@^5.12.7, @fastify/websocket@^11.3.7, @pactpal/ai@workspace:*, @pactpal/db@workspace:*, @pactpal/paypal@workspace:*, @pactpal/qa@workspace:*, @pactpal/watcher@workspace:* (+9 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.07
Nodes (67): ClaimJobDeps, draftCategories, PROMPT_VERSIONS, runDraftJob(), MAX_CONCURRENT_COUNCILS, EvalOptions, EvalRecord, runCase() (+59 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.12
Nodes (28): publishingBus(), formatErrors(), log, renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME (+20 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.23
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 28 - "notices.ts"
Cohesion: 0.28
Nodes (14): DueNotice, emailFor(), EVENT_KINDS, NOTICE_WINDOW_MS, REMINDER_MARKS, withoutRepeats(), actionLines(), disputeChangedEmail() (+6 more)

### Community 29 - "message-reviews.test.ts"
Cohesion: 0.08
Nodes (28): MAX_MESSAGES_PER_DEAL, MESSAGE_PAGE_SIZE, db, refusal(), sellerStageStep, checkedFileSchema, checkRow, DeliveryCheck (+20 more)

### Community 30 - "when"
Cohesion: 0.07
Nodes (50): AppealCheckView, AppealView, ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, draftResponse(), draftSummary() (+42 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.05
Nodes (66): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+58 more)

### Community 32 - ".query"
Cohesion: 0.03
Nodes (149): forward(), settle(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms() (+141 more)

### Community 33 - "resend.ts"
Cohesion: 0.11
Nodes (18): RFC-2606, RESEND_RECEIVED_URL, inbox(), EMAIL_RETRY_POLICY, EmailNetworkError, errorAnswer, errorName(), isReservedTestAddress() (+10 more)

### Community 34 - ".transaction"
Cohesion: 0.09
Nodes (36): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+28 more)

### Community 35 - "sellers/disputes.test.ts"
Cohesion: 0.07
Nodes (50): signedPayPal(), fakeWriter(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), box (+42 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.11
Nodes (37): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+29 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.13
Nodes (28): dateTime(), receiptBlocks(), isListingPreview(), ListingPreview, ListingView, lookUpListing(), saveListingPhotos(), ScopeTerms (+20 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.12
Nodes (21): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, ProductLookup, fakeChannel3(), NOW (+13 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.35
Nodes (16): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+8 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (36): EvidenceFileError, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf, Actor (+28 more)

### Community 41 - "validate.ts"
Cohesion: 0.12
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+23 more)

### Community 42 - "milestones.ts"
Cohesion: 0.11
Nodes (27): db, payments(), sentStage(), dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent (+19 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (25): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+17 more)

### Community 44 - "FilesPanel.tsx"
Cohesion: 0.10
Nodes (25): addFile(), addPastedChat(), DealFile, fileUrl(), isReading(), MAX_FILE_BYTES, readScreenshots(), ScreenshotReading (+17 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (47): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+39 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.13
Nodes (22): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+14 more)

### Community 47 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.19
Nodes (17): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+9 more)

### Community 49 - "packet-routes.ts"
Cohesion: 0.17
Nodes (14): disputeOf(), disputeParams, sellersDispute(), packetFilename(), buildBody, exhibitParams, packetParams, PacketRouteOptions (+6 more)

### Community 50 - "checker.ts"
Cohesion: 0.14
Nodes (10): BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS, TaskStarter (+2 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.12
Nodes (34): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+26 more)

### Community 53 - "tools.ts"
Cohesion: 0.09
Nodes (30): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+22 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.07
Nodes (37): review(), at(), source(), key(), seller(), draft(), unchanged(), `acceptances`: signed agreements (+29 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.11
Nodes (33): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+25 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (22): CheckedFile, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, ImageFacts (+14 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.12
Nodes (28): allowedUpdates(), StepProgress, addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now (+20 more)

### Community 59 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (68): councilRecordSchema, isUnranked(), usage, categoryLabels, describeDraft(), draftView(), DraftView, priceMinor() (+60 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "postgres-listen.test.ts"
Cohesion: 0.20
Nodes (5): fakeClient(), Handler, setup(), listenPostgres(), PgListenClient

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+23 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-routes.ts"
Cohesion: 0.17
Nodes (25): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+17 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.09
Nodes (33): withReadyDraft(), checkedDraft(), countRow, DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow, DraftStateError (+25 more)

### Community 68 - "injection-report.ts"
Cohesion: 0.23
Nodes (10): DroppedDraft, droppedSection(), ruleOf(), councilFailures(), counts(), formatInjectionReport(), InjectionRun, models() (+2 more)

### Community 69 - "QuestionsPanel.tsx"
Cohesion: 0.11
Nodes (33): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+25 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): connect(), Row, connectPostgres(), databaseFromPool(), ListenOptions, PgClient, PgConnection, PgPool (+4 more)

### Community 71 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (66): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+58 more)

### Community 74 - "delivery-check.test.ts"
Cohesion: 0.22
Nodes (10): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+2 more)

### Community 75 - "claim-job.ts"
Cohesion: 0.26
Nodes (20): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+12 more)

### Community 76 - "DisputePage.tsx"
Cohesion: 0.12
Nodes (31): checkDisputes(), disputesUrl(), DisputesView, getDisputePage(), getDisputes(), isDisputePage(), isDisputes(), CheckNow() (+23 more)

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
Cohesion: 0.05
Nodes (55): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+47 more)

### Community 82 - "eval-report.test.ts"
Cohesion: 0.39
Nodes (8): alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalRun, DraftScore

### Community 83 - "db/src/index.ts"
Cohesion: 0.03
Nodes (143): failureCode(), syncDisputes(), sendDisputeNotices(), CHAT_CHANNEL, chatEventSchema, parseChatEvent(), party, publishChatEvent() (+135 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "render-blueprint.test.ts"
Cohesion: 0.12
Nodes (9): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], app, root, webSource (+1 more)

### Community 87 - "client.ts"
Cohesion: 0.08
Nodes (18): AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, providerCode(), reply, responseFormat() (+10 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "dealRoutes"
Cohesion: 0.08
Nodes (40): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), LinkOptions, linkRoutes() (+32 more)

### Community 92 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

### Community 96 - "email/src/index.ts"
Cohesion: 0.12
Nodes (17): ENTITIES, entity(), htmlToText(), emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress() (+9 more)

### Community 97 - "render.ts"
Cohesion: 0.12
Nodes (20): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, breakWord(), CharacterSet, columnWidths() (+12 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "chat-routes.ts"
Cohesion: 0.07
Nodes (30): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), afterQuery (+22 more)

### Community 101 - "DealPage.tsx"
Cohesion: 0.06
Nodes (51): checkLedger(), checkMessage(), CompletenessItem, CompletenessView, getCompleteness(), getLedger(), getMe(), getMessages() (+43 more)

### Community 102 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 103 - "resend-inbound.ts"
Cohesion: 0.15
Nodes (20): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+12 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "dispute-view.ts"
Cohesion: 0.29
Nodes (7): disputeFieldsOf(), DisputeMessageView, keptFields, openedAt(), requestedEvidenceOf(), SELLER_ANSWERS, storedMessages

### Community 106 - "eval-scope.ts"
Cohesion: 0.23
Nodes (12): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), Config, councilClients() (+4 more)

### Community 107 - "draft-changes.ts"
Cohesion: 0.19
Nodes (13): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+5 more)

### Community 108 - "appeal-items.ts"
Cohesion: 0.13
Nodes (17): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+9 more)

### Community 109 - "sendTimelineReminders"
Cohesion: 0.27
Nodes (8): McpRouteOptions, Notifier, sendTimelineReminders(), timelineRoutes(), view(), notificationEmail(), asStepUpdates(), listStepUpdates()

### Community 110 - "vitest"
Cohesion: 0.03
Nodes (184): db, agentDeal(), db, mcpClient(), ToolResult, chatDeal(), db, MessageBody (+176 more)

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
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 115 - "server/package.json"
Cohesion: 0.19
Nodes (13): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, @types/node, name, private (+5 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.33
Nodes (6): Agents (Phase 8), AI, Deal space (Phase 7), Decisions, Partner tools, Product

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

### Community 130 - "progress.ts"
Cohesion: 0.24
Nodes (9): `agent_requests`: what an agent asks the seller to let it do (8c), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate, steps (+1 more)

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

### Community 157 - "TimelineStep"
Cohesion: 0.19
Nodes (12): ChangeProposal, ScopeInput, StepView, RunningStepView, dated(), DraftedItem, DraftedStep, planFromDraft() (+4 more)

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "app-link-routes.ts"
Cohesion: 0.06
Nodes (41): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+33 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

## Knowledge Gaps
- **23 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1473 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Secret`, `receipt.ts`, `McpFallback`, `appendLedgerEvent`, `api.ts`, `testId`, `DraftReview.tsx`, `PayPalRestClient`, `claims/src/index.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `utcDateTime`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `PayPalRestClient`, `chat-api.ts`, `change-order-routes.ts`, `qa/src/index.ts`, `mcp.ts`, `seed-sandbox.ts`, `progress.ts`, `council/src/index.ts`, `db/src/migrate.ts`, `TimelineStep`, `message-reviews.test.ts`, `scope-draft/src/testing.ts`, `.query`, `resend.ts`, `.transaction`, `sellers/disputes.test.ts`, `app-link-routes.ts`, `packet-service.ts`, `products/src/index.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `validate.ts`, `milestones.ts`, `config.ts`, `FilesPanel.tsx`, `words/src/index.ts`, `dispute-sync.ts`, `checker.ts`, `timeline/src/index.ts`, `scope-draft/src/index.ts`, `completeness.ts`, `postgres-listen.test.ts`, `DisputeActions.tsx`, `scope-drafts.ts`, `injection-report.ts`, `sandbox-respond-report.ts`, `delivery-check.test.ts`, `DisputePage.tsx`, `testSpec`, `eval-report.test.ts`, `db/src/index.ts`, `render-blueprint.test.ts`, `client.ts`, `sandbox-webhook-report.ts`, `check-words.ts`, `email/src/index.ts`, `render.ts`, `chat-routes.ts`, `DealPage.tsx`, `SellerAppPanel.tsx`, `draft-changes.ts`, `appeal-items.ts`, `devDependencies`, `package.json`?**
  _High betweenness centrality (0.207) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `file-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.06768388106416276 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `file-routes.ts`, `Database`, `PayPalRestClient`, `claims/src/index.ts`, `ledger/src/index.ts`, `ai/src/index.ts`, `paypal/src/disputes.ts`, `when`, `resend.ts`, `sellers/disputes.test.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `scope-draft/src/index.ts`, `DisputePage.tsx`, `testSpec`, `client.ts`, `appeal-items.ts`, `vitest`, `Decisions`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.05994710549515134 - nodes in this community are weakly interconnected._