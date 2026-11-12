# Graph Report - paypal-hackathon  (2026-11-12)

## Corpus Check
- 838 files · ~1,556,741 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 6292 nodes · 19937 edges · 224 communities (198 shown, 26 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 555 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ebe1b33`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- mcp.ts
- vitest
- change-order-routes.ts
- DealPage.tsx
- react
- delivery-routes.ts
- postgresContentStore
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
- seed-sandbox.ts
- MessagesPage.tsx
- .query
- when
- vitest
- addArtifact
- readLedger
- council/src/index.ts
- disputes/task.ts
- qa/src/index.ts
- Secret
- design/parts.tsx
- chat-state.ts
- scope-draft/src/testing.ts
- actions.ts
- db/src/disputes.ts
- stories.test.ts
- PacketPanel.tsx
- claim-routes.ts
- DealsTable.tsx
- claim-job.ts
- eval-report.ts
- Deadlines.tsx
- db/src/testing.ts
- templates.ts
- live/src/index.ts
- LiveHub
- postgres.ts
- listing-routes.ts
- pdf/package.json
- web/package.json
- ledger/src/index.ts
- errors.ts
- Deadlines.tsx
- delivery-check.test.ts
- Layout
- seller-connections.ts
- postStep
- verify
- retention.ts
- .query
- PayPalResult
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- ChatTab.tsx
- scripts
- db/package.json
- disputes/test-support.ts
- emailFrom
- question-routes.ts
- Insights.tsx
- scope-draft/src/index.ts
- claims/package.json
- paypal/src/index.ts
- bus.test.ts
- devDependencies
- delivery-check/src/index.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- ai/src/index.ts
- image.ts
- dispute-sync.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- pdf/src/index.ts
- products/package.json
- MessagesPanel.tsx
- ai/package.json
- sandbox-respond-report.ts
- notices.ts
- scripts
- sandbox-webhook-report.ts
- packet.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- chat-api.ts
- SharedStore
- make_content.py
- Pillars.tsx
- council/package.json
- auth/sign-in.ts
- match.ts
- landing-words.ts
- pages.tsx
- devDependencies
- Demo plan
- score/package.json
- PactPal product spec
- devDependencies
- build.ts
- check-words.ts
- Engineering standards
- package.json
- Decisions
- server/package.json
- config.ts
- compilerOptions
- Build plan
- authAssertion
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- docs/package.json
- AgentPanel.tsx
- PactPal in diagrams
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
- eval-report.test.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- The problem, in sellers' own words
- Closing.tsx
- Sponsor tools
- .prettierrc.json
- products/tsconfig.json
- Landing.tsx
- dependencies
- docs/tsconfig.json
- droppedSection
- scripts
- resend.ts
- Redesign plan (proposed Phase 7R)
- pages.ts
- index.md
- Built (sub-phases 2b to 6h-1)
- What PactPal is
- Privacy
- vite-env.d.ts
- src-app-tsx.md
- Scope
- app-link-routes.ts
- design/tokens.ts
- Diagrams
- server/src/index.ts
- IntakePanel.tsx
- PayPal sandbox notes
- source
- @fastify/websocket
- Getting started
- brand/package.json
- @modelcontextprotocol/sdk@1.32.1
- brand/src/index.ts
- listing-routes.ts
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
- @pactpal/ai@workspace:*
- council
- @pactpal/pdf@workspace:*
- @pactpal/db@workspace:*
- log-labels.test.ts
- @pactpal/ledger@workspace:*
- @pactpal/net@workspace:*
- @pactpal/timeline@workspace:*
- @pactpal/score@workspace:*
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- @pactpal/watcher@workspace:*
- buildApp
- RedisCommands
- pg@^8.23.1
- zod@^4.6.7
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
- `Sponsor licences (9k)` --references--> `giveBryntumLicence()`  [INFERRED]
  docs/decisions.md → apps/web/src/schedule/bryntum-licence.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts

## Import Cycles
- None detected.

## Communities (224 total, 26 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.09
Nodes (37): getMe(), signOut(), App(), DeadlinesPage, DealPage, dealPage(), DealRoute, DealsPage (+29 more)

### Community 1 - "mcp.ts"
Cohesion: 0.10
Nodes (26): APP_KEYS, checkAsSellerApp(), checkMcp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+18 more)

### Community 2 - "vitest"
Cohesion: 0.10
Nodes (17): db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal(), page(), db, NoteBody (+9 more)

### Community 3 - "change-order-routes.ts"
Cohesion: 0.04
Nodes (95): documentFor(), sendTimelineReminders(), acceptBody, changeOrderRoutes(), view(), waitingChange(), changeParams, changeView() (+87 more)

### Community 4 - "DealPage.tsx"
Cohesion: 0.09
Nodes (38): checkLedger(), getDeal(), LedgerCheck, ScopeTerms, ScopeView, getTimeline(), isRunningStep(), isTimeline() (+30 more)

### Community 5 - "react"
Cohesion: 0.10
Nodes (35): AppealCheckView, AppealView, ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, getAppeal(), getResponses() (+27 more)

### Community 6 - "delivery-routes.ts"
Cohesion: 0.05
Nodes (86): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+78 more)

### Community 7 - "postgresContentStore"
Cohesion: 0.06
Nodes (49): db, disputedDeal(), FILES, GOOD, SummariesView, db, refusal(), AnalysisNotAllowedError (+41 more)

### Community 8 - "receipt.ts"
Cohesion: 0.14
Nodes (23): receiptBlocks(), isListingPreview(), ListingPreview, ListingView, lookUpListing(), saveListingPhotos(), fileUrl(), ListingCard() (+15 more)

### Community 9 - "db/src/index.ts"
Cohesion: 0.02
Nodes (164): AgentContext, AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, agentBodySha256(), AgentRequest, AgentRequestKind, AgentRequestRefusal (+156 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.05
Nodes (92): Prepared, AppealCheck, appealCheckSchema, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem (+84 more)

### Community 11 - "acceptance-routes.ts"
Cohesion: 0.04
Nodes (83): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, AcceptanceDocument, acceptanceDocument(), acceptanceDocumentSchema, currentDocument(), fingerprinted() (+75 more)

### Community 12 - "tools.ts"
Cohesion: 0.09
Nodes (37): actingAs(), routeCaller(), AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), AGENT_TOOLS, AgentTool (+29 more)

### Community 13 - "layouts.tsx"
Cohesion: 0.08
Nodes (32): Me, Icon(), IconName, PATHS, applyTheme(), isDark(), nextTheme(), ORDER (+24 more)

### Community 14 - "DeliveriesPanel.tsx"
Cohesion: 0.12
Nodes (32): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+24 more)

### Community 15 - "Database"
Cohesion: 0.06
Nodes (56): ReceiptMailDeps, McpRouteOptions, BusSignal, ChatBus, Card, DealCards, messageView(), HubOptions (+48 more)

### Community 16 - "db/src/migrate.ts"
Cohesion: 0.18
Nodes (15): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, MigrationStatus (+7 more)

### Community 17 - "ChangeOrderPanel.tsx"
Cohesion: 0.06
Nodes (71): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+63 more)

### Community 18 - "seed-sandbox.ts"
Cohesion: 0.07
Nodes (36): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+28 more)

### Community 19 - "MessagesPage.tsx"
Cohesion: 0.10
Nodes (31): DealSummary, Money, Overview, useOverview(), useWide(), LastMessage, MessagesPage(), People() (+23 more)

### Community 20 - ".query"
Cohesion: 0.05
Nodes (86): questionRoutes(), forward(), namedQuestion(), settle(), view(), AcceptTerms, originOf(), answerAgentRequest() (+78 more)

### Community 21 - "when"
Cohesion: 0.11
Nodes (37): emailFor(), disputeChangedEmail(), disputeDecidedEmail(), disputeOpenedEmail(), disputeReminderEmail(), email(), respondBy(), checkDisputes() (+29 more)

### Community 22 - "vitest"
Cohesion: 0.04
Nodes (85): agentDeal(), db, mcpClient(), ToolResult, SESSION_COOKIE, chatDeal(), db, MessageBody (+77 more)

### Community 23 - "addArtifact"
Cohesion: 0.08
Nodes (31): councilOf(), db, draftedAs(), idOf(), readDraft(), sellerDeal(), store, View (+23 more)

### Community 24 - "readLedger"
Cohesion: 0.07
Nodes (31): db, disputeTypes(), capturingEmail(), db, payments(), sentStage(), chat, counts() (+23 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.07
Nodes (66): beginDraft(), runPrepared(), isUnranked(), toCouncilRecord(), toJson(), usage, JobLog, runDraftJob() (+58 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.06
Nodes (67): publishingBus(), logProgress(), valueOrExit(), loadConfigOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), Config (+59 more)

### Community 27 - "qa/src/index.ts"
Cohesion: 0.09
Nodes (41): MessageJob, MessageReviewView, AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema (+33 more)

### Community 28 - "Secret"
Cohesion: 0.04
Nodes (82): checks, linkedSeller(), ClientOptions, OpenAiCompatibleClient, setup(), urlOf(), bareAddress(), check (+74 more)

### Community 29 - "design/parts.tsx"
Cohesion: 0.11
Nodes (33): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+25 more)

### Community 30 - "chat-state.ts"
Cohesion: 0.23
Nodes (15): liveUrl(), ChatAction, chatReducer(), Connection, initialChat, lastSeq(), onFrame(), PendingMessage (+7 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.05
Nodes (72): draftCategories, two, decoder, numberedChat(), textOf(), AloneRecord, CouncilEvalRecord, EvalOptions (+64 more)

### Community 32 - "actions.ts"
Cohesion: 0.06
Nodes (120): RouteAnswer, FILE_NAME_HEADER, addBuyer(), AgreementForm, answerDelivery(), askQuestion(), callAs(), chat() (+112 more)

### Community 33 - "db/src/disputes.ts"
Cohesion: 0.10
Nodes (20): actionList, checkRow, DISPUTE_MATCHES, DisputeChanges, disputeChanges(), DisputeEvent, disputeLinkSchema, DisputeMatch (+12 more)

### Community 34 - "stories.test.ts"
Cohesion: 0.08
Nodes (37): db, invoiceEntries(), signedDeal(), signedPayPal(), StageView, BOOK, db, runOptions (+29 more)

### Community 35 - "PacketPanel.tsx"
Cohesion: 0.16
Nodes (19): buildPacket(), disputesUrl(), draftSummary(), getPacketView(), getSummaries(), isBuiltPacket(), isPacketView(), isSummaries() (+11 more)

### Community 36 - "claim-routes.ts"
Cohesion: 0.04
Nodes (78): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+70 more)

### Community 37 - "DealsTable.tsx"
Cohesion: 0.12
Nodes (32): listDeals(), CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR (+24 more)

### Community 38 - "claim-job.ts"
Cohesion: 0.09
Nodes (56): AlreadySent, appealApplies(), appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId(), HeldDocument (+48 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.35
Nodes (16): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+8 more)

### Community 40 - "Deadlines.tsx"
Cohesion: 0.16
Nodes (16): getDisputePage(), BAR_COLOURS, TODAY_LINE, giveBryntumLicence(), holder, daysBetween(), hasEvidence(), COLUMNS (+8 more)

### Community 41 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (71): db, dealWithBuyer(), Conversation, db, db, goodsDeal(), SCOPE, WEBP (+63 more)

### Community 42 - "templates.ts"
Cohesion: 0.09
Nodes (38): NOTICE_LOOK, notificationEmail(), emailLogo(), EmailTemplates, loadEmailTemplates(), repoFolder(), templatesDir(), loaded (+30 more)

### Community 43 - "live/src/index.ts"
Cohesion: 0.22
Nodes (15): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+7 more)

### Community 45 - "postgres.ts"
Cohesion: 0.09
Nodes (14): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, PgClient, PgConnection (+6 more)

### Community 46 - "listing-routes.ts"
Cohesion: 0.12
Nodes (23): BASE, LISTING, Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, fakeChannel3(), NOW (+15 more)

### Community 47 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 48 - "web/package.json"
Cohesion: 0.06
Nodes (50): dependencies, ag-grid-community@36.3.0, ag-grid-enterprise@36.3.0, ag-grid-react@36.3.0, ag-studio-react@3.1.0, @bryntum/core-enterprise@8.0.0, @bryntum/gantt-enterprise@8.0.0, @bryntum/gantt-react-enterprise@8.0.0 (+42 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (88): one(), DISPUTE_EVENT_PREFIX, ExhibitSource, packetFilename(), packetMeter(), pdfNameOf(), planExhibits(), renderPacket() (+80 more)

### Community 50 - "errors.ts"
Cohesion: 0.07
Nodes (33): PayPalMcpError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest, McpFallback, reasonOf(), invoice, Invoice (+25 more)

### Community 51 - "Deadlines.tsx"
Cohesion: 0.15
Nodes (19): StageView, StepView, RunningStepView, addDays(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow (+11 more)

### Community 52 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 53 - "Layout"
Cohesion: 0.28
Nodes (4): breakWord(), drawable(), drawBlock(), Layout

### Community 54 - "seller-connections.ts"
Cohesion: 0.14
Nodes (21): activeConnection(), claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow, disconnectSeller() (+13 more)

### Community 55 - "postStep"
Cohesion: 0.09
Nodes (45): acceptDisputeClaim(), answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl() (+37 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "retention.ts"
Cohesion: 0.18
Nodes (14): `retention_runs`: each daily clean-up (9c), Retention and privacy (9c), allowPurge(), countOf(), Cutoff, DEAL_TABLES, LOOSE_DATA, LooseKind (+6 more)

### Community 58 - ".query"
Cohesion: 0.07
Nodes (42): DealOverview, dealOverview(), DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting() (+34 more)

### Community 59 - "PayPalResult"
Cohesion: 0.06
Nodes (41): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, disputeDetails, DisputeList (+33 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.05
Nodes (61): councilDeps(), councilRecordOf(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+53 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (52): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+44 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "ChatTab.tsx"
Cohesion: 0.19
Nodes (10): PastedChat, ChatState, lastSeenByOther(), ChatTab(), CONNECTION_WORDS, DealTab, Message(), NOTICE_TABS (+2 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "disputes/test-support.ts"
Cohesion: 0.04
Nodes (78): db, queuedDrafting(), signThroughRoutes(), db, ActionsView, confirmed(), db, disputedDeal() (+70 more)

### Community 68 - "emailFrom"
Cohesion: 0.16
Nodes (27): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf() (+19 more)

### Community 69 - "question-routes.ts"
Cohesion: 0.03
Nodes (145): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), afterQuery, CHAT_TRANSCRIPT_PREFIX (+137 more)

### Community 70 - "Insights.tsx"
Cohesion: 0.12
Nodes (20): ag-studio@3.1.0, giveAgLicence(), grid, load(), studio, count, dealsSource(), Source (+12 more)

### Community 71 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (100): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+92 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (39): EvidenceFileError, PayPalApiError, PayPalErrorDetail, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES (+31 more)

### Community 74 - "bus.test.ts"
Cohesion: 0.20
Nodes (7): Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal()

### Community 75 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @types/react@^18.3.18, @types/react-dom@^18.3.5, @types/three@0.181.0, vite@^6.0.6, @vitejs/plugin-react@^4.3.4, @types/react, @types/react-dom (+3 more)

### Community 76 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (24): CheckedFile, CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, ImageFacts, Transparency (+16 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.08
Nodes (26): Accounts and connection, AI, Disputes, Drafting and injection evals with prompt version 5 and paid models (9d, 12 November 2026), Drafting eval with prompt version 4 (sub-phase 7o, 10 November 2026), Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026) (+18 more)

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
Cohesion: 0.05
Nodes (55): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, attempt() (+47 more)

### Community 82 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 83 - "dispute-sync.ts"
Cohesion: 0.18
Nodes (17): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+9 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "chain-scene.ts"
Cohesion: 0.09
Nodes (21): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+13 more)

### Community 87 - "pdf/src/index.ts"
Cohesion: 0.26
Nodes (7): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, RenderedPdf, AT

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "MessagesPanel.tsx"
Cohesion: 0.28
Nodes (10): checkMessage(), getMessages(), isMessages(), messagesUrl(), MessagesView, LABEL_WORDS, revisionNote(), ALERT (+2 more)

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (83): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+75 more)

### Community 92 - "notices.ts"
Cohesion: 0.13
Nodes (23): doneKeys(), DueNotice, EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey(), reminderNotice() (+15 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (27): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+19 more)

### Community 95 - "packet.ts"
Cohesion: 0.14
Nodes (19): aiBlocks(), dateTime(), ExhibitPlan, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT, PACKET_LIMITS (+11 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (110): AgentRequestsPanel(), addBuyer(), addFile(), addPastedChat(), AgentRequestView, analysesUrl(), answerAgentRequest(), AnswerOptionView (+102 more)

### Community 97 - "render.ts"
Cohesion: 0.12
Nodes (18): ACCENT_INK, Branding, CharacterSet, columnWidths(), Fonts, INK, LOGO_DARK, LOGO_GREEN (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.13
Nodes (19): dependencies, mustache@4.2.0, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/mustache@4.2.6, @types/node@^22.10.2, @pactpal/net (+11 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "chat-api.ts"
Cohesion: 0.33
Nodes (10): chatUrl(), ChatView, getChat(), getPastedChats(), isChat(), isMessage(), isPasted(), postChat() (+2 more)

### Community 101 - "SharedStore"
Cohesion: 0.22
Nodes (3): ListingRouteOptions, SharedStore, ProductLookup

### Community 103 - "Pillars.tsx"
Cohesion: 0.17
Nodes (17): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+9 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "auth/sign-in.ts"
Cohesion: 0.10
Nodes (26): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+18 more)

### Community 106 - "match.ts"
Cohesion: 0.33
Nodes (6): DisputedPayments, matchDispute(), NoMatch, paymentKeys(), DisputeLink, PaidStage

### Community 107 - "landing-words.ts"
Cohesion: 0.07
Nodes (45): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+37 more)

### Community 108 - "pages.tsx"
Cohesion: 0.12
Nodes (33): LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), STAGE_ORDER, Deadlines, DeadlinesPage() (+25 more)

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
Nodes (8): css, dist, faces, FONTS, home, problems, root, DIAGRAM_SOURCES

### Community 115 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

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
Cohesion: 0.13
Nodes (14): @fastify/static@^10.1.8, @pactpal/claims@workspace:*, @pactpal/live@workspace:*, @pactpal/qa@workspace:*, ws@^8.22.2, @pactpal/live, @pactpal/qa, name (+6 more)

### Community 120 - "config.ts"
Cohesion: 0.07
Nodes (33): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+25 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

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

### Community 130 - "PactPal in diagrams"
Cohesion: 0.22
Nodes (8): A deal from chat to paid, Answering a dispute from the record, How the AI council picks one draft, How the evidence log stays honest, PactPal in diagrams, The whole system, When your AI assistant asks to act, Where it runs

### Community 131 - "injection-check.ts"
Cohesion: 0.27
Nodes (8): looks(), councilFailures(), counts(), formatInjectionReport(), InjectionRun, models(), RESULTS, RunRecord

### Community 132 - "README.md"
Cohesion: 0.21
Nodes (3): Code map, Deploying PactPal to Render, Changing emails

### Community 133 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 134 - "PactPal"
Cohesion: 0.09
Nodes (22): Against the judging criteria, AI, AI assistants (MCP), AI that seals the deal., Author, Built with, Demo video, Disputes (+14 more)

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

### Community 150 - "eval-report.test.ts"
Cohesion: 0.48
Nodes (6): alone(), councilRecord(), run(), score(), EvalRun, Architecture

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

### Community 158 - "The problem, in sellers' own words"
Cohesion: 0.29
Nodes (6): Figures, For the video, How the images were made, Posts, The problem, in sellers' own words, The short version

### Community 159 - "Closing.tsx"
Cohesion: 0.26
Nodes (12): Logo(), Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces() (+4 more)

### Community 160 - "Sponsor tools"
Cohesion: 0.33
Nodes (6): AG Grid: every deal in one table, AG Studio: the Insights dashboard, Bryntum: timelines and deadlines, Channel3: what exactly is being sold, Render: where all of PactPal runs, Sponsor tools

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Landing.tsx"
Cohesion: 0.05
Nodes (38): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+30 more)

### Community 165 - "dependencies"
Cohesion: 0.11
Nodes (18): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @fastify/helmet@^13.2.0, @pactpal/email@workspace:*, @pactpal/paypal@workspace:*, @pactpal/products@workspace:*, @pactpal/words@workspace:* (+10 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "droppedSection"
Cohesion: 0.70
Nodes (3): DroppedDraft, droppedSection(), ruleOf()

### Community 168 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, preview, typecheck

### Community 169 - "resend.ts"
Cohesion: 0.15
Nodes (13): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, EmailNetworkError, errorAnswer, errorName() (+5 more)

### Community 170 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 171 - "pages.ts"
Cohesion: 0.16
Nodes (21): anchorOf(), cards(), contents(), diagramPath(), escapeHtml(), Group, GROUPS, HONESTY (+13 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.10
Nodes (22): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work (+14 more)

### Community 174 - "What PactPal is"
Cohesion: 0.40
Nodes (5): AI: from a messy chat to a record PayPal can use, PayPal: the money and the verdict, What PactPal is, Why a council of five AI models, not one, Why they need each other

### Community 175 - "Privacy"
Cohesion: 0.50
Nodes (4): How long, Privacy, What PactPal keeps, Who else sees it

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 178 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 179 - "app-link-routes.ts"
Cohesion: 0.29
Nodes (10): linkBody, paypalUnavailable(), SELLER_APP_PATH, sellerAppRoutes(), registerAlerts(), removeAlerts(), SellerAppView, sellerAppView() (+2 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 182 - "server/src/index.ts"
Cohesion: 0.09
Nodes (13): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), result, webDir (+5 more)

### Community 183 - "IntakePanel.tsx"
Cohesion: 0.16
Nodes (18): createDeal(), DealOptions, getDealOptions(), getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isDeal() (+10 more)

### Community 184 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 185 - "source"
Cohesion: 0.17
Nodes (12): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+4 more)

### Community 187 - "Getting started"
Cohesion: 0.25
Nodes (8): 1. Sign in with PayPal, 2. Link your PayPal app, 3. Make a deal, 4. Let the AI draft the agreement, 5. Send it to your buyer, 6. Work through the timeline, Getting started, Your pages

### Community 188 - "brand/package.json"
Cohesion: 0.25
Nodes (7): main, name, private, scripts, typecheck, type, version

### Community 190 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 191 - "listing-routes.ts"
Cohesion: 0.20
Nodes (14): isPicture(), LISTING_CACHE_SECONDS, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+6 more)

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

### Community 207 - "council"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 210 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 218 - "buildApp"
Cohesion: 0.06
Nodes (42): AppOptions, buildApp(), closeOnSignals(), EMAIL_LOGO_PATH, requestLog(), socketOrigin(), report, setup() (+34 more)

## Knowledge Gaps
- **25 isolated node(s):** `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1890 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `App.tsx`, `mcp.ts`, `DealPage.tsx`, `delivery-routes.ts`, `postgresContentStore`, `receipt.ts`, `claims/src/index.ts`, `acceptance-routes.ts`, `layouts.tsx`, `db/src/migrate.ts`, `ChangeOrderPanel.tsx`, `seed-sandbox.ts`, `MessagesPage.tsx`, `when`, `vitest`, `addArtifact`, `readLedger`, `council/src/index.ts`, `qa/src/index.ts`, `Secret`, `chat-state.ts`, `scope-draft/src/testing.ts`, `actions.ts`, `db/src/disputes.ts`, `stories.test.ts`, `PacketPanel.tsx`, `claim-routes.ts`, `DealsTable.tsx`, `claim-job.ts`, `Deadlines.tsx`, `db/src/testing.ts`, `templates.ts`, `live/src/index.ts`, `postgres.ts`, `listing-routes.ts`, `ledger/src/index.ts`, `errors.ts`, `Deadlines.tsx`, `delivery-check.test.ts`, `seller-connections.ts`, `.query`, `PayPalResult`, `completeness.ts`, `testSpec`, `DraftReview.tsx`, `disputes/test-support.ts`, `emailFrom`, `Insights.tsx`, `scope-draft/src/index.ts`, `paypal/src/index.ts`, `bus.test.ts`, `ai/src/index.ts`, `pdf/src/index.ts`, `MessagesPanel.tsx`, `sandbox-respond-report.ts`, `sandbox-webhook-report.ts`, `packet.ts`, `api.ts`, `auth/sign-in.ts`, `match.ts`, `landing-words.ts`, `devDependencies`, `check-words.ts`, `package.json`, `config.ts`, `authAssertion`, `AgentPanel.tsx`, `injection-check.ts`, `eval-report.test.ts`, `Closing.tsx`, `Landing.tsx`, `droppedSection`, `pages.ts`, `design/tokens.ts`, `server/src/index.ts`, `IntakePanel.tsx`, `listing-routes.ts`, `log-labels.test.ts`, `buildApp`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **What connects `../../tsconfig.base.json`, `RFC-5987`, `../../tsconfig.base.json` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09413067552602436 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `source`, `.query`, `PayPalResult`, `council/src/index.ts`, `retention.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Should `mcp.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1039136302294197 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `council/src/index.ts` to `react`, `claims/src/index.ts`, `Database`, `seed-sandbox.ts`, `when`, `vitest`, `disputes/task.ts`, `Secret`, `claim-job.ts`, `Built (sub-phases 2b to 6h-1)`, `ledger/src/index.ts`, `errors.ts`, `PayPalResult`, `testSpec`, `disputes/test-support.ts`, `question-routes.ts`, `scope-draft/src/index.ts`, `paypal/src/index.ts`, `council`, `ai/src/index.ts`, `log-labels.test.ts`, `Decisions`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `vitest` be split into smaller, more focused modules?**
  _Cohesion score 0.09971509971509972 - nodes in this community are weakly interconnected._