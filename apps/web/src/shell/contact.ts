/** Where people write to PactPal: a stand in until the owner sets the real address. */
export const CONTACT = "hello@pact-pal.app";

/** PactPal help (the help site, built from docs/help); set `VITE_HELP_URL` where it lives elsewhere. */
export const HELP_URL = (
  import.meta.env.VITE_HELP_URL ?? "https://pactpal-docs.onrender.com"
).replace(/\/$/, "");

/** One help page by its name, such as "ai-agents" or "privacy", with an optional "#part". */
export const helpPage = (page: string, part?: string): string =>
  `${HELP_URL}/${page}.html${part === undefined ? "" : `#${part}`}`;
