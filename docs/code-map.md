# Code map

[`graphify-out/`](../graphify-out) holds a map of the code (files, functions, types and the links between them) built by [graphify](https://github.com/Graphify-Labs/graphify) from the source alone, offline. Open `graphify-out/graph.html` in a browser to explore it, or read `graphify-out/GRAPH_REPORT.md` for a summary.

Requirements: Python 3.10+ and [uv](https://docs.astral.sh/uv/).

```bash
uv tool install graphifyy==0.9.103   # the package name has two y's
pnpm graph                           # rebuild the map after code changes
graphify query "how is a ledger event appended"
graphify explain "appendLedgerEvent()"
graphify path "DealPage.tsx" "appendLedgerEvent()"
```

The map is committed and rebuilt before each commit; after a merge conflict in `graphify-out/`, run `pnpm graph` and commit the result.
