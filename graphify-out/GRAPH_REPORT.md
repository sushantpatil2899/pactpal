# Graph Report - paypal-hackathon  (2026-11-12)

## Corpus Check
- 810 files · ~521,547 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6235 nodes · 19867 edges · 221 communities (201 shown, 20 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 554 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5da4dde9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- mcp.ts
- testId
- change-order-routes.ts
- DealPage.tsx
- when
- delivery-routes.ts
- timeline-progress.ts
- receipt.ts
- db/src/index.ts
- claims/src/index.ts
- acceptance-routes.ts
- tools.ts
- layouts.tsx
- DeliveriesPanel.tsx
- Database
- db/src/migrate.ts
- ChangeOrderPanel.tsx
- DraftPanel.tsx
- MessagesPage.tsx
- change-orders.ts
- dispute-routes.ts
- vitest
- scope-drafts.ts
- appendLedgerEvent
- council/src/index.ts
- disputes/task.ts
- qa/src/index.ts
- net/src/index.ts
- eval-judge.ts
- chat-api.ts
- scope-draft/src/testing.ts
- actions.ts
- scope-draft/src/index.ts
- stories.test.ts
- database.ts
- claim-routes.ts
- DealsTable.tsx
- claim-job.ts
- eval-report.ts
- claim-analyses.ts
- db/src/testing.ts
- templates.ts
- buildApp
- chat-routes.ts
- postgres.ts
- listing-routes.ts
- questions.ts
- web/package.json
- ledger/src/index.ts
- errors.ts
- Deadlines.tsx
- PayPalRestClient
- resend-inbound.ts
- .query
- postStep
- verify
- claims/src/check.ts
- .query
- PayPalResult
- completeness.ts
- vitest
- DraftReview.tsx
- services
- validate.ts
- scripts
- db/package.json
- disputes/test-support.ts
- emailFrom
- question-routes.ts
- Insights.tsx
- instruction-lines.test.ts
- claims/package.json
- paypal/src/index.ts
- council-record.ts
- useMigratedTestDatabase
- delivery-check/src/index.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- SellerAppPanel.tsx
- dispute-sync.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- injection-runner.ts
- products/package.json
- MessagesPanel.tsx
- ai/package.json
- sandbox-respond-report.ts
- notices.ts
- scripts
- sandbox-webhook-report.ts
- packet-service.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- draft-changes.ts
- Secret
- make_content.py
- Pillars.tsx
- council/package.json
- auth/sign-in.ts
- Agents.tsx
- landing-words.ts
- pages.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- build.ts
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- server/package.json
- config.ts
- compilerOptions
- Build plan
- seller-clients.ts
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- AgentPanel.tsx
- production-app.ts
- injection-check.ts
- README.md
- log-labels.ts
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
- checker.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- Landing.tsx
- Closing.tsx
- @fastify/helmet
- .prettierrc.json
- products/tsconfig.json
- Tour.tsx
- dependencies
- docs/tsconfig.json
- @fastify/static
- runtime.ts
- email/src/index.ts
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- Built (sub-phases 2b to 6h-1)
- QuestionsPanel.tsx
- eval-runner.ts
- vite-env.d.ts
- src-app-tsx.md
- @pactpal/qa@workspace:*
- app-link-routes.ts
- design/tokens.ts
- @pactpal/words@workspace:*
- build.js
- IntakePanel.tsx
- PayPal sandbox notes
- source
- Hero.tsx
- Getting started
- brand/package.json
- ai-check-report.ts
- brand/src/index.ts
- deals/routes.ts
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- @pactpal/delivery-check@workspace:*
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy
- change-orders.test.ts
- council
- @pactpal/pdf@workspace:*
- draft-routes.test.ts
- log-labels.test.ts
- @pactpal/live@workspace:*
- @pactpal/paypal@workspace:*
- @pactpal/timeline@workspace:*
- ws
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- buildApp
- RedisCommands
- @pactpal/council@workspace:*
- @pactpal/scope-draft@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 235 edges
2. `Database` - 136 edges
3. `testId()` - 127 edges
4. `readLedger()` - 94 edges
5. `useMigratedTestDatabase()` - 90 edges
6. `sha256Hex()` - 86 edges
7. `react` - 80 edges
8. `TEST_NOW` - 76 edges
9. `appendLedgerEvent()` - 75 edges
10. `isObject()` - 74 edges

## Surprising Connections (you probably didn't know these)
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts

## Import Cycles
- None detected.

## Communities (221 total, 20 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.10
Nodes (36): getMe(), signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage (+28 more)

### Community 1 - "mcp.ts"
Cohesion: 0.14
Nodes (16): checkMcp(), message(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, sseTransport() (+8 more)

### Community 2 - "testId"
Cohesion: 0.06
Nodes (55): db, db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, ActionsView, confirmed() (+47 more)

### Community 3 - "change-order-routes.ts"
Cohesion: 0.14
Nodes (19): acceptBody, ChangeOrderRouteOptions, changeParams, declineBody, proposeBody, ProposeBody, proposedContent(), REFUSALS (+11 more)

### Community 4 - "DealPage.tsx"
Cohesion: 0.08
Nodes (43): checkLedger(), getDeal(), LedgerCheck, ScopeTerms, ScopeView, StepView, getTimeline(), isRunningStep() (+35 more)

### Community 5 - "when"
Cohesion: 0.06
Nodes (73): AppealView, buildPacket(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, DisputesView (+65 more)

### Community 6 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (63): readBody(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+55 more)

### Community 7 - "timeline-progress.ts"
Cohesion: 0.07
Nodes (33): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage(), lastMessages() (+25 more)

### Community 8 - "receipt.ts"
Cohesion: 0.12
Nodes (31): receiptBlocks(), AcceptanceDocument(), AcceptanceDocument, isListingPreview(), ListingPreview, ListingView, lookUpListing(), saveListingPhotos() (+23 more)

### Community 9 - "db/src/index.ts"
Cohesion: 0.03
Nodes (87): PayPalWebhookOptions, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, agentBodySha256(), AgentRequest, AgentRequestKind, AgentRequestRefusal (+79 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.05
Nodes (87): candidates(), JsonReply, parseJsonReply(), tryParse(), AppealCheck, appealCheckSchema, AppealContext, checkAppeal() (+79 more)

### Community 11 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (51): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), acceptanceDocumentSchema, currentDocument(), documentFor() (+43 more)

### Community 12 - "tools.ts"
Cohesion: 0.08
Nodes (39): routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext, AgentTool (+31 more)

### Community 13 - "layouts.tsx"
Cohesion: 0.09
Nodes (34): Me, Unread(), Icon(), IconName, PATHS, Logo(), Button(), applyTheme() (+26 more)

### Community 14 - "DeliveriesPanel.tsx"
Cohesion: 0.16
Nodes (25): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+17 more)

### Community 15 - "Database"
Cohesion: 0.11
Nodes (32): ReceiptMailDeps, Card, DealCards, Notifier, NotifierOptions, PartyNotice, ReminderDeps, AcceptanceRouteOptions (+24 more)

### Community 16 - "db/src/migrate.ts"
Cohesion: 0.18
Nodes (15): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, MigrationStatus (+7 more)

### Community 17 - "ChangeOrderPanel.tsx"
Cohesion: 0.06
Nodes (76): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+68 more)

### Community 18 - "DraftPanel.tsx"
Cohesion: 0.10
Nodes (33): addFile(), addPastedChat(), DealFile, draftFrom(), draftsUrl(), DraftView, fileUrl(), getDraftById() (+25 more)

### Community 19 - "MessagesPage.tsx"
Cohesion: 0.13
Nodes (26): Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People(), plainClick() (+18 more)

### Community 20 - "change-orders.ts"
Cohesion: 0.03
Nodes (97): `acceptances`: signed agreements, Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTermsSchema (+89 more)

### Community 21 - "dispute-routes.ts"
Cohesion: 0.22
Nodes (12): CHECK_INTERVAL_MS, disputeOf(), disputeParams, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), listArtifacts() (+4 more)

### Community 22 - "vitest"
Cohesion: 0.05
Nodes (74): chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal() (+66 more)

### Community 23 - "scope-drafts.ts"
Cohesion: 0.10
Nodes (27): checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRecord, DraftRefusal, draftRow (+19 more)

### Community 24 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (78): acceptTerms(), declineTerms(), lockFor(), originOf(), recordReceiptSent(), requestAcceptance(), setStatus(), withdrawAcceptance() (+70 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (48): Prepared, ChatOutcome, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize() (+40 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.07
Nodes (44): CronStart, runCronJob(), TaskStarter, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME (+36 more)

### Community 27 - "qa/src/index.ts"
Cohesion: 0.10
Nodes (38): attempt(), MESSAGE_PROMPT_VERSIONS, MessageJob, AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine() (+30 more)

### Community 28 - "net/src/index.ts"
Cohesion: 0.07
Nodes (49): ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+41 more)

