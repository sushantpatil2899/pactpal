/**
 * At most `limit` calls per key in any window of `windowMs`, counted on this server copy only
 * (8a). Pure apart from its own memory; the time is passed in.
 */
export class CallLimiter {
  private readonly calls = new Map<string, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Records a call by `key` at `nowMs` when it is allowed; false (and not recorded) otherwise. */
  allow(key: string, nowMs: number): boolean {
    const recent = (this.calls.get(key) ?? []).filter((at) => nowMs - at < this.windowMs);
    if (recent.length >= this.limit) {
      this.calls.set(key, recent);
      return false;
    }
    recent.push(nowMs);
    this.calls.set(key, recent);
    return true;
  }
}
