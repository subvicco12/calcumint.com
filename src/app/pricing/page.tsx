const plans = [
  {
    name: "Free",
    tagline: "Calculate",
    price: "$0",
    features: ["Core calculators", "Basic results", "Ads supported", "Optional account"]
  },
  {
    name: "Pro",
    tagline: "Calculate + Analyse",
    price: "$7.99/mo hypothesis",
    features: ["No ads", "Unlimited history", "Advanced scenarios", "Exports & AI assistance"]
  },
  {
    name: "Business",
    tagline: "Build + Brand + Automate",
    price: "$29.99/mo base hypothesis",
    features: ["5 seats", "Custom builder", "White-label embeds", "API, leads & automation"]
  }
];

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <section className="container section page-top">
      <span className="eyebrow">Three-plan architecture</span>
      <h1>Free, Pro and Business</h1>
      <p className="hero-copy">Pricing remains configurable and will be validated before production billing is enabled.</p>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className="card" key={plan.name}>
            <span className="eyebrow">{plan.tagline}</span>
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
