import { createHash, randomBytes } from "node:crypto";

export const apiScopes = ["calculators:read", "calculations:run", "calculations:batch", "leads:read", "webhooks:manage"] as const;
export type ApiScope = (typeof apiScopes)[number];

export function createApiKeySecret(prefix = "cm_live") {
  const secret = `${prefix}_${randomBytes(32).toString("base64url")}`;
  return { secret, hash: hashApiKey(secret), prefix: secret.slice(0, 18) };
}

export function hashApiKey(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

export function normalizeScopes(value: unknown): ApiScope[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((scope): scope is ApiScope => apiScopes.includes(scope as ApiScope)))];
}

export function hasScope(scopes: readonly string[], required: ApiScope): boolean {
  return scopes.includes(required);
}
