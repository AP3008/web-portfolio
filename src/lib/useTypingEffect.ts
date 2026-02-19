"use client";

import { useState, useEffect } from "react";

export function useTypingEffect(text: string, speed: number = 80) {
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (displayedCount >= text.length) return;
    const timeout = setTimeout(() => {
      setDisplayedCount((c) => c + 1);
    }, speed);
    return () => clearTimeout(timeout);
  }, [displayedCount, text, speed]);

  return text.slice(0, displayedCount);
}