### Community 29 - "eval-judge.ts"
Cohesion: 0.12
Nodes (29): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+21 more)

### Community 30 - "chat-api.ts"
Cohesion: 0.07
Nodes (53): chatUrl(), ChatView, getChat(), getNotifications(), getPastedChats(), isChat(), isMessage(), isNotification() (+45 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (32): build(), input, numbered, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines() (+24 more)

### Community 32 - "actions.ts"
Cohesion: 0.06
Nodes (122): RouteAnswer, FILE_NAME_HEADER, addBuyer(), AgreementForm, answerDelivery(), askQuestion(), callAs(), chat() (+114 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.09
Nodes (30): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, linesOf(), linesOf() (+22 more)

### Community 34 - "stories.test.ts"
Cohesion: 0.12
Nodes (28): db, newDeal, sellerDeal(), setup(), signedIn(), isRanking(), standInMember(), testDrafting() (+20 more)

### Community 35 - "database.ts"
Cohesion: 0.06
Nodes (55): answerAgentRequest(), shownCode(), Queryable, AddBuyer, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS (+47 more)

### Community 36 - "claim-routes.ts"
Cohesion: 0.05
Nodes (74): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+66 more)

### Community 37 - "DealsTable.tsx"
Cohesion: 0.10
Nodes (34): listDeals(), Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT (+26 more)

### Community 38 - "claim-job.ts"
Cohesion: 0.08
Nodes (59): AlreadySent, appealApplies(), appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS (+51 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "claim-analyses.ts"
Cohesion: 0.07
Nodes (29): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+21 more)

### Community 41 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (81): dealWithBuyer(), Conversation, db, db, goodsDeal(), SCOPE, WEBP, disputeTypes() (+73 more)

### Community 42 - "templates.ts"
Cohesion: 0.11
Nodes (31): NOTICE_LOOK, EmailTemplates, loadEmailTemplates(), repoFolder(), templatesDir(), bodyHtml(), Brand, brandSchema (+23 more)

### Community 43 - "buildApp"
Cohesion: 0.10
Nodes (18): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+10 more)

