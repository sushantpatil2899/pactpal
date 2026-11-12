# Graph Report - paypal-hackathon  (2026-11-12)

## Corpus Check
- 810 files · ~520,996 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6232 nodes · 19861 edges · 216 communities (190 shown, 26 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 554 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe27016e`
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
- readLedger
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
- appendLedgerEvent
- dispute-routes.ts
- vitest
- scope-drafts.ts
- actions.ts
- council/src/index.ts
- disputes/task.ts
- qa/src/index.ts
- net/src/index.ts
- eval-judge.ts
- chat-state.ts
- scope-draft/src/testing.ts
- story-steps.ts
- scope-draft/src/index.ts
- seed.ts
- callAs
- claim-routes.ts
- DealsTable.tsx
- claim-job.ts
- eval-report.ts
- claim-analyses.ts
- db/src/testing.ts
- email/src/index.ts
- buildApp
- chat-routes.ts
- postgres.ts
- listing-routes.ts
- ledger-store.ts
- web/package.json
- ledger/src/index.ts
- paypal/src/index.ts
- deadline-rows.ts
- book.ts
- resend-inbound.ts
- retention.test.ts
- postStep
- verify
- AcceptancePanel.tsx
- .query
- PayPalResult
- completeness.ts
- vitest
- DraftReview.tsx
- services
- Deadlines.tsx
- scripts
- db/package.json
- disputes/test-support.ts
- readChecked
- question-routes.ts
- Insights.tsx
- chat-api.ts
- claims/package.json
- invoices.ts
- draft-job.ts
- live/src/index.ts
- delivery-check/src/index.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- SellerAppPanel.tsx
- appeal-items.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- devDependencies
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
- chain-scene.ts
- make_content.py
- scripts
- council/package.json
- auth/sign-in.ts
- dispute-notices.ts
- react
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
- dependencies
- config.ts
- compilerOptions
- Build plan
- packets.ts
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- AgentPanel.tsx
- liveLinkForAccount
- scripts
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
- @fastify/cookie
- Closing.tsx
- @fastify/helmet
- .prettierrc.json
- products/tsconfig.json
- Tour.tsx
- server/package.json
- docs/tsconfig.json
- @fastify/static
- runtime.ts
- Secret
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- gantt-rows.ts
- @pactpal/email@workspace:*
- eval-runner.ts
- vite-env.d.ts
- src-app-tsx.md
- @pactpal/qa@workspace:*
- app-link-routes.ts
- brand/src/index.ts
- @pactpal/words@workspace:*
- build.js
- @fiddle-digital/string-tune
- PayPal sandbox notes
- simple-icons
- Getting started
- brand/package.json
- @pactpal/ai@workspace:*
- request-routes.ts
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
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- pg@^8.23.1
- zod@^4.6.7
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- listing-routes.ts
- buildApp
- RedisCommands
- @fastify/websocket
- @pactpal/council@workspace:*
- @pactpal/scope-draft@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 235 edges
2. `Database` - 135 edges
3. `testId()` - 127 edges
4. `readLedger()` - 94 edges
5. `useMigratedTestDatabase()` - 90 edges
6. `sha256Hex()` - 86 edges
7. `react` - 80 edges
8. `TEST_NOW` - 76 edges
9. `appendLedgerEvent()` - 75 edges
10. `isObject()` - 74 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (216 total, 26 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.10
Nodes (36): signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage, DisputePage (+28 more)

### Community 1 - "mcp.ts"
Cohesion: 0.08
Nodes (34): APP_KEYS, PayPalApp, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS (+26 more)

### Community 2 - "testId"
Cohesion: 0.05
Nodes (67): agentDeal(), db, mcpClient(), ToolResult, db, db, invoiceEntries(), signedDeal() (+59 more)

### Community 3 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (35): ACCEPTANCE_DOCUMENT_FORMAT, AcceptanceDocument, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money, acceptBody (+27 more)

### Community 4 - "DealPage.tsx"
Cohesion: 0.09
Nodes (40): checkLedger(), getDeal(), getMe(), LedgerCheck, ScopeTerms, ScopeView, getTimeline(), isRunningStep() (+32 more)

### Community 5 - "when"
Cohesion: 0.05
Nodes (79): AppealCheckView, AppealView, buildPacket(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView (+71 more)

### Community 6 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (55): chatNames(), accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer() (+47 more)

### Community 7 - "readLedger"
Cohesion: 0.05
Nodes (40): addCard(), types(), entriesOf(), disputeTypes(), payments(), ARTIFACT_LIMITS, ArtifactLimits, NewArtifact (+32 more)

### Community 8 - "receipt.ts"
Cohesion: 0.12
Nodes (31): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+23 more)

### Community 9 - "db/src/index.ts"
Cohesion: 0.02
Nodes (142): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestRefusal, AgentRequestStatus, claimAgentRequest(), createAgentRequest(), getAgentRequest() (+134 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.05
Nodes (91): Prepared, parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages() (+83 more)

### Community 11 - "acceptance-routes.ts"
Cohesion: 0.05
Nodes (85): ACCEPTANCE_NOTICE_VERSION, buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent() (+77 more)

### Community 12 - "tools.ts"
Cohesion: 0.09
Nodes (32): actingAs(), routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext (+24 more)

### Community 13 - "layouts.tsx"
Cohesion: 0.11
Nodes (32): Me, isOpen(), Avatar(), Icon(), IconName, PATHS, Logo(), applyTheme() (+24 more)

### Community 14 - "DeliveriesPanel.tsx"
Cohesion: 0.13
Nodes (31): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+23 more)

### Community 15 - "Database"
Cohesion: 0.05
Nodes (59): ReceiptMailDeps, McpRouteOptions, AppOptions, EMAIL_LOGO_PATH, SignInOptions, ChatBus, Card, DealCards (+51 more)

### Community 16 - "db/src/migrate.ts"
Cohesion: 0.23
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 17 - "ChangeOrderPanel.tsx"
Cohesion: 0.06
Nodes (71): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+63 more)

### Community 18 - "DraftPanel.tsx"
Cohesion: 0.10
Nodes (30): addFile(), addPastedChat(), DealFile, draftFrom(), draftsUrl(), DraftView, fileUrl(), getDraftById() (+22 more)

### Community 19 - "MessagesPage.tsx"
Cohesion: 0.13
Nodes (26): useWide(), Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People() (+18 more)

### Community 20 - "appendLedgerEvent"
Cohesion: 0.02
Nodes (164): `change_orders`: changes to a signed agreement, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema (+156 more)

### Community 21 - "dispute-routes.ts"
Cohesion: 0.39
Nodes (8): checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputePageView(), disputeSummaryView(), listArtifacts(), listDealDisputes()

### Community 22 - "vitest"
Cohesion: 0.04
Nodes (103): chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal() (+95 more)

### Community 23 - "scope-drafts.ts"
Cohesion: 0.11
Nodes (26): checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow, DraftStateError (+18 more)

### Community 24 - "actions.ts"
Cohesion: 0.14
Nodes (23): FILE_NAME_HEADER, dealFromText(), idOf(), notSignedInWithPayPal(), paidOrInstruction(), saveAgreement(), SEED_AGENT, SeedContext (+15 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.07
Nodes (54): `claim_analyses`: council comparisons of a dispute claim with the record, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+46 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.07
Nodes (55): listeners(), postgresBus(), publishingBus(), CronStart, runCronJob(), SEED_TASK_NAME, inProcessChecker(), renderWorkflowChecker() (+47 more)

### Community 27 - "qa/src/index.ts"
Cohesion: 0.07
Nodes (57): MessageJob, checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM (+49 more)

### Community 28 - "net/src/index.ts"
Cohesion: 0.06
Nodes (52): connectSandboxApp(), linkedClients(), ClientOptions, ResendOptions, HttpDeps, RetryPolicy, Call, item (+44 more)

### Community 29 - "eval-judge.ts"
Cohesion: 0.12
Nodes (29): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+21 more)

### Community 30 - "chat-state.ts"
Cohesion: 0.17
Nodes (18): getChat(), liveUrl(), ChatAction, chatReducer(), ChatState, Connection, initialChat, lastSeq() (+10 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (45): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), input, numbered (+37 more)

### Community 32 - "story-steps.ts"
Cohesion: 0.16
Nodes (44): addBuyer(), answerDelivery(), createDeal(), deliver(), upload(), needRef(), agreement(), CHRIS (+36 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (87): JsonSchema, ClaimText, linesOf(), RankingPromptInput, allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, CategoryVerdict (+79 more)

### Community 34 - "seed.ts"
Cohesion: 0.18
Nodes (9): DemoProgress, DemoStep, RunOptions, runStory(), RunSummary, StepResult, seedInputSchema, STORIES (+1 more)

### Community 35 - "callAs"
Cohesion: 0.19
Nodes (23): callAs(), SeedStepError, sign(), signingPage(), MAYA, NORA, story6Steps(), text() (+15 more)

### Community 36 - "claim-routes.ts"
Cohesion: 0.04
Nodes (99): sendRefusal(), acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf() (+91 more)

### Community 37 - "DealsTable.tsx"
Cohesion: 0.10
Nodes (36): DealSummary, Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT (+28 more)

### Community 38 - "claim-job.ts"
Cohesion: 0.25
Nodes (21): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+13 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "claim-analyses.ts"
Cohesion: 0.15
Nodes (14): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+6 more)

### Community 41 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (77): db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, Conversation, db (+69 more)

### Community 42 - "email/src/index.ts"
Cohesion: 0.07
Nodes (64): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+56 more)

### Community 43 - "buildApp"
Cohesion: 0.09
Nodes (22): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+14 more)

### Community 44 - "chat-routes.ts"
Cohesion: 0.09
Nodes (13): BusSignal, Listen, memoryBus(), db, hubOnTestDeal(), messageView(), LiveHub, LivePage (+5 more)

### Community 45 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.12
Nodes (22): BASE, LISTING, Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, ProductLookup, attributeName() (+14 more)

### Community 47 - "ledger-store.ts"
Cohesion: 0.12
Nodes (19): ARTIFACT_KINDS, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed(), assertRoom(), BUYER_MEDIA_TYPES (+11 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (44): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+36 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.11
Nodes (35): lookUp(), one(), agentBodySha256(), mediaTypeOf(), FinishClaimAnalysis, ContentMismatchError, contentRow, db (+27 more)

### Community 50 - "paypal/src/index.ts"
Cohesion: 0.05
Nodes (56): dollar, setup(), MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer, page() (+48 more)

### Community 51 - "deadline-rows.ts"
Cohesion: 0.19
Nodes (17): getDisputePage(), addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows() (+9 more)

### Community 52 - "book.ts"
Cohesion: 0.17
Nodes (19): AgreementForm, askQuestion(), chat(), decline(), draftAgreement(), agreementStep(), aiDraftStep(), BookDeal (+11 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.12
Nodes (25): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+17 more)

### Community 54 - "retention.test.ts"
Cohesion: 0.05
Nodes (51): db, disputedDeal(), FILES, GOOD, SummariesView, `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), AnalysisNotAllowedError (+43 more)

