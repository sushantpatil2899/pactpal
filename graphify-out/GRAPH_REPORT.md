# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 770 files · ~506,748 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 5905 nodes · 18449 edges · 197 communities (192 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 519 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1978adcb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pages.tsx
- src/intake.ts
- acceptance.ts
- Dashboard.tsx
- DeliveriesPanel.tsx
- timeline-progress.ts
- dispute-sync.ts
- record.ts
- receipt.ts
- utcDateTime
- claims/src/index.ts
- council-record.ts
- db/src/testing.ts
- claim-analyses.ts
- change-orders.ts
- when
- checker.ts
- ScopePanel.tsx
- ref_zod
- question-routes.ts
- deliveries.ts
- draft-job.ts
- resend-inbound.ts
- when
- Database
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- seller-clients.ts
- claim-job.ts
- PacketPanel.tsx
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- App.tsx
- Deadlines.tsx
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- PayPalRestClient
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
- ref_zod
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- addArtifact
- DraftReview.tsx
- services
- app-link-routes.ts
- scripts
- db/package.json
- scope-drafts.ts
- qa/src/index.ts
- postgresContentStore
- database.ts
- disputes/test-support.ts
- claims/package.json
- sandbox-respond-report.ts
- app.ts
- retention.test.ts
- react
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- vitest
- eval-runner.ts
- disputes/test-support.ts
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- routes.ts
- ai/package.json
- eval-runner.ts
- question-routes.test.ts
- scripts
- sandbox-webhook-report.ts
- appeal.test.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- email/src/index.ts
- db/src/index.ts
- pdf/package.json
- IntakePanel.tsx
- council/package.json
- DealPage.tsx
- confirmation.ts
- Council.tsx
- appeal-items.ts
- draft
- auth/sign-in.ts
- score/package.json
- PactPal product spec
- devDependencies
- paypal-webhook.ts
- Ledger.tsx
- Engineering standards
- package.json
- Decisions
- dependencies
- log-labels.ts
- compilerOptions
- Build plan
- receipt.test.ts
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
- claim-routes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- PactPal design system
- useTestDatabase
- Phase 7 (deal space)
- image.ts
- .prettierrc.json
- products/tsconfig.json
- source
- server/package.json
- docs/tsconfig.json
- MessagesPanel.tsx
- pages.ts
- index.md
- Redesign plan (proposed Phase 7R)
- QuestionsPanel.tsx
- change-order-routes.ts
- vite-env.d.ts
- src-app-tsx.md
- engines
- DraftPanel.tsx
- design/tokens.ts
- PayPal sandbox notes
- brand/src/index.ts
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
1. `vitest` - 221 edges
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
- ``retention_runs`: each daily clean-up (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/data-model.md → packages/db/src/retention.ts
- `Retention and privacy (9c)` --references--> `purgeDeal()`  [INFERRED]
  docs/decisions.md → packages/db/src/retention.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (197 total, 5 thin omitted)

### Community 0 - "pages.tsx"
Cohesion: 0.13
Nodes (36): createDeal(), redeemLink(), SIGN_IN_PATH, Dashboard(), NewDealPage(), byUrgency(), STAGE_ORDER, Deadlines (+28 more)

### Community 1 - "src/intake.ts"
Cohesion: 0.07
Nodes (47): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest() (+39 more)

### Community 2 - "acceptance.ts"
Cohesion: 0.09
Nodes (38): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+30 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.07
Nodes (59): DealSummary, Money, CommandPalette(), PLACES, DealList(), Cell, COLUMNS, DealsTable() (+51 more)

### Community 4 - "DeliveriesPanel.tsx"
Cohesion: 0.07
Nodes (47): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+39 more)

### Community 5 - "timeline-progress.ts"
Cohesion: 0.06
Nodes (42): body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage() (+34 more)

### Community 6 - "dispute-sync.ts"
Cohesion: 0.10
Nodes (36): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+28 more)

### Community 7 - "record.ts"
Cohesion: 0.10
Nodes (28): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+20 more)

### Community 8 - "receipt.ts"
Cohesion: 0.12
Nodes (31): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview (+23 more)

### Community 9 - "utcDateTime"
Cohesion: 0.18
Nodes (22): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+14 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.13
Nodes (36): AppealCheck, AppealContext, checkAppeal(), readAppeal(), RecordLine, checkResponse(), readResponse(), ResponseContext (+28 more)

### Community 11 - "council-record.ts"
Cohesion: 0.19
Nodes (13): CouncilRecord, councilRecordSchema, isUnranked(), usage, categoryLabels, describeDraft(), DraftView, priceMinor() (+5 more)

### Community 12 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (75): db, SESSION_COOKIE, dealWithBuyer(), chatDeal(), db, MessageBody, db, liveDeal() (+67 more)

### Community 13 - "claim-analyses.ts"
Cohesion: 0.08
Nodes (29): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES, finishSchema (+21 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.04
Nodes (70): `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), answer(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder (+62 more)

### Community 15 - "when"
Cohesion: 0.07
Nodes (57): readChecked(), chatUrl(), ChatView, getChat(), getNotifications(), getPastedChats(), getTimeline(), isChat() (+49 more)

### Community 16 - "checker.ts"
Cohesion: 0.09
Nodes (20): ActionsView, confirmed(), db, FILES, sha(), BUTTON_WINDOW_MS, checkKey(), CheckRequest (+12 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (70): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+62 more)

### Community 18 - "ref_zod"
Cohesion: 0.05
Nodes (66): Config, checks, ClientOptions, ResendReceivedEmails, ResendOptions, defaultHttpDeps, HttpDeps, NetworkErrorFactory (+58 more)

### Community 19 - "question-routes.ts"
Cohesion: 0.09
Nodes (29): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestion, askQuestionSchema, BuyerQuestion, councilAnswers (+21 more)

### Community 20 - "deliveries.ts"
Cohesion: 0.09
Nodes (37): answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer, DeliveryFile (+29 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.11
Nodes (32): beginDraft(), draftCategories, toCouncilRecord(), DraftJob, JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS, MessageJob (+24 more)

### Community 22 - "resend-inbound.ts"
Cohesion: 0.25
Nodes (8): envelope, forwardingCode(), passed(), RESEND_INBOUND_PATH, resendInboundRoutes(), ENTITIES, entity(), htmlToText()

### Community 23 - "when"
Cohesion: 0.06
Nodes (67): analysesUrl(), AppealCheckView, AppealView, checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim() (+59 more)

### Community 24 - "Database"
Cohesion: 0.06
Nodes (54): ReceiptMailDeps, McpRouteOptions, AppOptions, SignInOptions, ChatBus, Card, DealCards, HubOptions (+46 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (38): ChatFailureKind, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+30 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.08
Nodes (46): publishingBus(), loadConfigOrExit(), pickModels(), selectedClientsOrExit(), formatErrors(), CronStart, runCronJob(), renderWorkflowChecker() (+38 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.19
Nodes (14): result, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), Migration, MigrationError, migrationStatus (+6 more)

### Community 28 - "seller-clients.ts"
Cohesion: 0.20
Nodes (9): connectOwnApp(), authAssertion(), base64Url(), PayPalInvoices, clientsOver(), ownAppClients(), PlatformSellerClients, SellerClients (+1 more)

### Community 29 - "claim-job.ts"
Cohesion: 0.22
Nodes (24): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+16 more)

### Community 30 - "PacketPanel.tsx"
Cohesion: 0.11
Nodes (26): buildPacket(), disputesUrl(), draftSummary(), fileUrl(), getPacketView(), getSummaries(), isBuiltPacket(), isPacketView() (+18 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (31): two, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+23 more)

### Community 32 - "validate.ts"
Cohesion: 0.12
Nodes (32): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, draftTimelineOf() (+24 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.06
Nodes (56): ChatMessage, JsonSchema, RankingPromptInput, RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines() (+48 more)

### Community 34 - "App.tsx"
Cohesion: 0.09
Nodes (36): signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage (+28 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.09
Nodes (32): StageView, StepView, RunningStepView, BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay() (+24 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.10
Nodes (36): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+28 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.20
Nodes (11): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+3 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.10
Nodes (26): PacketFacts, checkAnalysis(), ClaimAnalysis, claimAnalysisSchema, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis() (+18 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "PayPalRestClient"
Cohesion: 0.05
Nodes (44): checkMcp(), PayPalBuyerTestActions, dollar, setup(), PayPalApiError, PayPalErrorDetail, PayPalMcpError, PayPalResponseError (+36 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.08
Nodes (34): Me, Icon(), IconName, PATHS, Logo(), applyTheme(), isDark(), nextTheme() (+26 more)

### Community 42 - "build.js"
Cohesion: 0.10
Nodes (16): css, dist, faces, FONTS, home, problems, root, builtins (+8 more)

### Community 43 - "config.ts"
Cohesion: 0.06
Nodes (46): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS, appVars(), FEATURES, formatReport() (+38 more)

### Community 44 - "notifier.ts"
Cohesion: 0.07
Nodes (25): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), addCard(), db, hubOnTestDeal() (+17 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.14
Nodes (21): buildReceipt(), emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role (+13 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.08
Nodes (32): LISTING_CACHE_SECONDS, ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+24 more)

### Community 47 - "Insights.tsx"
Cohesion: 0.16
Nodes (16): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, insightRows(), timing() (+8 more)

### Community 48 - "injection-runner.ts"
Cohesion: 0.17
Nodes (21): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), readBallot() (+13 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.07
Nodes (53): isPicture(), agentBodySha256(), ARTIFACT_KINDS, ArtifactKind, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+45 more)

### Community 50 - "readLedger"
Cohesion: 0.06
Nodes (48): Card, db, savedDeal(), send(), signedDeal(), types(), View, db (+40 more)

### Community 51 - "web/package.json"
Cohesion: 0.04
Nodes (53): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+45 more)

### Community 52 - "ref_zod"
Cohesion: 0.05
Nodes (71): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), afterQuery, CHAT_TRANSCRIPT_PREFIX (+63 more)

### Community 53 - "tools.ts"
Cohesion: 0.07
Nodes (46): AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext, AgentTool (+38 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.12
Nodes (19): seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `deal_messages`: the deal's chat (7b), `delivery_checks`: the seller's pre-delivery checks, `dispute_notices`: emails sent to the seller about disputes, `disputes`: PayPal disputes found by checking (+11 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.06
Nodes (61): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+53 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (23): CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, RequirementResult, Transparency, checkableLines() (+15 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.05
Nodes (56): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), ChangeProposal (+48 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.03
Nodes (89): InvoiceArgs, send(), SeedArgs, `buyer_questions`: questions about the agreement before signing, Engineering, PayPal integration, candidates(), BuyerPayment (+81 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "addArtifact"
Cohesion: 0.13
Nodes (17): councilDeps(), councilRecordOf(), isRankingRequest(), db, sellerDeal(), withReadyDraft(), clients(), down (+9 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.12
Nodes (26): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, DraftView, FillChat, fillFrom() (+18 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "app-link-routes.ts"
Cohesion: 0.08
Nodes (39): linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppLinking, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+31 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.11
Nodes (27): draftedDeal(), checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow (+19 more)

### Community 68 - "qa/src/index.ts"
Cohesion: 0.19
Nodes (14): AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine(), replySchema, withoutLinePrefix(), numberedText() (+6 more)

### Community 69 - "postgresContentStore"
Cohesion: 0.07
Nodes (54): currentDocument(), featureAnswers(), step(), checkBody, checkView(), deliveryCheckRoutes(), looks(), LookResult (+46 more)

### Community 70 - "database.ts"
Cohesion: 0.04
Nodes (66): ARTIFACT_LIMITS, ArtifactLimits, NewArtifact, chat, db, file(), pdf, store (+58 more)

### Community 71 - "disputes/test-support.ts"
Cohesion: 0.06
Nodes (71): db, agentDeal(), db, mcpClient(), ToolResult, signedDeal(), signedDeal(), sellerDeal() (+63 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (100): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), logProgress(), message(), payPalIdOption() (+92 more)

### Community 74 - "app.ts"
Cohesion: 0.08
Nodes (24): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), ConfigReport (+16 more)

### Community 75 - "retention.test.ts"
Cohesion: 0.06
Nodes (41): AnalysisNotAllowedError, db, disputed(), refusal(), lockedDispute(), recordDispute(), EvidencePacket, MAX_PACKETS_PER_DISPUTE (+33 more)

### Community 76 - "react"
Cohesion: 0.04
Nodes (67): BrandLogo(), BrandName, LOGOS, Audience(), GLYPHS, SPOTS, Sticker(), at() (+59 more)

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
Cohesion: 0.04
Nodes (84): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, CheckView (+76 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.22
Nodes (17): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+9 more)

### Community 83 - "disputes/test-support.ts"
Cohesion: 0.07
Nodes (27): db, pdf, answer, AppealView, db, FILES, ChoicesView, db (+19 more)

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
Nodes (30): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+22 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "routes.ts"
Cohesion: 0.07
Nodes (78): documentFor(), ChatNames, chatRoutes(), liveRoutes(), check(), notificationRoutes(), acceptanceRoutes(), buyerStep() (+70 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "eval-runner.ts"
Cohesion: 0.25
Nodes (13): alone(), councilRecord(), run(), score(), AloneRecord, CouncilEvalRecord, EvalOptions, EvalRecord (+5 more)

### Community 92 - "question-routes.test.ts"
Cohesion: 0.10
Nodes (23): db, FAILED, lineOf(), model(), NOT_ANSWERABLE, QuestionView, quoting(), View (+15 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "appeal.test.ts"
Cohesion: 0.11
Nodes (24): APPEAL_PROMPT_VERSION, appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask(), AppealTask, RANK_CRITERIA, context (+16 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (92): AcceptanceDocument(), AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView (+84 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "email/src/index.ts"
Cohesion: 0.08
Nodes (33): RFC-2606, emailAttachmentSchema, EmailFailure, emailMessageSchema, SendResult, bareAddress(), check, InboxNetworkError (+25 more)

### Community 101 - "db/src/index.ts"
Cohesion: 0.04
Nodes (92): PayPalWebhookOptions, CHAT_CHANNEL, chatEventSchema, parseChatEvent(), party, publishChatEvent(), sellerStageStep, checkedFileSchema (+84 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "IntakePanel.tsx"
Cohesion: 0.07
Nodes (41): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+33 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "DealPage.tsx"
Cohesion: 0.10
Nodes (32): checkLedger(), CompletenessItem, CompletenessView, getCompleteness(), getDeal(), getMe(), isCompleteness(), LedgerCheck (+24 more)

### Community 106 - "confirmation.ts"
Cohesion: 0.27
Nodes (10): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+2 more)

### Community 107 - "Council.tsx"
Cohesion: 0.21
Nodes (12): Agreement(), at(), BALLOTS, Borda(), CHAT, Drafting(), LINES, MODELS (+4 more)

### Community 108 - "appeal-items.ts"
Cohesion: 0.14
Nodes (17): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+9 more)

### Community 109 - "draft"
Cohesion: 0.22
Nodes (9): title(), draft(), unchanged(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work, council() (+1 more)

### Community 110 - "auth/sign-in.ts"
Cohesion: 0.11
Nodes (24): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+16 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "paypal-webhook.ts"
Cohesion: 0.27
Nodes (9): envelope, ParsedJson, parseJson(), receive(), record(), SELLER_WEBHOOK_PATH, SellerAlertLookup, sellerParams (+1 more)

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

### Community 123 - "receipt.test.ts"
Cohesion: 0.28
Nodes (6): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

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
Cohesion: 0.29
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

### Community 150 - "claim-routes.ts"
Cohesion: 0.13
Nodes (31): appealApplies(), ClaimRunner, analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob() (+23 more)

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

### Community 158 - "useTestDatabase"
Cohesion: 0.36
Nodes (5): createTestDatabase(), Engine, queryOn(), TestDatabase, useTestDatabase()

### Community 159 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 160 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "source"
Cohesion: 0.33
Nodes (6): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8)

### Community 165 - "server/package.json"
Cohesion: 0.05
Nodes (36): devDependencies, esbuild, tsx, @types/node, @types/ws, @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council (+28 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 167 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

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
Cohesion: 0.21
Nodes (16): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+8 more)

### Community 175 - "change-order-routes.ts"
Cohesion: 0.06
Nodes (63): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, fingerprinted(), money, sendTimelineReminders(), acceptBody, ChangeOrderRouteOptions (+55 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (47): addPastedChat(), checkPayments(), DealFile, DraftContent, draftsUrl(), getDraftById(), getMilestones(), getScope() (+39 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "PayPal sandbox notes"
Cohesion: 0.20
Nodes (10): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, PayPal sandbox notes, Reliability (+2 more)

### Community 183 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

### Community 186 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

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
- **134 isolated node(s):** `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`, `@pactpal/brand`, `mermaid` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1995 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `src/intake.ts`, `acceptance.ts`, `Dashboard.tsx`, `DeliveriesPanel.tsx`, `timeline-progress.ts`, `dispute-sync.ts`, `record.ts`, `receipt.ts`, `utcDateTime`, `claims/src/index.ts`, `council-record.ts`, `db/src/testing.ts`, `claim-analyses.ts`, `change-orders.ts`, `when`, `checker.ts`, `ScopePanel.tsx`, `ref_zod`, `question-routes.ts`, `deliveries.ts`, `draft-job.ts`, `resend-inbound.ts`, `when`, `council/src/index.ts`, `db/src/migrate.ts`, `seller-clients.ts`, `PacketPanel.tsx`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `PayPalRestClient`, `layouts.tsx`, `build.js`, `config.ts`, `notifier.ts`, `products/src/index.ts`, `injection-runner.ts`, `ledger/src/index.ts`, `readLedger`, `action-routes.ts`, `timeline/src/index.ts`, `paypal/src/index.ts`, `completeness.ts`, `addArtifact`, `DraftReview.tsx`, `app-link-routes.ts`, `scope-drafts.ts`, `qa/src/index.ts`, `database.ts`, `disputes/test-support.ts`, `sandbox-respond-report.ts`, `app.ts`, `retention.test.ts`, `react`, `disputes/test-support.ts`, `eval-runner.ts`, `question-routes.test.ts`, `sandbox-webhook-report.ts`, `appeal.test.ts`, `api.ts`, `render.ts`, `email/src/index.ts`, `db/src/index.ts`, `IntakePanel.tsx`, `DealPage.tsx`, `confirmation.ts`, `appeal-items.ts`, `auth/sign-in.ts`, `Ledger.tsx`, `package.json`, `receipt.test.ts`, `keyvalue.ts`, `Nav.tsx`, `MessagesPanel.tsx`, `pages.ts`, `change-order-routes.ts`, `DraftPanel.tsx`, `design/tokens.ts`, `log-labels.test.ts`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `pages.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12846068660022147 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `source`, `paypal/src/index.ts`, `README.md`, `timeline/src/index.ts`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `src/intake.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0707070707070707 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `paypal/src/index.ts` to `council-record.ts`, `ref_zod`, `when`, `Database`, `council/src/index.ts`, `scope-draft/src/index.ts`, `injection-runner.ts`, `ledger/src/index.ts`, `readLedger`, `ref_zod`, `Built (sub-phases 2b to 6h-1)`, `log-labels.test.ts`, `app-link-routes.ts`, `disputes/test-support.ts`, `vitest`, `routes.ts`, `email/src/index.ts`, `appeal-items.ts`, `draft`, `Decisions`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `acceptance.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08902439024390243 - nodes in this community are weakly interconnected._