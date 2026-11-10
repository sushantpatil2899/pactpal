import { describe, expect, it } from "vitest";
import { isDark, nextTheme, readTheme } from "./theme";

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

  it("is dark by choice, or by the device when no choice was made", () => {
    expect(isDark("dark", false)).toBe(true);
    expect(isDark("light", true)).toBe(false);
    expect(isDark(undefined, true)).toBe(true);
    expect(isDark(undefined, false)).toBe(false);
  });
});
