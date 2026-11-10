# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 704 files · ~457,588 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: .css 10, (none) 5, .example 1)

## Summary
- 5453 nodes · 17375 edges · 181 communities (175 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 512 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d96a99d7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- appeal-items.ts
- Database
- net/src/index.ts
- postgres.test.ts
- styles.ts
- .query
- change-orders.test.ts
- email/src/index.ts
- DraftReview.tsx
- sellers/disputes.test.ts
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- scope-draft/src/index.ts
- ai/src/index.ts
- utcDateTime
- sandbox-respond-report.ts
- ScopePanel.tsx
- App.tsx
- mcp.ts
- acceptance-routes.ts
- draft-job.ts
- PayPalRestClient
- DraftReview.tsx
- dependencies
- council/src/index.ts
- acceptance.ts
- validate.ts
- DealPage.tsx
- testId
- web/src/format.ts
- scope-draft/src/testing.ts
- injection-runner.ts
- delivery-routes.ts
- DealsTable.tsx
- disputes/test-support.ts
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- notices.ts
- draft-routes.ts
- sandbox-partner-report.ts
- server/src/index.ts
- seller-connections.ts
- change-order-routes.ts
- dispute-actions.ts
- app.ts
- paypal/src/disputes.ts
- database.ts
- vitest
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
- chain-scene.ts
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-routes.ts
- dispute-sync.ts
- resend-inbound.ts
- appendLedgerEvent
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
- chat.ts
- milestones.ts
- scope-draft/package.json
- paypal/package.json
- qa/src/index.ts
- Landing.tsx
- products/package.json
- auth/sign-in.ts
- ai/package.json
- db/src/index.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- testSpec
- react
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- IntakePanel.tsx
- db/src/testing.ts
- bus.ts
- council/package.json
- eval-judge.ts
- dispute-routes.ts
- when
- linked-apps.ts
- eval-runner.ts
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- pdf/package.json
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
- packet-routes.ts
- dependencies
- chat-state.ts
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
- Ledger.tsx
- useLiveChat.ts
- confirmation.ts
- draft-view.ts
- .prettierrc.json
- products/tsconfig.json
- Council.tsx
- live/src/index.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- live-routes.ts
- src/summary.test.ts
- record.ts
- request-routes.ts
- db/src/listing.test.ts
- resend.test.ts
- Scope
- vite-env.d.ts
- devDependencies
- src-app-tsx.md
- engines
- sign-in-words.ts
- deal-link-email.ts

## God Nodes (most connected - your core abstractions)
1. `vitest` - 209 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `isObject()` - 70 edges
8. `react` - 66 edges
9. `TEST_NOW` - 66 edges
10. `Secret` - 65 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts
- `Deal space (Phase 7)` --references--> `publishingBus()`  [INFERRED]
  docs/decisions.md → apps/server/src/chat/bus.ts
- `Engineering` --references--> `sendForAcceptance()`  [INFERRED]
  docs/decisions.md → apps/server/src/deals/test-app.ts

## Import Cycles
- None detected.

## Communities (181 total, 6 thin omitted)

### Community 0 - "appeal-items.ts"
Cohesion: 0.14
Nodes (17): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+9 more)

