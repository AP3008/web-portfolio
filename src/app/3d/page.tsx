import { DesktopGuard } from "@/components/gate/DesktopGuard";

export default function ThreeDPage() {
  return (
    <DesktopGuard>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-accent font-mono text-sm tracking-widest animate-pulse">
            {">"} initializing scene...
          </div>
          <p className="text-text-muted text-xs font-mono">
            Canvas will be mounted here
          </p>
        </div>
      </div>
    </DesktopGuard>
  );
}
