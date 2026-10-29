/** Remembers which PayPal notifications were already handled, so repeats are skipped. */
export interface SeenEvents {
  has(eventId: string): boolean;
  add(eventId: string): void;
}

/**
 * In-memory store, forgotten on restart; Phase 2 replaces it with the
 * database. Keeps the newest `capacity` ids, dropping the oldest first.
 */
export class MemorySeenEvents implements SeenEvents {
  readonly #ids = new Set<string>();
  readonly #capacity: number;

  constructor(capacity = 10_000) {
    this.#capacity = capacity;
  }

  has(eventId: string): boolean {
    return this.#ids.has(eventId);
  }

  add(eventId: string): void {
    this.#ids.add(eventId);
    if (this.#ids.size > this.#capacity) {
      // A Set iterates in insertion order, so the first id is the oldest.
      const [oldest] = this.#ids;
      if (oldest !== undefined) this.#ids.delete(oldest);
    }
  }
}
