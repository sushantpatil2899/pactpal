import { describe, expect, it } from "vitest";
import { FAQ, HERO, LIMITS, STORY, TAGLINE, revealWords } from "./landing-words";

describe("the landing page's words", () => {
  it("splits the tagline into numbered words for the reveal", () => {
    expect(revealWords("  Every term  traced ")).toEqual([
      { word: "Every", i: 0 },
      { word: "term", i: 1 },
      { word: "traced", i: 2 },
    ]);
  });

  it("keeps the honesty rules: no outcome promised, nothing called binding or proof for court", () => {
    const all = [
      HERO.lede,
      TAGLINE,
      ...STORY.flatMap((step) => [step.title, step.body, ...(step.points ?? [])]),
      ...LIMITS.map((limit) => limit.body),
      ...FAQ.map((item) => item.a),
    ].join(" ");
    expect(all).not.toMatch(
      /legally binding|court proof|guarantee(s|d)? (you|a|the) |will win|demo|hackathon|sandbox/i,
    );
    expect(all).not.toMatch(/\w-\w/);
  });

  it("gives the navigation's anchors a step to land on", () => {
    expect(STORY.map((step) => step.anchor).filter(Boolean)).toEqual(["how", "get"]);
  });
});
