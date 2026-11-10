import { describe, expect, it } from "vitest";
import { PAGES, REPOSITORY, pageHtml, rewriteLinks } from "./pages.js";

describe("the docs site (9R-4)", () => {
  it("points links at pages, other files at GitHub, and leaves outside links", () => {
    const markdown =
      "[product](product.md#mcp-server-for-agents) [readme](../README.md) " +
      "[env](../.env.example) [site](https://render.com) [here](#top)";
    expect(rewriteLinks(markdown, "docs/decisions.md")).toBe(
      "[product](product.html#mcp-server-for-agents) [readme](index.html) " +
        `[env](${REPOSITORY}.env.example) [site](https://render.com) [here](#top)`,
    );
    expect(rewriteLinks("[plan](docs/build-plan.md)", "README.md")).toBe("[plan](build-plan.html)");
  });

  it("wraps each page with the contents, marking the current one", () => {
    const html = pageHtml({ slug: "scope", title: "Scope <and> more" }, "<p>Body</p>");
    expect(html).toContain("<title>Scope &lt;and&gt; more · PactPal docs</title>");
    expect(html).toContain('<a href="scope.html" aria-current="page">Scope</a>');
    expect(html).toContain("<main><p>Body</p></main>");
    expect(new Set(PAGES.map((p) => p.slug)).size).toBe(PAGES.length);
  });
});
