import { describe, expect, it } from "vitest";
import { signEmbedSession, verifyEmbedSession } from "./session";

const secret = "local-test-only-secret-at-least-32-characters";
const now = 1_800_000_000_000;
const claims = {
  configId: "11111111-1111-4111-8111-111111111111",
  calculatorId: "22222222-2222-4222-8222-222222222222",
  organizationId: "33333333-3333-4333-8333-333333333333",
  version: 2,
  expiresAt: now + 5 * 60_000
};

describe("signed embed session capability", () => {
  it("round-trips valid claims", () => expect(verifyEmbedSession(signEmbedSession(claims, secret), secret, now)).toEqual(claims));
  it("rejects forged signatures and wrong secrets", () => {
    const token = signEmbedSession(claims, secret);
    expect(verifyEmbedSession(token + "x", secret, now)).toBeNull();
    expect(verifyEmbedSession(token, "different-secret-that-is-at-least-32-characters", now)).toBeNull();
  });
  it("rejects expired and excessively long-lived capabilities", () => {
    expect(verifyEmbedSession(signEmbedSession({ ...claims, expiresAt: now - 1 }, secret), secret, now)).toBeNull();
    expect(verifyEmbedSession(signEmbedSession({ ...claims, expiresAt: now + 16 * 60_000 }, secret), secret, now)).toBeNull();
  });
  it("fails closed on malformed tokens or absent secret", () => {
    expect(verifyEmbedSession("invalid", secret, now)).toBeNull();
    expect(verifyEmbedSession(null, secret, now)).toBeNull();
    expect(verifyEmbedSession(signEmbedSession(claims, secret), "", now)).toBeNull();
    expect(() => signEmbedSession(claims, "short")).toThrow();
  });
});
