import { describe, expect, it } from "vitest";
import { SANDBOX_API_BASE_URL } from "./credentials.js";

describe("SANDBOX_API_BASE_URL", () => {
  it("points at the PayPal sandbox", () => {
    expect(new URL(SANDBOX_API_BASE_URL).hostname).toBe("api-m.sandbox.paypal.com");
  });
});
