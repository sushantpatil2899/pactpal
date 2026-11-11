# How the AI drafts

Agreements, claim comparisons, dispute summaries, replies and appeal statements are drafted by a **council** of five AI models from five different families, not by one.

## Five steps

1. **Each model drafts on its own.** Every model reads the chat and drafts the whole answer separately, citing a chat line (or a log entry) for every term.
2. **Code checks every citation.** Before any vote, code checks each citation against the source. A draft that points at a line that is not there is thrown out.
3. **Names hidden, every model ranks.** The drafts that pass are shown without their authors, and every model ranks the others. A model's vote for its own draft is ignored.
4. **One whole draft wins.** A Borda count picks a single draft from start to finish. Drafts are never stitched together.
5. **Disagreement comes to you.** When the rankings disagree, the draft is flagged for your review.

Each model's call runs as its own task, so one slow or failing model does not stop the others. On every draft you can open the council's record: which models answered, which were thrown out and why, the votes and how much they agreed.

## What the AI never does

- It never invents a term. Anything the chat does not say stays blank and is marked missing.
- It never creates evidence, times, approvals or statements. Only what really happened is recorded.
- It treats what buyers write as information, never as instructions. Lines in a chat that try to give the AI orders are hidden from it.
- It sends nothing by itself. You confirm every agreement, invoice, message and piece of evidence before it goes to your buyer or to PayPal.
