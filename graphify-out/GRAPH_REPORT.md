# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 807 files · ~519,076 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6216 nodes · 19771 edges · 222 communities (199 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 553 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9cd18f00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- PayPalRestClient
- testId
- .query
- code-checks.ts
- when
- milestone-routes.ts
- timeline-routes.ts
- receipt.ts
- dispute-sync.ts
- claims/src/index.ts
- actions.ts
- tools.ts
- milestones.ts
- react
- Database
- app.test.ts
- ScopePanel.tsx
- sandbox-check.ts
- deals/routes.ts
- appendLedgerEvent
- postgresContentStore
- vitest
- ChangeOrderPanel.tsx
- delivery-routes.ts
- council/src/index.ts
- disputes/task.ts
- qa/src/index.ts
- net/src/index.ts
- eval-judge.ts
- DealPage.tsx
- scope-draft/src/testing.ts
- seed.ts
- scope-draft/src/index.ts
- callAs
- email/src/index.ts
- packet-service.ts
- layouts.tsx
- claim-job.ts
- eval-report.ts
- chat.ts
- testId
- emailFrom
- paypal-webhook.ts
- chat-routes.ts
- postgres.ts
- listing-routes.ts
- delivery-check-routes.ts
- web/package.json
- ledger/src/index.ts
- partners.ts
- deadline-rows.ts
- production-app.ts
- email/src/index.ts
- dispute-actions.ts
- postStep
- verify
- delivery-check.test.ts
- timeline/src/index.ts
- PayPalResult
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- Deadlines.tsx
- scripts
- db/package.json
- resend.ts
- overview.ts
- draft-routes.ts
- confirmation.ts
- QuestionsPanel.tsx
- claims/package.json
- paypal/src/index.ts
- draft-job.ts
- buildApp
- delivery-check/src/index.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- engine.ts
- SellerAppPanel.tsx
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- devDependencies
- products/package.json
- db/src/index.ts
- ai/package.json
- sandbox-respond-report.ts
- words/src/index.ts
- scripts
- sandbox-clients.ts
- Engineering
- api.ts
- render.ts
- email/package.json
- compilerOptions
- draft-changes.ts
- Agents.tsx
- make_content.py
- scripts
- council/package.json
- auth/sign-in.ts
- notices.ts
- landing-words.ts
- pages.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- TimelineStep
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- config.ts
- compilerOptions
- Build plan
- image.ts
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- IntakePanel.tsx
- check-words.ts
- Audience.tsx
- README.md
- Built (sub-phases 2b to 6h-1)
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
- TimelineEditor.tsx
- Nav.tsx
- log-labels.ts
- .prettierrc.json
- products/tsconfig.json
- Council.tsx
- server/package.json
- docs/tsconfig.json
- Landing.tsx
- eval-scope.ts
- Secret
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- gantt-rows.ts
- story5.ts
- changeOf
- vite-env.d.ts
- src-app-tsx.md
- source
- authAssertion
- design/tokens.ts
- build.js
- Tour.tsx
- PayPal sandbox notes
- Hero.tsx
- Getting started
- brand/package.json
- @pactpal/ai@workspace:*
- log-labels.test.ts
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
- brand/src/index.ts
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- council
- Pillars.tsx
- pg@^8.23.1
- zod@^4.6.7
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- photo-convert.test.ts
- RedisCommands
- build.ts
- @modelcontextprotocol/sdk@1.32.1
- @pactpal/claims@workspace:*
- @pactpal/paypal@workspace:*
- @pactpal/qa@workspace:*
- @pactpal/words@workspace:*
- redis
- ws

## God Nodes (most connected - your core abstractions)
1. `vitest` - 233 edges
2. `Database` - 134 edges
3. `testId()` - 126 edges
4. `readLedger()` - 94 edges
5. `useMigratedTestDatabase()` - 88 edges
6. `sha256Hex()` - 86 edges
7. `react` - 80 edges
8. `appendLedgerEvent()` - 75 edges
9. `isObject()` - 74 edges
10. `TEST_NOW` - 74 edges

## Surprising Connections (you probably didn't know these)
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts

## Import Cycles
- None detected.

## Communities (222 total, 23 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.04
Nodes (75): getMe(), Me, signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute (+67 more)

### Community 1 - "PayPalRestClient"
Cohesion: 0.06
Nodes (42): checkMcp(), PayPalBuyerTestActions, dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY (+34 more)

### Community 2 - "testId"
Cohesion: 0.04
Nodes (91): db, signedPayPal(), signThroughRoutes(), seedContext(), ActionsView, confirmed(), db, disputedDeal() (+83 more)

