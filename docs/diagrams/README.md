# Diagrams

Made with [Archify](https://github.com/tt-a1i/archify). Every box cites the source lines it describes, pinned to a commit.

| Folder | What it holds |
|---|---|
| `src/` | The diagram sources (JSON). Edit these. |
| `*.html` | Interactive diagrams with source links, for reading locally |
| `public/` | The same diagrams without source links, published on help.pact-pal.app/diagrams |
| `../images/` | Light and dark SVG exports, used by the README and the help site |

## After changing a source

From the repository's root, with Archify at `$ARCHIFY` (its `bin/archify.mjs`):

```bash
node $ARCHIFY finalize <type> docs/diagrams/src/<name>.<type>.json docs/diagrams/<name>.html --repo-root . --quality showcase
node docs/diagrams/publish.js
```

Then open `docs/diagrams/<name>.html`, choose **Export → SVG (light)** and **SVG (dark)**, and save them as `docs/images/<name>-light.svg` and `docs/images/<name>-dark.svg`.

When the cited code moves, update `meta.repository.revision` and the line numbers in `src/`.

This folder is skipped by Prettier: the pages are generated, and reformatting them would break Archify's checks.
