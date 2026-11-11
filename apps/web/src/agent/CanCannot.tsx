/** What an AI agent can and cannot do, as two short lists side by side. */
export function CanCannot({
  can,
  cannot,
  className,
}: {
  can: readonly string[];
  cannot: readonly string[];
  className: string;
}) {
  return (
    <div className={className}>
      {(
        [
          ["It can", can],
          ["It cannot", cannot],
        ] as const
      ).map(([title, lines]) => (
        <div key={title}>
          <h3>{title}</h3>
          <ul>
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
