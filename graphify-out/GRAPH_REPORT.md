# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 638 files · ~420,686 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 5, .css 5, .example 1)

## Summary
- 4997 nodes · 16086 edges · 164 communities (158 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 477 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5f38062`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- resend-inbound.ts
- artifacts.ts
- PayPalRestClient
- vitest
- react
- testId
- deals/routes.ts
- AcceptancePanel.tsx
- acceptance-routes.ts
- sandbox-respond-report.ts
- claims/src/index.ts
- ledger/src/index.ts
- MessagesPanel.tsx
- question-routes.ts
- ai/src/index.ts
- deals/routes.ts
- paypal/src/disputes.ts
- ScopePanel.tsx
- server/package.json
- chat.ts
- db/src/disputes.ts
- dispute-actions.ts
- change-orders.test.ts
- appeal-prompt.ts
- Database
- council/src/index.ts
- notifier.ts
- db/src/index.ts
- words/src/index.ts
- email/src/index.ts
- validate.ts
- scope-draft/src/testing.ts
- scope-drafts.ts
- action-routes.ts
- api.ts
- pdf/package.json
- packet-service.ts
- when
- scope-draft/src/council-task.ts
- eval-report.ts
- delivery-check.test.ts
- scope-draft/src/index.ts
- paypal-webhook.ts
- config.ts
- auth/sign-in.ts
- DraftReview.tsx
- Layout
- utcDateTime
- dispute-sync.ts
- sandbox-partner-report.ts
- sandbox-webhook-report.ts
- web/package.json
- DeliveriesPanel.tsx
- server/src/index.ts
- Built (sub-phases 2b to 6h-1)
- paypal-webhook.test.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- mcp.ts
- completeness.ts
- dependencies
- DisputeActions.tsx
- services
- bus.ts
- scripts
- db/package.json
- net/src/index.ts
- testSpec
- dispute-sync.ts
- postgres.ts
- confirmation.ts
- claims/package.json
- image.ts
- log-labels.ts
- IntakePanel.tsx
- chat-state.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- live/src/index.ts
- claim-job.ts
- paypal/src/index.ts
- scope-draft/package.json
- paypal/package.json
- build.js
- useLiveChat.ts
- LiveHub
- SellerAppPanel.tsx
- ai/package.json
- dispute-routes.ts
- eval-judge.ts
- scripts
- PayPalWebhooks
- DealPage.tsx
- dispute-notices.ts
- log-labels.test.ts
- email/package.json
- compilerOptions
- sellers/disputes.test.ts
- runCouncil
- Data model
- draft-view.ts
- council/package.json
- instruction-lines.test.ts
- Decisions
- claim-analyses.ts
- check-words.ts
- seller
- db/src/migrate.ts
- score/package.json
- PactPal product spec
- devDependencies
- council
- timeline-routes.ts
- Engineering standards
- package.json
- getDispute
- render.ts
- tokens.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- Redesign plan (proposed Phase 7R)
- sign-in-words.ts
- devDependencies
- content-store.test.ts
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
- change-order-routes.ts
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- Scope
- .prettierrc.json
- Landing page (/ when signed out)
- engines
- PactPal design system
- buyer.ts

## God Nodes (most connected - your core abstractions)
1. `vitest` - 191 edges
2. `Database` - 117 edges
3. `testId()` - 103 edges
4. `readLedger()` - 86 edges
5. `useMigratedTestDatabase()` - 75 edges
6. `sha256Hex()` - 74 edges
7. `isObject()` - 64 edges
8. `TEST_NOW` - 62 edges
9. `Secret` - 61 edges
10. `appendLedgerEvent()` - 59 edges

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

## Communities (164 total, 6 thin omitted)

### Community 0 - "resend-inbound.ts"
Cohesion: 0.14
Nodes (24): createIntakeDeal(), intakeFilename(), bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView() (+16 more)

### Community 1 - "artifacts.ts"
Cohesion: 0.06
Nodes (37): addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactKind, ArtifactLimits, ArtifactRejectedError, ArtifactRejection, artifactRow (+29 more)

### Community 2 - "PayPalRestClient"
Cohesion: 0.08
Nodes (22): Config, authAssertion(), base64Url(), PayPalAppCredentials, createdInvoice, DraftInvoice, InvoiceDraft, invoiceNote() (+14 more)

### Community 3 - "vitest"
Cohesion: 0.03
Nodes (144): chatDeal(), db, MessageBody, db, liveDeal(), closePagesAfterEach(), opened, openLiveDeal() (+136 more)

### Community 4 - "react"
Cohesion: 0.05
Nodes (105): LinkProblem, Me, Money, redeemLink(), SIGN_IN_PATH, signOut(), App(), CommandPalette() (+97 more)

### Community 5 - "testId"
Cohesion: 0.04
Nodes (96): withReadyDraft(), queuedDrafting(), signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES (+88 more)

### Community 6 - "deals/routes.ts"
Cohesion: 0.07
Nodes (66): afterQuery, ChatRouteOptions, chatRoutes(), messageView(), postBody, REFUSALS, HubOptions, Online (+58 more)

### Community 7 - "AcceptancePanel.tsx"
Cohesion: 0.12
Nodes (29): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), askAboutAgreement() (+21 more)

### Community 8 - "acceptance-routes.ts"
Cohesion: 0.07
Nodes (48): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument, acceptanceDocumentSchema, currentDocument(), fingerprinted(), money (+40 more)

### Community 9 - "sandbox-respond-report.ts"
Cohesion: 0.05
Nodes (74): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+66 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.06
Nodes (81): parseJsonReply(), AppealContext, checkAppeal(), readAppeal(), checkAnalysis(), ClaimAnalysis, claimAnalysisSchema, ClaimContext (+73 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.14
Nodes (31): DISPUTE_EVENT_PREFIX, mediaTypeOf(), ACTORS, dealParties, entryRow, canonicalJson(), JsonValue, sha256Hex() (+23 more)

### Community 12 - "MessagesPanel.tsx"
Cohesion: 0.25
Nodes (11): checkMessage(), getMessages(), isMessages(), MessageReviewView, messagesUrl(), MessagesView, LABEL_WORDS, revisionNote() (+3 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.06
Nodes (65): CHAT_TRANSCRIPT_PREFIX, DealLookup, sendRefusal(), CompletenessRouteOptions, checkBody, checkView(), DeliveryCheckRouteOptions, deliveryCheckRoutes() (+57 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.15
Nodes (21): candidates(), JsonReply, tryParse(), DEFAULT_MODEL, median(), ModelRecord, rankModels(), RECENT_FAILURE_MS (+13 more)

### Community 15 - "deals/routes.ts"
Cohesion: 0.08
Nodes (48): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, DeliveryRouteOptions, deliveryRoutes(), answer() (+40 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (41): send(), `buyer_questions`: questions about the agreement before signing, AcceptClaimInput, answered(), collect(), DisputeAnswer, DisputeDetails, DisputeList (+33 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (59): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+51 more)

### Community 18 - "server/package.json"
Cohesion: 0.07
Nodes (28): @pactpal/ai, @pactpal/council, @pactpal/delivery-check, @pactpal/ledger, @pactpal/live, @pactpal/net, @pactpal/qa, @pactpal/scope-draft (+20 more)

### Community 19 - "chat.ts"
Cohesion: 0.06
Nodes (40): body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage(), insertMessage() (+32 more)

### Community 20 - "db/src/disputes.ts"
Cohesion: 0.10
Nodes (20): actionList, checkRow, DISPUTE_CHECK_SOURCES, DISPUTE_MATCHES, disputeChanges, DisputeEvent, disputeLinkSchema, DisputeMatch (+12 more)

### Community 21 - "dispute-actions.ts"
Cohesion: 0.11
Nodes (27): ActionFile, actionFileSchema, actionRow, amountSchema, common, countOf(), DISPUTE_ACTION_KINDS, DisputeActionKind (+19 more)

### Community 22 - "change-orders.test.ts"
Cohesion: 0.22
Nodes (7): at(), db, ORDERING, proposed(), signature(), SIGNED, ScopeContentInput

### Community 23 - "appeal-prompt.ts"
Cohesion: 0.17
Nodes (16): Prepared, AppealCheck, appealMessages(), appealSource(), buildAppealMessages(), appealCouncilTask(), AppealTask, RANK_CRITERIA (+8 more)

### Community 24 - "Database"
Cohesion: 0.05
Nodes (68): AppOptions, buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup() (+60 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.06
Nodes (70): runPrepared(), draftCategories, toCouncilRecord(), toJson(), DraftJob, JobLog, PROMPT_VERSIONS, runDraftJob() (+62 more)

### Community 26 - "notifier.ts"
Cohesion: 0.18
Nodes (12): ChatBus, Card, DealCards, NotificationRouteOptions, Notifier, NotifierOptions, PartyNotice, AcceptanceRouteOptions (+4 more)

### Community 27 - "db/src/index.ts"
Cohesion: 0.02
Nodes (201): forward(), settle(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, acceptTerms, acceptTermsSchema (+193 more)

### Community 28 - "words/src/index.ts"
Cohesion: 0.17
Nodes (20): receiptBlocks(), AcceptanceDocument(), AcceptanceDocument, Field(), dateOf, ScopeDetails(), agreementLines(), AgreementPage (+12 more)

### Community 29 - "email/src/index.ts"
Cohesion: 0.04
Nodes (83): db, inbox(), SECRET_BYTES, RFC-2606, Engineering, AI_RETRY_POLICY, ClientOptions, errorBody (+75 more)

### Community 30 - "validate.ts"
Cohesion: 0.13
Nodes (26): TEST_CATEGORIES, Citation, amountQuoted(), categoryProblems(), citationProblem(), collectCitations(), invalid(), listCitations() (+18 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.10
Nodes (32): councilRecordOf(), two, DraftStepKind, EVAL_CASES, EvalCase, EvalGold, FieldVerdict, baseLines() (+24 more)

### Community 32 - "scope-drafts.ts"
Cohesion: 0.04
Nodes (64): dealWithBuyer(), db, later, newId(), sellerWithDeal(), sellerWithoutBuyer(), addBuyer, BuyerNotAllowedError (+56 more)

### Community 33 - "action-routes.ts"
Cohesion: 0.10
Nodes (34): acceptBody, actionParams, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend(), send() (+26 more)

### Community 34 - "api.ts"
Cohesion: 0.05
Nodes (103): addBuyer(), analysesUrl(), AnswerOptionView, buildPacket(), BuiltPacket, CategoryVerdict, CHANGE_STATUSES, ChangeOrderStatus (+95 more)

### Community 35 - "pdf/package.json"
Cohesion: 0.12
Nodes (16): dependencies, pdf-lib, zod, devDependencies, @types/node, exports, ./testing, @types/node (+8 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.07
Nodes (54): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+46 more)

### Community 37 - "when"
Cohesion: 0.07
Nodes (65): AppealCheckView, AppealView, ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, CouncilView, DisputesView, PacketChoice (+57 more)

### Community 38 - "scope-draft/src/council-task.ts"
Cohesion: 0.17
Nodes (15): RANK_CRITERIA, ScopeDraftTask, buildScopeDraftMessages(), listOf(), SCOPE_DRAFT_PROMPT_VERSION, ScopeDraftPrompt, ScopeDraftPromptInput, base (+7 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.09
Nodes (41): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), aloneRow(), aloneSection() (+33 more)

### Community 40 - "delivery-check.test.ts"
Cohesion: 0.17
Nodes (11): IMAGE, LINES, BPP, chunk(), figure(), filterRows(), jpeg(), png() (+3 more)

### Community 41 - "scope-draft/src/index.ts"
Cohesion: 0.10
Nodes (26): DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, citations, commonFields (+18 more)

### Community 42 - "paypal-webhook.ts"
Cohesion: 0.13
Nodes (16): blueprint, ciWorkflow, serverPackage, [serviceSection = "", workflowSection = "", cronSection = ""], [servicesSection = "", databaseSection = ""], envelope, ParsedJson, parseJson() (+8 more)

### Community 43 - "config.ts"
Cohesion: 0.09
Nodes (29): AI_CHECK_PROMPT, ModelCheck, result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars() (+21 more)

### Community 44 - "auth/sign-in.ts"
Cohesion: 0.04
Nodes (78): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, db, backHome(), CALLBACK_PATH, callbackQuery (+70 more)

### Community 45 - "DraftReview.tsx"
Cohesion: 0.06
Nodes (47): addPastedChat(), ChatLine, Citation, DealFile, DraftCandidate, DraftCategory, DraftContent, DraftMark (+39 more)

### Community 46 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 47 - "utcDateTime"
Cohesion: 0.16
Nodes (23): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+15 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.14
Nodes (22): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+14 more)

### Community 49 - "sandbox-partner-report.ts"
Cohesion: 0.13
Nodes (29): describe(), formatAiReport(), isStatusOk(), summarizeOutcome(), rows(), actFor(), message(), parsed (+21 more)

### Community 50 - "sandbox-webhook-report.ts"
Cohesion: 0.10
Nodes (24): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+16 more)

### Community 51 - "web/package.json"
Cohesion: 0.05
Nodes (37): dependencies, ag-grid-community, ag-grid-react, @fontsource-variable/geist, @fontsource-variable/geist-mono, @pactpal/delivery-check, @pactpal/live, @pactpal/timeline (+29 more)

### Community 52 - "DeliveriesPanel.tsx"
Cohesion: 0.09
Nodes (39): AnswerBox(), Revisions, revisionWords(), addFile(), approveDelivery(), checksUrl(), deliveriesUrl(), DeliveriesView (+31 more)

### Community 53 - "server/src/index.ts"
Cohesion: 0.12
Nodes (25): log, APPEAL_TASK_NAME, CLAIM_TASK_NAME, RESPONSE_TASK_NAME, STATEMENT_TASK_NAME, SUMMARY_TASK_NAME, DISPUTE_TASK_NAME, jsonLines() (+17 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.11
Nodes (21): at(), source(), key(), `artifacts` and `file_contents`: the deal's files, Built (sub-phases 2b to 6h-1), `change_orders`: changes to a signed agreement, `delivery_checks`: the seller's pre-delivery checks, `dispute_checks`: each check of the seller's disputes (+13 more)

### Community 55 - "paypal-webhook.test.ts"
Cohesion: 0.18
Nodes (12): ConfigReport, app, PayPalWebhookOptions, event, headers, rawBody, report, setup() (+4 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.14
Nodes (22): CheckedFile, CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, RequirementResult (+14 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.06
Nodes (48): dealOverview, DealStage, disputeStep(), NextStep, OverviewFacts, STEPS, waiting(), ScopeInput (+40 more)

### Community 59 - "mcp.ts"
Cohesion: 0.11
Nodes (28): APP_KEYS, checkAsSellerApp(), checkMcp(), checks, message(), result, APP_LABELS, appSection() (+20 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "dependencies"
Cohesion: 0.07
Nodes (27): dependencies, fastify, @fastify/cookie, @fastify/helmet, @fastify/static, @fastify/websocket, @pactpal/ai, @pactpal/claims (+19 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.14
Nodes (30): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), draftStatement(), escalateDispute() (+22 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "bus.ts"
Cohesion: 0.12
Nodes (16): BusSignal, Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), addCard(), db (+8 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.08
Nodes (25): dependencies, @pactpal/ledger, @pactpal/timeline, pg, zod, devDependencies, @electric-sql/pglite, @types/node (+17 more)

### Community 67 - "net/src/index.ts"
Cohesion: 0.06
Nodes (44): Call, item, json(), Reply, setup(), tokenReply(), SANDBOX_API_BASE_URL, PayPalApiError (+36 more)

### Community 68 - "testSpec"
Cohesion: 0.05
Nodes (56): spec, councilDeps(), isRankingRequest(), model(), isRanking(), member(), model(), model() (+48 more)

### Community 69 - "dispute-sync.ts"
Cohesion: 0.18
Nodes (23): doneKeys(), DueNotice, emailFor(), EVENT_KINDS, eventNotice(), NOTICE_WINDOW_MS, REMINDER_MARKS, reminderKey() (+15 more)

### Community 70 - "postgres.ts"
Cohesion: 0.13
Nodes (12): databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), open(), PgListenClient (+4 more)

### Community 71 - "confirmation.ts"
Cohesion: 0.25
Nodes (11): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+3 more)

### Community 72 - "claims/package.json"
Cohesion: 0.08
Nodes (23): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, @pactpal/words, zod, devDependencies (+15 more)

### Community 73 - "image.ts"
Cohesion: 0.31
Nodes (13): ALPHA_LAYOUT, ascii(), byte(), imageFacts, jpegSize(), pngChunks(), PngHeader, pngTransparency() (+5 more)

### Community 74 - "log-labels.ts"
Cohesion: 0.24
Nodes (11): LedgerEntryView, deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel() (+3 more)

### Community 75 - "IntakePanel.tsx"
Cohesion: 0.22
Nodes (13): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), makeIntakeSecret(), turnOffIntakeSecret() (+5 more)

### Community 76 - "chat-state.ts"
Cohesion: 0.24
Nodes (12): ChatView, ChatAction, chatReducer(), ChatState, Connection, initialChat, onFrame(), PendingMessage (+4 more)

### Community 77 - "Sandbox feasibility tests"
Cohesion: 0.09
Nodes (23): Moving a dispute to a verdict, Accounts and connection, AI, Disputes, Drafting evals: single models against the council (sub-phase 3g, 1 November 2026), First live answer help (sub-phase 5h, 6 November 2026), First live appeal statement (sub-phase 5i-2, 6 November 2026), First live claim comparison (sub-phase 5d, 5 November 2026) (+15 more)

### Community 78 - "delivery-check/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/ledger, zod, devDependencies, @types/node, exports (+13 more)

### Community 79 - "qa/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/scope-draft, @pactpal/words, zod, devDependencies, @types/node (+13 more)

### Community 80 - "watcher/package.json"
Cohesion: 0.09
Nodes (21): dependencies, @pactpal/ai, @pactpal/council, @pactpal/qa, @pactpal/scope-draft, zod, devDependencies, @types/node (+13 more)

### Community 81 - "live/src/index.ts"
Cohesion: 0.24
Nodes (14): bySide, chatMessageSchema, ClientFrame, clientFrameSchema, MAX_CLIENT_FRAME_BYTES, noticeSchema, onlineBySide, otherParty() (+6 more)

### Community 82 - "claim-job.ts"
Cohesion: 0.07
Nodes (70): AlreadySent, appealApplies(), appealFacts(), appealItems(), DISPUTE_PROCESS, entryItemId(), HeldDocument, MAX_APPEAL_ITEMS (+62 more)

### Community 83 - "paypal/src/index.ts"
Cohesion: 0.06
Nodes (34): EvidenceFileError, PayPalErrorDetail, CheckedEvidenceFile, checkEvidenceFiles(), EvidenceContentType, EvidenceFile, MAX_EVIDENCE_FILE_BYTES, pdf (+26 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @pactpal/ai, @pactpal/council, zod, devDependencies, @types/node, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.10
Nodes (19): dependencies, @modelcontextprotocol/sdk, @pactpal/ledger, @pactpal/net, zod, devDependencies, @types/node, @pactpal/ledger (+11 more)

### Community 86 - "build.js"
Cohesion: 0.11
Nodes (10): builtins, { dependencies = {} }, external, missing, packageOf(), setup(), app, root (+2 more)

### Community 87 - "useLiveChat.ts"
Cohesion: 0.27
Nodes (10): chatUrl(), getChat(), liveUrl(), postChat(), lastSeq(), reconnectDelay(), LiveChat, useLiveChat() (+2 more)

### Community 89 - "SellerAppPanel.tsx"
Cohesion: 0.27
Nodes (10): SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp(), sellerAppProblemText(), ALL, Linked(), LinkForm() (+2 more)

### Community 90 - "ai/package.json"
Cohesion: 0.11
Nodes (17): dependencies, @pactpal/net, zod, devDependencies, @types/node, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "dispute-routes.ts"
Cohesion: 0.31
Nodes (10): CHECK_INTERVAL_MS, checkView(), disputeParams, disputeRoutes(), disputePageView(), disputeSummaryView(), listDisputeNotices(), DisputeCheck (+2 more)

### Community 92 - "eval-judge.ts"
Cohesion: 0.23
Nodes (17): buyerProvidesScore(), categoryVerdict(), cites(), lineSet(), listScore(), marksScore(), normal(), priceVerdict() (+9 more)

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "PayPalWebhooks"
Cohesion: 0.22
Nodes (3): Receiver, isPayPalCertUrl(), PayPalWebhooks

### Community 95 - "DealPage.tsx"
Cohesion: 0.06
Nodes (62): CompletenessItem, CompletenessView, DealSummary, fileUrl(), getMe(), getScope(), LedgerCheck, StepView (+54 more)

### Community 96 - "dispute-notices.ts"
Cohesion: 0.22
Nodes (8): DisputeEntry, DisputeNotice, entryRow, NewDisputeNotice, newNoticeSchema, NOTICE_KINDS, NoticeKind, noticeRow

### Community 97 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

### Community 98 - "email/package.json"
Cohesion: 0.12
Nodes (15): dependencies, @pactpal/net, zod, devDependencies, @types/node, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "sellers/disputes.test.ts"
Cohesion: 0.14
Nodes (20): linkedSeller(), activeConnection(), claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow (+12 more)

### Community 101 - "runCouncil"
Cohesion: 0.10
Nodes (40): attempt(), MESSAGE_PROMPT_VERSIONS, MessageJob, AnswerRefusal, checkAnswer(), CheckedAnswer, citation, quoteOnLine() (+32 more)

### Community 102 - "Data model"
Cohesion: 0.33
Nodes (6): review(), Data model, `message_reviews`: council reviews of the buyer's messages, Phase 7 (deal space), Planned, Rules that apply everywhere

### Community 103 - "draft-view.ts"
Cohesion: 0.23
Nodes (10): categoryLabels, describeDraft(), priceMinor(), DEAL_CATEGORIES, allowedCategoryIds(), BLOCKED_CATEGORIES, BLOCKED_IDS, categoryVerdict (+2 more)

### Community 104 - "council/package.json"
Cohesion: 0.13
Nodes (14): dependencies, @pactpal/ai, zod, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "instruction-lines.test.ts"
Cohesion: 0.44
Nodes (6): findInstructionLines(), HIDDEN_LINE_TEXT, hideInstructionLines(), looksLikeInstruction(), PATTERNS, withoutInvisible()

### Community 106 - "Decisions"
Cohesion: 0.40
Nodes (5): AI, Decisions, Partner tools, Product, Redesign (Phase 7R)

### Community 107 - "claim-analyses.ts"
Cohesion: 0.13
Nodes (15): ANALYSIS_KINDS, ANALYSIS_TIMEOUT_MS, AnalysisKind, AnalysisRefusal, analysisRow, BASED_ON, ClaimAnalysisRecord, COUNT_NAMES (+7 more)

### Community 108 - "check-words.ts"
Cohesion: 0.39
Nodes (6): factsWords(), FORMAT_WORDS, MARKS, sizeWords(), TYPE_WORDS, VERDICT_WORDS

### Community 109 - "seller"
Cohesion: 0.33
Nodes (6): seller(), `acceptances`: signed agreements, `deal_messages`: the deal's chat (7b), `deliveries` and `delivery_files`: delivered work, `ledger_entries`: the evidence log, link()

### Community 110 - "db/src/migrate.ts"
Cohesion: 0.10
Nodes (21): result, Row, assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, migrationStatus (+13 more)

### Community 111 - "score/package.json"
Cohesion: 0.14
Nodes (13): dependencies, @pactpal/ledger, devDependencies, @types/node, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.15
Nodes (13): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+5 more)

### Community 113 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, dependency-cruiser, eslint, @eslint/js, jscpd, prettier, typescript, typescript-eslint (+2 more)

### Community 114 - "council"
Cohesion: 0.33
Nodes (6): draft(), `claim_analyses`: council comparisons of a dispute claim with the record, `deals`, `scope_drafts`: AI drafts of the agreed work, council(), deps()

### Community 115 - "timeline-routes.ts"
Cohesion: 0.15
Nodes (35): sendTimelineReminders(), dealCompleteness(), judgedScope(), completenessRoutes(), OVERVIEW_LIMIT, overviewOf(), money(), scopeTerms() (+27 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.12
Nodes (15): description, license, name, packageManager, private, type, version, dependency-cruiser (+7 more)

### Community 118 - "getDispute"
Cohesion: 0.60
Nodes (4): disputeOf(), disputeParams, sellersDispute(), getDispute()

### Community 119 - "render.ts"
Cohesion: 0.14
Nodes (18): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+10 more)

### Community 120 - "tokens.ts"
Cohesion: 0.24
Nodes (12): applyTokens(), ColorToken, DARK, declarations(), LIGHT, SHARED, contrast(), luminance() (+4 more)

### Community 121 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, declaration, jsx, lib, module, moduleResolution, noEmit, extends (+2 more)

### Community 122 - "Build plan"
Cohesion: 0.18
Nodes (11): Build plan, Decision gates, Dependencies, Open points, Phase 4 sub-phases, Phase 5 sub-phases, Phase 6 sub-phases, Phase 7 follow-ups (+3 more)

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

### Community 128 - "Redesign plan (proposed Phase 7R)"
Cohesion: 0.22
Nodes (9): Decisions taken, Goal, Proposed row for build-plan.md, Redesign plan (proposed Phase 7R), Risks, Routes, Steps, The one server addition (+1 more)

### Community 129 - "sign-in-words.ts"
Cohesion: 0.60
Nodes (3): SIGN_IN_PROBLEMS, signInReturn(), back()

### Community 130 - "devDependencies"
Cohesion: 0.40
Nodes (5): devDependencies, esbuild, tsx, @types/node, @types/ws

### Community 131 - "content-store.test.ts"
Cohesion: 0.40
Nodes (3): ContentMismatchError, db, store

### Community 133 - "Demo plan"
Cohesion: 0.22
Nodes (8): Contrast clip: a thin packet, Demo plan, Honesty rules for the demo, Seed script, Story 1: Maya, digital artist (main story), Story 2: Daniel, freelance web developer (change order and appeal), Story 3: Jun, digital templates (download log), Video script (under 3 minutes)

### Community 134 - "PactPal"
Cohesion: 0.22
Nodes (9): Code map, Deploying to Render, Disclaimer, Docs, License, PactPal, Quality, Running locally (+1 more)

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

### Community 150 - "change-order-routes.ts"
Cohesion: 0.10
Nodes (34): documentFor(), featureAnswers(), step(), acceptBody, changeOrderRoutes(), view(), waitingChange(), changeParams (+26 more)

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

### Community 158 - "Scope"
Cohesion: 0.50
Nodes (4): Explicitly out of scope, Roadmap (not built now), Scope, Who can use it, and for what

### Community 169 - "PactPal design system"
Cohesion: 0.15
Nodes (13): Colour, Components, Do and don't, Logo, Motion, PactPal design system, Principles, Shape, depth, space (+5 more)

### Community 174 - "buyer.ts"
Cohesion: 0.14
Nodes (15): BuyerPayment, openedDispute, PayPalBuyerTestActions, searchTime(), TEST_DISPUTE_ITEMS, TEST_DISPUTE_REASONS, dollar, setup() (+7 more)

## Knowledge Gaps
- **111 isolated node(s):** `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council`, `@pactpal/db`, `@pactpal/delivery-check` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1639 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `sign-in-words.ts`, `artifacts.ts`, `content-store.test.ts`, `react`, `testId`, `PayPalRestClient`, `acceptance-routes.ts`, `sandbox-respond-report.ts`, `claims/src/index.ts`, `ledger/src/index.ts`, `MessagesPanel.tsx`, `ai/src/index.ts`, `deals/routes.ts`, `paypal/src/disputes.ts`, `ScopePanel.tsx`, `chat.ts`, `db/src/disputes.ts`, `dispute-actions.ts`, `change-orders.test.ts`, `Database`, `council/src/index.ts`, `db/src/index.ts`, `words/src/index.ts`, `email/src/index.ts`, `validate.ts`, `scope-draft/src/testing.ts`, `scope-drafts.ts`, `action-routes.ts`, `packet-service.ts`, `when`, `scope-draft/src/council-task.ts`, `eval-report.ts`, `delivery-check.test.ts`, `scope-draft/src/index.ts`, `paypal-webhook.ts`, `config.ts`, `auth/sign-in.ts`, `DraftReview.tsx`, `buyer.ts`, `utcDateTime`, `dispute-sync.ts`, `sandbox-partner-report.ts`, `sandbox-webhook-report.ts`, `DeliveriesPanel.tsx`, `paypal-webhook.test.ts`, `timeline/src/index.ts`, `mcp.ts`, `completeness.ts`, `DisputeActions.tsx`, `bus.ts`, `net/src/index.ts`, `testSpec`, `postgres.ts`, `confirmation.ts`, `IntakePanel.tsx`, `chat-state.ts`, `live/src/index.ts`, `claim-job.ts`, `paypal/src/index.ts`, `build.js`, `SellerAppPanel.tsx`, `DealPage.tsx`, `log-labels.test.ts`, `sellers/disputes.test.ts`, `runCouncil`, `draft-view.ts`, `instruction-lines.test.ts`, `check-words.ts`, `db/src/migrate.ts`, `package.json`, `render.ts`, `tokens.ts`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **What connects `@pactpal/ai`, `@pactpal/claims`, `@pactpal/council` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `resend-inbound.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `artifacts.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06236786469344609 - nodes in this community are weakly interconnected._
- **Why does `Database` connect `Database` to `resend-inbound.ts`, `artifacts.ts`, `vitest`, `testId`, `deals/routes.ts`, `acceptance-routes.ts`, `ledger/src/index.ts`, `question-routes.ts`, `deals/routes.ts`, `chat.ts`, `db/src/disputes.ts`, `dispute-actions.ts`, `change-order-routes.ts`, `council/src/index.ts`, `notifier.ts`, `db/src/index.ts`, `email/src/index.ts`, `scope-drafts.ts`, `action-routes.ts`, `packet-service.ts`, `auth/sign-in.ts`, `dispute-sync.ts`, `server/src/index.ts`, `bus.ts`, `dispute-sync.ts`, `postgres.ts`, `claim-job.ts`, `sellers/disputes.test.ts`, `runCouncil`, `claim-analyses.ts`, `db/src/migrate.ts`, `timeline-routes.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `PayPalRestClient` be split into smaller, more focused modules?**
  _Cohesion score 0.07770582793709528 - nodes in this community are weakly interconnected._