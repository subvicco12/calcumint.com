import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canUseAiFeature, type AiFeature, type Plan } from "./policy";

export async function getAiSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  const plan = (["free", "pro", "business"].includes(String(profile?.plan)) ? profile?.plan : "free") as Plan;
  return { supabase, user, plan };
}

export async function consumeAiAccess(feature: AiFeature) {
  const session = await getAiSession();
  if (!session) throw new Error("Sign in to use AI-assisted features");
  if (!canUseAiFeature(session.plan, feature)) throw new Error(feature === "builder" ? "Business plan required" : "Pro or Business plan required");
  const { data, error } = await session.supabase.rpc("consume_ai_quota", { p_feature: feature });
  if (error) throw new Error(error.message);
  return { ...session, usageId: Number(data) };
}

export async function finishAiUsage(
  access: Awaited<ReturnType<typeof consumeAiAccess>>,
  usage: { provider?: string; model?: string; inputTokens?: number; outputTokens?: number } | undefined,
  succeeded: boolean
) {
  await access.supabase.rpc("finish_ai_usage", {
    p_usage_id: access.usageId,
    p_provider: usage?.provider ?? "unavailable",
    p_model: usage?.model ?? "unavailable",
    p_input_tokens: usage?.inputTokens ?? 0,
    p_output_tokens: usage?.outputTokens ?? 0,
    p_succeeded: succeeded
  });
}
