import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  GROUPS,
  PAGES,
  anchorOf,
  introOf,
  pageHtml,
  rewriteLinks,
  withAnchors,
  wordingProblems,
} from "./pages.js";

const root = new URL("../../../", import.meta.url);
const site = { home: "https://pactpal.example" };

describe("the help site", () => {
  it("publishes every page in a known section, once each, starting with the home page", () => {
    expect(PAGES[0]?.slug).toBe("index");
    expect(new Set(PAGES.map((p) => p.slug)).size).toBe(PAGES.length);
    for (const page of PAGES) expect(GROUPS).toContain(page.group);
    expect(PAGES.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["privacy", "ai-agents", "ai-council", "architecture", "product"]),
    );
  });

  it("keeps the wording rules on every published page, as written today", () => {
    for (const page of PAGES) {
      const markdown = readFileSync(new URL(page.file, root), "utf8");
      expect([page.file, wordingProblems(markdown, page.quotesRules)]).toEqual([page.file, []]);
    }
  });

  it("names what breaks the rules, letting only the rule documents quote the honesty words", () => {
    expect(wordingProblems("It runs on the PayPal sandbox for the hackathon demo.")).toEqual([
      "no event talk on the public site",
      'say "test mode", never the sandbox',
      "no demo talk on the public site",
    ]);
    expect(wordingProblems("Never call it legally binding.")).toHaveLength(1);
    expect(wordingProblems("Never call it legally binding.", true)).toEqual([]);
    expect(wordingProblems("See https://github.com/x/y", true)).toEqual(["no repository links"]);
  });

  it("points links at published pages and drops links into the rest of the repository", () => {
    const markdown =
      "[spec](../product.md#guardrails) [log](evidence-log.md) [plan](../build-plan.md) " +
      "[env](../../.env.example) [site](https://render.com) [mail](mailto:a@b.c) [here](#top)";
    expect(rewriteLinks(markdown, "docs/help/index.md")).toBe(
      "[spec](product.html#guardrails) [log](evidence-log.html) plan env " +
        "[site](https://render.com) [mail](mailto:a@b.c) [here](#top)",
    );
    expect(rewriteLinks("[help](help/privacy.md)", "docs/scope.md")).toBe("[help](privacy.html)");
  });

  it("anchors each section heading and lists them", () => {
    expect(anchorOf("1. Sign in with <code>PayPal</code>")).toBe("sign-in-with-paypal");
    const { html, toc } = withAnchors("<h2>What you see</h2><p>x</p><h2>Answer</h2>");
    expect(toc).toEqual([
      { id: "what-you-see", text: "What you see" },
      { id: "answer", text: "Answer" },
    ]);
    expect(html).toContain('<h2 id="answer">');
  });

  it("takes the home page's hero from its first heading and opening words", () => {
    expect(introOf("<h1>Help</h1>\n<p>Hi</p>\n<h2>Start</h2>")).toEqual({
      title: "Help",
      lede: "<p>Hi</p>",
    });
  });

  it("wraps a page with the contents by section, marking the current one, in the site's look", () => {
    const page = PAGES.find((p) => p.slug === "disputes");
    if (!page) throw new Error("expected the disputes page");
    const html = pageHtml(page, "<h1>When a buyer disputes</h1><h2>One</h2><h2>Two</h2>", site);
    expect(html).toContain("<title>When a buyer disputes · PactPal help</title>");
    expect(html).toContain('<a href="disputes.html" aria-current="page">');
    expect(html).toContain('<p class="side-group">Under the hood</p>');
    expect(html).toContain('href="https://pactpal.example/auth/paypal/start"');
    expect(html).toContain('<aside class="toc"');
    expect(html).toContain('rel="prev"');
    expect(html).not.toMatch(/github\.com/);
    const home = pageHtml(PAGES[0] ?? page, "<h1>PactPal help</h1><p>Hi</p><h2>x</h2>", site);
    expect(home).toContain('class="hero"');
    expect(home).toContain('class="card"');
  });
});
