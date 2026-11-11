/**
 * Hands Bryntum its licence key (9k). Bryntum 8 reads it from the global `bryntum` object, which
 * may be set before Bryntum loads; without a key the charts run in Bryntum's trial mode. The key
 * is built into the page, as Bryntum intends, so it is a build setting and not a secret.
 */
export function giveBryntumLicence(key = import.meta.env.VITE_BRYNTUM_LICENCE_KEY): void {
  if (key === undefined || key === "") return;
  const holder = globalThis as { bryntum?: { licenseKey?: string } };
  holder.bryntum ??= {};
  holder.bryntum.licenseKey = key;
}
