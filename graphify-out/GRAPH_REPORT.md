# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 779 files · ~495,934 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6013 nodes · 18859 edges · 216 communities (193 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 546 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `12b61d83`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- paypal/src/index.ts
- appendLedgerEvent
- Insights.tsx
- DeliveriesPanel.tsx
- DealPage.tsx
- dispute-sync.ts
- artifacts.ts
- receipt.ts
- utcDateTime
- claims/src/index.ts
- postgresContentStore
- vitest
- db/src/index.ts
- scope.ts
- Dashboard.tsx
- disputes/task.ts
- ScopePanel.tsx
- ref_zod
- sandbox-clients.ts
- threads.ts
- draft-job.ts
- DisputePage.tsx
- notices.ts
- tools.ts
- council/src/index.ts
- question-routes.ts
- db/src/migrate.ts
- design/parts.tsx
- dispute-actions.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- validate.ts
- sandbox-partner-report.ts
- App.tsx
- Deadlines.tsx
- packet-service.ts
- delivery-check.test.ts
- mcp.ts
- eval-report.ts
- dealRoutes
- layouts.tsx
- templates.ts
- config.ts
- notifier.ts
- postgres.ts
- products/src/index.ts
- appeal-items.ts
- Landing.tsx
- ledger/src/index.ts
- readLedger
- web/package.json
- acceptance-routes.ts
- email/src/index.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- ai/src/index.ts
- DraftReview.tsx
- services
- Pillars.tsx
- scripts
- db/package.json
- paypal/src/index.ts
- landing-words.ts
- Database
- AgentPanel.tsx
- claim-analyses.ts
- claims/package.json
- sandbox-respond-report.ts
- auth/sign-in.ts
- server/src/index.ts
- Agents.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- eval-runner.ts
- scope-draft/src/index.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- milestone-routes.ts
- ai/package.json
- claim-job.ts
- seller-connections.ts
- scripts
- sandbox-webhook-report.ts
- SellerAppPanel.tsx
- DraftPanel.tsx
- render.ts
- email/package.json
- compilerOptions
- question-routes.test.ts
- checker.ts
- resend-inbound.ts
- seller-app.ts
- council/package.json
- IntakePanel.tsx
- build.ts
- Tour.tsx
- app-link-routes.ts
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- draft-routes.ts
- Ledger.tsx
- Engineering standards
- package.json
- detectMediaType
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- ref_zod
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- react
- Tour.tsx
- Closing.tsx
- README.md
- app.test.ts
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
- claim-routes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- email/src/index.ts
- appeal-coverage.ts
- image.ts
- .prettierrc.json
- products/tsconfig.json
- api.ts
- server/package.json
- docs/tsconfig.json
- check-words.ts
- source
- RedisCommands
- paypal-webhook.ts
- pages.ts
- index.md
- @fastify/cookie
- PayPal sandbox notes
- brand/src/index.ts
- vite-env.d.ts
- src-app-tsx.md
- build.js
- council
- design/tokens.ts
- receipt.test.ts
- Privacy
- Scope
- @fastify/helmet
- @fastify/static
- log-labels.test.ts
- Getting started
- brand/package.json
- @pactpal/email@workspace:*
- @pactpal/qa@workspace:*
- dependency-cruiser@^16.10.4
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- jscpd@^4.3.0
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy
- @fastify/websocket
- @pactpal/ai@workspace:*
- @pactpal/council@workspace:*
- @pactpal/delivery-check@workspace:*
- @pactpal/words@workspace:*
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- @pactpal/scope-draft@workspace:*
- pg@^8.23.1
- zod@^4.6.7

## God Nodes (most connected - your core abstractions)
1. `vitest` - 225 edges
2. `Database` - 129 edges
3. `testId()` - 119 edges
4. `readLedger()` - 90 edges
5. `sha256Hex()` - 86 edges
6. `useMigratedTestDatabase()` - 83 edges
7. `react` - 80 edges
8. `appendLedgerEvent()` - 75 edges
9. `isObject()` - 74 edges
10. `TEST_NOW` - 68 edges

## Surprising Connections (you probably didn't know these)
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts

## Import Cycles
- None detected.

## Communities (216 total, 23 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.12
Nodes (36): AcceptanceDocument(), AcceptanceDocument, LinkProblem, redeemLink(), NewDealPage(), STAGE_ORDER, Deadlines, DeadlinesPage() (+28 more)

### Community 1 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (40): PayPalBuyerTestActions, dollar, setup(), PayPalApiError, PayPalErrorDetail, PayPalNetworkError, PayPalResponseError, DEFAULT_FALLBACK_POLICY (+32 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.03
Nodes (176): addCard(), Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms(), acceptTermsSchema (+168 more)

