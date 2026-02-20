"use client";

import Link from "next/link";
import { useIsDesktop } from "@/lib/device";
import { DESKTOP_MIN_WIDTH } from "@/lib/constants";

interface DesktopGuardProps {
  children: React.ReactNode;
}

export function DesktopGuard({ children }: DesktopGuardProps) {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-8 text-center"
        style={{
          backgroundColor: "#191724",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <div className="flex flex-col items-center gap-6 max-w-md">
          <div className="text-4xl font-bold" style={{ color: "#c4a7e7" }}>
            {"///"}
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#e0def4" }}
          >
            Desktop Required
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#908caa" }}
          >
            The 3D experience requires a viewport of at least{" "}
            <span className="font-bold" style={{ color: "#9ccfd8" }}>
              {DESKTOP_MIN_WIDTH}px
            </span>
            . Please visit on a desktop browser.
          </p>
          <Link
            href="/"
            className="mt-4 rounded px-6 py-2 text-sm tracking-wider transition-all duration-300"
            style={{
              border: "1px solid #403d52",
              color: "#e0def4",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#c4a7e7";
              e.currentTarget.style.color = "#c4a7e7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#403d52";
              e.currentTarget.style.color = "#e0def4";
            }}
          >
            {"<"} BACK
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
