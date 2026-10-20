import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { verifyEmbedSession } from "@/lib/embeds/session";
import { publicLeadSchema } from "@/lib/embeds/schema";

type RouteProps = { params: Promise<{ key: string }> };

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { key } = await params;
  const session = verifyEmbedSession(request.headers.get("x-embed-session"), process.env.EMBED_SESSION_SECRET ?? "");
  if (!session) return NextResponse.json({ error: "Embed session unavailable" }, { status: 403 });
  const requestId=z.uuid().safeParse(request.headers.get("Idempotency-Key"));
  if(!requestId.success)return NextResponse.json({error:"A stable Idempotency-Key UUID is required"},{status:400});
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const parsed = publicLeadSchema.extend({consentText:z.string().min(1).max(1000),privacyUrl:z.string().url().max(2048).nullable().default(null)}).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid lead" }, { status: 400 });
  const { data: config, error: configError } = await admin.from("embed_configs").select("id,organization_id,calculator_id,status,lead_capture_enabled,lead_fields,consent_text,privacy_url").eq("public_key", key).eq("status", "active").maybeSingle();
  if (configError) return NextResponse.json({error:"Lead storage unavailable"},{status:503});
  if (!config || !config.lead_capture_enabled) return NextResponse.json({ error: "Lead capture unavailable" }, { status: 404 });
  const { data: calculator, error: calculatorError } = await admin.from("custom_calculators").select("id,published_version").eq("id", config.calculator_id).eq("organization_id", config.organization_id).eq("status", "published").maybeSingle();
  if (calculatorError || !calculator?.published_version || session.configId !== config.id || session.organizationId !== config.organization_id || session.calculatorId !== config.calculator_id || session.version !== calculator.published_version) return NextResponse.json({ error: "Lead capture unavailable" }, { status: 404 });

  for (const field of config.lead_fields ?? []) {
    if (!["name","email","phone","company"].includes(field) || ((field === "name" || field === "email") && !parsed.data[field as "name" | "email"]))
      return NextResponse.json({error:"Required lead fields are missing"},{status:400});
  }
  // The matching SQL remains an unapplied proposal. Never fall back to separate
  // lead/consent writes if the RPC is absent or its completion is uncertain.
  try {
    const reply=await admin.rpc("capture_verified_embed_lead_v1",{
      p_public_key:key,p_config_id:session.configId,p_organization_id:session.organizationId,
      p_calculator_id:session.calculatorId,p_version:session.version,
      p_expires_at:session.expiresAt,p_request_id:requestId.data,p_payload:parsed.data
    });
    if(reply.error){
      if(reply.error.code==="PT412")return NextResponse.json({error:"Consent information changed; reload before submitting",code:"CONSENT_CHANGED"},{status:409});
      if(reply.error.code==="PT409")return NextResponse.json({error:"Lead request conflicts with existing evidence"},{status:409});
      return NextResponse.json({error:"Lead persistence could not be confirmed; retry the same request"},{status:503});
    }
    const result=z.object({status:z.enum(["created","duplicate"]),lead_id:z.uuid()}).safeParse(reply.data);
    if(!result.success)return NextResponse.json({error:"Lead persistence could not be confirmed; retry the same request"},{status:503});
    return NextResponse.json({ok:true,...(result.data.status==="duplicate"?{duplicate:true}:{})},{headers:{"Cache-Control":"no-store"}});
  } catch { return NextResponse.json({error:"Lead persistence could not be confirmed; retry the same request"},{status:503}); }
}
