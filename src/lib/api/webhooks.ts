import { createHmac, timingSafeEqual } from "node:crypto";

export function signWebhookPayload(secret: string, timestamp: number, payload: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
}

export function verifyWebhookSignature(secret: string, timestamp: number, payload: string, signature: string): boolean {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = Buffer.from(signWebhookPayload(secret, timestamp, payload), "hex");
  const actual = Buffer.from(signature, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function nextWebhookRetry(attempt: number, now = Date.now()): Date {
  const safeAttempt = Math.max(1, Math.min(attempt, 8));
  const delayMinutes = Math.min(2 ** (safeAttempt - 1), 120);
  return new Date(now + delayMinutes * 60_000);
}

export function webhookHeaders(secret: string, payload: string, timestamp = Math.floor(Date.now() / 1000)) {
  return {
    "content-type": "application/json",
    "user-agent": "CalcuMint-Webhooks/1.0",
    "x-calcumint-timestamp": String(timestamp),
    "x-calcumint-signature": `v1=${signWebhookPayload(secret, timestamp, payload)}`
  } as const;
}
