import { describe, expect, it } from "vitest";
import { reconcileMasterCatalog } from "./catalog-reconciliation";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

const inventory = [
  { id: "a", slug: "physics-speed", title: "Speed Calculator", category: "science", version: 1, riskClass: "standard", reviewStatus: "draft" },
  { id: "b", slug: "chemistry-speed", title: "Speed Calculator", category: "science", version: 1, riskClass: "standard", reviewStatus: "draft" },
] as CalculatorInventoryRecord[];

describe("shared registry category domain overrides", () => {
  it("separates calculator domains even when their registry category is identical", () => {
    const master = [
      { masterId: 1, domain: "Physics", title: "Speed Calculator" },
      { masterId: 2, domain: "Chemistry", title: "Speed Calculator" },
    ];
    const rows = reconcileMasterCatalog(master, inventory, {
      slugDomains: { "physics-speed": "Physics", "chemistry-speed": "Chemistry" },
    });
    expect(rows.map((row) => row.status)).toEqual(["exact", "exact"]);
    expect(rows.flatMap((row) => row.status === "exact" ? [row.slug] : [])).toEqual(["physics-speed", "chemistry-speed"]);
  });
});
