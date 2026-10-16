import { expect, it } from "vitest";
import { buildCatalogIdentityCandidateReport } from "./catalog-identity-candidate-report";
import type { CalculatorInventoryRecord } from "./implementation-inventory";

const item = (slug: string, title: string): CalculatorInventoryRecord => ({
  id: "math." + slug, slug, title, category: "math", version: 1,
  riskClass: "standard", reviewStatus: "certified",
});

it("does not approve a single exact-title candidate", () => {
  const result = buildCatalogIdentityCandidateReport(
    [{masterId:1,domain:"Math",title:"Example"}], [item("example","Example")],
  );
  expect(result[0].disposition).toBe("source-review-required");
  expect(result[0].candidates[0].calculatorKey).toBe("math.example");
  expect(result[0].candidates[0].version).toBe(1);
});

it("holds multiple candidates with the same title", () => {
  const result = buildCatalogIdentityCandidateReport(
    [{masterId:1,domain:"Math",title:"Power"}],
    [item("power","Power"),item("power-from-work","Power")],
  );
  expect(result[0].disposition).toBe("multiple-candidates-hold");
});

it("holds one registry slug claimed by multiple master rows", () => {
  const result = buildCatalogIdentityCandidateReport(
    [{masterId:1,domain:"Math",title:"Distance"},{masterId:2,domain:"Travel & Everyday",title:"Distance"}],
    [item("distance","Distance")],
  );
  expect(result.map(row=>row.disposition)).toEqual(["shared-slug-hold","shared-slug-hold"]);
});

it("does not infer a candidate from a different title", () => {
  const result = buildCatalogIdentityCandidateReport(
    [{masterId:1,domain:"Math",title:"Example"}],[item("other","Other")],
  );
  expect(result[0].disposition).toBe("no-exact-title-candidate");
});
