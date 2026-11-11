import { describe, expect, it } from "vitest";
import {
  EmailTemplateError,
  SANDBOX_NOTICE,
  brandSchema,
  escapeHtml,
  missingFields,
  parseEmailTemplate,
  renderEmail,
  type Brand,
} from "./index.js";

const brand: Brand = brandSchema.parse({
  productName: "PactPal",
  logoUrl: "https://pactpal.test/brand/logo-email.png",
  colors: Object.fromEntries(
    [
      "background",
      "surface",
      "surfaceSoft",
      "ink",
      "muted",
      "line",
      "button",
      "onButton",
      "ok",
      "okSoft",
      "wait",
      "waitSoft",
      "alert",
      "alertSoft",
      "ai",
      "aiSoft",
      "info",
      "infoSoft",
    ].map((name, n) => [name, `#00000${String(n % 10)}`]),
  ),
  footerLines: ["Saved in the evidence log."],
  links: { help: "https://help.pactpal.test/", privacy: "https://help.pactpal.test/privacy" },
});

/** A layout that shows each part plainly, so tests can see what reached it. */
const layout =
  "[{{tag}}|{{toneColor}}|{{heading}}]{{{body}}}{{#facts}}<{{label}}={{value}}>{{/facts}}{{#button}}({{label}}->{{url}}){{/button}}#{{sandboxNotice}}";

const source = `subject: Delivery for "{{dealTitle}}"
tag: Delivered
tone: ok
button: Open the delivery | {{link}}
fact: Files | {{files}}
fact: Note | {{note}}
---
{{sellerName}} delivered "{{dealTitle}}".
{{#message}}

Message: "{{message}}"
{{/message}}

What is in it:
{{#items}}
- {{.}}
{{/items}}

Open it here:
{{link}}
`;

const view = {
  dealTitle: "Logo <b>bold</b>",
  sellerName: "Maya",
  message: undefined,
  items: ["Sketch", "Final PNG"],
  files: "2 files",
  note: "",
  link: "https://pactpal.test/link#t=abc",
};

describe("email templates (9h)", () => {
  it("fills the plain text exactly, without HTML escaping, and ends with the sandbox notice", () => {
    const email = renderEmail(parseEmailTemplate(source, "t.txt"), layout, brand, view);
    expect(email.subject).toBe('Delivery for "Logo <b>bold</b>"');
    expect(email.text).toBe(
      [
        'Maya delivered "Logo <b>bold</b>".',
        "",
        "What is in it:",
        "- Sketch",
        "- Final PNG",
        "",
        "Open it here:",
        "https://pactpal.test/link#t=abc",
        "",
        SANDBOX_NOTICE,
      ].join("\n"),
    );
    const withMessage = renderEmail(parseEmailTemplate(source, "t.txt"), layout, brand, {
      ...view,
      message: "Enjoy",
    });
    expect(withMessage.text).toContain('delivered "Logo <b>bold</b>".\n\nMessage: "Enjoy"\n\nWhat');
  });

  it("escapes every value in the HTML, lists the items and leaves the button's address to the button", () => {
    const { html } = renderEmail(parseEmailTemplate(source, "t.txt"), layout, brand, view);
    expect(html).not.toContain("<b>bold</b>");
    expect(html).toContain("Logo &lt;b&gt;bold&lt;/b&gt;");
    expect(html).toContain("<li>Sketch</li><li>Final PNG</li>");
    expect(html).toContain(">Open it here.</p>");
    expect(html).toContain("(Open the delivery->https://pactpal.test/link#t=abc)");
    // Empty facts are left out; the tone's colour and the notice reach the layout.
    expect(html).toContain("<Files=2 files>");
    expect(html).not.toContain("<Note=");
    expect(html).toContain(`[Delivered|${brand.colors.ok}|Delivery for`);
    expect(html.endsWith(`#${SANDBOX_NOTICE}`)).toBe(true);
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;",
    );
  });

  it("links addresses inside sentences and drops a button whose address is empty", () => {
    const template = parseEmailTemplate(
      "subject: Hi\ntag: News\ntone: info\nbutton: Pay | {{pay}}\nfooter: tight\n---\nSee https://pactpal.test/a, then reply.\n",
      "t.txt",
    );
    const email = renderEmail(template, layout, brand, { pay: "" });
    expect(email.html).toContain('<a href="https://pactpal.test/a"');
    expect(email.html).not.toContain("(Pay->");
    expect(email.text).toBe(`See https://pactpal.test/a, then reply.\n${SANDBOX_NOTICE}`);
    const none = parseEmailTemplate(
      "subject: Hi\ntag: News\ntone: info\nfooter: none\n---\nBye.",
      "n",
    );
    expect(renderEmail(none, layout, brand, {}).text).toBe("Bye.");
  });

  it("refuses a template file that is broken, before any email is sent", () => {
    const bad = (text: string) => () => parseEmailTemplate(text, "bad.txt");
    expect(bad("subject: Hi\ntag: x\ntone: ok\nBody without a line")).toThrow(/no "---" line/);
    expect(bad("subject: Hi\nsubject: Again\ntag: x\ntone: ok\n---\nBody")).toThrow(/repeated/);
    expect(bad("subject: Hi\ncolour: red\ntag: x\ntone: ok\n---\nBody")).toThrow(/unknown/);
    expect(bad("subject: Hi\ntone: ok\n---\nBody")).toThrow(EmailTemplateError);
    expect(bad("subject: Hi\ntag: x\ntone: ok\n---\n{{#open}}never closed")).toThrow(
      EmailTemplateError,
    );
    expect(bad("subject: Hi\ntag: x\ntone: ok\nfooter: maybe\n---\nBody")).toThrow(
      EmailTemplateError,
    );
  });

  it("refuses to send an email that misses a field its template uses, or names an unknown tone", () => {
    const template = parseEmailTemplate(source, "t.txt");
    const rest = Object.fromEntries(Object.entries(view).filter(([name]) => name !== "link"));
    expect(missingFields(template, rest)).toEqual(["link"]);
    expect(() => renderEmail(template, layout, brand, rest)).toThrow(/missing fields: link/);
    const odd = parseEmailTemplate("subject: Hi\ntag: x\ntone: {{t}}\n---\nBody", "t.txt");
    expect(() => renderEmail(odd, layout, brand, { t: "loud" })).toThrow(/tone "loud"/);
    expect(renderEmail(odd, layout, brand, { t: "ai" }).html).toContain(`|${brand.colors.ai}|`);
  });

  it("checks the brand file's colours and addresses", () => {
    expect(brandSchema.safeParse({ ...brand, logoUrl: "http://x.test/logo.png" }).success).toBe(
      false,
    );
    expect(
      brandSchema.safeParse({ ...brand, colors: { ...brand.colors, ink: "black" } }).success,
    ).toBe(false);
  });
});
