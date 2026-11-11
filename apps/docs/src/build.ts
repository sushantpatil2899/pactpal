/**
 * Builds the docs site (9R-4): each document in `PAGES` as an HTML page in `dist/`, with one
 * stylesheet. Render serves `dist/` as a Static Site and builds it again on every push.
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { marked } from "marked";
import { PAGES, pageHtml, rewriteLinks } from "./pages.js";

const root = new URL("../../../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const page of PAGES) {
  const markdown = readFileSync(new URL(page.file, root), "utf8");
  const body = await marked.parse(rewriteLinks(markdown, page.file), { gfm: true });
  writeFileSync(new URL(`${page.slug}.html`, dist), pageHtml(page, body));
}
copyFileSync(new URL("site.css", import.meta.url), new URL("site.css", dist));
process.stdout.write(`Docs site built: ${String(PAGES.length)} pages\n`);
