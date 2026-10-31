import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import { Secret } from "./secret.js";

describe("Secret", () => {
  const secret = new Secret("s3cr3t-value");

  it("returns the value only through reveal()", () => {
    expect(secret.reveal()).toBe("s3cr3t-value");
  });

  it("hides the value when printed, serialized or inspected", () => {
    expect(String(secret)).toBe("[redacted]");
    expect(`${String(secret)}!`).toBe("[redacted]!");
    expect(JSON.stringify({ clientSecret: secret })).toBe('{"clientSecret":"[redacted]"}');
    expect(inspect({ clientSecret: secret })).not.toContain("s3cr3t-value");
  });
});
