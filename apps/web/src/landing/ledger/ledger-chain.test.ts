import { describe, expect, it } from "vitest";
import { GENESIS, checkChain, sealChain, sha256, shortHash, type DemoEntry } from "./ledger-chain";

const entry = (text: string): DemoEntry => ({
  type: "STEP_DONE",
  actor: "buyer",
  at: "2026-11-02",
  text,
});

describe("the landing page's evidence log", () => {
  it("hashes with SHA-256", async () => {
    expect(await sha256("abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("chains each hash to the one before it", async () => {
    const [first, second] = await sealChain([entry("a"), entry("b")]);
    expect(first).toBe(await sha256(`${GENESIS}|STEP_DONE|buyer|2026-11-02|a`));
    expect(second).toBe(await sha256(`${first ?? ""}|STEP_DONE|buyer|2026-11-02|b`));
  });

  it("changes every hash from an edited entry on", async () => {
    const entries = [entry("a"), entry("b"), entry("c")];
    const recorded = await sealChain(entries);
    const now = await sealChain([...entries.slice(0, 1), entry("B"), ...entries.slice(2)]);
    expect(now[0]).toBe(recorded[0]);
    expect(now[1]).not.toBe(recorded[1]);
    expect(now[2]).not.toBe(recorded[2]);
  });

  it("finds the first entry that no longer matches", () => {
    expect(checkChain(["x", "y", "z"], ["x", "y", "z"])).toEqual(["sealed", "sealed", "sealed"]);
    expect(checkChain(["x", "y", "z"], ["x", "Y", "Z"])).toEqual(["sealed", "changed", "after"]);
  });

  it("shortens a hash the way the app shows it", () => {
    expect(shortHash("9f2c00000000a71e")).toBe("9f2c…a71e");
  });
});
