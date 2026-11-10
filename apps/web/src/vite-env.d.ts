/** What the build makes available to the page; only names starting `VITE_` are exposed. */
interface ImportMetaEnv {
  /** The AG Grid and AG Studio licence key; without it Insights runs in AG's trial mode. */
  readonly VITE_AG_LICENCE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
