import Link from "next/link";
import { CalculatorSearch } from "@/components/calculator-search";
import { calculatorRegistry } from "@/calculators/registry";
import { listPublicCalculators, listPublicCategories } from "@/calculators/public-content";

export default function HomePage() {
  const calculators = listPublicCalculators();
  const searchItems = calculators.flatMap((item) => {
    const definition = calculatorRegistry.getBySlug(item.slug);
    return definition ? [{ title: definition.title, href: `/calculators/${item.category}/${item.slug}`, description: item.shortDescription, keywords: item.keywords }] : [];
  });

  return (
    <>
      <section className="hero container">
        <span className="eyebrow">Universal calculation platform</span>
        <h1>Calculate anything. Understand the result.</h1>
        <p className="hero-copy">Fast, deterministic calculators with clear formulas, worked examples and a quality gate before every tool is published.</p>
        <div className="hero-actions">
          <Link className="button primary" href="/calculators">Browse calculators</Link>
          <Link className="button secondary" href="/pricing">Free, Pro & Business</Link>
        </div>
        <CalculatorSearch items={searchItems} />
      </section>

      <section id="categories" className="container section">
        <div className="section-heading">
          <div><span className="eyebrow">Browse by topic</span><h2>Certified calculator categories</h2></div>
          <span className="status">{calculators.length} tools live in this build</span>
        </div>
        <div className="category-grid">
          {listPublicCategories().map((category) => (
            <Link className="card category-link" href={`/calculators/${category.slug}`} key={category.slug}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="text-link">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section split">
        <div className="card accent-card">
          <span className="eyebrow">Free</span>
          <h2>Core calculations stay public.</h2>
          <p>Visitors get the primary calculation without a mandatory account wall. Free monetization will be introduced later without obstructing the calculator experience.</p>
        </div>
        <div className="card">
          <span className="eyebrow">Quality first</span>
          <h2>Every calculator earns publication.</h2>
          <p>Only certified calculators are listed publicly. Draft finance, health and tax tools stay out of search until source and review requirements are complete.</p>
        </div>
      </section>
    </>
  );
}
