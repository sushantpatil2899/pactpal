import { useEffect, useRef, useState } from "react";

/**
 * Which of a list of elements is crossing the middle of the window: the step a pinned list
 * should light up. Give each element `ref={track(i)}`.
 */
export function useActiveStep(count: number): {
  active: number;
  track: (i: number) => (el: HTMLElement | null) => void;
} {
  const [active, setActive] = useState(0);
  const elements = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(elements.current.indexOf(entry.target as HTMLElement));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of elements.current.slice(0, count)) if (el) watch.observe(el);
    return () => {
      watch.disconnect();
    };
  }, [count]);
  const track = (i: number) => (el: HTMLElement | null) => {
    elements.current[i] = el;
  };
  return { active, track };
}
