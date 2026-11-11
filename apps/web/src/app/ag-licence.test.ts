import { beforeEach, describe, expect, it, vi } from "vitest";

const grid = vi.fn();
const studio = vi.fn();
vi.mock("ag-grid-enterprise", () => ({ LicenseManager: { setLicenseKey: grid } }));
vi.mock("ag-studio", () => ({ AgStudioLicenseManager: { setLicenseKey: studio } }));

/** A fresh copy of the module, since it hands the keys over only once. */
const load = async () => {
  vi.resetModules();
  return (await import("./ag-licence")).giveAgLicence;
};

describe("giveAgLicence (9k-2)", () => {
  beforeEach(() => {
    grid.mockClear();
    studio.mockClear();
  });

  it("gives AG Grid and AG Studio each their own key, once", async () => {
    const give = await load();
    give("grid-key", "studio-key");
    give("other", "other");
    expect(grid.mock.calls).toEqual([["grid-key"]]);
    expect(studio.mock.calls).toEqual([["studio-key"]]);
  });

  it("leaves a product in trial mode when its own key is missing", async () => {
    const give = await load();
    give("", "studio-key");
    expect(grid).not.toHaveBeenCalled();
    expect(studio.mock.calls).toEqual([["studio-key"]]);
    const again = await load();
    again("grid-key", undefined);
    expect(grid.mock.calls).toEqual([["grid-key"]]);
    expect(studio.mock.calls).toEqual([["studio-key"]]);
  });
});
