/** What the build makes available to the page; only names starting `VITE_` are exposed. */
interface ImportMetaEnv {
  /** The AG Studio licence key (Insights); without it Insights runs in AG's trial mode. */
  readonly VITE_AG_LICENCE_KEY?: string;
  /** The AG Grid Enterprise licence key (the deals table, 9k-2); licensed apart from AG Studio. */
  readonly VITE_AG_GRID_LICENCE_KEY?: string;
  /** The Bryntum licence key (9k); without it the timeline charts run in Bryntum's trial mode. */
  readonly VITE_BRYNTUM_LICENCE_KEY?: string;
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
