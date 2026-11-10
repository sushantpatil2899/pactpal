# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 653 files · ~437,088 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 5, .example 1, .css 1)

## Summary
- 5213 nodes · 16744 edges · 196 communities (177 shown, 19 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 523 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3f21e9c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DealPage.tsx
- milestone-routes.ts
- linked-apps.test.ts
- change-orders.ts
- DeliverPanel.tsx
- appendLedgerEvent
- AcceptancePanel.tsx
- McpFallback
- DraftReview.tsx
- utcDateTime
- claims/src/index.ts
- db/src/index.ts
- testId
- api.ts
- eval-runner.ts
- sandbox-clients.ts
- PayPalResult
- ScopePanel.tsx
- email/src/index.ts
- chat-api.ts
- change-order-routes.ts
- draft-job.ts
- paypal-webhook.ts
- when
- auth/sign-in.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- claims.test.ts
- ai/src/index.ts
- AppealPanel.tsx
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- postgres.test.ts
- test-app.ts
- packet-service.ts
- receipt.ts
- net/src/index.ts
- eval-report.ts
- mcp.ts
- react
- council-record.ts
- config.ts
- timeline-routes.ts
- acceptance-routes.ts
- products/src/index.ts
- questions.ts
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
- EvidenceFileError
- src/summary.test.ts
- services
- .query
- scripts
- db/package.json
- testId
- claim-analyses.ts
- delivery-check-routes.ts
- postgres.ts
- draft-changes.ts
- claims/package.json
- sandbox-respond-report.ts
- Database
- claim-routes.ts
- dispute-sync.ts
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
- draft-view.ts
- retention.test.ts
- scripts
- sandbox-webhook-report.ts
- listing-routes.ts
- delivery-check-routes.test.ts
- render.ts
- email/package.json
- compilerOptions
- chat-routes.ts
- dispute-actions.ts
- pdf/package.json
- notices.ts
- council/package.json
- readChecked
- resend-inbound.ts
- plainCode
- chat.ts
- image.ts
- record.ts
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
- intake-routes.ts
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
- claim-job.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Secret
- Privacy
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- action-service.ts
- server/package.json
- docs/tsconfig.json
- log-labels.test.ts
- eval-scope.ts
- Scope
- appeal-items.ts
- readLedger
- bus.ts
- progress.ts
- timeline-progress.ts
- schema.ts
- TimelineStep
- council
- questionRoutes
- match.ts
- photo-convert.test.ts
- packet-routes.test.ts
- src/draft-source.ts
- @modelcontextprotocol/sdk@1.32.1
- @pactpal/ai@workspace:*
- @pactpal/claims@workspace:*
- @pactpal/delivery-check@workspace:*
- @pactpal/net@workspace:*
- @pactpal/paypal@workspace:*
- @pactpal/pdf@workspace:*
- @pactpal/qa@workspace:*
- @pactpal/words@workspace:*
- pg@^8.23.1
- redis
- ws
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
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts
- ``agent_requests`: what an agent asks the seller to let it do (8c)` --references--> `done()`  [INFERRED]
  docs/data-model.md → packages/timeline/src/progress.ts

## Import Cycles
- None detected.

## Communities (196 total, 19 thin omitted)

### Community 0 - "DealPage.tsx"
Cohesion: 0.07
Nodes (42): checkLedger(), CompletenessItem, CompletenessView, getCompleteness(), getMe(), isCompleteness(), LedgerCheck, LinkProblem (+34 more)

### Community 1 - "milestone-routes.ts"
Cohesion: 0.07
Nodes (43): sendBody, SendOutcome, stageParams, day(), StageInvoice, checkInvoicePaid(), CheckSource, INVOICE_PAID_EVENT (+35 more)

### Community 2 - "linked-apps.test.ts"
Cohesion: 0.19
Nodes (16): db, invoiceEntries(), signedPayPal(), StageView, fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db (+8 more)

### Community 3 - "change-orders.ts"
Cohesion: 0.04
Nodes (66): `change_orders`: changes to a signed agreement, acceptTermsSchema, AcceptChange, acceptChangeSchema, addedCounts(), answer(), CHANGE_ORDER_STATUSES, changeOf() (+58 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.16
Nodes (25): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+17 more)

### Community 5 - "appendLedgerEvent"
Cohesion: 0.08
Nodes (46): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal (+38 more)

### Community 6 - "AcceptancePanel.tsx"
Cohesion: 0.21
Nodes (17): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+9 more)

