import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const claimsSchema = z.object({
  configId: z.string().uuid(),
  calculatorId: z.string().uuid(),
  organizationId: z.string().uuid(),
  version: z.number().int().positive(),
  expiresAt: z.number().int().positive()
}).strict();
export type EmbedSessionClaims = z.infer<typeof claimsSchema>;

/** A short-lived bearer capability; never use a public embed key as its signing secret. */
export function signEmbedSession(claims: EmbedSessionClaims, secret: string): string {
  if (secret.length < 32) throw new Error("Embed session signing secret is not configured");
  const payload = Buffer.from(JSON.stringify(claimsSchema.parse(claims))).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyEmbedSession(token: string | null | undefined, secret: string, now = Date.now()): EmbedSessionClaims | null {
  if (!token || secret.length < 32 || token.length > 4096) return null;
  const pieces = token.split(".");
  if (pieces.length !== 2 || !pieces[0] || !pieces[1]) return null;
  const expected = createHmac("sha256", secret).update(pieces[0]).digest();
  let supplied: Buffer;
  try { supplied = Buffer.from(pieces[1], "base64url"); } catch { return null; }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  try {
    const claims = claimsSchema.parse(JSON.parse(Buffer.from(pieces[0], "base64url").toString("utf8")));
    return claims.expiresAt > now && claims.expiresAt <= now + 15 * 60_000 ? claims : null;
  } catch { return null; }
}

/** Mint an expiring capability outside React's render-phase clock access. */
export function issueEmbedSession(claims: Omit<EmbedSessionClaims, "expiresAt">, secret: string): string {
  return signEmbedSession({ ...claims, expiresAt: Date.now() + 5 * 60_000 }, secret);
}