### Community 3 - ".query"
Cohesion: 0.06
Nodes (59): emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+51 more)

### Community 4 - "code-checks.ts"
Cohesion: 0.27
Nodes (10): codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, CheckedFormat, FORMATS, lineRequirements() (+2 more)

### Community 5 - "when"
Cohesion: 0.06
Nodes (68): analysesUrl(), AppealCheckView, AppealView, checkAppeal(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement (+60 more)

### Community 6 - "milestone-routes.ts"
Cohesion: 0.08
Nodes (43): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money (+35 more)

### Community 7 - "timeline-routes.ts"
Cohesion: 0.12
Nodes (32): Card, DealCards, Notifier, PartyNotice, sendTimelineReminders(), AcceptanceRouteOptions, changeView(), overviewOf() (+24 more)

### Community 8 - "receipt.ts"
Cohesion: 0.12
Nodes (26): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, BRANDED_RECEIPTS_FROM, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks() (+18 more)

### Community 9 - "dispute-sync.ts"
Cohesion: 0.04
Nodes (68): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+60 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (69): parseJsonReply(), AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages() (+61 more)

### Community 11 - "actions.ts"
Cohesion: 0.12
Nodes (34): FILE_NAME_HEADER, AgreementForm, askQuestion(), chat(), dealFromText(), decline(), draftAgreement(), notSignedInWithPayPal() (+26 more)

### Community 12 - "tools.ts"
Cohesion: 0.10
Nodes (30): actingAs(), routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext (+22 more)

### Community 13 - "milestones.ts"
Cohesion: 0.11
Nodes (25): sentStage(), SendDelivery, InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid(), markInvoiceSent() (+17 more)

### Community 14 - "react"
Cohesion: 0.06
Nodes (60): AnswerBox(), Revisions, revisionWords(), addFile(), addPastedChat(), approveDelivery(), CompletenessItem, CompletenessView (+52 more)

### Community 15 - "Database"
Cohesion: 0.05
Nodes (63): McpRouteOptions, AppOptions, SignInOptions, ChatBus, HubOptions, NotificationRouteOptions, NotifierOptions, ReminderDeps (+55 more)

### Community 16 - "app.test.ts"
Cohesion: 0.23
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.11
Nodes (35): DeliverableKind, ProposedRows, FromTheChat(), Suggestion, DueDateField(), EMPTY_LINE, EMPTY_PROVIDE, EMPTY_STAGE (+27 more)

### Community 18 - "sandbox-check.ts"
Cohesion: 0.17
Nodes (15): APP_KEYS, PayPalApp, checkAsSellerApp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+7 more)

### Community 19 - "deals/routes.ts"
Cohesion: 0.06
Nodes (79): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), afterQuery, chatNames() (+71 more)

### Community 20 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (72): AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), DeclineTerms, declineTerms(), declineTermsSchema (+64 more)

### Community 21 - "postgresContentStore"
Cohesion: 0.10
Nodes (30): attachmentHeader(), sendCheckedFile(), sendDownload(), addedByRole(), fileNameFrom(), fileParams, FileRouteOptions, fileRoutes() (+22 more)

### Community 22 - "vitest"
Cohesion: 0.03
Nodes (159): agentDeal(), db, db, SESSION_COOKIE, chatDeal(), db, MessageBody, db (+151 more)

### Community 23 - "ChangeOrderPanel.tsx"
Cohesion: 0.12
Nodes (27): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), getChangeOrders() (+19 more)

### Community 24 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (62): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+54 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (52): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+44 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.12
Nodes (31): publishingBus(), Config, CronStart, runCronJob(), renderWorkflowChecker(), ClientsFor, CouncilTaskWiring, jsonLines() (+23 more)

### Community 27 - "qa/src/index.ts"
Cohesion: 0.07
Nodes (55): attempt(), MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), claimCouncilTask() (+47 more)

### Community 28 - "net/src/index.ts"
Cohesion: 0.05
Nodes (66): checks, ClientOptions, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry() (+58 more)

### Community 29 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 30 - "DealPage.tsx"
Cohesion: 0.05
Nodes (79): checkLedger(), getDeal(), getScope(), ScopeTerms, ScopeView, chatUrl(), ChatView, getChat() (+71 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.07
Nodes (49): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), input (+41 more)

