# Connect your AI agent

PactPal is also an MCP server, so an AI assistant you already use (Claude Code, Claude Desktop, Cursor or any other MCP client) can work with your deals for you. It can read your deals and disputes, create draft deals and build evidence packets. It cannot send anything to PayPal without you.

## 1. Make an agent key

Open **Settings → Connect your AI agent** and choose **Make an agent key**. The key is shown once: copy it then. Making a new key turns the old one off, and **Turn off** stops it at once.

Keep the key secret. Anyone with it can read your deals and create drafts.

## 2. Add PactPal to your assistant

**Claude Code**: run, with your site's address and your key:

```bash
claude mcp add --transport http pactpal https://<your PactPal address>/mcp --header "Authorization: Bearer ppk_..."
```

**Claude Desktop, Cursor and other clients**: add a remote MCP server with the address `https://<your PactPal address>/mcp` and the header `Authorization: Bearer ppk_...`.

**To try it by hand**: run `npx @modelcontextprotocol/inspector` and connect with "Streamable HTTP" to the same address and header.

Settings shows the exact command with your address filled in.

## What your agent can do

| Tool                                            | What it does                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------- |
| `list_deals`, `get_deal`                        | Your deals: terms, timeline progress, records score, payment stages           |
| `list_disputes`, `get_dispute`                  | Disputes with reason, amount, deadline, what PayPal allows and drafted notes  |
| `create_deal_from_text`                         | A draft deal from pasted text, such as a chat with a buyer (30 a day per key) |
| `draft_evidence_packet`                         | Builds an evidence packet for a dispute; nothing goes to PayPal               |
| `lookup_listing`                                | Reads a product listing page; you add it to the agreement yourself            |
| `request_send_invoice`, `request_send_evidence` | Asks you to send an invoice or evidence; the request waits for you in PactPal |
| `confirm_action`                                | Carries out a request you approved, with the one-time code you give it        |
| `get_request`                                   | Where a request stands: waiting, approved, declined, done or failed           |

## Nothing is sent without you

When your agent asks to send an invoice or evidence to PayPal, the request waits on the deal with its exact wording. Approve it there and PactPal shows a one-time code (valid for 10 minutes, once). Only when you give your agent that code can it carry the request out.

Your agent acts for you only. There is no tool to sign, accept an agreement, act for a buyer, make offers, send messages or appeal. Whatever buyers wrote reaches your agent marked as information, never as instructions.

## On the record

Every request, answer and action your agent takes is written to the deal's [evidence log](evidence-log.md), with the last four characters of its key. Each key may make up to 60 calls a minute.
