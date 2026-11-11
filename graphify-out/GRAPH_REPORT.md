# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 741 files · ~495,972 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: .css 15, (none) 5, .example 1)

## Summary
- 5723 nodes · 18120 edges · 179 communities (174 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 520 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0d72ee36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- milestone-routes.ts
- errors.ts
- Dashboard.tsx
- DeliveriesPanel.tsx
- .query
- dispute-sync.ts
- MessagesPage.tsx
- words/src/index.ts
- email/src/index.ts
- claims/src/index.ts
- app.ts
- vitest
- api.ts
- acceptance.test.ts
- PayPalRestClient
- PayPalResult
- ScopePanel.tsx
- ref_zod
- chat-state.ts
- change-order-routes.ts
- draft-job.ts
- paypal-webhook.ts
- when
- auth/sign-in.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- seller-app.ts
- ai/src/index.ts
- AppealPanel.tsx
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- App.tsx
- Deadlines.tsx
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- mcp.ts
- layouts.tsx
- build.js
- config.ts
- notifier.ts
- acceptance-routes.ts
- products/src/index.ts
- Insights.tsx
- injection-runner.ts
- ledger/src/index.ts
- readLedger
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
- app-link-routes.ts
- MessagesPanel.tsx
- services
- seller-connections.ts
- scripts
- db/package.json
- scope-drafts.ts
- retention.test.ts
- ref_zod
- postgres.ts
- DraftPanel.tsx
- claims/package.json
- sandbox-respond-report.ts
- Database
- claim-routes.ts
- Landing.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- appeal.test.ts
- eval-runner.ts
- action-service.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- routes.ts
- ai/package.json
- src/summary.test.ts
- postgresContentStore
- scripts
- sandbox-webhook-report.ts
- council-record.ts
- readChecked
- render.ts
- email/package.json
- compilerOptions
- dealRoutes
- db/src/index.ts
- pdf/package.json
- landing-words.ts
- council/package.json
- DealPage.tsx
- dependencies
- IntakePanel.tsx
- chat.ts
- Engineering
- eval-runner.test.ts
- score/package.json
- PactPal product spec
- devDependencies
- questionRoutes
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- keyvalue.ts
- Layout
- Nav.tsx
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
- PactPal design system
- Council.tsx
- Pillars.tsx
- image.ts
- .prettierrc.json
- products/tsconfig.json
- Hero.tsx
- server/package.json
- docs/tsconfig.json
- Tour.tsx
- eval-scope.ts
- check-words.ts
- appeal-items.ts
- Row
- live-hub.ts
- Redesign plan (proposed Phase 7R)
- appeal-coverage.ts
- Audience.tsx
- vite-env.d.ts
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 219 edges
2. `Database` - 129 edges
3. `testId()` - 119 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 83 edges
6. `sha256Hex()` - 83 edges
7. `react` - 76 edges
8. `isObject()` - 74 edges
9. `TEST_NOW` - 68 edges
10. `Secret` - 66 edges

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

## Communities (179 total, 5 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.12
Nodes (34): LinkProblem, redeemLink(), SIGN_IN_PATH, NewDealPage(), STAGE_ORDER, Deadlines, DeadlinesPage(), DealsPage() (+26 more)

### Community 1 - "milestone-routes.ts"
Cohesion: 0.13
Nodes (22): dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid(), markInvoiceSent() (+14 more)

### Community 2 - "errors.ts"
Cohesion: 0.06
Nodes (36): dollar, setup(), PayPalApiError, PayPalErrorDetail, PayPalNetworkError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+28 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (39): CommandPalette(), PLACES, Dashboard(), DealList(), Cell, COLUMNS, DealsTable(), EXPORT (+31 more)

### Community 4 - "DeliveriesPanel.tsx"
Cohesion: 0.12
Nodes (30): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+22 more)

### Community 5 - ".query"
Cohesion: 0.04
Nodes (123): addCard(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+115 more)

### Community 6 - "dispute-sync.ts"
Cohesion: 0.08
Nodes (40): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+32 more)

### Community 7 - "MessagesPage.tsx"
Cohesion: 0.10
Nodes (32): Money, Overview, useWide(), Conversation, isConversation(), isLast(), LastMessage, listConversations() (+24 more)

