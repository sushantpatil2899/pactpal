import { useEffect } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Starts the page's scroll motion. StringTune's progress module writes how far each element marked
 * `string="progress"` has travelled through the window to its `--progress`, which the styles turn
 * into motion. Native scrolling is kept on every device (no smoothing, no scroll jacking), and
 * with reduced motion nothing starts: the styles then show every part in its finished state.
 * Elements marked `data-reveal` get `data-shown` once they first come into view.
 */
export function useScrollStory(): void {
  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) {
      document.documentElement.dataset.motion = "reduced";
      return;
    }
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "";
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      reveal.observe(el);
    });
    let stop: (() => void) | undefined;
    let cancelled = false;
    void import("@fiddle-digital/string-tune").then(({ default: StringTune, StringProgress }) => {
      if (cancelled) return;
      const tune = StringTune.getInstance();
      tune.scrollDesktopMode = "default";
      tune.scrollMobileMode = "default";
      tune.use(StringProgress);
      tune.start(60);
      // Positions are measured once; measure again whenever the page's height changes (fonts
      // arriving, a question opened), at most once a frame.
      let frame = 0;
      const remeasure = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          tune.onResize(true);
        });
      });
      remeasure.observe(document.body);
      stop = () => {
        cancelAnimationFrame(frame);
        remeasure.disconnect();
        tune.destroy();
      };
    });
    return () => {
      cancelled = true;
      reveal.disconnect();
      stop?.();
    };
  }, []);
}
