# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 653 files · ~439,441 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 5222 nodes · 16753 edges · 172 communities (163 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 523 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f86ecda6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- app.ts
- paypal/src/index.ts
- change-orders.ts
- DeliveriesPanel.tsx
- appendLedgerEvent
- deals.ts
- PayPalRestClient
- DraftReview.tsx
- email/src/index.ts
- claims/src/index.ts
- db/src/index.ts
- db/src/testing.ts
- QuestionsPanel.tsx
- acceptance.test.ts
- AccessTokenProvider
- PayPalResult
- ScopePanel.tsx
- ref_zod
- chat-state.ts
- change-order-routes.ts
- draft-job.ts
- draft-job.ts
- when
- access.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- dayWords
- ai/src/index.ts
- AppealPanel.tsx
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- deliveries.ts
- test-app.ts
- packet-service.ts
- receipt.ts
- eval-runner.ts
- eval-report.ts
- mcp.ts
- council-record.ts
- build.js
- config.ts
- LiveHub
- Database
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
- seed-sandbox.ts
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
- scope-draft/src/council-task.ts
- claims/package.json
- sandbox-respond-report.ts
- app-link-routes.ts
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
- appeal.test.ts
- api.ts
- products/package.json
- routes.ts
- ai/package.json
- live-routes.ts
- readLedger
- scripts
- sandbox-webhook-report.ts
- IntakePanel.tsx
- LiveChat
- render.ts
- email/package.json
- compilerOptions
- routes.ts
- .query
- pdf/package.json
- log-labels.ts
- council/package.json
- isObject
- Demo plan
- injection-report.ts
- chat.ts
- progress.ts
- log-labels.test.ts
- score/package.json
- PactPal product spec
- devDependencies
- confirmation.ts
- server/package.json
- Engineering standards
- package.json
- Decisions
- server/package.json
- build.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- RedisCommands
- instruction-lines.ts
- record.ts
- runner.test.ts
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
- web-pages.test.ts
- TimelineEditor.tsx
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- Privacy
- Scope
- docs/tsconfig.json
- eval-scope.ts
- appeal-items.ts
- deliveries.test.ts
- live-hub.ts
- @pactpal/pdf@workspace:*

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
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts
- ``agent_requests`: what an agent asks the seller to let it do (8c)` --references--> `done()`  [INFERRED]
  docs/data-model.md → packages/timeline/src/progress.ts

## Import Cycles
- None detected.

## Communities (172 total, 9 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.09
Nodes (27): getSellerApp(), LinkProblem, linkSellerApp(), Me, redeemLink(), SellerAppLink, SellerAppProblem, SellerAppState (+19 more)

### Community 1 - "app.ts"
Cohesion: 0.05
Nodes (66): buildApp(), requestLog(), socketOrigin(), setup(), setup(), missingRuntimeSettings(), MilestoneRouteOptions, paypalProblem() (+58 more)

