"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface TransitionOverlayProps {
  color: string;
}

export function TransitionOverlay({ color }: TransitionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!overlayRef.current) return;

    gsap.to(overlayRef.current, {
      clipPath: "inset(0 0 0 100%)",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => setDone(true),
    });
  }, []);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50"
      style={{
        background: color,
        clipPath: "inset(0 0 0 0)",
      }}
    />
  );
}
