import { SecretBox, type Secret } from "@pactpal/net";

/** The box that opens sellers' app secrets, from `SELLER_KEYS_ENCRYPTION_KEY` (32 bytes, base64). */
export const sellerKeyBox = (encryptionKey: Secret): SecretBox =>
  new SecretBox(Buffer.from(encryptionKey.reveal(), "base64"));
