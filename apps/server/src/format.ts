/** Two-column plain-text rows, labels padded so the second column lines up. */
export function rows(entries: readonly (readonly [string, string])[]): string {
  const width = Math.max(...entries.map(([label]) => label.length)) + 2;
  return entries.map(([label, value]) => `  ${label.padEnd(width)}${value}\n`).join("");
}