### Community 2 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (37): EvidenceFileError, PayPalApiError, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf (+29 more)

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
Cohesion: 0.06
Nodes (41): PayPalBuyerTestActions, dollar, setup(), MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer (+33 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.05
Nodes (67): addPastedChat(), ChangeProposal, ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent (+59 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.06
Nodes (64): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+56 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (61): AppealCheck, AppealContext, checkAppeal(), readAppeal(), appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask() (+53 more)

### Community 11 - "db/src/index.ts"
Cohesion: 0.04
Nodes (69): ConfigReport, DisputedPayments, matchDispute(), NoMatch, paymentKeys(), event, headers, rawBody (+61 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (45): db, dealWithBuyer(), maya, report, db, goodsDeal(), SCOPE, WEBP (+37 more)

### Community 13 - "QuestionsPanel.tsx"
Cohesion: 0.13
Nodes (29): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+21 more)

### Community 14 - "acceptance.test.ts"
Cohesion: 0.09
Nodes (22): `acceptances`: signed agreements, AcceptanceNotAllowedError, at(), db, document(), refusal(), savedDeal(), work (+14 more)

### Community 15 - "AccessTokenProvider"
Cohesion: 0.16
Nodes (9): checks, authAssertion(), base64Url(), PayPalAppCredentials, clientsOver(), ownAppClients(), PlatformSellerClients, setup() (+1 more)

### Community 16 - "PayPalResult"
Cohesion: 0.07
Nodes (35): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, 1. Architecture and structure, AcceptClaimInput, answered(), collect(), DisputeAnswer (+27 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (70): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+62 more)

### Community 18 - "ref_zod"
Cohesion: 0.04
Nodes (83): RFC-2606, ClientOptions, EmailFailure, emailMessageSchema, bareAddress(), check, InboxNetworkError, receivedAnswer (+75 more)

### Community 19 - "chat-state.ts"
Cohesion: 0.18
Nodes (21): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+13 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.07
Nodes (52): ACCEPTANCE_DOCUMENT_FORMAT, AcceptanceDocument, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money, sendTimelineReminders() (+44 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.09
Nodes (40): checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+32 more)

### Community 22 - "draft-job.ts"
Cohesion: 0.12
Nodes (28): draftCategories, DraftJob, JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), MessageReviewView, SourceLine (+20 more)

### Community 23 - "when"
Cohesion: 0.08
Nodes (56): analysesUrl(), checkDisputes(), compareClaim(), disputesUrl(), DisputesView, getClaimAnalyses(), getDisputeActions(), getDisputePage() (+48 more)

### Community 24 - "access.ts"
Cohesion: 0.08
Nodes (33): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), LinkOptions, linkRoutes() (+25 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (55): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), Engineering, schemaEnforced() (+47 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.08
Nodes (41): publishingBus(), CronStart, runCronJob(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+33 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.12
Nodes (19): closeOnSignals(), report, setup(), result, connect(), assertUnchanged(), assertWellFormed(), checksumOf() (+11 more)

### Community 28 - "dayWords"
Cohesion: 0.12
Nodes (25): AcceptanceDocument(), AcceptanceDocument, checkPayments(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, sendInvoice() (+17 more)

### Community 29 - "ai/src/index.ts"
Cohesion: 0.06
Nodes (50): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, looks() (+42 more)

### Community 30 - "AppealPanel.tsx"
Cohesion: 0.10
Nodes (35): AppealCheckView, AppealView, CouncilView, getAppeal(), getResponses(), getStatements(), PacketChoice, PacketSummariesView (+27 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (35): build(), input, numbered, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines() (+27 more)

### Community 32 - "validate.ts"
Cohesion: 0.11
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, DraftStep (+23 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.09
Nodes (33): readBodySchema, screenshotRoutes(), ArtifactNotFoundError, DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS (+25 more)

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

### Community 38 - "eval-runner.ts"
Cohesion: 0.12
Nodes (22): councilDeps(), isRankingRequest(), alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord (+14 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.35
Nodes (16): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+8 more)

### Community 40 - "mcp.ts"
Cohesion: 0.10
Nodes (28): APP_KEYS, PayPalApp, checkAsSellerApp(), checkMcp(), message(), result, APP_LABELS, appSection() (+20 more)

### Community 41 - "council-record.ts"
Cohesion: 0.13
Nodes (19): councilRecordOf(), CouncilRecord, councilRecordSchema, isUnranked(), two, usage, categoryLabels, describeDraft() (+11 more)

### Community 42 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 43 - "config.ts"
Cohesion: 0.07
Nodes (34): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, FEATURES, formatReport() (+26 more)

### Community 45 - "Database"
Cohesion: 0.05
Nodes (58): ACCEPTANCE_NOTICE_VERSION, MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role, ROLES (+50 more)

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
Nodes (45): featureAnswers(), sendRefusal(), attachmentHeader(), sendCheckedFile(), sendDownload(), draftParams, DraftRouteOptions, draftRoutes() (+37 more)

### Community 53 - "tools.ts"
Cohesion: 0.06
Nodes (51): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+43 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (26): key(), seller(), draft(), unchanged(), `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record (+18 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (39): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+31 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (53): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile, CheckLine (+45 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.13
Nodes (21): StepProgress, addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now, dueDate (+13 more)

### Community 59 - "seed-sandbox.ts"
Cohesion: 0.07
Nodes (39): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+31 more)

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
Cohesion: 0.07
Nodes (35): DealLookup, checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+27 more)

### Community 70 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 71 - "scope-draft/src/council-task.ts"
Cohesion: 0.16
Nodes (17): RANK_CRITERIA, ScopeDraftTask, buildScopeDraftMessages(), listOf(), renderChat(), SCOPE_DRAFT_PROMPT_VERSION, ScopeDraftPrompt, ScopeDraftPromptInput (+9 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (80): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+72 more)

### Community 74 - "app-link-routes.ts"
Cohesion: 0.23
Nodes (14): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+6 more)

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
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 83 - "dispute-view.ts"
Cohesion: 0.18
Nodes (16): CHECK_INTERVAL_MS, checkView(), disputeParams, disputeRoutes(), disputeFieldsOf(), DisputeMessageView, disputePageView(), disputeSummaryView() (+8 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "appeal.test.ts"
Cohesion: 0.11
Nodes (16): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+8 more)

### Community 87 - "api.ts"
Cohesion: 0.05
Nodes (84): AgentRequestsPanel(), acceptDisputeClaim(), AgentRequestView, answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict (+76 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.09
Nodes (48): emailReceipt(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, DeliveryRouteOptions, deliveryRoutes() (+40 more)

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
Cohesion: 0.06
Nodes (33): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+25 more)

### Community 95 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

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
Cohesion: 0.10
Nodes (51): emailReceiptQuietly(), afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatNames, ChatRouteOptions, chatRoutes(), messageView() (+43 more)

### Community 101 - ".query"
Cohesion: 0.06
Nodes (65): `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest() (+57 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.13
Nodes (16): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+8 more)

### Community 103 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "isObject"
Cohesion: 0.06
Nodes (64): addBuyer(), checkLedger(), CompletenessItem, CompletenessView, createDeal(), errorMessage(), getCompleteness(), getDeal() (+56 more)

### Community 106 - "Demo plan"
Cohesion: 0.12
Nodes (16): Buyers (each: a sandbox **Personal** account with the same email, to pay invoices), Cast, Chats, Demo plan, Maya's book of deals (written work only), Rules, Sellers (each: a sandbox **Business** account plus a REST app linked in PactPal), Story 1: Maya and Chris, a clean deal (nothing goes wrong) (+8 more)

### Community 107 - "injection-report.ts"
Cohesion: 0.23
Nodes (10): DroppedDraft, droppedSection(), ruleOf(), councilFailures(), counts(), formatInjectionReport(), InjectionRun, models() (+2 more)

### Community 108 - "chat.ts"
Cohesion: 0.08
Nodes (28): addCard(), body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage() (+20 more)

### Community 109 - "progress.ts"
Cohesion: 0.22
Nodes (12): Deal space (Phase 7), allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate (+4 more)

### Community 110 - "log-labels.test.ts"
Cohesion: 0.16
Nodes (13): review(), paid(), changes(), entry(), sent(), Data model, `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute (+5 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 115 - "server/package.json"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.29
Nodes (7): Agents (Phase 8), AI, Decisions, Demo (9b), Partner tools, Product, Render (9R)

### Community 119 - "server/package.json"
Cohesion: 0.05
Nodes (60): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @fastify/static@^10.1.8, @fastify/websocket@^11.3.7, @modelcontextprotocol/sdk@1.32.1, @pactpal/ai@workspace:* (+52 more)

### Community 120 - "build.ts"
Cohesion: 0.35
Nodes (8): dist, root, escapeHtml(), pageHtml(), PAGES, REPOSITORY, resolve(), rewriteLinks()

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

### Community 130 - "instruction-lines.ts"
Cohesion: 0.31
Nodes (9): claimLines(), ClaimText, linesOf(), findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction(), PATTERNS (+1 more)

### Community 131 - "record.ts"
Cohesion: 0.29
Nodes (10): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, MAX_RECORD_LINES, text() (+2 more)

### Community 133 - "runner.test.ts"
Cohesion: 0.24
Nodes (8): council(), deps(), DRAFTS, isRankingCall(), ranking(), rankingRequests(), shown(), task

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

### Community 157 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 158 - "TimelineEditor.tsx"
Cohesion: 0.36
Nodes (7): LABEL, OwnFields(), pointedWords(), StepTargets, TimelineEditor(), MAX_TIMELINE_STEPS, moveStep()

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Privacy"
Cohesion: 0.50
Nodes (4): How long, Privacy, What PactPal keeps, Who else sees it

### Community 165 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 168 - "eval-scope.ts"
Cohesion: 0.20
Nodes (15): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), formatErrors(), councilClients() (+7 more)

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
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `ai/src/index.ts` to `App.tsx`, `app.ts`, `paypal/src/index.ts`, `DeliveriesPanel.tsx`, `runner.test.ts`, `PayPalRestClient`, `DraftReview.tsx`, `email/src/index.ts`, `claims/src/index.ts`, `db/src/index.ts`, `db/src/testing.ts`, `acceptance.test.ts`, `AccessTokenProvider`, `ScopePanel.tsx`, `ref_zod`, `chat-state.ts`, `draft-job.ts`, `draft-job.ts`, `when`, `council/src/index.ts`, `db/src/migrate.ts`, `dayWords`, `ai/src/index.ts`, `web-pages.test.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `test-app.ts`, `packet-service.ts`, `receipt.ts`, `eval-runner.ts`, `mcp.ts`, `council-record.ts`, `appeal-items.ts`, `config.ts`, `live-hub.ts`, `deliveries.test.ts`, `products/src/index.ts`, `claim-analyses.test.ts`, `checker.ts`, `ledger/src/index.ts`, `TEST_NOW`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `seed-sandbox.ts`, `completeness.ts`, `live/src/index.ts`, `MessagesPanel.tsx`, `app-link-routes.test.ts`, `postgresContentStore`, `postgres.ts`, `scope-draft/src/council-task.ts`, `sandbox-respond-report.ts`, `invoice-text.ts`, `appeal.test.ts`, `readLedger`, `sandbox-webhook-report.ts`, `IntakePanel.tsx`, `render.ts`, `.query`, `isObject`, `injection-report.ts`, `progress.ts`, `log-labels.test.ts`, `devDependencies`, `confirmation.ts`, `package.json`, `build.ts`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0907563025210084 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `.query`, `progress.ts`, `PayPalResult`, `council/src/index.ts`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04589787722317843 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `instruction-lines.ts`, `runner.test.ts`, `PayPalRestClient`, `claims/src/index.ts`, `PayPalResult`, `ref_zod`, `when`, `ai/src/index.ts`, `AppealPanel.tsx`, `test-app.ts`, `council-record.ts`, `appeal-items.ts`, `Database`, `ledger/src/index.ts`, `TEST_NOW`, `draft-routes.ts`, `Built (sub-phases 2b to 6h-1)`, `seed-sandbox.ts`, `app-link-routes.test.ts`, `invoice-text.ts`, `log-labels.test.ts`, `Decisions`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06493506493506493 - nodes in this community are weakly interconnected._