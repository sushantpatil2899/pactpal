// Bundles the server into runnable JavaScript. Workspace packages (@pactpal/*) are TypeScript
// source with no build of their own, so they are compiled into the bundle together with the npm
// libraries they use. Only the server's own declared dependencies and Node built-ins stay
// external, because only those are installed where the server runs (pnpm keeps each package's
// dependencies private to it).
import { readFileSync } from "node:fs";
import { builtinModules } from "node:module";
import { URL } from "node:url";
import { build } from "esbuild";

const { dependencies = {} } = JSON.parse(readFileSync(new URL("package.json", import.meta.url)));
const external = new Set(Object.keys(dependencies).filter((name) => !name.startsWith("@pactpal/")));
const builtins = new Set(builtinModules);

/** The package an import belongs to: "zod/v4" -> "zod", "@scope/pkg/sub" -> "@scope/pkg". */
function packageOf(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const result = await build({
  entryPoints: [
    "src/index.ts",
    "src/check-env.ts",
    "src/migrate.ts",
    "src/workflow.ts",
    "src/dispute-cron.ts",
  ],
  outdir: "dist",
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  sourcemap: true,
  logLevel: "warning",
  metafile: true,
  // Some bundled libraries use require(); give the ES module output a require that works.
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  plugins: [
    {
      name: "external-dependencies",
      setup(builder) {
        builder.onResolve({ filter: /^[^./]/ }, (args) => {
          const name = packageOf(args.path);
          const isExternal =
            args.path.startsWith("node:") || builtins.has(name) || external.has(name);
          return isExternal ? { path: args.path, external: true } : undefined;
        });
      },
    },
  ],
});

// Fail the build if anything left outside the bundle cannot be found from the server, so a
// broken start is caught here instead of on the host.
const missing = new Set();
for (const output of Object.values(result.metafile.outputs)) {
  for (const { path, external: isExternal } of output.imports) {
    if (!isExternal || path.startsWith("node:") || builtins.has(packageOf(path))) continue;
    try {
      import.meta.resolve(path);
    } catch {
      missing.add(path);
    }
  }
}
if (missing.size > 0) {
  throw new Error(`Bundle imports packages the server cannot load: ${[...missing].join(", ")}`);
}
