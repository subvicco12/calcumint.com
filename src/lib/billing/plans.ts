export type PlanId = "free" | "pro" | "business";
export type BillingInterval = "monthly" | "yearly";

export const planCatalog = {
  free: { id: "free", name: "Free", tagline: "Calculate", monthlyPriceUsd: 0, yearlyPriceUsd: 0 },
  pro: { id: "pro", name: "Pro", tagline: "Calculate + Analyse", monthlyPriceUsd: 7.99, yearlyPriceUsd: 71.91 },
  business: { id: "business", name: "Business", tagline: "Build + Brand + Automate", monthlyPriceUsd: 29.99, yearlyPriceUsd: 269.91 }
} as const;

export const freeLimits = { favorites: 10, historyEntries: 20 } as const;
export function canShowAds(plan: PlanId | null): boolean { return plan === null || plan === "free"; }
export function canUsePremiumExports(plan: PlanId | null): boolean { return plan === "pro" || plan === "business"; }
export function canChangeBillingIntervalImmediately(current: BillingInterval, next: BillingInterval): boolean { if (current === next) return false; return current === "monthly" && next === "yearly"; }
export function requiresEndOfTermSchedule(current: BillingInterval, next: BillingInterval): boolean { return current === "yearly" && next === "monthly"; }
