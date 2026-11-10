# Graph Report - paypal-hackathon  (2026-11-10)

## Corpus Check
- 638 files · ~427,530 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 5, .example 1)

## Summary
- 5079 nodes · 16367 edges · 170 communities (156 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 508 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66d6cc7e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- file-routes.ts
- Database
- Secret
- appendLedgerEvent
- DraftPanel.tsx
- appendLedgerEvent
- api.ts
- packets.ts
- DraftReview.tsx
- PayPalRestClient
- claims/src/index.ts
- ledger/src/index.ts
- routes.ts
- question-routes.ts
- ai/src/index.ts
- utcDateTime
- paypal/src/disputes.ts
- ScopePanel.tsx
- timeline-progress.ts
- chat-api.ts
- change-order-routes.ts
- draft-job.ts
- mcp.ts
- seed-sandbox.ts
- dependencies
- council/src/index.ts
- server/src/index.ts
- db/src/migrate.ts
- notices.ts
- delivery-checks.ts
- web/src/format.ts
- scope-draft/src/testing.ts
- injection-runner.ts
- instruction-lines.test.ts
- .transaction
- Secret
- packet-service.ts
- words/src/index.ts
- Secret
- eval-report.ts
- paypal/src/index.ts
- validate.ts
- eval-judge.ts
- config.ts
- seller-connections.ts
- acceptance-routes.ts
- db/src/index.ts
- buildApp
- dispute-sync.ts
- council-record.ts
- disputes/test-support.ts
- web/package.json
- when
- tools.ts
- Built (sub-phases 2b to 6h-1)
- action-routes.ts
- verify
- delivery-check/src/index.ts
- timeline/src/index.ts
- scope-draft/src/index.ts
- completeness.ts
- seller-app.ts
- DisputeActions.tsx
- services
- claim-job.ts
- scripts
- db/package.json
- scope-drafts.ts
- claim-routes.ts
- paypal-webhook.ts
- postgres.ts
- parseJsonReply
- claims/package.json
- sandbox-respond-report.ts
- IntakePanel.tsx
- claims/src/check.ts
- action-service.ts
- Sandbox feasibility tests
- delivery-check/package.json
- qa/package.json
- watcher/package.json
- testSpec
- mcp-routes.ts
- db/src/index.ts
- scope-draft/package.json
- paypal/package.json
- resend-inbound.ts
- pdf/package.json
- products/package.json
- dispute-routes.ts
- ai/package.json
- routes.ts
- build.js
- scripts
- sandbox-webhook-report.ts
- photo-convert.test.ts
- delivery-check-routes.test.ts
- render.ts
- email/package.json
- compilerOptions
- live-hub.ts
- DealPage.tsx
- SellerAppPanel.tsx
- resend-inbound.ts
- council/package.json
- Layout
- resend-inbound.test.ts
- DisputesPanel.tsx
- appeal-items.ts
- image.ts
- vitest
- score/package.json
- PactPal product spec
- devDependencies
- log-labels.ts
- server/package.json
- Engineering standards
- package.json
- Decisions
- server/package.json
- check-words.ts
- compilerOptions
- Build plan
- PayPal sandbox notes
- ledger/package.json
- live/package.json
- net/package.json
- timeline/package.json
- @pactpal/email@workspace:*
- ws
- delivery-check.test.ts
- @fastify/helmet
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
- @fastify/static
- council/tsconfig.json
- live/tsconfig.json
- paypal/tsconfig.json
- timeline/tsconfig.json
- words/tsconfig.json
- pnpm-workspace.yaml
- @pactpal/claims@workspace:*
- @pactpal/council@workspace:*
- dependency-cruiser@^16.10.4
- jscpd@^4.3.0
- .prettierrc.json
- products/tsconfig.json
- auth/sign-in.ts
- @pactpal/delivery-check@workspace:*
- @pactpal/qa@workspace:*
- log-labels.test.ts
- @pactpal/timeline@workspace:*
- @pactpal/products@workspace:*

## God Nodes (most connected - your core abstractions)
1. `vitest` - 196 edges
2. `Database` - 122 edges
3. `testId()` - 110 edges
4. `readLedger()` - 90 edges
5. `sha256Hex()` - 81 edges
6. `useMigratedTestDatabase()` - 78 edges
7. `appendLedgerEvent()` - 75 edges
8. `isObject()` - 67 edges
9. `TEST_NOW` - 65 edges
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

## Communities (170 total, 14 thin omitted)

### Community 0 - "file-routes.ts"
Cohesion: 0.18
Nodes (13): attachmentHeader(), sendCheckedFile(), sendDownload(), addedByRole(), FILE_NAME_HEADER, fileNameFrom(), fileParams, fileView() (+5 more)

### Community 1 - "Database"
Cohesion: 0.09
Nodes (37): ReceiptMailDeps, AppOptions, SignInOptions, NotifierOptions, ReminderDeps, DeliveryRouteOptions, FileRouteOptions, MilestoneRouteOptions (+29 more)

### Community 2 - "Secret"
Cohesion: 0.08
Nodes (31): Call, item, json(), Reply, tokenReply(), PayPalAppCredentials, SANDBOX_API_BASE_URL, PayPalNetworkError (+23 more)

### Community 3 - "appendLedgerEvent"
Cohesion: 0.04
Nodes (80): forward(), settle(), AcceptanceIntegrityError, AcceptanceNotAllowedError, AcceptanceRefusal, acceptanceRow, AcceptTerms, acceptTerms() (+72 more)

### Community 4 - "DraftPanel.tsx"
Cohesion: 0.07
Nodes (44): addFile(), addPastedChat(), DealFile, DraftContent, draftsUrl(), fileUrl(), getDraftById(), getScope() (+36 more)

### Community 5 - "appendLedgerEvent"
Cohesion: 0.05
Nodes (71): acceptTermsSchema, AcceptChange, acceptChangeSchema, addedCounts(), answer(), CHANGE_ORDER_STATUSES, changeOf(), ChangeOrder (+63 more)

### Community 6 - "api.ts"
Cohesion: 0.05
Nodes (78): AcceptancePanel(), ReceiptEmails(), acceptanceStep(), acceptanceUrl(), AcceptanceView, acceptTerms(), answerBuyerQuestion(), AnswerOptionView (+70 more)

### Community 7 - "packets.ts"
Cohesion: 0.07
Nodes (31): db, disputedDeal(), FILES, GOOD, SummariesView, linkApp(), paidFromOwnApp(), AnalysisNotAllowedError (+23 more)

### Community 8 - "DraftReview.tsx"
Cohesion: 0.10
Nodes (30): ChatLine, Citation, DraftCandidate, DraftCategory, DraftMark, DraftView, ChatLines(), ChatPane() (+22 more)

### Community 9 - "PayPalRestClient"
Cohesion: 0.09
Nodes (28): APP_NAMES, appClients(), appCredentials(), disputeClients(), fail(), platformSellers(), sellerClients(), invoices (+20 more)

### Community 10 - "claims/src/index.ts"
Cohesion: 0.07
Nodes (69): AppealCheck, AppealContext, checkAppeal(), readAppeal(), APPEAL_PROMPT_VERSION, AppealItem, appealMessages(), appealSource() (+61 more)

### Community 11 - "ledger/src/index.ts"
Cohesion: 0.06
Nodes (64): isPicture(), DISPUTE_EVENT_PREFIX, agentBodySha256(), addArtifact(), ARTIFACT_KINDS, ARTIFACT_LIMITS, ArtifactLimits, ArtifactRejectedError (+56 more)

### Community 12 - "routes.ts"
Cohesion: 0.07
Nodes (55): accessSummary(), answerView(), changesBody, deliveryId, deliveryParams, deliveryRoutes(), answer(), answerRoute() (+47 more)

### Community 13 - "question-routes.ts"
Cohesion: 0.06
Nodes (63): CHAT_TRANSCRIPT_PREFIX, LiveRouteOptions, AcceptanceRouteOptions, DealLookup, featureAnswers(), sendRefusal(), ChangeOrderRouteOptions, checkBody (+55 more)

### Community 14 - "ai/src/index.ts"
Cohesion: 0.10
Nodes (32): AI_RETRY_POLICY, ClientOptions, errorBody, failure(), kindOfStatus(), ModelNetworkError, OpenAiCompatibleClient, providerCode() (+24 more)

### Community 15 - "utcDateTime"
Cohesion: 0.12
Nodes (31): answerEmail(), AnswerFacts, revisionLine(), buyerFileEmail(), changeAnswerEmail(), changeProposedEmail(), amountOf(), SANDBOX_FOOTER (+23 more)

### Community 16 - "paypal/src/disputes.ts"
Cohesion: 0.06
Nodes (36): send(), `buyer_questions`: questions about the agreement before signing, Engineering, PayPal integration, AcceptClaimInput, answered(), collect(), DisputeAnswer (+28 more)

### Community 17 - "ScopePanel.tsx"
Cohesion: 0.07
Nodes (65): acceptChange(), changeOrdersUrl(), ChangeOrdersView, ChangeOrderView, changeStep(), ChangeView, declineChange(), DeliverableKind (+57 more)

### Community 18 - "timeline-progress.ts"
Cohesion: 0.04
Nodes (71): addCard(), body, ChatIntegrityError, ChatNotAllowedError, chatNoticeSchema, ChatRefusal, ChatRole, checkedMessage() (+63 more)

### Community 19 - "chat-api.ts"
Cohesion: 0.06
Nodes (60): draftFrom(), getLedger(), hasScope(), isAppeal(), isCouncil(), isCouncilJob(), isDisputePage(), isDocument() (+52 more)

### Community 20 - "change-order-routes.ts"
Cohesion: 0.08
Nodes (50): ACCEPTANCE_DOCUMENT_FORMAT, ACCEPTANCE_NOTICE_VERSION, acceptanceDocument(), currentDocument(), documentFor(), fingerprinted(), money, sendTimelineReminders() (+42 more)

### Community 21 - "draft-job.ts"
Cohesion: 0.09
Nodes (44): MESSAGE_PROMPT_VERSIONS, MessageJob, LABEL_WORDS, revisionNote(), ClaimContext, markedPrompt(), AnswerRefusal, checkAnswer() (+36 more)

### Community 22 - "mcp.ts"
Cohesion: 0.12
Nodes (19): checkMcp(), PayPalMcpError, invoice, Invoice, noAnswer(), setup(), setupError(), describe() (+11 more)

### Community 23 - "seed-sandbox.ts"
Cohesion: 0.07
Nodes (35): InvoiceArgs, buyer, buyerActions, disputes, invoices, parsed, argsSchema, formatPayInstructions() (+27 more)

### Community 24 - "dependencies"
Cohesion: 0.10
Nodes (21): dependencies, fastify@^5.12.7, @fastify/cookie@^11.1.5, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/live@workspace:*, @pactpal/net@workspace:*, @pactpal/scope-draft@workspace:* (+13 more)

### Community 25 - "council/src/index.ts"
Cohesion: 0.09
Nodes (45): TokenUsage, aggregate(), AggregateOptions, kendallW(), validateBallot(), anonymize(), filterValid(), labelFor() (+37 more)

### Community 26 - "server/src/index.ts"
Cohesion: 0.07
Nodes (37): log, BUTTON_WINDOW_MS, checkKey(), renderClaimRunner(), renderWorkflowChecker(), RunnerBusyError, sameWorkflowTask(), SCHEDULE_WINDOW_MS (+29 more)

### Community 27 - "db/src/migrate.ts"
Cohesion: 0.29
Nodes (11): assertUnchanged(), assertWellFormed(), checksumOf(), migrate(), MigrationError, MigrationStatus, migrationStatus(), readApplied() (+3 more)

### Community 28 - "notices.ts"
Cohesion: 0.11
Nodes (31): inProcessChecker(), db, DisputesView, paidDeal(), failureCode(), syncDisputes(), checker(), db (+23 more)

### Community 29 - "delivery-checks.ts"
Cohesion: 0.10
Nodes (20): refusal(), sellerStageStep, checkedFileSchema, checkRow, DeliveryCheck, DeliveryCheckNotAllowedError, DeliveryCheckRefusal, listDeliveryChecks() (+12 more)

### Community 30 - "web/src/format.ts"
Cohesion: 0.10
Nodes (39): analysesUrl(), AppealCheckView, AppealView, ClaimAnalysesView, ClaimAnalysisView, ClaimStatement, compareClaim(), CouncilView (+31 more)

### Community 31 - "scope-draft/src/testing.ts"
Cohesion: 0.11
Nodes (30): DraftStepKind, EVAL_CASES, EvalCase, EvalGold, baseLines(), BLOCKED_OR_UNCLEAR, CHAT_CASES, ChatCase (+22 more)

### Community 32 - "injection-runner.ts"
Cohesion: 0.11
Nodes (27): logProgress(), valueOrExit(), modelNames(), pickModels(), selectedClientsOrExit(), councilClients(), DroppedDraft, droppedSection() (+19 more)

### Community 33 - "instruction-lines.test.ts"
Cohesion: 0.12
Nodes (26): JsonSchema, RankingPromptInput, RANK_CRITERIA, scopeDraftCouncilTask(), build(), input, numbered, findInstructionLines() (+18 more)

### Community 34 - ".transaction"
Cohesion: 0.09
Nodes (34): ArtifactKind, answerDelivery(), AnswerInput, answerRow, answerSchema, buyerStepSchema, Delivery, DeliveryAnswer (+26 more)

### Community 35 - "Secret"
Cohesion: 0.08
Nodes (42): signedPayPal(), fakeWriter(), fakeAppWebhooks(), fakePayPal(), db, setup(), linkBody, paypalUnavailable() (+34 more)

### Community 36 - "packet-service.ts"
Cohesion: 0.09
Nodes (46): aiBlocks(), dateTime(), ExhibitPlan, ExhibitSource, HOW_TO_CHECK, LeftOut, ORDER, PACKET_FORMAT (+38 more)

### Community 37 - "words/src/index.ts"
Cohesion: 0.05
Nodes (74): AcceptanceDocument, acceptanceDocumentSchema, acceptedPayload, buildReceipt(), dateTime(), REACHED, RECEIPT_FORMAT, receiptBlocks() (+66 more)

### Community 38 - "Secret"
Cohesion: 0.04
Nodes (72): RFC-2606, bareAddress(), check, InboxNetworkError, receivedAnswer, RESEND_RECEIVED_URL, ResendReceivedEmails, inbox() (+64 more)

### Community 39 - "eval-report.ts"
Cohesion: 0.16
Nodes (29): aloneRow(), aloneSection(), cell(), chatSection(), councilSection(), count(), fixed(), formatEvalReport() (+21 more)

### Community 40 - "paypal/src/index.ts"
Cohesion: 0.05
Nodes (50): FakePayPalMode, MAX_DISPUTE_PAGES, accepted, fullDispute, listed(), offer, page(), pdfFile (+42 more)

### Community 41 - "validate.ts"
Cohesion: 0.11
Nodes (30): paymentFromShare(), Share, shareOf(), sharesIn(), StatedShares, WORD_SHARES, Citation, amountQuoted() (+22 more)

### Community 42 - "eval-judge.ts"
Cohesion: 0.12
Nodes (29): compare(), compareMarks(), compareWithDraft(), draftedPriceMinor(), FieldChange, plain(), provided(), compare() (+21 more)

### Community 43 - "config.ts"
Cohesion: 0.08
Nodes (35): result, loadConfigOrExit(), ADDRESS_RULES, addressAllowed(), AI_KEYS, appVars(), Config, FEATURES (+27 more)

### Community 44 - "seller-connections.ts"
Cohesion: 0.14
Nodes (18): `deliveries` and `delivery_files`: delivered work, claimAccount(), confirmConnection(), ConfirmRefusal, connectedSellers(), ConnectionBase, connectionRow, endConnection() (+10 more)

### Community 45 - "acceptance-routes.ts"
Cohesion: 0.08
Nodes (38): emailReceipt(), emailReceiptQuietly(), MAX_RECEIPT_EMAILS, ReceiptMailResult, receiptSentPayload, receiptsSent(), Role, ROLES (+30 more)

### Community 46 - "db/src/index.ts"
Cohesion: 0.03
Nodes (114): db, sentStage(), SendDelivery, ActionFile, actionFileSchema, ActionOutcome, actionRow, amountSchema (+106 more)

### Community 47 - "buildApp"
Cohesion: 0.08
Nodes (18): buildApp(), closeOnSignals(), requestLog(), socketOrigin(), report, setup(), setup(), setup() (+10 more)

### Community 48 - "dispute-sync.ts"
Cohesion: 0.17
Nodes (19): changedSince(), Counts, readTooSoon(), readVersionOf(), sameSecond(), snapshotOf(), storedDetails, storedSnapshot() (+11 more)

### Community 49 - "council-record.ts"
Cohesion: 0.09
Nodes (26): councilRecordOf(), draftCategories, CouncilRecord, councilRecordSchema, isUnranked(), two, toCouncilRecord(), usage (+18 more)

### Community 50 - "disputes/test-support.ts"
Cohesion: 0.09
Nodes (30): db, signThroughRoutes(), ActionsView, confirmed(), db, disputedDeal(), FILES, sha() (+22 more)

### Community 51 - "web/package.json"
Cohesion: 0.08
Nodes (32): dependencies, @pactpal/delivery-check@workspace:*, @pactpal/live@workspace:*, @pactpal/timeline@workspace:*, @pactpal/watcher@workspace:*, @pactpal/words@workspace:*, react@^18.3.1, react-dom@^18.3.1 (+24 more)

### Community 52 - "when"
Cohesion: 0.08
Nodes (54): AgentRequestsPanel(), AnswerBox(), Revisions, revisionWords(), AgentRequestView, answerAgentRequest(), approveDelivery(), checkMessage() (+46 more)

### Community 53 - "tools.ts"
Cohesion: 0.13
Nodes (19): AgentTool, ask(), choicesSchema, dealId, dealPath(), disputeId, disputePath(), failed() (+11 more)

### Community 54 - "Built (sub-phases 2b to 6h-1)"
Cohesion: 0.07
Nodes (39): review(), at(), source(), key(), seller(), draft(), unchanged(), `acceptances`: signed agreements (+31 more)

### Community 55 - "action-routes.ts"
Cohesion: 0.11
Nodes (29): acceptBody, actionParams, ActionRouteOptions, actionRoutes(), checkCoverage(), confirmedSend(), filesOf(), noteSend() (+21 more)

### Community 56 - "verify"
Cohesion: 0.06
Nodes (30): concurrency, cancel-in-progress, group, POSTGRES_PASSWORD, TEST_DATABASE_URL, jobs, verify, name (+22 more)

### Community 57 - "delivery-check/src/index.ts"
Cohesion: 0.12
Nodes (26): looks(), CheckLine, codeChecks(), judge(), largest(), LineCodeResult, MEDIA_TYPES, RequirementResult (+18 more)

### Community 58 - "timeline/src/index.ts"
Cohesion: 0.07
Nodes (49): ChangeProposal, ScopeInput, dated(), DraftedItem, DraftedStep, planFromDraft(), same(), TimelinePlan (+41 more)

### Community 59 - "scope-draft/src/index.ts"
Cohesion: 0.08
Nodes (33): ScopeDraftTask, DraftSourceParts, draftSourceText(), messageLines(), minuteOf(), ROLE_WORDS, TranscriptMessage, linesOf() (+25 more)

### Community 60 - "completeness.ts"
Cohesion: 0.11
Nodes (25): Completeness, CompletenessInput, CompletenessItem, completenessScore(), Facts, field(), ItemStatus, Measure (+17 more)

### Community 61 - "seller-app.ts"
Cohesion: 0.14
Nodes (20): APP_KEYS, PayPalApp, checkAsSellerApp(), checks, message(), result, APP_LABELS, appSection() (+12 more)

### Community 62 - "DisputeActions.tsx"
Cohesion: 0.13
Nodes (31): acceptDisputeClaim(), checkAppeal(), DisputeActionsView, DisputeActionView, disputeStepUrl(), draftResponse(), escalateDispute(), getDisputeActions() (+23 more)

### Community 63 - "services"
Cohesion: 0.07
Nodes (27): databases, diskSizeGB, ipAllowList, name, plan, postgresMajorVersion, region, fromDatabase (+19 more)

### Community 64 - "claim-job.ts"
Cohesion: 0.21
Nodes (25): Analysis, buyersClaim(), comparisonRowsOf(), dealOf(), fingerprintOf(), JOB_WORDS, NotBuilt, prepareAppeal() (+17 more)

### Community 65 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, ai:check, audit:prod, build, deps:check, dev, dup, env:check (+18 more)

### Community 66 - "db/package.json"
Cohesion: 0.09
Nodes (27): dependencies, @pactpal/ledger@workspace:*, @pactpal/products@workspace:*, @pactpal/timeline@workspace:*, pg@^8.23.1, zod@^4.6.7, devDependencies, @electric-sql/pglite@^0.5.13 (+19 more)

### Community 67 - "scope-drafts.ts"
Cohesion: 0.09
Nodes (31): withReadyDraft(), checkedDraft(), countRow, DraftIntegrityError, DraftNotAllowedError, DraftRefusal, draftRow, DraftStateError (+23 more)

### Community 68 - "claim-routes.ts"
Cohesion: 0.22
Nodes (21): appealApplies(), analysisView(), appealView(), ClaimRouteOptions, claimRoutes(), answer(), startJob(), councilView (+13 more)

### Community 69 - "paypal-webhook.ts"
Cohesion: 0.12
Nodes (12): envelope, ParsedJson, parseJson(), paypalWebhookRoutes(), receive(), Receiver, SELLER_WEBHOOK_PATH, SellerAlertLookup (+4 more)

### Community 70 - "postgres.ts"
Cohesion: 0.09
Nodes (15): Row, databaseFromPool(), fakeClient(), Handler, setup(), ListenOptions, listenPostgres(), PgClient (+7 more)

### Community 71 - "parseJsonReply"
Cohesion: 0.20
Nodes (13): AI_CHECK_PROMPT, describe(), formatAiReport(), isStatusOk(), ModelCheck, summarizeOutcome(), spec, attempt() (+5 more)

### Community 72 - "claims/package.json"
Cohesion: 0.11
Nodes (23): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, @pactpal/qa@workspace:*, @pactpal/scope-draft@workspace:*, @pactpal/words@workspace:*, zod@^4.6.7, devDependencies (+15 more)

### Community 73 - "sandbox-respond-report.ts"
Cohesion: 0.06
Nodes (68): AMOUNT_OPTIONS, amountOption(), Checked, disputeIdOption, issuesText(), message(), payPalIdOption(), readChecked() (+60 more)

### Community 74 - "IntakePanel.tsx"
Cohesion: 0.19
Nodes (15): DealOptions, getIntakeKey(), IntakeKeyView, IntakeKind, IntakeSecretView, isIntakeKey(), isSecretView(), makeIntakeSecret() (+7 more)

### Community 75 - "claims/src/check.ts"
Cohesion: 0.09
Nodes (31): checkAnalysis(), invalid(), MAX_STATEMENTS, readAnalysis(), ClaimText, linesOf(), AGREEMENT, CLAIM (+23 more)

### Community 76 - "action-service.ts"
Cohesion: 0.16
Nodes (16): actionChoices(), actionView(), deliverAction(), evidenceTypesFor(), failedOutcome(), newestReady(), send(), disputedAmountWords() (+8 more)

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

### Community 81 - "testSpec"
Cohesion: 0.05
Nodes (70): councilDeps(), isRankingRequest(), model(), models(), councilOf(), db, draftedAs(), idOf() (+62 more)

### Community 82 - "mcp-routes.ts"
Cohesion: 0.19
Nodes (12): CallLimiter, AGENT_CALLS_PER_MINUTE, bearerOf(), McpRouteOptions, mcpRoutes(), mcpServer(), routeCaller(), AGENT_TOOLS (+4 more)

### Community 83 - "db/src/index.ts"
Cohesion: 0.05
Nodes (69): AGENT_CODE_LIFETIME_MS, AGENT_REQUEST_KINDS, AGENT_REQUEST_STATUSES, AgentRequestKind, AgentRequestRefusal, AgentRequestStatus, answerAgentRequest(), claimAgentRequest() (+61 more)

### Community 84 - "scope-draft/package.json"
Cohesion: 0.12
Nodes (19): dependencies, @pactpal/ai@workspace:*, @pactpal/council@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing (+11 more)

### Community 85 - "paypal/package.json"
Cohesion: 0.13
Nodes (19): dependencies, @modelcontextprotocol/sdk@1.32.1, @pactpal/ledger@workspace:*, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.20.5, @modelcontextprotocol/sdk (+11 more)

### Community 86 - "resend-inbound.ts"
Cohesion: 0.24
Nodes (10): createIntakeDeal(), intakeFilename(), envelope, forwardingCode(), passed(), resendInboundRoutes(), ENTITIES, entity() (+2 more)

### Community 87 - "pdf/package.json"
Cohesion: 0.13
Nodes (17): dependencies, pdf-lib@1.17.1, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @types/node (+9 more)

### Community 88 - "products/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 89 - "dispute-routes.ts"
Cohesion: 0.42
Nodes (8): checkView(), disputeParams, disputeRoutes(), disputePageView(), disputeSummaryView(), listDisputeNotices(), latestDisputeCheck(), listDealDisputes()

### Community 90 - "ai/package.json"
Cohesion: 0.13
Nodes (17): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, exports, ./testing, @pactpal/net (+9 more)

### Community 91 - "routes.ts"
Cohesion: 0.07
Nodes (62): AgentRequestRouteOptions, agentRequestRoutes(), listQuery, params, REFUSED, view(), afterQuery, ChatNames (+54 more)

### Community 92 - "build.js"
Cohesion: 0.25
Nodes (6): builtins, { dependencies = {} }, external, missing, packageOf(), setup()

### Community 93 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, ai:check, build, dev, env:check, eval:injection, eval:scope, migrate (+9 more)

### Community 94 - "sandbox-webhook-report.ts"
Cohesion: 0.12
Nodes (21): parsed, argsSchema, formatEvents(), formatPreview(), formatRegistered(), formatRegistrations(), parseWebhookArgs(), USAGE (+13 more)

### Community 95 - "photo-convert.test.ts"
Cohesion: 0.43
Nodes (4): sharp@0.35.5, MAX_PHOTO_SIDE, toJpeg(), sharp

### Community 96 - "delivery-check-routes.test.ts"
Cohesion: 0.17
Nodes (13): CheckView, db, FAILED, shown, store, BPP, chunk(), figure() (+5 more)

### Community 97 - "render.ts"
Cohesion: 0.15
Nodes (17): Block, blockSchema, PdfDocumentInput, pdfDocumentSchema, text, CharacterSet, Fonts, INK (+9 more)

### Community 98 - "email/package.json"
Cohesion: 0.15
Nodes (15): dependencies, @pactpal/net@workspace:*, zod@^4.6.7, devDependencies, @types/node@^22.10.2, @pactpal/net, @types/node, zod (+7 more)

### Community 99 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, esModuleInterop, exactOptionalPropertyTypes, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution (+7 more)

### Community 100 - "live-hub.ts"
Cohesion: 0.05
Nodes (42): BusSignal, ChatBus, Listen, listeners(), memoryBus(), postgresBus(), publishingBus(), db (+34 more)

### Community 101 - "DealPage.tsx"
Cohesion: 0.06
Nodes (57): addBuyer(), checkLedger(), checkPayments(), createDeal(), errorMessage(), getDeal(), getDealOptions(), getMe() (+49 more)

### Community 102 - "SellerAppPanel.tsx"
Cohesion: 0.21
Nodes (14): getSellerApp(), isSellerAppLink(), isSellerAppState(), linkSellerApp(), SellerAppLink, SellerAppProblem, SellerAppState, unlinkSellerApp() (+6 more)

### Community 103 - "resend-inbound.ts"
Cohesion: 0.24
Nodes (11): bearerOf(), intakeBody, IntakeRouteOptions, intakeRoutes(), payPalSeller(), settingsView(), keyBody, secretView() (+3 more)

### Community 104 - "council/package.json"
Cohesion: 0.15
Nodes (14): dependencies, @pactpal/ai@workspace:*, zod@^4.6.7, exports, ./testing, @pactpal/ai, zod, main (+6 more)

### Community 105 - "Layout"
Cohesion: 0.27
Nodes (5): breakWord(), columnWidths(), drawable(), drawBlock(), Layout

### Community 106 - "resend-inbound.test.ts"
Cohesion: 0.20
Nodes (9): RESEND_INBOUND_PATH, db, forwarding(), inbox(), SECRET_BYTES, listDealsForUser(), ReadResult, ReceivedEmail (+1 more)

### Community 107 - "DisputesPanel.tsx"
Cohesion: 0.29
Nodes (10): checkDisputes(), DisputesView, getDisputes(), isDisputes(), CheckNow(), LastCheck, lastChecked(), disputePageUrl() (+2 more)

### Community 108 - "appeal-items.ts"
Cohesion: 0.13
Nodes (18): appealGaps(), missingFromPacket(), AlreadySent, appealFacts(), appealItems(), DISPUTE_PROCESS, docItemId(), entryItemId() (+10 more)

### Community 109 - "image.ts"
Cohesion: 0.38
Nodes (11): ALPHA_LAYOUT, ascii(), byte(), imageFacts(), jpegSize(), pngChunks(), PngHeader, pngTransparency() (+3 more)

### Community 110 - "vitest"
Cohesion: 0.03
Nodes (153): ACCEPTANCE_NOTICE, agentDeal(), db, mcpClient(), ToolResult, db, SESSION_COOKIE, db (+145 more)

### Community 111 - "score/package.json"
Cohesion: 0.16
Nodes (13): dependencies, @pactpal/ledger@workspace:*, devDependencies, @types/node@^22.10.2, @pactpal/ledger, @types/node, main, name (+5 more)

### Community 112 - "PactPal product spec"
Cohesion: 0.14
Nodes (14): AI roles, Deal space (Phase 7), End-to-end flow, Evidence completeness score, Evidence ledger, Evidence packet, Guardrails, MCP server for agents (+6 more)

### Community 113 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @eslint/js@^9.17.0, prettier@^3.4.2, typescript@^5.7.2, typescript-eslint@^8.18.1, vitest@^2.1.8, @vitest/coverage-v8@^2.1.9, @eslint/js (+4 more)

### Community 114 - "log-labels.ts"
Cohesion: 0.26
Nodes (10): deliveryLabel(), DeliveryNumber, EVENT_LABELS, Fields, FORWARD_REASONS, logLabels(), plainLabel(), questionLabel() (+2 more)

### Community 115 - "server/package.json"
Cohesion: 0.22
Nodes (9): devDependencies, esbuild@~0.25.12, tsx@^4.19.2, @types/node@^22.10.2, @types/ws@^8.18.2, @types/node, esbuild, tsx (+1 more)

### Community 116 - "Engineering standards"
Cohesion: 0.17
Nodes (12): 10. Documentation and change hygiene, 1. Architecture and structure, 2. No duplication, 3. TypeScript, 4. Server (Node + Fastify), 5. Web (React), 6. Data, 7. Security and privacy (+4 more)

### Community 117 - "package.json"
Cohesion: 0.17
Nodes (11): description, eslint@^9.17.0, engines, node, license, name, packageManager, private (+3 more)

### Community 118 - "Decisions"
Cohesion: 0.40
Nodes (5): Agents (Phase 8), AI, Decisions, Partner tools, Product

### Community 119 - "server/package.json"
Cohesion: 0.11
Nodes (18): @fastify/websocket@^11.3.7, @pactpal/ai@workspace:*, @pactpal/db@workspace:*, @pactpal/paypal@workspace:*, @pactpal/pdf@workspace:*, @pactpal/score@workspace:*, @pactpal/watcher@workspace:*, @pactpal/ai (+10 more)

### Community 120 - "check-words.ts"
Cohesion: 0.36
Nodes (7): factsWords(), FORMAT_WORDS, MARKS, requirementWords(), sizeWords(), TYPE_WORDS, VERDICT_WORDS

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

### Community 130 - "delivery-check.test.ts"
Cohesion: 0.25
Nodes (5): CheckedFile, IMAGE, LINES, ImageFacts, pdfTextLines()

### Community 132 - "README.md"
Cohesion: 0.28
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

### Community 163 - "products/tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, noEmit, types, extends, include, ../../tsconfig.base.json

### Community 164 - "auth/sign-in.ts"
Cohesion: 0.14
Nodes (20): LinkOptions, linkRoutes(), REDEEM_PATH, redeemBody, backHome(), CALLBACK_PATH, callbackQuery, cookieRules (+12 more)

### Community 167 - "log-labels.test.ts"
Cohesion: 0.32
Nodes (7): paid(), changes(), entry(), sent(), `delivery_answers`: the buyer's answer to a delivery, `dispute_actions`: what the seller sent PayPal for a dispute, `milestones`: payment stages invoiced through PayPal

## Knowledge Gaps
- **23 isolated node(s):** `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json`, `../../tsconfig.base.json` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1473 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `delivery-check.test.ts`, `appendLedgerEvent`, `DraftPanel.tsx`, `appendLedgerEvent`, `Secret`, `packets.ts`, `DraftReview.tsx`, `PayPalRestClient`, `claims/src/index.ts`, `ledger/src/index.ts`, `routes.ts`, `ai/src/index.ts`, `utcDateTime`, `ScopePanel.tsx`, `timeline-progress.ts`, `chat-api.ts`, `draft-job.ts`, `mcp.ts`, `seed-sandbox.ts`, `council/src/index.ts`, `server/src/index.ts`, `db/src/migrate.ts`, `notices.ts`, `delivery-checks.ts`, `scope-draft/src/testing.ts`, `injection-runner.ts`, `instruction-lines.test.ts`, `.transaction`, `Secret`, `packet-service.ts`, `words/src/index.ts`, `Secret`, `eval-report.ts`, `log-labels.test.ts`, `paypal/src/index.ts`, `eval-judge.ts`, `config.ts`, `seller-connections.ts`, `validate.ts`, `db/src/index.ts`, `buildApp`, `dispute-sync.ts`, `council-record.ts`, `disputes/test-support.ts`, `timeline/src/index.ts`, `scope-draft/src/index.ts`, `completeness.ts`, `seller-app.ts`, `DisputeActions.tsx`, `scope-drafts.ts`, `postgres.ts`, `parseJsonReply`, `sandbox-respond-report.ts`, `IntakePanel.tsx`, `claims/src/check.ts`, `testSpec`, `db/src/index.ts`, `resend-inbound.ts`, `sandbox-webhook-report.ts`, `photo-convert.test.ts`, `delivery-check-routes.test.ts`, `render.ts`, `live-hub.ts`, `DealPage.tsx`, `SellerAppPanel.tsx`, `resend-inbound.test.ts`, `appeal-items.ts`, `devDependencies`, `package.json`, `check-words.ts`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **What connects `RFC-5987`, `../../tsconfig.base.json`, `../../tsconfig.base.json` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database` be split into smaller, more focused modules?**
  _Cohesion score 0.08758503401360544 - nodes in this community are weakly interconnected._
- **Why does `Decisions` connect `Decisions` to `paypal/src/disputes.ts`, `timeline/src/index.ts`, `README.md`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `Secret` be split into smaller, more focused modules?**
  _Cohesion score 0.08421985815602837 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Should `appendLedgerEvent` be split into smaller, more focused modules?**
  _Cohesion score 0.04417773237997957 - nodes in this community are weakly interconnected._