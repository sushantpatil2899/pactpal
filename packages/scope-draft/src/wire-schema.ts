import type { JsonSchema } from "@pactpal/ai";
import { z } from "zod";
import { scopeDraftV4Schema } from "./schema.js";

/** Keywords hosts commonly reject in a reply schema. The checker still enforces every one of them. */
const HOST_REJECTED = new Set([
  "$schema",
  "minLength",
  "maxLength",
  "pattern",
  "format",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minItems",
  "maxItems",
]);

function simplify(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(simplify);
  if (typeof node !== "object" || node === null) return node;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (HOST_REJECTED.has(key)) continue;
    if (key === "properties") {
      // Field names are not keywords: a field called "format" must stay.
      result[key] = Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([name, child]) => [
          name,
          simplify(child),
        ]),
      );
    } else if (key === "oneOf") {
      // Strict hosts accept `anyOf` and `enum`, not `oneOf` and `const`.
      result.anyOf = simplify(value);
    } else if (key === "const") {
      result.enum = [value];
    } else {
      result[key] = simplify(value);
    }
  }
  return result;
}

/**
 * The reply schema sent to model hosts, generated from the same zod schema that checks the
 * answer so the two cannot drift, then reduced to what hosts accept. Length, number and format
 * limits are left out here and enforced by `validateScopeDraft`.
 */
export function scopeDraftWireSchema(): JsonSchema {
  const simplified = simplify(z.toJSONSchema(scopeDraftV4Schema));
  return simplified as JsonSchema;
}

/** The name the schema is sent under. */
export const SCOPE_DRAFT_SCHEMA_NAME = "scope_draft";
