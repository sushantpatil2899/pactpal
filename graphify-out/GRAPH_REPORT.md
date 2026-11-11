# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 807 files · ~518,887 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6215 nodes · 19767 edges · 229 communities (206 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 552 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5e7a3699`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- errors.ts
- testId
- timeline-routes.ts
- DeliverPanel.tsx
- when
- deals/routes.ts
- scope.ts
- receipt.ts
- dispute-sync.ts
- claims/src/index.ts
- Secret
- tools.ts
- milestones.ts
- DraftPanel.tsx
- Database
- app.test.ts
- ScopePanel.tsx
- AccessTokenProvider
- access.ts
- questions.ts
- postgresContentStore
- test-app.ts
- acceptance-routes.ts
- .query
- council/src/index.ts
- disputes/task.ts
- claims/src/check.ts
- net/src/index.ts
- schema.ts
- DealPage.tsx
- scope-draft/src/testing.ts
- actions.ts
- scope-draft/src/index.ts
- action-routes.ts
- email/src/index.ts
- packet-service.ts
- layouts.tsx
- claim-job.ts
- eval-report.ts
- db/src/index.ts
- db/src/testing.ts
- emailFrom
- paypal-webhook.ts
- chat-routes.ts
- postgres.ts
- listing-routes.ts
- milestone-routes.ts
- web/package.json
- ledger/src/index.ts
- validate.ts
- gantt-rows.ts
- claims/src/check.ts
- htmlToText
- dispute-actions.ts
- postStep
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- PayPalResult
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- Deadlines.tsx
- scripts
- db/package.json
- appeal-items.ts
- Insights.tsx
- draft-routes.ts
- council-record.ts
- readLedger
- claims/package.json
- paypal/src/index.ts
- eval-runner.ts
- app.ts
- scope-drafts.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- app-link-routes.test.ts
- MessagesPanel.tsx
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- devDependencies
- products/package.json
- deals.ts
- ai/package.json
- sandbox-respond-report.ts
- words/src/index.ts
- scripts
- sandbox-clients.ts
- seller-connections.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- qa/src/index.ts
- Agents.tsx
- make_content.py
- scripts
- council/package.json
- agent-requests.ts
- notices.ts
- landing-words.ts
- PaymentsPanel.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- claim-routes.ts
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- config.ts
- compilerOptions
- Build plan
- pdf/package.json
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- IntakePanel.tsx
- TEST_NOW
- vitest
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
- task.test.ts
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
- appeal.test.ts
- change-orders.ts
- vite-env.d.ts
- src-app-tsx.md
- Phase 7 (deal space)
- retention.test.ts
- design/tokens.ts
- Layout
- build.js
- Tour.tsx
- PayPal sandbox notes
- pdf/src/index.ts
- Hero.tsx
- Getting started
- brand/package.json
- @pactpal/ai@workspace:*
- log-labels.test.ts
- receipt.test.ts
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
- runner.test.ts
- src/draft-source.ts
- pg@^8.23.1
- zod@^4.6.7
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- photo-convert.test.ts
- source
- RedisCommands
- build.ts
- @modelcontextprotocol/sdk@1.32.1
- useScrollStory.ts
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
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (229 total, 23 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.05
Nodes (93): createDeal(), isDeal(), listDeals(), redeemLink(), SIGN_IN_PATH, signOut(), App(), Dashboard() (+85 more)

### Community 1 - "errors.ts"
Cohesion: 0.06
Nodes (35): dollar, setup(), McpFallback, reasonOf(), PayPalInvoices, route(), draft, invoiceBody (+27 more)

### Community 2 - "testId"
Cohesion: 0.05
Nodes (60): db, ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer (+52 more)

### Community 3 - "timeline-routes.ts"
Cohesion: 0.09
Nodes (53): sendTimelineReminders(), acceptBody, changeOrderRoutes(), view(), waitingChange(), changeParams, changeView(), declineBody (+45 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.13
Nodes (29): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+21 more)

### Community 5 - "when"
Cohesion: 0.08
Nodes (59): analysesUrl(), buildPacket(), checkDisputes(), compareClaim(), CouncilView, disputesUrl(), DisputesView, draftSummary() (+51 more)

### Community 6 - "deals/routes.ts"
Cohesion: 0.06
Nodes (68): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, notificationRoutes() (+60 more)

### Community 7 - "scope.ts"
Cohesion: 0.06
Nodes (34): `change_orders`: changes to a signed agreement, at(), db, ORDERING, proposed(), SIGNED, BASE, LISTING (+26 more)

### Community 8 - "receipt.ts"
Cohesion: 0.13
Nodes (20): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), ChangeAnswer, changeProposedEmail() (+12 more)

