const LINES = 10;
const BULGE = 1.32;

/** One grid line, bowed outward from the middle, in a 100 by 100 box. */
function bowed(at: number, vertical: boolean): string {
  const out = 50 + (at - 50) * BULGE;
  return vertical
    ? `M ${String(at)} 0 Q ${String(out)} 50 ${String(at)} 100`
    : `M 0 ${String(at)} Q 50 ${String(out)} 100 ${String(at)}`;
}

const PATHS = Array.from({ length: LINES + 1 }, (_, i) => (i * 100) / LINES).flatMap((at) => [
  bowed(at, true),
  bowed(at, false),
]);

/** A grid that bulges out from its middle, slowly breathing: the frame around a pillar's screen. */
export function WarpGrid() {
  return (
    <svg className="pp-lp-warp" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {PATHS.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
