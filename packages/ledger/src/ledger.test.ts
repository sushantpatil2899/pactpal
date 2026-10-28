import { describe, expect, it } from "vitest";
import {
  appendEvent,
  canonicalJson,
  GENESIS_HASH,
  hashFile,
  verifyChain,
  verifyFile,
  type LedgerEntry,
  type NewEvent,
} from "./index.js";

const t0 = new Date("2026-10-02T10:00:00.000Z");

function buildChain(events: Omit<NewEvent, "dealId">[], dealId = "deal-1"): LedgerEntry[] {
  const chain: LedgerEntry[] = [];
  events.forEach((e, i) => {
    chain.push(appendEvent(chain, { ...e, dealId }, new Date(t0.getTime() + i * 60_000)));
  });
  return chain;
}

const sampleEvents: Omit<NewEvent, "dealId">[] = [
  { type: "SOURCE_ADDED", actor: "seller", payload: { sourceHash: "abc", kind: "paste" } },
  { type: "SCOPE_CONFIRMED", actor: "seller", payload: { scopeHash: "def", version: 1 } },
  {
    type: "ACCEPTED",
    actor: "buyer",
    payload: { typedName: "Chris Doe", pageVersionHash: "ghi" },
    ip: "203.0.113.7",
    userAgent: "Mozilla/5.0",
  },
  { type: "DELIVERY_DOWNLOADED", actor: "buyer", payload: { fileSha256: "jkl" } },
];

describe("canonicalJson", () => {
  it("is independent of key order", () => {
    expect(canonicalJson({ b: 1, a: { d: [1, 2], c: "x" } })).toBe(
      canonicalJson({ a: { c: "x", d: [1, 2] }, b: 1 }),
    );
  });

  it("drops undefined keys and rejects non-finite numbers", () => {
    expect(canonicalJson({ a: 1, b: undefined })).toBe('{"a":1}');
    expect(() => canonicalJson({ a: Number.NaN })).toThrow();
  });

  it("encodes booleans and rejects values JSON cannot represent", () => {
    expect(canonicalJson([true, false, null])).toBe("[true,false,null]");
    expect(() => canonicalJson({ a: () => 1 })).toThrow(/function/);
    expect(() => canonicalJson({ a: 1n })).toThrow(/bigint/);
  });
});

describe("appendEvent", () => {
  it("links each entry to the previous one", () => {
    const chain = buildChain(sampleEvents);
    expect(chain[0]!.prevHash).toBe(GENESIS_HASH);
    expect(chain[0]!.seq).toBe(0);
    for (let i = 1; i < chain.length; i++) {
      expect(chain[i]!.prevHash).toBe(chain[i - 1]!.entryHash);
      expect(chain[i]!.seq).toBe(i);
    }
  });

  it("uses the server time it is given", () => {
    const chain = buildChain(sampleEvents);
    expect(chain[2]!.serverTime).toBe("2026-10-02T10:02:00.000Z");
  });

  it("refuses to mix deals in one chain", () => {
    const chain = buildChain(sampleEvents);
    expect(() =>
      appendEvent(chain, { dealId: "deal-2", type: "NOTE_ADDED", actor: "system", payload: {} }),
    ).toThrow(/deal-2/);
  });
});

describe("verifyChain", () => {
  it("accepts an untouched chain and returns its head", () => {
    const chain = buildChain(sampleEvents);
    const result = verifyChain(chain);
    expect(result).toEqual({ valid: true, head: chain[3]!.entryHash, length: 4 });
  });

  it("accepts an empty chain", () => {
    expect(verifyChain([])).toEqual({ valid: true, head: GENESIS_HASH, length: 0 });
  });

  it("detects an edited payload and names the entry", () => {
    const chain = buildChain(sampleEvents);
    const tampered = chain.map((e) => ({ ...e }));
    tampered[2] = {
      ...tampered[2]!,
      payload: { typedName: "Someone Else", pageVersionHash: "ghi" },
    };
    expect(verifyChain(tampered)).toEqual({
      valid: false,
      brokenAt: 2,
      reason: "payload does not match payloadHash",
    });
  });

  it("detects a backdated timestamp even if the payload is untouched", () => {
    const chain = buildChain(sampleEvents);
    const tampered = chain.map((e) => ({ ...e }));
    tampered[1] = { ...tampered[1]!, serverTime: "2026-09-01T00:00:00.000Z" };
    const result = verifyChain(tampered);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.brokenAt).toBe(1);
  });

  it("detects a recomputed entry because the next link breaks", () => {
    const chain = buildChain(sampleEvents);
    // Rewrite entry 1 as if it were appended fresh with different content.
    const forged = appendEvent(
      chain.slice(0, 1),
      {
        dealId: "deal-1",
        type: "SCOPE_CONFIRMED",
        actor: "seller",
        payload: { scopeHash: "zzz", version: 1 },
      },
      new Date(t0.getTime() + 60_000),
    );
    const tampered = [chain[0]!, forged, chain[2]!, chain[3]!];
    const result = verifyChain(tampered);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.brokenAt).toBe(2);
      expect(result.reason).toMatch(/prevHash/);
    }
  });

  it("detects an entry spliced in from another deal", () => {
    const chain = buildChain(sampleEvents);
    const other = buildChain(sampleEvents, "deal-2");
    const result = verifyChain([chain[0]!, other[1]!]);
    expect(result).toEqual({
      valid: false,
      brokenAt: 1,
      reason: "entry belongs to a different deal",
    });
  });

  it("detects a deleted entry", () => {
    const chain = buildChain(sampleEvents);
    const result = verifyChain([chain[0]!, chain[2]!, chain[3]!]);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.brokenAt).toBe(1);
  });
});

describe("file fingerprints", () => {
  const bytes = new TextEncoder().encode("final artwork bytes");

  it("verifies the exact same file", () => {
    const fp = hashFile(bytes, "final.png");
    expect(fp.size).toBe(bytes.byteLength);
    expect(fp.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(verifyFile(bytes, fp)).toBe(true);
  });

  it("rejects a file changed by a single byte", () => {
    const fp = hashFile(bytes, "final.png");
    const changed = bytes.slice();
    changed[0] = changed[0]! ^ 1;
    expect(verifyFile(changed, fp)).toBe(false);
  });
});
