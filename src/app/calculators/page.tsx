import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorSearch } from "@/components/calculator-search";
import { calculatorRegistry } from "@/calculators/registry";
import { listPublicCalculators, listPublicCategories } from "@/calculators/public-content";

export const metadata: Metadata = { title: "Calculators", description: "Browse CalcuMint's certified calculators by category, search the library, or use the A–Z calculator index.", alternates: { canonical: "/calculators" } };

export default function CalculatorsPage() {
  const calculators = listPublicCalculators();
  const categories = listPublicCategories().map((category) => ({ ...category, count: calculators.filter((item) => item.category === category.slug).length })).filter((category) => category.count > 0);
  const searchItems = calculators.flatMap((item) => { const definition = calculatorRegistry.getBySlug(item.slug); return definition ? [{ title: definition.title, href: `/calculators/${item.category}/${item.slug}`, description: item.shortDescription, keywords: item.keywords }] : []; });
  const featured = calculators.slice(0, 8);
  const alphabetical = calculators.flatMap((item) => { const definition = calculatorRegistry.getBySlug(item.slug); return definition ? [{ ...item, title: definition.title }] : []; }).sort((a, b) => a.title.localeCompare(b.title));

  return <section className="container page-top directory-page">
    <span className="eyebrow">Universal calculator directory</span><h1>Find the right calculator.</h1><p className="hero-copy">Start with a category, search the certified library, or jump to the A–Z index when you know the calculator name.</p><CalculatorSearch items={searchItems} />

    <div className="section-heading directory-heading"><div><span className="eyebrow">Start here</span><h2>Browse by category</h2><p className="muted-copy">Categories are the primary way to explore CalcuMint as the library grows.</p></div><span className="status">{calculators.length} certified tools</span></div>
    <div className="category-grid">{categories.map((category) => <Link className="card category-link category-discovery-card" href={`/calculators/${category.slug}`} key={category.slug}><span className="category-count">{category.count} calculator{category.count === 1 ? "" : "s"}</span><h3>{category.name}</h3><p>{category.description}</p><span className="text-link">Browse category →</span></Link>)}</div>

    <div className="section-heading directory-heading"><div><span className="eyebrow">Featured tools</span><h2>Featured calculators</h2></div></div><div className="popular-grid">{featured.map((item) => { const definition = calculatorRegistry.getBySlug(item.slug); if (!definition) return null; return <Link className="popular-card" href={`/calculators/${item.category}/${item.slug}`} key={item.slug}><span className="category-count">{categories.find((category) => category.slug === item.category)?.name ?? item.category}</span><strong>{definition.title}</strong><span>{item.shortDescription}</span></Link>; })}</div>

    <div className="section-heading directory-heading" id="all-calculators"><div><span className="eyebrow">Complete directory</span><h2>All calculators A–Z</h2><p className="muted-copy">A compact index for direct lookup and complete library coverage.</p></div></div><div className="az-grid">{alphabetical.map((item) => <Link href={`/calculators/${item.category}/${item.slug}`} key={item.slug}><strong>{item.title}</strong><span>{categories.find((category) => category.slug === item.category)?.name ?? item.category}</span></Link>)}</div>
  </section>;
}
