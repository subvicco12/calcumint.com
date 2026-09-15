import type { MetadataRoute } from "next";
import { listPublicCalculators, listPublicCategories } from "@/calculators/public-content";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/calculators`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/pricing`, changeFrequency: "monthly", priority: 0.6 }
  ];
  const categoryEntries: MetadataRoute.Sitemap = listPublicCategories().map((category) => ({
    url: `${siteConfig.url}/calculators/${category.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));
  const calculatorEntries: MetadataRoute.Sitemap = listPublicCalculators().map((item) => ({
    url: `${siteConfig.url}/calculators/${item.category}/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9
  }));
  return [...staticEntries, ...categoryEntries, ...calculatorEntries];
}
