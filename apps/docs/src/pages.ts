/** The project's own documents published on the docs site (9R-4), in the contents' order. */
export const PAGES: readonly { file: string; slug: string; title: string; about: string }[] = [
  { file: "README.md", slug: "index", title: "PactPal", about: "What it is and how to run it" },
  {
    file: "docs/product.md",
    slug: "product",
    title: "Product",
    about: "Features, screens and guardrails",
  },
  {
    file: "docs/scope.md",
    slug: "scope",
    title: "Scope",
    about: "What PactPal does and does not do",
  },
  {
    file: "docs/demo.md",
    slug: "demo",
    title: "Demo stories",
    about: "The deals the demo follows",
  },
  {
    file: "docs/decisions.md",
    slug: "decisions",
    title: "Decisions",
    about: "Every design choice and why",
  },
  {
    file: "docs/data-model.md",
    slug: "data-model",
    title: "Data model",
    about: "Tables, the evidence log and fingerprints",
  },
  {
    file: "docs/build-plan.md",
    slug: "build-plan",
    title: "Build plan",
    about: "Phases and what each delivered",
  },
  {
    file: "docs/engineering-standards.md",
    slug: "engineering-standards",
    title: "Engineering standards",
    about: "The bar every change meets",
  },
  {
    file: "docs/sandbox-notes.md",
    slug: "sandbox-notes",
    title: "PayPal sandbox notes",
    about: "What the sandbox does and does not do",
  },
  {
    file: "docs/spike-results.md",
    slug: "spike-results",
    title: "Test results",
    about: "Spikes, evals and live tests",
  },
];

/** Where repository files that are not pages are shown. */
export const REPOSITORY = "https://github.com/sushantpatil2899/paypal-hackathon/blob/dev/";

/** A repository path ("docs/x.md", "../README.md" from docs/) made plain ("docs/x.md", "README.md"). */
function resolve(from: string, target: string): string {
  const parts = from.split("/").slice(0, -1);
  for (const piece of target.split("/")) {
    if (piece === "..") parts.pop();
    else if (piece !== "." && piece !== "") parts.push(piece);
  }
  return parts.join("/");
}

/**
 * Markdown links of `file` pointed at the site: a published document becomes its page (keeping
 * any "#part"), any other repository file its address on GitHub; outside links stay. Pure.
 */
export function rewriteLinks(markdown: string, file: string): string {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (whole, target: string) => {
    if (/^[a-z]+:/i.test(target) || target.startsWith("#")) return whole;
    const [path = "", hash] = target.split("#");
    const plain = resolve(file, path);
    const page = PAGES.find((p) => p.file === plain);
    const anchor = hash === undefined ? "" : `#${hash}`;
    return page ? `](${page.slug}.html${anchor})` : `](${REPOSITORY}${plain}${anchor})`;
  });
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** One page of the site around its rendered body, with the contents beside it. Pure. */
export function pageHtml(page: { slug: string; title: string }, body: string): string {
  const nav = PAGES.map(
    (p) =>
      `<li><a href="${p.slug}.html"${p.slug === page.slug ? ' aria-current="page"' : ""}>${escapeHtml(p.title)}</a></li>`,
  ).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(page.title)} · PactPal docs</title>
<link rel="stylesheet" href="site.css">
</head>
<body>
<header><a class="brand" href="index.html">PactPal docs</a></header>
<div class="layout">
<nav aria-label="Documents"><ul>${nav}</ul></nav>
<main>${body}</main>
</div>
</body>
</html>
`;
}
