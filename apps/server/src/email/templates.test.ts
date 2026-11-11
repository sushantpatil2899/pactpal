import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EmailTemplateError, SANDBOX_NOTICE } from "@pactpal/email";
import { describe, expect, it } from "vitest";
import { EMAIL_LOGO_PATH, buildApp } from "../app.js";
import { loadConfig } from "../config.js";
import { emailFrom, emailLogo, loadEmailTemplates, templatesDir } from "./templates.js";

const loaded = loadConfig({});
if (!loaded.ok) throw new Error("expected empty settings to load");

describe("the repository's email templates (9h)", () => {
  it("all load and pass their checks, with the brand file", () => {
    const templates = loadEmailTemplates();
    expect(templates.brand.productName).toBe("PactPal");
    expect(templates.brand.logoUrl.endsWith(EMAIL_LOGO_PATH)).toBe(true);
    expect([...templates.emails.keys()].sort()).toEqual(
      [
        "approved",
        "buyer-file",
        "change-accepted",
        "change-declined",
        "change-proposed",
        "changes",
        "deal-link",
        "delivery",
        "dispute-changed",
        "dispute-decided",
        "dispute-opened",
        "dispute-reminder",
        "intake-created",
        "invoice",
        "notice",
        "payment",
        "question-answered",
        "question-asked",
        "receipt",
      ].sort(),
    );
    expect(templates.layout).toContain("{{sandboxNotice}}");
    expect(templates.layout).toContain("{{brand.logoUrl}}");
  });

  it("design each email with the logo, its tag and the sandbox notice", () => {
    const { html } = emailFrom("notice", {
      subject: "Chris sent a message",
      tag: "New message",
      tone: "info",
      lines: ["Chris wrote in the deal's chat."],
      linkNote: "Open the deal in PactPal:",
      link: "https://pactpal.test/deals/1",
    });
    expect(html).toContain('src="https://pactpal-server.onrender.com/brand/logo-email.png"');
    expect(html).toContain(">New message</span");
    expect(html).not.toContain("{{");
    expect(html).toContain(SANDBOX_NOTICE);
    expect(html).toContain('href="https://pactpal.test/deals/1"');
    expect(() => emailFrom("nope", {})).toThrow(/No template/);
    expect(() => emailFrom("notice", {})).toThrow(/notice.txt: missing fields/);
  });

  it("refuses a folder with a broken brand file, and says when there is no folder", () => {
    const dir = mkdtempSync(join(tmpdir(), "pactpal-templates-"));
    mkdirSync(join(dir, "emails"));
    writeFileSync(join(dir, "brand.json"), JSON.stringify({ productName: "" }));
    expect(() => loadEmailTemplates(dir)).toThrow(/brand.json: /);
    expect(() => templatesDir(tmpdir())).toThrow(EmailTemplateError);
    expect(templatesDir()).toMatch(/templates$/);
  });

  it("serves the email logo so mail apps can show it", async () => {
    const app = buildApp(loaded.report, { logger: false });
    const answer = await app.inject({ method: "GET", url: EMAIL_LOGO_PATH });
    expect(answer.statusCode).toBe(200);
    expect(answer.headers["content-type"]).toBe("image/png");
    expect(answer.headers["cross-origin-resource-policy"]).toBe("cross-origin");
    expect(answer.rawPayload.equals(emailLogo())).toBe(true);
    await app.close();
  });
});
