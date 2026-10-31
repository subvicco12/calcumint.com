import { isAuthSessionMissingError } from "@supabase/supabase-js";
import { AiAccessError } from "./request-errors";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canUseAiFeature, type AiFeature, type Plan } from "./policy";

export async function getAiSession() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError && !(user === null && isAuthSessionMissingError(authError))) throw new Error("AI session unavailable");
  if (!user) return null;
  const { data: profile, error: profileError } = await supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle();
  if (profileError) throw new Error("AI session unavailable");
  const plan = (["free", "pro", "business"].includes(String(profile?.plan)) ? profile?.plan : "free") as Plan;
  return { supabase, user, plan };
}

export async function consumeAiAccess(feature: AiFeature) {
  const session = await getAiSession();
  if (!session) throw new AiAccessError("Sign in to use AI-assisted features", 403);
  if (!canUseAiFeature(session.plan, feature)) throw new AiAccessError(feature === "builder" ? "Business plan required" : "Pro or Business plan required", 403);
  const { data, error } = await session.supabase.rpc("consume_ai_quota", { p_feature: feature });
  if (error) {
    const denial = new Map<string, 403 | 429>([
      ["Authentication required", 403], ["Business plan required", 403],
      ["Pro or Business plan required", 403], ["Builder permission required", 403],
      ["Monthly AI request limit reached", 429], ["AI request rate limit reached", 429]
    ]);
    const status = denial.get(error.message);
    if (status) throw new AiAccessError(error.message, status);
    throw new Error("AI access unavailable");
  }
  const receipt = typeof data === "number" || (typeof data === "string" && /^[1-9]\d*$/.test(data)) ? Number(data) : Number.NaN;
  if (!Number.isSafeInteger(receipt) || receipt <= 0) throw new Error("AI access unavailable");
  return { ...session, usageId: receipt };
}

export async function finishAiUsage(
  access: Awaited<ReturnType<typeof consumeAiAccess>>,
  usage: { provider?: string; model?: string; inputTokens?: number; outputTokens?: number } | undefined,
  succeeded: boolean
) {
  const { error } = await access.supabase.rpc("finish_ai_usage", {
    p_usage_id: access.usageId,
    p_provider: usage?.provider ?? "unavailable",
    p_model: usage?.model ?? "unavailable",
    p_input_tokens: usage?.inputTokens ?? 0,
    p_output_tokens: usage?.outputTokens ?? 0,
    p_succeeded: succeeded
  });
  if (error) throw new Error("AI usage accounting unavailable");
}
