# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 690 files · ~448,453 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: .css 8, (none) 5, .example 1)

## Summary
- 5337 nodes · 17124 edges · 161 communities (154 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 501 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4fd1383f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- appeal-items.ts
- Database
- net/src/index.ts
- question-routes.ts
- styles.ts
- .query
- AcceptancePanel.tsx
- Secret
- DraftReview.tsx
- sellers/disputes.test.ts
- isObject
- ledger/src/index.ts
- deals/routes.ts
- scope-draft/src/index.ts
- ai/src/index.ts
- email/src/index.ts
- paypal/src/index.ts
- ScopePanel.tsx
- App.tsx
- mcp.ts
- acceptance-routes.ts
- review.ts
- PayPalResult
- DraftReview.tsx
- dependencies
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- DealPage.tsx
- db/src/testing.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- eval-runner.ts
- delivery-routes.ts
- DealsTable.tsx
- checker.ts
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- notices.ts
- validate.ts
- eval-judge.ts
- config.ts
- app-link-routes.ts
- change-order-routes.ts
- dispute-actions.ts
- buildApp
- dispute-sync.ts
- claims.test.ts
- disputes/test-support.ts
- web/package.json
- Deadlines.tsx
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- ref_zod
- completeness.ts
- layouts.tsx
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-routes.ts
- paypal-webhook.ts
- postgres.ts
- deliveries.ts
- claims/package.json
- sandbox-respond-report.ts
- QuestionsPanel.tsx
- claims/src/index.ts
- receipt.test.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- draft-source.ts
- draft
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- devDependencies
- pdf/package.json
- products/package.json
- PayPalPartners
- ai/package.json
- chat.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- testSpec
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- api.ts
- council-record.ts
- council/package.json
- when
- vitest
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- Engineering standards
- package.json
- Decisions
- server/package.json
- Insights.tsx
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- dependencies
- useRoute.ts
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
- PactPal design system
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- access.ts
- .prettierrc.json
- products/tsconfig.json
- agent-requests.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- Data model
- sign-in-words.ts
- Scope
- vite-env.d.ts
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 207 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `isObject()` - 70 edges
8. `TEST_NOW` - 66 edges
9. `Secret` - 65 edges
10. `appendLedgerEvent()` - 63 edges

## Surprising Connections (you probably didn't know these)
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
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

## Communities (161 total, 7 thin omitted)

### Community 0 - "appeal-items.ts"
Cohesion: 0.11
Nodes (20): addedByRole(), fileView(), AlreadySent, DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+12 more)

### Community 1 - "Database"
Cohesion: 0.05
Nodes (59): ReceiptMailDeps, McpRouteOptions, AppOptions, LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome() (+51 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.06
Nodes (59): checkAsSellerApp(), checks, Engineering, ClientOptions, OpenAiCompatibleClient, ResendReceivedEmails, ResendEmailSender, ResendOptions (+51 more)

### Community 3 - "question-routes.ts"
Cohesion: 0.08
Nodes (31): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+23 more)

### Community 4 - "styles.ts"
Cohesion: 0.10
Nodes (37): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), CompletenessItem, CompletenessView, deliveriesUrl() (+29 more)

### Community 5 - ".query"
Cohesion: 0.03
Nodes (140): disputedDeal(), Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema (+132 more)

### Community 6 - "AcceptancePanel.tsx"
Cohesion: 0.25
Nodes (15): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), declineTerms(), emailReceiptAgain() (+7 more)

