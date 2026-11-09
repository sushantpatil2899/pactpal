import { describe, expect, it } from "vitest";
import { signInReturn } from "./sign-in-words";

const back = (query: string) => signInReturn(`https://pact-pal.app/${query}`, "/sign-in");

describe("an address the server sent back after a sign-in", () => {
  it("carries nothing when the sign-in finished", () => {
    expect(back("")).toBeUndefined();
    expect(back("?other=1")).toBeUndefined();
  });

  it("gives the message and moves to the sign-in page without the code", () => {
    expect(back("?signin=cancelled")).toEqual({
      problem: "Sign-in was cancelled on PayPal.",
      address: "/sign-in",
    });
    expect(back("?signin=no-email&other=1")).toEqual({
      problem: "PayPal did not share an email address, which PactPal needs.",
      address: "/sign-in?other=1",
    });
  });

  it.each(["unavailable", "expired", "failed", "email-taken", "other-account"])(
    "has a message for %s",
    (code) => {
      expect(back(`?signin=${code}`)?.problem.length).toBeGreaterThan(20);
    },
  );

  it("treats a reason it does not know as a failed sign-in", () => {
    expect(back("?signin=something-new")?.problem).toBe(back("?signin=failed")?.problem);
  });
});
