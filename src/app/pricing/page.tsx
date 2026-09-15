import Link from "next/link";
import { PlanCheckoutButton } from "@/components/pro-checkout-button";
import { planCatalog, type BillingInterval } from "@/lib/billing/plans";
import { subscriptionChangeMode, type PaidPlan } from "@/lib/billing/paddle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Pricing",
  description: "Compare CalcuMint Free, Pro and Business plans."
};

export default async function PricingPage() {
  const supabase = await createSupabaseServerClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const { data: currentSubscription } = user && supabase
    ? await supabase.from("subscriptions").select("plan,billing_interval").eq("user_id", user.id).in("status", ["active", "trialing", "past_due"]).order("updated_at", { ascending: false }).limit(1).maybeSingle()
    : { data: null };

  function disabledReason(targetPlan: PaidPlan, targetInterval: BillingInterval): string | undefined {
    if (!currentSubscription) return undefined;
    const currentPlan = currentSubscription.plan as PaidPlan;
    const currentInterval = currentSubscription.billing_interval as BillingInterval;
    const mode = subscriptionChangeMode(currentPlan, currentInterval, targetPlan, targetInterval);
    if (mode === "unchanged") return "Your current plan";
    if (mode === "deferred") return "Available at your next renewal; contact billing support to schedule this change.";
    return undefined;
  }

  return (
    <section className="container section page-top">
      <span className="eyebrow">Three-plan architecture</span>
      <h1>Choose how far you want to take your calculations.</h1>
      <p className="hero-copy">
        Core calculators stay public. Pro removes ads and unlocks professional analysis features. Business adds team, builder, branding and automation capabilities.
      </p>

      <div className="pricing-grid">
        <article className="card pricing-card">
          <span className="eyebrow">{planCatalog.free.tagline}</span>
          <h2>Free</h2>
          <p className="price">$0</p>
          <ul>
            <li>All public core calculators</li>
            <li>Up to 20 saved calculations</li>
            <li>Up to 10 favorite calculators</li>
            <li>Cloud preferences with a free account</li>
            <li>Google ads support the free service</li>
          </ul>
          <Link className="button secondary" href="/calculators">Start calculating</Link>
        </article>

        <article className="card pricing-card featured-plan">
          <span className="eyebrow">{planCatalog.pro.tagline}</span>
          <h2>Pro</h2>
          <p className="price">${planCatalog.pro.monthlyPriceUsd.toFixed(2)}/month</p>
          <p className="annual-price">or ${planCatalog.pro.yearlyPriceUsd.toFixed(2)}/year — about 2 months free</p>
          <ul>
            <li>No ads</li>
            <li>Unlimited calculation history</li>
            <li>Unlimited favorites</li>
            <li>CSV/JSON professional exports</li>
            <li>Advanced analysis features</li>
            <li>Monthly → yearly upgrade allowed immediately</li>
            <li>Yearly → monthly takes effect only at term end</li>
          </ul>
          <div className="plan-actions">
            <PlanCheckoutButton plan="pro" interval="monthly" disabledReason={disabledReason("pro", "monthly")} />
            <PlanCheckoutButton plan="pro" interval="yearly" disabledReason={disabledReason("pro", "yearly")} />
          </div>
        </article>

        <article className="card pricing-card">
          <span className="eyebrow">{planCatalog.business.tagline}</span>
          <h2>Business</h2>
          <p className="price">${planCatalog.business.monthlyPriceUsd.toFixed(2)}/month</p>
          <p className="annual-price">or ${planCatalog.business.yearlyPriceUsd.toFixed(2)}/year — about 2 months free</p>
          <ul>
            <li>Everything in Pro</li>
            <li>5 included team seats</li>
            <li>Team workspaces and roles</li>
            <li>No-code custom calculator builder</li>
            <li>White-label website embeds</li>
            <li>Lead-generation calculators</li>
            <li>API, webhooks, bulk processing and automation</li>
          </ul>
          <div className="plan-actions">
            <PlanCheckoutButton plan="business" interval="monthly" disabledReason={disabledReason("business", "monthly")} />
            <PlanCheckoutButton plan="business" interval="yearly" disabledReason={disabledReason("business", "yearly")} />
          </div>
        </article>
      </div>

      <p className="muted pricing-note">Paid checkout activates only when the corresponding Paddle production price IDs and webhook configuration are present in the deployment environment.</p>
    </section>
  );
}
