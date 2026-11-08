/** The tab named in the address (`#chat`), or `fallback` when it names none of `allowed`. */
export function tabFromHash<T extends string>(hash: string, allowed: readonly T[], fallback: T): T {
  const name = hash.replace(/^#/, "");
  return allowed.find((tab) => tab === name) ?? fallback;
}

/** The tab reached with an arrow, Home or End key from `current`, or undefined for other keys. */
export function tabForKey<T>(key: string, tabs: readonly T[], current: T): T | undefined {
  const at = tabs.indexOf(current);
  const step: Record<string, number> = {
    ArrowRight: at + 1,
    ArrowLeft: at - 1,
    Home: 0,
    End: tabs.length - 1,
  };
  const target = step[key];
  if (target === undefined || tabs.length === 0) return undefined;
  return tabs[(target + tabs.length) % tabs.length];
}
