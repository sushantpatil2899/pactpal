/**
 * Builds the help site's copies of the diagrams in `docs/diagrams/public/`: the same diagrams
 * without source links or the repository's address, because the help site never points into the
 * repository. Run from the repository's root after changing anything in `docs/diagrams/src/`:
 *
 *   node docs/diagrams/publish.js
 *
 * Needs Archify (https://github.com/tt-a1i/archify). Set ARCHIFY to its `bin/archify.mjs` when it
 * is not installed as a Claude Code skill.
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { URL, fileURLToPath } from "node:url";

const archify = process.env.ARCHIFY ?? join(homedir(), ".claude/skills/archify/bin/archify.mjs");
const root = fileURLToPath(new URL("../../", import.meta.url));
const sources = new URL("src/", import.meta.url);
const work = mkdtempSync(join(tmpdir(), "pactpal-diagrams-"));

/** Removes every `sources` list, wherever it sits in the diagram. */
function withoutSources(value) {
  if (Array.isArray(value)) value.forEach(withoutSources);
  else if (value !== null && typeof value === "object") {
    delete value.sources;
    Object.values(value).forEach(withoutSources);
  }
}

try {
  for (const file of readdirSync(sources).filter((name) => name.endsWith(".json"))) {
    const [name, type] = file.split(".");
    const diagram = JSON.parse(readFileSync(new URL(file, sources), "utf8"));
    delete diagram.meta.repository;
    withoutSources(diagram);
    diagram.meta.output = `docs/diagrams/public/${name}.html`;
    const candidate = join(work, file);
    writeFileSync(candidate, JSON.stringify(diagram, null, 2));
    execFileSync(
      process.execPath,
      [archify, "finalize", type, candidate, diagram.meta.output, "--quality", "showcase"]
        .concat(["--json", "--out-dir", join(work, name)]),
      { cwd: root, stdio: ["ignore", "ignore", "inherit"] },
    );
    process.stdout.write(`docs/diagrams/public/${name}.html\n`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
