// The help site's few behaviours: the contents on phones, copy buttons, wide tables, the
// "On this page" marker, and diagrams (loaded only on pages that have one).
(() => {
  const menu = document.querySelector(".menu");
  menu?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menu.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !document.body.classList.contains("menu-open")) return;
    document.body.classList.remove("menu-open");
    menu?.setAttribute("aria-expanded", "false");
  });

  for (const table of document.querySelectorAll("article table")) {
    const wrap = document.createElement("div");
    wrap.className = "table";
    table.replaceWith(wrap);
    wrap.append(table);
  }

  for (const pre of document.querySelectorAll("pre")) {
    const code = pre.querySelector("code");
    if (!code || code.classList.contains("language-mermaid")) continue;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy";
    button.textContent = "Copy";
    button.addEventListener("click", () => {
      navigator.clipboard.writeText(code.textContent ?? "").then(
        () => {
          button.textContent = "Copied";
        },
        () => undefined,
      );
    });
    pre.append(button);
  }

  const links = [...document.querySelectorAll(".toc a")];
  if (links.length > 0) {
    const mark = (id) => {
      for (const link of links) link.toggleAttribute("data-active", link.hash === `#${id}`);
    };
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) mark(entry.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    for (const heading of document.querySelectorAll("article h2[id]")) watch.observe(heading);
  }

  const diagrams = [...document.querySelectorAll("pre > code.language-mermaid")];
  if (diagrams.length > 0) {
    for (const code of diagrams) {
      const box = document.createElement("div");
      box.className = "mermaid";
      box.textContent = code.textContent;
      code.parentElement?.replaceWith(box);
    }
    const css = getComputedStyle(document.documentElement);
    const v = (name) => css.getPropertyValue(`--${name}`).trim();
    const script = document.createElement("script");
    script.src = "mermaid.min.js";
    script.onload = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        fontFamily: v("font-text"),
        themeVariables: {
          background: v("color-surface"),
          primaryColor: v("color-surface-2"),
          primaryTextColor: v("color-ink"),
          primaryBorderColor: v("color-accent"),
          lineColor: v("color-ink-3"),
          secondaryColor: v("color-bg-sunk"),
          tertiaryColor: v("color-surface"),
        },
      });
      window.mermaid.run();
    };
    document.head.append(script);
  }
})();
