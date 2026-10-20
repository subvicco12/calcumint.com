import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { signEmbedSession, verifyEmbedSession } from "@/lib/embeds/session";

type RouteProps = { params: Promise<{ key: string }> };

/** Renew only an already-valid session; a public embed key alone is insufficient. */
export async function POST(request: NextRequest, { params }: RouteProps) {
  const { key } = await params;
  const secret = process.env.EMBED_SESSION_SECRET ?? "";
  const claims = verifyEmbedSession(request.headers.get("x-embed-session"), secret);
  if (!claims) return NextResponse.json({ error: "Session expired" }, { status: 403 });
  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  const { data: config, error: configError } = await admin.from("embed_configs").select("id,organization_id,calculator_id").eq("public_key", key).eq("status", "active").maybeSingle();
  if (configError || !config || config.id !== claims.configId || config.organization_id !== claims.organizationId || config.calculator_id !== claims.calculatorId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: calculator, error: calculatorError } = await admin.from("custom_calculators").select("published_version").eq("id", config.calculator_id).eq("organization_id", config.organization_id).eq("status", "published").maybeSingle();
  if (calculatorError || !calculator?.published_version || calculator.published_version !== claims.version) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ sessionToken: signEmbedSession({ ...claims, expiresAt: Date.now() + 5 * 60_000 }, secret) }, { headers: { "Cache-Control": "no-store" } });
}
