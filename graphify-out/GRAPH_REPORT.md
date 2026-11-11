# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 770 files · ~510,469 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 22 file(s) not represented in the graph (top: .css 16, (none) 5, .example 1)

## Summary
- 5906 nodes · 18450 edges · 191 communities (186 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 519 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1a94f1df`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- paypal/src/index.ts
- appendLedgerEvent
- Dashboard.tsx
- DeliverPanel.tsx
- seed-sandbox.ts
- dispute-sync.ts
- record.ts
- receipt.ts
- utcDateTime
- claims/src/index.ts
- dispute-actions.ts
- testId
- claim-analyses.ts
- change-orders.ts
- DealPage.tsx
- server/src/index.ts
- ScopePanel.tsx
- ref_zod
- question-routes.ts
- threads.ts
- draft-job.ts
- milestones.ts
- when
- Database
- council/src/index.ts
- disputes/task.ts
- db/src/migrate.ts
- PayPalRestClient
- claim-job.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- validate.ts
- scope-draft/src/index.ts
- App.tsx
- Deadlines.tsx
- packet-service.ts
- delivery-check.test.ts
- claims/src/check.ts
- eval-report.ts
- errors.ts
- layouts.tsx
- build.js
- config.ts
- notifier.ts
- postgres.ts
- products/src/index.ts
- Insights.tsx
- dependencies
- ledger/src/index.ts
- vitest
- web/package.json
- deals/routes.ts
- resend-inbound.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- paypal/src/index.ts
- completeness.ts
- testSpec
- DraftReview.tsx
- services
- Pillars.tsx
- scripts
- db/package.json
- postgresContentStore
- main.tsx
- draft-routes.ts
- deals.ts
- disputes/test-support.ts
- claims/package.json
- sandbox-respond-report.ts
- app.ts
- Landing.tsx
- landing-words.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- vitest
- eval-runner.ts
- Agents.tsx
- scope-draft/package.json
- paypal/package.json
- chain-scene.ts
- postStep
- products/package.json
- routes.ts
- ai/package.json
- Closing.tsx
- pages.tsx
- scripts
- sandbox-webhook-report.ts
- bus.ts
- api.ts
- render.ts
- email/package.json
- compilerOptions
- check-words.ts
- db/src/index.ts
- pdf/package.json
- AgentPanel.tsx
- council/package.json
- detectMediaType
- build.ts
- Tour.tsx
- web-pages.test.ts
- devDependencies
- score/package.json
- PactPal product spec
- devDependencies
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
- source
- image.ts
- .prettierrc.json
- products/tsconfig.json
- server/package.json
- docs/tsconfig.json
- pages.ts
- index.md
- Redesign plan (proposed Phase 7R)
- ref_zod
- vite-env.d.ts
- src-app-tsx.md
- engines
- readChecked
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

## Communities (191 total, 5 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (66): AcceptancePanel(), ReceiptEmails(), AnswerBox(), Revisions, revisionWords(), acceptanceStep(), acceptanceUrl(), acceptTerms() (+58 more)

### Community 1 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (43): EvidenceFileError, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf, Actor (+35 more)

### Community 2 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (76): AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance(), declineTerms (+68 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.10
Nodes (40): Money, PLACES, Dashboard(), DealList(), Cell, COLUMNS, DealsTable(), EXPORT (+32 more)

### Community 4 - "DeliverPanel.tsx"
Cohesion: 0.11
Nodes (26): addFile(), checksUrl(), fileUrl(), getDeliveryChecks(), isChecks(), isFile(), isReading(), listFiles() (+18 more)

### Community 5 - "seed-sandbox.ts"
Cohesion: 0.10
Nodes (23): buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions(), formatPayTimeout() (+15 more)

### Community 6 - "dispute-sync.ts"
Cohesion: 0.18
Nodes (18): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+10 more)

### Community 7 - "record.ts"
Cohesion: 0.33
Nodes (9): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+1 more)

### Community 8 - "receipt.ts"
Cohesion: 0.09
Nodes (38): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), AcceptanceDocument(), AcceptanceDocument (+30 more)

### Community 9 - "utcDateTime"
Cohesion: 0.09
Nodes (44): DueNotice, emailFor(), EVENT_KINDS, NOTICE_WINDOW_MS, REMINDER_MARKS, withoutRepeats(), answerEmail(), AnswerFacts (+36 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.09
Nodes (59): parseJsonReply(), tryParse(), AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, appealMessages() (+51 more)

### Community 11 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (28): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+20 more)

### Community 12 - "testId"
Cohesion: 0.08
Nodes (41): db, dealWithBuyer(), maya, report, db, goodsDeal(), SCOPE, WEBP (+33 more)

### Community 13 - "claim-analyses.ts"
Cohesion: 0.06
Nodes (37): refusal(), ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisNotAllowedError, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord (+29 more)

### Community 14 - "change-orders.ts"
Cohesion: 0.04
Nodes (67): waitingChange(), AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+59 more)

### Community 15 - "DealPage.tsx"
Cohesion: 0.04
Nodes (87): checkLedger(), getDeal(), getMe(), isDeal(), LedgerCheck, LedgerEntryView, listDeals(), ScopeTerms (+79 more)

### Community 16 - "server/src/index.ts"
Cohesion: 0.07
Nodes (30): sameWorkflowTask(), APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, ASK_MODEL_TASK_NAME, DISPUTE_TASK_NAME (+22 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (67): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+59 more)

### Community 18 - "ref_zod"
Cohesion: 0.04
Nodes (85): Config, RFC-2606, bareAddress(), check, InboxNetworkError, ReadResult, receivedAnswer, ReceivedEmail (+77 more)

### Community 19 - "question-routes.ts"
Cohesion: 0.09
Nodes (30): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+22 more)

### Community 20 - "threads.ts"
Cohesion: 0.12
Nodes (25): Conversation, isConversation(), isLast(), LastMessage, listConversations(), MessagesPage(), People(), plainClick() (+17 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.11
Nodes (34): runPrepared(), draftCategories, toCouncilRecord(), toJson(), DraftJob, JobLog, runDraftJob(), MESSAGE_PROMPT_VERSIONS (+26 more)

### Community 22 - "milestones.ts"
Cohesion: 0.13
Nodes (22): sentStage(), InvoicePaid, invoicePaidSchema, InvoiceSent, invoiceSentSchema, markInvoicePaid(), markInvoiceSent(), MILESTONE_STATUSES (+14 more)

### Community 23 - "when"
Cohesion: 0.09
Nodes (41): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), disputesUrl(), DisputesView (+33 more)

### Community 24 - "Database"
Cohesion: 0.04
Nodes (88): MAX_RECEIPT_EMAILS, ReceiptMailDeps, ReceiptMailResult, receiptSentPayload, Role, ROLES, AGENT_CALLS_PER_MINUTE, bearerOf() (+80 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (56): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), schemaEnforced(), TokenUsage (+48 more)

### Community 26 - "disputes/task.ts"
Cohesion: 0.04
Nodes (69): AppOptions, CronStart, runCronJob(), ListingRouteOptions, CHECK_INTERVAL_MS, DealOptions, ActionRouteOptions, DisputeWriter (+61 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.27
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+3 more)

### Community 28 - "PayPalRestClient"
Cohesion: 0.07
Nodes (35): checkMcp(), APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients() (+27 more)

### Community 29 - "claim-job.ts"
Cohesion: 0.14
Nodes (31): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+23 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.07
Nodes (53): AppealCheckView, AppealView, buildPacket(), checkAppeal(), CouncilView, draftResponse(), draftStatement(), draftSummary() (+45 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (34): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES, ChatCase (+26 more)

### Community 32 - "validate.ts"
Cohesion: 0.14
Nodes (27): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+19 more)

### Community 33 - "scope-draft/src/index.ts"
Cohesion: 0.04
Nodes (79): councilRecordOf(), draftRoutes(), beginDraft(), sourceFile(), chosenDraft(), same, CouncilRecord, councilRecordSchema (+71 more)

### Community 34 - "App.tsx"
Cohesion: 0.09
Nodes (36): signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage (+28 more)

### Community 35 - "Deadlines.tsx"
Cohesion: 0.11
Nodes (29): BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow (+21 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+38 more)

### Community 37 - "delivery-check.test.ts"
Cohesion: 0.20
Nodes (11): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+3 more)

### Community 38 - "claims/src/check.ts"
Cohesion: 0.09
Nodes (37): checkAnalysis(), ClaimAnalysis, claimAnalysisSchema, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT (+29 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.10
Nodes (39): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+31 more)

### Community 40 - "errors.ts"
Cohesion: 0.09
Nodes (22): dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy, FallbackRequest (+14 more)

### Community 41 - "layouts.tsx"
Cohesion: 0.14
Nodes (24): Me, CommandPalette(), Unread(), Icon(), IconName, PATHS, Logo(), Account() (+16 more)

### Community 42 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 43 - "config.ts"
Cohesion: 0.05
Nodes (54): result, loadConfigOrExit(), pickModels(), selectedClientsOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS (+46 more)

### Community 44 - "notifier.ts"
Cohesion: 0.07
Nodes (32): BusSignal, Listen, memoryBus(), db, hubOnTestDeal(), LiveHub, LivePage, Online (+24 more)

### Community 45 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 46 - "products/src/index.ts"
Cohesion: 0.14
Nodes (19): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+11 more)

### Community 47 - "Insights.tsx"
Cohesion: 0.17
Nodes (15): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+7 more)

### Community 48 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+14 more)

### Community 49 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (64): agentBodySha256(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom() (+56 more)

### Community 50 - "vitest"
Cohesion: 0.03
Nodes (158): db, agentDeal(), db, mcpClient(), ToolResult, db, SESSION_COOKIE, chatDeal() (+150 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (30): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @fontsource/instrument-serif, @fontsource-variable/geist (+22 more)

### Community 52 - "deals/routes.ts"
Cohesion: 0.05
Nodes (91): currentDocument(), buildReceipt(), emailReceiptQuietly(), receiptsSent(), ReceiptIntegrityError, AgentRequestRouteOptions, agentRequestRoutes(), listQuery (+83 more)

### Community 53 - "resend-inbound.ts"
Cohesion: 0.11
Nodes (26): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+18 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.09
Nodes (23): seller(), title(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `claim_analyses`: council comparisons of a dispute claim with the record, `deal_messages`: the deal's chat (7b) (+15 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.07
Nodes (47): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+39 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.13
Nodes (22): DeliveryCheckView, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, RequirementResult (+14 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (72): sendTimelineReminders(), changeView(), dealCompleteness(), judgedScope(), CompletenessRouteOptions, completenessRoutes(), dealOverview, DealStage (+64 more)

### Community 59 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (43): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeDetails (+35 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "testSpec"
Cohesion: 0.05
Nodes (57): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), clients() (+49 more)

### Community 62 - "DraftReview.tsx"
Cohesion: 0.05
Nodes (62): addPastedChat(), ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent, draftFrom() (+54 more)

### Community 63 - "services"
Cohesion: 0.05
Nodes (40): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+32 more)

### Community 64 - "Pillars.tsx"
Cohesion: 0.16
Nodes (18): BrandLogo(), BrandName, LOGOS, at(), Rails(), Agent(), at(), Countdown() (+10 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "postgresContentStore"
Cohesion: 0.06
Nodes (54): db, withReadyDraft(), waitingDraft(), addArtifact(), postgresContentStore(), verifyStoredLedger(), Call, allowPurge() (+46 more)

### Community 68 - "main.tsx"
Cohesion: 0.16
Nodes (12): applyTheme(), isDark(), nextTheme(), ORDER, readTheme(), savedTheme(), Theme, now() (+4 more)

### Community 69 - "draft-routes.ts"
Cohesion: 0.07
Nodes (46): CHAT_TRANSCRIPT_PREFIX, featureAnswers(), step(), checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes(), looks() (+38 more)

### Community 70 - "deals.ts"
Cohesion: 0.06
Nodes (53): addBuyer, addBuyerSchema, BuyerNotAllowedError, BuyerRefusal, CATEGORY_IDS, DEAL_CURRENCIES, DEAL_KINDS, DealCategory (+45 more)

### Community 71 - "disputes/test-support.ts"
Cohesion: 0.05
Nodes (68): ActionsView, confirmed(), db, disputedDeal(), FILES, sha(), answer, AppealView (+60 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (80): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), logProgress(), message(), payPalIdOption() (+72 more)

### Community 74 - "app.ts"
Cohesion: 0.04
Nodes (60): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), LinkOptions, linkRoutes() (+52 more)

### Community 75 - "Landing.tsx"
Cohesion: 0.15
Nodes (11): ART, at(), dots(), Features(), Landing(), at(), Moves(), SHOTS (+3 more)

### Community 76 - "landing-words.ts"
Cohesion: 0.15
Nodes (21): Audience(), GLYPHS, SPOTS, Sticker(), Dispute(), drift(), AGENT_RUN, CLAIM (+13 more)

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

### Community 81 - "vitest"
Cohesion: 0.05
Nodes (57): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, ClaimJobDeps (+49 more)

### Community 82 - "eval-runner.ts"
Cohesion: 0.13
Nodes (29): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+21 more)

### Community 83 - "Agents.tsx"
Cohesion: 0.15
Nodes (15): BUILD, Gate, sceneOf(), SEND, Agents(), AI_SIDES, at(), Cube() (+7 more)

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
Nodes (62): documentFor(), fingerprinted(), emailReceipt(), view(), accessSummary(), answerView(), changesBody, deliveryId (+54 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "Closing.tsx"
Cohesion: 0.20
Nodes (13): at(), Closing(), LIMIT_GLYPHS, Tagline(), Hero(), Ticker(), useChainScene(), scrambled() (+5 more)

### Community 92 - "pages.tsx"
Cohesion: 0.32
Nodes (14): STAGE_ORDER, Deadlines, DeadlinesPage(), DealsPage(), DealsTable, DisputesPage(), Insights, InsightsPage() (+6 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (24): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+16 more)

### Community 95 - "bus.ts"
Cohesion: 0.24
Nodes (9): listeners(), postgresBus(), publishingBus(), CHAT_CHANNEL, ChatEvent, chatEventSchema, parseChatEvent(), party (+1 more)

### Community 96 - "api.ts"
Cohesion: 0.04
Nodes (93): AgentRequestsPanel(), AcceptanceView, AgentRequestView, answerAgentRequest(), answerBuyerQuestion(), AnswerOptionView, askAboutAgreement(), askSellerInstead() (+85 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "check-words.ts"
Cohesion: 0.36
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport()

### Community 101 - "db/src/index.ts"
Cohesion: 0.02
Nodes (168): addCard(), disputeRoutes(), eventNotice(), sendDisputeNotices(), linkedSeller(), `deliveries` and `delivery_files`: delivered work, originOf(), AGENT_CODE_LIFETIME_MS (+160 more)

### Community 102 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 103 - "AgentPanel.tsx"
Cohesion: 0.18
Nodes (15): AGENT_CAN, AGENT_CANNOT, AgentClient, agentClients(), KEY_PLACEHOLDER, mcpAddress(), AgentKey(), AgentPanel() (+7 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "detectMediaType"
Cohesion: 0.33
Nodes (7): isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), detectMediaType(), sharp

### Community 106 - "build.ts"
Cohesion: 0.22
Nodes (8): css, dist, faces, FONTS, home, problems, root, marked

### Community 107 - "Tour.tsx"
Cohesion: 0.09
Nodes (16): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+8 more)

### Community 108 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 109 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

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
Cohesion: 0.24
Nodes (7): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), Acceptance, pdfTextLines()

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

### Community 130 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 131 - "Nav.tsx"
Cohesion: 0.32
Nodes (10): Chevron(), Group(), NAV, NavItem, NavLink, navOwner(), navPlaces(), PAGE_ORDER (+2 more)

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
Cohesion: 0.18
Nodes (25): appealApplies(), RunnerBusyError, analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+17 more)

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
Cohesion: 0.29
Nodes (6): Row, createTestDatabase(), Engine, queryOn(), TestDatabase, useTestDatabase()

### Community 159 - "source"
Cohesion: 0.17
Nodes (12): review(), at(), source(), `artifacts` and `file_contents`: the deal's files, Data model, `dispute_checks`: each check of the seller's disputes, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space) (+4 more)

### Community 160 - "image.ts"
Cohesion: 0.35
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 165 - "server/package.json"
Cohesion: 0.06
Nodes (32): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+24 more)

### Community 166 - "docs/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 171 - "pages.ts"
Cohesion: 0.18
Nodes (19): anchorOf(), cards(), contents(), escapeHtml(), Group, GROUPS, HONESTY, introOf() (+11 more)

### Community 172 - "index.md"
Cohesion: 0.20
Nodes (6): Five steps, How the AI drafts, What the AI never does, Getting paid through PayPal, Invoices for each stage, When your buyer pays

### Community 173 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 175 - "ref_zod"
Cohesion: 0.10
Nodes (25): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, money, acceptBody, changeParams, declineBody, proposeBody (+17 more)

### Community 176 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 179 - "readChecked"
Cohesion: 0.24
Nodes (15): addBuyer(), checkPayments(), errorMessage(), getMilestones(), isMilestones(), makeBuyerLink(), milestonesUrl(), MilestonesView (+7 more)

### Community 180 - "design/tokens.ts"
Cohesion: 0.28
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 181 - "PayPal sandbox notes"
Cohesion: 0.18
Nodes (11): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, Moving a dispute to a verdict, PayPal sandbox notes (+3 more)

### Community 183 - "brand/src/index.ts"
Cohesion: 0.49
Nodes (7): MARK_FILLS, MARK_GRADIENTS, MARK_STROKE_WIDTH, MARK_STROKES, MARK_VIEWBOX, MarkPaint, markSvg()

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
- **134 isolated node(s):** `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`, `@pactpal/brand`, `mermaid` (+129 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1996 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `react`, `paypal/src/index.ts`, `appendLedgerEvent`, `Dashboard.tsx`, `Nav.tsx`, `seed-sandbox.ts`, `dispute-sync.ts`, `DeliverPanel.tsx`, `receipt.ts`, `utcDateTime`, `dispute-actions.ts`, `testId`, `claim-analyses.ts`, `change-orders.ts`, `DealPage.tsx`, `server/src/index.ts`, `ScopePanel.tsx`, `ref_zod`, `question-routes.ts`, `threads.ts`, `draft-job.ts`, `milestones.ts`, `when`, `council/src/index.ts`, `disputes/task.ts`, `db/src/migrate.ts`, `PayPalRestClient`, `claim-job.ts`, `scope-draft/src/testing.ts`, `validate.ts`, `scope-draft/src/index.ts`, `App.tsx`, `Deadlines.tsx`, `packet-service.ts`, `delivery-check.test.ts`, `claims/src/check.ts`, `eval-report.ts`, `errors.ts`, `layouts.tsx`, `pages.ts`, `notifier.ts`, `config.ts`, `postgres.ts`, `ref_zod`, `products/src/index.ts`, `ledger/src/index.ts`, `design/tokens.ts`, `resend-inbound.ts`, `action-routes.ts`, `timeline/src/index.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `testSpec`, `DraftReview.tsx`, `completeness.ts`, `postgresContentStore`, `main.tsx`, `deals.ts`, `disputes/test-support.ts`, `sandbox-respond-report.ts`, `app.ts`, `landing-words.ts`, `vitest`, `Agents.tsx`, `postStep`, `sandbox-webhook-report.ts`, `api.ts`, `render.ts`, `check-words.ts`, `db/src/index.ts`, `AgentPanel.tsx`, `detectMediaType`, `web-pages.test.ts`, `Ledger.tsx`, `package.json`, `receipt.test.ts`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **What connects `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif` to the rest of the system?**
  _134 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.059940059940059943 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `README.md`, `vitest`, `timeline/src/index.ts`, `paypal/src/index.ts`, `source`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05837173579109063 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `vitest` to `scope-draft/src/index.ts`, `paypal/src/index.ts`, `draft-routes.ts`, `db/src/index.ts`, `ledger/src/index.ts`, `vitest`, `ref_zod`, `when`, `Decisions`, `Built (sub-phases 2b to 6h-1)`, `Database`, `council/src/index.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `claim-job.ts`, `web/src/format.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._