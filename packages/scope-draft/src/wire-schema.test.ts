import { describe, expect, it } from "vitest";
import { scopeDraftWireSchema } from "./wire-schema.js";

describe("scopeDraftWireSchema", () => {
  const text = JSON.stringify(scopeDraftWireSchema());

  it("keeps the shape: every field name, and no free-form extras", () => {
    for (const name of [
      "summary",
      "deliverables",
      "exclusions",
      "price",
      "paymentTerms",
      "dueDate",
      "revisionsIncluded",
      "vagueTerms",
      "category",
      "citations",
      "suggestedRewrite",
    ]) {
      expect(text).toContain(`"${name}"`);
    }
    expect(text).toContain('"additionalProperties":false');
    expect(text).toContain('"subjective"');
  });

  it("keeps a field called format, and drops the format keyword of a date", () => {
    const schema = scopeDraftWireSchema() as {
      properties: { format: unknown; dueDate: unknown };
    };
    expect(schema.properties.format).toEqual({ type: "number", enum: [3] });
    expect(JSON.stringify(schema.properties.dueDate)).not.toContain('"format"');
  });

  it("leaves out what hosts reject and uses anyOf and enum instead of oneOf and const", () => {
    for (const keyword of [
      "$schema",
      "minLength",
      "maxLength",
      "pattern",
      "minimum",
      "maximum",
      "minItems",
      "maxItems",
      "oneOf",
      "const",
    ]) {
      expect(text).not.toContain(`"${keyword}"`);
    }
    expect(text).toContain('"anyOf"');
    expect(text).toContain('"enum":["found"]');
  });
});