### Community 7 - "McpFallback"
Cohesion: 0.07
Nodes (27): dollar, setup(), DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback, reasonOf(), invoice (+19 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.11
Nodes (28): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, DraftView, ChatLines(), ChatPane() (+20 more)

### Community 9 - "utcDateTime"
Cohesion: 0.17
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+14 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (53): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), AppealItem, appealMessages(), appealSource() (+45 more)

### Community 11 - "db/src/index.ts"
Cohesion: 0.03
Nodes (109): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, agentBodySha256(), AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+101 more)

### Community 12 - "testId"
Cohesion: 0.05
Nodes (56): db, mcpClient(), ToolResult, db, SESSION_COOKIE, db, SCOPE, WEBP (+48 more)

### Community 13 - "api.ts"
Cohesion: 0.05
Nodes (82): AgentRequestsPanel(), addFile(), addPastedChat(), answerAgentRequest(), AnswerOptionView, BuiltPacket, CategoryVerdict, CHANGE_STATUSES (+74 more)

### Community 14 - "eval-runner.ts"
Cohesion: 0.20
Nodes (15): draftCategories, alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions (+7 more)

### Community 15 - "sandbox-clients.ts"
Cohesion: 0.13
Nodes (19): connectKeyValue(), keyValueStore(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers() (+11 more)

### Community 16 - "PayPalResult"
Cohesion: 0.06
Nodes (45): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAction, DisputeAnswer, disputeDetails (+37 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (68): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+60 more)

### Community 18 - "email/src/index.ts"
Cohesion: 0.08
Nodes (32): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError (+24 more)

### Community 19 - "chat-api.ts"
Cohesion: 0.07
Nodes (57): listFiles(), StepView, chatUrl(), ChatView, getChat(), getPastedChats(), getTimeline(), isChat() (+49 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.07
Nodes (40): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, acceptBody (+32 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.09
Nodes (45): MESSAGE_PROMPT_VERSIONS, MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AnswerRefusal (+37 more)

### Community 22 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (19): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+11 more)

### Community 23 - "when"
Cohesion: 0.09
Nodes (40): buildPacket(), checkDisputes(), DealSummary, disputesUrl(), DisputesView, draftSummary(), getDisputePage(), getDisputes() (+32 more)

### Community 24 - "auth/sign-in.ts"
Cohesion: 0.09
Nodes (40): linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules, currentSession() (+32 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (55): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), Engineering, schemaEnforced() (+47 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.16
Nodes (23): Config, CronStart, runCronJob(), renderWorkflowChecker(), DisputeReader, ClientsFor, CouncilTaskWiring, jsonLines() (+15 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.21
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 28 - "claims.test.ts"
Cohesion: 0.08
Nodes (29): claimLines(), ClaimText, linesOf(), AGREEMENT, CLAIM, context, ENTRIES, MAYA (+21 more)

### Community 29 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (40): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+32 more)

### Community 30 - "AppealPanel.tsx"
Cohesion: 0.09
Nodes (40): analysesUrl(), AppealCheckView, AppealView, ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), CouncilView (+32 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (33): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, linesOf(), baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+25 more)

### Community 32 - "validate.ts"
Cohesion: 0.11
Nodes (33): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, buyerProvidesOf(), Citation (+25 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (41): RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input, numbered, findInstructionLines(), HIDDEN_LINE_TEXT (+33 more)

### Community 34 - "postgres.test.ts"
Cohesion: 0.09
Nodes (34): answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile (+26 more)

### Community 35 - "test-app.ts"
Cohesion: 0.05
Nodes (83): agentDeal(), db, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach() (+75 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (51): addedByRole(), fileView(), aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut (+43 more)

### Community 37 - "receipt.ts"
Cohesion: 0.12
Nodes (32): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+24 more)

### Community 38 - "net/src/index.ts"
Cohesion: 0.06
Nodes (63): ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork() (+55 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "mcp.ts"
Cohesion: 0.08
Nodes (31): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+23 more)

### Community 41 - "react"
Cohesion: 0.07
Nodes (43): AgentRequestView, answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), MessageReviewView (+35 more)

### Community 42 - "council-record.ts"
Cohesion: 0.16
Nodes (15): councilRecordOf(), compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided() (+7 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (26): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+18 more)

### Community 44 - "timeline-routes.ts"
Cohesion: 0.17
Nodes (26): sendTimelineReminders(), changeView(), money(), scopeTerms(), scopeView(), stepTerms(), REFUSALS, stageFacts() (+18 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (39): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload (+31 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.12
Nodes (21): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, ProductLookup, fakeChannel3(), NOW (+13 more)

### Community 47 - "questions.ts"
Cohesion: 0.08
Nodes (37): originOf(), lockDeal(), AiAnswer, aiAnswerSchema, AnswerQuestion, answerQuestion(), answerQuestionSchema, AskQuestion (+29 more)

### Community 48 - "checker.ts"
Cohesion: 0.13
Nodes (14): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), renderClaimRunner(), renderDraftStarter(), sameWorkflowTask(), SCHEDULE_WINDOW_MS, startRun() (+6 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (65): isPicture(), lookUp(), DISPUTE_EVENT_PREFIX, db, addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits (+57 more)

### Community 50 - "TEST_NOW"
Cohesion: 0.07
Nodes (51): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+43 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "draft-routes.ts"
Cohesion: 0.11
Nodes (32): CHAT_TRANSCRIPT_PREFIX, sendRefusal(), attachmentHeader(), sendCheckedFile(), sendDownload(), draftParams, draftRoutes(), beginDraft() (+24 more)

### Community 53 - "tools.ts"
Cohesion: 0.10
Nodes (30): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+22 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (25): key(), seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), Data model, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work (+17 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.12
Nodes (30): reviewView(), acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf() (+22 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.15
Nodes (22): DeliveryCheckView, CheckedFile, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES (+14 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.10
Nodes (31): LABEL, OwnFields(), pointedWords(), StepTargets, TimelineEditor(), StepProgress, addDays(), dayOf() (+23 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (48): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS (+40 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "EvidenceFileError"
Cohesion: 0.33
Nodes (3): EvidenceFileError, MAX_EVIDENCE_FILE_BYTES, pdf

### Community 62 - "src/summary.test.ts"
Cohesion: 0.11
Nodes (24): PacketFacts, ClaimAnalysis, ComparisonRow, comparisonRows(), comparisonText(), checkSummary(), PacketSummary, packetSummarySchema (+16 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - ".query"
Cohesion: 0.11
Nodes (29): disputeWriters(), InvoiceAccount, LinkedApp, linkedDisputeAccounts(), NoInvoiceAccount, listMilestones(), activeConnection(), claimAccount() (+21 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "testId"
Cohesion: 0.07
Nodes (49): dealWithBuyer(), goodsDeal(), db, withReadyDraft(), waitingDraft(), sellerWithoutBuyer(), postgresContentStore(), createDeal() (+41 more)

### Community 68 - "claim-analyses.ts"
Cohesion: 0.06
Nodes (40): disputedDeal(), ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord (+32 more)

### Community 69 - "delivery-check-routes.ts"
Cohesion: 0.08
Nodes (48): DealLookup, dealParams, featureAnswers(), FoundDeal, readBody(), Refusal, checkBody, checkView() (+40 more)

### Community 70 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 71 - "draft-changes.ts"
Cohesion: 0.21
Nodes (12): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+4 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (76): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+68 more)

### Community 74 - "Database"
Cohesion: 0.06
Nodes (52): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), LinkOptions (+44 more)

### Community 75 - "claim-routes.ts"
Cohesion: 0.17
Nodes (25): newestReady(), appealApplies(), RunnerBusyError, analysisView(), appealView(), claimRoutes(), answer(), startJob() (+17 more)

### Community 76 - "dispute-sync.ts"
Cohesion: 0.24
Nodes (13): LinkedDisputeAccount, changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails (+5 more)

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
Cohesion: 0.06
Nodes (54): councilDeps(), isRankingRequest(), CheckView, db, FAILED, model(), shown, store (+46 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 83 - "dispute-view.ts"
Cohesion: 0.17
Nodes (17): CHECK_INTERVAL_MS, disputeOf(), checkView(), disputeParams, disputeRoutes(), DisputeMessageView, disputePageView(), disputeSummaryView() (+9 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "server/src/index.ts"
Cohesion: 0.12
Nodes (21): APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, DISPUTE_TASK_NAME, DRAFT_TASK_NAME (+13 more)

### Community 87 - "postStep"
Cohesion: 0.16
Nodes (28): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftStatement(), escalateDispute(), getDisputeActions() (+20 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.08
Nodes (60): notificationRoutes(), CompletenessRouteOptions, completenessRoutes(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams (+52 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "draft-view.ts"
Cohesion: 0.20
Nodes (12): councilRecordSchema, categoryLabels, describeDraft(), DraftView, priceMinor(), DraftRecord, allowedCategoryIds(), BLOCKED_CATEGORIES (+4 more)

### Community 92 - "retention.test.ts"
Cohesion: 0.07
Nodes (37): `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), disputed(), MAX_PACKETS_PER_DISPUTE, NewPacket, newPacketSchema, PacketExhibit, packetExhibitSchema (+29 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "listing-routes.ts"
Cohesion: 0.15
Nodes (9): LISTING_CACHE_SECONDS, ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+1 more)

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

### Community 100 - "chat-routes.ts"
Cohesion: 0.07
Nodes (37): BusSignal, afterQuery, chatNames(), ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+29 more)

### Community 101 - "dispute-actions.ts"
Cohesion: 0.12
Nodes (26): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+18 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 103 - "notices.ts"
Cohesion: 0.12
Nodes (24): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+16 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "readChecked"
Cohesion: 0.09
Nodes (38): addBuyer(), checkPayments(), createDeal(), DealOptions, errorMessage(), getDeal(), getDealOptions(), getIntakeKey() (+30 more)

### Community 106 - "resend-inbound.ts"
Cohesion: 0.13
Nodes (19): createIntakeDeal(), intakeFilename(), intakeEmail(), app, envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH (+11 more)

### Community 107 - "plainCode"
Cohesion: 0.20
Nodes (21): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+13 more)

### Community 108 - "chat.ts"
Cohesion: 0.10
Nodes (23): addCard(), body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage() (+15 more)

### Community 109 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 110 - "record.ts"
Cohesion: 0.29
Nodes (10): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, MAX_RECORD_LINES, text() (+2 more)

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

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/static@^10.1.8, @fastify/websocket@^11.3.7, @pactpal/ledger@workspace:*, @pactpal/live@workspace:*, @pactpal/products@workspace:* (+11 more)

### Community 120 - "check-words.ts"
Cohesion: 0.36
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport()

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
Cohesion: 0.06
Nodes (32): dependencies, marked@18.1.1, devDependencies, tsx@^4.19.2, @types/node@^22.10.2, tsx, @types/node, name (+24 more)

### Community 130 - "intake-routes.ts"
Cohesion: 0.14
Nodes (20): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser(), requireViewer() (+12 more)

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

### Community 150 - "claim-job.ts"
Cohesion: 0.30
Nodes (20): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+12 more)

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

### Community 157 - "Secret"
Cohesion: 0.08
Nodes (27): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+19 more)

### Community 158 - "Privacy"
Cohesion: 0.50
Nodes (4): How long, Privacy, What PactPal keeps, Who else sees it

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "action-service.ts"
Cohesion: 0.16
Nodes (13): deliverAction(), failedOutcome(), send(), appealGaps(), missingFromPacket(), docItemId(), appealCheckSchema, claimAnalysisSchema (+5 more)

### Community 165 - "server/package.json"
Cohesion: 0.12
Nodes (16): @fastify/helmet@^13.2.0, @pactpal/council@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:*, @pactpal/council, @pactpal/timeline (+8 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 168 - "eval-scope.ts"
Cohesion: 0.21
Nodes (13): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), formatErrors(), councilClients() (+5 more)

### Community 169 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 170 - "appeal-items.ts"
Cohesion: 0.19
Nodes (13): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+5 more)

### Community 171 - "readLedger"
Cohesion: 0.17
Nodes (11): db, disputeTypes(), capturingEmail(), db, payments(), READ_LOG_INTERVAL_MS, db, readEntries() (+3 more)

### Community 172 - "bus.ts"
Cohesion: 0.22
Nodes (9): Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), db, hubOnTestDeal(), parseChatEvent() (+1 more)

### Community 173 - "progress.ts"
Cohesion: 0.19
Nodes (12): Phase 7 (deal space), Deal space (Phase 7), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate (+4 more)

### Community 174 - "timeline-progress.ts"
Cohesion: 0.17
Nodes (11): dealIdRow, EVENT_FOR, fileRef, filesOf(), NewReminder, NewStepUpdate, reminderSchema, StepNotAllowedError (+3 more)

### Community 175 - "schema.ts"
Cohesion: 0.17
Nodes (10): citation, citations, commonFields, DELIVERABLE_MARKS, listItem, scopeDraftV2Schema, ScopeDraftV3, scopeDraftV3Schema (+2 more)

### Community 176 - "TimelineStep"
Cohesion: 0.29
Nodes (8): DraftFill, dated(), DraftedItem, DraftedStep, planFromDraft(), same(), TimelinePlan, TimelineStep

### Community 177 - "council"
Cohesion: 0.20
Nodes (10): review(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `message_reviews`: council reviews of the buyer's messages, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work (+2 more)

### Community 178 - "questionRoutes"
Cohesion: 0.36
Nodes (9): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), emailSellerQuietly() (+1 more)

### Community 179 - "match.ts"
Cohesion: 0.39
Nodes (5): DisputedPayments, matchDispute(), NoMatch, paymentKeys(), PaidStage

### Community 180 - "photo-convert.test.ts"
Cohesion: 0.43
Nodes (4): sharp@0.35.5, MAX_PHOTO_SIDE, toJpeg(), sharp

### Community 181 - "packet-routes.test.ts"
Cohesion: 0.38
Nodes (5): ChoicesView, db, disputedDeal(), png(), text()

### Community 182 - "src/draft-source.ts"
Cohesion: 0.40
Nodes (5): DraftSourceParts, messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage

## Knowledge Gaps
- **24 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+19 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1529 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `testId` to `DealPage.tsx`, `milestone-routes.ts`, `linked-apps.test.ts`, `change-orders.ts`, `appendLedgerEvent`, `McpFallback`, `DraftReview.tsx`, `utcDateTime`, `claims/src/index.ts`, `db/src/index.ts`, `api.ts`, `eval-runner.ts`, `sandbox-clients.ts`, `PayPalResult`, `ScopePanel.tsx`, `email/src/index.ts`, `chat-api.ts`, `change-order-routes.ts`, `draft-job.ts`, `paypal-webhook.ts`, `when`, `auth/sign-in.ts`, `council/src/index.ts`, `disputes/task.ts`, `db/src/migrate.ts`, `claims.test.ts`, `ai/src/index.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `postgres.test.ts`, `test-app.ts`, `packet-service.ts`, `receipt.ts`, `net/src/index.ts`, `eval-report.ts`, `mcp.ts`, `react`, `council-record.ts`, `config.ts`, `timeline-routes.ts`, `products/src/index.ts`, `questions.ts`, `checker.ts`, `ledger/src/index.ts`, `TEST_NOW`, `draft-routes.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `EvidenceFileError`, `src/summary.test.ts`, `.query`, `testId`, `claim-analyses.ts`, `postgres.ts`, `draft-changes.ts`, `sandbox-respond-report.ts`, `Database`, `ai/src/index.ts`, `draft-view.ts`, `retention.test.ts`, `sandbox-webhook-report.ts`, `delivery-check-routes.test.ts`, `render.ts`, `dispute-actions.ts`, `notices.ts`, `readChecked`, `resend-inbound.ts`, `plainCode`, `devDependencies`, `package.json`, `check-words.ts`, `docs/package.json`, `Secret`, `action-service.ts`, `log-labels.test.ts`, `appeal-items.ts`, `readLedger`, `bus.ts`, `progress.ts`, `TimelineStep`, `match.ts`, `photo-convert.test.ts`, `packet-routes.test.ts`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _24 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DealPage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06894049346879536 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `progress.ts`, `PayPalResult`, `council/src/index.ts`, `retention.test.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `milestone-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06901960784313725 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `McpFallback`, `claims/src/index.ts`, `PayPalResult`, `email/src/index.ts`, `change-order-routes.ts`, `Secret`, `ai/src/index.ts`, `AppealPanel.tsx`, `scope-draft/src/index.ts`, `test-app.ts`, `net/src/index.ts`, `log-labels.test.ts`, `appeal-items.ts`, `council`, `ledger/src/index.ts`, `draft-routes.ts`, `Built (sub-phases 2b to 6h-1)`, `paypal/src/index.ts`, `.query`, `Database`, `ai/src/index.ts`, `server/src/index.ts`, `plainCode`, `Decisions`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Should `change-orders.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04405775638652351 - nodes in this community are weakly interconnected._