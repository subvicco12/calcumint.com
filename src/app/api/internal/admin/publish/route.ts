import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { serverEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = serverEnv.ADMIN_WORKER_SECRET;
  if (!secret) return false;
  const authorization = request.headers.get("authorization") ?? "";
  return authorization === `Bearer ${secret}`;
}

async function raiseBlockedAlert(admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>, calculatorId: string, reason: string) {
  const { data: existing } = await admin.from("admin_alerts").select("id").eq("calculator_id", calculatorId).eq("alert_type", "scheduled-publish-blocked").eq("status", "open").maybeSingle();
  if (existing?.id) {
    await admin.from("admin_alerts").update({ severity: "critical", message: reason, created_at: new Date().toISOString() }).eq("id", existing.id);
  } else {
    await admin.from("admin_alerts").insert({ calculator_id: calculatorId, severity: "critical", alert_type: "scheduled-publish-blocked", message: reason, status: "open" });
  }
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 503 });

  await admin.rpc("refresh_admin_review_alerts");
  const now = new Date().toISOString();
  const { data: due, error } = await admin.from("calculator_catalog_admin")
    .select("id,slug")
    .eq("lifecycle", "certified")
    .not("publish_at", "is", null)
    .lte("publish_at", now)
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const published: string[] = [];
  const blocked: Array<{ id: string; reason: string }> = [];
  for (const calculator of due ?? []) {
    const { data: gate, error: gateError } = await admin.rpc("validate_calculator_publish_gate", { p_calculator_id: calculator.id });
    const result = Array.isArray(gate) ? gate[0] : gate;
    if (gateError || !result?.ok) {
      const reason = gateError?.message ?? (result?.failures ?? ["Publishing gate failed"]).join("; ");
      blocked.push({ id: calculator.id, reason });
      await raiseBlockedAlert(admin, calculator.id, reason);
      continue;
    }
    const { error: updateError } = await admin.from("calculator_catalog_admin").update({ lifecycle: "published", published_at: now, publish_at: null, next_review_due_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() }).eq("id", calculator.id);
    if (updateError) {
      blocked.push({ id: calculator.id, reason: updateError.message });
      await raiseBlockedAlert(admin, calculator.id, updateError.message);
    } else {
      published.push(calculator.id);
      await admin.from("admin_alerts").update({ status: "resolved", resolved_at: now }).eq("calculator_id", calculator.id).eq("alert_type", "scheduled-publish-blocked").eq("status", "open");
    }
  }

  return NextResponse.json({ processed: (due ?? []).length, published, blocked });
}
