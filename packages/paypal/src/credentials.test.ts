import { inspect } from "node:util";
import { describe, expect, it } from "vitest";
import { SANDBOX_API_BASE_URL, Secret } from "./credentials.js";

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

describe("SANDBOX_API_BASE_URL", () => {
  it("points at the PayPal sandbox", () => {
    expect(new URL(SANDBOX_API_BASE_URL).hostname).toBe("api-m.sandbox.paypal.com");
  });
});
