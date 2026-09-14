import { listPublicCalculators } from "@/calculators/public-content";

export type CalculatorSuggestion = {
  slug: string;
  category: string;
  description: string;
  url: string;
  score: number;
};

function tokens(value: string): string[] {
  return value.toLowerCase().replace(/[^a-z0-9%]+/g, " ").split(/\s+/).filter(Boolean);
}

export function deterministicCalculatorSearch(query: string, limit = 5): CalculatorSuggestion[] {
  const queryTokens = new Set(tokens(query));
  return listPublicCalculators()
    .map((item) => {
      const haystack = tokens([item.slug, item.category, item.shortDescription, ...item.keywords].join(" "));
      const overlap = haystack.reduce((score, token) => score + (queryTokens.has(token) ? 1 : 0), 0);
      const phraseBoost = item.keywords.some((keyword) => query.toLowerCase().includes(keyword.toLowerCase())) ? 3 : 0;
      return {
        slug: item.slug,
        category: item.category,
        description: item.shortDescription,
        url: `/calculators/${item.category}/${item.slug}`,
        score: overlap + phraseBoost
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, Math.max(1, Math.min(limit, 10)));
}

export function publicCalculatorCatalog() {
  return listPublicCalculators().map((item) => ({
    slug: item.slug,
    category: item.category,
    description: item.shortDescription,
    keywords: [...item.keywords],
    url: `/calculators/${item.category}/${item.slug}`
  }));
}