### Community 8 - "words/src/index.ts"
Cohesion: 0.06
Nodes (55): dateTime(), receiptBlocks(), ChangeProposal, ChatLine, Citation, DraftContent, DraftView, ScopeInput (+47 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.12
Nodes (27): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+19 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.10
Nodes (50): PacketFacts, parseJsonReply(), ChatOutcome, AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION (+42 more)

### Community 11 - "app.ts"
Cohesion: 0.07
Nodes (41): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+33 more)

### Community 12 - "vitest"
Cohesion: 0.04
Nodes (103): db, mcpClient(), ToolResult, db, SESSION_COOKIE, db, dealWithBuyer(), maya (+95 more)

### Community 13 - "api.ts"
Cohesion: 0.04
Nodes (103): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView (+95 more)

### Community 14 - "acceptance.test.ts"
Cohesion: 0.08
Nodes (28): BASE, LISTING, AgreementListing, agreementListingSchema, buyerProvidesSchema, checkedScopeContentSchema, confirmedFromSchema, deliverableKindSchema (+20 more)

### Community 15 - "PayPalRestClient"
Cohesion: 0.07
Nodes (32): checks, APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+24 more)

### Community 16 - "PayPalResult"
Cohesion: 0.06
Nodes (42): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAction, DisputeAnswer (+34 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (72): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+64 more)

### Community 18 - "ref_zod"
Cohesion: 0.04
Nodes (71): RFC-2606, EmailFailure, bareAddress(), check, InboxNetworkError, ReadResult, receivedAnswer, ReceivedEmail (+63 more)

### Community 19 - "chat-state.ts"
Cohesion: 0.10
Nodes (36): chatUrl(), ChatView, getChat(), liveUrl(), postChat(), ChatAction, chatReducer(), ChatState (+28 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (56): documentFor(), sendTimelineReminders(), acceptBody, ChangeOrderRouteOptions, changeOrderRoutes(), view(), waitingChange(), changeParams (+48 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.09
Nodes (42): toCouncilRecord(), JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), AnswerRefusal, checkAnswer() (+34 more)

### Community 22 - "paypal-webhook.ts"
Cohesion: 0.09
Nodes (13): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+5 more)

