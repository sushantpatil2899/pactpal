# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 761 files · ~502,839 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 21 file(s) not represented in the graph (top: .css 15, (none) 5, .example 1)

## Summary
- 5862 nodes · 18326 edges · 206 communities (200 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 520 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `551608b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- milestone-routes.ts
- appendLedgerEvent
- Dashboard.tsx
- when
- acceptance.ts
- dispute-sync.ts
- MessagesPage.tsx
- receipt.ts
- email/src/index.ts
- claims/src/index.ts
- paypal-webhook.ts
- testId
- SellerAppPanel.tsx
- change-orders.ts
- Engineering
- PayPalResult
- ScopePanel.tsx
- ref_zod
- chat-state.ts
- .query
- draft-job.ts
- web-pages.test.ts
- when
- auth/sign-in.ts
- council/src/index.ts
- disputes/task.ts
- db/src/testing.ts
- app-link-routes.ts
- ai/src/index.ts
- api.ts
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- App.tsx
- Deadlines.tsx
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- Secret
- layouts.tsx
- build.js
- config.ts
- live-hub.ts
- acceptance-routes.ts
- products/src/index.ts
- Insights.tsx
- vitest
- ledger/src/index.ts
- test-app.ts
- web/package.json
- chat-routes.ts
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- sellers/disputes.test.ts
- DraftReview.tsx
- services
- seller-connections.ts
- scripts
- db/package.json
- addArtifact
- retention.test.ts
- ref_zod
- postgres.ts
- DeliverPanel.tsx
- claims/package.json
- sandbox-respond-report.ts
- Database
- claim-routes.ts
- Landing.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- eval-runner.ts
- disputes/test-support.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- routes.ts
- ai/package.json
- readLedger
- postgresContentStore
- scripts
- sandbox-webhook-report.ts
- council-record.ts
- isObject
- render.ts
- email/package.json
- compilerOptions
- artifacts.ts
- db/src/index.ts
- pdf/package.json
- landing-words.ts
- council/package.json
- DealPage.tsx
- dependencies
- IntakePanel.tsx
- timeline-progress.ts
- draft
- eval-runner.ts
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
- action-routes.test.ts
- sessions.ts
- change-order-routes.ts
- pages.ts
- index.md
- Redesign plan (proposed Phase 7R)
- QuestionsPanel.tsx
- Audience.tsx
- vite-env.d.ts
- src-app-tsx.md
- engines
- draft-changes.ts
- design/tokens.ts
- useRoute.ts
- dispute-routes.ts
- brand/src/index.ts
- record.ts
- build.ts
- log-labels.test.ts
- Getting started
- brand/package.json
- dependencies
- Phase 7 (deal space)
- source
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- devDependencies
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy

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
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
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

## Communities (206 total, 6 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.13
Nodes (34): AcceptanceDocument(), AcceptanceDocument, LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), STAGE_ORDER (+26 more)

### Community 1 - "milestone-routes.ts"
Cohesion: 0.12
Nodes (25): DealNotFoundError, dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid() (+17 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (73): declineTerms, originOf(), recordReceiptSent(), answerAgentRequest(), createAgentRequest(), finishAgentRequest(), lockedRequest(), shownCode() (+65 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.11
Nodes (31): CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR, STATUS_BAR (+23 more)

### Community 4 - "when"
Cohesion: 0.13
Nodes (34): AcceptancePanel(), ReceiptEmails(), AnswerBox(), Revisions, revisionWords(), acceptanceStep(), acceptanceUrl(), AcceptanceView (+26 more)

### Community 5 - "acceptance.ts"
Cohesion: 0.08
Nodes (33): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError (+25 more)

### Community 6 - "dispute-sync.ts"
Cohesion: 0.07
Nodes (49): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+41 more)

### Community 7 - "MessagesPage.tsx"
Cohesion: 0.13
Nodes (26): useWide(), Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People() (+18 more)

### Community 8 - "receipt.ts"
Cohesion: 0.08
Nodes (38): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+30 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.11
Nodes (30): answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER, StageFacts (+22 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.08
Nodes (59): AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+51 more)

### Community 11 - "paypal-webhook.ts"
Cohesion: 0.08
Nodes (28): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+20 more)

### Community 12 - "testId"
Cohesion: 0.07
Nodes (45): db, dealWithBuyer(), Conversation, db, db, goodsDeal(), SCOPE, WEBP (+37 more)

### Community 13 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.06
Nodes (51): AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError, ChangeOrderRefusal (+43 more)

### Community 15 - "Engineering"
Cohesion: 0.08
Nodes (21): Engineering, McpFallback, reasonOf(), createdInvoice, DraftInvoice, InvoiceDetails, InvoiceDraft, invoiceNote() (+13 more)

### Community 16 - "PayPalResult"
Cohesion: 0.06
Nodes (40): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList (+32 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (61): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), InvalidFieldsError, isChangeOrders(), proposeChange() (+53 more)

### Community 18 - "ref_zod"
Cohesion: 0.04
Nodes (85): RFC-2606, ClientOptions, EmailFailure, emailMessageSchema, bareAddress(), check, InboxNetworkError, ReadResult (+77 more)

### Community 19 - "chat-state.ts"
Cohesion: 0.10
Nodes (34): ChatView, getChat(), liveUrl(), ChatAction, chatReducer(), ChatState, Connection, initialChat (+26 more)

### Community 20 - ".query"
Cohesion: 0.11
Nodes (42): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), OVERVIEW_LIMIT, overviewOf() (+34 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.10
Nodes (42): MESSAGE_PROMPT_VERSIONS, MessageJob, MessageReviewView, ClaimContext, markedPrompt(), AnswerRefusal, checkAnswer(), CheckedAnswer (+34 more)

### Community 22 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 23 - "when"
Cohesion: 0.10
Nodes (39): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), DisputesView, getClaimAnalyses() (+31 more)

### Community 24 - "auth/sign-in.ts"
Cohesion: 0.16
Nodes (17): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), callbackQuery, cookieRules, currentSession() (+9 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (54): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), JsonSchema (+46 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.05
Nodes (66): publishingBus(), logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), formatErrors() (+58 more)

### Community 27 - "db/src/testing.ts"
Cohesion: 0.10
Nodes (27): at(), db, document(), savedDeal(), statusOf(), work, Row, assertUnchanged() (+19 more)

### Community 28 - "app-link-routes.ts"
Cohesion: 0.06
Nodes (40): APP_KEYS, Config, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+32 more)

### Community 29 - "ai/src/index.ts"
Cohesion: 0.07
Nodes (46): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, ModelCall (+38 more)

### Community 30 - "api.ts"
Cohesion: 0.05
Nodes (85): AgentRequestsPanel(), AgentRequestView, answerAgentRequest(), AnswerOptionView, AppealCheckView, AppealView, buildPacket(), BuiltPacket (+77 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (35): councilRecordOf(), two, DraftStepKind, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+27 more)

### Community 32 - "validate.ts"
Cohesion: 0.10
Nodes (35): allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, UNCLEAR_CATEGORY, paymentFromShare(), Share, shareOf(), sharesIn() (+27 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (48): RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), DraftSourceParts, messageLines(), minuteOf(), ROLE_WORDS (+40 more)

### Community 34 - "App.tsx"
Cohesion: 0.10
Nodes (38): getMe(), signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage (+30 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.09
Nodes (35): DealSummary, Money, StageView, StepView, RunningStepView, DealOverview, BAR_COLOURS, TODAY_LINE (+27 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (41): appealGaps(), missingFromPacket(), docItemId(), aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK (+33 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.11
Nodes (23): parseJsonReply(), checkAnalysis(), invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, linesOf(), AGREEMENT (+15 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "Secret"
Cohesion: 0.06
Nodes (31): checkMcp(), sellerKeyBox(), SecretBox, SecretBoxKeyError, box, KEY, OTHER_KEY, Secret (+23 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.08
Nodes (25): Me, IconName, PATHS, applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme() (+17 more)

### Community 42 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 43 - "config.ts"
Cohesion: 0.09
Nodes (27): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), ConfigReport, FEATURES, formatReport() (+19 more)

### Community 44 - "live-hub.ts"
Cohesion: 0.10
Nodes (15): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), db, hubOnTestDeal(), LiveHub (+7 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.09
Nodes (40): currentDocument(), buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent() (+32 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.10
Nodes (27): LISTING_CACHE_SECONDS, ListingRouteOptions, LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, photosBody, Channel3Lookup, LookupRefusal (+19 more)

### Community 47 - "Insights.tsx"
Cohesion: 0.12
Nodes (22): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, insightRows(), timing() (+14 more)

### Community 48 - "vitest"
Cohesion: 0.06
Nodes (32): db, agentDeal(), db, mcpClient(), ToolResult, CALLBACK_PATH, RETURN_COOKIE, STATE_COOKIE (+24 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.07
Nodes (54): isPicture(), lookUp(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), DISPUTE_EVENT_PREFIX, mediaTypeOf() (+46 more)

### Community 50 - "test-app.ts"
Cohesion: 0.04
Nodes (84): SESSION_COOKIE, chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened (+76 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (32): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @fontsource/instrument-serif, @fontsource-variable/geist (+24 more)

### Community 52 - "chat-routes.ts"
Cohesion: 0.11
Nodes (28): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, liveRoutes() (+20 more)

### Community 53 - "tools.ts"
Cohesion: 0.06
Nodes (55): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+47 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (20): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes (+12 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.06
Nodes (60): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+52 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.15
Nodes (20): CheckedFile, CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, Mark (+12 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (55): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), ChangeProposal (+47 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.05
Nodes (59): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+51 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "sellers/disputes.test.ts"
Cohesion: 0.07
Nodes (42): db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, fakeWriter(), sentStage(), fakeAppWebhooks() (+34 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (47): ChatLine, checkMessage(), Citation, CouncilView, DraftCandidate, DraftCategory, DraftMark, getMessages() (+39 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "seller-connections.ts"
Cohesion: 0.22
Nodes (12): linkedSeller(), claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow, endConnection(), first() (+4 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "addArtifact"
Cohesion: 0.06
Nodes (46): councilOf(), db, draftedAs(), idOf(), readDraft(), sellerDeal(), store, View (+38 more)

### Community 68 - "retention.test.ts"
Cohesion: 0.19
Nodes (14): `retention_runs`: each daily clean-up (9c), allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA, LooseKind (+6 more)

### Community 69 - "ref_zod"
Cohesion: 0.04
Nodes (101): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), liveQuery, LiveRouteOptions (+93 more)

### Community 70 - "postgres.ts"
Cohesion: 0.11
Nodes (14): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgClient (+6 more)

### Community 71 - "DeliverPanel.tsx"
Cohesion: 0.08
Nodes (35): addFile(), checksUrl(), DeliveryCheckView, fileUrl(), getDeliveryChecks(), isChecks(), isFile(), isReading() (+27 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (83): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+75 more)

### Community 74 - "Database"
Cohesion: 0.05
Nodes (68): ReceiptMailDeps, McpRouteOptions, AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report (+60 more)

### Community 75 - "claim-routes.ts"
Cohesion: 0.23
Nodes (20): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+12 more)

### Community 76 - "Landing.tsx"
Cohesion: 0.13
Nodes (14): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+6 more)

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

### Community 81 - "testSpec"
Cohesion: 0.05
Nodes (61): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), treeOfRuns() (+53 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.12
Nodes (30): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+22 more)

### Community 83 - "disputes/test-support.ts"
Cohesion: 0.10
Nodes (35): queuedDrafting(), inProcessChecker(), inProcessClaimRunner(), TaskStarter, AnalysesView, db, disputedDeal(), db (+27 more)

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
Cohesion: 0.15
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+20 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.07
Nodes (65): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, documentFor(), fingerprinted(), money, dealAccess(), visibleDeal() (+57 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "readLedger"
Cohesion: 0.07
Nodes (33): db, Answered, db, DeliveriesView, DeliveryView, entriesOf(), png(), disputeTypes() (+25 more)

### Community 92 - "postgresContentStore"
Cohesion: 0.09
Nodes (24): db, disputedDeal(), FILES, GOOD, SummariesView, AnalysisNotAllowedError, finishClaimAnalysis, startClaimAnalysis (+16 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (27): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+19 more)

### Community 95 - "council-record.ts"
Cohesion: 0.14
Nodes (20): runPrepared(), draftCategories, CouncilRecord, councilRecordSchema, isUnranked(), toCouncilRecord(), toJson(), usage (+12 more)

### Community 96 - "isObject"
Cohesion: 0.07
Nodes (60): addPastedChat(), checkPayments(), DealFile, draftFrom(), draftsUrl(), DraftView, errorMessage(), getDraftById() (+52 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "artifacts.ts"
Cohesion: 0.08
Nodes (24): storedPacketPdf(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+16 more)

### Community 101 - "db/src/index.ts"
Cohesion: 0.03
Nodes (116): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, agentBodySha256(), AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus (+108 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "landing-words.ts"
Cohesion: 0.19
Nodes (19): LogoMark(), at(), Closing(), LIMIT_GLYPHS, Tagline(), Dispute(), drift(), CLAIM (+11 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "DealPage.tsx"
Cohesion: 0.08
Nodes (40): addBuyer(), checkLedger(), getDeal(), LedgerCheck, listDeals(), makeBuyerLink(), BuyerPanel(), dateOf() (+32 more)

### Community 106 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+13 more)

### Community 107 - "IntakePanel.tsx"
Cohesion: 0.16
Nodes (19): createDeal(), DealOptions, getDealOptions(), getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isDeal() (+11 more)

### Community 108 - "timeline-progress.ts"
Cohesion: 0.07
Nodes (31): addCard(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+23 more)

### Community 109 - "draft"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 110 - "eval-runner.ts"
Cohesion: 0.17
Nodes (16): alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions, EvalRecord (+8 more)

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
Cohesion: 0.39
Nodes (8): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), listQuestions()

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
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

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
Cohesion: 0.11
Nodes (17): devDependencies, tsx, @types/node, @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/brand, tsx (+9 more)

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
Cohesion: 0.17
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
Cohesion: 0.11
Nodes (41): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+33 more)

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
Cohesion: 0.19
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 159 - "Pillars.tsx"
Cohesion: 0.27
Nodes (11): at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed(), VISUALS (+3 more)

### Community 160 - "image.ts"
Cohesion: 0.33
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 165 - "server/package.json"
Cohesion: 0.06
Nodes (32): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+24 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 168 - "action-routes.test.ts"
Cohesion: 0.09
Nodes (22): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+14 more)

### Community 169 - "sessions.ts"
Cohesion: 0.13
Nodes (24): isUniqueViolation(), dealBuyer, LINK_LIFETIME_MS, LinkNotAllowedError, linkRow, RedeemResult, deleteSession(), findSession() (+16 more)

### Community 170 - "change-order-routes.ts"
Cohesion: 0.12
Nodes (23): acceptBody, ChangeOrderRouteOptions, changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256 (+15 more)

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (19): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+11 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 174 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 175 - "Audience.tsx"
Cohesion: 0.33
Nodes (6): Audience(), GLYPHS, SPOTS, Sticker(), NOT_YET, StickerIcon

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "draft-changes.ts"
Cohesion: 0.21
Nodes (12): DraftContent, draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain() (+4 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

### Community 182 - "dispute-routes.ts"
Cohesion: 0.31
Nodes (10): CHECK_INTERVAL_MS, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputePageView(), disputeSummaryView(), listDisputeNotices() (+2 more)

### Community 183 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 184 - "record.ts"
Cohesion: 0.33
Nodes (9): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+1 more)

### Community 185 - "build.ts"
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, marked

### Community 186 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 189 - "dependencies"
Cohesion: 0.29
Nodes (7): dependencies, @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, marked, mermaid, @pactpal/brand

### Community 190 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 191 - "source"
Cohesion: 0.33
Nodes (6): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8)

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

### Community 196 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

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
- **134 isolated node(s):** `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`, `@pactpal/brand`, `mermaid` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1984 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `keyvalue.ts`, `milestone-routes.ts`, `Dashboard.tsx`, `Nav.tsx`, `acceptance.ts`, `dispute-sync.ts`, `MessagesPage.tsx`, `receipt.ts`, `email/src/index.ts`, `paypal-webhook.ts`, `testId`, `SellerAppPanel.tsx`, `change-orders.ts`, `Engineering`, `PayPalResult`, `ScopePanel.tsx`, `ref_zod`, `chat-state.ts`, `draft-job.ts`, `claim-job.ts`, `web-pages.test.ts`, `when`, `council/src/index.ts`, `db/src/testing.ts`, `app-link-routes.ts`, `ai/src/index.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `action-routes.test.ts`, `layouts.tsx`, `Secret`, `pages.ts`, `live-hub.ts`, `config.ts`, `products/src/index.ts`, `Insights.tsx`, `ledger/src/index.ts`, `test-app.ts`, `draft-changes.ts`, `design/tokens.ts`, `useRoute.ts`, `action-routes.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `log-labels.test.ts`, `sellers/disputes.test.ts`, `DraftReview.tsx`, `completeness.ts`, `addArtifact`, `postgres.ts`, `DeliverPanel.tsx`, `sandbox-respond-report.ts`, `Database`, `testSpec`, `eval-runner.ts`, `disputes/test-support.ts`, `postStep`, `routes.ts`, `readLedger`, `postgresContentStore`, `sandbox-webhook-report.ts`, `render.ts`, `artifacts.ts`, `landing-words.ts`, `DealPage.tsx`, `IntakePanel.tsx`, `eval-runner.ts`, `Ledger.tsx`, `package.json`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1254355400696864 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `Engineering`, `PayPalResult`, `timeline/src/index.ts`, `source`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Should `milestone-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11822660098522167 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Engineering` to `PayPalResult`, `ref_zod`, `claim-job.ts`, `when`, `council/src/index.ts`, `disputes/task.ts`, `app-link-routes.ts`, `ai/src/index.ts`, `api.ts`, `scope-draft/src/index.ts`, `Secret`, `ledger/src/index.ts`, `test-app.ts`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `paypal/src/index.ts`, `ref_zod`, `Database`, `testSpec`, `council-record.ts`, `draft`, `Decisions`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.04995004995004995 - nodes in this community are weakly interconnected._