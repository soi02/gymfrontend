import { useEffect, useState } from "react";

export default function useIsDesktop(breakpoint = 1024) {
  const getMatch = () => window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
  const [isDesktop, setIsDesktop] = useState(getMatch);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const handler = e => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isDesktop;
}
