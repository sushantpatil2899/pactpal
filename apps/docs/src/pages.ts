import { markSvg } from "@pactpal/brand";

/** The help site's sections, in the order its contents list them. */
export const GROUPS = ["Start here", "Your deals", "The AI", "Trust", "Under the hood"] as const;
export type Group = (typeof GROUPS)[number];

export interface Page {
  /** The Markdown file, from the repository's root. */
  file: string;
  slug: string;
  title: string;
  /** One line about the page, for its card and its description. */
  about: string;
  group: Group;
  /**
   * Rules a page may name because it states them ("never call it legally binding"): only the
   * documents that set the rules themselves.
   */
  quotesRules?: boolean;
}

const help = (
  slug: string,
  title: string,
  about: string,
  group: Group,
  file = `docs/help/${slug}.md`,
): Page => ({ file, slug, title, about, group });

/**
 * The pages the help site publishes, in reading order. Only these: the project's working
 * documents (decisions, plans, notes) stay in the repository and are not published.
 */
export const PAGES: readonly Page[] = [
  help("index", "PactPal help", "What PactPal does and where to start", "Start here"),
  help(
    "getting-started",
    "Getting started",
    "Sign in, link your PayPal app, make a deal",
    "Start here",
  ),
  help("buyers", "For your buyer", "What your buyer sees, with no account", "Start here"),
  help(
    "agreements",
    "Agreements and the timeline",
    "From the chat to a signed agreement",
    "Your deals",
  ),
  help("chat", "Chat, Messages and reminders", "Every conversation in one place", "Your deals"),
  help("payments", "Getting paid through PayPal", "An invoice for each agreed stage", "Your deals"),
  help("deliveries", "Delivering work", "Tracked files, approvals and revisions", "Your deals"),
  help("evidence-log", "The evidence log", "What is recorded and how to check it", "Your deals"),
  help("disputes", "When a buyer disputes", "Deadlines, the record and your answer", "Your deals"),
  help("ai-council", "How the AI drafts", "Five models draft and check each other", "The AI"),
  help(
    "ai-agents",
    "Connect your AI agent",
    "Let Claude, Cursor or another assistant work your deals",
    "The AI",
  ),
  help(
    "limits",
    "What PactPal is and is not",
    "Not escrow, not legal advice, no predictions",
    "Trust",
  ),
  help("privacy", "Privacy", "What is kept, for how long, and who sees it", "Trust"),
  help(
    "architecture",
    "How PactPal is built",
    "The code base, the services and how a council runs",
    "Under the hood",
  ),
  help(
    "diagrams",
    "PactPal in diagrams",
    "The deal, the AI, disputes and the services, drawn",
    "Under the hood",
  ),
  {
    ...help(
      "product",
      "Product spec",
      "The flow, AI roles, ledger, packet and screens",
      "Under the hood",
      "docs/product.md",
    ),
    quotesRules: true,
  },
  {
    ...help(
      "scope",
      "Scope",
      "What PactPal does and does not do, and why",
      "Under the hood",
      "docs/scope.md",
    ),
    quotesRules: true,
  },
  help(
    "data-model",
    "Data model",
    "Tables, the evidence log and fingerprints",
    "Under the hood",
    "docs/data-model.md",
  ),
  {
    ...help(
      "design",
      "Design system",
      "Colours, type, layout and words",
      "Under the hood",
      "docs/DESIGN.md",
    ),
    quotesRules: true,
  },
  help(
    "engineering-standards",
    "Engineering standards",
    "The bar every change meets",
    "Under the hood",
    "docs/engineering-standards.md",
  ),
];

/**
 * Words the public pages never use: the honesty rules (no outcome promises, nothing called
 * binding or proof for court) and the site's own rules (no event or test-environment talk).
 */
