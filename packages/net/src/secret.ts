const REDACTED = "[redacted]";

/**
 * Holds a secret value so it cannot leak by accident: printing, logging,
 * JSON serialization and Node's inspector all show "[redacted]". Only an
 * explicit `reveal()` returns the value.
 */
export class Secret {
  readonly #value: string;

  constructor(value: string) {
    this.#value = value;
  }

  /** The real value. Call only where it is sent to the service it belongs to, never to log it. */
  reveal(): string {
    return this.#value;
  }

  toString(): string {
    return REDACTED;
  }

  toJSON(): string {
    return REDACTED;
  }

  // Node's util.inspect (used by console and test runners) looks up this symbol.
  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return REDACTED;
  }
}
