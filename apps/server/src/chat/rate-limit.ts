/**
 * Allows at most `limit` actions per key within `windowMs`, counted in memory. Used to keep one
 * page (or one person) from flooding a chat; a refusal is answered, never queued. Keys are
 * forgotten once their window has passed, so memory stays small.
 */
export function rateLimiter(limit: number, windowMs: number, clock: () => Date) {
  const recent = new Map<string, number[]>();
  return (key: string): boolean => {
    const now = clock().getTime();
    const kept = (recent.get(key) ?? []).filter((at) => now - at < windowMs);
    if (kept.length >= limit) {
      recent.set(key, kept);
      return false;
    }
    kept.push(now);
    recent.set(key, kept);
    for (const [other, times] of recent) {
      if (times.every((at) => now - at >= windowMs)) recent.delete(other);
    }
    return true;
  };
}
