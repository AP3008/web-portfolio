"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function Gatekeeper() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Panel — 3D Mode */}
      <Link
        href={ROUTES.THREE_D}
        className="group relative flex flex-1 flex-col items-center justify-center
                   border-b border-border md:border-b-0 md:border-r
                   transition-colors duration-300 hover:bg-surface"
      >
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="text-accent font-mono text-sm tracking-widest uppercase opacity-60">
            {">"} select mode
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground
                         group-hover:text-accent transition-colors duration-300">
            3D Mode
          </h2>
          <p className="max-w-xs text-center text-sm text-text-muted leading-relaxed">
            Immersive desktop experience. Explore an interactive 3D workspace.
          </p>
          <div className="mt-4 rounded border border-accent/30 px-6 py-2
                          text-accent text-sm font-mono tracking-wider
                          group-hover:border-accent group-hover:bg-accent/10
                          transition-all duration-300">
            ENTER
          </div>
        </div>

        <div className="absolute top-4 left-4 text-border text-xs font-mono">
          [01]
        </div>
      </Link>

      {/* Right Panel — 2D Mode (disabled) */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center
                   opacity-40 cursor-not-allowed"
        aria-disabled="true"
      >
        <div className="flex flex-col items-center gap-4 p-8">
          <div className="text-text-muted font-mono text-sm tracking-widest uppercase opacity-60">
            {">"} select mode
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            2D Mode
          </h2>
          <p className="max-w-xs text-center text-sm text-text-muted leading-relaxed">
            Classic portfolio layout. Coming soon.
          </p>
          <div className="mt-4 rounded border border-border px-6 py-2
                          text-text-muted text-sm font-mono tracking-wider">
            COMING SOON
          </div>
        </div>

        <div className="absolute top-4 left-4 text-border text-xs font-mono">
          [02]
        </div>
      </div>
    </div>
  );
}