### Community 32 - "seed.ts"
Cohesion: 0.15
Nodes (45): addBuyer(), answerDelivery(), createDeal(), deliver(), upload(), needRef(), seedInputSchema, STORIES (+37 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (83): JsonSchema, claimLines(), ClaimText, linesOf(), allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, CategoryVerdict (+75 more)

### Community 34 - "callAs"
Cohesion: 0.16
Nodes (27): callAs(), idOf(), SeedStepError, sign(), signingPage(), uploadBytes(), userIdOf(), MAYA (+19 more)

### Community 35 - "email/src/index.ts"
Cohesion: 0.08
Nodes (35): EMAIL_LOGO_PATH, emailLogo(), EmailTemplates, loadEmailTemplates(), repoFolder(), templatesDir(), loaded, app (+27 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.04
Nodes (122): buildReceipt(), ReceiptIntegrityError, sendRefusal(), acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend() (+114 more)

### Community 37 - "layouts.tsx"
Cohesion: 0.05
Nodes (83): ag-studio@3.1.0, DealSummary, Money, giveAgLicence(), grid, load(), studio, CommandPalette() (+75 more)

### Community 38 - "claim-job.ts"
Cohesion: 0.28
Nodes (20): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+12 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.10
Nodes (39): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+31 more)

### Community 40 - "chat.ts"
Cohesion: 0.04
Nodes (56): addCard(), disputedDeal(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole (+48 more)

### Community 41 - "testId"
Cohesion: 0.05
Nodes (58): mcpClient(), ToolResult, dealWithBuyer(), db, goodsDeal(), SCOPE, WEBP, db (+50 more)

### Community 42 - "emailFrom"
Cohesion: 0.16
Nodes (27): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+19 more)

### Community 43 - "paypal-webhook.ts"
Cohesion: 0.09
Nodes (20): settingsFor(), SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection (+12 more)

### Community 44 - "chat-routes.ts"
Cohesion: 0.07
Nodes (30): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), LiveHub (+22 more)

### Community 45 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.13
Nodes (21): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, fakeChannel3(), NOW, attributeName(), capped() (+13 more)

### Community 47 - "delivery-check-routes.ts"
Cohesion: 0.12
Nodes (21): checkBody, checkView(), deliveryCheckRoutes(), looks(), LookResult, MAX_LOOKS_PER_CHECK, REFUSALS, askImageModels() (+13 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (50): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+42 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.04
Nodes (100): isPicture(), lookUp(), withReadyDraft(), one(), DISPUTE_EVENT_PREFIX, waitingDraft(), agentBodySha256(), addArtifact() (+92 more)

### Community 50 - "partners.ts"
Cohesion: 0.12
Nodes (15): links, lookupAnswer, MerchantLookup, MerchantStatus, ownerAnswer, PARTNER_FEATURES, PartnerFeature, partnerPath() (+7 more)

### Community 51 - "deadline-rows.ts"
Cohesion: 0.27
Nodes (7): DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines, EVIDENCE_EVENTS, hasEvidence(), other()

### Community 52 - "production-app.ts"
Cohesion: 0.16
Nodes (16): SEED_TASK_NAME, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, DISPUTE_TASK_NAME (+8 more)

### Community 53 - "email/src/index.ts"
Cohesion: 0.07
Nodes (35): createIntakeDeal(), intakeFilename(), NOTICE_LOOK, notificationEmail(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH (+27 more)

### Community 54 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (27): actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+19 more)

### Community 55 - "postStep"
Cohesion: 0.14
Nodes (29): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+21 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check.test.ts"
Cohesion: 0.16
Nodes (13): CheckedFile, IMAGE, LINES, ImageFacts, BPP, chunk(), figure(), filterRows() (+5 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.10
Nodes (34): Deal space (Phase 7), allowedUpdates(), done(), latest(), reviewProgress(), StageFacts, StepState, StepUpdate (+26 more)

### Community 59 - "PayPalResult"
Cohesion: 0.08
Nodes (25): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), DisputeAnswer, DisputeList, EscalateInput, evidenceForm() (+17 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.04
Nodes (62): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+54 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.10
Nodes (29): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, ChatLines(), ChatPane(), HIGHLIGHT (+21 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Deadlines.tsx"
Cohesion: 0.16
Nodes (15): BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, daysBetween(), COLUMNS, Deadlines(), LABELS (+7 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "resend.ts"
Cohesion: 0.13
Nodes (14): RFC-2606, EmailNetworkError, errorAnswer, errorName(), isReservedTestAddress(), reasonFor(), RESEND_EMAILS_URL, RESERVED_DOMAINS (+6 more)

### Community 68 - "overview.ts"
Cohesion: 0.19
Nodes (10): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+2 more)

### Community 69 - "draft-routes.ts"
Cohesion: 0.05
Nodes (62): CHAT_TRANSCRIPT_PREFIX, LiveRouteOptions, DealLookup, featureAnswers(), DeliveryCheckRouteOptions, draftParams, DraftRouteOptions, draftRoutes() (+54 more)

### Community 70 - "confirmation.ts"
Cohesion: 0.27
Nodes (10): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+2 more)

### Community 71 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "paypal/src/index.ts"
Cohesion: 0.05
Nodes (69): buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions(), formatPayTimeout() (+61 more)

### Community 74 - "draft-job.ts"
Cohesion: 0.13
Nodes (22): chosenDraft(), runPrepared(), draftCategories, councilRecordSchema, isUnranked(), toCouncilRecord(), toJson(), usage (+14 more)

### Community 75 - "buildApp"
Cohesion: 0.08
Nodes (25): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), CALLBACK_PATH (+17 more)

### Community 76 - "delivery-check/src/index.ts"
Cohesion: 0.22
Nodes (12): CheckLine, checkableLines(), Mark, CheckedLook, Look, LOOK_VERDICTS, lookSchema, LookVerdict (+4 more)

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
Nodes (35): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, Prepared (+27 more)

### Community 82 - "engine.ts"
Cohesion: 0.20
Nodes (6): DemoProgress, DemoStep, RunOptions, RunSummary, StepResult, DemoRefs

### Community 83 - "SellerAppPanel.tsx"
Cohesion: 0.13
Nodes (19): getSellerApp(), linkSellerApp(), MessageReviewView, MessagesView, SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+11 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "db/src/index.ts"
Cohesion: 0.03
Nodes (122): PayPalWebhookOptions, acceptTermsSchema, ARTIFACT_KINDS, ArtifactRejection, BUYER_MEDIA_TYPES, newArtifactSchema, AcceptChange, acceptChangeSchema (+114 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (83): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+75 more)

### Community 92 - "words/src/index.ts"
Cohesion: 0.19
Nodes (21): emailFor(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy(), ACTIONS (+13 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-clients.ts"
Cohesion: 0.08
Nodes (23): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+15 more)

### Community 95 - "Engineering"
Cohesion: 0.31
Nodes (9): seller(), `acceptances`: signed agreements, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `ledger_entries`: the evidence log, Engineering, candidates(), link() (+1 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (107): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), addBuyer() (+99 more)

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
Cohesion: 0.21
Nodes (12): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+4 more)

### Community 101 - "Agents.tsx"
Cohesion: 0.15
Nodes (15): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+7 more)

### Community 103 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "auth/sign-in.ts"
Cohesion: 0.05
Nodes (66): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), callbackQuery, cookieRules, currentSession() (+58 more)

