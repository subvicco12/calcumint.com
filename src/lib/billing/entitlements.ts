import type { PlanId } from "./plans";

export const paidSubscriptionStatuses = new Set(["active", "trialing", "past_due"]);

export function planForSubscriptionStatus(status: string, purchasedPlan: Exclude<PlanId, "free">): PlanId {
  return paidSubscriptionStatuses.has(status) ? purchasedPlan : "free";
}

export function normalizePlan(value: unknown): PlanId {
  return value === "pro" || value === "business" ? value : "free";
}
