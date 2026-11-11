import { useEffect, useState } from "react";

/** Whether the window is at least `rem` wide, kept current as it is resized. */
export function useWide(rem: number): boolean {
  const query = `(min-width: ${String(rem)}rem)`;
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => {
      setWide(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
    };
  }, [query]);
  return wide;
}