### Community 106 - "notices.ts"
Cohesion: 0.13
Nodes (23): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+15 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.19
Nodes (19): at(), Closing(), LIMIT_GLYPHS, Tagline(), Dispute(), drift(), AGENT_RUN, CLAIM (+11 more)

### Community 108 - "pages.tsx"
Cohesion: 0.08
Nodes (52): AcceptanceDocument(), AcceptanceDocument, createDeal(), LinkProblem, listDeals(), MilestonesView, redeemLink(), SIGN_IN_PATH (+44 more)

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

### Community 114 - "TimelineStep"
Cohesion: 0.23
Nodes (10): ChangeProposal, ScopeInput, StepView, dated(), DraftedItem, DraftedStep, planFromDraft(), same() (+2 more)

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

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (19): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/static@^10.1.8, @fastify/websocket@^11.3.7, @pactpal/ledger@workspace:*, @pactpal/live@workspace:*, @pactpal/products@workspace:* (+11 more)

### Community 120 - "config.ts"
Cohesion: 0.09
Nodes (27): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+19 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "image.ts"
Cohesion: 0.33
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

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

### Community 129 - "IntakePanel.tsx"
Cohesion: 0.13
Nodes (24): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+16 more)

### Community 130 - "check-words.ts"
Cohesion: 0.31
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

