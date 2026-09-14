import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

function deriveEncryptionKey(masterKey: string): Buffer {
  return createHash("sha256").update(masterKey).digest();
}

export function encryptWebhookSecret(secret: string, masterKey: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", deriveEncryptionKey(masterKey), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptWebhookSecret(ciphertext: string, masterKey: string): string {
  const [ivPart, tagPart, encryptedPart] = ciphertext.split(".");
  if (!ivPart || !tagPart || !encryptedPart) throw new Error("Invalid encrypted webhook secret");
  const decipher = createDecipheriv("aes-256-gcm", deriveEncryptionKey(masterKey), Buffer.from(ivPart, "base64url"));
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedPart, "base64url")), decipher.final()]).toString("utf8");
}

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
