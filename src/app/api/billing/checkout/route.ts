import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPriceId, paddleRequest, subscriptionChangeMode } from "@/lib/billing/paddle";
import { publicEnv } from "@/lib/env";

const requestSchema = z.object({
  plan: z.enum(["pro", "business"]).default("pro"),
  interval: z.enum(["monthly", "yearly"])
});

type PaddleTransaction = {
  id: string;
  checkout?: { url?: string | null } | null;
};

type ExistingSubscription = {
  provider_subscription_id: string;
  plan: "pro" | "business";
  billing_interval: "monthly" | "yearly";
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Accounts are not configured" }, { status: 503 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid billing selection" }, { status: 400 });

  const { plan, interval } = parsed.data;
  const priceId = getPriceId(plan, interval);
  if (!priceId) return NextResponse.json({ error: `${plan === "business" ? "Business" : "Pro"} pricing is not configured` }, { status: 503 });

  try {
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("provider_subscription_id, plan, billing_interval")
      .eq("user_id", user.id)
      .in("status", ["active", "trialing", "past_due"])
      .order("updated_at", { ascending: false })
      .limit(2);

    if (subscriptionError) throw new Error("Could not verify the current subscription");
    if ((subscriptions?.length ?? 0) > 1) {
      return NextResponse.json({ error: "Multiple active subscriptions require billing support" }, { status: 409 });
    }

    const existing = subscriptions?.[0] as ExistingSubscription | undefined;
    if (existing) {
      const mode = subscriptionChangeMode(existing.plan, existing.billing_interval, plan, interval);
      if (mode === "unchanged") {
        return NextResponse.json({ error: "This is already your current plan" }, { status: 409 });
      }
      if (mode === "deferred") {
        return NextResponse.json({ error: "This downgrade can take effect only at the next renewal" }, { status: 409 });
      }

      await paddleRequest(`/subscriptions/${encodeURIComponent(existing.provider_subscription_id)}`, {
        method: "PATCH",
        body: JSON.stringify({
          items: [{ price_id: priceId, quantity: 1 }],
          proration_billing_mode: "prorated_immediately",
          custom_data: {
            calcumint_user_id: user.id,
            calcumint_plan: plan,
            billing_interval: interval
          }
        })
      });

      return NextResponse.json({ updated: true });
    }

    const transaction = await paddleRequest<PaddleTransaction>("/transactions", {
      method: "POST",
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        collection_mode: "automatic",
        custom_data: {
          calcumint_user_id: user.id,
          calcumint_plan: plan,
          billing_interval: interval
        },
        checkout: {
          url: `${publicEnv.NEXT_PUBLIC_SITE_URL}/pricing`
        }
      })
    });

    if (!transaction.checkout?.url) {
      return NextResponse.json({ error: "Paddle did not return a checkout URL" }, { status: 502 });
    }

    return NextResponse.json({ checkoutUrl: transaction.checkout.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Checkout unavailable" }, { status: 502 });
  }
}
