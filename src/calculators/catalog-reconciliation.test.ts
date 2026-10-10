import { describe, expect, it } from "vitest";
import { reconcileMasterCatalog } from "./catalog-reconciliation";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

const entry = (slug: string, title: string, category: string): CalculatorInventoryRecord => ({
  id: slug, slug, title, category, version: 1, riskClass: "standard", reviewStatus: "draft",
});

describe("offline master catalog reconciliation", () => {
  it("matches only within the explicitly mapped domain, not similarly named cross-domain calculators", () => {
    const inventory = [
      entry("physics-speed-calculator", "Speed Calculator", "physics"),
      entry("speed-converter", "Speed Converter", "conversion"),
    ];
    const rows = [
      { masterId: 1, domain: "Physics", title: "Speed Calculator" },
      { masterId: 2, domain: "Conversion", title: "Speed Converter" },
      { masterId: 3, domain: "Automotive", title: "Speed Calculator" },
    ];
    const result = reconcileMasterCatalog(rows, inventory, { categoryDomains: { physics: "Physics", conversion: "Conversion" } });
    expect(result.map((row) => row.status)).toEqual(["exact", "exact", "unmatched"]);
    expect(result[0]).toMatchObject({ slug: "physics-speed-calculator" });
    expect(result[1]).toMatchObject({ slug: "speed-converter" });
  });

  it("requires an explicit known-slug alias, and labels it as non-authoritative", () => {
    const result = reconcileMasterCatalog(
      [{ masterId: 8, domain: "SaaS", title: "MRR Calculator" }],
      [entry("monthly-recurring-revenue-calculator", "Monthly Recurring Revenue Calculator", "saas")],
      { categoryDomains: { saas: "SaaS" }, aliases: { "saas:mrr": "monthly-recurring-revenue-calculator" } },
    );
    expect(result).toEqual([{ masterId: 8, domain: "SaaS", title: "MRR Calculator", status: "alias", slug: "monthly-recurring-revenue-calculator", evidence: "explicit-alias" }]);
    expect(result[0]).not.toHaveProperty("published");
    expect(result[0]).not.toHaveProperty("certified");
  });

  it("fails closed for conflicting title candidates and aliases", () => {
    const inventory = [entry("one", "Rate Calculator", "finance"), entry("two", "Rate Calculator", "finance")];
    expect(reconcileMasterCatalog([{ masterId: 1, domain: "Finance", title: "Rate Calculator" }], inventory, { categoryDomains: { finance: "Finance" } })[0])
      .toMatchObject({ status: "ambiguous", candidates: ["one", "two"] });
    expect(() => reconcileMasterCatalog([{ masterId: 1, domain: "Finance", title: "APR Calculator" }], inventory, { aliases: { "finance:apr": "missing" } })).toThrow("unknown registry slug");
  });

  it("rejects duplicate master IDs and registry slugs", () => {
    expect(() => reconcileMasterCatalog([{ masterId: 1, domain: "A", title: "X" }, { masterId: 1, domain: "A", title: "Y" }], [])).toThrow("duplicate master ID");
    expect(() => reconcileMasterCatalog([], [entry("duplicate", "A", "X"), entry("duplicate", "B", "X")])).toThrow("Duplicate registry slug");
  });
});
