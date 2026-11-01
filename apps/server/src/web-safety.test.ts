import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const webSource = new URL("../../web/src/", import.meta.url);

/** Ways to put raw HTML into a page, which would let text from a chat run as page code. */
const RAW_HTML =
  /dangerouslySetInnerHTML|\.innerHTML|\.outerHTML|insertAdjacentHTML|document\.write/;

describe("the web pages", () => {
  const files = readdirSync(webSource).filter((name) => /\.(ts|tsx)$/.test(name));

  it("has source files to check", () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it.each(files)("%s never puts raw HTML into the page", (name) => {
    expect(readFileSync(new URL(name, webSource), "utf8")).not.toMatch(RAW_HTML);
  });
});
