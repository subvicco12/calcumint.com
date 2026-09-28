import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const migration = readFileSync("supabase/migrations/026_publication_manifest_authority.sql", "utf8");
const directory = readFileSync("src/app/calculators/page.tsx", "utf8");
const category = readFileSync("src/app/calculators/[category]/page.tsx", "utf8");
const detail = readFileSync("src/app/calculators/[category]/[slug]/page.tsx", "utf8");
const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
const manifestLoader = readFileSync("src/lib/publication-manifest.ts", "utf8");

describe("runtime publication authority", () => {
  it("exposes only minimal identity fields for DB-published calculators", () => {
    expect(migration).toContain("returns table(calculator_key text, slug text, version integer)");
    expect(migration).toContain("where c.lifecycle = 'published'");
    expect(migration).toContain("security definer");
    expect(migration).toContain("grant execute on function public.list_published_calculator_manifest() to anon, authenticated, service_role");
    expect(migration).not.toContain("reviewer_id");
    expect(migration).not.toContain("review_notes");
    expect(migration).not.toContain("metadata");
  });

  it("fails closed when the publication manifest cannot be established", () => {
    expect(manifestLoader).toContain("if (!url || !anonKey) return new Set()");
    expect(manifestLoader).toContain("if (error || !Array.isArray(data)) return new Set()");
    expect(manifestLoader).toContain("catch {");
    expect(manifestLoader).toContain("return new Set()");
  });

  it("binds every public runtime surface to the governed manifest", () => {
    for (const source of [directory, category, detail, sitemap]) {
      expect(source).toContain("getPublishedCalculatorSlugs");
      expect(source).toContain('dynamic = "force-dynamic"');
    }
    expect(directory).toContain("listGovernedPublicCalculators");
    expect(category).toContain("listGovernedPublicCalculators");
    expect(detail).toContain("getGovernedPublicCalculatorContent");
    expect(sitemap).toContain("listGovernedPublicCalculators");
  });

  it("keeps live DB access out of static parameter generation", () => {
    expect(category).not.toContain("generateStaticParams");
    expect(detail).not.toContain("generateStaticParams");
  });
});
