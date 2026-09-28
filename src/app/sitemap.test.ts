import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public sitemap publication authority", () => {
  const source = readFileSync("src/app/sitemap.ts", "utf8");

  it("derives calculator and category URLs from the governed publication manifest at runtime", () => {
    expect(source).toContain('dynamic = "force-dynamic"');
    expect(source).toContain("getPublishedCalculatorSlugs");
    expect(source).toContain("listGovernedPublicCalculators");
    expect(source).toContain("/calculators/${item.category}/${item.slug}");
    expect(source).not.toContain("sitemapEntriesForAudit");
  });
});
