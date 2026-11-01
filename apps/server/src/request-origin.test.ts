import { describe, expect, it } from "vitest";
import { buildApp } from "./app.js";

const report = { settings: [], features: [] };

/** The app with nothing but its own routes, trusting `hops` proxies when given. */
const appWith = (hops?: number) =>
  buildApp(report, { logger: false, ...(hops === undefined ? {} : { trustProxyHops: hops }) });

describe("GET /api/connection-check", () => {
  it("shows the connection and forwarding headers, and no recorded address until hops are set", async () => {
    const app = appWith();
    const res = await app.inject({
      method: "GET",
      url: "/api/connection-check",
      remoteAddress: "10.0.0.5",
      headers: {
        "x-forwarded-for": "203.0.113.50, 198.51.100.9",
        "x-forwarded-proto": "https",
        "true-client-ip": "198.51.100.9",
      },
    });
    expect(res.headers["cache-control"]).toBe("no-store");
    expect(res.json()).toEqual({
      socketAddress: "10.0.0.5",
      trustProxyHops: null,
      addressAsRecorded: null,
      headers: {
        "x-forwarded-for": "203.0.113.50, 198.51.100.9",
        "x-forwarded-proto": "https",
        "true-client-ip": "198.51.100.9",
      },
    });
    await app.close();
  });

  it.each([
    [0, "10.0.0.5"],
    [1, "198.51.100.9"],
    [2, "203.0.113.50"],
  ])("with %i trusted proxies records %s", async (hops, address) => {
    const app = appWith(hops);
    const res = await app.inject({
      method: "GET",
      url: "/api/connection-check",
      remoteAddress: "10.0.0.5",
      headers: { "x-forwarded-for": "203.0.113.50, 198.51.100.9" },
    });
    expect(res.json()).toMatchObject({ trustProxyHops: hops, addressAsRecorded: address });
    await app.close();
  });
});
