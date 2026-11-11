import { useEffect, useState } from "react";
import { answerAgentRequest, getAgentRequests, type AgentRequestView } from "./api";
import { when } from "./format";

/**
 * What the seller's agent asks to do on this deal (8c): each request in full words, to approve
 * or decline. Approving shows the one-time code (once) for the seller to give their agent; the
 * agent can act only with it, within 10 minutes. Shown to the seller only; `refreshKey` changes
 * when a notification arrives, so the list is read again.
 */
export function AgentRequestsPanel({ dealId, refreshKey }: { dealId: string; refreshKey: number }) {
  const [requests, setRequests] = useState<AgentRequestView[]>([]);
  const [code, setCode] = useState<{ id: string; code: string; expiresAt: string | null }>();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | undefined>();

  useEffect(() => {
    getAgentRequests(dealId).then(setRequests, () => undefined);
  }, [dealId, refreshKey]);
  if (requests.length === 0 && code === undefined) return null;

  const answer = (request: AgentRequestView, choice: "approve" | "decline") => {
    setBusy(true);
    setProblem(undefined);
    answerAgentRequest(request.id, choice).then(
      (answered) => {
        setBusy(false);
        setRequests((all) => all.filter((r) => r.id !== request.id));
        if (answered.code !== undefined) {
          setCode({
            id: request.id,
            code: answered.code,
            expiresAt: answered.request.codeExpiresAt,
          });
        }
      },
      (error: unknown) => {
        setBusy(false);
        setProblem(error instanceof Error ? error.message : "Something went wrong.");
      },
    );
  };

  return (
    <section aria-labelledby="agent-requests" className="pp-agent-asks">
      <h3 id="agent-requests">Your agent is asking</h3>
      {problem && (
        <p role="alert" data-tone="problem">
          {problem}
        </p>
      )}
      {code && (
        <p role="status">
          Approved. Give your agent this one-time code: <strong>{code.code}</strong>
          {code.expiresAt === null ? "" : ` (works once, until ${when(code.expiresAt)})`}.
        </p>
      )}
      <ul>
        {requests
          .filter((request) => request.status === "waiting")
          .map((request) => (
            <li key={request.id}>
              <p>{request.summary}</p>
              <p>
                <small>
                  From your agent key ending …{request.keyEnding}, {when(request.createdAt)}.
                  Nothing is sent until you approve and your agent uses the code.
                </small>
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  answer(request, "approve");
                }}
              >
                Approve
              </button>{" "}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  answer(request, "decline");
                }}
              >
                Decline
              </button>
            </li>
          ))}
      </ul>
    </section>
  );
}
