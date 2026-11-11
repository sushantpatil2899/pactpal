import { describe, expect, it } from "vitest";
import { AGENT_RUN } from "../landing-words";
import { sceneOf } from "./agent-scene";

const at = (kind: string) => AGENT_RUN.findIndex((step) => step.kind === kind);

describe("the agent scene", () => {
  it("keeps the gate shut while the agent only reads", () => {
    expect(sceneOf(0, false)).toEqual({ gate: "closed", packet: false, sent: false });
    expect(sceneOf(at("build"), false)).toEqual({ gate: "closed", packet: false, sent: false });
  });

  it("stands the packet by the gate once built, and waits for the seller at the request", () => {
    expect(sceneOf(at("build") + 1, false).packet).toBe(true);
    expect(sceneOf(at("gate"), true)).toEqual({ gate: "waiting", packet: true, sent: false });
  });

  it("opens only after the code, sends the packet and seals it", () => {
    expect(sceneOf(at("send") + 1, false)).toEqual({ gate: "open", packet: false, sent: true });
  });

  it("flashes the gate at a tool that does not exist", () => {
    expect(sceneOf(at("refused") + 1, false).gate).toBe("refused");
    expect(AGENT_RUN.at(-1)?.kind).toBe("refused");
  });
});
