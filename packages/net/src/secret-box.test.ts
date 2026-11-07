import { describe, expect, it } from "vitest";
import { Secret } from "./secret.js";
import { SecretBox, SecretBoxKeyError } from "./secret-box.js";

const KEY = Buffer.alloc(32, 7);
const OTHER_KEY = Buffer.alloc(32, 8);
const box = new SecretBox(KEY);
const CONTEXT = "connection-1:client-a";

describe("SecretBox", () => {
  it("opens what it sealed, and the sealed text does not contain the secret", () => {
    const sealed = box.seal(new Secret("app-secret-value"), CONTEXT);
    expect(sealed).toMatch(/^v1\.[\w-]+\.[\w-]+\.[\w-]+$/);
    expect(sealed).not.toContain("app-secret-value");
    expect(box.open(sealed, CONTEXT)?.reveal()).toBe("app-secret-value");
  });

  it("uses a fresh random start for each value, so the same secret seals differently", () => {
    const secret = new Secret("same");
    expect(box.seal(secret, CONTEXT)).not.toBe(box.seal(secret, CONTEXT));
  });

  it("uses the injected randomness", () => {
    const fixed = new SecretBox(KEY, (bytes) => Buffer.alloc(bytes, 1));
    const secret = new Secret("same");
    expect(fixed.seal(secret, CONTEXT)).toBe(fixed.seal(secret, CONTEXT));
  });

  it("refuses another key, another context, and any change to the value", () => {
    const sealed = box.seal(new Secret("app-secret-value"), CONTEXT);
    expect(new SecretBox(OTHER_KEY).open(sealed, CONTEXT)).toBeUndefined();
    expect(box.open(sealed, "connection-2:client-a")).toBeUndefined();
    const parts = sealed.split(".");
    const data = parts[3] ?? "";
    const flipped = `${data.startsWith("A") ? "B" : "A"}${data.slice(1)}`;
    expect(box.open([...parts.slice(0, 3), flipped].join("."), CONTEXT)).toBeUndefined();
  });

  it.each([
    ["an empty value", ""],
    ["another version", "v2.a.b.c"],
    ["too few parts", "v1.a.b"],
    ["a short start value", "v1.AAAA.AAAAAAAAAAAAAAAAAAAAAA.AAAA"],
    ["a short check value", "v1.AAAAAAAAAAAAAAAA.AAAA.AAAA"],
  ])("refuses %s", (_label, sealed) => {
    expect(box.open(sealed, CONTEXT)).toBeUndefined();
  });

  it("refuses a key of the wrong size", () => {
    expect(() => new SecretBox(Buffer.alloc(16))).toThrow(SecretBoxKeyError);
  });
});