### Community 7 - "Secret"
Cohesion: 0.04
Nodes (61): linkApp(), sellerKeyBox(), RFC-2606, AI_RETRY_POLICY, errorBody, failure(), kindOfStatus(), ModelNetworkError (+53 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.07
Nodes (43): addFile(), addPastedChat(), DealFile, draftFrom(), draftsUrl(), DraftView, fileUrl(), getDraftById() (+35 more)

### Community 9 - "sellers/disputes.test.ts"
Cohesion: 0.15
Nodes (21): signedPayPal(), fakeAppWebhooks(), fakePayPal(), FakePayPalMode, db, setup(), box, checkDeps() (+13 more)

### Community 10 - "isObject"
Cohesion: 0.06
Nodes (58): addBuyer(), checkPayments(), createDeal(), DealSummary, errorMessage(), getCompleteness(), getDealOptions(), getLedger() (+50 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (68): createIntakeDeal(), DISPUTE_EVENT_PREFIX, agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError (+60 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.08
Nodes (63): emailReceipt(), emailReceiptQuietly(), afterQuery, ChatNames, ChatRouteOptions, chatRoutes(), postBody, REFUSALS (+55 more)

### Community 13 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (44): RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction() (+36 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.08
Nodes (37): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, `claim_analyses`: council comparisons of a dispute claim with the record (+29 more)

### Community 15 - "email/src/index.ts"
Cohesion: 0.08
Nodes (49): intakeFilename(), answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf() (+41 more)

### Community 16 - "paypal/src/index.ts"
Cohesion: 0.04
Nodes (79): AMOUNT_OPTIONS, InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema (+71 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (63): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+55 more)

### Community 18 - "App.tsx"
Cohesion: 0.13
Nodes (38): LinkProblem, redeemLink(), SIGN_IN_PATH, signOut(), App(), dealPage(), DealRoute, isDealRoute() (+30 more)

### Community 19 - "mcp.ts"
Cohesion: 0.09
Nodes (30): APP_KEYS, PayPalApp, checkMcp(), message(), result, APP_LABELS, appSection(), formatSandboxReport() (+22 more)

### Community 20 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (33): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), documentFor(), fingerprinted(), money (+25 more)

### Community 21 - "review.ts"
Cohesion: 0.09
Nodes (46): JobLog, MESSAGE_PROMPT_VERSIONS, MessageJob, runMessageJob(), checkAnalysis(), claimAnalysisSchema, ClaimContext, invalid() (+38 more)

### Community 22 - "PayPalResult"
Cohesion: 0.05
Nodes (49): send(), `buyer_questions`: questions about the agreement before signing, dollar, setup(), answered(), collect(), evidenceForm(), MAX_DISPUTE_PAGES (+41 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.09
Nodes (32): ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, FillChat, fillFrom() (+24 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.08
Nodes (54): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), JsonSchema, TokenUsage (+46 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.08
Nodes (38): Listen, listeners(), postgresBus(), publishingBus(), loadConfigOrExit(), pickModels(), selectedClientsOrExit(), Config (+30 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.15
Nodes (16): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+8 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.07
Nodes (42): checkLedger(), getDeal(), getMe(), LedgerCheck, LedgerEntryView, ScopeTerms, ScopeView, PastedChat (+34 more)

### Community 29 - "db/src/testing.ts"
Cohesion: 0.07
Nodes (48): db, sentStage(), paidFromOwnApp(), AnalysisNotAllowedError, db, disputed(), refusal(), postgresContentStore() (+40 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.07
Nodes (54): AppealCheckView, AppealView, buildPacket(), checkAppeal(), CouncilView, disputesUrl(), draftResponse(), draftStatement() (+46 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (32): two, DraftStepKind, EvalCase, EvalGold, linesOf(), baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES (+24 more)

### Community 32 - "eval-runner.ts"
Cohesion: 0.12
Nodes (23): logProgress(), valueOrExit(), modelNames(), draftCategories, alone(), councilRecord(), run(), score() (+15 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (51): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+43 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.11
Nodes (39): Money, CommandPalette(), PLACES, Dashboard(), DealList(), Cell, COLUMNS, DealsTable() (+31 more)

### Community 35 - "checker.ts"
Cohesion: 0.09
Nodes (27): BUTTON_WINDOW_MS, checkKey(), CheckRequest, inProcessChecker(), renderClaimRunner(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+19 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.08
Nodes (51): buildReceipt(), ReceiptIntegrityError, attachmentHeader(), sendDownload(), aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource (+43 more)

### Community 37 - "receipt.ts"
Cohesion: 0.09
Nodes (37): acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), AcceptanceDocument(), AcceptanceDocument, isListingPreview() (+29 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.14
Nodes (19): Channel3Lookup, LookupRefusal, MAX_PHOTO_BYTES, NoAnswerError, PHOTO_HOST, fakeChannel3(), NOW, attributeName() (+11 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (26): DroppedDraft, droppedSection(), ruleOf(), aloneRow(), aloneSection(), cell(), chatSection(), councilSection() (+18 more)

### Community 40 - "notices.ts"
Cohesion: 0.12
Nodes (25): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+17 more)

### Community 41 - "validate.ts"
Cohesion: 0.12
Nodes (31): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, buyerProvidesOf(), DraftStep (+23 more)

### Community 42 - "eval-judge.ts"
Cohesion: 0.21
Nodes (18): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+10 more)

### Community 43 - "config.ts"
Cohesion: 0.10
Nodes (25): result, ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), FEATURES, formatReport(), hopsValue (+17 more)

### Community 44 - "app-link-routes.ts"
Cohesion: 0.10
Nodes (31): currentSession(), linkBody, paypalUnavailable(), SELLER_APP_PATH, SellerAppRouteOptions, sellerAppRoutes(), registerAlerts(), removeAlerts() (+23 more)

### Community 45 - "change-order-routes.ts"
Cohesion: 0.12
Nodes (22): acceptBody, ChangeOrderRouteOptions, changeParams, declineBody, proposeBody, proposedContent(), REFUSALS, sha256 (+14 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (27): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+19 more)

### Community 47 - "buildApp"
Cohesion: 0.09
Nodes (17): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+9 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.13
Nodes (23): DisputeReader, LinkedDisputeAccount, changedSince(), Counts, DisputeSyncDeps, readTooSoon(), readVersionOf(), sameSecond() (+15 more)

### Community 49 - "claims.test.ts"
Cohesion: 0.13
Nodes (19): claimLines(), ClaimText, linesOf(), AGREEMENT, CLAIM, context, ENTRIES, MAYA (+11 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.07
Nodes (35): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+27 more)

### Community 51 - "web/package.json"
Cohesion: 0.07
Nodes (27): devDependencies, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline (+19 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.11
Nodes (29): BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow (+21 more)

### Community 53 - "tools.ts"
Cohesion: 0.09
Nodes (29): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+21 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (21): key(), seller(), `acceptances`: signed agreements, `agent_requests`: what an agent asks the seller to let it do (8c), Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work (+13 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.09
Nodes (38): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+30 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.05
Nodes (61): looks(), isPicture(), photo(), PhotoError, MAX_PHOTO_SIDE, toJpeg(), factsWords(), FORMAT_WORDS (+53 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (72): sendTimelineReminders(), changeView(), dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, overviewOf() (+64 more)

### Community 59 - "ref_zod"
Cohesion: 0.04
Nodes (83): CHAT_TRANSCRIPT_PREFIX, DealLookup, sendRefusal(), checkBody, checkView(), DeliveryCheckRouteOptions, LookResult, MAX_LOOKS_PER_CHECK (+75 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "layouts.tsx"
Cohesion: 0.09
Nodes (30): Me, IconName, PATHS, Logo(), LogoMark(), applyTheme(), isDark(), nextTheme() (+22 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.15
Nodes (29): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), isDisputeActions() (+21 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.19
Nodes (27): appealFacts(), appealItems(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS (+19 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.11
Nodes (25): checkedDraft(), countRow, draftFingerprint(), DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow, DraftStateError (+17 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.16
Nodes (26): appealApplies(), analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob(), councilView (+18 more)

### Community 69 - "paypal-webhook.ts"
Cohesion: 0.11
Nodes (20): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+12 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "deliveries.ts"
Cohesion: 0.09
Nodes (33): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+25 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (82): amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked(), readOptions() (+74 more)

### Community 74 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (72): candidates(), JsonReply, parseJsonReply(), spec, tryParse(), AppealCheck, AppealContext, checkAppeal() (+64 more)

### Community 76 - "receipt.test.ts"
Cohesion: 0.32
Nodes (6): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

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

### Community 81 - "draft-source.ts"
Cohesion: 0.32
Nodes (6): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage

### Community 82 - "draft"
Cohesion: 0.33
Nodes (6): title(), draft(), unchanged(), `deals`, `scope_drafts`: AI drafts of the agreed work, `scope_versions`: the agreed work

### Community 83 - "db/src/index.ts"
Cohesion: 0.03
Nodes (134): disputeRoutes(), listArtifacts(), CHAT_CHANNEL, ChatEvent, chatEventSchema, parseChatEvent(), party, publishChatEvent() (+126 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 87 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "chat.ts"
Cohesion: 0.08
Nodes (27): addCard(), body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage() (+19 more)

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "testSpec"
Cohesion: 0.06
Nodes (47): councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model(), clients() (+39 more)

### Community 97 - "render.ts"
Cohesion: 0.10
Nodes (23): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, breakWord(), CharacterSet, columnWidths() (+15 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.05
Nodes (54): BusSignal, memoryBus(), db, hubOnTestDeal(), messageView(), LiveHub, LivePage, Online (+46 more)

### Community 101 - "api.ts"
Cohesion: 0.05
Nodes (71): AgentRequestsPanel(), AgentRequestView, answerAgentRequest(), AnswerOptionView, BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus (+63 more)

### Community 103 - "council-record.ts"
Cohesion: 0.10
Nodes (24): councilRecordOf(), compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided() (+16 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 107 - "when"
Cohesion: 0.09
Nodes (39): analysesUrl(), checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), DisputesView, getClaimAnalyses() (+31 more)

### Community 110 - "vitest"
Cohesion: 0.03
Nodes (164): agentDeal(), db, mcpClient(), ToolResult, db, SESSION_COOKIE, db, dealWithBuyer() (+156 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.18
Nodes (11): at(), source(), `artifacts` and `file_contents`: the deal's files, `dispute_checks`: each check of the seller's disputes, `webhook_events`: notifications as received, Agents (Phase 8), AI, Decisions (+3 more)

### Community 119 - "server/package.json"
Cohesion: 0.06
Nodes (31): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+23 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.11
Nodes (26): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+18 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.17
Nodes (12): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+4 more)

### Community 123 - "PayPal sandbox notes"
Cohesion: 0.20
Nodes (10): Accounts and apps, Acting on behalf of a seller, Creating test disputes, Documentation, Log in with PayPal, MCP and REST, PayPal sandbox notes, Reliability (+2 more)

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

### Community 129 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+9 more)

### Community 131 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

### Community 133 - "Demo plan"
Cohesion: 0.22
Nodes (8): Contrast clip: a thin packet, Demo plan, Honesty rules for the demo, Seed script, Story 1: Maya, digital artist (main story), Story 2: Daniel, freelance web developer (change order and appeal), Story 3: Jun, digital templates (download log), Video script (under 3 minutes)

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

### Community 150 - "PactPal design system"
Cohesion: 0.15
Nodes (13): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+5 more)

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

### Community 158 - "access.ts"
Cohesion: 0.14
Nodes (20): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), dealParams, FoundDeal (+12 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "agent-requests.ts"
Cohesion: 0.06
Nodes (50): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest() (+42 more)

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 172 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 173 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

## Knowledge Gaps
- **120 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1754 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `appeal-items.ts`, `net/src/index.ts`, `useRoute.ts`, `question-routes.ts`, `.query`, `Secret`, `DraftReview.tsx`, `sellers/disputes.test.ts`, `isObject`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `ai/src/index.ts`, `email/src/index.ts`, `paypal/src/index.ts`, `ScopePanel.tsx`, `mcp.ts`, `review.ts`, `PayPalResult`, `DraftReview.tsx`, `council/src/index.ts`, `db/src/migrate.ts`, `DealPage.tsx`, `db/src/testing.ts`, `web/src/format.ts`, `scope-draft/src/testing.ts`, `eval-runner.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `checker.ts`, `packet-service.ts`, `agent-requests.ts`, `products/src/index.ts`, `eval-report.ts`, `log-labels.test.ts`, `receipt.ts`, `validate.ts`, `config.ts`, `app-link-routes.ts`, `sign-in-words.ts`, `dispute-actions.ts`, `buildApp`, `dispute-sync.ts`, `claims.test.ts`, `disputes/test-support.ts`, `Deadlines.tsx`, `action-routes.ts`, `delivery-check/src/index.ts`, `timeline/src/index.ts`, `ref_zod`, `completeness.ts`, `layouts.tsx`, `scope-drafts.ts`, `paypal-webhook.ts`, `postgres.ts`, `deliveries.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `receipt.test.ts`, `draft-source.ts`, `db/src/index.ts`, `chat.ts`, `sandbox-webhook-report.ts`, `testSpec`, `render.ts`, `live-hub.ts`, `api.ts`, `council-record.ts`, `when`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `appeal-items.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `net/src/index.ts` to `Database`, `Secret`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `ai/src/index.ts`, `email/src/index.ts`, `paypal/src/index.ts`, `PayPalResult`, `council/src/index.ts`, `web/src/format.ts`, `packet-service.ts`, `log-labels.test.ts`, `app-link-routes.ts`, `change-order-routes.ts`, `disputes/test-support.ts`, `Built (sub-phases 2b to 6h-1)`, `ref_zod`, `DisputeActions.tsx`, `claim-job.ts`, `claims/src/index.ts`, `draft`, `vitest`, `Decisions`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.05228105228105228 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `dispute-sync.ts`, `timeline/src/index.ts`, `net/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055921855921855924 - nodes in this community are weakly interconnected._