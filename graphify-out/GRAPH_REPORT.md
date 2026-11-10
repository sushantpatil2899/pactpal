# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 713 files · ~477,365 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: .css 12, (none) 5, .example 1)

## Summary
- 5493 nodes · 17457 edges · 176 communities (171 shown, 5 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 503 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `272bccd0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- paypal/src/index.ts
- question-routes.ts
- net/src/index.ts
- postgres.test.ts
- styles.ts
- .query
- layouts.tsx
- Secret
- seller-app.ts
- readChecked
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- scope-draft/src/index.ts
- vitest
- utcDateTime
- ai/src/index.ts
- ScopePanel.tsx
- App.tsx
- mcp.ts
- claims/src/check.ts
- qa/src/index.ts
- PayPalRestClient
- DraftReview.tsx
- dependencies
- council/src/index.ts
- scope.ts
- validate.ts
- DealPage.tsx
- testId
- when
- scope-draft/src/testing.ts
- injection-runner.ts
- delivery-routes.ts
- DealsTable.tsx
- disputes/test-support.ts
- packet-service.ts
- receipt.ts
- products/src/index.ts
- eval-report.ts
- dispute-sync.ts
- schema.ts
- ChatOutcome
- config.ts
- claim-job.ts
- access.ts
- dispute-actions.ts
- app-link-routes.ts
- paypal/src/disputes.ts
- db/src/index.ts
- eval-runner.test.ts
- web/package.json
- Deadlines.tsx
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- change-order-routes.ts
- delivery-routes.ts
- completeness.ts
- chain-scene.ts
- DisputeActions.tsx
- services
- db/src/migrate.ts
- scripts
- db/package.json
- scope-routes.ts
- claim-routes.ts
- questions.ts
- resend-inbound.ts
- delivery-routes.ts
- claims/package.json
- sandbox-respond-report.ts
- SellerAppPanel.tsx
- claims/src/index.ts
- Pillars.tsx
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- readLedger
- server/src/index.ts
- change-orders.test.ts
- scope-draft/package.json
- paypal/package.json
- record.ts
- Landing.tsx
- products/package.json
- Database
- ai/package.json
- appeal.test.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- runner.test.ts
- appeal-items.ts
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- web-pages.test.ts
- db/src/testing.ts
- pdf/package.json
- council/package.json
- eval-judge.ts
- dispute-view.ts
- QuestionsPanel.tsx
- delivery-check.test.ts
- draft-job.ts
- test-app.ts
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- Phase 7 (deal space)
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
- image.ts
- dependencies
- Layout
- draft-changes.ts
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
- Ledger.tsx
- useRoute.ts
- confirmation.ts
- overview.ts
- .prettierrc.json
- products/tsconfig.json
- Council.tsx
- check-words.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- seller-connections.ts
- appeal-coverage.ts
- seller-connections.test.ts
- Scope
- vite-env.d.ts
- devDependencies
- src-app-tsx.md
- engines

## God Nodes (most connected - your core abstractions)
1. `vitest` - 209 edges
2. `Database` - 125 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `useMigratedTestDatabase()` - 79 edges
6. `sha256Hex()` - 78 edges
7. `react` - 74 edges
8. `isObject()` - 70 edges
9. `TEST_NOW` - 66 edges
10. `Secret` - 65 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
- ``change_orders`: changes to a signed agreement` --references--> `proposed()`  [INFERRED]
  docs/data-model.md → packages/db/src/change-orders.test.ts
- `1. Architecture and structure` --references--> `PayPalClient`  [INFERRED]
  docs/engineering-standards.md → packages/paypal/src/index.ts
- `Phase 6 sub-phases` --references--> `PlatformSellerClients`  [INFERRED]
  docs/build-plan.md → packages/paypal/src/seller-clients.ts
- `AI` --references--> `normalizeForMatch()`  [INFERRED]
  docs/decisions.md → packages/scope-draft/src/validate.ts

## Import Cycles
- None detected.

## Communities (176 total, 5 thin omitted)

### Community 0 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (52): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, TestDisputeItem (+44 more)

### Community 1 - "question-routes.ts"
Cohesion: 0.11
Nodes (27): McpRouteOptions, Card, Notifier, PartyNotice, answerBody, askBody, Attempt, MODELS_PER_QUESTION (+19 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.07
Nodes (32): checks, authAssertion(), base64Url(), Call, item, json(), Reply, setup() (+24 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.11
Nodes (14): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgClient (+6 more)

### Community 4 - "styles.ts"
Cohesion: 0.14
Nodes (27): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, deliveryFileUrl() (+19 more)

### Community 5 - ".query"
Cohesion: 0.05
Nodes (96): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+88 more)

### Community 6 - "layouts.tsx"
Cohesion: 0.14
Nodes (22): Me, IconName, Logo(), applyTheme(), nextTheme(), ORDER, readTheme(), savedTheme() (+14 more)

### Community 7 - "Secret"
Cohesion: 0.04
Nodes (74): sellerKeyBox(), RFC-2606, Engineering, AI_RETRY_POLICY, ClientOptions, errorBody, failure(), kindOfStatus() (+66 more)

### Community 8 - "seller-app.ts"
Cohesion: 0.20
Nodes (10): ownAccountId(), FEATURE_SCOPES, grantedFeatures(), checkSellerApp(), refusedWith(), SELLER_APP_FEATURES, SellerAppCheck, SellerAppCheckOptions (+2 more)

### Community 9 - "readChecked"
Cohesion: 0.08
Nodes (44): addBuyer(), addFile(), addPastedChat(), checkPayments(), DealFile, draftsUrl(), errorMessage(), fileUrl() (+36 more)

### Community 10 - "api.ts"
Cohesion: 0.04
Nodes (115): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), AcceptanceDocument, acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms() (+107 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (62): agentBodySha256(), ARTIFACT_KINDS, ArtifactKind, ArtifactRejectedError, ArtifactRejection, artifactRow, assertBuyerRoom(), assertFileAllowed() (+54 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.05
Nodes (76): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), documentFor(), fingerprinted() (+68 more)

### Community 13 - "scope-draft/src/index.ts"
Cohesion: 0.07
Nodes (51): screenshotRoutes(), JsonSchema, ClaimText, RANK_CRITERIA, scopeDraftCouncilTask(), ScopeDraftTask, build(), input (+43 more)

### Community 14 - "vitest"
Cohesion: 0.09
Nodes (34): CheckView, db, FAILED, model(), shown, store, db, isRanking() (+26 more)

### Community 15 - "utcDateTime"
Cohesion: 0.11
Nodes (33): answerEmail(), AnswerFacts, revisionLine(), ChangeAnswer, changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+25 more)

### Community 16 - "ai/src/index.ts"
Cohesion: 0.11
Nodes (29): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, DEFAULT_MODEL (+21 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.06
Nodes (73): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), InvalidFieldsError, isChangeOrders(), proposeChange() (+65 more)

### Community 18 - "App.tsx"
Cohesion: 0.09
Nodes (50): AcceptanceDocument(), createDeal(), getDealOptions(), redeemLink(), SIGN_IN_PATH, signOut(), App(), dealPage() (+42 more)

### Community 19 - "mcp.ts"
Cohesion: 0.17
Nodes (15): checkMcp(), describe(), McpClientOptions, mcpHeaders(), McpTransportFactory, PayPalMcpClient, SANDBOX_MCP_SSE_URL, sseTransport() (+7 more)

### Community 20 - "claims/src/check.ts"
Cohesion: 0.11
Nodes (24): checkAnalysis(), ClaimAnalysis, claimAnalysisSchema, ClaimContext, invalid(), MAX_STATEMENTS, readAnalysis(), AGREEMENT (+16 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.09
Nodes (39): MessageJob, MessageReviewView, LABEL_WORDS, revisionNote(), markedPrompt(), AnswerRefusal, CheckedAnswer, citation (+31 more)

### Community 22 - "PayPalRestClient"
Cohesion: 0.06
Nodes (32): PayPalBuyerTestActions, dollar, setup(), EvidenceFileError, PayPalErrorDetail, PayPalMcpError, PayPalResponseError, CheckedEvidenceFile (+24 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (37): ChangeProposal, ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, DraftView (+29 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.10
Nodes (45): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+37 more)

### Community 26 - "scope.ts"
Cohesion: 0.10
Nodes (23): BASE, LISTING, AgreementListing, agreementListingSchema, buyerProvidesSchema, checkedScopeContentSchema, checkedVersion(), confirmedFromSchema (+15 more)

### Community 27 - "validate.ts"
Cohesion: 0.12
Nodes (32): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, DraftStep (+24 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.04
Nodes (85): checkLedger(), getDeal(), getMe(), LedgerCheck, listDeals(), ScopeTerms, ScopeView, StepView (+77 more)

### Community 29 - "testId"
Cohesion: 0.05
Nodes (72): db, CALLBACK_PATH, RETURN_COOKIE, SESSION_COOKIE, STATE_COOKIE, db, dealWithBuyer(), maya (+64 more)

### Community 30 - "when"
Cohesion: 0.06
Nodes (72): AppealCheckView, AppealView, checkDisputes(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, DisputesView (+64 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.12
Nodes (32): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), baseLines(), BLOCKED_OR_UNCLEAR (+24 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.21
Nodes (11): looks(), DroppedDraft, droppedSection(), ruleOf(), councilFailures(), counts(), formatInjectionReport(), InjectionRun (+3 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.10
Nodes (36): getUserEmail(), milestoneRoutes(), answer(), emailInvoice(), sellerApp(), paypalProblem(), sendBody, SendOutcome (+28 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.09
Nodes (40): DealSummary, Money, giveAgLicence(), CommandPalette(), PLACES, Dashboard(), DealList(), Cell (+32 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.05
Nodes (69): db, db, pdf, queuedDrafting(), ActionsView, confirmed(), db, disputedDeal() (+61 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): sellersDispute(), aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER (+38 more)

### Community 37 - "receipt.ts"
Cohesion: 0.12
Nodes (32): acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks(), isListingPreview(), ListingPreview, ListingView (+24 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.09
Nodes (29): isPicture(), ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+21 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "dispute-sync.ts"
Cohesion: 0.07
Nodes (49): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+41 more)

### Community 41 - "schema.ts"
Cohesion: 0.09
Nodes (22): EvalOptions, EvalRecord, runCase(), tokensOf(), DraftStepKind, EVAL_CASES, EvalCase, EvalGold (+14 more)

### Community 42 - "ChatOutcome"
Cohesion: 0.22
Nodes (18): candidates(), JsonReply, parseJsonReply(), tryParse(), ChatOutcome, checkAppeal(), readAppeal(), checkResponse() (+10 more)

### Community 43 - "config.ts"
Cohesion: 0.06
Nodes (45): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS, appVars(), FEATURES (+37 more)

### Community 44 - "claim-job.ts"
Cohesion: 0.26
Nodes (21): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+13 more)

### Community 45 - "access.ts"
Cohesion: 0.06
Nodes (44): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), LinkOptions, linkRoutes() (+36 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (22): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+14 more)

### Community 47 - "app-link-routes.ts"
Cohesion: 0.06
Nodes (42): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), ConfigReport (+34 more)

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (39): `buyer_questions`: questions about the agreement before signing, PayPal integration, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList, DisputeMessage (+31 more)

### Community 49 - "db/src/index.ts"
Cohesion: 0.03
Nodes (123): ScopeChange, body, ChatIntegrityError, ChatNotice, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+115 more)

### Community 50 - "eval-runner.test.ts"
Cohesion: 0.15
Nodes (14): councilDeps(), councilRecordOf(), isRankingRequest(), CouncilRecord, two, clients(), down, invented (+6 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (32): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+24 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.10
Nodes (30): StageView, BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent (+22 more)

### Community 53 - "tools.ts"
Cohesion: 0.04
Nodes (74): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+66 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.08
Nodes (30): at(), source(), key(), seller(), title(), draft(), unchanged(), `agent_requests`: what an agent asks the seller to let it do (8c) (+22 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.11
Nodes (33): reviewView(), acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+25 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.15
Nodes (21): CheckedFile, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, RequirementResult (+13 more)

### Community 58 - "change-order-routes.ts"
Cohesion: 0.05
Nodes (86): sendTimelineReminders(), acceptBody, view(), changeParams, changeView(), declineBody, proposeBody, REFUSALS (+78 more)

### Community 59 - "delivery-routes.ts"
Cohesion: 0.06
Nodes (52): DealCards, CHAT_TRANSCRIPT_PREFIX, LiveRouteOptions, AcceptanceRouteOptions, DealLookup, sendRefusal(), ChangeOrderRouteOptions, checkBody (+44 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (26): EventType, Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus (+18 more)

### Community 61 - "chain-scene.ts"
Cohesion: 0.11
Nodes (14): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+6 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.16
Nodes (29): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+21 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "db/src/migrate.ts"
Cohesion: 0.31
Nodes (10): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus, readApplied(), db (+2 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.07
Nodes (27): dependencies, @pactpal/ledger, @pactpal/products, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite (+19 more)

### Community 67 - "scope-routes.ts"
Cohesion: 0.09
Nodes (32): proposedContent(), checkedContent(), stagesInMinor(), TypedStage, typedStageSchema, chosenDraft(), SCOPE_REFUSALS, scopeBody (+24 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.20
Nodes (22): appealApplies(), analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob(), councilView (+14 more)

### Community 69 - "questions.ts"
Cohesion: 0.11
Nodes (24): AiAnswer, aiAnswerSchema, answerQuestion, answerQuestionSchema, askQuestionSchema, BuyerQuestion, councilAnswers, FORWARD_REASONS (+16 more)

### Community 70 - "resend-inbound.ts"
Cohesion: 0.13
Nodes (21): requireViewer(), createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller() (+13 more)

### Community 71 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (52): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+44 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (94): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+86 more)

### Community 74 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.12
Nodes (35): PacketFacts, AppealCheck, AppealContext, APPEAL_PROMPT_VERSION, AppealItem, appealMessages(), appealSource(), buildAppealMessages() (+27 more)

### Community 76 - "Pillars.tsx"
Cohesion: 0.27
Nodes (11): at(), Countdown(), Dispute(), Draft(), Paid(), Pillars(), Sealed(), VISUALS (+3 more)

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

### Community 81 - "readLedger"
Cohesion: 0.06
Nodes (37): db, models(), store, councilOf(), db, draftedAs(), idOf(), readDraft() (+29 more)

### Community 82 - "server/src/index.ts"
Cohesion: 0.09
Nodes (32): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), log, renderWorkflowChecker(), APPEAL_TASK_NAME (+24 more)

### Community 83 - "change-orders.test.ts"
Cohesion: 0.11
Nodes (18): db, capturingEmail(), db, payments(), sentStage(), at(), db, ORDERING (+10 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "record.ts"
Cohesion: 0.11
Nodes (27): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+19 more)

### Community 87 - "Landing.tsx"
Cohesion: 0.06
Nodes (46): Audience(), GLYPHS, SPOTS, Sticker(), Dispute(), drift(), ART, at() (+38 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "Database"
Cohesion: 0.06
Nodes (58): ReceiptMailDeps, AppOptions, SignInOptions, ChatBus, HubOptions, NotificationRouteOptions, NotifierOptions, ReminderDeps (+50 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "appeal.test.ts"
Cohesion: 0.11
Nodes (16): context, GOOD, input, ITEMS, RECORD, context, GOOD, input (+8 more)

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (26): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+18 more)

### Community 95 - "runner.test.ts"
Cohesion: 0.24
Nodes (8): council(), deps(), DRAFTS, isRankingCall(), ranking(), rankingRequests(), shown(), task

### Community 96 - "appeal-items.ts"
Cohesion: 0.19
Nodes (13): AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS, LEDGER (+5 more)

### Community 97 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.07
Nodes (38): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), addCard(), db (+30 more)

### Community 101 - "web-pages.test.ts"
Cohesion: 0.22
Nodes (3): app, root, webSource

### Community 102 - "db/src/testing.ts"
Cohesion: 0.05
Nodes (65): invoiceEntries(), disputeTypes(), db, disputedDeal(), FILES, GOOD, SummariesView, ARTIFACT_LIMITS (+57 more)

### Community 103 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-judge.ts"
Cohesion: 0.20
Nodes (19): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+11 more)

### Community 106 - "dispute-view.ts"
Cohesion: 0.15
Nodes (19): CHECK_INTERVAL_MS, disputeOf(), checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), DisputeMessageView, disputePageView() (+11 more)

### Community 107 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 108 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 109 - "draft-job.ts"
Cohesion: 0.13
Nodes (20): runPrepared(), draftCategories, councilRecordSchema, toCouncilRecord(), toJson(), usage, DraftJob, JobLog (+12 more)

### Community 110 - "test-app.ts"
Cohesion: 0.05
Nodes (76): agentDeal(), db, mcpClient(), ToolResult, chatDeal(), db, MessageBody, Card (+68 more)

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

### Community 115 - "Phase 7 (deal space)"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "Decisions"
Cohesion: 0.33
Nodes (6): Agents (Phase 8), AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 119 - "server/package.json"
Cohesion: 0.06
Nodes (31): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+23 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.10
Nodes (28): count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep(), look() (+20 more)

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

### Community 128 - "image.ts"
Cohesion: 0.28
Nodes (14): DeliveryCheckView, ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader (+6 more)

### Community 129 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 130 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 131 - "draft-changes.ts"
Cohesion: 0.22
Nodes (11): draftChanges(), FILLER, Item, items(), listChange(), overlap(), plain(), REWORDED_OVERLAP (+3 more)

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

### Community 157 - "Ledger.tsx"
Cohesion: 0.26
Nodes (12): checkChain(), DemoEntry, EntryCheck, GENESIS, sealChain(), sha256(), shortHash(), CHECK_WORDS (+4 more)

### Community 158 - "useRoute.ts"
Cohesion: 0.27
Nodes (10): APP_SECTIONS, AppSection, inAppPath(), LinkClick, matchRoute(), Route, SERVER_PATHS, SIGN_IN_PAGE (+2 more)

### Community 159 - "confirmation.ts"
Cohesion: 0.24
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 160 - "overview.ts"
Cohesion: 0.27
Nodes (8): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), StepProgress

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "Council.tsx"
Cohesion: 0.17
Nodes (14): Agreement(), at(), BALLOTS, Borda(), CHAT, Council(), Drafting(), LINES (+6 more)

### Community 165 - "check-words.ts"
Cohesion: 0.36
Nodes (8): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS, DeliveryCheckReport()

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.28
Nodes (8): paid(), LedgerEntryView, changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 168 - "seller-connections.ts"
Cohesion: 0.25
Nodes (10): claimAccount(), confirmConnection(), ConfirmRefusal, ConnectionBase, connectionRow, endConnection(), first(), keysRow (+2 more)

### Community 169 - "appeal-coverage.ts"
Cohesion: 0.29
Nodes (5): appealGaps(), missingFromPacket(), docItemId(), appealCheckSchema, ContentStore

### Community 170 - "seller-connections.test.ts"
Cohesion: 0.27
Nodes (8): `acceptances`: signed agreements, `deliveries` and `delivery_files`: delivered work, startConnection(), attempt(), db, link(), newId(), SCOPES

### Community 174 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 175 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 176 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

## Knowledge Gaps
- **121 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1801 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `net/src/index.ts`, `draft-changes.ts`, `postgres.test.ts`, `layouts.tsx`, `Secret`, `seller-app.ts`, `readChecked`, `api.ts`, `ledger/src/index.ts`, `deals/routes.ts`, `scope-draft/src/index.ts`, `scope-draft/src/testing.ts`, `utcDateTime`, `ai/src/index.ts`, `ScopePanel.tsx`, `App.tsx`, `mcp.ts`, `claims/src/check.ts`, `qa/src/index.ts`, `PayPalRestClient`, `DraftReview.tsx`, `when`, `council/src/index.ts`, `scope.ts`, `useRoute.ts`, `DealPage.tsx`, `testId`, `Ledger.tsx`, `confirmation.ts`, `overview.ts`, `injection-runner.ts`, `delivery-routes.ts`, `disputes/test-support.ts`, `packet-service.ts`, `DealsTable.tsx`, `products/src/index.ts`, `eval-report.ts`, `dispute-sync.ts`, `appeal-coverage.ts`, `check-words.ts`, `config.ts`, `log-labels.test.ts`, `seller-connections.test.ts`, `schema.ts`, `app-link-routes.ts`, `paypal/src/disputes.ts`, `validate.ts`, `eval-runner.test.ts`, `Deadlines.tsx`, `change-order-routes.ts`, `receipt.ts`, `completeness.ts`, `db/src/migrate.ts`, `resend-inbound.ts`, `delivery-routes.ts`, `sandbox-respond-report.ts`, `SellerAppPanel.tsx`, `readLedger`, `change-orders.test.ts`, `record.ts`, `Landing.tsx`, `appeal.test.ts`, `sandbox-webhook-report.ts`, `runner.test.ts`, `appeal-items.ts`, `render.ts`, `live-hub.ts`, `web-pages.test.ts`, `db/src/testing.ts`, `delivery-check.test.ts`, `draft-job.ts`, `test-app.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05834464043419267 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Landing.tsx` to `styles.ts`, `layouts.tsx`, `readChecked`, `api.ts`, `ScopePanel.tsx`, `App.tsx`, `DealPage.tsx`, `Ledger.tsx`, `useRoute.ts`, `when`, `DealsTable.tsx`, `Council.tsx`, `receipt.ts`, `web/package.json`, `Deadlines.tsx`, `DisputeActions.tsx`, `SellerAppPanel.tsx`, `Pillars.tsx`, `QuestionsPanel.tsx`, `Insights.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Should `question-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1092436974789916 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `change-order-routes.ts`, `README.md`, `Secret`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07330827067669173 - nodes in this community are weakly interconnected._