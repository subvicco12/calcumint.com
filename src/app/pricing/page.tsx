import Link from "next/link";
import { ProCheckoutButton } from "@/components/pro-checkout-button";
import { planCatalog } from "@/lib/billing/plans";

export const metadata = {
  title: "Pricing",
  description: "Compare CalcuMint Free, Pro and Business plans."
};

export default function PricingPage() {
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
            <li>Advanced analysis features as they launch</li>
            <li>Monthly → yearly upgrade allowed immediately</li>
            <li>Yearly → monthly takes effect only at term end</li>
          </ul>
          <div className="plan-actions">
            <ProCheckoutButton interval="monthly" />
            <ProCheckoutButton interval="yearly" />
          </div>
        </article>

        <article className="card pricing-card">
          <span className="eyebrow">{planCatalog.business.tagline}</span>
          <h2>Business</h2>
          <p className="price">From ${planCatalog.business.monthlyPriceUsd.toFixed(2)}/month</p>
          <ul>
            <li>Everything in Pro</li>
            <li>Team workspaces and roles</li>
            <li>No-code custom calculator builder</li>
            <li>White-label website embeds</li>
            <li>Lead-generation calculators</li>
            <li>Branded reports and client workflows</li>
            <li>API, webhooks, bulk processing and automation</li>
          </ul>
          <span className="status">Business activation arrives in B5+</span>
        </article>
      </div>

      <p className="muted pricing-note">Paddle checkout remains disabled until sandbox API keys, webhook secret and Pro price IDs are configured in the deployment environment.</p>
    </section>
  );
}
