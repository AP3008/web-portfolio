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
      <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-6 max-w-md">
          <div className="text-accent font-mono text-4xl">{"///"}</div>
          <h1 className="text-2xl font-bold tracking-tight">
            Desktop Required
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            The 3D experience requires a viewport of at least{" "}
            <span className="text-accent font-mono">{DESKTOP_MIN_WIDTH}px</span>.
            Please visit on a desktop browser.
          </p>
          <Link
            href="/"
            className="mt-4 rounded border border-border px-6 py-2
                       text-foreground text-sm font-mono tracking-wider
                       hover:border-accent hover:text-accent
                       transition-all duration-300"
          >
            {"<"} BACK
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
