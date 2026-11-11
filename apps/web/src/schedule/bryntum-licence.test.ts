import { afterEach, describe, expect, it } from "vitest";
import { giveBryntumLicence } from "./bryntum-licence";

const holder = globalThis as { bryntum?: { licenseKey?: string } };

describe("giveBryntumLicence (9k)", () => {
  afterEach(() => {
    delete holder.bryntum;
  });

  it("sets the key on Bryntum's global object, before or after Bryntum has made it", () => {
    giveBryntumLicence("key-1");
    expect(holder.bryntum?.licenseKey).toBe("key-1");
    holder.bryntum = { licenseKey: undefined };
    giveBryntumLicence("key-2");
    expect(holder.bryntum.licenseKey).toBe("key-2");
  });

  it("leaves Bryntum in its trial mode when no key is set", () => {
    giveBryntumLicence(undefined);
    giveBryntumLicence("");
    expect(holder.bryntum).toBeUndefined();
  });
});
