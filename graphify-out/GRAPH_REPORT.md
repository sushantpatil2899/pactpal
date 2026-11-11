# Graph Report - paypal-hackathon  (2026-11-11)

## Corpus Check
- 790 files · ~501,629 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6076 nodes · 19107 edges · 217 communities (194 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 543 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `15328d07`
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
- mcp.ts
- db/src/testing.ts
- agent-requests.ts
- change-orders.ts
- DealPage.tsx
- db/src/testing.ts
- ScopePanel.tsx
- ref_zod
- question-routes.ts
- acceptance-routes.ts
- draft-job.ts
- sellers/disputes.test.ts
- timeline-routes.ts
- deals.ts
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- PayPalRestClient
- timeline-progress.ts
- validate.ts
- scope-draft/src/testing.ts
- notices.ts
- scope-draft/src/index.ts
- App.tsx
- deadline-rows.ts
- packet-service.ts
- parseJsonReply
- claims/src/check.ts
- eval-report.ts
- MessagesPage.tsx
- receipt.test.ts
- build.js
- config.ts
- live-hub.ts
- postgres.ts
- products/src/index.ts
- injection-runner.ts
- web/package.json
- ledger/src/index.ts
- createTestDeal
- devDependencies
- deals/routes.ts
- tools.ts
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
- appeal.test.ts
- Insights.tsx
- ref_zod
- dispute-actions.ts
- disputes/test-support.ts
- claims/package.json
- sandbox-respond-report.ts
- Landing.tsx
- Deadlines.tsx
- production-app.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- vitest
- eval-runner.ts
- .query
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- Database
- ai/package.json
- gantt-rows.ts
- milestones.ts
- scripts
- sandbox-webhook-report.ts
- Pillars.tsx
- api.ts
- render.ts
- email/package.json
- compilerOptions
- MessagesPanel.tsx
- db/src/index.ts
- paypal-webhook.ts
- buildApp
- council/package.json
- Agents.tsx
- auth/sign-in.ts
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
- linked-apps.ts
- compilerOptions
- Build plan
- readChecked
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- AgentPanel.tsx
- engine.test.ts
- confirmation.ts
- README.md
- secret-box.test.ts
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
- draft-changes.ts
- Nav.tsx
- questionRoutes
- .prettierrc.json
- products/tsconfig.json
- RedisCommands
- server/package.json
- docs/tsconfig.json
- Council.tsx
- brand/src/index.ts
- email/src/index.ts
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- app-link-routes.ts
- postgres-listen.test.ts
- dispute-sync.ts
- vite-env.d.ts
- src-app-tsx.md
- src/draft-source.ts
- Tour.tsx
- design/tokens.ts
- scripts
- cli-models.ts
- Hero.tsx
- PayPal sandbox notes
- @fastify/websocket
- @modelcontextprotocol/sdk@1.32.1
- Getting started
- brand/package.json
- @pactpal/ai@workspace:*
- @pactpal/council@workspace:*
- @pactpal/db@workspace:*
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
- @pactpal/ledger@workspace:*
- @pactpal/net@workspace:*
- @pactpal/pdf@workspace:*
- @pactpal/scope-draft@workspace:*
- @pactpal/score@workspace:*
- @pactpal/timeline@workspace:*
- @pactpal/watcher@workspace:*
- pg@^8.23.1
- zod@^4.6.7
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0

## God Nodes (most connected - your core abstractions)
1. `vitest` - 230 edges
2. `Database` - 132 edges
3. `testId()` - 121 edges
4. `readLedger()` - 91 edges
5. `sha256Hex()` - 86 edges
6. `useMigratedTestDatabase()` - 85 edges
7. `react` - 80 edges
8. `appendLedgerEvent()` - 75 edges
9. `isObject()` - 74 edges
10. `TEST_NOW` - 70 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
- `Redesign (Phase 7R)` --references--> `phoneTab()`  [INFERRED]
  docs/decisions.md → apps/web/src/deal/deal-view.ts
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts

## Import Cycles
- None detected.

## Communities (217 total, 23 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.12
Nodes (38): createDeal(), DealOptions, getDealOptions(), LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList() (+30 more)

### Community 1 - "paypal/src/index.ts"
Cohesion: 0.04
Nodes (59): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS (+51 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.04
Nodes (103): AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms(), acceptTermsSchema, checkedAcceptance() (+95 more)

### Community 3 - "overview-api.ts"
Cohesion: 0.11
Nodes (34): Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR (+26 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.08
Nodes (43): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+35 more)

### Community 5 - "when"
Cohesion: 0.06
Nodes (68): buildPacket(), checkDisputes(), CouncilView, disputesUrl(), DisputesView, draftSummary(), getAppeal(), getDisputes() (+60 more)

### Community 6 - "delivery-routes.ts"
Cohesion: 0.08
Nodes (55): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+47 more)

### Community 7 - "layouts.tsx"
Cohesion: 0.09
Nodes (32): Me, Icon(), IconName, PATHS, Logo(), applyTheme(), nextTheme(), ORDER (+24 more)

### Community 8 - "words/src/index.ts"
Cohesion: 0.11
Nodes (32): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), AcceptanceDocument(), AcceptanceDocument (+24 more)

