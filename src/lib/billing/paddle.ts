import { createHmac, timingSafeEqual } from "node:crypto";
import { publicEnv, serverEnv } from "../env";
import type { BillingInterval, PlanId } from "./plans";

export type PaidPlan = Exclude<PlanId, "free">;
export type SubscriptionChangeMode = "unchanged" | "immediate" | "deferred";
export type PaddlePriceSelection = { plan: PaidPlan; interval: BillingInterval };

export function subscriptionChangeMode(
  currentPlan: PaidPlan,
  currentInterval: BillingInterval,
  targetPlan: PaidPlan,
  targetInterval: BillingInterval
): SubscriptionChangeMode {
  if (currentPlan === targetPlan && currentInterval === targetInterval) return "unchanged";
  // Never shorten a prepaid annual commitment mid-term. Annual downgrades and
  // annual-to-monthly moves remain renewal-time changes.
  if (currentInterval === "yearly" && (targetInterval === "monthly" || (currentPlan === "business" && targetPlan === "pro"))) return "deferred";
  // A monthly Business customer may choose Pro yearly immediately: Paddle
  // previews/prorates the cross-plan + cross-interval change before consent.
  if (currentPlan === "business" && targetPlan === "pro" && targetInterval === "monthly") return "deferred";
  return "immediate";
}

export function paddleApiBaseUrl(): string {
  return publicEnv.NEXT_PUBLIC_PADDLE_ENV === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";
}

export function getPriceId(plan: PaidPlan, interval: BillingInterval): string | null {
  if (plan === "pro") {
    return interval === "monthly"
      ? serverEnv.PADDLE_PRO_MONTHLY_PRICE_ID ?? null
      : serverEnv.PADDLE_PRO_YEARLY_PRICE_ID ?? null;
  }
  return interval === "monthly"
    ? serverEnv.PADDLE_BUSINESS_MONTHLY_PRICE_ID ?? null
    : serverEnv.PADDLE_BUSINESS_YEARLY_PRICE_ID ?? null;
}

export function getProPriceId(interval: BillingInterval): string | null {
  return getPriceId("pro", interval);
}

export function selectionForPriceId(priceId: string | null): PaddlePriceSelection | null {
  if (!priceId) return null;
  const selections: PaddlePriceSelection[] = [
    { plan: "pro", interval: "monthly" },
    { plan: "pro", interval: "yearly" },
    { plan: "business", interval: "monthly" },
    { plan: "business", interval: "yearly" }
  ];
  return selections.find(({ plan, interval }) => getPriceId(plan, interval) === priceId) ?? null;
}

export async function paddleRequest<T>(path: string, init: RequestInit): Promise<T> {
  const apiKey = serverEnv.PADDLE_API_KEY;
  if (!apiKey) throw new Error("Paddle API key is not configured");

  const response = await fetch(`${paddleApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = await response.json() as { data?: T; error?: { detail?: string } };
  if (!response.ok || !payload.data) {
    throw new Error(payload.error?.detail ?? `Paddle request failed with ${response.status}`);
  }
  return payload.data;
}

export function verifyPaddleSignature(rawBody: string, signatureHeader: string, secret: string, now = Date.now()): boolean {
  const parts = signatureHeader.split(";").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("ts="))?.slice(3);
  const signatures = parts.filter((part) => part.startsWith("h1=")).map((part) => part.slice(3));
  if (!timestamp || signatures.length === 0) return false;

  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(now - timestampMs) > 5000) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}:${rawBody}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const actualBuffer = Buffer.from(signature, "hex");
    return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
  });
}
