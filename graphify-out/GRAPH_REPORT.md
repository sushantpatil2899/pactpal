# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 780 files · ~517,848 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 5984 nodes · 18690 edges · 203 communities (196 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 525 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `322cf9c3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- paypal/src/index.ts
- appendLedgerEvent
- overview-api.ts
- DeliverPanel.tsx
- when
- delivery-routes.ts
- layouts.tsx
- words/src/index.ts
- email/src/index.ts
- claims/src/index.ts
- PayPalRestClient
- db/src/testing.ts
- vitest
- change-orders.ts
- DealPage.tsx
- createDeal
- ScopePanel.tsx
- ref_zod
- question-routes.ts
- acceptance-routes.ts
- scope-routes.ts
- sellers/disputes.test.ts
- timeline-routes.ts
- tools.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- AccessTokenProvider
- appeal-items.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- notices.ts
- scope-draft/src/index.ts
- App.tsx
- deadline-rows.ts
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- MessagesPage.tsx
- acceptance.ts
- build.js
- config.ts
- Deal
- postgres.ts
- products/src/index.ts
- chat-state.ts
- dependencies
- ledger/src/index.ts
- test-app.ts
- web/package.json
- deals/routes.ts
- resend-inbound.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- PayPalResult
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- readLedger
- scripts
- db/package.json
- scope-drafts.ts
- Insights.tsx
- question-routes.ts
- dispute-actions.ts
- disputes/test-support.ts
- claims/package.json
- sandbox-respond-report.ts
- Landing.tsx
- Deadlines.tsx
- task.test.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- vitest
- eval-runner.ts
- seller-connections.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- Database
- ai/package.json
- gantt-rows.ts
- PacketPanel.tsx
- scripts
- sandbox-webhook-report.ts
- Pillars.tsx
- api.ts
- render.ts
- email/package.json
- compilerOptions
- check-words.ts
- db/src/index.ts
- pdf/package.json
- IntakePanel.tsx
- council/package.json
- Agents.tsx
- build.ts
- landing-words.ts
- claim-job.ts
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- react
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- readChecked
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- AgentPanel.tsx
- Layout
- packets.ts
- README.md
- DealsTable.tsx
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
- DraftPanel.tsx
- Nav.tsx
- image.ts
- .prettierrc.json
- products/tsconfig.json
- keyvalue.ts
- server/package.json
- docs/tsconfig.json
- Council.tsx
- retention.ts
- testId
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- app-link-routes.ts
- devDependencies
- dispute-sync.ts
- vite-env.d.ts
- src-app-tsx.md
- engines
- Tour.tsx
- design/tokens.ts
- scripts
- source
- Hero.tsx
- PayPal sandbox notes
- appeal-coverage.ts
- log-labels.test.ts
- Getting started
- brand/package.json
- dependencies
- Connect your AI agent
- When a buyer disputes
- PactPal help
- brand/tsconfig.json
- Agreements and the timeline
- How PactPal is built
- For your buyer
- Chat, Messages and reminders
- Delivering work
- The evidence log
- What PactPal is and is not
- Privacy

## God Nodes (most connected - your core abstractions)
1. `vitest` - 226 edges
2. `Database` - 129 edges
3. `testId()` - 119 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 83 edges
6. `sha256Hex()` - 83 edges
7. `react` - 79 edges
8. `isObject()` - 74 edges
9. `TEST_NOW` - 68 edges
10. `Secret` - 66 edges

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

## Communities (203 total, 7 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.12
Nodes (39): createDeal(), DealOptions, getDealOptions(), LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList() (+31 more)

### Community 1 - "paypal/src/index.ts"
Cohesion: 0.04
Nodes (70): InvoiceArgs, `buyer_questions`: questions about the agreement before signing, 1. Architecture and structure, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), dollar (+62 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.04
Nodes (102): acceptTerms, declineTerms, lockFor(), originOf(), recordReceiptSent(), requestAcceptance, setStatus(), signaturePayload() (+94 more)

### Community 3 - "overview-api.ts"
Cohesion: 0.13
Nodes (29): DealSummary, listDeals(), Money, CommandPalette(), PLACES, dueWords(), initials(), matchingDeals() (+21 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.14
Nodes (29): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+21 more)

### Community 5 - "when"
Cohesion: 0.10
Nodes (38): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), DisputesView, getClaimAnalyses() (+30 more)

