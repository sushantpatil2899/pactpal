import { AGENT_RUN } from "../landing-words";

export type Gate = "closed" | "waiting" | "open" | "refused";

const SEND = AGENT_RUN.findIndex((step) => step.kind === "send");
const BUILD = AGENT_RUN.findIndex((step) => step.kind === "build");

/**
 * What the agent scene shows once `done` calls have been answered: the gate (shut, waiting for
 * the seller, open after the code, or flashing at a tool that does not exist), whether the
 * evidence packet stands by the gate, and whether it has reached PayPal and been sealed. Pure.
 */
export function sceneOf(done: number, waiting: boolean) {
  const last = AGENT_RUN[done - 1]?.kind;
  const gate: Gate = waiting
    ? "waiting"
    : last === "send"
      ? "open"
      : last === "refused"
        ? "refused"
        : "closed";
  const sent = SEND !== -1 && done > SEND;
  return { gate, packet: BUILD !== -1 && done > BUILD && !sent, sent };
}