### Community 55 - "postStep"
Cohesion: 0.14
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+23 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "AcceptancePanel.tsx"
Cohesion: 0.21
Nodes (17): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+9 more)

### Community 58 - ".query"
Cohesion: 0.05
Nodes (95): sendTimelineReminders(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), DealOverview, dealOverview(), DealStage (+87 more)

### Community 59 - "PayPalResult"
Cohesion: 0.06
Nodes (39): send(), Settler, SettleResult, `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect() (+31 more)

### Community 60 - "completeness.ts"
Cohesion: 0.10
Nodes (28): DealDocuments, EventType, LedgerEntry, Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts (+20 more)

### Community 61 - "vitest"
Cohesion: 0.07
Nodes (39): CheckView, db, FAILED, model(), shown, store, db, isRanking() (+31 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (39): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, ScopeInput, ChatLines() (+31 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Deadlines.tsx"
Cohesion: 0.17
Nodes (11): BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, COLUMNS, DealGantt(), LOCKED, presetFor() (+3 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "disputes/test-support.ts"
Cohesion: 0.05
Nodes (71): db, db, ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+63 more)

### Community 68 - "readChecked"
Cohesion: 0.21
Nodes (17): addBuyer(), checkPayments(), errorMessage(), getMilestones(), isMilestones(), makeBuyerLink(), milestonesUrl(), MilestonesView (+9 more)

### Community 69 - "question-routes.ts"
Cohesion: 0.04
Nodes (81): CHAT_TRANSCRIPT_PREFIX, DealLookup, featureAnswers(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), looks() (+73 more)

### Community 70 - "Insights.tsx"
Cohesion: 0.13
Nodes (20): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+12 more)

### Community 71 - "chat-api.ts"
Cohesion: 0.18
Nodes (17): chatUrl(), ChatView, getPastedChats(), isChat(), isMessage(), isPasted(), NotificationView, PastedChat (+9 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "invoices.ts"
Cohesion: 0.06
Nodes (43): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+35 more)

### Community 74 - "draft-job.ts"
Cohesion: 0.10
Nodes (26): councilRecordOf(), chosenDraft(), runPrepared(), draftCategories, CouncilRecord, councilRecordSchema, isUnranked(), two (+18 more)

### Community 75 - "live/src/index.ts"
Cohesion: 0.23
Nodes (14): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+6 more)

### Community 76 - "delivery-check/src/index.ts"
Cohesion: 0.05
Nodes (61): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, receiptFormatAt(), document, signed(), SIGNED_AT, signedPayload(), factsWords() (+53 more)

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
Cohesion: 0.11
Nodes (29): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, candidates() (+21 more)

### Community 82 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 83 - "appeal-items.ts"
Cohesion: 0.13
Nodes (17): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+9 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.18
Nodes (5): ChainScene, ease(), faceTexture(), slot(), window01()

### Community 87 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (82): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+74 more)

### Community 92 - "notices.ts"
Cohesion: 0.19
Nodes (21): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+13 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "packet-service.ts"
Cohesion: 0.10
Nodes (39): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+31 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (93): AgentRequestsPanel(), AgentRequestView, analysesUrl(), answerAgentRequest(), answerBuyerQuestion(), AnswerOptionView, askAboutAgreement(), askSellerInstead() (+85 more)

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

### Community 101 - "chain-scene.ts"
Cohesion: 0.18
Nodes (10): three@0.181.0, ACCENT, ACCENT_2, AI, Block, DEALS, EVENTS, FORGE (+2 more)

### Community 103 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "auth/sign-in.ts"
Cohesion: 0.09
Nodes (38): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+30 more)

### Community 106 - "dispute-notices.ts"
Cohesion: 0.20
Nodes (9): DisputeEntry, DisputeNotice, entryRow, NewDisputeNotice, newNoticeSchema, NOTICE_KINDS, noticeKeysTaken(), NoticeKind (+1 more)

### Community 107 - "react"
Cohesion: 0.04
Nodes (72): BrandLogo(), BrandName, LOGOS, BUILD, Gate, sceneOf(), SEND, Agents() (+64 more)

### Community 108 - "pages.tsx"
Cohesion: 0.12
Nodes (41): createDeal(), isDeal(), listDeals(), redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), NewDealPage() (+33 more)

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
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, wordingProblems()

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
Nodes (10): Agents (Phase 8), AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product (+2 more)

### Community 119 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fastify@^5.12.7, @modelcontextprotocol/sdk@1.32.1, @pactpal/claims@workspace:*, @pactpal/db@workspace:*, @pactpal/ledger@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:* (+9 more)

### Community 120 - "config.ts"
Cohesion: 0.09
Nodes (32): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, ConfigReport (+24 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "packets.ts"
Cohesion: 0.25
Nodes (7): EvidencePacket, newPacketSchema, PacketExhibit, packetExhibitSchema, PacketRefusal, packetRow, sha256

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
Cohesion: 0.12
Nodes (22): dependencies, @fontsource/instrument-serif@5.3.0, @fontsource-variable/geist@5.3.0, @fontsource-variable/geist-mono@5.3.0, marked@18.1.1, mermaid@12.2.0, @pactpal/brand@workspace:*, devDependencies (+14 more)

### Community 129 - "AgentPanel.tsx"
Cohesion: 0.28
Nodes (11): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+3 more)

### Community 131 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, build, typecheck

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.05
Nodes (49): review(), paid(), seller(), LedgerEntryView, title(), draft(), unchanged(), deliveryLabel() (+41 more)

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
Cohesion: 0.12
Nodes (15): BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), renderDraftStarter(), RunnerBusyError, SCHEDULE_WINDOW_MS, startRun() (+7 more)

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

### Community 159 - "Closing.tsx"
Cohesion: 0.14
Nodes (21): LogoMark(), at(), Closing(), LIMIT_GLYPHS, Tagline(), LegalPage(), PAGES, Chevron() (+13 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Tour.tsx"
Cohesion: 0.09
Nodes (16): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+8 more)

### Community 165 - "server/package.json"
Cohesion: 0.13
Nodes (14): @pactpal/live@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/timeline, @pactpal/watcher (+6 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 168 - "runtime.ts"
Cohesion: 0.20
Nodes (14): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), MAX_CONCURRENT_COUNCILS, clients (+6 more)

### Community 169 - "Secret"
Cohesion: 0.04
Nodes (67): RFC-2606, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+59 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.17
Nodes (19): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+11 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "gantt-rows.ts"
Cohesion: 0.21
Nodes (9): StageView, StepView, RunningStepView, doneDay(), GanttLink, ganttRows(), GanttTask, noteFor() (+1 more)

### Community 175 - "eval-runner.ts"
Cohesion: 0.11
Nodes (24): councilDeps(), isRankingRequest(), alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord (+16 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "app-link-routes.ts"
Cohesion: 0.21
Nodes (14): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+6 more)

### Community 180 - "brand/src/index.ts"
Cohesion: 0.14
Nodes (20): applyTokens(), root, MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint (+12 more)

### Community 182 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 191 - "request-routes.ts"
Cohesion: 0.23
Nodes (11): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), requirePayPalUser(), AgentRequest (+3 more)

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

### Community 217 - "listing-routes.ts"
Cohesion: 0.29
Nodes (8): sharp@0.35.5, isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), detectMediaType(), sharp

### Community 218 - "buildApp"
Cohesion: 0.11
Nodes (17): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+9 more)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1846 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `mcp.ts`, `testId`, `DealPage.tsx`, `when`, `delivery-routes.ts`, `readLedger`, `receipt.ts`, `db/src/index.ts`, `claims/src/index.ts`, `layouts.tsx`, `db/src/migrate.ts`, `ChangeOrderPanel.tsx`, `DraftPanel.tsx`, `MessagesPage.tsx`, `appendLedgerEvent`, `vitest`, `scope-drafts.ts`, `actions.ts`, `council/src/index.ts`, `disputes/task.ts`, `qa/src/index.ts`, `net/src/index.ts`, `eval-judge.ts`, `chat-state.ts`, `scope-draft/src/testing.ts`, `scope-draft/src/index.ts`, `seed.ts`, `DealsTable.tsx`, `eval-report.ts`, `db/src/testing.ts`, `email/src/index.ts`, `buildApp`, `chat-routes.ts`, `postgres.ts`, `listing-routes.ts`, `ledger/src/index.ts`, `paypal/src/index.ts`, `deadline-rows.ts`, `resend-inbound.ts`, `retention.test.ts`, `postStep`, `.query`, `completeness.ts`, `DraftReview.tsx`, `Deadlines.tsx`, `disputes/test-support.ts`, `question-routes.ts`, `Insights.tsx`, `invoices.ts`, `draft-job.ts`, `live/src/index.ts`, `delivery-check/src/index.ts`, `ai/src/index.ts`, `SellerAppPanel.tsx`, `appeal-items.ts`, `MessagesPanel.tsx`, `sandbox-respond-report.ts`, `sandbox-webhook-report.ts`, `packet-service.ts`, `api.ts`, `render.ts`, `draft-changes.ts`, `auth/sign-in.ts`, `react`, `devDependencies`, `Ledger.tsx`, `package.json`, `config.ts`, `AgentPanel.tsx`, `Built (sub-phases 2b to 6h-1)`, `checker.ts`, `Closing.tsx`, `Secret`, `pages.ts`, `gantt-rows.ts`, `eval-runner.ts`, `brand/src/index.ts`, `listing-routes.ts`, `buildApp`, `RedisCommands`?**
  _High betweenness centrality (0.229) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09639953542392567 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `Deadlines.tsx`, `README.md`, `invoices.ts`, `retention.test.ts`, `.query`, `PayPalResult`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `mcp.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07918367346938776 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `App.tsx`, `AgentPanel.tsx`, `DealPage.tsx`, `when`, `receipt.ts`, `layouts.tsx`, `DeliveriesPanel.tsx`, `ChangeOrderPanel.tsx`, `DraftPanel.tsx`, `MessagesPage.tsx`, `chat-state.ts`, `Closing.tsx`, `Tour.tsx`, `DealsTable.tsx`, `web/package.json`, `deadline-rows.ts`, `brand/src/index.ts`, `postStep`, `AcceptancePanel.tsx`, `DraftReview.tsx`, `Deadlines.tsx`, `readChecked`, `Insights.tsx`, `chat-api.ts`, `SellerAppPanel.tsx`, `MessagesPanel.tsx`, `api.ts`, `pages.tsx`, `Ledger.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `testId` be split into smaller, more focused modules?**
  _Cohesion score 0.04957983193277311 - nodes in this community are weakly interconnected._