### Community 44 - "chat-routes.ts"
Cohesion: 0.07
Nodes (19): BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db (+11 more)

### Community 45 - "postgres.ts"
Cohesion: 0.08
Nodes (17): Row, connectPostgres(), databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres() (+9 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.12
Nodes (21): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, fakeChannel3(), NOW, attributeName(), capped() (+13 more)

### Community 47 - "questions.ts"
Cohesion: 0.07
Nodes (35): forward(), settle(), AiAnswer, aiAnswerSchema, AnswerQuestion, answerQuestion(), answerQuestionSchema, askQuestionSchema (+27 more)

### Community 48 - "web/package.json"
Cohesion: 0.04
Nodes (66): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+58 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (68): sharp@0.35.5, isPicture(), MAX_PHOTO_SIDE, toJpeg(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError (+60 more)

### Community 50 - "errors.ts"
Cohesion: 0.07
Nodes (33): dollar, setup(), MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer, page() (+25 more)

### Community 51 - "Deadlines.tsx"
Cohesion: 0.09
Nodes (33): StageView, BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, addDays(), daysBetween(), earlierDay() (+25 more)

### Community 52 - "PayPalRestClient"
Cohesion: 0.10
Nodes (23): APP_KEYS, checkAsSellerApp(), checks, result, APP_LABELS, appSection(), formatSandboxReport(), LoginCheck (+15 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.22
Nodes (10): intakeEmail(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), ENTITIES, entity() (+2 more)

### Community 54 - ".query"
Cohesion: 0.08
Nodes (38): listDemoSteps(), recordDemoStep(), refsSchema, rowSchema, turnOffIntakeKey(), allowPurge(), countOf(), Cutoff (+30 more)

### Community 55 - "postStep"
Cohesion: 0.16
Nodes (29): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+21 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (29): checkAnalysis(), invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, AGREEMENT, CLAIM, context (+21 more)

### Community 58 - ".query"
Cohesion: 0.06
Nodes (66): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), DealOverview, dealOverview() (+58 more)

### Community 59 - "PayPalResult"
Cohesion: 0.07
Nodes (34): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, disputeDetails (+26 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "vitest"
Cohesion: 0.07
Nodes (41): CheckView, db, FAILED, model(), shown, store, isRanking(), member() (+33 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (41): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ScopeInput (+33 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "validate.ts"
Cohesion: 0.12
Nodes (30): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+22 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "disputes/test-support.ts"
Cohesion: 0.07
Nodes (40): answer, AppealView, db, FILES, inProcessClaimRunner(), AnalysesView, db, disputedDeal() (+32 more)

### Community 68 - "emailFrom"
Cohesion: 0.19
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+15 more)

### Community 69 - "question-routes.ts"
Cohesion: 0.05
Nodes (93): afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS (+85 more)

### Community 70 - "Insights.tsx"
Cohesion: 0.11
Nodes (23): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+15 more)

### Community 71 - "instruction-lines.test.ts"
Cohesion: 0.12
Nodes (24): JsonSchema, RANK_CRITERIA, ScopeDraftTask, findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction(), PATTERNS (+16 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (47): InvoiceArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, transactionList (+39 more)

### Community 74 - "council-record.ts"
Cohesion: 0.14
Nodes (19): councilRecordOf(), beginDraft(), CouncilRecord, councilRecordSchema, isUnranked(), two, usage, categoryLabels (+11 more)

### Community 75 - "useMigratedTestDatabase"
Cohesion: 0.09
Nodes (19): db, agentDeal(), db, mcpClient(), ToolResult, db, db, db (+11 more)

### Community 76 - "delivery-check/src/index.ts"
Cohesion: 0.05
Nodes (69): checkBody, checkView(), deliveryCheckRoutes(), looks(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS, askImageModels() (+61 more)

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
Cohesion: 0.09
Nodes (33): MAX_CONCURRENT_COUNCILS, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+25 more)

### Community 82 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 83 - "dispute-sync.ts"
Cohesion: 0.12
Nodes (23): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+15 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "injection-runner.ts"
Cohesion: 0.14
Nodes (24): draftCategories, toCouncilRecord(), DraftJob, JobLog, runDraftJob(), runMessageJob(), EvalOptions, EvalRecord (+16 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (99): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+91 more)

### Community 92 - "notices.ts"
Cohesion: 0.12
Nodes (30): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+22 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.11
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 95 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+38 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (99): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), addBuyer() (+91 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (46): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+38 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "draft-changes.ts"
Cohesion: 0.22
Nodes (11): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+3 more)

### Community 101 - "Secret"
Cohesion: 0.10
Nodes (11): seller(), `deal_messages`: the deal's chat (7b), `ledger_entries`: the evidence log, Engineering, ResendEmailSender, sender(), SecretBoxKeyError, box (+3 more)

### Community 103 - "Pillars.tsx"
Cohesion: 0.17
Nodes (17): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+9 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "auth/sign-in.ts"
Cohesion: 0.09
Nodes (30): actingAs(), LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, db, setup(), backHome() (+22 more)

### Community 106 - "Agents.tsx"
Cohesion: 0.15
Nodes (16): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+8 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.15
Nodes (21): Audience(), GLYPHS, SPOTS, Sticker(), at(), Closing(), LIMIT_GLYPHS, Tagline() (+13 more)

### Community 108 - "pages.tsx"
Cohesion: 0.12
Nodes (38): createDeal(), getDealOptions(), LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), NewDealPage() (+30 more)

### Community 109 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

### Community 110 - "Demo plan"
Cohesion: 0.11
Nodes (18): Buyers (each: a sandbox **Personal** account with the same email and sandbox balance, to pay invoices), Cast, Chats, Demo plan, Done by the owner, How the inboxes work (set up 11 Nov 2026), Maya's book of deals (written work only), Rules (+10 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "build.ts"
Cohesion: 0.20
Nodes (9): css, dist, faces, FONTS, home, problems, root, PAGES (+1 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.20
Nodes (10): AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product, Redesign (Phase 7R) (+2 more)

### Community 119 - "server/package.json"
Cohesion: 0.12
Nodes (16): @modelcontextprotocol/sdk@1.32.1, @pactpal/claims@workspace:*, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, @pactpal/watcher@workspace:*, redis@6.3.0, @modelcontextprotocol/sdk, @pactpal/ledger (+8 more)

### Community 120 - "config.ts"
Cohesion: 0.10
Nodes (27): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, ConfigReport (+19 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "seller-clients.ts"
Cohesion: 0.17
Nodes (9): authAssertion(), base64Url(), PayPalInvoices, route(), clientsOver(), ownAppClients(), PlatformSellerClients, SellerClients (+1 more)

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
Cohesion: 0.10
Nodes (25): dependencies, @fontsource/instrument-serif@5.3.0, @fontsource-variable/geist@5.3.0, @fontsource-variable/geist-mono@5.3.0, marked@18.1.1, mermaid@12.2.0, @pactpal/brand@workspace:*, devDependencies (+17 more)

### Community 129 - "AgentPanel.tsx"
Cohesion: 0.18
Nodes (15): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+7 more)

### Community 130 - "production-app.ts"
Cohesion: 0.08
Nodes (32): SignInOptions, publishingBus(), renderClaimRunner(), sameWorkflowTask(), DisputeReader, LinkedDisputeAccount, runDisputeTask(), result (+24 more)

### Community 131 - "injection-check.ts"
Cohesion: 0.19
Nodes (12): logProgress(), DroppedDraft, droppedSection(), ruleOf(), clients, councilFailures(), counts(), formatInjectionReport() (+4 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 134 - "PactPal"
Cohesion: 0.17
Nodes (12): Changing emails, Code map, Connect your agent (MCP), Deploying to Render, Disclaimer, Docs, License, PactPal (+4 more)

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

### Community 150 - "checker.ts"
Cohesion: 0.16
Nodes (11): BUTTON_WINDOW_MS, checkKey(), CheckRequest, DisputeChecker, inProcessChecker(), renderDraftStarter(), renderWorkflowChecker(), SCHEDULE_WINDOW_MS (+3 more)

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

### Community 157 - "PactPal design system"
Cohesion: 0.14
Nodes (14): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+6 more)

### Community 158 - "Landing.tsx"
Cohesion: 0.14
Nodes (10): ART, at(), dots(), Features(), FEATURES, MOVES, at(), Moves() (+2 more)

### Community 159 - "Closing.tsx"
Cohesion: 0.25
Nodes (12): PILLARS, Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces() (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Tour.tsx"
Cohesion: 0.09
Nodes (18): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+10 more)

### Community 165 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/websocket@^11.3.7, @pactpal/ai@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:*, @pactpal/products@workspace:* (+12 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 168 - "runtime.ts"
Cohesion: 0.27
Nodes (9): modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), clients, parsed, parsed, askModelTask (+1 more)

### Community 169 - "email/src/index.ts"
Cohesion: 0.08
Nodes (30): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError (+22 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (18): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+10 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (18): `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes, Evidence completeness score: computed, not stored, `evidence_packets`: built evidence packets (+10 more)

### Community 174 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 175 - "eval-runner.ts"
Cohesion: 0.18
Nodes (11): councilDeps(), isRankingRequest(), clients(), down, invented, model(), wrongCategory, chatLines() (+3 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "app-link-routes.ts"
Cohesion: 0.26
Nodes (11): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+3 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 182 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 183 - "IntakePanel.tsx"
Cohesion: 0.20
Nodes (14): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+6 more)

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 185 - "source"
Cohesion: 0.18
Nodes (11): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+3 more)

### Community 186 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 189 - "ai-check-report.ts"
Cohesion: 0.40
Nodes (7): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec

### Community 190 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 191 - "deals/routes.ts"
Cohesion: 0.06
Nodes (50): McpRouteOptions, AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), AppOptions (+42 more)

### Community 192 - "Connect your AI agent"
Cohesion: 0.33
Nodes (6): 1. Make an agent key, 2. Add PactPal to your assistant, Connect your AI agent, Nothing is sent without you, On the record, What your agent can do

### Community 193 - "When a buyer disputes"
Cohesion: 0.33
Nodes (6): Answer, Build the evidence packet, Check the claim against the record, If the decision goes against you, What you see, When a buyer disputes

### Community 194 - "PactPal help"
Cohesion: 0.33
Nodes (6): PactPal help, Start here, The AI, Trust, Under the hood, Your deals

### Community 195 - "brand/tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, noEmit, extends, include, ../../tsconfig.base.json

### Community 197 - "Agreements and the timeline"
Cohesion: 0.40
Nodes (5): Agreements and the timeline, From the chat to an agreement, The timeline, What signing records, When the work changes

### Community 198 - "How PactPal is built"
Cohesion: 0.40
Nodes (5): How a council runs, How PactPal is built, The parts, The rules every change meets, Where it runs

### Community 199 - "For your buyer"
Cohesion: 0.50
Nodes (4): Disputes, For your buyer, One link by email, What signing means

### Community 200 - "Chat, Messages and reminders"
Cohesion: 0.50
Nodes (4): Chat, Messages and reminders, Messages, Reminders, The deal's chat

### Community 201 - "Delivering work"
Cohesion: 0.50
Nodes (4): Approvals and revisions, Delivering work, Physical goods, Send through a tracked link

### Community 202 - "The evidence log"
Cohesion: 0.50
Nodes (4): Check it yourself, The evidence log, The records score, Why nobody can quietly edit it

### Community 203 - "What PactPal is and is not"
Cohesion: 0.50
Nodes (4): PactPal is, PactPal is not, What PactPal is and is not, Which deals suit it

### Community 204 - "Privacy"
Cohesion: 0.50
Nodes (4): How long, Privacy, What PactPal keeps, Who else sees it

### Community 206 - "change-orders.test.ts"
Cohesion: 0.22
Nodes (7): at(), db, ORDERING, proposed(), signature(), SIGNED, signed()

### Community 207 - "council"
Cohesion: 0.22
Nodes (9): title(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, council() (+1 more)

### Community 209 - "draft-routes.test.ts"
Cohesion: 0.32
Nodes (7): councilOf(), db, draftedAs(), idOf(), readDraft(), store, View

### Community 210 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 218 - "buildApp"
Cohesion: 0.09
Nodes (26): buildApp(), closeOnSignals(), EMAIL_LOGO_PATH, requestLog(), socketOrigin(), report, setup(), canonicalRedirect() (+18 more)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1847 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `mcp.ts`, `testId`, `DealPage.tsx`, `when`, `delivery-routes.ts`, `receipt.ts`, `claims/src/index.ts`, `acceptance-routes.ts`, `layouts.tsx`, `db/src/migrate.ts`, `ChangeOrderPanel.tsx`, `DraftPanel.tsx`, `MessagesPage.tsx`, `change-orders.ts`, `vitest`, `scope-drafts.ts`, `appendLedgerEvent`, `council/src/index.ts`, `disputes/task.ts`, `qa/src/index.ts`, `net/src/index.ts`, `eval-judge.ts`, `chat-api.ts`, `scope-draft/src/testing.ts`, `actions.ts`, `scope-draft/src/index.ts`, `stories.test.ts`, `database.ts`, `claim-routes.ts`, `DealsTable.tsx`, `claim-job.ts`, `eval-report.ts`, `db/src/testing.ts`, `templates.ts`, `buildApp`, `chat-routes.ts`, `postgres.ts`, `listing-routes.ts`, `questions.ts`, `ledger/src/index.ts`, `errors.ts`, `Deadlines.tsx`, `PayPalRestClient`, `resend-inbound.ts`, `.query`, `claims/src/check.ts`, `.query`, `completeness.ts`, `DraftReview.tsx`, `validate.ts`, `disputes/test-support.ts`, `emailFrom`, `Insights.tsx`, `instruction-lines.test.ts`, `paypal/src/index.ts`, `council-record.ts`, `useMigratedTestDatabase`, `delivery-check/src/index.ts`, `ai/src/index.ts`, `SellerAppPanel.tsx`, `dispute-sync.ts`, `MessagesPanel.tsx`, `sandbox-respond-report.ts`, `sandbox-webhook-report.ts`, `packet-service.ts`, `render.ts`, `draft-changes.ts`, `Secret`, `auth/sign-in.ts`, `Agents.tsx`, `landing-words.ts`, `devDependencies`, `Ledger.tsx`, `package.json`, `config.ts`, `seller-clients.ts`, `AgentPanel.tsx`, `production-app.ts`, `injection-check.ts`, `checker.ts`, `Closing.tsx`, `email/src/index.ts`, `pages.ts`, `eval-runner.ts`, `design/tokens.ts`, `IntakePanel.tsx`, `ai-check-report.ts`, `change-orders.test.ts`, `draft-routes.test.ts`, `log-labels.test.ts`, `buildApp`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09639953542392567 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `Secret`, `Deadlines.tsx`, `source`, `.query`, `PayPalResult`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `mcp.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Secret` to `testId`, `when`, `delivery-routes.ts`, `claims/src/index.ts`, `Database`, `vitest`, `council/src/index.ts`, `claim-job.ts`, `email/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `ledger/src/index.ts`, `.query`, `PayPalResult`, `question-routes.ts`, `instruction-lines.test.ts`, `paypal/src/index.ts`, `council-record.ts`, `council`, `ai/src/index.ts`, `log-labels.test.ts`, `injection-runner.ts`, `Decisions`, `seller-clients.ts`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `testId` be split into smaller, more focused modules?**
  _Cohesion score 0.055534987041836355 - nodes in this community are weakly interconnected._