const HONESTY: readonly [RegExp, string][] = [
  [/legally binding/i, "never call an agreement legally binding"],
  [/court[- ]proof/i, "never call the record court proof"],
  [/\bguarantee(s|d)?\b/i, "never guarantee anything"],
  [/\bwill win\b|\bwin rate\b|\bwin probabilit/i, "never predict an outcome"],
];
const SITE: readonly [RegExp, string][] = [
  [/hackathon|devpost|\bjudg(e|es|ing)\b/i, "no event talk on the public site"],
  [/sandbox/i, 'say "test mode", never the sandbox'],
  [/\bdemo\b/i, "no demo talk on the public site"],
  [/github\.com/i, "no repository links"],
];

/**
 * What a page's words break, as reasons; empty when it keeps every rule. A page that states the
 * honesty rules may name the words they forbid. Pure.
 */
export function wordingProblems(markdown: string, quotesRules = false): string[] {
  const rules = quotesRules ? SITE : [...HONESTY, ...SITE];
  return rules.filter(([pattern]) => pattern.test(markdown)).map(([, why]) => why);
}

/** A repository path ("docs/x.md", "../README.md" from docs/) made plain ("docs/x.md", "README.md"). */
function resolve(from: string, target: string): string {
  const parts = from.split("/").slice(0, -1);
  for (const piece of target.split("/")) {
    if (piece === "..") parts.pop();
    else if (piece !== "." && piece !== "") parts.push(piece);
  }
  return parts.join("/");
}

/** Where the build copies the diagrams: their published pages and their images. */
export const DIAGRAM_SOURCES = [
  { dir: "docs/diagrams/public/", ext: ".html" },
  { dir: "docs/images/", ext: ".svg" },
] as const;

/** A diagram file's address on the site ("diagrams/system.html"), or undefined. Pure. */
export function diagramPath(path: string): string | undefined {
  const source = DIAGRAM_SOURCES.find(({ dir, ext }) => path.startsWith(dir) && path.endsWith(ext));
  const name = source && path.slice(source.dir.length);
  return name && /^[a-z0-9-]+\.[a-z]+$/.test(name) ? `diagrams/${name}` : undefined;
}

/**
 * Markdown links of `file` pointed at the site: a published page becomes its page (keeping any
 * "#part") and a diagram its copy on the site; web and email links stay. A link to anything else
 * in the repository keeps its words and loses the link, so the public site never points into the
 * repository. Pure.
 */
