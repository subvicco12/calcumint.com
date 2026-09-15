import type { Metadata } from "next";
import { PricingSelector } from "@/components/pricing-selector";
import { type BillingInterval } from "@/lib/billing/plans";
import { subscriptionChangeMode, type PaidPlan } from "@/lib/billing/paddle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {title:"Pricing",description:"Compare CalcuMint Free, Pro and Business plans.",alternates:{canonical:"/pricing"},openGraph:{type:"website",title:"CalcuMint Pricing",description:"Compare CalcuMint Free, Pro and Business plans.",url:"/pricing"}};
export default async function PricingPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const { data: currentSubscription } = user && supabase ? await supabase.from("subscriptions").select("plan,billing_interval").eq("user_id", user.id).in("status", ["active", "trialing", "past_due"]).order("updated_at", { ascending: false }).limit(1).maybeSingle() : { data: null };
  function disabledReason(targetPlan: PaidPlan, targetInterval: BillingInterval): string | undefined {
    if (!currentSubscription) return undefined;
    const mode = subscriptionChangeMode(currentSubscription.plan as PaidPlan, currentSubscription.billing_interval as BillingInterval, targetPlan, targetInterval);
    if (mode === "unchanged") return "Your current plan";
    if (mode === "deferred") return "Available at your next renewal; contact billing support to schedule this change.";
    return undefined;
  }
  const disabledReasons = Object.fromEntries((["pro", "business"] as PaidPlan[]).flatMap(plan => (["monthly", "yearly"] as BillingInterval[]).map(interval => [`${plan}-${interval}`, disabledReason(plan, interval)])));
  return <section className="container section page-top pricing-page">
    <div className="pricing-intro"><span className="eyebrow">Simple, transparent pricing</span><h1>Start free. Upgrade when you need more.</h1><p className="hero-copy">Everyday calculators stay accessible. Pro adds professional analysis. Business gives teams the tools to build, brand and automate calculators.</p></div>
    <PricingSelector disabledReasons={disabledReasons} />
    <p className="muted pricing-note">Cancel anytime. Yearly plans are billed once per year. Monthly plans can move to yearly immediately; yearly-to-monthly changes take effect at renewal.</p>
  </section>;
}
