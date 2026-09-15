import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { canChangeBillingIntervalImmediately, canShowAds, canUsePremiumExports, requiresEndOfTermSchedule } from "./plans";
import { planForSubscriptionStatus } from "./entitlements";

vi.mock("../env", () => ({
  publicEnv: { NEXT_PUBLIC_PADDLE_ENV: "sandbox" },
  serverEnv: {
    PADDLE_PRO_MONTHLY_PRICE_ID: "pri_pro_monthly",
    PADDLE_PRO_YEARLY_PRICE_ID: "pri_pro_yearly",
    PADDLE_BUSINESS_MONTHLY_PRICE_ID: "pri_business_monthly",
    PADDLE_BUSINESS_YEARLY_PRICE_ID: "pri_business_yearly"
  }
}));

import { selectionForPriceId, subscriptionChangeMode, verifyPaddleSignature } from "./paddle";

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

  it("updates paid upgrades in place and defers downgrades", () => {
    expect(subscriptionChangeMode("pro", "monthly", "business", "monthly")).toBe("immediate");
    expect(subscriptionChangeMode("pro", "monthly", "pro", "yearly")).toBe("immediate");
    expect(subscriptionChangeMode("pro", "yearly", "pro", "monthly")).toBe("deferred");
    expect(subscriptionChangeMode("business", "monthly", "pro", "monthly")).toBe("deferred");
    expect(subscriptionChangeMode("business", "yearly", "business", "yearly")).toBe("unchanged");
  });
});

describe("Paddle price mapping", () => {
  it("maps all four configured paid prices to authoritative plan and interval", () => {
    expect(selectionForPriceId("pri_pro_monthly")).toEqual({ plan: "pro", interval: "monthly" });
    expect(selectionForPriceId("pri_pro_yearly")).toEqual({ plan: "pro", interval: "yearly" });
    expect(selectionForPriceId("pri_business_monthly")).toEqual({ plan: "business", interval: "monthly" });
    expect(selectionForPriceId("pri_business_yearly")).toEqual({ plan: "business", interval: "yearly" });
  });

  it("rejects missing and unknown paid prices", () => {
    expect(selectionForPriceId(null)).toBeNull();
    expect(selectionForPriceId("pri_unknown")).toBeNull();
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
