/**
 * PayPal REST base address. Fixed to the sandbox: live money and production
 * credentials are out of scope (docs/scope.md), so no setting can point the
 * client at real PayPal by mistake.
 */
export const SANDBOX_API_BASE_URL = "https://api-m.sandbox.paypal.com";

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

  /** The real value. Call only where it is sent to PayPal, never to log it. */
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

/** Client id and secret of one PayPal REST app. */
export interface PayPalAppCredentials {
  clientId: string;
  clientSecret: Secret;
}
