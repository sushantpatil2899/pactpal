# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 647 files · ~432,341 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 5172 nodes · 16605 edges · 180 communities (158 shown, 22 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 512 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc3e82e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DealPage.tsx
- vitest
- TEST_NOW
- change-orders.ts
- DeliverPanel.tsx
- appendLedgerEvent
- api.ts
- Engineering
- DraftReview.tsx
- dispute-sync.ts
- claims/src/index.ts
- ledger/src/index.ts
- milestone-routes.ts
- isObject
- scope-draft/src/council-task.ts
- utcDateTime
- PayPalResult
- ScopePanel.tsx
- email/src/index.ts
- chat-state.ts
- ref_zod
- draft-job.ts
- paypal-webhook.ts
- paypal/src/index.ts
- ref_zod
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- claims/src/check.ts
- Secret
- web/src/format.ts
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- deliveries.ts
- test-app.ts
- packet-service.ts
- receipt.ts
- net/src/index.ts
- eval-report.ts
- PayPalRestClient
- App.tsx
- confirmation.ts
- config.ts
- .query
- acceptance-routes.ts
- milestones.ts
- buildApp
- dispute-view.ts
- delivery-routes.ts
- disputes/test-support.ts
- web/package.json
- routes.ts
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- draft-routes.ts
- completeness.ts
- mcp.ts
- DisputeActions.tsx
- services
- src/reminders.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-routes.ts
- delivery-check-routes.ts
- postgres.ts
- question-routes.ts
- claims/package.json
- sandbox-respond-report.ts
- Database
- claim-job.ts
- Database
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- eval-runner.ts
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- server/src/index.ts
- build.js
- products/package.json
- postgresContentStore
- ai/package.json
- message-job.ts
- src/summary.test.ts
- scripts
- sandbox-partner-report.ts
- detectMediaType
- delivery-check-routes.test.ts
- render.ts
- email/package.json
- compilerOptions
- LiveHub
- @pactpal/pdf@workspace:*
- pdf/package.json
- PacketPanel.tsx
- council/package.json
- IntakePanel.tsx
- live/src/index.ts
- server/package.json
- eval-scope.ts
- image.ts
- chat-api.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- server/package.json
- Engineering standards
- package.json
- Decisions
- dependencies
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
- ChatTab.tsx
- Layout
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
- @fastify/websocket
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- app-link-routes.ts
- @modelcontextprotocol/sdk@1.32.1
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- @pactpal/ai@workspace:*
- @pactpal/council@workspace:*
- docs/tsconfig.json
- log-labels.test.ts
- bus.test.ts
- Scope
- @pactpal/db@workspace:*
- @pactpal/delivery-check@workspace:*
- @pactpal/ledger@workspace:*
- @pactpal/net@workspace:*
- @pactpal/scope-draft@workspace:*
- @pactpal/score@workspace:*
- @pactpal/timeline@workspace:*
- @pactpal/watcher@workspace:*
- pg@^8.23.1
- zod@^4.6.7

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

## Communities (180 total, 22 thin omitted)

### Community 0 - "DealPage.tsx"
Cohesion: 0.08
Nodes (53): AgentRequestsPanel(), AnswerBox(), Revisions, revisionWords(), answerAgentRequest(), approveDelivery(), checkLedger(), checkMessage() (+45 more)

### Community 1 - "vitest"
Cohesion: 0.04
Nodes (93): db, SCOPE, WEBP, db, newDeal, sellerDeal(), setup(), signedIn() (+85 more)

### Community 2 - "TEST_NOW"
Cohesion: 0.08
Nodes (38): db, agentDeal(), db, mcpClient(), ToolResult, UNTRUSTED_NOTE, db, db (+30 more)

### Community 3 - "change-orders.ts"
Cohesion: 0.05
Nodes (60): acceptTermsSchema, at(), document(), savedDeal(), AcceptChange, acceptChangeSchema, addedCounts(), answer() (+52 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.12
Nodes (24): addFile(), checksUrl(), fileUrl(), getDeliveryChecks(), isChecks(), isFile(), isReading(), MAX_FILE_BYTES (+16 more)

### Community 5 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (70): forward(), settle(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms() (+62 more)

### Community 6 - "api.ts"
Cohesion: 0.06
Nodes (62): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+54 more)

