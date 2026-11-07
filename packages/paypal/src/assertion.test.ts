import { describe, expect, it } from "vitest";
import { authAssertion } from "./assertion.js";

const decode = (part: string | undefined): unknown =>
  JSON.parse(Buffer.from(part ?? "", "base64url").toString("utf8"));

describe("authAssertion", () => {
  it("names the platform app and the seller's payer id in an unsigned token", () => {
    const token = authAssertion("client-id", "SELLER123");
    const [header, payload, signature] = token.split(".");
    expect(decode(header)).toEqual({ alg: "none" });
    expect(decode(payload)).toEqual({ iss: "client-id", payer_id: "SELLER123", sub: "SELLER123" });
    expect(signature).toBe("");
    expect(token).not.toMatch(/[+/=]/);
  });

  it.each([
    ["", "SELLER123"],
    ["client-id", ""],
  ])("refuses an empty client id or payer id (%j, %j)", (clientId, payerId) => {
    expect(() => authAssertion(clientId, payerId)).toThrow(/needs a client id and a payer id/);
  });
});
