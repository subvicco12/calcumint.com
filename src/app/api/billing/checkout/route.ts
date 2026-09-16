import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPriceId, paddleRequest, subscriptionChangeMode } from "@/lib/billing/paddle";
import { publicEnv } from "@/lib/env";

const requestSchema = z.object({
  plan: z.enum(["pro", "business"]).default("pro"),
  interval: z.enum(["monthly", "yearly"]),
  confirmChange: z.boolean().optional().default(false)
});
type PaddleTransaction = { id: string };
type ExistingSubscription = { provider_subscription_id: string; plan: "pro" | "business"; billing_interval: "monthly" | "yearly" };
type PaddleMoney = { amount: string; currency_code: string };
type PaddlePreview = {
  immediate_transaction?: { currency_code?: string; details?: { totals?: { total?: string } } } | null;
  update_summary?: { charge?: PaddleMoney; credit?: PaddleMoney; result?: string } | null;
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Accounts are not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid billing selection" }, { status: 400 });
  const { plan, interval, confirmChange } = parsed.data;
  const priceId = getPriceId(plan, interval);
  if (!priceId) return NextResponse.json({ error: `${plan === "business" ? "Business" : "Pro"} pricing is not configured` }, { status: 503 });

  try {
    const { data: subscriptions, error: subscriptionError } = await supabase.from("subscriptions")
      .select("provider_subscription_id, plan, billing_interval").eq("user_id", user.id)
      .in("status", ["active", "trialing", "past_due"]).order("updated_at", { ascending: false }).limit(2);
    if (subscriptionError) throw new Error("Could not verify the current subscription");
    if ((subscriptions?.length ?? 0) > 1) return NextResponse.json({ error: "Multiple active subscriptions require billing support" }, { status: 409 });

    const existing = subscriptions?.[0] as ExistingSubscription | undefined;
    if (existing) {
      const mode = subscriptionChangeMode(existing.plan, existing.billing_interval, plan, interval);
      if (mode === "unchanged") return NextResponse.json({ error: "This is already your current plan" }, { status: 409 });
      if (mode === "deferred") return NextResponse.json({ error: "Available at your next renewal; contact billing support to schedule this change." }, { status: 409 });

      const changeBody = {
        items: [{ price_id: priceId, quantity: 1 }],
        proration_billing_mode: "prorated_immediately" as const,
        on_payment_failure: "prevent_change" as const,
        custom_data: { calcumint_user_id: user.id, calcumint_plan: plan, billing_interval: interval }
      };

      if (!confirmChange) {
        const preview = await paddleRequest<PaddlePreview>(`/subscriptions/${encodeURIComponent(existing.provider_subscription_id)}/preview`, {
          method: "PATCH",
          body: JSON.stringify(changeBody)
        });
        const immediateTotal = preview.immediate_transaction?.details?.totals?.total;
        const currencyCode = preview.immediate_transaction?.currency_code
          ?? preview.update_summary?.charge?.currency_code
          ?? preview.update_summary?.credit?.currency_code;
        return NextResponse.json({
          confirmationRequired: true,
          currentPlan: existing.plan,
          currentInterval: existing.billing_interval,
          requestedPlan: plan,
          requestedInterval: interval,
          prorationPreview: {
            immediateTotal: immediateTotal ?? null,
            currencyCode: currencyCode ?? null,
            charge: preview.update_summary?.charge?.amount ?? null,
            credit: preview.update_summary?.credit?.amount ?? null,
            result: preview.update_summary?.result ?? null
          }
        });
      }

      await paddleRequest(`/subscriptions/${encodeURIComponent(existing.provider_subscription_id)}`, {
        method: "PATCH",
        body: JSON.stringify(changeBody)
      });
      return NextResponse.json({ updated: true });
    }

    const transaction = await paddleRequest<PaddleTransaction>("/transactions", {
      method: "POST",
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }], collection_mode: "automatic",
        custom_data: { calcumint_user_id: user.id, calcumint_plan: plan, billing_interval: interval },
        checkout: { url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/pricing` }
      })
    });
    if (!transaction.id) return NextResponse.json({ error: "Paddle did not return a transaction ID" }, { status: 502 });
    return NextResponse.json({ transactionId: transaction.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout unavailable" }, { status: 502 });
  }
}
