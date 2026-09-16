import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { paddleRequest } from "@/lib/billing/paddle";

type PortalSession = {
  urls: {
    general: { overview: string };
    subscriptions?: Array<{ id: string; cancel_subscription: string; update_subscription_payment_method: string }>;
  };
};

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Accounts are not configured" }, { status: 503 });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { action?: "overview" | "cancel" | "payment" };
  const action = body.action ?? "overview";
  const { data: subscription, error } = await supabase.from("subscriptions")
    .select("provider_customer_id,provider_subscription_id,status")
    .eq("user_id", user.id).in("status", ["active", "trialing", "past_due", "paused"])
    .order("updated_at", { ascending: false }).limit(1).maybeSingle();
  if (error) return NextResponse.json({ error: "Could not load billing account" }, { status: 502 });
  if (!subscription?.provider_customer_id || !subscription?.provider_subscription_id) {
    return NextResponse.json({ error: "No managed paid subscription found" }, { status: 404 });
  }

  try {
    const portal = await paddleRequest<PortalSession>(`/customers/${encodeURIComponent(subscription.provider_customer_id)}/portal-sessions`, {
      method: "POST",
      body: JSON.stringify({ subscription_ids: [subscription.provider_subscription_id] })
    });
    const deepLink = portal.urls.subscriptions?.find((item) => item.id === subscription.provider_subscription_id);
    const url = action === "cancel" ? deepLink?.cancel_subscription
      : action === "payment" ? deepLink?.update_subscription_payment_method
      : portal.urls.general.overview;
    if (!url) return NextResponse.json({ error: "Paddle did not return the requested portal link" }, { status: 502 });
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Billing portal unavailable" }, { status: 502 });
  }
}
