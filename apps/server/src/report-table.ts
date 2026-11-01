/** Plain-text table: the first column is left-aligned, the others are counts. */
export function table(header: readonly string[], body: readonly (readonly string[])[]): string {
  const widths = header.map((title, i) =>
    Math.max(title.length, ...body.map((row) => (row[i] ?? "").length)),
  );
  const line = (cells: readonly string[]) =>
    `  ${cells.map((cell, i) => (i === 0 ? cell.padEnd(widths[i] ?? 0) : cell.padStart(widths[i] ?? 0))).join("  ")}\n`;
  return line(header) + body.map(line).join("");
}
