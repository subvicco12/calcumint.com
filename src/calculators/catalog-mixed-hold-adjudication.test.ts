import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildMixedHoldAdjudicationReport } from "./catalog-mixed-hold-adjudication";

describe("HOLD adjudication queue", () => {
  it("retains all HOLD cases with evidence and without approval", () => {
    const reviews = JSON.parse(readFileSync(resolve(process.cwd(), "data/catalog/mixed-category-review-ledger.partial.json"), "utf8"));
    const master = readFileSync(resolve(process.cwd(), "data/catalog/master-catalog-2026.csv"), "utf8").trim().split("\n").slice(1).map(line => {
      const cells = line.replaceAll('"', "").split(",");
      return { id: Number(cells[0]), domain: cells[1], title: cells[2] };
    });
    const result = buildMixedHoldAdjudicationReport(reviews, master);
    expect(result.total).toBe(67);
    expect(new Set(result.entries.map(row => row.slug)).size).toBe(67);
    expect(result.entries.every(row => row.disposition === "HOLD" && row.requiresAdjudication)).toBe(true);
    expect(result.entries.find(row => row.slug === "power-calculator")?.blocker).toBe("title-collision");
    expect(result.entries.find(row => row.slug === "pace-calculator")?.blocker).toBe("unique-title-needs-adjudication");
    console.info("CALCUMINT_HOLD_ADJUDICATION=" + JSON.stringify(result));
  });
});
