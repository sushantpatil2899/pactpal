/** base64url without padding, as JSON Web Tokens use it. */
const base64Url = (value: unknown): string =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

/**
 * The `PayPal-Auth-Assertion` header value that lets a platform app act for a
 * connected seller: an unsigned token naming the platform app (`iss`) and the
 * seller. PayPal needs the seller's payer id, not their email
 * (docs/sandbox-notes.md, "Acting on behalf of a seller").
 */
export function authAssertion(clientId: string, payerId: string): string {
  if (clientId === "" || payerId === "")
    throw new Error("authAssertion needs a client id and a payer id");
  return `${base64Url({ alg: "none" })}.${base64Url({ iss: clientId, payer_id: payerId, sub: payerId })}.`;
}
