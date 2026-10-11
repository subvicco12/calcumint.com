import { describe, expect, it } from "vitest";
import { buildPublicRouteReadinessReport, resolvePublicCalculatorRoute } from "./public-route-readiness";
const slug = "sip-calculator";
const approved = { state: "available" as const, slugs: new Set([slug]) };
describe("governed route readiness", () => {
  it("requires canonical content category and never guesses aliases or activates internal references", () => {
    const route = resolvePublicCalculatorRoute("finance-investment", slug, approved);
    expect(route.state).toBe("ready");
    if (route.state === "ready") expect(route.path).toBe("/calculators/finance-investment/sip-calculator");
    for (const category of ["math", "__proto__", "Finance-Investment"]) expect(resolvePublicCalculatorRoute(category, slug, approved)).toEqual({ state: "blocked", reason: "invalid-category" });
    expect(resolvePublicCalculatorRoute("loans-mortgages", "mortgage-payment", approved)).toEqual({ state: "blocked", reason: "unknown-calculator" });
    expect(resolvePublicCalculatorRoute("health", "bmi-calculator", { ...approved, slugs: new Set(["bmi-calculator"]) })).toEqual({ state: "blocked", reason: "uncertified" });
  });
  it("withdraws routes when authority becomes unavailable or the published lifecycle set is withdrawn", () => {
    expect(resolvePublicCalculatorRoute("finance-investment", slug, approved).state).toBe("ready");
    expect(resolvePublicCalculatorRoute("finance-investment", slug, { state: "unavailable", slugs: approved.slugs })).toEqual({ state: "blocked", reason: "unavailable-authority" });
    expect(resolvePublicCalculatorRoute("finance-investment", slug, { state: "available", slugs: new Set() })).toEqual({ state: "blocked", reason: "unpublished" });
  });
  it("distinguishes observed manifest identity/version mismatch from unobserved DB evidence", () => {
    const definition = resolvePublicCalculatorRoute("finance-investment", slug, approved);
    if (definition.state !== "ready") throw new Error("fixture unavailable");
    const manifest = { calculator_key: definition.definition.id, slug, version: definition.definition.version };
    for (const [entry, expected] of [[{ ...manifest, calculator_key: "wrong.engine" }, "identity-mismatch"], [{ ...manifest, version: manifest.version + 1 }, "version-mismatch"]] as const) {
      const report = buildPublicRouteReadinessReport({ state: "available", slugs: new Set() }, [entry]);
      expect(report.find(row => row.slug === slug)?.manifestIdentityEvidence).toBe(expected);
      expect(report.find(row => row.slug === slug)?.publicationEvidence).toBe("blocked");
    }
    expect(buildPublicRouteReadinessReport({ state: "unavailable", slugs: new Set() }, [manifest]).every(row => row.manifestIdentityEvidence === "not-observed")).toBe(true);
  });
  it("reports structural readiness separately from unknown DB authority without invented approval counts", () => {
    const report = buildPublicRouteReadinessReport({ state: "unavailable", slugs: new Set() });
    expect(report).toHaveLength(573);
    expect(report.every(row => row.publicationEvidence === "unknown")).toBe(true);
    expect(report.filter(row => row.structuralRoute)).toHaveLength(225);
    const published = buildPublicRouteReadinessReport(approved);
    expect(published.filter(row => row.publicationEvidence === "approved-route-ready").map(row => row.slug)).toEqual([slug]);
  });
});
