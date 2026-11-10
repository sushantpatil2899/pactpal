import { describe, expect, it } from "vitest";
import { inAppPath, matchRoute, type LinkClick } from "./routes";

const DEAL_ID = "0b0c0a00-1111-4222-8333-444455556666";

describe("routes", () => {
  it("finds the page for a path", () => {
    expect(matchRoute("/")).toEqual({ page: "home" });
    expect(matchRoute("/link")).toEqual({ page: "link" });
    expect(matchRoute("/sign-in")).toEqual({ page: "sign-in" });
    expect(matchRoute("/deals")).toEqual({ page: "deals" });
    expect(matchRoute("/new")).toEqual({ page: "new-deal" });
    expect(matchRoute("/notifications")).toEqual({ page: "notifications" });
    expect(matchRoute("/disputes")).toEqual({ page: "disputes" });
    expect(matchRoute("/settings")).toEqual({ page: "settings" });
    expect(matchRoute("/insights")).toEqual({ page: "insights" });
    expect(matchRoute(`/deals/${DEAL_ID}`)).toEqual({ page: "deal", dealId: DEAL_ID });
    expect(matchRoute(`/deals/${DEAL_ID}/disputes/PP-R-ABC-123`)).toEqual({
      page: "dispute",
      dealId: DEAL_ID,
      disputeId: "PP-R-ABC-123",
    });
  });

  it("shows the home page for paths that name no page", () => {
    expect(matchRoute("/deals/not-an-id")).toEqual({ page: "home" });
    expect(matchRoute("/anything/else")).toEqual({ page: "home" });
  });
});

describe("links followed without a reload", () => {
  const click = (href: string, more: Partial<LinkClick> = {}): LinkClick => ({
    href,
    current: `https://pact-pal.app/deals/${DEAL_ID}`,
    target: "",
    download: false,
    modified: false,
    ...more,
  });

  it("follows links to the app's own pages", () => {
    expect(inAppPath(click("/"))).toBe("/");
    expect(inAppPath(click(`/deals/${DEAL_ID}/disputes/X1#packet`))).toBe(
      `/deals/${DEAL_ID}/disputes/X1#packet`,
    );
  });

  it("leaves everything else to the browser", () => {
    expect(inAppPath(click("https://www.paypal.com/invoice/1"))).toBeUndefined();
    expect(inAppPath(click("/auth/paypal/start?return=%2F"))).toBeUndefined();
    expect(inAppPath(click(`/api/deals/${DEAL_ID}/receipt`))).toBeUndefined();
    expect(inAppPath(click("/files/cover.png"))).toBeUndefined();
    expect(inAppPath(click("/", { target: "_blank" }))).toBeUndefined();
    expect(inAppPath(click("/", { download: true }))).toBeUndefined();
    expect(inAppPath(click("/", { modified: true }))).toBeUndefined();
    // Only the tab changes: the deal page handles that itself.
    expect(inAppPath(click(`/deals/${DEAL_ID}#log`))).toBeUndefined();
  });
});
