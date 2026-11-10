# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 714 files · ~478,422 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 19 file(s) not represented in the graph (top: .css 13, (none) 5, .example 1)

## Summary
- 5509 nodes · 17485 edges · 167 communities (163 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 503 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3773350`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- paypal/src/index.ts
- acceptance-routes.ts
- net/src/index.ts
- postgres.test.ts
- styles.ts
- .query
- layouts.tsx
- Secret
- sandbox-partner-report.ts
- readChecked
- api.ts
- ledger/src/index.ts
- deals/routes.ts
- scope-draft/src/index.ts
- vitest
- utcDateTime
- ref_zod
- ScopePanel.tsx
- App.tsx
- when
- claims/src/check.ts
- qa/src/index.ts
- PayPalRestClient
- DraftReview.tsx
- dependencies
- council/src/index.ts
- change-orders.ts
- validate.ts
- DealPage.tsx
- db/src/testing.ts
- styles.ts
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
- eval-runner.ts
- claims/src/index.ts
- config.ts
- claim-job.ts
- tools.ts
- dispute-actions.ts
- app-link-routes.ts
- paypal/src/disputes.ts
- db/src/index.ts
- IntakePanel.tsx
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
- question-routes.ts
- chat.ts
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
- users.ts
- MessagesPanel.tsx
- change-orders.test.ts
- scope-draft/package.json
- paypal/package.json
- record.ts
- Landing.tsx
- products/package.json
- Database
- ai/package.json
- statement.test.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- receipt.test.ts
- appeal-items.ts
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- pdf/package.json
- council/package.json
- eval-judge.ts
- dispute-routes.ts
- QuestionsPanel.tsx
- delivery-check.test.ts
- council-record.ts
- test-app.ts
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
- image.ts
- dependencies
- Layout
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
- PactPal design system
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Ledger.tsx
- App.tsx
- confirmation.ts
- .prettierrc.json
- products/tsconfig.json
- check-words.ts
- Redesign plan (proposed Phase 7R)
- log-labels.test.ts
- linked-apps.ts
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
7. `react` - 75 edges
8. `isObject()` - 70 edges
9. `TEST_NOW` - 66 edges
10. `Secret` - 65 edges

## Surprising Connections (you probably didn't know these)
- `Agents (Phase 8)` --references--> `source()`  [INFERRED]
  docs/decisions.md → apps/server/src/disputes/packet.test.ts
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

## Communities (167 total, 4 thin omitted)

### Community 0 - "paypal/src/index.ts"
Cohesion: 0.09
Nodes (30): InvoiceArgs, SeedArgs, BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS (+22 more)

### Community 1 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (35): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, currentDocument(), documentFor(), fingerprinted(), money, buildReceipt() (+27 more)

### Community 2 - "net/src/index.ts"
Cohesion: 0.05
Nodes (62): checks, connectOwnApp(), ClientOptions, ResendReceivedEmails, ResendOptions, HttpDeps, RetryPolicy, Call (+54 more)

### Community 3 - "postgres.test.ts"
Cohesion: 0.11
Nodes (14): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgClient (+6 more)

### Community 4 - "styles.ts"
Cohesion: 0.13
Nodes (31): AnswerBox(), Revisions, revisionWords(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView, DeliveryCheckView (+23 more)

### Community 5 - ".query"
Cohesion: 0.05
Nodes (79): Acceptance, AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema, checkedAcceptance() (+71 more)

### Community 6 - "layouts.tsx"
Cohesion: 0.12
Nodes (24): Me, IconName, Logo(), LogoMark(), applyTheme(), isDark(), nextTheme(), ORDER (+16 more)

### Community 7 - "Secret"
Cohesion: 0.04
Nodes (57): RFC-2606, Engineering, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+49 more)

### Community 8 - "sandbox-partner-report.ts"
Cohesion: 0.07
Nodes (39): payPalIdOption(), actFor(), message(), parsed, partners, platform, argsSchema, DEFAULT_RETURN_URL (+31 more)

### Community 9 - "readChecked"
Cohesion: 0.07
Nodes (38): addFile(), addPastedChat(), DealFile, DraftView, fileUrl(), isFile(), isReading(), listFiles() (+30 more)

### Community 10 - "api.ts"
Cohesion: 0.05
Nodes (96): AcceptancePanel(), ReceiptEmails(), AgentRequestsPanel(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), addBuyer() (+88 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.05
Nodes (75): isPicture(), ListingRouteOptions, photo(), LOOKUP_REFUSALS, lookupBody, MAX_LISTING_PHOTOS, PhotoError, photosBody (+67 more)

### Community 12 - "deals/routes.ts"
Cohesion: 0.06
Nodes (76): emailReceiptQuietly(), AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), afterQuery (+68 more)

### Community 13 - "scope-draft/src/index.ts"
Cohesion: 0.06
Nodes (52): JsonSchema, claimLines(), linesOf(), RANK_CRITERIA, ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines() (+44 more)

### Community 14 - "vitest"
Cohesion: 0.04
Nodes (89): councilDeps(), councilRecordOf(), isRankingRequest(), model(), councilOf(), db, draftedAs(), idOf() (+81 more)

### Community 15 - "utcDateTime"
Cohesion: 0.07
Nodes (50): createIntakeDeal(), intakeFilename(), answerEmail(), AnswerFacts, revisionLine(), changeAnswerEmail(), changeProposedEmail(), amountOf() (+42 more)

### Community 16 - "ref_zod"
Cohesion: 0.05
Nodes (39): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+31 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (68): acceptChange(), changeOrdersUrl(), changeStep(), declineChange(), getChangeOrders(), getScope(), hasScope(), InvalidFieldsError (+60 more)

### Community 18 - "App.tsx"
Cohesion: 0.13
Nodes (33): LinkProblem, redeemLink(), SIGN_IN_PATH, Dashboard(), DealList(), byUrgency(), Deadlines, DeadlinesPage() (+25 more)

### Community 19 - "when"
Cohesion: 0.10
Nodes (37): buildPacket(), checkDisputes(), disputesUrl(), DisputesView, draftSummary(), getDisputePage(), getDisputes(), getPacketView() (+29 more)

### Community 20 - "claims/src/check.ts"
Cohesion: 0.08
Nodes (37): checkAnalysis(), ClaimAnalysis, invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, AGREEMENT, CLAIM (+29 more)

### Community 21 - "qa/src/index.ts"
Cohesion: 0.16
Nodes (26): DraftJob, MESSAGE_PROMPT_VERSIONS, MessageJob, ClaimContext, AgreementLine, SourceLine, messageReviewCouncilTask(), MessageReviewTask (+18 more)

### Community 22 - "PayPalRestClient"
Cohesion: 0.07
Nodes (33): checkMcp(), dollar, setup(), PayPalErrorDetail, PayPalMcpError, PayPalResponseError, DEFAULT_FALLBACK_POLICY, FallbackPolicy (+25 more)

### Community 23 - "DraftReview.tsx"
Cohesion: 0.08
Nodes (37): ChatLine, Citation, DraftCandidate, DraftCategory, DraftContent, DraftMark, ChatLines(), ChatPane() (+29 more)

### Community 24 - "dependencies"
Cohesion: 0.07
Nodes (30): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @modelcontextprotocol/sdk, @pactpal/ai (+22 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (46): ChatFailureKind, TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid() (+38 more)

### Community 26 - "change-orders.ts"
Cohesion: 0.05
Nodes (58): `change_orders`: changes to a signed agreement, AcceptChange, acceptChangeSchema, addedCounts(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder, ChangeOrderNotAllowedError (+50 more)

### Community 27 - "validate.ts"
Cohesion: 0.14
Nodes (28): allowedCategoryIds(), paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, draftTimelineOf() (+20 more)

### Community 28 - "DealPage.tsx"
Cohesion: 0.05
Nodes (61): checkLedger(), LedgerCheck, LedgerEntryView, ScopeTerms, ScopeView, StageView, StepView, getNotifications() (+53 more)

### Community 29 - "db/src/testing.ts"
Cohesion: 0.03
Nodes (107): db, SESSION_COOKIE, db, dealWithBuyer(), maya, report, db, entriesOf() (+99 more)

### Community 30 - "styles.ts"
Cohesion: 0.09
Nodes (41): AppealCheckView, AppealView, checkAppeal(), ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, draftResponse() (+33 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.09
Nodes (37): chatCaseRuns(), InjectionOptions, rankingCaseRuns(), runInjectionCheck(), taskFor(), usageTokens(), DraftStepKind, EvalCase (+29 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.12
Nodes (21): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), DroppedDraft, droppedSection() (+13 more)

### Community 33 - "delivery-routes.ts"
Cohesion: 0.07
Nodes (52): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, DeliveryRouteOptions, deliveryRoutes(), answer() (+44 more)

### Community 34 - "DealsTable.tsx"
Cohesion: 0.10
Nodes (37): Money, CommandPalette(), PLACES, Cell, COLUMNS, DealsTable(), EXPORT, SIDE_BAR (+29 more)

### Community 35 - "disputes/test-support.ts"
Cohesion: 0.05
Nodes (70): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+62 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (47): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+39 more)

### Community 37 - "receipt.ts"
Cohesion: 0.08
Nodes (44): receiptBlocks(), AcceptanceDocument(), AcceptanceDocument, isListingPreview(), ListingPreview, ListingView, lookUpListing(), saveListingPhotos() (+36 more)

### Community 38 - "products/src/index.ts"
Cohesion: 0.13
Nodes (18): Channel3Lookup, MAX_PHOTO_BYTES, NoAnswerError, fakeChannel3(), NOW, attributeName(), capped(), Channel3Product (+10 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.21
Nodes (24): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+16 more)

### Community 40 - "dispute-sync.ts"
Cohesion: 0.08
Nodes (44): DisputeReader, LinkedDisputeAccount, changedSince(), Counts, DisputeSyncDeps, failureCode(), readTooSoon(), readVersionOf() (+36 more)

### Community 41 - "eval-runner.ts"
Cohesion: 0.18
Nodes (14): draftCategories, toCouncilRecord(), JobLog, PROMPT_VERSIONS, runDraftJob(), runMessageJob(), EvalOptions, EvalRecord (+6 more)

### Community 42 - "claims/src/index.ts"
Cohesion: 0.11
Nodes (44): AppealContext, checkAppeal(), readAppeal(), RecordLine, checkResponse(), readResponse(), ResponseContext, ResponseDraft (+36 more)

### Community 43 - "config.ts"
Cohesion: 0.05
Nodes (68): publishingBus(), result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, APP_KEYS, appVars() (+60 more)

### Community 44 - "claim-job.ts"
Cohesion: 0.27
Nodes (22): withReadyDraft(), Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt (+14 more)

### Community 45 - "tools.ts"
Cohesion: 0.09
Nodes (30): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS, AgentContext (+22 more)

### Community 46 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (21): ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS (+13 more)

### Community 47 - "app-link-routes.ts"
Cohesion: 0.09
Nodes (27): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], linkBody, paypalUnavailable(), SellerAppLinking (+19 more)

### Community 48 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (44): send(), `buyer_questions`: questions about the agreement before signing, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeDetails (+36 more)

### Community 49 - "db/src/index.ts"
Cohesion: 0.03
Nodes (97): PayPalWebhookOptions, CHAT_CHANNEL, chatEventSchema, party, publishChatEvent(), ContentMismatchError, contentRow, Queryable (+89 more)

### Community 50 - "IntakePanel.tsx"
Cohesion: 0.17
Nodes (18): createDeal(), DealOptions, getDealOptions(), getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey() (+10 more)

### Community 51 - "web/package.json"
Cohesion: 0.06
Nodes (31): devDependencies, @types/react, @types/react-dom, @types/three, vite, @vitejs/plugin-react, @pactpal/delivery-check, @pactpal/live (+23 more)

### Community 52 - "Deadlines.tsx"
Cohesion: 0.11
Nodes (29): BAR_COLOURS, TODAY_LINE, addDays(), daysBetween(), earlierDay(), laterDay(), DeadlineEvent, DeadlineRow (+21 more)

### Community 53 - "tools.ts"
Cohesion: 0.07
Nodes (43): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequest, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest() (+35 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.06
Nodes (41): review(), at(), source(), key(), seller(), title(), draft(), unchanged() (+33 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.08
Nodes (45): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+37 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (22): CheckLine, codeChecks(), judge(), largest(), MEDIA_TYPES, Transparency, checkableLines(), Mark (+14 more)

### Community 58 - "change-order-routes.ts"
Cohesion: 0.05
Nodes (84): sendTimelineReminders(), acceptBody, ChangeOrderRouteOptions, view(), changeParams, changeView(), declineBody, proposeBody (+76 more)

### Community 59 - "delivery-routes.ts"
Cohesion: 0.06
Nodes (63): CHAT_TRANSCRIPT_PREFIX, DealLookup, featureAnswers(), step(), CompletenessRouteOptions, checkBody, checkView(), DeliveryCheckRouteOptions (+55 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (24): Completeness, CompletenessInput, CompletenessItem, Facts, field(), ItemStatus, Measure, MEASURED (+16 more)

### Community 61 - "chain-scene.ts"
Cohesion: 0.09
Nodes (22): ACCENT, ACCENT_2, AI, Block, ChainScene, DEALS, ease(), EVENTS (+14 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.16
Nodes (28): acceptDisputeClaim(), DisputeActionsView, DisputeActionView, disputeStepUrl(), escalateDispute(), getDisputeActions(), isActionAnswer(), isDisputeActions() (+20 more)

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
Cohesion: 0.07
Nodes (42): checkedContent(), stagesInMinor(), TypedStage, typedStageSchema, chosenDraft(), SCOPE_REFUSALS, scopeBody, scopeRoutes() (+34 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.17
Nodes (25): sendRefusal(), appealApplies(), analysisView(), appealView(), claimRoutes(), answer(), startJob(), councilView (+17 more)

### Community 69 - "question-routes.ts"
Cohesion: 0.07
Nodes (47): answerBody, askBody, Attempt, MODELS_PER_QUESTION, questionParams, questionRoutes(), attempt(), forward() (+39 more)

### Community 70 - "chat.ts"
Cohesion: 0.12
Nodes (19): body, ChatIntegrityError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), lastSeq, listAllMessages() (+11 more)

### Community 71 - "delivery-routes.ts"
Cohesion: 0.09
Nodes (33): revisionsOf(), workRecord(), ArtifactKind, AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery (+25 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.04
Nodes (77): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, AMOUNT_OPTIONS (+69 more)

### Community 74 - "SellerAppPanel.tsx"
Cohesion: 0.24
Nodes (12): getSellerApp(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL (+4 more)

### Community 75 - "claims/src/index.ts"
Cohesion: 0.11
Nodes (24): Prepared, AppealCheck, APPEAL_PROMPT_VERSION, AppealItem, appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask() (+16 more)

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

### Community 81 - "users.ts"
Cohesion: 0.25
Nodes (13): isUniqueViolation(), SignedInPerson, SignInResult, signInWithPayPal(), findUserByEmail(), findUserByPayPalId(), linkPayPal(), NewUser (+5 more)

### Community 82 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 83 - "change-orders.test.ts"
Cohesion: 0.20
Nodes (13): capturingEmail(), db, payments(), sentStage(), markInvoicePaid(), markInvoiceSent(), MilestoneNotAllowedError, refuse() (+5 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "record.ts"
Cohesion: 0.33
Nodes (9): count(), detailsOf(), fieldsOf(), filesOf(), LABELS, LEFT_OUT, text(), timeWords() (+1 more)

### Community 87 - "Landing.tsx"
Cohesion: 0.05
Nodes (55): Audience(), GLYPHS, SPOTS, Sticker(), at(), Closing(), LIMIT_GLYPHS, Tagline() (+47 more)

### Community 88 - "products/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "Database"
Cohesion: 0.04
Nodes (68): McpRouteOptions, AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup() (+60 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "statement.test.ts"
Cohesion: 0.33
Nodes (5): context, GOOD, input, ITEMS, RECORD

### Community 92 - "build.js"
Cohesion: 0.22
Nodes (7): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), esbuild

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.08
Nodes (25): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+17 more)

### Community 95 - "receipt.test.ts"
Cohesion: 0.28
Nodes (6): ACCEPTANCE_NOTICE, document, signed(), SIGNED_AT, signedPayload(), pdfTextLines()

### Community 96 - "appeal-items.ts"
Cohesion: 0.12
Nodes (18): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+10 more)

### Community 97 - "render.ts"
Cohesion: 0.11
Nodes (23): acceptanceDocumentSchema, acceptedPayload, dateTime(), REACHED, RECEIPT_FORMAT, Block, blockSchema, PdfDocumentInput (+15 more)

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.05
Nodes (55): BusSignal, Listen, addCard(), db, hubOnTestDeal(), messageView(), LiveHub, LivePage (+47 more)

### Community 103 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "eval-judge.ts"
Cohesion: 0.22
Nodes (17): buyerProvidesScore(), categoryVerdict(), cites(), FieldVerdict, lineSet(), listScore(), marksScore(), normal() (+9 more)

### Community 106 - "dispute-routes.ts"
Cohesion: 0.29
Nodes (9): CHECK_INTERVAL_MS, checkView(), disputeParams, DisputeRouteOptions, disputeRoutes(), disputePageView(), disputeSummaryView(), openedAt() (+1 more)

### Community 107 - "QuestionsPanel.tsx"
Cohesion: 0.23
Nodes (15): answerBuyerQuestion(), askAboutAgreement(), askSellerInstead(), ForwardReason, getQuestions(), isQuestions(), questionStep(), questionsUrl() (+7 more)

### Community 108 - "delivery-check.test.ts"
Cohesion: 0.20
Nodes (11): CheckedFile, IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg() (+3 more)

### Community 109 - "council-record.ts"
Cohesion: 0.20
Nodes (12): CouncilRecord, councilRecordSchema, isUnranked(), usage, categoryLabels, describeDraft(), DraftView, priceMinor() (+4 more)

### Community 110 - "test-app.ts"
Cohesion: 0.04
Nodes (100): agentDeal(), db, mcpClient(), ToolResult, chatDeal(), db, MessageBody, db (+92 more)

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
Cohesion: 0.33
Nodes (6): Agents (Phase 8), AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 119 - "server/package.json"
Cohesion: 0.06
Nodes (31): @modelcontextprotocol/sdk, @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/products (+23 more)

### Community 120 - "Insights.tsx"
Cohesion: 0.10
Nodes (27): giveAgLicence(), count, dealsSource(), Source, STARTING_REPORT, InsightRow, Insights(), keep() (+19 more)

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
Cohesion: 0.35
Nodes (12): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+4 more)

### Community 129 - "dependencies"
Cohesion: 0.10
Nodes (20): dependencies, ag-grid-community, ag-grid-enterprise, ag-grid-react, ag-studio, ag-studio-react, @bryntum/gantt, @bryntum/gantt-react (+12 more)

### Community 130 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 132 - "README.md"
Cohesion: 0.26
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

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
Cohesion: 0.14
Nodes (14): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+6 more)

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

### Community 158 - "App.tsx"
Cohesion: 0.09
Nodes (36): signOut(), App(), DeadlinesPage, DealPage, DealRoute, DealsPage, DisputePage, DisputesPage (+28 more)

### Community 159 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 165 - "check-words.ts"
Cohesion: 0.33
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS, RequirementResult

### Community 166 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 170 - "linked-apps.ts"
Cohesion: 0.06
Nodes (43): MilestoneRouteOptions, db, invoiceEntries(), signedPayPal(), StageView, InvoiceSender, fakeAppWebhooks(), fakePayPal() (+35 more)

### Community 175 - "vite-env.d.ts"
Cohesion: 0.50
Nodes (3): ImportMeta, ImportMetaEnv, *.webp

### Community 176 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

## Knowledge Gaps
- **121 isolated node(s):** `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db` (+116 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1803 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `paypal/src/index.ts`, `net/src/index.ts`, `postgres.test.ts`, `layouts.tsx`, `Secret`, `sandbox-partner-report.ts`, `readChecked`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `scope-draft/src/testing.ts`, `utcDateTime`, `ScopePanel.tsx`, `when`, `claims/src/check.ts`, `qa/src/index.ts`, `PayPalRestClient`, `DraftReview.tsx`, `council/src/index.ts`, `change-orders.ts`, `validate.ts`, `DealPage.tsx`, `db/src/testing.ts`, `Ledger.tsx`, `confirmation.ts`, `injection-runner.ts`, `delivery-routes.ts`, `DealsTable.tsx`, `disputes/test-support.ts`, `packet-service.ts`, `check-words.ts`, `App.tsx`, `eval-report.ts`, `dispute-sync.ts`, `log-labels.test.ts`, `linked-apps.ts`, `config.ts`, `claims/src/index.ts`, `products/src/index.ts`, `receipt.ts`, `app-link-routes.ts`, `paypal/src/disputes.ts`, `IntakePanel.tsx`, `Deadlines.tsx`, `change-order-routes.ts`, `completeness.ts`, `db/src/migrate.ts`, `scope-routes.ts`, `question-routes.ts`, `delivery-routes.ts`, `sandbox-respond-report.ts`, `SellerAppPanel.tsx`, `claims/src/index.ts`, `MessagesPanel.tsx`, `change-orders.test.ts`, `Landing.tsx`, `Database`, `statement.test.ts`, `sandbox-webhook-report.ts`, `receipt.test.ts`, `appeal-items.ts`, `render.ts`, `live-hub.ts`, `delivery-check.test.ts`, `council-record.ts`, `test-app.ts`, `package.json`, `Insights.tsx`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **What connects `@modelcontextprotocol/sdk`, `@pactpal/ai`, `@pactpal/claims` to the rest of the system?**
  _121 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `paypal/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08658536585365853 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `change-order-routes.ts`, `README.md`, `Secret`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Should `acceptance-routes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08205128205128205 - nodes in this community are weakly interconnected._
- **Why does `Engineering` connect `Secret` to `paypal/src/index.ts`, `net/src/index.ts`, `ledger/src/index.ts`, `scope-draft/src/index.ts`, `vitest`, `utcDateTime`, `council/src/index.ts`, `styles.ts`, `disputes/test-support.ts`, `receipt.ts`, `log-labels.test.ts`, `paypal/src/disputes.ts`, `Built (sub-phases 2b to 6h-1)`, `delivery-routes.ts`, `claims/src/index.ts`, `appeal-items.ts`, `council-record.ts`, `test-app.ts`, `Decisions`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `net/src/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05366336633663366 - nodes in this community are weakly interconnected._