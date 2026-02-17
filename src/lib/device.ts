"use client";

import { useState, useEffect } from "react";
import { DESKTOP_MIN_WIDTH } from "./constants";

/**
 * Returns true when viewport width >= DESKTOP_MIN_WIDTH.
 * Returns false during SSR and on small viewports.
 */
export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_MIN_WIDTH);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isDesktop;
}
