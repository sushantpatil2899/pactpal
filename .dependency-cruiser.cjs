/** Architecture rules enforced by `pnpm deps:check`. See docs/engineering-standards.md. */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      comment: "Circular dependencies make modules impossible to reason about in isolation.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
    {
      name: "packages-not-to-apps",
      comment: "Packages are reusable building blocks; they must never depend on an app.",
      severity: "error",
      from: { path: "^packages/" },
      to: { path: "^apps/" },
    },
    {
      name: "no-cross-app-imports",
      comment: "Apps share code through packages, never by importing each other.",
      severity: "error",
      from: { path: "^apps/([^/]+)/" },
      to: { path: "^apps/[^/]+/", pathNot: "^apps/$1/" },
    },
    {
      name: "no-test-imports-in-source",
      comment: "Production code must not import test files.",
      severity: "error",
      from: { pathNot: "\\.test\\.tsx?$" },
      to: { path: "\\.test\\.tsx?$" },
    },
    {
      name: "no-dev-deps-in-source",
      comment: "Runtime code may only use runtime dependencies.",
      severity: "error",
      from: { path: "^(apps|packages)/[^/]+/src/", pathNot: "\\.test\\.tsx?$" },
      to: { dependencyTypes: ["npm-dev"] },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "(^|/)(dist|coverage)/" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.base.json" },
  },
};