export function rewriteLinks(markdown: string, file: string): string {
  return markdown.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (whole, text: string, target: string) => {
    if (/^(https?|mailto):/i.test(target) || target.startsWith("#")) return whole;
    const [path = "", hash] = target.split("#");
    const diagram = diagramPath(resolve(file, path));
    if (diagram) return `[${text}](${diagram})`;
    const page = PAGES.find((p) => p.file === resolve(file, path));
    if (!page) return text;
    return `[${text}](${page.slug}.html${hash === undefined ? "" : `#${hash}`})`;
  });
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** A heading's text as an anchor: "1. Sign in with PayPal" becomes "sign-in-with-paypal". */
export const anchorOf = (text: string): string =>
  text
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .toLowerCase()
    .replace(/^\d+\.\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Gives each h2 an id and lists them, for "On this page". Pure. */
export function withAnchors(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const out = html.replace(/<h2>(.*?)<\/h2>/g, (_whole, inner: string) => {
    const id = anchorOf(inner);
    toc.push({ id, text: inner.replace(/<[^>]+>/g, "") });
    return `<h2 id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h2>`;
  });
  return { html: out, toc };
}

/** The first heading and the paragraphs before the first section, for the home page's hero. */
export function introOf(html: string): { title: string; lede: string } {
  const title = /<h1>(.*?)<\/h1>/.exec(html)?.[1] ?? "";
  const start = html.indexOf("</h1>");
  const end = html.indexOf("<h2");
  const lede = start === -1 ? "" : html.slice(start + 5, end === -1 ? undefined : end).trim();
  return { title, lede };
}

export interface Site {
  /** The website's own address, for "Back to PactPal" and signing in. */
  home: string;
}

const contents = (current: string) =>
  GROUPS.map(
    (group) =>
      `<p class="side-group">${group}</p><ul>${PAGES.filter((p) => p.group === group)
        .map(
          (p) =>
            `<li><a href="${p.slug}.html"${p.slug === current ? ' aria-current="page"' : ""}>${escapeHtml(p.title)}</a></li>`,
        )
        .join("")}</ul>`,
  ).join("");

function pager(slug: string): string {
  const at = PAGES.findIndex((p) => p.slug === slug);
  const before = PAGES[at - 1];
  const after = PAGES[at + 1];
  const link = (p: Page | undefined, rel: string, word: string) =>
    p
      ? `<a class="pager-${rel}" href="${p.slug}.html" rel="${rel}"><small>${word}</small>${escapeHtml(p.title)}</a>`
      : "<span></span>";
  return `<nav class="pager" aria-label="Next and previous pages">${link(before, "prev", "Previous")}${link(after, "next", "Next")}</nav>`;
}

/** The home page's cards: every page, by section. */
function cards(): string {
  return GROUPS.map(
    (group) =>
      `<section class="cards-group"><h2 id="${anchorOf(group)}">${group}</h2><div class="cards">${PAGES.filter(
        (p) => p.group === group && p.slug !== "index",
      )
        .map(
          (p, i) =>
            `<a class="card" href="${p.slug}.html" style="--i:${String(i)}"><b>${escapeHtml(p.title)}</b><span>${escapeHtml(p.about)}</span></a>`,
        )
        .join("")}</div></section>`,
  ).join("");
}

/** One page of the site, in the website's look, around its rendered body. Pure. */
export function pageHtml(page: Page, body: string, site: Site): string {
  const home = page.slug === "index";
  const { html, toc } = withAnchors(body);
  const intro = introOf(body);
  const main = home
    ? `<section class="hero"><p class="kicker"><i></i> Help</p><h1>How can we <em>help?</em></h1><div class="lede">${intro.lede}</div></section>${cards()}`
    : `<p class="crumb">${page.group}</p><article>${html}</article>${pager(page.slug)}`;
  const onThisPage =
    !home && toc.length > 1
      ? `<aside class="toc" aria-label="On this page"><p>On this page</p><ul>${toc
          .map((h) => `<li><a href="#${h.id}">${h.text}</a></li>`)
          .join("")}</ul></aside>`
      : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${home ? "PactPal help" : `${escapeHtml(page.title)} · PactPal help`}</title>
<meta name="description" content="${escapeHtml(page.about)}">
<link rel="icon" href="mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="site.css">
</head>
<body${home ? ' class="home"' : ""}>
<a class="skip" href="#content">Skip to the content</a>
<header class="bar">
<a class="brand" href="index.html">${markSvg("pp-help-mark")}<span>PactPal</span><em>Help</em></a>
<nav class="bar-links" aria-label="PactPal">
<a href="${site.home}/">PactPal home</a>
<a class="cta" href="${site.home}/auth/paypal/start">Sign in with PayPal</a>
</nav>
<button type="button" class="menu" aria-expanded="false" aria-controls="contents">Contents</button>
</header>
<div class="layout${onThisPage === "" ? "" : " with-toc"}">
<nav class="side" id="contents" aria-label="Help pages">${contents(page.slug)}</nav>
<main id="content">${main}</main>
${onThisPage}
</div>
<footer class="foot">
<p>PactPal currently runs in test mode. No real money moves. Not legal advice. PactPal records what was agreed and delivered; it does not guarantee any dispute outcome.</p>
<p><a href="limits.html">What PactPal is and is not</a> · <a href="privacy.html">Privacy</a> · <a href="mailto:hello@pact-pal.app">hello@pact-pal.app</a></p>
</footer>
<script src="site.js" defer></script>
</body>
</html>
`;
}
