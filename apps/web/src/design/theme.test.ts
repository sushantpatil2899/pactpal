import { describe, expect, it } from "vitest";
import { nextTheme, readTheme } from "./theme";

describe("the theme choice", () => {
  it("cycles from the device's setting to light, to dark, and back", () => {
    expect(nextTheme("auto")).toBe("light");
    expect(nextTheme("light")).toBe("dark");
    expect(nextTheme("dark")).toBe("auto");
  });

  it("follows the device when nothing usable is stored", () => {
    expect(readTheme("dark")).toBe("dark");
    expect(readTheme("light")).toBe("light");
    expect(readTheme(null)).toBe("auto");
    expect(readTheme("sepia")).toBe("auto");
  });
});
