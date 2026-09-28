import type { MetadataRoute } from "next";
import { listGovernedPublicCalculators, listPublicCategories } from "@/calculators/public-content";
import { getPublishedCalculatorSlugs } from "@/lib/publication-manifest";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedSlugs = await getPublishedCalculatorSlugs();
  const publishedCalculators = listGovernedPublicCalculators(publishedSlugs);
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/calculators`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/business-platform`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/pricing`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "yearly", priority: 0.3 }
  ];
  const publishedCategories=new Set(publishedCalculators.map(item=>item.category));
  const categoryEntries: MetadataRoute.Sitemap = listPublicCategories().filter(category=>publishedCategories.has(category.slug)).map((category) => ({
    url: `${siteConfig.url}/calculators/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));
  const calculatorEntries: MetadataRoute.Sitemap = publishedCalculators.map((item) => ({
    url: `${siteConfig.url}/calculators/${item.category}/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9
  }));
  return [...staticEntries, ...categoryEntries, ...calculatorEntries];
}
