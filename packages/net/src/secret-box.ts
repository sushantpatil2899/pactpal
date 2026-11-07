import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { Secret } from "./secret.js";

const ALGORITHM = "aes-256-gcm";
/** The format tag; a later key or algorithm gets a new one, so old values stay readable. */
const VERSION = "v1";
const KEY_BYTES = 32;
/** GCM's recommended nonce size. */
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** Why a key could not be used. */
export class SecretBoxKeyError extends Error {
  constructor() {
    super(`The encryption key must be exactly ${String(KEY_BYTES)} bytes`);
    this.name = "SecretBoxKeyError";
  }
}

/**
 * Encrypts secrets kept at rest (a seller's PayPal app secret) with one key held outside the
 * database. AES-256-GCM, so a changed or swapped value is refused rather than misread. Each value
 * is bound to a `context` (what row it belongs to), so a sealed value copied elsewhere will not
 * open.
 */
export class SecretBox {
  readonly #key: Buffer;
  readonly #random: (bytes: number) => Buffer;

  constructor(key: Uint8Array, random: (bytes: number) => Buffer = randomBytes) {
    if (key.length !== KEY_BYTES) throw new SecretBoxKeyError();
    this.#key = Buffer.from(key);
    this.#random = random;
  }

  /** `v1.<iv>.<tag>.<data>`, each part base64url. */
  seal(secret: Secret, context: string): string {
    const iv = this.#random(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.#key, iv);
    cipher.setAAD(Buffer.from(context, "utf8"));
    const data = Buffer.concat([cipher.update(secret.reveal(), "utf8"), cipher.final()]);
    return [VERSION, iv, cipher.getAuthTag(), data]
      .map((part) => (typeof part === "string" ? part : part.toString("base64url")))
      .join(".");
  }

  /** The secret, or undefined if the value is malformed, changed, or sealed for another context or key. */
  open(sealed: string, context: string): Secret | undefined {
    const parts = sealed.split(".");
    if (parts.length !== 4 || parts[0] !== VERSION) return undefined;
    const [iv, tag, data] = parts.slice(1).map((part) => Buffer.from(part, "base64url"));
    if (iv?.length !== IV_BYTES || tag?.length !== TAG_BYTES || data === undefined) {
      return undefined;
    }
    try {
      const decipher = createDecipheriv(ALGORITHM, this.#key, iv);
      decipher.setAAD(Buffer.from(context, "utf8"));
      decipher.setAuthTag(tag);
      const plain = Buffer.concat([decipher.update(data), decipher.final()]);
      return new Secret(plain.toString("utf8"));
    } catch {
      // GCM refuses any change to the value, the context or the key; all mean "cannot open".
      return undefined;
    }
  }
}