### Community 7 - "Engineering"
Cohesion: 0.12
Nodes (19): Engineering, candidates(), searchTime(), createdInvoice, DraftInvoice, invoiceDetails, invoiceNote(), InvoiceSendError (+11 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (51): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ScopeInput (+43 more)

### Community 9 - "dispute-sync.ts"
Cohesion: 0.06
Nodes (54): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+46 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (59): parseJsonReply(), tryParse(), AppealCheck, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+51 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (78): agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow (+70 more)

### Community 12 - "milestone-routes.ts"
Cohesion: 0.11
Nodes (29): milestoneRoutes(), answer(), sellerApp(), paypalProblem(), sendBody, SendOutcome, sendToPayPal(), stageParams (+21 more)

### Community 13 - "isObject"
Cohesion: 0.07
Nodes (58): addBuyer(), addPastedChat(), checkPayments(), createDeal(), DealFile, DealSummary, draftFrom(), draftsUrl() (+50 more)

### Community 14 - "scope-draft/src/council-task.ts"
Cohesion: 0.12
Nodes (24): schemaEnforced(), JsonSchema, RankingPromptInput, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input (+16 more)

### Community 15 - "utcDateTime"
Cohesion: 0.19
Nodes (21): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+13 more)

### Community 16 - "PayPalResult"
Cohesion: 0.06
Nodes (43): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails (+35 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.05
Nodes (78): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+70 more)

### Community 18 - "email/src/index.ts"
Cohesion: 0.07
Nodes (36): RFC-2606, ENTITIES, entity(), htmlToText(), emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult (+28 more)

### Community 19 - "chat-state.ts"
Cohesion: 0.20
Nodes (19): ChatView, liveUrl(), ChatAction, chatReducer(), ChatState, Connection, initialChat, lastSeq() (+11 more)

