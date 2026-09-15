import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calculatorRegistry } from "@/calculators/registry";
import { categoryContent, listPublicCalculators, listPublicCategories } from "@/calculators/public-content";

type PageProps = { params: Promise<{ category: string }> };
export function generateStaticParams() { return listPublicCategories().map((category) => ({ category: category.slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const { category } = await params; const meta = categoryContent[category as keyof typeof categoryContent]; if (!meta) return {}; return { title: meta.name, description: meta.description, alternates: { canonical: `/calculators/${category}` } }; }

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = categoryContent[category as keyof typeof categoryContent];
  if (!meta) notFound();
  const items = listPublicCalculators().filter((item) => item.category === category);
  const searchItems = items.flatMap((item) => { const definition = calculatorRegistry.getBySlug(item.slug); return definition ? [{ title: definition.title, href: `/calculators/${item.category}/${item.slug}`, description: item.shortDescription, keywords: item.keywords }] : []; });
  const { CalculatorSearch } = await import("@/components/calculator-search");

  return <section className="container page-top category-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>{meta.name}</span></nav>
    <span className="eyebrow">Calculator category</span><h1>{meta.name}</h1><p className="hero-copy">{meta.description}</p><p className="category-summary">{items.length} certified calculator{items.length === 1 ? "" : "s"} in this category.</p><CalculatorSearch items={searchItems} />
    <div className="section-heading directory-heading"><div><span className="eyebrow">Explore this category</span><h2>Choose a calculator</h2></div><Link className="text-link" href="/calculators">All categories →</Link></div>
    <div className="tool-grid">{items.map((item) => { const definition = calculatorRegistry.getBySlug(item.slug); if (!definition) return null; return <Link className="tool-card" href={`/calculators/${item.category}/${item.slug}`} key={item.slug}><span className="status">Certified</span><h2>{definition.title}</h2><p>{item.shortDescription}</p><span className="text-link">Open calculator →</span></Link>; })}</div>
  </section>;
}