### Community 23 - "when"
Cohesion: 0.09
Nodes (49): emailFor(), actionLines(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy() (+41 more)

### Community 24 - "auth/sign-in.ts"
Cohesion: 0.09
Nodes (38): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+30 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (50): draftCategories, DraftJob, EvalOptions, EvalRecord, JsonSchema, TokenUsage, aggregate(), AggregateOptions (+42 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.06
Nodes (52): Config, CronStart, runCronJob(), BUTTON_WINDOW_MS, checkKey(), CheckRequest, renderClaimRunner(), renderDraftStarter() (+44 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.29
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, migrationStatus, readApplied() (+3 more)

### Community 28 - "seller-app.ts"
Cohesion: 0.13
Nodes (20): APP_KEYS, checkAsSellerApp(), message(), result, APP_LABELS, appSection(), formatSandboxReport(), LoginCheck (+12 more)

### Community 29 - "ai/src/index.ts"
Cohesion: 0.06
Nodes (50): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, ClaimJobDeps (+42 more)

### Community 30 - "AppealPanel.tsx"
Cohesion: 0.07
Nodes (48): AppealCheckView, AppealView, buildPacket(), CouncilView, draftSummary(), getAppeal(), getPacketView(), getResponses() (+40 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (29): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES, ChatCase (+21 more)

### Community 32 - "validate.ts"
Cohesion: 0.12
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, DraftStep (+23 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (40): ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, linesOf() (+32 more)

### Community 34 - "App.tsx"
Cohesion: 0.09
Nodes (37): signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage (+29 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.10
Nodes (30): RunningStepView, BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent (+22 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (45): addedByRole(), aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER (+37 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.16
Nodes (12): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+4 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.09
Nodes (32): checkAnalysis(), ClaimAnalysis, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT, CLAIM, context (+24 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "mcp.ts"
Cohesion: 0.15
Nodes (16): checkMcp(), PayPalMcpError, noAnswer(), setupError(), describe(), McpClientOptions, McpTransportFactory, PayPalMcpClient (+8 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.10
Nodes (29): Me, IconName, Logo(), applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme() (+21 more)

### Community 42 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 43 - "config.ts"
Cohesion: 0.09
Nodes (31): result, loadConfigOrExit(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars() (+23 more)

### Community 44 - "notifier.ts"
Cohesion: 0.06
Nodes (36): McpRouteOptions, BusSignal, ChatBus, Card, DealCards, messageView(), HubOptions, LiveHub (+28 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (44): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), fingerprinted(), money (+36 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.07
Nodes (32): LISTING_CACHE_SECONDS, ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+24 more)

### Community 47 - "Insights.tsx"
Cohesion: 0.10
Nodes (29): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+21 more)

### Community 48 - "injection-runner.ts"
Cohesion: 0.12
Nodes (27): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), ClaimText (+19 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (75): isPicture(), DISPUTE_EVENT_PREFIX, agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactKind, ArtifactLimits (+67 more)

### Community 50 - "readLedger"
Cohesion: 0.03
Nodes (173): agentDeal(), db, chatDeal(), Card, db, savedDeal(), send(), signedDeal() (+165 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (31): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+23 more)

### Community 52 - "draft-routes.ts"
Cohesion: 0.08
Nodes (45): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, ChatRouteOptions, chatRoutes(), postBody, REFUSALS, sendRefusal() (+37 more)

### Community 53 - "tools.ts"
Cohesion: 0.06
Nodes (50): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+42 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.06
Nodes (42): review(), paid(), at(), source(), seller(), title(), changes(), entry() (+34 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.12
Nodes (28): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+20 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.15
Nodes (19): CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, Transparency, Mark, CheckedLook (+11 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (44): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), LABEL (+36 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.07
Nodes (37): SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem (+29 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "app-link-routes.ts"
Cohesion: 0.09
Nodes (18): linkBody, SELLER_APP_PATH, SellerAppLinking, sellerAppView, box, db, keys, SCOPES (+10 more)

### Community 62 - "MessagesPanel.tsx"
Cohesion: 0.23
Nodes (12): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+4 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "seller-connections.ts"
Cohesion: 0.12
Nodes (25): linkedDisputeAccounts(), linkedSeller(), `acceptances`: signed agreements, claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase (+17 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.09
Nodes (28): db, sellerDeal(), withReadyDraft(), runDraftTask(), forwardInterruptedQuestions(), ANSWER, at(), awaiting() (+20 more)

### Community 68 - "retention.test.ts"
Cohesion: 0.15
Nodes (18): allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA, LooseKind, purgeDeal() (+10 more)

### Community 69 - "ref_zod"
Cohesion: 0.07
Nodes (52): DealLookup, dealParams, featureAnswers(), step(), FoundDeal, Refusal, CompletenessRouteOptions, checkBody (+44 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (39): addFile(), addPastedChat(), DealFile, draftFrom(), draftsUrl(), fileUrl(), getDraftById(), isFile() (+31 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (81): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+73 more)

### Community 74 - "Database"
Cohesion: 0.07
Nodes (51): AppOptions, SignInOptions, ReminderDeps, DraftRouteOptions, CHECK_INTERVAL_MS, MilestoneRouteOptions, sendBody, SendOutcome (+43 more)

### Community 75 - "claim-routes.ts"
Cohesion: 0.23
Nodes (21): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+13 more)

### Community 76 - "Landing.tsx"
Cohesion: 0.12
Nodes (16): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+8 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (25): Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+17 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "appeal.test.ts"
Cohesion: 0.11
Nodes (17): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+9 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.12
Nodes (30): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+22 more)

### Community 83 - "action-service.ts"
Cohesion: 0.15
Nodes (14): deliverAction(), failedOutcome(), newestReady(), send(), DisputeMessageView, keptFields, openedAt(), SELLER_ANSWERS (+6 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.11
Nodes (14): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+6 more)

### Community 87 - "postStep"
Cohesion: 0.14
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+23 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.07
Nodes (57): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, DeliveryRouteOptions, deliveryRoutes(), answer() (+49 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "src/summary.test.ts"
Cohesion: 0.13
Nodes (21): checkSummary(), PacketSummary, packetSummarySchema, readSummary(), buildSummaryMessages(), ExhibitLine, MAX_NOTE_CHARS, SUMMARY_PROMPT_VERSION (+13 more)

### Community 92 - "postgresContentStore"
Cohesion: 0.04
Nodes (68): db, disputedDeal(), FILES, GOOD, SummariesView, ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError (+60 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "council-record.ts"
Cohesion: 0.14
Nodes (19): councilRecordOf(), CouncilRecord, councilRecordSchema, isUnranked(), two, usage, categoryLabels, describeDraft() (+11 more)

### Community 96 - "readChecked"
Cohesion: 0.16
Nodes (22): addBuyer(), checkPayments(), createDeal(), DealSummary, errorMessage(), getDealOptions(), getMilestones(), isDeal() (+14 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "dealRoutes"
Cohesion: 0.13
Nodes (24): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), dealAccess(), visibleDeal() (+16 more)

### Community 101 - "db/src/index.ts"
Cohesion: 0.02
Nodes (157): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, getAgentRequest(), listOpenAgentRequests() (+149 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "landing-words.ts"
Cohesion: 0.19
Nodes (18): at(), Closing(), LIMIT_GLYPHS, Tagline(), Dispute(), drift(), CLAIM, FAQ (+10 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "DealPage.tsx"
Cohesion: 0.06
Nodes (57): checkLedger(), getDeal(), getMe(), LedgerCheck, LedgerEntryView, ScopeTerms, ScopeView, StageView (+49 more)

### Community 106 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 107 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

### Community 108 - "chat.ts"
Cohesion: 0.12
Nodes (19): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), lastMessages(), lastSeq (+11 more)

### Community 109 - "Engineering"
Cohesion: 0.17
Nodes (14): draft(), unchanged(), `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, Engineering, council(), deps(), DRAFTS (+6 more)

### Community 110 - "eval-runner.test.ts"
Cohesion: 0.18
Nodes (11): councilDeps(), isRankingRequest(), clients(), down, invented, model(), wrongCategory, chatLines() (+3 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "questionRoutes"
Cohesion: 0.20
Nodes (15): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), questionForSellerEmail() (+7 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.25
Nodes (8): AI, Decisions, Demo (9b), Partner tools, Product, Redesign (Phase 7R), Render (9R), Retention and privacy (9c)

### Community 119 - "dependencies"
Cohesion: 0.06
Nodes (31): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+23 more)

### Community 120 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

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
Cohesion: 0.18
Nodes (10): devDependencies, @types/node, @types/node, main, name, private, scripts, typecheck (+2 more)

### Community 125 - "live/package.json"
Cohesion: 0.18
Nodes (10): dependencies, zod, zod, main, name, private, scripts, typecheck (+2 more)

### Community 126 - "net/package.json"
Cohesion: 0.18
Nodes (10): devDependencies, @types/node, @types/node, main, name, private, scripts, typecheck (+2 more)

### Community 127 - "timeline/package.json"
Cohesion: 0.18
Nodes (10): dependencies, zod, zod, main, name, private, scripts, typecheck (+2 more)

### Community 128 - "docs/package.json"
Cohesion: 0.10
Nodes (23): dependencies, marked, devDependencies, tsx, @types/node, tsx, @types/node, name (+15 more)

### Community 129 - "keyvalue.ts"
Cohesion: 0.22
Nodes (5): connectKeyValue(), keyValueStore(), memoryStore(), RedisCommands, redis

### Community 130 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 131 - "Nav.tsx"
Cohesion: 0.30
Nodes (11): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+3 more)

### Community 132 - "README.md"
Cohesion: 0.18
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
Cohesion: 0.25
Nodes (22): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+14 more)

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

### Community 158 - "Council.tsx"
Cohesion: 0.21
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 159 - "Pillars.tsx"
Cohesion: 0.27
Nodes (11): at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed(), VISUALS (+3 more)

### Community 160 - "image.ts"
Cohesion: 0.35
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 165 - "server/package.json"
Cohesion: 0.06
Nodes (34): devDependencies, esbuild, tsx, @types/node, @types/ws, @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council (+26 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 168 - "eval-scope.ts"
Cohesion: 0.12
Nodes (20): logProgress(), valueOrExit(), modelNames(), DroppedDraft, droppedSection(), ruleOf(), runCase(), runEvals() (+12 more)

### Community 169 - "check-words.ts"
Cohesion: 0.31
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

### Community 170 - "appeal-items.ts"
Cohesion: 0.19
Nodes (13): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+5 more)

### Community 171 - "Row"
Cohesion: 0.27
Nodes (6): Row, PgClient, PgConnection, createTestDatabase(), Engine, queryOn()

### Community 172 - "live-hub.ts"
Cohesion: 0.14
Nodes (13): Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), db, hubOnTestDeal(), CHAT_CHANNEL (+5 more)

### Community 173 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 174 - "appeal-coverage.ts"
Cohesion: 0.39
Nodes (5): appealGaps(), missingFromPacket(), docItemId(), appealCheckSchema, PacketExhibit

### Community 175 - "Audience.tsx"
Cohesion: 0.33
Nodes (6): Audience(), GLYPHS, SPOTS, Sticker(), NOT_YET, StickerIcon

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

## Knowledge Gaps
- **124 isolated node(s):** `@types/node`, `tsx`, `../../tsconfig.base.json`, `@modelcontextprotocol/sdk`, `@pactpal/ai` (+119 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1892 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `milestone-routes.ts`, `errors.ts`, `Dashboard.tsx`, `.query`, `dispute-sync.ts`, `MessagesPage.tsx`, `words/src/index.ts`, `email/src/index.ts`, `app.ts`, `api.ts`, `acceptance.test.ts`, `PayPalRestClient`, `PayPalResult`, `ScopePanel.tsx`, `ref_zod`, `chat-state.ts`, `change-order-routes.ts`, `draft-job.ts`, `paypal-webhook.ts`, `when`, `council/src/index.ts`, `disputes/task.ts`, `db/src/migrate.ts`, `seller-app.ts`, `ai/src/index.ts`, `AppealPanel.tsx`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `mcp.ts`, `layouts.tsx`, `config.ts`, `acceptance-routes.ts`, `products/src/index.ts`, `Insights.tsx`, `injection-runner.ts`, `ledger/src/index.ts`, `readLedger`, `Built (sub-phases 2b to 6h-1)`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `app-link-routes.ts`, `MessagesPanel.tsx`, `seller-connections.ts`, `scope-drafts.ts`, `retention.test.ts`, `postgres.ts`, `DraftPanel.tsx`, `sandbox-respond-report.ts`, `appeal.test.ts`, `eval-runner.ts`, `routes.ts`, `src/summary.test.ts`, `postgresContentStore`, `sandbox-webhook-report.ts`, `council-record.ts`, `render.ts`, `db/src/index.ts`, `landing-words.ts`, `DealPage.tsx`, `IntakePanel.tsx`, `chat.ts`, `Engineering`, `eval-runner.test.ts`, `Ledger.tsx`, `package.json`, `docs/package.json`, `keyvalue.ts`, `Nav.tsx`, `eval-scope.ts`, `check-words.ts`, `appeal-items.ts`, `live-hub.ts`, `appeal-coverage.ts`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **What connects `@types/node`, `tsx`, `../../tsconfig.base.json` to the rest of the system?**
  _124 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1184939091915836 - nodes in this community are weakly interconnected._
- **Why does `react` connect `AppealPanel.tsx` to `pages.tsx`, `Dashboard.tsx`, `DeliveriesPanel.tsx`, `Nav.tsx`, `MessagesPage.tsx`, `api.ts`, `ScopePanel.tsx`, `chat-state.ts`, `when`, `Council.tsx`, `Pillars.tsx`, `App.tsx`, `Deadlines.tsx`, `Hero.tsx`, `Tour.tsx`, `layouts.tsx`, `Insights.tsx`, `Audience.tsx`, `web/package.json`, `MessagesPanel.tsx`, `DraftPanel.tsx`, `Landing.tsx`, `postStep`, `readChecked`, `landing-words.ts`, `DealPage.tsx`, `IntakePanel.tsx`, `Ledger.tsx`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Should `milestone-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Engineering` to `errors.ts`, `email/src/index.ts`, `claims/src/index.ts`, `PayPalResult`, `ref_zod`, `when`, `council/src/index.ts`, `seller-app.ts`, `ai/src/index.ts`, `AppealPanel.tsx`, `appeal-items.ts`, `ledger/src/index.ts`, `readLedger`, `draft-routes.ts`, `Built (sub-phases 2b to 6h-1)`, `paypal/src/index.ts`, `seller-connections.ts`, `council-record.ts`, `Decisions`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Should `errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06140350877192982 - nodes in this community are weakly interconnected._