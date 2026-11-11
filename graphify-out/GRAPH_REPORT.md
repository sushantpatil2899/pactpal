# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 797 files · ~510,506 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6132 nodes · 19312 edges · 221 communities (199 shown, 22 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 546 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ba659f52`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- design/parts.tsx
- Engineering
- TEST_NOW
- App.tsx
- DeliverPanel.tsx
- when
- deals/routes.ts
- DealPage.tsx
- words/src/index.ts
- email/src/index.ts
- claims/src/index.ts
- mcp.ts
- tools.ts
- database.ts
- change-orders.ts
- Database
- db/src/testing.ts
- ScopePanel.tsx
- ref_zod
- readChecked
- appendLedgerEvent
- postgresContentStore
- test-app.ts
- change-order-routes.ts
- db/src/index.ts
- council/src/index.ts
- disputes/task.ts
- claims/src/check.ts
- paypal/src/index.ts
- eval-runner.ts
- live/src/index.ts
- scope-draft/src/testing.ts
- disputes/test-support.ts
- scope-draft/src/index.ts
- sign-in-words.ts
- email/src/index.ts
- packet-service.ts
- MessagesPage.tsx
- qa/src/index.ts
- eval-report.ts
- claim-analyses.ts
- change-order-routes.ts
- build.js
- config.ts
- live-hub.ts
- postgres.ts
- products/src/index.ts
- pages.tsx
- web/package.json
- ledger/src/index.ts
- QuestionsPanel.tsx
- chat.ts
- agent-requests.ts
- resend-inbound.ts
- Built (sub-phases 2b to 6h-1)
- postStep
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- PayPalResult
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- addArtifact
- scripts
- db/package.json
- vitest
- Insights.tsx
- ref_zod
- testId
- readLedger
- claims/package.json
- sandbox-respond-report.ts
- Landing.tsx
- Deadlines.tsx
- dispute-sync.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- Secret
- photo-convert.test.ts
- .query
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- retention.test.ts
- products/package.json
- auth/sign-in.ts
- ai/package.json
- actions.ts
- plainCode
- scripts
- sandbox-clients.ts
- Pillars.tsx
- api.ts
- render.ts
- email/package.json
- compilerOptions
- templates.ts
- seed.ts
- make_content.py
- eval-scope.ts
- council/package.json
- Agents.tsx
- book.ts
- landing-words.ts
- MessagesPanel.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- claim-job.ts
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- paypal-webhook.ts
- compilerOptions
- Build plan
- react
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- AgentPanel.tsx
- engine.test.ts
- timeline-progress.ts
- README.md
- notices.ts
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
- useRoute.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- screenshot.ts
- Nav.tsx
- log-labels.ts
- .prettierrc.json
- products/tsconfig.json
- keyvalue.ts
- server/package.json
- docs/tsconfig.json
- Council.tsx
- brand/src/index.ts
- email/src/index.ts
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- confirmation.ts
- Tour.tsx
- dispute-actions.ts
- vite-env.d.ts
- src-app-tsx.md
- @pactpal/qa@workspace:*
- @pactpal/words@workspace:*
- design/tokens.ts
- receipt.test.ts
- ai-check-report.ts
- Hero.tsx
- PayPal sandbox notes
- postgres-listen.test.ts
- delivery-routes.test.ts
- Getting started
- brand/package.json
- @pactpal/ai@workspace:*
- question-routes.test.ts
- Audience.tsx
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
- @modelcontextprotocol/sdk@1.32.1
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- @pactpal/claims@workspace:*
- @pactpal/paypal@workspace:*
- redis
- ws
- pg@^8.23.1
- zod@^4.6.7
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- delivery-check-routes.test.ts
- build.ts
- log-labels.test.ts
- source

