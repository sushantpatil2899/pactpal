# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 653 files · ~439,450 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 5222 nodes · 16753 edges · 174 communities (152 shown, 22 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 523 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3bc207c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DealPage.tsx
- milestone-routes.ts
- sandbox-partner-report.ts
- change-orders.ts
- DeliveriesPanel.tsx
- appendLedgerEvent
- deals.ts
- PayPalRestClient
- words/src/index.ts
- email/src/index.ts
- claims/src/index.ts
- db/src/index.ts
- db/src/testing.ts
- api.ts
- acceptance.test.ts
- AccessTokenProvider
- PayPalResult
- ScopePanel.tsx
- ref_zod
- chat-state.ts
- change-order-routes.ts
- draft-job.ts
- paypal-webhook.ts
- when
- access.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- seller-app.ts
- ai/src/index.ts
- AppealPanel.tsx
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- deliveries.ts
- test-app.ts
- packet-service.ts
- receipt.ts
- rest.ts
- eval-report.ts
- mcp.ts
- SellerAppPanel.tsx
- build.js
- config.ts
- LiveHub
- acceptance-routes.ts
- products/src/index.ts
- claim-analyses.test.ts
- checker.ts
- ledger/src/index.ts
- TEST_NOW
- web/package.json
- draft-routes.ts
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- live/src/index.ts
- MessagesPanel.tsx
- services
- app-link-routes.test.ts
- scripts
- db/package.json
- postgresContentStore
- database.ts
- delivery-check-routes.ts
- postgres.ts
- DraftPanel.tsx
- claims/package.json
- sandbox-respond-report.ts
- Database
- claim-routes.ts
- invoice-text.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- eval-runner.ts
- dispute-view.ts
- scope-draft/package.json
- paypal/package.json
- server/src/index.ts
- postStep
- products/package.json
- routes.ts
- ai/package.json
- live-routes.ts
- readLedger
- scripts
- sandbox-webhook-report.ts
- connectPostgres
- LiveChat
- render.ts
- email/package.json
- compilerOptions
- routes.ts
- .query
- pdf/package.json
- @fastify/websocket
- council/package.json
- isObject
- @pactpal/council@workspace:*
- @pactpal/db@workspace:*
- chat.ts
- @pactpal/ledger@workspace:*
- @pactpal/scope-draft@workspace:*
- score/package.json
- PactPal product spec
- devDependencies
- @pactpal/score@workspace:*
- server/package.json
- Engineering standards
- package.json
- Decisions
- dependencies
- @pactpal/timeline@workspace:*
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- RedisCommands
- @pactpal/watcher@workspace:*
- README.md
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
- claim-job.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- server/package.json
- docs/tsconfig.json
- eval-scope.ts
- appeal-items.ts
- deliveries.test.ts
- live-hub.ts
- @modelcontextprotocol/sdk@1.32.1
- @pactpal/ai@workspace:*
- @pactpal/delivery-check@workspace:*
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- pg@^8.23.1
- zod@^4.6.7

## God Nodes (most connected - your core abstractions)
1. `vitest` - 201 edges
2. `Database` - 124 edges
3. `testId()` - 116 edges
4. `readLedger()` - 90 edges
5. `sha256Hex()` - 86 edges
6. `useMigratedTestDatabase()` - 80 edges
7. `appendLedgerEvent()` - 75 edges
8. `isObject()` - 67 edges
9. `TEST_NOW` - 66 edges
10. `Secret` - 66 edges

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

## Communities (174 total, 22 thin omitted)

### Community 0 - "DealPage.tsx"
Cohesion: 0.08
Nodes (37): AgentRequestsPanel(), AgentRequestView, answerAgentRequest(), checkLedger(), getAgentRequests(), getDeal(), getMe(), isAgentRequest() (+29 more)

### Community 1 - "milestone-routes.ts"
Cohesion: 0.09
Nodes (42): milestoneRoutes(), answer(), sellerApp(), paypalProblem(), sendBody, SendOutcome, sendToPayPal(), stageParams (+34 more)

