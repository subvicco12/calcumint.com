import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorInteractive } from "@/components/calculator-interactive";
import { FreeUserAdSlot } from "@/components/free-user-ad-slot";
import { calculatorRegistry } from "@/calculators/registry";
import { categoryContent, getPublicCalculatorContent, listPublicCalculators } from "@/calculators/public-content";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return listPublicCalculators().map((item) => ({ category: item.category, slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const content = getPublicCalculatorContent(slug);
  const definition = calculatorRegistry.getBySlug(slug);
  if (!content || !definition || content.category !== category) return {};
  const path = `/calculators/${category}/${slug}`;
  return {
    title: definition.title,
    description: content.shortDescription,
    keywords: [...content.keywords],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: definition.title,
      description: content.shortDescription,
      url: path
    }
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { category, slug } = await params;
  const content = getPublicCalculatorContent(slug);
  const definition = calculatorRegistry.getBySlug(slug);
  const categoryMeta = categoryContent[category as keyof typeof categoryContent];
  if (!content || !definition || !categoryMeta || content.category !== category) notFound();

  const related = content.relatedSlugs
    .map((relatedSlug) => ({ definition: calculatorRegistry.getBySlug(relatedSlug), content: getPublicCalculatorContent(relatedSlug) }))
    .filter((item) => item.definition && item.content);

  const calculatorJsonLd={"@context":"https://schema.org","@type":"WebApplication",name:definition.title,description:content.shortDescription,url:`${siteConfig.url}/calculators/${category}/${slug}`,applicationCategory:"CalculatorApplication",operatingSystem:"Any",isAccessibleForFree:true};
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: categoryMeta.name, item: `${siteConfig.url}/calculators/${category}` },
      { "@type": "ListItem", position: 3, name: definition.title, item: `${siteConfig.url}/calculators/${category}/${slug}` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(calculatorJsonLd)}} />
      <section className="container calculator-page-top">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href={`/calculators/${category}`}>{categoryMeta.name}</Link><span>/</span><span>{definition.title}</span>
        </nav>
        <span className="eyebrow">Formula verified · Deterministic calculation</span>
        <h1>{definition.title}</h1>
        <p className="hero-copy">{content.intro}</p>
      </section>

      <section className="container calculator-layout">
        <div>
          <div className="calculator-card">
            <CalculatorInteractive slug={slug} />
          </div>
          <FreeUserAdSlot />

          <article className="content-stack">
            <section className="content-section">
              <h2>How this calculator works</h2>
              <p>{content.formulaExplanation}</p>
            </section>
            <section className="content-section">
              <h2>Formula</h2>
              {definition.formulas.map((formula) => (
                <div className="formula-box" key={formula.id}>
                  <code>{formula.expression}</code>
                  <p>{formula.description}</p>
                </div>
              ))}
            </section>
            <section className="content-section">
              <h2>Worked example</h2>
              {definition.examples.map((example) => <p key={example.label}><strong>{example.label}</strong> is a verified test case used by the calculation engine.</p>)}
            </section>
            <section className="content-section">
              <h2>Assumptions and limitations</h2>
              <ul>{content.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="content-section" aria-labelledby="methodology-sources-heading">
              <h2 id="methodology-sources-heading">Methodology &amp; sources</h2>
              <p>This calculator uses deterministic, versioned calculation logic. The formula and verified examples above are part of the calculation definition used by CalcuMint.</p>
              <ul>
                {definition.sources.map((source) => (
                  <li key={`${source.label}-${source.url ?? "internal"}`}>
                    {source.url ? (
                      <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>
                    ) : (
                      <strong>{source.label}</strong>
                    )}
                    {source.note ? <> — {source.note}</> : null}
                  </li>
                ))}
              </ul>
            </section>
            <section className="content-section">
              <h2>Frequently asked questions</h2>
              <div className="faq-list">{content.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
            </section>
            {related.length > 0 && <section className="content-section"><h2>Related calculators</h2><div className="related-grid">{related.map((item) => <Link className="mini-card" href={`/calculators/${item.content!.category}/${item.content!.slug}`} key={item.content!.slug}><strong>{item.definition!.title}</strong><span>{item.content!.shortDescription}</span></Link>)}</div></section>}
          </article>
        </div>

        <aside className="calculator-aside">
          <div className="trust-card">
            <strong>CalcuMint calculation standard</strong>
            <p>Deterministic calculation logic, validated inputs and automated golden-vector tests.</p>
            <dl><div><dt>Risk class</dt><dd>{definition.riskClass}</dd></div><div><dt>Review status</dt><dd>{definition.reviewStatus}</dd></div><div><dt>Version</dt><dd>{definition.version}</dd></div></dl>
          </div>
          <div className="upgrade-card"><span className="eyebrow">CalcuMint Pro</span><h3>No ads, unlimited saves and exports</h3><p>Core calculation stays public. Pro adds a cleaner professional workflow and premium convenience features.</p><Link className="button secondary" href="/pricing">Compare plans</Link></div>
        </aside>
      </section>
    </>
  );
}