### Community 20 - "ref_zod"
Cohesion: 0.08
Nodes (51): sendTimelineReminders(), acceptBody, changeOrderRoutes(), view(), waitingChange(), changeParams, changeView(), declineBody (+43 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.10
Nodes (37): attempt(), AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema, withoutLinePrefix() (+29 more)

### Community 22 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (19): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+11 more)

### Community 23 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (46): APP_KEYS, checkAsSellerApp(), message(), result, APP_LABELS, appSection(), formatSandboxReport(), LoginCheck (+38 more)

### Community 24 - "ref_zod"
Cohesion: 0.04
Nodes (84): linkRoutes(), REDEEM_PATH, redeemBody, db, backHome(), callbackQuery, cookieRules, currentSession() (+76 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (46): ChatFailureKind, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.10
Nodes (36): publishingBus(), Config, log, ASK_MODEL_TASK_NAME, ClientsFor, CouncilTaskWiring, DISPUTE_TASK_NAME, DRAFT_TASK_NAME (+28 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.29
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+3 more)

### Community 28 - "claims/src/check.ts"
Cohesion: 0.09
Nodes (35): AppealContext, checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT (+27 more)

### Community 29 - "Secret"
Cohesion: 0.05
Nodes (41): sellerKeyBox(), AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+33 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.06
Nodes (72): analysesUrl(), AppealCheckView, AppealView, checkAppeal(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement (+64 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (40): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind, EVAL_CASES (+32 more)

### Community 32 - "validate.ts"
Cohesion: 0.12
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, draftTimelineOf() (+23 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (38): categoryLabels, describeDraft(), DraftView, priceMinor(), allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, CategoryVerdict (+30 more)

### Community 34 - "deliveries.ts"
Cohesion: 0.06
Nodes (43): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+35 more)

### Community 35 - "test-app.ts"
Cohesion: 0.05
Nodes (82): SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened (+74 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "receipt.ts"
Cohesion: 0.11
Nodes (33): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+25 more)

### Community 38 - "net/src/index.ts"
Cohesion: 0.06
Nodes (56): checks, ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions (+48 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.12
Nodes (34): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+26 more)

### Community 40 - "PayPalRestClient"
Cohesion: 0.05
Nodes (37): connectOwnApp(), Receiver, PayPalBuyerTestActions, dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError (+29 more)

### Community 41 - "App.tsx"
Cohesion: 0.09
Nodes (29): getSellerApp(), isSellerAppLink(), isSellerAppState(), LinkProblem, linkSellerApp(), Me, redeemLink(), SellerAppLink (+21 more)

### Community 42 - "confirmation.ts"
Cohesion: 0.27
Nodes (10): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+2 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (27): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors(), formatReport() (+19 more)

### Community 44 - ".query"
Cohesion: 0.04
Nodes (96): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest(), claimAgentRequest(), createAgentRequest() (+88 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.09
Nodes (36): ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps (+28 more)

### Community 46 - "milestones.ts"
Cohesion: 0.14
Nodes (17): InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid(), markInvoiceSent(), MILESTONE_STATUSES, MilestoneNotAllowedError (+9 more)

### Community 47 - "buildApp"
Cohesion: 0.10
Nodes (21): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), CALLBACK_PATH (+13 more)

### Community 48 - "dispute-view.ts"
Cohesion: 0.18
Nodes (16): CHECK_INTERVAL_MS, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputeFieldsOf(), DisputeMessageView, disputePageView() (+8 more)

### Community 49 - "delivery-routes.ts"
Cohesion: 0.11
Nodes (30): featureAnswers(), readBody(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes() (+22 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.06
Nodes (59): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+51 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "routes.ts"
Cohesion: 0.14
Nodes (28): ACCEPTANCE_DOCUMENT_FORMAT, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, dealAccess(), visibleDeal() (+20 more)

### Community 53 - "tools.ts"
Cohesion: 0.05
Nodes (65): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+57 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (29): key(), seller(), draft(), unchanged(), `acceptances`: signed agreements, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record (+21 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.08
Nodes (42): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+34 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.12
Nodes (26): DeliveryCheckView, ChatMessage, CheckedFile, CheckLine, codeChecks(), judge(), largest(), LineCodeResult (+18 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.12
Nodes (27): `agent_requests`: what an agent asks the seller to let it do (8c), allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate (+19 more)

### Community 59 - "draft-routes.ts"
Cohesion: 0.14
Nodes (24): CHAT_TRANSCRIPT_PREFIX, sendRefusal(), attachmentHeader(), sendCheckedFile(), sendDownload(), draftParams, DraftRouteOptions, draftRoutes() (+16 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "mcp.ts"
Cohesion: 0.17
Nodes (15): checkMcp(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL, sseTransport() (+7 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.16
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), escalateDispute(), getDisputeActions(), isActionAnswer() (+20 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "src/reminders.ts"
Cohesion: 0.29
Nodes (7): StepProgress, addDays(), dayOf(), DueReminder, dueReminders(), REMIND_DAYS_BEFORE, now

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.11
Nodes (26): checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRecord, DraftRefusal, draftRow (+18 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.16
Nodes (26): appealApplies(), RunnerBusyError, analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob() (+18 more)

### Community 69 - "delivery-check-routes.ts"
Cohesion: 0.11
Nodes (31): checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), looks(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS (+23 more)

### Community 70 - "postgres.ts"
Cohesion: 0.08
Nodes (17): Row, connectPostgres(), databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres() (+9 more)

### Community 71 - "question-routes.ts"
Cohesion: 0.11
Nodes (24): DealCards, AcceptanceRouteOptions, DealLookup, ChangeOrderRouteOptions, DeliveryRouteOptions, FileRouteOptions, MessageRouteOptions, MilestoneRouteOptions (+16 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (71): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+63 more)

### Community 74 - "Database"
Cohesion: 0.07
Nodes (37): McpRouteOptions, AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), LinkOptions (+29 more)

### Community 75 - "claim-job.ts"
Cohesion: 0.16
Nodes (29): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+21 more)

### Community 76 - "Database"
Cohesion: 0.09
Nodes (28): AppOptions, SignInOptions, ListingRouteOptions, DealOptions, ActionRouteOptions, DisputeWriter, ClaimRunner, DisputeChecker (+20 more)

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
Cohesion: 0.04
Nodes (74): councilDeps(), councilRecordOf(), isRankingRequest(), CheckView, db, FAILED, model(), shown (+66 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.14
Nodes (24): draftCategories, EvalOptions, EvalRecord, runCase(), runEvals(), tokensOf(), buyerProvidesScore(), categoryVerdict() (+16 more)

### Community 83 - "db/src/index.ts"
Cohesion: 0.04
Nodes (80): listeners(), postgresBus(), listQuery, notificationRoutes(), readRequest, result, body, ChatIntegrityError (+72 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "server/src/index.ts"
Cohesion: 0.10
Nodes (21): BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), renderDraftStarter(), renderWorkflowChecker(), sameWorkflowTask(), SCHEDULE_WINDOW_MS (+13 more)

### Community 87 - "build.js"
Cohesion: 0.12
Nodes (9): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+1 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "postgresContentStore"
Cohesion: 0.08
Nodes (41): afterQuery, chatNames(), ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, liveQuery (+33 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "message-job.ts"
Cohesion: 0.14
Nodes (20): runPrepared(), CouncilRecord, councilRecordSchema, toCouncilRecord(), toJson(), usage, DraftJob, MESSAGE_PROMPT_VERSIONS (+12 more)

### Community 92 - "src/summary.test.ts"
Cohesion: 0.14
Nodes (19): checkSummary(), PacketSummary, packetSummarySchema, readSummary(), SummaryContext, buildSummaryMessages(), ExhibitLine, MAX_NOTE_CHARS (+11 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-partner-report.ts"
Cohesion: 0.05
Nodes (61): rows(), connectKeyValue(), keyValueStore(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail() (+53 more)

### Community 95 - "detectMediaType"
Cohesion: 0.33
Nodes (7): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), detectMediaType(), sharp

### Community 96 - "delivery-check-routes.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 97 - "render.ts"
Cohesion: 0.15
Nodes (17): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+9 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 103 - "PacketPanel.tsx"
Cohesion: 0.16
Nodes (18): buildPacket(), draftSummary(), getPacketView(), getSummaries(), isBuiltPacket(), isPacketView(), isSummaries(), PacketChoice (+10 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

### Community 106 - "live/src/index.ts"
Cohesion: 0.23
Nodes (14): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+6 more)

### Community 107 - "server/package.json"
Cohesion: 0.13
Nodes (14): @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/live@workspace:*, @pactpal/qa@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/qa, name (+6 more)

### Community 108 - "eval-scope.ts"
Cohesion: 0.16
Nodes (17): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, logProgress() (+9 more)

### Community 109 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 110 - "chat-api.ts"
Cohesion: 0.23
Nodes (15): chatUrl(), getChat(), getPastedChats(), getTimeline(), isChat(), isMessage(), isPasted(), isRunningStep() (+7 more)

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
Cohesion: 0.17
Nodes (12): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8), AI, Deal space (Phase 7) (+4 more)

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @pactpal/email@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:*, @pactpal/words@workspace:* (+10 more)

### Community 120 - "check-words.ts"
Cohesion: 0.32
Nodes (9): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport() (+1 more)

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

### Community 130 - "ChatTab.tsx"
Cohesion: 0.20
Nodes (10): PastedChat, lastSeenByOther(), bubble(), ChatTab(), CONNECTION_WORDS, DealTab, Message(), NOTICE_TABS (+2 more)

### Community 131 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

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

### Community 157 - "app-link-routes.ts"
Cohesion: 0.26
Nodes (9): linkBody, paypalUnavailable(), SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts(), sellerAppView(), LinkedApps (+1 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "log-labels.test.ts"
Cohesion: 0.22
Nodes (10): review(), changes(), entry(), sent(), Data model, `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, Phase 7 (deal space) (+2 more)

### Community 168 - "bus.test.ts"
Cohesion: 0.20
Nodes (6): BusSignal, Listen, memoryBus(), addCard(), db, hubOnTestDeal()

### Community 169 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **24 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1516 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `docs/package.json`, `RedisCommands`, `TEST_NOW`, `DealPage.tsx`, `DeliverPanel.tsx`, `appendLedgerEvent`, `change-orders.ts`, `Engineering`, `DraftReview.tsx`, `dispute-sync.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `milestone-routes.ts`, `scope-draft/src/council-task.ts`, `utcDateTime`, `PayPalResult`, `ScopePanel.tsx`, `email/src/index.ts`, `chat-state.ts`, `draft-job.ts`, `paypal-webhook.ts`, `paypal/src/index.ts`, `ref_zod`, `council/src/index.ts`, `server/src/index.ts`, `db/src/migrate.ts`, `claims/src/check.ts`, `Secret`, `web/src/format.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `deliveries.ts`, `test-app.ts`, `packet-service.ts`, `receipt.ts`, `net/src/index.ts`, `eval-report.ts`, `bus.test.ts`, `log-labels.test.ts`, `confirmation.ts`, `config.ts`, `App.tsx`, `acceptance-routes.ts`, `.query`, `buildApp`, `PayPalRestClient`, `disputes/test-support.ts`, `tools.ts`, `action-routes.ts`, `timeline/src/index.ts`, `completeness.ts`, `mcp.ts`, `src/reminders.ts`, `scope-drafts.ts`, `delivery-check-routes.ts`, `postgres.ts`, `sandbox-respond-report.ts`, `claim-job.ts`, `ai/src/index.ts`, `db/src/index.ts`, `server/src/index.ts`, `build.js`, `src/summary.test.ts`, `sandbox-partner-report.ts`, `detectMediaType`, `delivery-check-routes.test.ts`, `render.ts`, `PacketPanel.tsx`, `IntakePanel.tsx`, `live/src/index.ts`, `eval-scope.ts`, `devDependencies`, `package.json`, `check-words.ts`?**
  _High betweenness centrality (0.195) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DealPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07645687645687646 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `PayPalResult`, `README.md`, `Engineering`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.03666338582677165 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Engineering` to `ledger/src/index.ts`, `PayPalResult`, `email/src/index.ts`, `ref_zod`, `paypal/src/index.ts`, `council/src/index.ts`, `Secret`, `web/src/format.ts`, `test-app.ts`, `net/src/index.ts`, `log-labels.test.ts`, `.query`, `Built (sub-phases 2b to 6h-1)`, `draft-routes.ts`, `question-routes.ts`, `claim-job.ts`, `ai/src/index.ts`, `message-job.ts`, `Decisions`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Should `TEST_NOW` be split into smaller, more focused modules?**
  _Cohesion score 0.07607843137254902 - nodes in this community are weakly interconnected._