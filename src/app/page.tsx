import Link from "next/link";
import { featureFlags } from "@/lib/feature-flags";

const categories = [
  "Finance",
  "Loans & Mortgages",
  "Math",
  "Business",
  "Health",
  "Construction",
  "Statistics",
  "Conversions"
];

export default function HomePage() {
  return (
    <>
      <section className="hero container">
        <span className="eyebrow">Universal calculation platform</span>
        <h1>Calculate anything. Understand the result.</h1>
        <p className="hero-copy">
          CalcuMint is being rebuilt as a fast, accurate, global platform for everyday, financial,
          technical and business calculations.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="#categories">Browse calculators</Link>
          <Link className="button secondary" href="/pricing">View Free, Pro & Business</Link>
        </div>
      </section>

      <section id="categories" className="container section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Architecture foundation</span>
            <h2>Calculator categories</h2>
          </div>
          <span className="status">B0 foundation active</span>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <div className="card" key={category}>
              <h3>{category}</h3>
              <p>Certified calculators will be added cluster-by-cluster beginning in Build Batch B1.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section split">
        <div className="card accent-card">
          <span className="eyebrow">Free</span>
          <h2>Core calculations stay public.</h2>
          <p>SEO calculator pages will remain accessible without mandatory registration.</p>
        </div>
        <div className="card">
          <span className="eyebrow">Pro + Business</span>
          <h2>Analysis, collaboration and automation.</h2>
          <p>
            Advanced workflows are designed behind feature flags and will activate only after their build
            batches pass QA.
          </p>
          <small>Business foundation flag: {String(featureFlags.businessWorkspace)}</small>
        </div>
      </section>
    </>
  );
}
