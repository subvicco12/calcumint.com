import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorSearch } from "@/components/calculator-search";
import { calculatorRegistry } from "@/calculators/registry";
import { listPublicCalculators, listPublicCategories } from "@/calculators/public-content";

export const metadata: Metadata = {
  title: "Calculators",
  description: "Browse CalcuMint's certified calculators by category or search for the calculation you need.",
  alternates: { canonical: "/calculators" }
};

export default function CalculatorsPage() {
  const calculators = listPublicCalculators();
  const searchItems = calculators.flatMap((item) => {
    const definition = calculatorRegistry.getBySlug(item.slug);
    return definition ? [{ title: definition.title, href: `/calculators/${item.category}/${item.slug}`, description: item.shortDescription, keywords: item.keywords }] : [];
  });

  return (
    <section className="container page-top">
      <span className="eyebrow">Universal calculator directory</span>
      <h1>Find the right calculator.</h1>
      <p className="hero-copy">Search certified CalcuMint tools or browse by topic. More calculator clusters are added only after formula and page-quality checks pass.</p>
      <CalculatorSearch items={searchItems} />
      <div className="section-heading directory-heading"><div><span className="eyebrow">Browse</span><h2>Categories</h2></div><span className="status">{calculators.length} certified tools</span></div>
      <div className="category-grid">
        {listPublicCategories().map((category) => {
          const count = calculators.filter((item) => item.category === category.slug).length;
          return <Link className="card category-link" href={`/calculators/${category.slug}`} key={category.slug}><h3>{category.name}</h3><p>{category.description}</p><span className="text-link">{count} calculator{count === 1 ? "" : "s"} →</span></Link>;
        })}
      </div>
    </section>
  );
}
