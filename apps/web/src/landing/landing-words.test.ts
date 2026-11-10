import { describe, expect, it } from "vitest";
import {
  CLAIM,
  FAQ,
  FEATURES,
  HERO,
  LIMITS,
  MOVES,
  PILLARS,
  RAILS,
  STICKERS,
  TAGLINE,
  TOUR,
  revealWords,
} from "./landing-words";

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
      ...PILLARS.flatMap((pillar) => [pillar.title, pillar.body]),
      ...MOVES.flatMap((move) => [move.title, move.body]),
      ...STICKERS.map((sticker) => sticker.deal),
      ...RAILS.map((rail) => rail.body),
      ...TOUR.map((stop) => stop.body),
      ...FEATURES.map((feature) => feature.body),
      CLAIM.text,
      ...LIMITS.map((limit) => limit.body),
      ...FAQ.map((item) => item.a),
    ]
      .join(" ")
      .replaceAll("SHA-256", "SHA256")
      .replaceAll("Pre-delivery", "Pre delivery");
    expect(all).not.toMatch(
      /legally binding|court proof|guarantee(s|d)? (you|a|the) |will win|demo|hackathon|sandbox/i,
    );
    expect(all).not.toMatch(/\w-\w/);
  });

  it("links each pillar to a part of the page that explains it", () => {
    expect(PILLARS.map((pillar) => pillar.link)).toEqual(["#council", "#how", "#ledger", "#how"]);
  });

  it("marks the claim's statements at the words they are made of", () => {
    const words = revealWords(CLAIM.text).map(({ word }) => word.replace(/[.,]/g, ""));
    expect(CLAIM.parts.map((part) => part.words.map((i) => words[i]).join(" "))).toEqual(
      CLAIM.parts.map((part) => part.said),
    );
  });
});