### Community 2 - "sandbox-partner-report.ts"
Cohesion: 0.08
Nodes (39): rows(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+31 more)

### Community 3 - "change-orders.ts"
Cohesion: 0.06
Nodes (51): AcceptChange, acceptChangeSchema, addedCounts(), answer(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+43 more)

### Community 4 - "DeliveriesPanel.tsx"
Cohesion: 0.07
Nodes (46): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+38 more)

### Community 5 - "appendLedgerEvent"
Cohesion: 0.06
Nodes (57): AcceptanceIntegrityError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema, checkedAcceptance(), declineReasonSchema (+49 more)

### Community 6 - "deals.ts"
Cohesion: 0.08
Nodes (37): AddBuyer, addBuyer(), addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CURRENCIES, DEAL_KINDS (+29 more)

### Community 7 - "PayPalRestClient"
Cohesion: 0.05
Nodes (42): PayPalBuyerTestActions, dollar, setup(), MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer (+34 more)

### Community 8 - "words/src/index.ts"
Cohesion: 0.06
Nodes (52): ChatLine, checkPayments(), Citation, DraftCandidate, DraftCategory, DraftMark, DraftView, getMilestones() (+44 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.06
Nodes (64): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+56 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.05
Nodes (89): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), appealMessages(), appealSource(), buildAppealMessages() (+81 more)

### Community 11 - "db/src/index.ts"
Cohesion: 0.04
Nodes (69): ConfigReport, DisputedPayments, matchDispute(), NoMatch, paymentKeys(), event, headers, rawBody (+61 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (45): db, dealWithBuyer(), maya, report, db, goodsDeal(), SCOPE, WEBP (+37 more)

### Community 13 - "api.ts"
Cohesion: 0.05
Nodes (77): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptChange() (+69 more)

### Community 14 - "acceptance.test.ts"
Cohesion: 0.09
Nodes (22): `acceptances`: signed agreements, AcceptanceNotAllowedError, at(), db, document(), refusal(), savedDeal(), work (+14 more)

### Community 15 - "AccessTokenProvider"
Cohesion: 0.15
Nodes (14): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), authAssertion() (+6 more)

### Community 16 - "PayPalResult"
Cohesion: 0.07
Nodes (33): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails (+25 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (71): getScope(), hasScope(), InvalidFieldsError, ListingPreview, ListingView, saveListingPhotos(), saveScope(), AddedStep (+63 more)

### Community 18 - "ref_zod"
Cohesion: 0.05
Nodes (55): RFC-2606, ClientOptions, EmailFailure, emailMessageSchema, bareAddress(), check, InboxNetworkError, receivedAnswer (+47 more)

### Community 19 - "chat-state.ts"
Cohesion: 0.18
Nodes (21): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+13 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (45): sendTimelineReminders(), acceptBody, view(), waitingChange(), changeParams, changeView(), declineBody, proposeBody (+37 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.06
Nodes (63): JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), MessageReviewView, checkAnalysis(), ClaimContext, invalid() (+55 more)

### Community 22 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (19): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+11 more)

### Community 23 - "when"
Cohesion: 0.10
Nodes (42): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), disputesUrl(), DisputesView (+34 more)

