import type { ChatMessage } from "@pactpal/ai";
import type { CouncilTask } from "@pactpal/council";

/**
 * A council task for a dispute draft (5f, 5h): the same JSON request to every model, the code
 * check each reply must pass before the vote, and what the voters are shown (exactly the source
 * the answering models saw, and the summary line and criteria approved for the task). Pure.
 */
export function draftCouncilTask<T>(input: {
  messages: ChatMessage[];
  maxTokens: number;
  check: CouncilTask<T>["check"];
  rank: { summary: string; criteria: readonly string[]; source: string };
}): CouncilTask<T> {
  return {
    answerRequest: () => ({
      messages: input.messages,
      maxTokens: input.maxTokens,
      temperature: 0,
      reply: "json",
    }),
    check: input.check,
    rank: { ...input.rank, render: (content) => JSON.stringify(content) },
  };
}
