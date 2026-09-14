import { describe, expect, it } from "vitest";
import { createApiKeySecret, hashApiKey, hasScope, normalizeScopes } from "./api-keys";
import { nextWebhookRetry, signWebhookPayload, verifyWebhookSignature } from "./webhooks";

describe("Business API security helpers", () => {
  it("creates opaque keys and stores only deterministic hashes", () => {
    const key = createApiKeySecret("cm_test");
    expect(key.secret.startsWith("cm_test_")).toBe(true);
    expect(key.secret).not.toBe(key.hash);
    expect(key.hash).toHaveLength(64);
    expect(hashApiKey(key.secret)).toBe(key.hash);
  });

  it("normalizes known scopes and rejects unknown values", () => {
    const scopes = normalizeScopes(["calculations:run", "calculations:run", "root", 123]);
    expect(scopes).toEqual(["calculations:run"]);
    expect(hasScope(scopes, "calculations:run")).toBe(true);
    expect(hasScope(scopes, "leads:read")).toBe(false);
  });

  it("signs outbound webhook payloads and rejects tampering", () => {
    const signature = signWebhookPayload("secret", 12345, '{"ok":true}');
    expect(verifyWebhookSignature("secret", 12345, '{"ok":true}', signature)).toBe(true);
    expect(verifyWebhookSignature("secret", 12345, '{"ok":false}', signature)).toBe(false);
  });

  it("uses capped exponential webhook retries", () => {
    const base = Date.UTC(2026, 0, 1);
    expect(nextWebhookRetry(1, base).getTime() - base).toBe(60_000);
    expect(nextWebhookRetry(4, base).getTime() - base).toBe(8 * 60_000);
    expect(nextWebhookRetry(99, base).getTime() - base).toBe(120 * 60_000);
  });
});