### Community 9 - "dispute-sync.ts"
Cohesion: 0.07
Nodes (44): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+36 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (72): AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+64 more)

### Community 11 - "Secret"
Cohesion: 0.15
Nodes (16): checkMcp(), PayPalMcpError, noAnswer(), setupError(), describe(), McpClientOptions, McpTransportFactory, PayPalMcpClient (+8 more)

### Community 12 - "tools.ts"
Cohesion: 0.07
Nodes (51): actingAs(), routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext (+43 more)

### Community 13 - "milestones.ts"
Cohesion: 0.10
Nodes (30): DEAL_STATUSES, DealNotFoundError, dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema (+22 more)

### Community 14 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (41): addFile(), addPastedChat(), DealFile, draftsUrl(), fileUrl(), getDraftById(), getScope(), isFile() (+33 more)

### Community 15 - "Database"
Cohesion: 0.05
Nodes (56): McpRouteOptions, AppOptions, ChatBus, Card, DealCards, ChatRouteOptions, HubOptions, listQuery (+48 more)

### Community 16 - "app.test.ts"
Cohesion: 0.23
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (75): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+67 more)

### Community 18 - "AccessTokenProvider"
Cohesion: 0.08
Nodes (29): APP_KEYS, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+21 more)

### Community 19 - "access.ts"
Cohesion: 0.11
Nodes (22): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), dealAccess(), visibleDeal() (+14 more)

### Community 20 - "questions.ts"
Cohesion: 0.06
Nodes (39): namedQuestion(), result, webDir, failRunningMessageReviews(), AiAnswer, aiAnswerSchema, AnswerQuestion, answerQuestion() (+31 more)

### Community 21 - "postgresContentStore"
Cohesion: 0.11
Nodes (30): afterQuery, chatRoutes(), messageView(), postBody, REFUSALS, addedByRole(), fileNameFrom(), fileParams (+22 more)

### Community 22 - "test-app.ts"
Cohesion: 0.05
Nodes (75): chatDeal(), db, MessageBody, councilRecordOf(), Card, db, savedDeal(), send() (+67 more)

### Community 23 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (28): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload (+20 more)

### Community 24 - ".query"
Cohesion: 0.06
Nodes (82): originOf(), recordReceiptSent(), answerAgentRequest(), createAgentRequest(), finishAgentRequest(), lockedRequest(), acceptChangeOrder(), answer() (+74 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (44): JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+36 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.09
Nodes (38): publishingBus(), Config, CronStart, runCronJob(), SEED_TASK_NAME, renderClaimRunner(), renderDraftStarter(), renderWorkflowChecker() (+30 more)

### Community 27 - "claims/src/check.ts"
Cohesion: 0.12
Nodes (36): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+28 more)

### Community 28 - "net/src/index.ts"
Cohesion: 0.05
Nodes (48): defaultHttpDeps, fakeNetwork(), policy, Step, urlOf(), DEFAULT_RETRY_POLICY, Call, item (+40 more)

### Community 29 - "schema.ts"
Cohesion: 0.08
Nodes (34): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict (+26 more)

### Community 30 - "DealPage.tsx"
Cohesion: 0.05
Nodes (83): checkLedger(), getDeal(), getMe(), LedgerCheck, LedgerEntryView, ScopeTerms, ScopeView, chatUrl() (+75 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (35): two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), answerRecord() (+27 more)

### Community 32 - "actions.ts"
Cohesion: 0.06
Nodes (117): RouteAnswer, FILE_NAME_HEADER, addBuyer(), AgreementForm, answerDelivery(), askQuestion(), callAs(), chat() (+109 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (46): claimLines(), linesOf(), BLOCKED_CATEGORIES, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input (+38 more)

### Community 34 - "action-routes.ts"
Cohesion: 0.11
Nodes (34): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+26 more)

### Community 35 - "email/src/index.ts"
Cohesion: 0.07
Nodes (43): EMAIL_LOGO_PATH, NOTICE_LOOK, notificationEmail(), emailLogo(), EmailTemplates, loadEmailTemplates(), repoFolder(), templatesDir() (+35 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.11
Nodes (38): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+30 more)

### Community 37 - "layouts.tsx"
Cohesion: 0.05
Nodes (79): Me, Money, CommandPalette(), PLACES, Cell, COLUMNS, EXPORT, SIDE_BAR (+71 more)

