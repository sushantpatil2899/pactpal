/**
 * Builds the help site: each page in `PAGES` as HTML in `dist/`, in the website's look (its
 * tokens, its fonts, its mark). Render serves `dist/` as a Static Site and builds it again on
 * every push. A page that breaks the wording rules, or links outside the help pages, stops the
 * build.
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { markSvg, tokenCss } from "@pactpal/brand";
import { marked } from "marked";
import { PAGES, pageHtml, rewriteLinks, wordingProblems } from "./pages.js";

const root = new URL("../../../", import.meta.url);
const dist = new URL("../dist/", import.meta.url);
/** The website's address; set `PACTPAL_SITE_URL` where the site lives elsewhere. */
const home = (process.env.PACTPAL_SITE_URL ?? "https://pactpal-server.onrender.com").replace(
  /\/$/,
  "",
);

/** The website's fonts, copied from their packages: Geist, Geist Mono and Instrument Serif. */
const FONTS = [
  [
    "@fontsource-variable/geist",
    "geist-latin-wght-normal.woff2",
    "Geist Variable",
    "100 900",
    "normal",
  ],
  [
    "@fontsource-variable/geist-mono",
    "geist-mono-latin-wght-normal.woff2",
    "Geist Mono Variable",
    "100 900",
    "normal",
  ],
  [
    "@fontsource/instrument-serif",
    "instrument-serif-latin-400-normal.woff2",
    "Instrument Serif",
    "400",
    "normal",
  ],
  [
    "@fontsource/instrument-serif",
    "instrument-serif-latin-400-italic.woff2",
    "Instrument Serif",
    "400",
    "italic",
  ],
] as const;

rmSync(dist, { recursive: true, force: true });
mkdirSync(new URL("fonts/", dist), { recursive: true });

const faces = FONTS.map(([pkg, file, family, weight, style]) => {
  const from = fileURLToPath(import.meta.resolve(`${pkg}/files/${file}`));
  copyFileSync(from, new URL(`fonts/${file}`, dist));
  return `@font-face{font-family:"${family}";font-style:${style};font-weight:${weight};font-display:swap;src:url(fonts/${file}) format("woff2")}`;
}).join("");

const problems: string[] = [];
for (const page of PAGES) {
  const markdown = readFileSync(new URL(page.file, root), "utf8");
  for (const why of wordingProblems(markdown, page.quotesRules))
    problems.push(`${page.file}: ${why}`);
  const body = await marked.parse(rewriteLinks(markdown, page.file), { gfm: true });
  writeFileSync(new URL(`${page.slug}.html`, dist), pageHtml(page, body, { home }));
}
if (problems.length > 0)
  throw new Error(`Help pages break the wording rules:\n${problems.join("\n")}`);

const css = readFileSync(new URL("site.css", import.meta.url), "utf8");
writeFileSync(new URL("site.css", dist), `${faces}\n${tokenCss()}\n${css}`);
copyFileSync(new URL("site.js", import.meta.url), new URL("site.js", dist));
// Diagrams are drawn in the browser, only on the pages that have one.
copyFileSync(
  fileURLToPath(import.meta.resolve("mermaid/dist/mermaid.min.js")),
  new URL("mermaid.min.js", dist),
);
writeFileSync(
  new URL("mark.svg", dist),
  markSvg("m").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '),
);
process.stdout.write(`Help site built: ${String(PAGES.length)} pages\n`);
