// Bundles the server into runnable JavaScript. Workspace packages (@pactpal/*) are TypeScript
// source with no build of their own, so they are compiled into the bundle; npm dependencies and
// Node built-ins stay external and are loaded from node_modules at run time.
import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts", "src/check-env.ts"],
  outdir: "dist",
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  sourcemap: true,
  logLevel: "warning",
  plugins: [
    {
      name: "external-dependencies",
      setup(builder) {
        builder.onResolve({ filter: /^[^./]/ }, (args) =>
          args.path.startsWith("@pactpal/") ? undefined : { path: args.path, external: true },
        );
      },
    },
  ],
});
