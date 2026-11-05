import { describe, expect, it } from "vitest";
import { intakeExample } from "./IntakePanel";

describe("intake example", () => {
  it("shows a request with the key and this site's address", () => {
    const text = intakeExample("https://pactpal.example", "ppk_abc");
    expect(text).toContain("curl -X POST https://pactpal.example/api/intake/deals");
    expect(text).toContain('-H "Authorization: Bearer ppk_abc"');
  });
});
