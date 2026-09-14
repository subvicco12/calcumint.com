import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { canChangeBillingIntervalImmediately, canShowAds, canUsePremiumExports, requiresEndOfTermSchedule } from "./plans";
import { planForSubscriptionStatus } from "./entitlements";
import { verifyPaddleSignature } from "./paddle";

describe("B4 billing policy", () => {
  it("shows ads only to anonymous and Free users", () => {
    expect(canShowAds(null)).toBe(true);
    expect(canShowAds("free")).toBe(true);
    expect(canShowAds("pro")).toBe(false);
    expect(canShowAds("business")).toBe(false);
  });

  it("gates exports to paid plans", () => {
    expect(canUsePremiumExports("free")).toBe(false);
    expect(canUsePremiumExports("pro")).toBe(true);
    expect(canUsePremiumExports("business")).toBe(true);
  });

  it("allows monthly to yearly immediately but defers yearly to monthly", () => {
    expect(canChangeBillingIntervalImmediately("monthly", "yearly")).toBe(true);
    expect(canChangeBillingIntervalImmediately("yearly", "monthly")).toBe(false);
    expect(requiresEndOfTermSchedule("yearly", "monthly")).toBe(true);
  });

  it("keeps paid entitlement during active, trialing and dunning grace statuses", () => {
    expect(planForSubscriptionStatus("active", "pro")).toBe("pro");
    expect(planForSubscriptionStatus("trialing", "pro")).toBe("pro");
    expect(planForSubscriptionStatus("past_due", "pro")).toBe("pro");
    expect(planForSubscriptionStatus("canceled", "pro")).toBe("free");
  });
});

describe("Paddle signature verification", () => {
  it("accepts a valid fresh HMAC and rejects tampering", () => {
    const secret = "test_webhook_secret";
    const rawBody = '{"event_id":"evt_123"}';
    const timestampSeconds = 1_700_000_000;
    const signature = createHmac("sha256", secret).update(`${timestampSeconds}:${rawBody}`).digest("hex");
    const header = `ts=${timestampSeconds};h1=${signature}`;
    const now = timestampSeconds * 1000;

    expect(verifyPaddleSignature(rawBody, header, secret, now)).toBe(true);
    expect(verifyPaddleSignature(`${rawBody} `, header, secret, now)).toBe(false);
  });

  it("rejects stale webhook signatures", () => {
    const secret = "test_webhook_secret";
    const rawBody = "{}";
    const timestampSeconds = 1_700_000_000;
    const signature = createHmac("sha256", secret).update(`${timestampSeconds}:${rawBody}`).digest("hex");
    expect(verifyPaddleSignature(rawBody, `ts=${timestampSeconds};h1=${signature}`, secret, (timestampSeconds + 10) * 1000)).toBe(false);
  });
});
