import { describe, expect, it } from "vitest";
import { PILLARS } from "./landing-words";
import { NAV, PAGE_ORDER, navOwner, navPlaces } from "./nav-items";

describe("the landing page's navigation", () => {
  it("reaches every section with an anchor, in the order they sit on the page", () => {
    expect(navPlaces()).toEqual(PAGE_ORDER);
  });

  it("links a group's own label to its first place", () => {
    for (const item of NAV) {
      if (item.children) expect(item.children[0]?.id).toBe(item.id);
    }
  });

  it("names the top-level item that holds a section", () => {
    expect(navOwner("get")).toBe("get");
    expect(navOwner("ledger")).toBe("how");
    expect(navOwner("disputes")).toBe("how");
    expect(navOwner("buyer")).toBe("app");
    expect(navOwner("faq")).toBe("faq");
    expect(navOwner("hero")).toBeNull();
    expect(navOwner(null)).toBeNull();
  });

  it("sends the four cards to their own sections, in page order", () => {
    const targets = PILLARS.map((pillar) => pillar.link.slice(1));
    expect(targets).toEqual(["council", "paypal", "ledger", "disputes"]);
    const at = targets.map((id) => PAGE_ORDER.indexOf(id as (typeof PAGE_ORDER)[number]));
    expect(at.every((n) => n >= 0)).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
  });
});
