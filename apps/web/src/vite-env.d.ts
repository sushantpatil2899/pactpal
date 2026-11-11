/** What the build makes available to the page; only names starting `VITE_` are exposed. */
interface ImportMetaEnv {
  /** The AG Grid and AG Studio licence key; without it Insights runs in AG's trial mode. */
  readonly VITE_AG_LICENCE_KEY?: string;
  /** The help site's address, where it is not the default. */
  readonly VITE_HELP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** An image the build copies into the output; importing it gives its address. */
declare module "*.webp" {
  const src: string;
  export default src;
}
