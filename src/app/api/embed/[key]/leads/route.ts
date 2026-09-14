import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { publicLeadSchema } from "@/lib/embeds/schema";

type RouteProps = { params: Promise<{ key: string }> };

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { key } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const parsed = publicLeadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  const { data: config } = await admin.from("embed_configs").select("id,organization_id,calculator_id,status,lead_capture_enabled,lead_fields,consent_text,privacy_url").eq("public_key", key).eq("status", "active").maybeSingle();
  if (!config || !config.lead_capture_enabled) return NextResponse.json({ error: "Lead capture unavailable" }, { status: 404 });

  for (const field of config.lead_fields ?? []) {
    if (field === "email" && !parsed.data.email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (field === "name" && !parsed.data.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { data: lead, error } = await admin.from("embed_leads").insert({
    organization_id: config.organization_id,
    embed_config_id: config.id,
    calculator_id: config.calculator_id,
    name: parsed.data.name || null,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    company: parsed.data.company || null,
    calculation_input: parsed.data.input ?? null,
    calculation_output: parsed.data.output ?? null,
    source_url: parsed.data.sourceUrl ?? null
  }).select("id").single();
  if (error || !lead) return NextResponse.json({ error: "Could not save lead" }, { status: 500 });

  await Promise.all([
    admin.from("lead_consents").insert({ lead_id: lead.id, consent_text: config.consent_text ?? "Lead submission consent", privacy_url: config.privacy_url ?? null, consented: true }),
    admin.from("embed_events").insert({ organization_id: config.organization_id, embed_config_id: config.id, calculator_id: config.calculator_id, event_type: "lead_submit", source_url: parsed.data.sourceUrl ?? null })
  ]);
  return NextResponse.json({ ok: true });
}