### Community 38 - "claim-job.ts"
Cohesion: 0.27
Nodes (20): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+12 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "db/src/index.ts"
Cohesion: 0.03
Nodes (110): body, ChatIntegrityError, ChatMessage, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), CHAT_CHANNEL (+102 more)

### Community 41 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (65): agentDeal(), db, mcpClient(), ToolResult, Conversation, db, db, goodsDeal() (+57 more)

### Community 42 - "emailFrom"
Cohesion: 0.17
Nodes (25): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+17 more)

### Community 43 - "paypal-webhook.ts"
Cohesion: 0.06
Nodes (29): blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""], workflowSection (+21 more)

### Community 44 - "chat-routes.ts"
Cohesion: 0.06
Nodes (37): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal() (+29 more)

### Community 45 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.13
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 47 - "milestone-routes.ts"
Cohesion: 0.12
Nodes (28): milestoneRoutes(), emailInvoice(), sellerApp(), paypalProblem(), sendBody, SendOutcome, sendToPayPal(), stageParams (+20 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (46): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+38 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (70): isPicture(), one(), DISPUTE_EVENT_PREFIX, agentBodySha256(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactKind, ArtifactLimits (+62 more)

### Community 50 - "validate.ts"
Cohesion: 0.09
Nodes (36): allowedCategoryIds(), BLOCKED_IDS, CategoryVerdict, UNCLEAR_CATEGORY, paymentFromShare(), Share, shareOf(), sharesIn() (+28 more)

### Community 51 - "gantt-rows.ts"
Cohesion: 0.20
Nodes (16): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+8 more)

### Community 52 - "claims/src/check.ts"
Cohesion: 0.09
Nodes (31): checkAnalysis(), ClaimAnalysis, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, AGREEMENT, CLAIM (+23 more)

### Community 53 - "htmlToText"
Cohesion: 0.50
Nodes (3): ENTITIES, entity(), htmlToText()

### Community 54 - "dispute-actions.ts"
Cohesion: 0.10
Nodes (25): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+17 more)

### Community 55 - "postStep"
Cohesion: 0.13
Nodes (32): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+24 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (50): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile, CheckLine (+42 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (45): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+37 more)