## God Nodes (most connected - your core abstractions)
1. `vitest` - 232 edges
2. `Database` - 133 edges
3. `testId()` - 122 edges
4. `readLedger()` - 92 edges
5. `useMigratedTestDatabase()` - 87 edges
6. `sha256Hex()` - 86 edges
7. `react` - 80 edges
8. `appendLedgerEvent()` - 75 edges
9. `isObject()` - 74 edges
10. `TEST_NOW` - 72 edges

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

## Communities (221 total, 22 thin omitted)

### Community 0 - "design/parts.tsx"
Cohesion: 0.09
Nodes (45): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+37 more)

### Community 1 - "Engineering"
Cohesion: 0.05
Nodes (42): Engineering, authAssertion(), base64Url(), dollar, setup(), DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest (+34 more)

### Community 2 - "TEST_NOW"
Cohesion: 0.11
Nodes (31): agentDeal(), db, mcpClient(), ToolResult, db, db, invoiceEntries(), signedDeal() (+23 more)

### Community 3 - "App.tsx"
Cohesion: 0.06
Nodes (58): Me, signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage (+50 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.12
Nodes (30): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+22 more)

### Community 5 - "when"
Cohesion: 0.07
Nodes (58): AppealCheckView, AppealView, checkAppeal(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView (+50 more)

### Community 6 - "deals/routes.ts"
Cohesion: 0.05
Nodes (93): liveRoutes(), check(), listQuery, notificationRoutes(), readRequest, dealAccess(), visibleDeal(), readBody() (+85 more)

### Community 7 - "DealPage.tsx"
Cohesion: 0.08
Nodes (47): addBuyer(), checkLedger(), getDeal(), getMe(), isDeal(), LedgerCheck, LedgerEntryView, listDeals() (+39 more)

### Community 8 - "words/src/index.ts"
Cohesion: 0.12
Nodes (32): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+24 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.16
Nodes (27): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+19 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (72): parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+64 more)

