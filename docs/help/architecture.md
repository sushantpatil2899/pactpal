# How PactPal is built

PactPal is one TypeScript code base: a website, a server and a set of small packages that each do one job. This page is for developers and anyone curious about how it fits together.

## The parts

| Part                      | What it does                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `apps/web`                | The website and the app: React, plain CSS on shared design tokens, AG Grid and AG Studio, Bryntum, Three.js   |
| `apps/server`             | The API, PayPal notifications, the live chat, the MCP server for agents, and the background tasks             |
| `apps/docs`               | This help site, built from Markdown in the website's look                                                     |
| `packages/ledger`         | The hash-chained, append only evidence log and its check                                                      |
| `packages/council`        | The AI council's vote: anonymised ranking, Borda count and agreement level                                    |
| `packages/ai`             | Access to the hosted AI models, each from a different family                                                  |
| `packages/scope-draft`    | Drafting an agreement and timeline from a chat, with a citation for every term                                |
| `packages/claims`         | Comparing a buyer's dispute claim with the agreement and the record                                           |
| `packages/qa`             | Answering buyers' questions from the agreement only                                                           |
| `packages/watcher`        | Labelling new buyer requests as within the agreement, an extra revision or new work                           |
| `packages/delivery-check` | The pre-delivery check of files against the agreement                                                         |
| `packages/timeline`       | The agreed timeline: its steps, their rules and their progress                                                |
| `packages/score`          | The records score                                                                                             |
| `packages/paypal`         | PayPal access: sign-in, invoices, disputes and notifications, through PayPal's MCP tools first and REST after |
| `packages/products`       | Reading a product listing page as structured facts (Channel3)                                                 |
| `packages/pdf`            | Receipts and evidence packets as PDF                                                                          |
| `packages/email`          | Sending and receiving email (Resend)                                                                          |
| `packages/live`           | The live chat's messages, shared by the server and the website                                                |
| `packages/db`             | The database: tables, migrations and the guards that keep the log append only                                 |
| `packages/brand`          | The design tokens and the mark, shared by the website and this site                                           |
| `packages/words`          | Plain words shared by the server and the website, so both say exactly the same thing                          |

## Where it runs

PactPal runs on Render, in Virginia, USA.

| Service                | What it does                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Web service (2 copies) | The website, the API, the live chat and the MCP server                                                           |
| Workflows              | Dispute checks, agreement drafts, the dispute councils and the daily clean-up. Each AI model call is its own run |
| Cron jobs              | Start a dispute check every 5 minutes and the [clean-up](privacy.md) every day                                   |
| Postgres               | Deals, the evidence log, files, chat and jobs                                                                    |
| Key Value              | Agent call counts and cached product listings, shared by both copies                                             |
| Static site            | This help site                                                                                                   |

## How a council runs

Each AI council (an agreement draft, a claim comparison, a dispute summary, a reply, an appeal check) is one background task. Every model's call inside it is a run of its own, so the models work side by side, a slow or failing model does not hold up the rest, and a failed call is retried by itself. The council's code then checks every citation, collects the rankings and picks one whole draft ([how the AI drafts](ai-council.md)).

## The rules every change meets

Every change passes one check before it is done: formatting, types, lint, tests with coverage, the build, a duplicate-code check, the architecture rules and a security audit of the packages used. See [engineering standards](engineering-standards.md).
