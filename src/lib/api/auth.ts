import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { hashApiKey, hasScope, normalizeScopes, type ApiScope } from "./api-keys";

export type ApiPrincipal = {
  keyId: string;
  organizationId: string;
  scopes: ApiScope[];
  rateLimitPerMinute: number;
  monthlyQuota: number;
};

export async function authenticateApiRequest(request: Request, requiredScope: ApiScope): Promise<ApiPrincipal> {
  const header = request.headers.get("authorization") ?? "";
  const secret = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!secret) throw new ApiAuthError(401, "Missing API key");

  const admin = createSupabaseAdminClient();
  if (!admin) throw new ApiAuthError(503, "API authentication is not configured");
  const keyHash = hashApiKey(secret);
  const { data: key, error } = await admin
    .from("business_api_keys")
    .select("id,organization_id,scopes,status,rate_limit_per_minute,monthly_quota")
    .eq("key_hash", keyHash)
    .maybeSingle();
  if (error || !key || key.status !== "active") throw new ApiAuthError(401, "Invalid API key");

  const scopes = normalizeScopes(key.scopes);
  if (!hasScope(scopes, requiredScope)) throw new ApiAuthError(403, "API key lacks required scope");

  const { data: allowed, error: quotaError } = await admin.rpc("consume_business_api_quota", { p_api_key_id: key.id });
  if (quotaError) throw new ApiAuthError(503, "Usage metering unavailable");
  if (!allowed) throw new ApiAuthError(429, "API quota exceeded");

  await admin.from("business_api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", key.id);
  return {
    keyId: String(key.id),
    organizationId: String(key.organization_id),
    scopes,
    rateLimitPerMinute: Number(key.rate_limit_per_minute),
    monthlyQuota: Number(key.monthly_quota)
  };
}

export class ApiAuthError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiAuthError";
  }
}
