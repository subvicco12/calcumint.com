const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calcumint.com";

function normalizeSiteUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

export const siteConfig = {
  name: "CalcuMint",
  url: normalizeSiteUrl(rawSiteUrl),
  description: "A universal calculation platform for fast, accurate and understandable calculations across finance, math, business, science and everyday life."
} as const;
