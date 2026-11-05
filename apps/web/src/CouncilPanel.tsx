import type { CouncilView } from "./api";
import { agreementWords, seconds } from "./format";
import { NO_WRAP, SCROLL_X } from "./styles";

const RESULT_WORDS: Record<CouncilView["answers"][number]["status"], string> = {
  valid: "a valid draft",
  invalid: "rejected",
  call_failed: "did not answer",
};

const VOTE_WORDS: Record<CouncilView["votes"][number]["status"], string> = {
  ballot: "ranked the drafts",
  call_failed: "no ranking (did not answer)",
  unreadable: "no ranking (reply not readable)",
  not_asked: "not asked",
};

/**
 * How the models worked on a draft: each model's result, how they ranked the drafts, which draft
 * won and how closely they agreed. It shows how the models voted, not that the result is correct.
 * Which model wrote which draft is shown here, after the voting.
 */
/** A note above a council's draft when the models did not agree well. */
export function ReviewFlag({ council }: { council: CouncilView | null }) {
  if (council?.needsReview !== true) return null;
  return (
    <p role="note">
      <strong>Flagged for review:</strong> the models did not agree well. Read every line.
    </p>
  );
}

export function CouncilPanel({ council }: { council: CouncilView }) {
  const winner = council.scores[0];
  const tokens = council.usage.promptTokens + council.usage.completionTokens;
  return (
    <section aria-labelledby="council-heading">
      <h4 id="council-heading">How the council worked</h4>
      <div style={SCROLL_X}>
        <table>
          <caption>Each model&apos;s draft</caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col">Result</th>
              <th scope="col" style={NO_WRAP}>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {council.answers.map((answer) => (
              <tr key={answer.modelName}>
                <th scope="row">{answer.modelName}</th>
                <td>
                  {RESULT_WORDS[answer.status]}
                  {answer.errors.length > 0 && `: ${answer.errors.join("; ")}`}
                </td>
                <td style={NO_WRAP}>
                  {answer.latencyMs === undefined ? "—" : seconds(answer.latencyMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {council.scores.length > 0 && (
        <div style={SCROLL_X}>
          <table>
            <caption>How the valid drafts were ranked</caption>
            <thead>
              <tr>
                <th scope="col">Draft</th>
                <th scope="col">By</th>
                <th scope="col">Score</th>
                <th scope="col">Counted</th>
              </tr>
            </thead>
            <tbody>
              {council.scores.map((score) => (
                <tr key={score.label}>
                  <th scope="row">{score.label}</th>
                  <td>{score.modelName}</td>
                  <td>
                    {score.score.toFixed(2)}
                    {score.label === winner?.label && " (chosen)"}
                  </td>
                  <td>{score.votes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {council.scores.length > 0 && (
        <p style={{ color: "#555", fontSize: 14 }}>
          Score: 1 means every counted model ranked that draft first, 0 last. Counted: how many
          models&apos; rankings were used (a model&apos;s ranking of its own draft is ignored).
        </p>
      )}
      {council.votes.length > 0 && (
        <ul aria-label="Rankings">
          {council.votes.map((vote) => (
            <li key={vote.voter}>
              {vote.voter}: {VOTE_WORDS[vote.status]}
              {vote.reason !== undefined && ` (${vote.reason})`}
            </li>
          ))}
        </ul>
      )}
      {council.rejectedBallots.length > 0 && (
        <p>
          Rankings that could not be used:{" "}
          {council.rejectedBallots.map((b) => `${b.voter} (${b.reason})`).join("; ")}.
        </p>
      )}
      {council.scores.length > 1 && (
        <p>
          Agreement between the models: {agreementWords(council.agreement)} (
          {council.agreement.toFixed(2)} out of 1).
        </p>
      )}
      <p>
        {seconds(council.durationMs)}, {council.usage.calls} model calls, about {tokens} tokens
        {council.usage.callsWithoutUsage > 0 &&
          ` (${String(council.usage.callsWithoutUsage)} ${council.usage.callsWithoutUsage === 1 ? "call" : "calls"} did not report tokens)`}
        .
      </p>
    </section>
  );
}