### Community 131 - "Audience.tsx"
Cohesion: 0.33
Nodes (6): Audience(), GLYPHS, SPOTS, Sticker(), NOT_YET, StickerIcon

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (16): outcome(), `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes, `disputes`: PayPal disputes found by checking, Evidence completeness score: computed, not stored (+8 more)

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
Cohesion: 0.11
Nodes (19): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), renderDraftStarter(), RunnerBusyError, sameWorkflowTask() (+11 more)

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

### Community 158 - "TimelineEditor.tsx"
Cohesion: 0.47
Nodes (5): LABEL, OwnFields(), pointedWords(), StepTargets, TimelineEditor()

### Community 159 - "Nav.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

### Community 160 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Council.tsx"
Cohesion: 0.19
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 165 - "server/package.json"
Cohesion: 0.12
Nodes (16): @fastify/helmet@^13.2.0, @pactpal/council@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:*, @pactpal/council, @pactpal/timeline (+8 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "Landing.tsx"
Cohesion: 0.15
Nodes (12): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+4 more)

### Community 168 - "eval-scope.ts"
Cohesion: 0.20
Nodes (14): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), formatErrors(), councilClients() (+6 more)

### Community 169 - "Secret"
Cohesion: 0.06
Nodes (33): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+25 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (18): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+10 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "gantt-rows.ts"
Cohesion: 0.22
Nodes (12): StageView, RunningStepView, addDays(), earlierDay(), laterDay(), doneDay(), GanttLink, GanttRows (+4 more)

### Community 174 - "story5.ts"
Cohesion: 0.40
Nodes (4): updateStep(), LENA, LISTING_URL_FILE, SAM

### Community 175 - "changeOf"
Cohesion: 1.00
Nodes (3): changeOf(), extension(), same()

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "source"
Cohesion: 0.17
Nodes (12): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+4 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 182 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 186 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 190 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

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

### Community 206 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 209 - "council"
Cohesion: 0.22
Nodes (9): title(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, council() (+1 more)

### Community 210 - "Pillars.tsx"
Cohesion: 0.24
Nodes (12): Agent(), at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed() (+4 more)

### Community 217 - "photo-convert.test.ts"
Cohesion: 0.43
Nodes (4): sharp@0.35.5, MAX_PHOTO_SIDE, toJpeg(), sharp

### Community 220 - "build.ts"
Cohesion: 0.20
Nodes (9): css, dist, faces, FONTS, home, problems, root, PAGES (+1 more)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1842 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `PayPalRestClient`, `testId`, `milestone-routes.ts`, `receipt.ts`, `dispute-sync.ts`, `actions.ts`, `milestones.ts`, `react`, `app.test.ts`, `ScopePanel.tsx`, `sandbox-check.ts`, `appendLedgerEvent`, `delivery-routes.ts`, `council/src/index.ts`, `disputes/task.ts`, `qa/src/index.ts`, `net/src/index.ts`, `DealPage.tsx`, `scope-draft/src/testing.ts`, `scope-draft/src/index.ts`, `email/src/index.ts`, `packet-service.ts`, `layouts.tsx`, `eval-report.ts`, `chat.ts`, `testId`, `emailFrom`, `paypal-webhook.ts`, `chat-routes.ts`, `postgres.ts`, `listing-routes.ts`, `ledger/src/index.ts`, `partners.ts`, `deadline-rows.ts`, `email/src/index.ts`, `dispute-actions.ts`, `postStep`, `delivery-check.test.ts`, `timeline/src/index.ts`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `Deadlines.tsx`, `resend.ts`, `overview.ts`, `confirmation.ts`, `paypal/src/index.ts`, `buildApp`, `ai/src/index.ts`, `engine.ts`, `SellerAppPanel.tsx`, `db/src/index.ts`, `sandbox-respond-report.ts`, `words/src/index.ts`, `sandbox-clients.ts`, `render.ts`, `draft-changes.ts`, `Agents.tsx`, `auth/sign-in.ts`, `landing-words.ts`, `pages.tsx`, `devDependencies`, `TimelineStep`, `Ledger.tsx`, `package.json`, `config.ts`, `IntakePanel.tsx`, `check-words.ts`, `checker.ts`, `Nav.tsx`, `Secret`, `pages.ts`, `gantt-rows.ts`, `authAssertion`, `design/tokens.ts`, `log-labels.test.ts`, `photo-convert.test.ts`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.04381443298969072 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `Deadlines.tsx`, `README.md`, `source`, `timeline/src/index.ts`, `PayPalResult`, `Engineering`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `PayPalRestClient` be split into smaller, more focused modules?**
  _Cohesion score 0.060455486542443065 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `App.tsx`, `IntakePanel.tsx`, `Audience.tsx`, `when`, `ScopePanel.tsx`, `ChangeOrderPanel.tsx`, `DealPage.tsx`, `Nav.tsx`, `Council.tsx`, `layouts.tsx`, `Landing.tsx`, `web/package.json`, `postStep`, `Tour.tsx`, `Hero.tsx`, `DraftReview.tsx`, `Deadlines.tsx`, `QuestionsPanel.tsx`, `brand/src/index.ts`, `Pillars.tsx`, `SellerAppPanel.tsx`, `api.ts`, `Agents.tsx`, `landing-words.ts`, `pages.tsx`, `Ledger.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `testId` be split into smaller, more focused modules?**
  _Cohesion score 0.036840554081933395 - nodes in this community are weakly interconnected._