### Community 59 - "PayPalResult"
Cohesion: 0.08
Nodes (25): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, 1. Architecture and structure, answered(), DisputeAnswer, DisputeList, EscalateInput (+17 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.06
Nodes (47): councilDeps(), isRankingRequest(), CheckView, db, FAILED, model(), shown, store (+39 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (38): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+30 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Deadlines.tsx"
Cohesion: 0.15
Nodes (12): @bryntum/scheduler-enterprise@8.0.0, BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, COLUMNS, DealGantt(), LOCKED (+4 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "appeal-items.ts"
Cohesion: 0.14
Nodes (15): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+7 more)

### Community 68 - "Insights.tsx"
Cohesion: 0.08
Nodes (28): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+20 more)

### Community 69 - "draft-routes.ts"
Cohesion: 0.06
Nodes (61): CHAT_TRANSCRIPT_PREFIX, chatNames(), readBody(), sendRefusal(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes() (+53 more)

### Community 70 - "council-record.ts"
Cohesion: 0.12
Nodes (22): chosenDraft(), compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided() (+14 more)

### Community 71 - "readLedger"
Cohesion: 0.14
Nodes (13): db, types(), disputeTypes(), capturingEmail(), db, payments(), sentStage(), counts() (+5 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (62): buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions(), formatPayTimeout() (+54 more)

### Community 74 - "eval-runner.ts"
Cohesion: 0.21
Nodes (14): draftCategories, alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions (+6 more)

### Community 75 - "app.ts"
Cohesion: 0.04
Nodes (60): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), LinkOptions, linkRoutes() (+52 more)

### Community 76 - "scope-drafts.ts"
Cohesion: 0.11
Nodes (24): checkedDraft(), countRow, DraftIntegrityError, DraftNotAllowedError, DraftRecord, DraftRefusal, draftRow, DraftStateError (+16 more)

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

### Community 82 - "app-link-routes.test.ts"
Cohesion: 0.11
Nodes (24): db, invoiceEntries(), signedPayPal(), StageView, seedContext(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode (+16 more)

### Community 83 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

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

### Community 89 - "deals.ts"
Cohesion: 0.06
Nodes (51): AddBuyer, addBuyer(), addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CATEGORIES, DEAL_CURRENCIES (+43 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (68): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+60 more)

### Community 92 - "words/src/index.ts"
Cohesion: 0.19
Nodes (21): emailFor(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy(), ACTIONS (+13 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-clients.ts"
Cohesion: 0.07
Nodes (36): connectKeyValue(), keyValueStore(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers() (+28 more)

### Community 95 - "seller-connections.ts"
Cohesion: 0.13
Nodes (22): `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow, disconnectSeller() (+14 more)

### Community 96 - "api.ts"
Cohesion: 0.03
Nodes (126): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), addBuyer() (+118 more)

### Community 97 - "render.ts"
Cohesion: 0.10
Nodes (20): ACCENT_INK, Branding, breakWord(), CharacterSet, columnWidths(), drawable(), Fonts, INK (+12 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "qa/src/index.ts"
Cohesion: 0.18
Nodes (15): AnswerRefusal, CheckedAnswer, citation, replySchema, AgreementPage, numberedText(), buildQuestionMessages(), QUESTION_PROMPT_VERSION (+7 more)

### Community 101 - "Agents.tsx"
Cohesion: 0.15
Nodes (15): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+7 more)

### Community 103 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "agent-requests.ts"
Cohesion: 0.13
Nodes (17): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, claimAgentRequest() (+9 more)

### Community 106 - "notices.ts"
Cohesion: 0.20
Nodes (16): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+8 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.15
Nodes (21): Audience(), GLYPHS, SPOTS, Sticker(), Dispute(), drift(), AGENT_RUN, CLAIM (+13 more)

### Community 108 - "PaymentsPanel.tsx"
Cohesion: 0.22
Nodes (15): AcceptanceDocument(), AcceptanceDocument, checkPayments(), getMilestones(), isMilestones(), milestonesUrl(), MilestonesView, sendInvoice() (+7 more)

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

### Community 114 - "claim-routes.ts"
Cohesion: 0.17
Nodes (25): appealApplies(), RunnerBusyError, analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+17 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

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
Cohesion: 0.10
Nodes (28): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors() (+20 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

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
Nodes (25): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+17 more)

### Community 130 - "TEST_NOW"
Cohesion: 0.10
Nodes (32): dealWithBuyer(), db, newDeal, sellerDeal(), setup(), signedIn(), standInMember(), testDrafting() (+24 more)

### Community 131 - "vitest"
Cohesion: 0.21
Nodes (11): db, SESSION_COOKIE, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page() (+3 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (19): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `deal_messages`: the deal's chat (7b), `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes, `disputes`: PayPal disputes found by checking (+11 more)

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
Nodes (10): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), SCHEDULE_WINDOW_MS, TaskStarter, db, late (+2 more)

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

### Community 158 - "task.test.ts"
Cohesion: 0.20
Nodes (14): runAskModel(), runClaimTask(), runDraftTask(), runRetentionTask(), settings(), db, env, treeOfRuns() (+6 more)

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
Cohesion: 0.17
Nodes (14): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+6 more)

### Community 165 - "server/package.json"
Cohesion: 0.12
Nodes (16): @fastify/helmet@^13.2.0, @pactpal/council@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:*, @pactpal/council, @pactpal/timeline (+8 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "Landing.tsx"
Cohesion: 0.19
Nodes (9): ART, at(), dots(), Features(), Landing(), at(), Moves(), SHOTS (+1 more)

### Community 168 - "eval-scope.ts"
Cohesion: 0.23
Nodes (12): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), clients, parsed (+4 more)

### Community 169 - "Secret"
Cohesion: 0.04
Nodes (66): RFC-2606, Engineering, AI_RETRY_POLICY, ClientOptions, errorBody, failure(), kindOfStatus(), ModelNetworkError (+58 more)

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
Cohesion: 0.23
Nodes (8): StageView, RunningStepView, doneDay(), GanttLink, ganttRows(), GanttTask, noteFor(), PAYMENT_WORDS

### Community 174 - "appeal.test.ts"
Cohesion: 0.15
Nodes (11): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+3 more)

### Community 175 - "change-orders.ts"
Cohesion: 0.05
Nodes (62): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema (+54 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 179 - "retention.test.ts"
Cohesion: 0.10
Nodes (31): db, later, sellerWithDeal(), sellerWithoutBuyer(), createDeal(), disputed(), lockedDispute(), recordDispute() (+23 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 182 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 185 - "pdf/src/index.ts"
Cohesion: 0.26
Nodes (7): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, RenderedPdf, AT

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

### Community 191 - "receipt.test.ts"
Cohesion: 0.24
Nodes (8): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, receiptFormatAt(), document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

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

### Community 211 - "runner.test.ts"
Cohesion: 0.28
Nodes (6): DRAFTS, isRankingCall(), ranking(), rankingRequests(), shown(), task

### Community 212 - "src/draft-source.ts"
Cohesion: 0.32
Nodes (6): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage

### Community 217 - "photo-convert.test.ts"
Cohesion: 0.43
Nodes (4): sharp@0.35.5, MAX_PHOTO_SIDE, toJpeg(), sharp

### Community 218 - "source"
Cohesion: 0.33
Nodes (6): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8)

### Community 220 - "build.ts"
Cohesion: 0.20
Nodes (9): css, dist, faces, FONTS, home, problems, root, PAGES (+1 more)

### Community 222 - "useScrollStory.ts"
Cohesion: 0.40
Nodes (3): @fiddle-digital/string-tune@1.2.7, useScrollStory(), @fiddle-digital/string-tune

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1842 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `errors.ts`, `testId`, `scope.ts`, `receipt.ts`, `dispute-sync.ts`, `claims/src/index.ts`, `Secret`, `milestones.ts`, `DraftPanel.tsx`, `app.test.ts`, `ScopePanel.tsx`, `AccessTokenProvider`, `questions.ts`, `test-app.ts`, `.query`, `council/src/index.ts`, `claims/src/check.ts`, `net/src/index.ts`, `schema.ts`, `DealPage.tsx`, `scope-draft/src/testing.ts`, `actions.ts`, `scope-draft/src/index.ts`, `email/src/index.ts`, `packet-service.ts`, `layouts.tsx`, `eval-report.ts`, `db/src/index.ts`, `db/src/testing.ts`, `emailFrom`, `paypal-webhook.ts`, `chat-routes.ts`, `postgres.ts`, `listing-routes.ts`, `milestone-routes.ts`, `ledger/src/index.ts`, `validate.ts`, `gantt-rows.ts`, `claims/src/check.ts`, `htmlToText`, `dispute-actions.ts`, `postStep`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `Deadlines.tsx`, `appeal-items.ts`, `Insights.tsx`, `council-record.ts`, `readLedger`, `paypal/src/index.ts`, `eval-runner.ts`, `app.ts`, `scope-drafts.ts`, `ai/src/index.ts`, `app-link-routes.test.ts`, `MessagesPanel.tsx`, `deals.ts`, `sandbox-respond-report.ts`, `words/src/index.ts`, `sandbox-clients.ts`, `seller-connections.ts`, `api.ts`, `qa/src/index.ts`, `Agents.tsx`, `agent-requests.ts`, `notices.ts`, `landing-words.ts`, `devDependencies`, `Ledger.tsx`, `package.json`, `config.ts`, `IntakePanel.tsx`, `TEST_NOW`, `checker.ts`, `task.test.ts`, `Nav.tsx`, `Secret`, `pages.ts`, `gantt-rows.ts`, `appeal.test.ts`, `change-orders.ts`, `retention.test.ts`, `design/tokens.ts`, `pdf/src/index.ts`, `log-labels.test.ts`, `receipt.test.ts`, `runner.test.ts`, `src/draft-source.ts`, `photo-convert.test.ts`?**
  _High betweenness centrality (0.244) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.045512010113780026 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `Deadlines.tsx`, `README.md`, `timeline/src/index.ts`, `Secret`, `source`, `PayPalResult`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05649717514124294 - nodes in this community are weakly interconnected._
- **Why does `react` connect `when` to `App.tsx`, `IntakePanel.tsx`, `DeliverPanel.tsx`, `DraftPanel.tsx`, `ScopePanel.tsx`, `DealPage.tsx`, `Nav.tsx`, `Council.tsx`, `layouts.tsx`, `Landing.tsx`, `web/package.json`, `gantt-rows.ts`, `postStep`, `Tour.tsx`, `Hero.tsx`, `Deadlines.tsx`, `Insights.tsx`, `brand/src/index.ts`, `Pillars.tsx`, `MessagesPanel.tsx`, `useScrollStory.ts`, `api.ts`, `Agents.tsx`, `landing-words.ts`, `PaymentsPanel.tsx`, `Ledger.tsx`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Should `testId` be split into smaller, more focused modules?**
  _Cohesion score 0.05411392405063291 - nodes in this community are weakly interconnected._