### Community 9 - "email/src/index.ts"
Cohesion: 0.10
Nodes (33): EMAIL_LOGO_PATH, answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf() (+25 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (69): PacketFacts, AppealContext, checkAnalysis(), ClaimAnalysis, claimAnalysisSchema, ClaimContext, invalid(), MAX_STATEMENTS (+61 more)

### Community 11 - "mcp.ts"
Cohesion: 0.07
Nodes (34): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+26 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.06
Nodes (43): db, STEPS, StepView, TimelineView, db, disputedDeal(), FILES, GOOD (+35 more)

### Community 13 - "agent-requests.ts"
Cohesion: 0.13
Nodes (19): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, claimAgentRequest() (+11 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.04
Nodes (65): `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+57 more)

### Community 15 - "DealPage.tsx"
Cohesion: 0.05
Nodes (78): checkLedger(), getDeal(), isDeal(), LedgerCheck, listDeals(), ScopeTerms, ScopeView, chatUrl() (+70 more)

### Community 16 - "db/src/testing.ts"
Cohesion: 0.04
Nodes (82): db, CALLBACK_PATH, RETURN_COOKIE, SESSION_COOKIE, STATE_COOKIE, db, dealWithBuyer(), maya (+74 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (78): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+70 more)

### Community 18 - "ref_zod"
Cohesion: 0.06
Nodes (58): ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory, SendOptions, sendWithRetry(), fakeNetwork(), policy (+50 more)

### Community 19 - "question-routes.ts"
Cohesion: 0.07
Nodes (36): result, webDir, failRunningMessageReviews(), AiAnswer, aiAnswerSchema, AnswerQuestion, answerQuestion(), answerQuestionSchema (+28 more)

### Community 20 - "acceptance-routes.ts"
Cohesion: 0.13
Nodes (22): ACCEPTANCE_NOTICE_VERSION, buildReceipt(), emailReceipt(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+14 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.09
Nodes (32): runPrepared(), draftCategories, CouncilRecord, councilRecordSchema, toCouncilRecord(), toJson(), usage, DraftJob (+24 more)

### Community 22 - "sellers/disputes.test.ts"
Cohesion: 0.09
Nodes (36): agentDeal(), db, mcpClient(), ToolResult, db, ORDERING, OrderView, signedDeal() (+28 more)

### Community 23 - "timeline-routes.ts"
Cohesion: 0.08
Nodes (43): ACCEPTANCE_DOCUMENT_FORMAT, AcceptanceDocument, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money, acceptBody (+35 more)

### Community 24 - "deals.ts"
Cohesion: 0.07
Nodes (43): AddBuyer, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CURRENCIES, DEAL_KINDS, DealCategory (+35 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (51): Engineering, ChatMessage, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize() (+43 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.08
Nodes (42): publishingBus(), Config, CronStart, runCronJob(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME (+34 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.20
Nodes (14): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, MigrationStatus, migrationStatus() (+6 more)

### Community 28 - "PayPalRestClient"
Cohesion: 0.08
Nodes (32): connectKeyValue(), keyValueStore(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers() (+24 more)

### Community 29 - "timeline-progress.ts"
Cohesion: 0.07
Nodes (33): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage(), lastMessages() (+25 more)

### Community 30 - "validate.ts"
Cohesion: 0.12
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, draftTimelineOf() (+23 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.08
Nodes (39): two, build(), input, numbered, DraftStepKind, EVAL_CASES, EvalCase, EvalGold (+31 more)

### Community 32 - "notices.ts"
Cohesion: 0.18
Nodes (22): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+14 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (46): JsonSchema, claimLines(), linesOf(), RankingPromptInput, RANK_CRITERIA, ScopeDraftTask, findInstructionLines(), HIDDEN_LINE_TEXT (+38 more)

### Community 34 - "App.tsx"
Cohesion: 0.10
Nodes (36): getMe(), signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage (+28 more)

### Community 35 - "deadline-rows.ts"
Cohesion: 0.22
Nodes (13): addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow, deadlineRows(), Deadlines (+5 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.10
Nodes (39): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+31 more)

### Community 37 - "parseJsonReply"
Cohesion: 0.13
Nodes (27): candidates(), JsonReply, parseJsonReply(), tryParse(), checkAppeal(), readAppeal(), checkResponse(), readResponse() (+19 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (34): AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema, withoutLinePrefix(), AgreementPage (+26 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (29): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+21 more)

### Community 40 - "MessagesPage.tsx"
Cohesion: 0.13
Nodes (26): useWide(), Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People() (+18 more)

### Community 41 - "receipt.test.ts"
Cohesion: 0.25
Nodes (8): ACCEPTANCE_NOTICE, BRANDED_RECEIPTS_FROM, receiptFormatAt(), document, signed(), SIGNED_AT, signedPayload(), Acceptance

### Community 42 - "build.js"
Cohesion: 0.11
Nodes (14): css, dist, faces, FONTS, home, problems, root, builtins (+6 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (28): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatErrors() (+20 more)

### Community 44 - "live-hub.ts"
Cohesion: 0.07
Nodes (32): BusSignal, Listen, addCard(), db, hubOnTestDeal(), messageView(), LiveHub, LivePage (+24 more)

### Community 45 - "postgres.ts"
Cohesion: 0.14
Nodes (10): Row, databaseFromPool(), ListenOptions, PgClient, PgConnection, PgPool, PostgresOptions, queryOn() (+2 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.12
Nodes (20): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+12 more)

### Community 47 - "injection-runner.ts"
Cohesion: 0.13
Nodes (23): DroppedDraft, droppedSection(), ruleOf(), clients, councilFailures(), counts(), formatInjectionReport(), InjectionRun (+15 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (44): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @fiddle-digital/string-tune@1.2.7 (+36 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (74): lookUp(), DISPUTE_EVENT_PREFIX, agentBodySha256(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection (+66 more)

### Community 50 - "createTestDeal"
Cohesion: 0.06
Nodes (46): chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal() (+38 more)

### Community 51 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 52 - "deals/routes.ts"
Cohesion: 0.08
Nodes (59): emailReceiptQuietly(), AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), chatNames() (+51 more)

### Community 53 - "tools.ts"
Cohesion: 0.05
Nodes (68): actingAs(), routeCaller(), AgentTool, ask(), choicesSchema, dealId, dealPath(), disputeId (+60 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.05
Nodes (54): review(), paid(), seller(), LedgerEntryView, title(), draft(), unchanged(), deliveryLabel() (+46 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (38): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+30 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.06
Nodes (51): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), CheckedFile, CheckLine, codeChecks() (+43 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (41): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+33 more)

### Community 59 - "PayPalResult"
Cohesion: 0.05
Nodes (44): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, 1. Architecture and structure, AcceptClaimInput, answered(), collect(), DisputeAnswer (+36 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.05
Nodes (64): councilDeps(), councilRecordOf(), isRankingRequest(), CheckView, db, FAILED, model(), shown (+56 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (37): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+29 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "readLedger"
Cohesion: 0.08
Nodes (27): db, Answered, db, DeliveriesView, DeliveryView, entriesOf(), png(), signedDeal() (+19 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "appeal.test.ts"
Cohesion: 0.12
Nodes (23): Prepared, AppealCheck, APPEAL_PROMPT_VERSION, appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask(), AppealTask (+15 more)

### Community 68 - "Insights.tsx"
Cohesion: 0.13
Nodes (20): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+12 more)

### Community 69 - "ref_zod"
Cohesion: 0.04
Nodes (102): afterQuery, CHAT_TRANSCRIPT_PREFIX, ChatNames, ChatRouteOptions, postBody, REFUSALS, DealLookup, dealParams (+94 more)

### Community 70 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (28): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+20 more)

### Community 71 - "disputes/test-support.ts"
Cohesion: 0.06
Nodes (58): db, queuedDrafting(), signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES (+50 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (83): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), logProgress(), message(), payPalIdOption() (+75 more)

### Community 74 - "Landing.tsx"
Cohesion: 0.14
Nodes (12): Council(), ART, at(), dots(), Features(), Landing(), at(), Moves() (+4 more)

### Community 75 - "Deadlines.tsx"
Cohesion: 0.11
Nodes (21): @bryntum/gantt-react-enterprise@8.0.0, @bryntum/scheduler-enterprise@8.0.0, @bryntum/scheduler-react-enterprise@8.0.0, getDisputePage(), BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder (+13 more)

### Community 76 - "production-app.ts"
Cohesion: 0.13
Nodes (18): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), renderDraftStarter(), renderWorkflowChecker(), RunnerBusyError (+10 more)

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

### Community 81 - "vitest"
Cohesion: 0.08
Nodes (39): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AI_RETRY_POLICY (+31 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.28
Nodes (15): buyerProvidesScore(), categoryVerdict(), cites(), lineSet(), listScore(), marksScore(), normal(), priceVerdict() (+7 more)

### Community 83 - ".query"
Cohesion: 0.09
Nodes (37): lockedDispute(), allowPurge(), countOf(), Cutoff, DEAL_TABLES, dealsDue(), LOOSE_DATA, LooseKind (+29 more)

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
Cohesion: 0.13
Nodes (32): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+24 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "Database"
Cohesion: 0.05
Nodes (71): ReceiptMailDeps, AGENT_CALLS_PER_MINUTE, bearerOf(), McpRouteOptions, mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentContext (+63 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "gantt-rows.ts"
Cohesion: 0.21
Nodes (9): StageView, StepView, RunningStepView, doneDay(), GanttLink, ganttRows(), GanttTask, noteFor() (+1 more)

### Community 92 - "milestones.ts"
Cohesion: 0.10
Nodes (26): sentStage(), dropFailedInvoice(), findMilestoneByInvoice(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoiceSent() (+18 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.09
Nodes (30): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+22 more)

### Community 95 - "Pillars.tsx"
Cohesion: 0.15
Nodes (18): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+10 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (98): AgentRequestsPanel(), AgentRequestView, analysesUrl(), answerAgentRequest(), AnswerOptionView, AppealCheckView, AppealView, BuiltPacket (+90 more)

### Community 97 - "render.ts"
Cohesion: 0.05
Nodes (47): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+39 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "MessagesPanel.tsx"
Cohesion: 0.14
Nodes (20): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, factsWords(), FORMAT_WORDS (+12 more)

### Community 101 - "db/src/index.ts"
Cohesion: 0.03
Nodes (103): CHAT_CHANNEL, ChatEvent, chatEventSchema, party, publishChatEvent(), ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind (+95 more)

### Community 102 - "paypal-webhook.ts"
Cohesion: 0.09
Nodes (22): SHARED_SETTINGS, blueprint, ciWorkflow, cronSection, sections, serverPackage, serviceSection, [servicesSection = "", databaseSection = ""] (+14 more)

### Community 103 - "buildApp"
Cohesion: 0.10
Nodes (19): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), canonicalRedirect() (+11 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Agents.tsx"
Cohesion: 0.14
Nodes (16): CanCannot(), BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at() (+8 more)

### Community 106 - "auth/sign-in.ts"
Cohesion: 0.16
Nodes (17): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), callbackQuery, cookieRules, currentSession() (+9 more)

### Community 107 - "landing-words.ts"
Cohesion: 0.13
Nodes (25): Audience(), GLYPHS, SPOTS, Sticker(), at(), Closing(), LIMIT_GLYPHS, Tagline() (+17 more)

### Community 108 - "claim-job.ts"
Cohesion: 0.15
Nodes (31): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+23 more)

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

### Community 114 - "react"
Cohesion: 0.12
Nodes (31): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+23 more)

### Community 115 - "Ledger.tsx"
Cohesion: 0.24
Nodes (13): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+5 more)

### Community 116 - "Engineering standards"
Cohesion: 0.18
Nodes (11): 10. Documentation and change hygiene, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy, 8. Testing (+3 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.18
Nodes (11): Agents (Phase 8), AI, Branded emails and documents (9h), Decisions, Demo (9b), Domain (9i), Partner tools, Product (+3 more)

### Community 119 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @pactpal/email@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:*, @pactpal/words@workspace:* (+10 more)

### Community 120 - "linked-apps.ts"
Cohesion: 0.15
Nodes (9): DisputeReader, LinkedDisputeAccount, InvoiceAccount, LinkedApp, LinkedAppClients, NoInvoiceAccount, Receiver, isPayPalCertUrl() (+1 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "readChecked"
Cohesion: 0.11
Nodes (34): addBuyer(), addPastedChat(), checkPayments(), DealFile, draftFrom(), draftsUrl(), errorMessage(), getDraftById() (+26 more)

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
Cohesion: 0.20
Nodes (14): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+6 more)

### Community 130 - "engine.test.ts"
Cohesion: 0.20
Nodes (8): DemoProgress, DemoStep, needRef(), RunOptions, runStory(), RunSummary, StepResult, DemoRefs

### Community 131 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 132 - "README.md"
Cohesion: 0.17
Nodes (8): How long, Privacy, What PactPal keeps, Who else sees it, Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 133 - "secret-box.test.ts"
Cohesion: 0.22
Nodes (4): SecretBoxKeyError, box, KEY, OTHER_KEY

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
Cohesion: 0.11
Nodes (36): addedByRole(), fileView(), CHECK_INTERVAL_MS, appealApplies(), analysisView(), appealView(), claimRoutes(), answer() (+28 more)

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

### Community 158 - "draft-changes.ts"
Cohesion: 0.22
Nodes (11): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+3 more)

### Community 159 - "Nav.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

### Community 160 - "questionRoutes"
Cohesion: 0.31
Nodes (10): questionRoutes(), attempt(), forward(), namedQuestion(), settle(), view(), questionView(), emailSellerQuietly() (+2 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 165 - "server/package.json"
Cohesion: 0.13
Nodes (14): @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/live@workspace:*, @pactpal/qa@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/qa, name (+6 more)

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
Cohesion: 0.05
Nodes (66): EmailTemplates, loadEmailTemplates(), linkApp(), linkedSeller(), RFC-2606, emailAttachmentSchema, EmailFailure, EmailMessage (+58 more)

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
Cohesion: 0.15
Nodes (16): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+8 more)

### Community 174 - "postgres-listen.test.ts"
Cohesion: 0.22
Nodes (4): fakeClient(), Handler, setup(), PgListenClient

### Community 175 - "dispute-sync.ts"
Cohesion: 0.12
Nodes (22): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+14 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "src/draft-source.ts"
Cohesion: 0.32
Nodes (6): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 182 - "cli-models.ts"
Cohesion: 0.47
Nodes (5): pickModels(), selectedClientsOrExit(), councilClients(), askModelTask, membersFor()

### Community 183 - "Hero.tsx"
Cohesion: 0.31
Nodes (8): Hero(), Ticker(), useChainScene(), scrambled(), TradeLine(), TICKER, TRADES, Letters()

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1803 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `db/src/testing.ts` to `paypal/src/index.ts`, `appendLedgerEvent`, `overview-api.ts`, `DeliverPanel.tsx`, `when`, `delivery-routes.ts`, `layouts.tsx`, `words/src/index.ts`, `email/src/index.ts`, `claims/src/index.ts`, `mcp.ts`, `agent-requests.ts`, `change-orders.ts`, `DealPage.tsx`, `db/src/testing.ts`, `ScopePanel.tsx`, `ref_zod`, `question-routes.ts`, `draft-job.ts`, `sellers/disputes.test.ts`, `council/src/index.ts`, `disputes/task.ts`, `db/src/migrate.ts`, `PayPalRestClient`, `validate.ts`, `scope-draft/src/testing.ts`, `scope-draft/src/index.ts`, `App.tsx`, `deadline-rows.ts`, `packet-service.ts`, `parseJsonReply`, `claims/src/check.ts`, `eval-report.ts`, `MessagesPage.tsx`, `receipt.test.ts`, `build.js`, `config.ts`, `live-hub.ts`, `products/src/index.ts`, `injection-runner.ts`, `ledger/src/index.ts`, `createTestDeal`, `tools.ts`, `Built (sub-phases 2b to 6h-1)`, `action-routes.ts`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `readLedger`, `appeal.test.ts`, `Insights.tsx`, `dispute-actions.ts`, `disputes/test-support.ts`, `sandbox-respond-report.ts`, `Deadlines.tsx`, `production-app.ts`, `vitest`, `.query`, `postStep`, `gantt-rows.ts`, `sandbox-webhook-report.ts`, `api.ts`, `render.ts`, `MessagesPanel.tsx`, `paypal-webhook.ts`, `buildApp`, `Agents.tsx`, `landing-words.ts`, `claim-job.ts`, `devDependencies`, `Ledger.tsx`, `package.json`, `AgentPanel.tsx`, `engine.test.ts`, `confirmation.ts`, `secret-box.test.ts`, `draft-changes.ts`, `Nav.tsx`, `email/src/index.ts`, `pages.ts`, `postgres-listen.test.ts`, `dispute-sync.ts`, `src/draft-source.ts`, `design/tokens.ts`?**
  _High betweenness centrality (0.204) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1178743961352657 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `Deadlines.tsx`, `council/src/index.ts`, `timeline/src/index.ts`, `PayPalResult`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04388984509466437 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `paypal/src/index.ts`, `when`, `delivery-routes.ts`, `timeline-routes.ts`, `scope-draft/src/index.ts`, `parseJsonReply`, `email/src/index.ts`, `ledger/src/index.ts`, `createTestDeal`, `Built (sub-phases 2b to 6h-1)`, `PayPalResult`, `appeal.test.ts`, `ref_zod`, `disputes/test-support.ts`, `vitest`, `.query`, `postStep`, `Database`, `claim-job.ts`, `Decisions`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.04061314791403287 - nodes in this community are weakly interconnected._