### Community 3 - "Insights.tsx"
Cohesion: 0.13
Nodes (20): ag-studio@3.1.0, giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, insightRows() (+12 more)

### Community 4 - "DeliveriesPanel.tsx"
Cohesion: 0.13
Nodes (31): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+23 more)

### Community 5 - "DealPage.tsx"
Cohesion: 0.04
Nodes (86): checkLedger(), getMe(), LedgerCheck, LedgerEntryView, ScopeTerms, ScopeView, SIGN_IN_PATH, StageView (+78 more)

### Community 6 - "dispute-sync.ts"
Cohesion: 0.17
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 7 - "artifacts.ts"
Cohesion: 0.13
Nodes (15): ARTIFACT_KINDS, ArtifactRejection, artifactRow, assertFileAllowed(), BUYER_MEDIA_TYPES, buyerTotals, EVENT_FOR_KIND, newArtifactSchema (+7 more)

### Community 8 - "receipt.ts"
Cohesion: 0.15
Nodes (25): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), fileUrl(), ListingCard() (+17 more)

### Community 9 - "utcDateTime"
Cohesion: 0.16
Nodes (25): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+17 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (83): PacketFacts, parseJsonReply(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages() (+75 more)

### Community 11 - "postgresContentStore"
Cohesion: 0.06
Nodes (46): createIntakeDeal(), db, sellerDeal(), withReadyDraft(), waitingDraft(), addArtifact(), ARTIFACT_LIMITS, ArtifactLimits (+38 more)

### Community 12 - "vitest"
Cohesion: 0.03
Nodes (114): ToolResult, db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, db (+106 more)

### Community 13 - "db/src/index.ts"
Cohesion: 0.02
Nodes (171): doneKeys(), eventNotice(), reminderKey(), reminderNotice(), sendDisputeNotices(), ArtifactKind, ScopeChange, body (+163 more)

### Community 14 - "scope.ts"
Cohesion: 0.06
Nodes (35): at(), db, ORDERING, proposed(), signature(), SIGNED, BASE, LISTING (+27 more)

### Community 15 - "Dashboard.tsx"
Cohesion: 0.11
Nodes (37): Money, CommandPalette(), PLACES, Dashboard(), DealList(), Cell, COLUMNS, DealsTable() (+29 more)

### Community 16 - "disputes/task.ts"
Cohesion: 0.12
Nodes (29): publishingBus(), Config, CronStart, runCronJob(), renderWorkflowChecker(), TaskStarter, db, late (+21 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (76): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+68 more)

### Community 18 - "ref_zod"
Cohesion: 0.04
Nodes (59): sellerKeyBox(), bareAddress(), ResendReceivedEmails, inbox(), EMAIL_RETRY_POLICY, ResendEmailSender, ResendOptions, message (+51 more)

### Community 19 - "sandbox-clients.ts"
Cohesion: 0.14
Nodes (17): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+9 more)

### Community 20 - "threads.ts"
Cohesion: 0.14
Nodes (25): Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People(), plainClick() (+17 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.06
Nodes (64): MESSAGE_PROMPT_VERSIONS, MessageJob, LABEL_WORDS, revisionNote(), checkAnalysis(), ClaimContext, invalid(), MAX_STATEMENTS (+56 more)

### Community 22 - "DisputePage.tsx"
Cohesion: 0.10
Nodes (31): checkDisputes(), DisputesView, getDisputePage(), getDisputes(), isDisputes(), StatusBadge(), CheckNow(), LastCheck (+23 more)

### Community 23 - "notices.ts"
Cohesion: 0.27
Nodes (14): DueNotice, emailFor(), EVENT_KINDS, NOTICE_WINDOW_MS, REMINDER_MARKS, withoutRepeats(), disputeChangedEmail(), disputeDecidedEmail() (+6 more)

### Community 24 - "tools.ts"
Cohesion: 0.10
Nodes (29): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+21 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (46): JsonSchema, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "question-routes.ts"
Cohesion: 0.09
Nodes (30): Card, Notifier, NotifierOptions, PartyNotice, answerBody, askBody, Attempt, MODELS_PER_QUESTION (+22 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.23
Nodes (12): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+4 more)

### Community 28 - "design/parts.tsx"
Cohesion: 0.12
Nodes (30): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+22 more)

