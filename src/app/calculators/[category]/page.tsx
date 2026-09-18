import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calculatorRegistry } from "@/calculators/registry";
import { categoryContent, listPublicCalculators, listPublicCategories } from "@/calculators/public-content";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ category: string }> };
export function generateStaticParams() { const published=new Set(listPublicCalculators().map(item=>item.category)); return listPublicCategories().filter(category=>published.has(category.slug)).map((category) => ({ category: category.slug })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> { const { category } = await params; const meta = categoryContent[category as keyof typeof categoryContent]; if (!meta) return {}; return { title: meta.name, description: meta.description, alternates: { canonical: `/calculators/${category}` }, openGraph: { type: "website", title: `${meta.name} | CalcuMint`, description: meta.description, url: `/calculators/${category}` } }; }

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const meta = categoryContent[category as keyof typeof categoryContent];
  if (!meta) notFound();
  const items = listPublicCalculators().filter((item) => item.category === category);
  if (items.length === 0) notFound();
  const searchItems = items.flatMap((item) => { const definition = calculatorRegistry.getBySlug(item.slug); return definition ? [{ title: definition.title, href: `/calculators/${item.category}/${item.slug}`, description: item.shortDescription, keywords: item.keywords }] : []; });
  const publishedCategories=new Set(listPublicCalculators().map(item=>item.category));
  const otherCategories = listPublicCategories().filter((item) => item.slug !== category && publishedCategories.has(item.slug));
  const { CalculatorSearch } = await import("@/components/calculator-search");
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` }, { "@type": "ListItem", position: 2, name: "Calculators", item: `${siteConfig.url}/calculators` }, { "@type": "ListItem", position: 3, name: meta.name, item: `${siteConfig.url}/calculators/${category}` }] };

  return <section className="container page-top category-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/calculators">Calculators</Link><span>/</span><span>{meta.name}</span></nav>
    <span className="eyebrow">Calculator category</span><h1>{meta.name}</h1><p className="hero-copy">{meta.intro}</p><p className="category-summary">{items.length} certified calculator{items.length === 1 ? "" : "s"} in this category. Published tools use deterministic calculation logic and expose their formulas, assumptions and methodology.</p><CalculatorSearch items={searchItems} />
    <div className="section-heading directory-heading"><div><span className="eyebrow">Explore this category</span><h2>Choose a calculator</h2></div><Link className="text-link" href="/calculators">All categories →</Link></div>
    <div className="tool-grid">{items.map((item) => { const definition = calculatorRegistry.getBySlug(item.slug); if (!definition) return null; return <Link className="tool-card" href={`/calculators/${item.category}/${item.slug}`} key={item.slug}><span className="status">Certified</span><h2>{definition.title}</h2><p>{item.shortDescription}</p><span className="text-link">Open calculator →</span></Link>; })}</div>
    <div className="section-heading"><div><span className="eyebrow">Using these calculators</span><h2>Calculation guidance</h2><p>{meta.guidance}</p></div></div>
    <div className="card"><h2>How CalcuMint publishes calculators</h2><p>Public calculators in this directory must pass the certified-content publication gate. Individual calculator pages show the formula, worked examples, assumptions, methodology and source information so results can be reviewed instead of treated as a black box.</p></div>
    <div className="section-heading directory-heading"><div><span className="eyebrow">Keep exploring</span><h2>Related calculator categories</h2></div></div>
    <div className="tool-grid">{otherCategories.map((item) => <Link className="tool-card" href={`/calculators/${item.slug}`} key={item.slug}><h3>{item.name}</h3><p>{item.description}</p><span className="text-link">Explore category →</span></Link>)}</div>
  </section>;
}
