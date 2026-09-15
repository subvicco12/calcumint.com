import { NextResponse } from "next/server";
import { buildProductionReadinessReport, summarizeReadiness } from "@/lib/launch/readiness";
import { serverEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const secret = serverEnv.ADMIN_WORKER_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = buildProductionReadinessReport();
  const summary = summarizeReadiness(report);
  return NextResponse.json(
    {
      ...summary,
      checks: report.checks.map((check) => ({ id: check.id, ok: check.ok, message: check.message }))
    },
    { status: report.ready ? 200 : 503, headers: { "cache-control": "no-store" } }
  );
}