### Community 29 - "dispute-actions.ts"
Cohesion: 0.10
Nodes (29): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+21 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.09
Nodes (42): analysesUrl(), AppealCheckView, AppealView, checkAppeal(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+34 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (43): councilRecordOf(), compare(), same, two, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck() (+35 more)

### Community 32 - "validate.ts"
Cohesion: 0.09
Nodes (39): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), paymentFromShare() (+31 more)

### Community 33 - "sandbox-partner-report.ts"
Cohesion: 0.13
Nodes (25): Checked, payPalIdOption(), actFor(), message(), parsed, partners, platform, argsSchema (+17 more)

### Community 34 - "App.tsx"
Cohesion: 0.10
Nodes (35): signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage, DisputePage (+27 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.08
Nodes (41): BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, addDays(), daysBetween(), earlierDay(), laterDay() (+33 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): sellersDispute(), aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER (+38 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.21
Nodes (10): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+2 more)

### Community 38 - "mcp.ts"
Cohesion: 0.15
Nodes (16): checkMcp(), PayPalMcpError, noAnswer(), setupError(), describe(), McpClientOptions, McpTransportFactory, PayPalMcpClient (+8 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "dealRoutes"
Cohesion: 0.13
Nodes (28): listQuery, notificationRoutes(), readRequest, dealAccess(), visibleDeal(), readBody(), requireViewer(), ConversationRouteOptions (+20 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.09
Nodes (29): Me, IconName, PATHS, Logo(), applyTheme(), nextTheme(), ORDER, readTheme() (+21 more)

### Community 42 - "templates.ts"
Cohesion: 0.16
Nodes (14): buildApp(), EMAIL_LOGO_PATH, requestLog(), setup(), setup(), emailLogo(), loadEmailTemplates(), templatesDir() (+6 more)

### Community 43 - "config.ts"
Cohesion: 0.06
Nodes (41): result, loadConfigOrExit(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars() (+33 more)

### Community 44 - "notifier.ts"
Cohesion: 0.06
Nodes (35): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), LiveHub (+27 more)

### Community 45 - "postgres.ts"
Cohesion: 0.10
Nodes (13): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient, PgConnection (+5 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.14
Nodes (19): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+11 more)

### Community 47 - "appeal-items.ts"
Cohesion: 0.12
Nodes (19): AlreadySent, appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER, disputeFieldsOf() (+11 more)

### Community 48 - "Landing.tsx"
Cohesion: 0.12
Nodes (16): Audience(), Sticker(), Council(), ART, at(), dots(), Features(), Landing() (+8 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.16
Nodes (25): DISPUTE_EVENT_PREFIX, canonicalJson(), JsonValue, FileFingerprint, hashFile(), isAllowedWhitespace(), isControl(), isPlainText() (+17 more)

### Community 50 - "readLedger"
Cohesion: 0.02
Nodes (181): db, agentDeal(), db, mcpClient(), chatDeal(), liveDeal(), openLiveDeal(), Card (+173 more)

### Community 51 - "web/package.json"
Cohesion: 0.04
Nodes (66): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+58 more)

### Community 52 - "acceptance-routes.ts"
Cohesion: 0.14
Nodes (27): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent() (+19 more)

### Community 53 - "email/src/index.ts"
Cohesion: 0.12
Nodes (24): EmailTemplates, bodyHtml(), Brand, brandSchema, EMAIL_TONES, EmailTemplate, emailTemplateSchema, EmailView (+16 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (20): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deal_messages`: the deal's chat (7b), `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes (+12 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.11
Nodes (32): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+24 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (22): CheckedFile, CheckLine, judge(), largest(), MEDIA_TYPES, RequirementResult, ImageFacts, Mark (+14 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (69): sendTimelineReminders(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), DealOverview, dealOverview(), DealStage (+61 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (44): send(), `buyer_questions`: questions about the agreement before signing, Engineering, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer (+36 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "ai/src/index.ts"
Cohesion: 0.05
Nodes (53): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), ModelCall (+45 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (48): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ScopeInput (+40 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Pillars.tsx"
Cohesion: 0.17
Nodes (17): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+9 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (42): SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem, TestDisputeReason (+34 more)

### Community 68 - "landing-words.ts"
Cohesion: 0.16
Nodes (20): LogoMark(), GLYPHS, SPOTS, at(), Closing(), LIMIT_GLYPHS, Tagline(), Dispute() (+12 more)

### Community 69 - "Database"
Cohesion: 0.04
Nodes (91): ReceiptMailDeps, McpRouteOptions, AppOptions, SignInOptions, ChatBus, DealCards, HubOptions, NotificationRouteOptions (+83 more)

### Community 70 - "AgentPanel.tsx"
Cohesion: 0.18
Nodes (15): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+7 more)

### Community 71 - "claim-analyses.ts"
Cohesion: 0.05
Nodes (40): disputedDeal(), ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord (+32 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (72): AMOUNT_OPTIONS, amountOption(), disputeIdOption, issuesText(), logProgress(), message(), readChecked(), readOptions() (+64 more)

### Community 74 - "auth/sign-in.ts"
Cohesion: 0.05
Nodes (62): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+54 more)

### Community 75 - "server/src/index.ts"
Cohesion: 0.13
Nodes (20): APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, DISPUTE_TASK_NAME, DRAFT_TASK_NAME (+12 more)

### Community 76 - "Agents.tsx"
Cohesion: 0.15
Nodes (16): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+8 more)

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
Cohesion: 0.07
Nodes (44): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+36 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.12
Nodes (31): alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions, EvalRecord (+23 more)

### Community 83 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (75): runPrepared(), draftCategories, CouncilRecord, councilRecordSchema, toCouncilRecord(), toJson(), usage, DraftJob (+67 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.12
Nodes (13): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+5 more)

### Community 87 - "postStep"
Cohesion: 0.15
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+20 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "milestone-routes.ts"
Cohesion: 0.07
Nodes (64): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), documentFor(), fingerprinted(), money, changeOrderRoutes() (+56 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "claim-job.ts"
Cohesion: 0.32
Nodes (18): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+10 more)

### Community 92 - "seller-connections.ts"
Cohesion: 0.13
Nodes (21): linkedSeller(), `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow (+13 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 96 - "DraftPanel.tsx"
Cohesion: 0.10
Nodes (30): addFile(), addPastedChat(), DealFile, draftsUrl(), DraftView, fileUrl(), getDraftById(), isFile() (+22 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (46): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+38 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "question-routes.test.ts"
Cohesion: 0.14
Nodes (15): db, FAILED, lineOf(), NOT_ANSWERABLE, QuestionView, quoting(), View, forwardInterruptedQuestions() (+7 more)

### Community 101 - "checker.ts"
Cohesion: 0.15
Nodes (11): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), renderDraftStarter(), RunnerBusyError, sameWorkflowTask() (+3 more)

### Community 102 - "resend-inbound.ts"
Cohesion: 0.21
Nodes (11): intakeFilename(), intakeEmail(), envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), ENTITIES (+3 more)

### Community 103 - "seller-app.ts"
Cohesion: 0.12
Nodes (21): APP_KEYS, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+13 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "IntakePanel.tsx"
Cohesion: 0.20
Nodes (13): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+5 more)

### Community 106 - "build.ts"
Cohesion: 0.20
Nodes (9): css, dist, faces, FONTS, home, problems, root, PAGES (+1 more)

### Community 107 - "Tour.tsx"
Cohesion: 0.19
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 108 - "app-link-routes.ts"
Cohesion: 0.24
Nodes (12): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView (+4 more)

### Community 109 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, tsx, @types/node, esbuild (+1 more)

### Community 110 - "Demo plan"
Cohesion: 0.12
Nodes (16): Buyers (each: a sandbox **Personal** account with the same email, to pay invoices), Cast, Chats, Demo plan, Maya's book of deals (written work only), Rules, Sellers (each: a sandbox **Business** account plus a REST app linked in PactPal), Story 1: Maya and Chris, a clean deal (nothing goes wrong) (+8 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "draft-routes.ts"
Cohesion: 0.14
Nodes (26): afterQuery, CHAT_TRANSCRIPT_PREFIX, chatNames(), ChatNames, ChatRouteOptions, chatRoutes(), messageView(), postBody (+18 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "detectMediaType"
Cohesion: 0.26
Nodes (10): sharp@0.35.5, isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), mediaTypeOf(), detectMediaType() (+2 more)

### Community 119 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fastify@^5.12.7, @modelcontextprotocol/sdk@1.32.1, @pactpal/claims@workspace:*, @pactpal/db@workspace:*, @pactpal/ledger@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:* (+9 more)

### Community 120 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "ref_zod"
Cohesion: 0.05
Nodes (72): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), dealParams, FoundDeal (+64 more)

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

### Community 129 - "react"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 131 - "Closing.tsx"
Cohesion: 0.25
Nodes (12): PILLARS, Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces() (+4 more)

### Community 132 - "README.md"
Cohesion: 0.16
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 133 - "app.test.ts"
Cohesion: 0.29
Nodes (5): closeOnSignals(), socketOrigin(), report, setup(), ConfigReport

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

### Community 150 - "claim-routes.ts"
Cohesion: 0.19
Nodes (23): appealApplies(), appealFacts(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+15 more)

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

### Community 158 - "email/src/index.ts"
Cohesion: 0.09
Nodes (28): NOTICE_LOOK, notificationEmail(), RFC-2606, emailAttachmentSchema, EmailFailure, EmailMessage, emailMessageSchema, SendResult (+20 more)

### Community 159 - "appeal-coverage.ts"
Cohesion: 0.33
Nodes (5): appealGaps(), missingFromPacket(), docItemId(), appealCheckSchema, ContentStore

### Community 160 - "image.ts"
Cohesion: 0.33
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "api.ts"
Cohesion: 0.04
Nodes (107): AgentRequestsPanel(), addBuyer(), AgentRequestView, answerAgentRequest(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict (+99 more)

### Community 165 - "server/package.json"
Cohesion: 0.13
Nodes (14): @pactpal/live@workspace:*, @pactpal/score@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/timeline, @pactpal/watcher (+6 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "check-words.ts"
Cohesion: 0.39
Nodes (6): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS

### Community 168 - "source"
Cohesion: 0.17
Nodes (12): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+4 more)

### Community 170 - "paypal-webhook.ts"
Cohesion: 0.12
Nodes (18): envelope, ParsedJson, parseJson(), PayPalWebhookOptions, paypalWebhookRoutes(), receive(), SELLER_WEBHOOK_PATH, SellerAlertLookup (+10 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (18): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+10 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 174 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 175 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 179 - "council"
Cohesion: 0.22
Nodes (9): title(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, council() (+1 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "receipt.test.ts"
Cohesion: 0.24
Nodes (8): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, receiptFormatAt(), document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

### Community 182 - "Privacy"
Cohesion: 0.50
Nodes (4): How long, Privacy, What PactPal keeps, Who else sees it

### Community 183 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 186 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

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

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1791 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `appendLedgerEvent`, `Insights.tsx`, `DealPage.tsx`, `dispute-sync.ts`, `artifacts.ts`, `receipt.ts`, `utcDateTime`, `claims/src/index.ts`, `postgresContentStore`, `db/src/index.ts`, `scope.ts`, `Dashboard.tsx`, `disputes/task.ts`, `ScopePanel.tsx`, `ref_zod`, `sandbox-clients.ts`, `threads.ts`, `draft-job.ts`, `DisputePage.tsx`, `council/src/index.ts`, `db/src/migrate.ts`, `dispute-actions.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `sandbox-partner-report.ts`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `delivery-check.test.ts`, `mcp.ts`, `eval-report.ts`, `layouts.tsx`, `templates.ts`, `config.ts`, `notifier.ts`, `postgres.ts`, `products/src/index.ts`, `appeal-items.ts`, `ledger/src/index.ts`, `readLedger`, `email/src/index.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `ai/src/index.ts`, `DraftReview.tsx`, `paypal/src/index.ts`, `landing-words.ts`, `AgentPanel.tsx`, `claim-analyses.ts`, `sandbox-respond-report.ts`, `auth/sign-in.ts`, `Agents.tsx`, `ai/src/index.ts`, `eval-runner.ts`, `scope-draft/src/index.ts`, `postStep`, `milestone-routes.ts`, `seller-connections.ts`, `sandbox-webhook-report.ts`, `SellerAppPanel.tsx`, `DraftPanel.tsx`, `render.ts`, `question-routes.test.ts`, `checker.ts`, `resend-inbound.ts`, `seller-app.ts`, `IntakePanel.tsx`, `devDependencies`, `Ledger.tsx`, `package.json`, `detectMediaType`, `Closing.tsx`, `app.test.ts`, `appeal-coverage.ts`, `check-words.ts`, `paypal-webhook.ts`, `pages.ts`, `design/tokens.ts`, `receipt.test.ts`, `log-labels.test.ts`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11616161616161616 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Deadlines.tsx` to `source`, `timeline/src/index.ts`, `paypal/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06189640035118525 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `paypal/src/index.ts` to `paypal/src/index.ts`, `claims/src/index.ts`, `ref_zod`, `DisputePage.tsx`, `council/src/index.ts`, `web/src/format.ts`, `Deadlines.tsx`, `appeal-items.ts`, `ledger/src/index.ts`, `readLedger`, `council`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `paypal/src/index.ts`, `Database`, `ai/src/index.ts`, `scope-draft/src/index.ts`, `seller-connections.ts`, `ref_zod`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.026450698080279233 - nodes in this community are weakly interconnected._