### Community 6 - "delivery-routes.ts"
Cohesion: 0.08
Nodes (54): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+46 more)

### Community 7 - "layouts.tsx"
Cohesion: 0.09
Nodes (32): Me, Icon(), IconName, PATHS, Logo(), applyTheme(), nextTheme(), ORDER (+24 more)

### Community 8 - "words/src/index.ts"
Cohesion: 0.08
Nodes (44): ACCEPTANCE_NOTICE, acceptanceDocumentSchema, acceptedPayload, BRANDED_RECEIPTS_FROM, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT (+36 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.08
Nodes (59): EMAIL_LOGO_PATH, answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf() (+51 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (75): Prepared, AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages() (+67 more)

### Community 11 - "PayPalRestClient"
Cohesion: 0.06
Nodes (39): checkMcp(), Call, item, json(), Reply, setup(), tokenReply(), SANDBOX_API_BASE_URL (+31 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.09
Nodes (39): db, db, db, refusal(), db, disputed(), db, PNG (+31 more)

### Community 13 - "vitest"
Cohesion: 0.09
Nodes (25): db, SESSION_COOKIE, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page() (+17 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.04
Nodes (60): TypedStage, `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder (+52 more)

### Community 15 - "DealPage.tsx"
Cohesion: 0.06
Nodes (58): checkLedger(), getDeal(), LedgerCheck, ScopeTerms, ScopeView, chatUrl(), getNotifications(), getPastedChats() (+50 more)

### Community 16 - "createDeal"
Cohesion: 0.09
Nodes (34): dealWithBuyer(), db, later, sellerWithDeal(), sellerWithoutBuyer(), addBuyer, BuyerNotAllowedError, createDeal() (+26 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (63): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+55 more)

### Community 18 - "ref_zod"
Cohesion: 0.04
Nodes (71): RFC-2606, ClientOptions, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check (+63 more)

### Community 19 - "question-routes.ts"
Cohesion: 0.09
Nodes (29): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+21 more)

### Community 20 - "acceptance-routes.ts"
Cohesion: 0.09
Nodes (35): currentDocument(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, receiptsSent() (+27 more)

### Community 21 - "scope-routes.ts"
Cohesion: 0.10
Nodes (25): councilDeps(), councilRecordOf(), typedStageSchema, beginDraft(), chosenDraft(), SCOPE_REFUSALS, scopeBody, ScopeRouteOptions (+17 more)

### Community 22 - "sellers/disputes.test.ts"
Cohesion: 0.08
Nodes (35): db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, fakeDisputes(), fakeAppWebhooks(), fakePayPal() (+27 more)

### Community 23 - "timeline-routes.ts"
Cohesion: 0.09
Nodes (49): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, documentFor(), fingerprinted(), money, sendTimelineReminders(), acceptBody (+41 more)

### Community 24 - "tools.ts"
Cohesion: 0.04
Nodes (78): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+70 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (53): draft(), unchanged(), `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, Engineering, JsonSchema, TokenUsage, aggregate() (+45 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.08
Nodes (43): publishingBus(), Config, formatErrors(), CronStart, runCronJob(), renderWorkflowChecker(), APPEAL_TASK_NAME, CLAIM_TASK_NAME (+35 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.17
Nodes (15): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied() (+7 more)

### Community 28 - "AccessTokenProvider"
Cohesion: 0.09
Nodes (27): APP_KEYS, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection(), formatSandboxReport() (+19 more)

### Community 29 - "appeal-items.ts"
Cohesion: 0.13
Nodes (17): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+9 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.11
Nodes (33): AppealCheckView, AppealView, checkAppeal(), CouncilView, draftResponse(), draftStatement(), getAppeal(), getResponses() (+25 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.06
Nodes (61): same, chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), build() (+53 more)

### Community 32 - "notices.ts"
Cohesion: 0.12
Nodes (30): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+22 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.05
Nodes (77): categoryLabels, describeDraft(), DraftView, priceMinor(), claimLines(), ClaimText, linesOf(), allowedCategoryIds() (+69 more)

### Community 34 - "App.tsx"
Cohesion: 0.09
Nodes (36): getMe(), signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage (+28 more)

### Community 35 - "deadline-rows.ts"
Cohesion: 0.23
Nodes (12): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+4 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.16
Nodes (12): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+4 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.06
Nodes (59): MessageJob, checkAnalysis(), ClaimAnalysis, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT (+51 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.10
Nodes (40): draftCategories, DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection() (+32 more)

### Community 40 - "MessagesPage.tsx"
Cohesion: 0.13
Nodes (26): useWide(), Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People() (+18 more)

### Community 41 - "acceptance.ts"
Cohesion: 0.09
Nodes (27): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTermsSchema, checkedAcceptance(), declineReasonSchema (+19 more)

### Community 42 - "build.js"
Cohesion: 0.17
Nodes (8): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), webSource, esbuild

### Community 43 - "config.ts"
Cohesion: 0.07
Nodes (34): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+26 more)

### Community 44 - "Deal"
Cohesion: 0.06
Nodes (30): McpRouteOptions, BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), addCard() (+22 more)

### Community 45 - "postgres.ts"
Cohesion: 0.11
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open() (+7 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.12
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 47 - "chat-state.ts"
Cohesion: 0.11
Nodes (33): ChatView, getChat(), liveUrl(), ChatAction, chatReducer(), ChatState, Connection, initialChat (+25 more)

### Community 48 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/core-enterprise, @bryntum/gantt-enterprise (+17 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (59): isPicture(), MAX_PHOTO_SIDE, toJpeg(), agentBodySha256(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError (+51 more)

### Community 50 - "test-app.ts"
Cohesion: 0.05
Nodes (64): agentDeal(), db, mcpClient(), ToolResult, chatDeal(), db, MessageBody, db (+56 more)

### Community 51 - "web/package.json"
Cohesion: 0.09
Nodes (21): @fontsource/instrument-serif, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/brand, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline, @pactpal/watcher (+13 more)

### Community 52 - "deals/routes.ts"
Cohesion: 0.06
Nodes (71): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), afterQuery, ChatNames (+63 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.12
Nodes (21): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+13 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (24): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `claim_analyses`: council comparisons of a dispute claim with the record, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `delivery_checks`: the seller's pre-delivery checks (+16 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.10
Nodes (35): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+27 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (25): looks(), CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, Transparency (+17 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (46): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), LABEL (+38 more)

### Community 59 - "PayPalResult"
Cohesion: 0.07
Nodes (30): send(), PayPal integration, evidenceForm(), MAX_DISPUTE_PAGES, PayPalDisputes, accepted, fullDispute, listed() (+22 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.05
Nodes (58): isRankingRequest(), model(), isRanking(), member(), model(), model(), treeOfRuns(), askModel() (+50 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (42): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+34 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "readLedger"
Cohesion: 0.10
Nodes (24): db, Card, db, savedDeal(), send(), signedDeal(), types(), View (+16 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.12
Nodes (25): checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow, DraftStateError (+17 more)

### Community 68 - "Insights.tsx"
Cohesion: 0.12
Nodes (22): count, dealsSource(), Source, STARTING_REPORT, title(), InsightRow, insightRows(), timing() (+14 more)

### Community 69 - "question-routes.ts"
Cohesion: 0.06
Nodes (67): CHAT_TRANSCRIPT_PREFIX, featureAnswers(), step(), readBody(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes() (+59 more)

### Community 70 - "dispute-actions.ts"
Cohesion: 0.10
Nodes (26): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+18 more)

### Community 71 - "disputes/test-support.ts"
Cohesion: 0.07
Nodes (35): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+27 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (98): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+90 more)

### Community 74 - "Landing.tsx"
Cohesion: 0.13
Nodes (14): Audience(), Sticker(), Council(), ART, at(), dots(), Features(), Landing() (+6 more)

### Community 75 - "Deadlines.tsx"
Cohesion: 0.13
Nodes (17): getDisputePage(), BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, COLUMNS, LABELS, useEvidence() (+9 more)

### Community 76 - "task.test.ts"
Cohesion: 0.09
Nodes (29): BUTTON_WINDOW_MS, checkKey(), inProcessChecker(), inProcessClaimRunner(), renderClaimRunner(), renderDraftStarter(), RunnerBusyError, sameWorkflowTask() (+21 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (26): Moving a dispute to a verdict, Accounts and connection, AI, Disputes, Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026) (+18 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "vitest"
Cohesion: 0.05
Nodes (59): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, logProgress() (+51 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.13
Nodes (27): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+19 more)

### Community 83 - "seller-connections.ts"
Cohesion: 0.15
Nodes (17): linkedSeller(), claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow, endConnection(), first() (+9 more)

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
Cohesion: 0.17
Nodes (27): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), makeRefundOffer() (+19 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "Database"
Cohesion: 0.03
Nodes (91): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), LinkOptions (+83 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "gantt-rows.ts"
Cohesion: 0.23
Nodes (8): StageView, RunningStepView, doneDay(), GanttLink, ganttRows, GanttTask, noteFor(), PAYMENT_WORDS

### Community 92 - "PacketPanel.tsx"
Cohesion: 0.16
Nodes (19): buildPacket(), disputesUrl(), draftSummary(), getPacketView(), getSummaries(), isBuiltPacket(), isPacketView(), isSummaries() (+11 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.06
Nodes (36): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+28 more)

### Community 95 - "Pillars.tsx"
Cohesion: 0.16
Nodes (18): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+10 more)

### Community 96 - "api.ts"
Cohesion: 0.05
Nodes (80): AgentRequestsPanel(), AgentRequestView, answerAgentRequest(), AnswerOptionView, BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus (+72 more)

### Community 97 - "render.ts"
Cohesion: 0.09
Nodes (28): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, ACCENT_INK, Branding, breakWord() (+20 more)

### Community 98 - "email/package.json"
Cohesion: 0.10
Nodes (19): dependencies, mustache, @pactpal/net, zod, devDependencies, @types/mustache, @types/node, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

### Community 101 - "db/src/index.ts"
Cohesion: 0.03
Nodes (124): PayPalWebhookOptions, body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+116 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "IntakePanel.tsx"
Cohesion: 0.22
Nodes (13): getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret(), turnOffIntakeSecret() (+5 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Agents.tsx"
Cohesion: 0.14
Nodes (16): CanCannot(), BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at() (+8 more)

### Community 106 - "build.ts"
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, marked

### Community 107 - "landing-words.ts"
Cohesion: 0.14
Nodes (24): GLYPHS, SPOTS, at(), Closing(), LIMIT_GLYPHS, Tagline(), Dispute(), drift() (+16 more)

### Community 108 - "claim-job.ts"
Cohesion: 0.35
Nodes (17): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+9 more)

### Community 109 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 110 - "Demo plan"
Cohesion: 0.11
Nodes (17): Buyers (each: a sandbox **Personal** account with the same email and sandbox balance, to pay invoices), Cast, Chats, Demo plan, Done by the owner, How the inboxes work (set up 11 Nov 2026), Maya's book of deals (written work only), Rules (+9 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "react"
Cohesion: 0.12
Nodes (31): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+23 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.20
Nodes (10): AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product, Redesign (Phase 7R) (+2 more)

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

### Community 123 - "readChecked"
Cohesion: 0.21
Nodes (17): addBuyer(), checkPayments(), errorMessage(), getMilestones(), isDeal(), isMilestones(), makeBuyerLink(), milestonesUrl() (+9 more)

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

### Community 129 - "AgentPanel.tsx"
Cohesion: 0.22
Nodes (13): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+5 more)

### Community 131 - "packets.ts"
Cohesion: 0.14
Nodes (14): ContentStore, listPackets(), MAX_PACKETS_PER_DISPUTE, NewPacket, newPacketSchema, PacketExhibit, packetExhibitSchema, PacketNotAllowedError (+6 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "DealsTable.tsx"
Cohesion: 0.14
Nodes (14): giveAgLicence(), grid, load(), studio, Cell, COLUMNS, DealsTable(), EXPORT (+6 more)

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
Cohesion: 0.18
Nodes (24): appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView, entryOf() (+16 more)

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

### Community 158 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (40): addFile(), addPastedChat(), DealFile, draftsUrl(), fileUrl(), getDraftById(), isFile(), isReading() (+32 more)

### Community 159 - "Nav.tsx"
Cohesion: 0.28
Nodes (11): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+3 more)

### Community 160 - "image.ts"
Cohesion: 0.35
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "keyvalue.ts"
Cohesion: 0.21
Nodes (5): connectKeyValue(), keyValueStore(), memoryStore(), RedisCommands, redis

### Community 165 - "server/package.json"
Cohesion: 0.06
Nodes (31): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+23 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "Council.tsx"
Cohesion: 0.19
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 168 - "retention.ts"
Cohesion: 0.15
Nodes (18): allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA, LooseKind, purgeDeal() (+10 more)

### Community 169 - "testId"
Cohesion: 0.06
Nodes (44): CheckView, db, FAILED, shown, store, councilOf(), db, draftedAs() (+36 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.17
Nodes (20): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+12 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "app-link-routes.ts"
Cohesion: 0.28
Nodes (11): linkBody, paypalUnavailable(), SellerAppLinking, sellerAppRoutes(), registerAlerts(), removeAlerts(), ConnectApp, sellerWebhookUrl() (+3 more)

### Community 174 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react

### Community 175 - "dispute-sync.ts"
Cohesion: 0.08
Nodes (40): CHECK_INTERVAL_MS, checkView(), disputeParams, disputeRoutes(), changedSince(), Counts, failureCode(), readTooSoon() (+32 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 180 - "design/tokens.ts"
Cohesion: 0.21
Nodes (18): applyTokens(), MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, ColorToken (+10 more)

### Community 181 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 182 - "source"
Cohesion: 0.18
Nodes (11): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+3 more)

### Community 183 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.20
Nodes (10): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, PayPal sandbox notes, Reliability (+2 more)

### Community 185 - "appeal-coverage.ts"
Cohesion: 0.48
Nodes (4): appealGaps(), missingFromPacket(), docItemId(), appealCheckSchema

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
- **136 isolated node(s):** `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`, `@pactpal/brand`, `mermaid` (+131 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 2026 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `appendLedgerEvent`, `overview-api.ts`, `when`, `delivery-routes.ts`, `layouts.tsx`, `words/src/index.ts`, `email/src/index.ts`, `claims/src/index.ts`, `PayPalRestClient`, `db/src/testing.ts`, `change-orders.ts`, `DealPage.tsx`, `createDeal`, `ScopePanel.tsx`, `ref_zod`, `question-routes.ts`, `scope-routes.ts`, `sellers/disputes.test.ts`, `tools.ts`, `council/src/index.ts`, `db/src/migrate.ts`, `AccessTokenProvider`, `appeal-items.ts`, `scope-draft/src/testing.ts`, `scope-draft/src/index.ts`, `App.tsx`, `deadline-rows.ts`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `MessagesPage.tsx`, `acceptance.ts`, `build.js`, `config.ts`, `Deal`, `postgres.ts`, `products/src/index.ts`, `chat-state.ts`, `ledger/src/index.ts`, `test-app.ts`, `resend-inbound.ts`, `timeline/src/index.ts`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `readLedger`, `scope-drafts.ts`, `Insights.tsx`, `dispute-actions.ts`, `disputes/test-support.ts`, `sandbox-respond-report.ts`, `Deadlines.tsx`, `task.test.ts`, `vitest`, `seller-connections.ts`, `Database`, `gantt-rows.ts`, `PacketPanel.tsx`, `sandbox-webhook-report.ts`, `api.ts`, `render.ts`, `check-words.ts`, `db/src/index.ts`, `IntakePanel.tsx`, `Agents.tsx`, `landing-words.ts`, `Ledger.tsx`, `package.json`, `AgentPanel.tsx`, `packets.ts`, `DealsTable.tsx`, `DraftPanel.tsx`, `Nav.tsx`, `keyvalue.ts`, `retention.ts`, `testId`, `pages.ts`, `dispute-sync.ts`, `design/tokens.ts`, `appeal-coverage.ts`, `log-labels.test.ts`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12025901942645699 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `Deadlines.tsx`, `source`, `council/src/index.ts`, `timeline/src/index.ts`, `PayPalResult`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0397979797979798 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `paypal/src/index.ts`, `when`, `delivery-routes.ts`, `claims/src/index.ts`, `ref_zod`, `scope-routes.ts`, `sellers/disputes.test.ts`, `appeal-items.ts`, `web/src/format.ts`, `scope-draft/src/index.ts`, `ledger/src/index.ts`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `PayPalResult`, `testSpec`, `readLedger`, `question-routes.ts`, `disputes/test-support.ts`, `vitest`, `Database`, `Decisions`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.044851258581235696 - nodes in this community are weakly interconnected._