### Community 11 - "mcp.ts"
Cohesion: 0.15
Nodes (18): checkMcp(), PayPalMcpError, noAnswer(), setupError(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory (+10 more)

### Community 12 - "tools.ts"
Cohesion: 0.11
Nodes (22): actingAs(), routeCaller(), AGENT_TOOLS, AgentTool, ask(), choicesSchema, dealId, dealPath() (+14 more)

### Community 13 - "database.ts"
Cohesion: 0.06
Nodes (54): dealWithBuyer(), db, later, sellerWithDeal(), sellerWithoutBuyer(), CHAT_CHANNEL, chatEventSchema, party (+46 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.04
Nodes (71): Acceptance, acceptTermsSchema, declineReasonSchema, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf() (+63 more)

### Community 15 - "Database"
Cohesion: 0.04
Nodes (82): ReceiptMailDeps, AGENT_CALLS_PER_MINUTE, bearerOf(), McpRouteOptions, mcpRoutes(), mcpServer(), AgentContext, sellersDealOf() (+74 more)

### Community 16 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (52): db, refusal(), NewDeal, sellerStageStep, checkedFileSchema, checkRow, DeliveryCheck, DeliveryCheckNotAllowedError (+44 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (68): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+60 more)

### Community 18 - "ref_zod"
Cohesion: 0.06
Nodes (57): checks, ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions (+49 more)

### Community 19 - "readChecked"
Cohesion: 0.08
Nodes (45): checkPayments(), getMilestones(), isFile(), isMilestones(), listFiles(), milestonesUrl(), MilestonesView, readChecked() (+37 more)

### Community 20 - "appendLedgerEvent"
Cohesion: 0.03
Nodes (123): AcceptanceIntegrityError, AcceptanceNotAllowedError, acceptanceRow, AcceptTerms, acceptTerms(), checkedAcceptance(), DeclineTerms, declineTerms() (+115 more)

### Community 21 - "postgresContentStore"
Cohesion: 0.08
Nodes (45): afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody (+37 more)

### Community 22 - "test-app.ts"
Cohesion: 0.06
Nodes (62): chatDeal(), db, MessageBody, Card, db, savedDeal(), send(), signedDeal() (+54 more)

### Community 23 - "change-order-routes.ts"
Cohesion: 0.09
Nodes (38): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money (+30 more)

### Community 24 - "db/src/index.ts"
Cohesion: 0.04
Nodes (73): AcceptanceRefusal, ReceiptSent, receiptSentSchema, AnalysisNotAllowedError, MAX_ANALYSES_PER_DISPUTE, StartClaimAnalysis, db, disputed() (+65 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.05
Nodes (80): ClaimJobDeps, candidates(), JsonReply, tryParse(), DEFAULT_MODEL, median(), ModelRecord, rankModels() (+72 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.06
Nodes (61): postgresBus(), publishingBus(), Config, formatErrors(), CronStart, runCronJob(), SEED_TASK_NAME, checkKey() (+53 more)

### Community 27 - "claims/src/check.ts"
Cohesion: 0.08
Nodes (38): checkAnalysis(), ClaimAnalysis, claimAnalysisSchema, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT (+30 more)

### Community 28 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (49): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TestDisputeItem, TestDisputeReason (+41 more)

### Community 29 - "eval-runner.ts"
Cohesion: 0.11
Nodes (32): draftCategories, alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions (+24 more)

### Community 30 - "live/src/index.ts"
Cohesion: 0.10
Nodes (34): ChatView, liveUrl(), ChatAction, chatReducer(), ChatState, Connection, initialChat, lastSeq() (+26 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (42): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind, EVAL_CASES (+34 more)

### Community 32 - "disputes/test-support.ts"
Cohesion: 0.10
Nodes (35): inProcessClaimRunner(), AnalysesView, db, disputedDeal(), db, DisputesView, paidDeal(), failureCode() (+27 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (98): councilRecordSchema, usage, categoryLabels, describeDraft(), DraftView, priceMinor(), JsonSchema, claimLines() (+90 more)

### Community 34 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 35 - "email/src/index.ts"
Cohesion: 0.09
Nodes (35): NOTICE_LOOK, notificationEmail(), EmailTemplates, ENTITIES, entity(), htmlToText(), emailAttachmentSchema, ReadResult (+27 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.05
Nodes (82): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+74 more)

### Community 37 - "MessagesPage.tsx"
Cohesion: 0.08
Nodes (45): CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR, STATUS_BAR (+37 more)

### Community 38 - "qa/src/index.ts"
Cohesion: 0.13
Nodes (31): runPrepared(), toCouncilRecord(), toJson(), DraftJob, JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS, MessageJob (+23 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "claim-analyses.ts"
Cohesion: 0.11
Nodes (19): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+11 more)

### Community 41 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (55): sendTimelineReminders(), acceptBody, view(), changeParams, changeView(), declineBody, proposeBody, ProposeBody (+47 more)

### Community 42 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 43 - "config.ts"
Cohesion: 0.06
Nodes (43): closeOnSignals(), socketOrigin(), report, setup(), result, ADDRESS_RULES, addressAllowed(), AI_KEYS (+35 more)

### Community 44 - "live-hub.ts"
Cohesion: 0.15
Nodes (5): BusSignal, LiveHub, LivePage, Online, PageState

### Community 45 - "postgres.ts"
Cohesion: 0.13
Nodes (12): Row, connectPostgres(), databaseFromPool(), ListenOptions, PgClient, PgConnection, PgPool, PostgresOptions (+4 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.13
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 47 - "pages.tsx"
Cohesion: 0.12
Nodes (30): Money, Dashboard(), DealList(), byUrgency(), initials(), isOpen(), STAGE_ORDER, STAGES (+22 more)

### Community 48 - "web/package.json"
Cohesion: 0.04
Nodes (66): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+58 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.04
Nodes (85): isPicture(), agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+77 more)

### Community 50 - "QuestionsPanel.tsx"
Cohesion: 0.21
Nodes (16): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), DealSummary, ForwardReason, getQuestions(), isQuestions(), questionStep() (+8 more)

### Community 51 - "chat.ts"
Cohesion: 0.07
Nodes (30): Conversation, db, body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole (+22 more)

### Community 52 - "agent-requests.ts"
Cohesion: 0.06
Nodes (53): linkRoutes(), AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+45 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.17
Nodes (15): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, settingsView(), keyBody, secretView() (+7 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (24): title(), draft(), unchanged(), `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record, `deals` (+16 more)

### Community 55 - "postStep"
Cohesion: 0.14
Nodes (29): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), isDisputeActions() (+21 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.08
Nodes (42): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, CheckedFile (+34 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (42): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+34 more)

### Community 59 - "PayPalResult"
Cohesion: 0.06
Nodes (42): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, disputeDetails, DisputeList (+34 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.06
Nodes (47): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+39 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (37): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ScopeInput (+29 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "addArtifact"
Cohesion: 0.09
Nodes (31): result, webDir, failRunningMessageReviews(), forwardInterruptedQuestions(), checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError (+23 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "vitest"
Cohesion: 0.13
Nodes (15): db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page(), db, NoteBody (+7 more)

### Community 68 - "Insights.tsx"
Cohesion: 0.11
Nodes (24): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+16 more)

### Community 69 - "ref_zod"
Cohesion: 0.06
Nodes (57): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), liveQuery, LiveRouteOptions (+49 more)

### Community 70 - "testId"
Cohesion: 0.06
Nodes (33): Listen, listeners(), memoryBus(), addCard(), db, hubOnTestDeal(), db, goodsDeal() (+25 more)

### Community 71 - "readLedger"
Cohesion: 0.07
Nodes (31): db, ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer (+23 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (99): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+91 more)

### Community 74 - "Landing.tsx"
Cohesion: 0.15
Nodes (12): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+4 more)

### Community 75 - "Deadlines.tsx"
Cohesion: 0.10
Nodes (29): BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, addDays(), daysBetween(), earlierDay(), laterDay() (+21 more)

### Community 76 - "dispute-sync.ts"
Cohesion: 0.19
Nodes (16): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+8 more)

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

### Community 81 - "Secret"
Cohesion: 0.05
Nodes (41): currentSession(), linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts() (+33 more)

### Community 82 - "photo-convert.test.ts"
Cohesion: 0.43
Nodes (4): sharp@0.35.5, MAX_PHOTO_SIDE, toJpeg(), sharp

### Community 83 - ".query"
Cohesion: 0.08
Nodes (37): `acceptances`: signed agreements, DisputeEntry, DisputeNotice, entryRow, listDisputeEntriesSince(), listDisputeNotices(), NewDisputeNotice, newNoticeSchema (+29 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "retention.test.ts"
Cohesion: 0.15
Nodes (18): allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA, LooseKind, purgeDeal() (+10 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "auth/sign-in.ts"
Cohesion: 0.08
Nodes (32): buildApp(), requestLog(), db, setup(), backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+24 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "actions.ts"
Cohesion: 0.22
Nodes (22): FILE_NAME_HEADER, askQuestion(), callAs(), chat(), createDeal(), decline(), deliver(), idOf() (+14 more)

### Community 92 - "plainCode"
Cohesion: 0.19
Nodes (21): emailFor(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy(), ACTIONS (+13 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-clients.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "Pillars.tsx"
Cohesion: 0.24
Nodes (12): Agent(), at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed() (+4 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (101): AgentRequestsPanel(), AgentRequestView, analysesUrl(), answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict (+93 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (46): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+38 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "templates.ts"
Cohesion: 0.20
Nodes (10): EMAIL_LOGO_PATH, emailLogo(), loadEmailTemplates(), templatesDir(), loaded, app, root, webSource (+2 more)

### Community 101 - "seed.ts"
Cohesion: 0.15
Nodes (19): SeedContext, BOOK, MAYA, db, runOptions, seedApp(), contentReader(), databaseProgress() (+11 more)

### Community 103 - "eval-scope.ts"
Cohesion: 0.26
Nodes (10): logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), clients, parsed (+2 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Agents.tsx"
Cohesion: 0.15
Nodes (15): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+7 more)

### Community 106 - "book.ts"
Cohesion: 0.17
Nodes (21): addBuyer(), AgreementForm, answerDelivery(), dealFromText(), draftAgreement(), saveAgreement(), agreementStep(), aiDraftStep() (+13 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.19
Nodes (19): at(), Closing(), LIMIT_GLYPHS, Tagline(), Dispute(), drift(), AGENT_RUN, CLAIM (+11 more)

### Community 108 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 109 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

### Community 110 - "Demo plan"
Cohesion: 0.11
Nodes (17): Buyers (each: a sandbox **Personal** account with the same email and sandbox balance, to pay invoices), Cast, Chats, Demo plan, Done by the owner, How the inboxes work (set up 11 Nov 2026), Maya's book of deals (written work only), Rules (+9 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "claim-job.ts"
Cohesion: 0.07
Nodes (72): CHECK_INTERVAL_MS, AlreadySent, appealApplies(), appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument (+64 more)

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

### Community 120 - "paypal-webhook.ts"
Cohesion: 0.10
Nodes (19): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+11 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "react"
Cohesion: 0.08
Nodes (38): addFile(), addPastedChat(), DealFile, draftsUrl(), DraftView, errorMessage(), fileUrl(), getDraftById() (+30 more)

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
Cohesion: 0.30
Nodes (10): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+2 more)

### Community 130 - "engine.test.ts"
Cohesion: 0.21
Nodes (7): DemoProgress, DemoStep, RunOptions, runStory(), RunSummary, StepResult, DemoRefs

### Community 131 - "timeline-progress.ts"
Cohesion: 0.15
Nodes (12): dealIdRow, EVENT_FOR, fileRef, filesOf(), NewReminder, NewStepUpdate, reminderSchema, StepNotAllowedError (+4 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "notices.ts"
Cohesion: 0.24
Nodes (12): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+4 more)

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

### Community 150 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

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

### Community 158 - "screenshot.ts"
Cohesion: 0.18
Nodes (10): buildScreenshotMessages(), checkTranscript(), MAX_SCREENSHOTS, SCREENSHOT_PROMPT_VERSION, IMAGE, reply(), spec, Transcript (+2 more)

### Community 159 - "Nav.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

### Community 160 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 165 - "server/package.json"
Cohesion: 0.12
Nodes (16): @fastify/helmet@^13.2.0, @pactpal/council@workspace:*, @pactpal/db@workspace:*, @pactpal/email@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:*, @pactpal/council, @pactpal/timeline (+8 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "Council.tsx"
Cohesion: 0.19
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 168 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 169 - "email/src/index.ts"
Cohesion: 0.08
Nodes (25): RFC-2606, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError, receivedAnswer (+17 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (18): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+10 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "confirmation.ts"
Cohesion: 0.29
Nodes (9): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+1 more)

### Community 175 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (28): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+20 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 180 - "design/tokens.ts"
Cohesion: 0.30
Nodes (11): ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance(), PAIRS (+3 more)

### Community 181 - "receipt.test.ts"
Cohesion: 0.22
Nodes (8): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, receiptFormatAt(), document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

### Community 182 - "ai-check-report.ts"
Cohesion: 0.40
Nodes (7): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec

### Community 183 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 185 - "postgres-listen.test.ts"
Cohesion: 0.22
Nodes (4): fakeClient(), Handler, setup(), PgListenClient

### Community 186 - "delivery-routes.test.ts"
Cohesion: 0.32
Nodes (7): Answered, db, DeliveriesView, DeliveryView, entriesOf(), png(), signedDeal()

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 190 - "question-routes.test.ts"
Cohesion: 0.29
Nodes (7): db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View

### Community 191 - "Audience.tsx"
Cohesion: 0.33
Nodes (6): Audience(), GLYPHS, SPOTS, Sticker(), NOT_YET, StickerIcon

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

### Community 218 - "delivery-check-routes.test.ts"
Cohesion: 0.12
Nodes (17): CheckView, db, FAILED, shown, store, db, FAILED, PAGES (+9 more)

### Community 220 - "build.ts"
Cohesion: 0.20
Nodes (9): css, dist, faces, FONTS, home, problems, root, PAGES (+1 more)

### Community 222 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 224 - "source"
Cohesion: 0.17
Nodes (12): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+4 more)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1818 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Engineering`, `TEST_NOW`, `App.tsx`, `DealPage.tsx`, `words/src/index.ts`, `email/src/index.ts`, `claims/src/index.ts`, `mcp.ts`, `database.ts`, `change-orders.ts`, `db/src/testing.ts`, `ScopePanel.tsx`, `ref_zod`, `readChecked`, `appendLedgerEvent`, `test-app.ts`, `db/src/index.ts`, `council/src/index.ts`, `disputes/task.ts`, `claims/src/check.ts`, `paypal/src/index.ts`, `eval-runner.ts`, `live/src/index.ts`, `scope-draft/src/testing.ts`, `disputes/test-support.ts`, `scope-draft/src/index.ts`, `sign-in-words.ts`, `email/src/index.ts`, `packet-service.ts`, `MessagesPage.tsx`, `qa/src/index.ts`, `eval-report.ts`, `change-order-routes.ts`, `config.ts`, `products/src/index.ts`, `pages.tsx`, `ledger/src/index.ts`, `chat.ts`, `agent-requests.ts`, `postStep`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `addArtifact`, `Insights.tsx`, `testId`, `readLedger`, `sandbox-respond-report.ts`, `Deadlines.tsx`, `dispute-sync.ts`, `Secret`, `photo-convert.test.ts`, `.query`, `retention.test.ts`, `auth/sign-in.ts`, `actions.ts`, `plainCode`, `sandbox-clients.ts`, `api.ts`, `render.ts`, `templates.ts`, `seed.ts`, `Agents.tsx`, `landing-words.ts`, `MessagesPanel.tsx`, `devDependencies`, `claim-job.ts`, `Ledger.tsx`, `package.json`, `paypal-webhook.ts`, `react`, `AgentPanel.tsx`, `engine.test.ts`, `useRoute.ts`, `screenshot.ts`, `Nav.tsx`, `keyvalue.ts`, `email/src/index.ts`, `pages.ts`, `confirmation.ts`, `dispute-actions.ts`, `design/tokens.ts`, `receipt.test.ts`, `ai-check-report.ts`, `postgres-listen.test.ts`, `delivery-routes.test.ts`, `question-routes.test.ts`, `delivery-check-routes.test.ts`, `log-labels.test.ts`?**
  _High betweenness centrality (0.234) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `design/parts.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08521303258145363 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `source`, `Engineering`, `README.md`, `change-order-routes.ts`, `Deadlines.tsx`, `PayPalResult`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `Engineering` be split into smaller, more focused modules?**
  _Cohesion score 0.05153153153153153 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Engineering` to `when`, `Database`, `ref_zod`, `postgresContentStore`, `test-app.ts`, `council/src/index.ts`, `disputes/task.ts`, `paypal/src/index.ts`, `scope-draft/src/index.ts`, `change-order-routes.ts`, `email/src/index.ts`, `ledger/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `PayPalResult`, `Secret`, `.query`, `plainCode`, `log-labels.test.ts`, `claim-job.ts`, `Decisions`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `TEST_NOW` be split into smaller, more focused modules?**
  _Cohesion score 0.10801393728222997 - nodes in this community are weakly interconnected._