### Community 24 - "access.ts"
Cohesion: 0.08
Nodes (33): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), LinkOptions, REDEEM_PATH (+25 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.07
Nodes (63): ClaimJobDeps, draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf(), chatCaseRuns() (+55 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.10
Nodes (33): publishingBus(), CronStart, runCronJob(), CLAIM_TASK_NAME, RESPONSE_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, ClientsFor (+25 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.17
Nodes (15): closeOnSignals(), report, setup(), assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration (+7 more)

### Community 28 - "seller-app.ts"
Cohesion: 0.14
Nodes (20): APP_KEYS, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+12 more)

### Community 29 - "ai/src/index.ts"
Cohesion: 0.05
Nodes (53): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, isUnranked() (+45 more)

### Community 30 - "AppealPanel.tsx"
Cohesion: 0.08
Nodes (46): AppealCheckView, AppealView, buildPacket(), CouncilView, draftSummary(), getAppeal(), getPacketView(), getResponses() (+38 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.06
Nodes (50): councilDeps(), councilRecordOf(), isRankingRequest(), CouncilRecord, two, down, invented, wrongCategory (+42 more)

### Community 32 - "validate.ts"
Cohesion: 0.15
Nodes (26): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+18 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (79): readBodySchema, screenshotRoutes(), councilRecordSchema, usage, DraftJob, categoryLabels, describeDraft(), DraftView (+71 more)

### Community 34 - "deliveries.ts"
Cohesion: 0.12
Nodes (19): versionsOf(), answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile, DeliveryRefusal (+11 more)

### Community 35 - "test-app.ts"
Cohesion: 0.04
Nodes (87): db, SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+79 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (52): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+44 more)

### Community 37 - "receipt.ts"
Cohesion: 0.16
Nodes (16): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks() (+8 more)

### Community 38 - "rest.ts"
Cohesion: 0.08
Nodes (32): Call, item, json(), Reply, setup(), tokenReply(), PayPalAppCredentials, SANDBOX_API_BASE_URL (+24 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.12
Nodes (34): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+26 more)

### Community 40 - "mcp.ts"
Cohesion: 0.17
Nodes (15): checkMcp(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL, sseTransport() (+7 more)

### Community 41 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 42 - "build.js"
Cohesion: 0.12
Nodes (9): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+1 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (27): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, FEATURES (+19 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.09
Nodes (28): ACCEPTANCE_NOTICE_VERSION, MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role, ROLES, Card (+20 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.13
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, ProductLookup, fakeChannel3(), NOW (+12 more)

### Community 47 - "claim-analyses.test.ts"
Cohesion: 0.15
Nodes (12): db, disputedDeal(), FILES, GOOD, SummariesView, AnalysisNotAllowedError, finishClaimAnalysis(), MAX_ANALYSES_PER_DISPUTE (+4 more)

### Community 48 - "checker.ts"
Cohesion: 0.11
Nodes (17): BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), renderDraftStarter(), renderWorkflowChecker(), RunnerBusyError, sameWorkflowTask() (+9 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (61): isPicture(), lookUp(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), DISPUTE_EVENT_PREFIX, agentBodySha256() (+53 more)

### Community 50 - "TEST_NOW"
Cohesion: 0.05
Nodes (84): db, mcpClient(), ToolResult, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal() (+76 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "draft-routes.ts"
Cohesion: 0.08
Nodes (47): ACCEPTANCE_DOCUMENT_FORMAT, AcceptanceDocument, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money, sendRefusal() (+39 more)

### Community 53 - "tools.ts"
Cohesion: 0.06
Nodes (50): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+42 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.05
Nodes (50): review(), paid(), key(), seller(), LedgerEntryView, draft(), unchanged(), deliveryLabel() (+42 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (39): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+31 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (56): looks(), factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile (+48 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (46): ChangeProposal, DraftContent, ScopeInput, dated(), DraftedItem, DraftedStep, planFromDraft(), same() (+38 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.11
Nodes (24): CheckedEvidenceFile, EvidenceFile, Actor, createdInvoice, DraftInvoice, InvoiceDetails, invoiceDetails, InvoiceSendError (+16 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "live/src/index.ts"
Cohesion: 0.23
Nodes (14): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+6 more)

### Community 62 - "MessagesPanel.tsx"
Cohesion: 0.28
Nodes (10): checkMessage(), getMessages(), isMessages(), messagesUrl(), MessagesView, LABEL_WORDS, revisionNote(), ALERT (+2 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "app-link-routes.test.ts"
Cohesion: 0.07
Nodes (45): agentDeal(), db, db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, fakeAppWebhooks() (+37 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "postgresContentStore"
Cohesion: 0.08
Nodes (34): createIntakeDeal(), db, withReadyDraft(), waitingDraft(), addArtifact(), postgresContentStore(), createDeal(), Call (+26 more)

### Community 68 - "database.ts"
Cohesion: 0.05
Nodes (44): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+36 more)

### Community 69 - "delivery-check-routes.ts"
Cohesion: 0.08
Nodes (39): DealLookup, featureAnswers(), ChangeOrderRouteOptions, checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), LookResult (+31 more)

### Community 70 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 71 - "DraftPanel.tsx"
Cohesion: 0.10
Nodes (30): addBuyer(), addPastedChat(), DealFile, draftsUrl(), errorMessage(), getDraftById(), listDrafts(), listFiles() (+22 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (77): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+69 more)

### Community 74 - "Database"
Cohesion: 0.05
Nodes (69): ReceiptMailDeps, McpRouteOptions, AppOptions, buildApp(), requestLog(), socketOrigin(), linkRoutes(), setup() (+61 more)

### Community 75 - "claim-routes.ts"
Cohesion: 0.17
Nodes (25): appealApplies(), appealFacts(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+17 more)

### Community 76 - "invoice-text.ts"
Cohesion: 0.27
Nodes (8): day(), invoiceFor(), StageInvoice, acceptance, deal, scope, Acceptance, invoiceNote()

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

### Community 81 - "ai/src/index.ts"
Cohesion: 0.08
Nodes (38): CheckView, db, FAILED, model(), shown, store, db, isRanking() (+30 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.12
Nodes (29): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+21 more)

### Community 83 - "dispute-view.ts"
Cohesion: 0.18
Nodes (16): CHECK_INTERVAL_MS, checkView(), disputeParams, disputeRoutes(), disputeFieldsOf(), DisputeMessageView, disputePageView(), disputeSummaryView() (+8 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "server/src/index.ts"
Cohesion: 0.12
Nodes (12): APPEAL_TASK_NAME, STATEMENT_TASK_NAME, app, disputeLog, members, result, webDir, connectOwnApp() (+4 more)

### Community 87 - "postStep"
Cohesion: 0.14
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+23 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.10
Nodes (42): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+34 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "live-routes.ts"
Cohesion: 0.33
Nodes (7): liveQuery, LiveRouteOptions, liveRoutes(), check(), originAllowed(), rawText(), rateLimiter()

### Community 92 - "readLedger"
Cohesion: 0.04
Nodes (62): db, disputeTypes(), capturingEmail(), db, payments(), sentStage(), at(), db (+54 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.12
Nodes (20): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+12 more)

### Community 95 - "connectPostgres"
Cohesion: 0.50
Nodes (3): connect(), connectPostgres(), withRealDatabase()

### Community 97 - "render.ts"
Cohesion: 0.10
Nodes (23): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, breakWord(), CharacterSet, columnWidths() (+15 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "routes.ts"
Cohesion: 0.08
Nodes (58): emailReceipt(), emailReceiptQuietly(), afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatNames, ChatRouteOptions, chatRoutes() (+50 more)

### Community 101 - ".query"
Cohesion: 0.06
Nodes (65): `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest() (+57 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.13
Nodes (16): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+8 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "isObject"
Cohesion: 0.06
Nodes (66): createDeal(), DealOptions, draftFrom(), getDealOptions(), getIntakeKey(), getLedger(), IntakeKeyView, IntakeKind (+58 more)

### Community 108 - "chat.ts"
Cohesion: 0.08
Nodes (28): addCard(), body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage() (+20 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

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
Cohesion: 0.29
Nodes (7): Agents (Phase 8), AI, Decisions, Demo (9b), Partner tools, Product, Render (9R)

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @pactpal/email@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:*, @pactpal/words@workspace:* (+10 more)

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
Cohesion: 0.11
Nodes (23): dependencies, marked@18.1.1, devDependencies, tsx@^4.19.2, @types/node@^22.10.2, tsx, @types/node, name (+15 more)

### Community 132 - "README.md"
Cohesion: 0.19
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Demo plan"
Cohesion: 0.12
Nodes (16): Buyers (each: a sandbox **Personal** account with the same email, to pay invoices), Cast, Chats, Demo plan, Maya's book of deals (written work only), Rules, Sellers (each: a sandbox **Business** account plus a REST app linked in PactPal), Story 1: Maya and Chris, a clean deal (nothing goes wrong) (+8 more)

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

### Community 150 - "claim-job.ts"
Cohesion: 0.21
Nodes (24): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+16 more)

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

### Community 165 - "server/package.json"
Cohesion: 0.13
Nodes (14): @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/live@workspace:*, @pactpal/qa@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/qa, name (+6 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 168 - "eval-scope.ts"
Cohesion: 0.24
Nodes (13): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), createDraftingRuntime(), cryptoCouncilDeps() (+5 more)

### Community 170 - "appeal-items.ts"
Cohesion: 0.13
Nodes (16): appealGaps(), missingFromPacket(), AlreadySent, appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId(), HeldDocument (+8 more)

### Community 171 - "deliveries.test.ts"
Cohesion: 0.18
Nodes (12): ArtifactKind, AnswerInput, DeliveryNotAllowedError, at(), db, delivered(), png, refusal() (+4 more)

### Community 172 - "live-hub.ts"
Cohesion: 0.12
Nodes (17): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), LivePage (+9 more)

## Knowledge Gaps
- **24 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1537 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ai/src/index.ts` to `docs/package.json`, `DealPage.tsx`, `sandbox-partner-report.ts`, `milestone-routes.ts`, `DeliveriesPanel.tsx`, `PayPalRestClient`, `words/src/index.ts`, `email/src/index.ts`, `claims/src/index.ts`, `db/src/index.ts`, `db/src/testing.ts`, `acceptance.test.ts`, `AccessTokenProvider`, `ScopePanel.tsx`, `ref_zod`, `chat-state.ts`, `draft-job.ts`, `paypal-webhook.ts`, `when`, `council/src/index.ts`, `db/src/migrate.ts`, `seller-app.ts`, `ai/src/index.ts`, `AppealPanel.tsx`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `test-app.ts`, `packet-service.ts`, `receipt.ts`, `rest.ts`, `eval-report.ts`, `mcp.ts`, `SellerAppPanel.tsx`, `appeal-items.ts`, `config.ts`, `live-hub.ts`, `build.js`, `deliveries.test.ts`, `claim-analyses.test.ts`, `checker.ts`, `ledger/src/index.ts`, `TEST_NOW`, `products/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `live/src/index.ts`, `MessagesPanel.tsx`, `app-link-routes.test.ts`, `postgresContentStore`, `postgres.ts`, `DraftPanel.tsx`, `sandbox-respond-report.ts`, `invoice-text.ts`, `eval-runner.ts`, `readLedger`, `sandbox-webhook-report.ts`, `render.ts`, `.query`, `isObject`, `devDependencies`, `package.json`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DealPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07955596669750231 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `.query`, `PayPalResult`, `timeline/src/index.ts`, `ai/src/index.ts`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `milestone-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0851063829787234 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `ai/src/index.ts` to `claims/src/index.ts`, `PayPalResult`, `ref_zod`, `when`, `council/src/index.ts`, `AppealPanel.tsx`, `scope-draft/src/index.ts`, `test-app.ts`, `rest.ts`, `appeal-items.ts`, `ledger/src/index.ts`, `TEST_NOW`, `draft-routes.ts`, `Built (sub-phases 2b to 6h-1)`, `paypal/src/index.ts`, `app-link-routes.test.ts`, `Database`, `invoice-text.ts`, `Decisions`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `sandbox-partner-report.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0782312925170068 - nodes in this community are weakly interconnected._