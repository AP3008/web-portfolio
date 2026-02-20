"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsDesktop } from "@/lib/device";
import { DESKTOP_MIN_WIDTH, ROUTES } from "@/lib/constants";

interface DesktopGuardProps {
  children: React.ReactNode;
}

export function DesktopGuard({ children }: DesktopGuardProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (window.innerWidth >= DESKTOP_MIN_WIDTH) return;
    sessionStorage.setItem("desktop_redirect_notice_pending", "1");
    router.replace(ROUTES.TWO_D);
  }, [router]);

  if (!isDesktop) return null;

  return <>{children}</>;
}