### Community 1 - "Database"
Cohesion: 0.10
Nodes (28): ReceiptMailDeps, McpRouteOptions, ChatBus, Card, DealCards, HubOptions, NotificationRouteOptions, Notifier (+20 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.05
Nodes (67): Phase 6 sub-phases, ClientOptions, ResendReceivedEmails, ResendEmailSender, ResendOptions, sender(), defaultHttpDeps, HttpDeps (+59 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.07
Nodes (30): result, Row, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus (+22 more)

### Community 4 - "styles.ts"
Cohesion: 0.11
Nodes (35): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+27 more)

### Community 5 - ".query"
Cohesion: 0.04
Nodes (74): AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError, ChangeOrderRefusal (+66 more)

### Community 6 - "change-orders.test.ts"
Cohesion: 0.11
Nodes (14): db, capturingEmail(), db, payments(), sentStage(), at(), db, ORDERING (+6 more)

### Community 7 - "email/src/index.ts"
Cohesion: 0.10
Nodes (25): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError (+17 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.09
Nodes (30): DealFile, draftsUrl(), DraftView, getDraftById(), isReading(), listDrafts(), readScreenshots(), ScreenshotReading (+22 more)

### Community 9 - "sellers/disputes.test.ts"
Cohesion: 0.06
Nodes (53): fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), linkBody, paypalUnavailable(), SELLER_APP_PATH (+45 more)

### Community 10 - "api.ts"
Cohesion: 0.04
Nodes (104): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView (+96 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (64): isPicture(), MAX_PHOTO_SIDE, toJpeg(), agentBodySha256(), ARTIFACT_KINDS, ArtifactKind, ArtifactRejectedError, ArtifactRejection (+56 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.08
Nodes (55): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, listQuery (+47 more)

### Community 13 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (40): RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage (+32 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (42): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+34 more)

### Community 15 - "utcDateTime"
Cohesion: 0.17
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 16 - "sandbox-respond-report.ts"
Cohesion: 0.07
Nodes (35): disputeIdOption, APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+27 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (67): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), InvalidFieldsError, isChangeOrders() (+59 more)

### Community 18 - "App.tsx"
Cohesion: 0.11
Nodes (48): createDeal(), getDealOptions(), redeemLink(), SIGN_IN_PATH, signOut(), App(), Dashboard(), DealList() (+40 more)

### Community 19 - "mcp.ts"
Cohesion: 0.09
Nodes (31): APP_KEYS, PayPalApp, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS (+23 more)

### Community 20 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (28): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+20 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.11
Nodes (31): runPrepared(), toCouncilRecord(), toJson(), usage, DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob() (+23 more)

### Community 22 - "PayPalRestClient"
Cohesion: 0.08
Nodes (27): PayPalBuyerTestActions, dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+19 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (41): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ScopeInput (+33 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (47): JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+39 more)

### Community 26 - "acceptance.ts"
Cohesion: 0.09
Nodes (36): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+28 more)

### Community 27 - "validate.ts"
Cohesion: 0.11
Nodes (32): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, DraftStep (+24 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.05
Nodes (69): checkLedger(), fileUrl(), getDeal(), getMe(), LedgerCheck, listDeals(), listFiles(), MAX_FILE_BYTES (+61 more)

### Community 29 - "testId"
Cohesion: 0.05
Nodes (73): mcpClient(), ToolResult, dealWithBuyer(), db, goodsDeal(), SCOPE, WEBP, db (+65 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.09
Nodes (41): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftResponse(), draftStatement(), getAppeal(), getResponses() (+33 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.07
Nodes (42): two, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, FieldVerdict, baseLines(), BLOCKED_OR_UNCLEAR (+34 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.14
Nodes (22): modelNames(), parsed, clients, parsed, councilFailures(), counts(), formatInjectionReport(), InjectionRun (+14 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.05
Nodes (69): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, acceptanceDocument, documentFor(), fingerprinted(), money, document, signed() (+61 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.08
Nodes (47): DealSummary, Me, Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable() (+39 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.10
Nodes (31): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+23 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.10
Nodes (39): buildReceipt(), ReceiptIntegrityError, aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut (+31 more)

### Community 37 - "receipt.ts"
Cohesion: 0.12
Nodes (28): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+20 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.15
Nodes (18): ListingRouteOptions, Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, ProductLookup, attributeName() (+10 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.25
Nodes (19): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+11 more)

### Community 40 - "notices.ts"
Cohesion: 0.12
Nodes (24): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+16 more)

### Community 41 - "draft-routes.ts"
Cohesion: 0.13
Nodes (26): attachmentHeader(), sendCheckedFile(), sendDownload(), decoder, draftParams, draftRoutes(), beginDraft(), sourceFile() (+18 more)

### Community 42 - "sandbox-partner-report.ts"
Cohesion: 0.07
Nodes (41): payPalIdOption(), rows(), actFor(), message(), parsed, partners, platform, argsSchema (+33 more)

### Community 43 - "server/src/index.ts"
Cohesion: 0.05
Nodes (59): result, loadConfigOrExit(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars() (+51 more)

### Community 44 - "seller-connections.ts"
Cohesion: 0.21
Nodes (12): claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow, endConnection(), first() (+4 more)

### Community 45 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (36): ACCEPTANCE_NOTICE_VERSION, featureAnswers(), step(), acceptBody, changeOrderRoutes(), waitingChange(), changeParams, declineBody (+28 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (23): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+15 more)

### Community 47 - "app.ts"
Cohesion: 0.08
Nodes (28): AppOptions, closeOnSignals(), socketOrigin(), report, setup(), SignInOptions, ConfigReport, ClaimRunner (+20 more)

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.09
Nodes (23): `buyer_questions`: questions about the agreement before signing, 1. Architecture and structure, answered(), collect(), DisputeAnswer, evidenceForm(), MAX_DISPUTE_PAGES, parseItems() (+15 more)

### Community 49 - "database.ts"
Cohesion: 0.04
Nodes (52): CHAT_CHANNEL, ChatEvent, chatEventSchema, party, ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal (+44 more)

### Community 50 - "vitest"
Cohesion: 0.07
Nodes (37): db, db, pdf, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal() (+29 more)

### Community 51 - "web/package.json"
Cohesion: 0.07
Nodes (29): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+21 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.10
Nodes (30): getDisputePage(), StageView, BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay() (+22 more)

### Community 53 - "tools.ts"
Cohesion: 0.09
Nodes (30): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+22 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.08
Nodes (32): at(), source(), key(), seller(), title(), draft(), unchanged(), `acceptances`: signed agreements (+24 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (36): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+28 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.08
Nodes (45): CheckedFile, CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, IMAGE (+37 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (71): sendTimelineReminders(), view(), changeView(), dealCompleteness(), judgedScope(), dealOverview, DealStage, disputeStep() (+63 more)

### Community 59 - "ref_zod"
Cohesion: 0.07
Nodes (49): DealLookup, dealParams, FoundDeal, Refusal, ChangeOrderRouteOptions, CompletenessRouteOptions, checkBody, checkView() (+41 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, ease(), EVENTS, faceTexture() (+5 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.14
Nodes (29): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+21 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.30
Nodes (19): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+11 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.11
Nodes (28): DealNotFoundError, checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow (+20 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.22
Nodes (22): sendRefusal(), appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+14 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.15
Nodes (20): DisputeReader, LinkedDisputeAccount, changedSince(), Counts, DisputeSyncDeps, readTooSoon(), readVersionOf(), sameSecond() (+12 more)

### Community 70 - "resend-inbound.ts"
Cohesion: 0.18
Nodes (15): createIntakeDeal(), intakeFilename(), intakeEmail(), app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH (+7 more)

### Community 71 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (76): declineTerms, originOf(), recordReceiptSent(), createAgentRequest(), finishAgentRequest(), answer(), declineChangeOrder(), withdrawChangeOrder() (+68 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (86): AMOUNT_OPTIONS, amountOption(), Checked, issuesText(), logProgress(), message(), readChecked(), readOptions() (+78 more)

### Community 74 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (75): AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+67 more)

### Community 76 - "scenes.tsx"
Cohesion: 0.18
Nodes (21): Status, StatusBadge(), STATUSES, AgreeScene(), at(), CaptureScene(), CHAT_LINES, Cite() (+13 more)

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
Cohesion: 0.13
Nodes (14): db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View, forwardInterruptedQuestions() (+6 more)

### Community 82 - "chat.ts"
Cohesion: 0.12
Nodes (19): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage(), lastSeq (+11 more)

### Community 83 - "milestones.ts"
Cohesion: 0.14
Nodes (17): InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid(), markInvoiceSent(), MILESTONE_STATUSES, MilestoneNotAllowedError (+9 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "qa/src/index.ts"
Cohesion: 0.07
Nodes (45): checkAnalysis(), claimAnalysisSchema, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+37 more)

### Community 87 - "Landing.tsx"
Cohesion: 0.11
Nodes (24): Logo(), LogoMark(), Council(), Hero(), Ticker(), useChainScene(), Landing(), NAV (+16 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "auth/sign-in.ts"
Cohesion: 0.07
Nodes (38): buildApp(), requestLog(), LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, db, setup() (+30 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "db/src/index.ts"
Cohesion: 0.04
Nodes (99): PayPalWebhookOptions, PayPal integration, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+91 more)

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
Cohesion: 0.07
Nodes (40): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+32 more)

### Community 96 - "react"
Cohesion: 0.09
Nodes (29): checkMessage(), CompletenessItem, CompletenessView, getCompleteness(), getMessages(), isMessages(), MessageReviewView, messagesUrl() (+21 more)

### Community 97 - "render.ts"
Cohesion: 0.09
Nodes (24): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, breakWord(), CharacterSet, columnWidths() (+16 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.16
Nodes (8): BusSignal, LiveHub, LivePage, Online, PageState, warn(), Party, ServerFrame

### Community 101 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

### Community 102 - "db/src/testing.ts"
Cohesion: 0.08
Nodes (33): disputedDeal(), AnalysisNotAllowedError, finishClaimAnalysis, startClaimAnalysis, db, disputed(), refusal(), ContentMismatchError (+25 more)

### Community 103 - "bus.ts"
Cohesion: 0.20
Nodes (10): Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), addCard(), db, hubOnTestDeal() (+2 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-judge.ts"
Cohesion: 0.23
Nodes (17): buyerProvidesScore(), categoryVerdict(), cites(), lineSet(), listScore(), marksScore(), normal(), priceVerdict() (+9 more)

### Community 106 - "dispute-routes.ts"
Cohesion: 0.29
Nodes (9): CHECK_INTERVAL_MS, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputePageView(), disputeSummaryView(), openedAt() (+1 more)

### Community 107 - "when"
Cohesion: 0.09
Nodes (45): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+37 more)

### Community 108 - "linked-apps.ts"
Cohesion: 0.15
Nodes (13): MilestoneRouteOptions, DealOptions, ActionRouteOptions, DisputeWriter, DisputeChecker, DISPUTE_EVENT_PREFIX, disputeNotifications(), InvoiceSender (+5 more)

### Community 109 - "eval-runner.ts"
Cohesion: 0.21
Nodes (14): draftCategories, alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions (+6 more)

### Community 110 - "test-app.ts"
Cohesion: 0.04
Nodes (102): agentDeal(), db, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+94 more)

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

### Community 115 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.33
Nodes (6): Agents (Phase 8), AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 119 - "server/package.json"
Cohesion: 0.07
Nodes (29): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+21 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.07
Nodes (41): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+33 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.18
Nodes (11): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 7 follow-ups, Phase 7 sub-phases (+3 more)

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

### Community 128 - "packet-routes.ts"
Cohesion: 0.18
Nodes (14): disputeOf(), disputeParams, sellersDispute(), packetFilename(), buildBody, exhibitParams, packetParams, PacketRouteOptions (+6 more)

### Community 129 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 130 - "chat-state.ts"
Cohesion: 0.23
Nodes (13): ChatView, ChatAction, chatReducer(), ChatState, Connection, initialChat, onFrame(), PendingMessage (+5 more)

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

### Community 157 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 158 - "useLiveChat.ts"
Cohesion: 0.27
Nodes (11): chatUrl(), getChat(), liveUrl(), postChat(), lastSeq(), reconnectDelay(), LiveChat, useLiveChat() (+3 more)

### Community 159 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 160 - "draft-view.ts"
Cohesion: 0.21
Nodes (11): councilRecordSchema, categoryLabels, describeDraft(), priceMinor(), DraftRecord, allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS (+3 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Council.tsx"
Cohesion: 0.21
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 165 - "live/src/index.ts"
Cohesion: 0.27
Nodes (10): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+2 more)

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.16
Nodes (13): review(), paid(), changes(), entry(), sent(), Data model, `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute (+5 more)

### Community 168 - "live-routes.ts"
Cohesion: 0.27
Nodes (9): liveQuery, LiveRouteOptions, liveRoutes(), check(), originAllowed(), rawText(), rateLimiter(), parseClientFrame() (+1 more)

### Community 169 - "src/summary.test.ts"
Cohesion: 0.22
Nodes (9): ClaimAnalysis, comparisonRows(), comparisonText(), ANALYSIS, context, EXHIBITS, GOOD, RECORD (+1 more)

### Community 170 - "record.ts"
Cohesion: 0.29
Nodes (10): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, MAX_RECORD_LINES, RecordEntry (+2 more)

### Community 171 - "request-routes.ts"
Cohesion: 0.27
Nodes (9): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser(), AgentRequest (+1 more)

### Community 172 - "db/src/listing.test.ts"
Cohesion: 0.24
Nodes (6): BASE, LISTING, fakeChannel3(), NOW, CHANNEL3_LOOKUP_ANSWER, TEST_LISTING

### Community 173 - "resend.test.ts"
Cohesion: 0.39
Nodes (4): inbox(), message, json(), network()

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 176 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 179 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 180 - "deal-link-email.ts"
Cohesion: 0.50
Nodes (3): dealLinkEmail(), DealLinkEmailInput, LINK_PAGE

## Knowledge Gaps
- **121 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1789 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `appeal-items.ts`, `chat-state.ts`, `useRoute.ts`, `styles.ts`, `postgres.test.ts`, `change-orders.test.ts`, `net/src/index.ts`, `DraftReview.tsx`, `sellers/disputes.test.ts`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `ai/src/index.ts`, `utcDateTime`, `sandbox-respond-report.ts`, `ScopePanel.tsx`, `mcp.ts`, `draft-job.ts`, `PayPalRestClient`, `DraftReview.tsx`, `council/src/index.ts`, `acceptance.ts`, `validate.ts`, `DealPage.tsx`, `testId`, `Ledger.tsx`, `confirmation.ts`, `scope-draft/src/testing.ts`, `delivery-routes.ts`, `injection-runner.ts`, `disputes/test-support.ts`, `packet-service.ts`, `DealsTable.tsx`, `live/src/index.ts`, `eval-report.ts`, `log-labels.test.ts`, `src/summary.test.ts`, `sandbox-partner-report.ts`, `server/src/index.ts`, `db/src/listing.test.ts`, `resend.test.ts`, `products/src/index.ts`, `app.ts`, `paypal/src/disputes.ts`, `sign-in-words.ts`, `Deadlines.tsx`, `action-routes.ts`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `receipt.ts`, `completeness.ts`, `DisputeActions.tsx`, `draft-view.ts`, `scope-drafts.ts`, `dispute-sync.ts`, `resend-inbound.ts`, `appendLedgerEvent`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `delivery-check-routes.test.ts`, `qa/src/index.ts`, `Landing.tsx`, `auth/sign-in.ts`, `build.js`, `sandbox-webhook-report.ts`, `testSpec`, `react`, `render.ts`, `IntakePanel.tsx`, `db/src/testing.ts`, `bus.ts`, `when`, `eval-runner.ts`, `test-app.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appeal-items.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `draft-routes.ts`, `timeline/src/index.ts`, `db/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.10220673635307782 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `draft-routes.ts` to `appeal-items.ts`, `Database`, `net/src/index.ts`, `sellers/disputes.test.ts`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `ai/src/index.ts`, `PayPalRestClient`, `council/src/index.ts`, `web/src/format.ts`, `delivery-routes.ts`, `log-labels.test.ts`, `change-order-routes.ts`, `resend.test.ts`, `paypal/src/disputes.ts`, `vitest`, `Built (sub-phases 2b to 6h-1)`, `sandbox-respond-report.ts`, `testSpec`, `when`, `test-app.ts`, `Decisions`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04557721139430285 - nodes in this community are weakly interconnected._