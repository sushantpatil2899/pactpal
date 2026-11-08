import { describe, expect, it } from "vitest";
import { tabForKey, tabFromHash } from "./tab-address";

const TABS = ["chat", "scope", "log"] as const;

describe("tabs in the address", () => {
  it("reads the tab from the address, or falls back", () => {
    expect(tabFromHash("#scope", TABS, "chat")).toBe("scope");
    expect(tabFromHash("", TABS, "chat")).toBe("chat");
    expect(tabFromHash("#admin", TABS, "chat")).toBe("chat");
  });

  it("moves between tabs with the arrow, Home and End keys, wrapping around", () => {
    expect(tabForKey("ArrowRight", TABS, "chat")).toBe("scope");
    expect(tabForKey("ArrowRight", TABS, "log")).toBe("chat");
    expect(tabForKey("ArrowLeft", TABS, "chat")).toBe("log");
    expect(tabForKey("Home", TABS, "log")).toBe("chat");
    expect(tabForKey("End", TABS, "chat")).toBe("log");
    expect(tabForKey("Enter", TABS, "chat")).toBeUndefined();
    expect(tabForKey("End", [], "chat")).toBeUndefined();
  });
});
