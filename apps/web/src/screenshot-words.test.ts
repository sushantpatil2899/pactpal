import { describe, expect, it } from "vitest";
import { screenshotNotice } from "./screenshot-words";

const shot = (filename: string, read: boolean) => ({
  fileId: filename,
  filename,
  read,
  messages: read ? 3 : 0,
});

describe("screenshot notice", () => {
  it("says what to check, counts unreadable words and names screenshots not read", () => {
    expect(screenshotNotice({ text: "x", unreadable: 0, screenshots: [shot("a.png", true)] })).toBe(
      "Read by AI from 1 screenshot. Check every line against the screenshots before drafting; the AI can misread names, prices or dates.",
    );
    expect(
      screenshotNotice({
        text: "x",
        unreadable: 2,
        screenshots: [shot("a.png", true), shot("b.png", true), shot("c.png", false)],
      }),
    ).toBe(
      "Read by AI from 2 screenshots. Check every line against the screenshots before drafting; the AI can misread names, prices or dates. 2 words could not be read and show as [unreadable]. Not read: c.png. Type or paste that part.",
    );
    expect(
      screenshotNotice({ text: "x", unreadable: 1, screenshots: [shot("a.png", true)] }),
    ).toContain("1 word could not be read and shows as [unreadable].");
    expect(screenshotNotice({ text: "", unreadable: 0, screenshots: [shot("a.png", false)] })).toBe(
      "No screenshot could be read. Type or paste the chat instead.",
    );
  });
});
