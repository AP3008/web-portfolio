"use client";

import { useState, useEffect } from "react";

type ViewState =
  | { status: "loading" }
  | { status: "loaded"; count: number }
  | { status: "error" };

export function PageViewsBox() {
  const [state, setState] = useState<ViewState>({ status: "loading" });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_VIEWS_API_URL;
    if (!url) {
      setState({ status: "error" });
      return;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("non-2xx");
        return res.json() as Promise<{ views: number }>;
      })
      .then((data) => setState({ status: "loaded", count: data.views }))
      .catch(() => setState({ status: "error" }));
  }, []);

  if (state.status === "loading") {
    return (
      <div
        className="h-8 w-24 animate-pulse rounded"
        style={{ background: "var(--rp-overlay)" }}
      />
    );
  }

  const display =
    state.status === "loaded" ? state.count.toLocaleString("en-US") : "0";

  return (
    <span
      className="text-2xl font-bold sm:text-3xl"
      style={{ color: "var(--rp-text)" }}
    >
      {display}
    </span>
  );
}
