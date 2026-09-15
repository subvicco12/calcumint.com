import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { embedEventSchema } from "@/lib/embeds/schema";

type RouteProps = { params: Promise<{ key: string }> };

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { key } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const parsed = embedEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const { data: config } = await admin.from("embed_configs").select("id,organization_id,calculator_id,status").eq("public_key", key).eq("status", "active").maybeSingle();
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { error } = await admin.from("embed_events").insert({ organization_id: config.organization_id, embed_config_id: config.id, calculator_id: config.calculator_id, event_type: parsed.data.type, source_url: parsed.data.sourceUrl ?? null, referrer: parsed.data.referrer ?? null, metadata: parsed.data.metadata ?? {} });
  return error ? NextResponse.json({ error: "Could not record event" }, { status: 500 }) : NextResponse.json({ ok: true });
}
