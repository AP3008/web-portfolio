import { NextResponse } from "next/server";
import { WHOOP } from "@/lib/constants";
import { getWhoopAccessToken, type LivePulse } from "@/lib/whoop";

export const revalidate = 3600;

interface Scored<T> {
  score_state: "SCORED" | "PENDING_SCORE" | "UNSCORABLE";
  score?: T;
}

/** Resolves null on 404 (e.g. a cycle with no sleep yet); throws on any other non-200. */
async function whoopGet<T>(path: string, accessToken: string): Promise<T | null> {
  const res = await fetch(`${WHOOP.API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Whoop ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/** "2026-11-24T05:00:00Z" + "-05:00" → "2026-11-24": the cycle's start date in its own timezone. */
function localDate(start: string, offset: string): string {
  const [, sign, hh, mm] = offset.match(/^([+-])(\d{2}):(\d{2})$/) ?? [];
  if (!sign) throw new Error(`Unexpected Whoop timezone_offset: ${offset}`);
  const offsetMs = (sign === "-" ? -1 : 1) * (Number(hh) * 60 + Number(mm)) * 60_000;
  return new Date(Date.parse(start) + offsetMs).toISOString().slice(0, 10);
}

export async function GET() {
  try {
    const accessToken = await getWhoopAccessToken();

    // Anchor on the latest scored recovery so all three metrics come from one Whoop day.
    const recoveries = await whoopGet<{
      records: (Scored<{ recovery_score: number }> & { cycle_id: number })[];
    }>("/v2/recovery?limit=5", accessToken);
    const recovery = recoveries?.records.find((r) => r.score_state === "SCORED" && r.score);
    if (!recovery?.score) throw new Error("No scored Whoop recovery in the latest 5 records");

    const [cycle, sleep] = await Promise.all([
      whoopGet<Scored<{ strain: number }> & { start: string; timezone_offset: string }>(
        `/v2/cycle/${recovery.cycle_id}`,
        accessToken
      ),
      whoopGet<Scored<{ sleep_performance_percentage?: number }>>(
        `/v2/cycle/${recovery.cycle_id}/sleep`,
        accessToken
      ),
    ]);
    if (!cycle) throw new Error(`Whoop cycle ${recovery.cycle_id} not found`);

    const strain = cycle.score_state === "SCORED" ? cycle.score?.strain : undefined;
    const sleepPerformance =
      sleep?.score_state === "SCORED" ? sleep.score?.sleep_performance_percentage : undefined;

    // Only public metrics leave the server; HRV, RHR, SpO2 and skin temp are dropped here.
    const pulse: LivePulse = {
      date: localDate(cycle.start, cycle.timezone_offset),
      recovery: Math.round(recovery.score.recovery_score),
      strain: strain == null ? null : Math.round(strain * 10) / 10,
      sleepPerformance: sleepPerformance == null ? null : Math.round(sleepPerformance),
    };

    return NextResponse.json(pulse, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Whoop API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
