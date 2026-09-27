import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";
import { solidGeometryBatch1Definitions } from "./solid-geometry-batch-1";
import { solidGeometryBatch2Definitions } from "./solid-geometry-batch-2";
import { solidGeometryBatch3Definitions } from "./solid-geometry-batch-3";
import { solidGeometryBatch4Definitions } from "./solid-geometry-batch-4";
import { solidGeometryBatch5Definitions } from "./solid-geometry-batch-5";
import { solidGeometryBatch6Definitions } from "./solid-geometry-batch-6";
import { solidGeometryBatch7Definitions } from "./solid-geometry-batch-7";
import { solidGeometryBatch8Definitions } from "./solid-geometry-batch-8";
import { solidGeometryBatch9Definitions } from "./solid-geometry-batch-9";
import { solidGeometryBatch10Definitions } from "./solid-geometry-batch-10";
import { solidGeometryReconciliationManifest } from "./solid-geometry-reconciliation";

const batchDefinitions = [
  ...solidGeometryBatch1Definitions,
  ...solidGeometryBatch2Definitions,
  ...solidGeometryBatch3Definitions,
  ...solidGeometryBatch4Definitions,
  ...solidGeometryBatch5Definitions,
  ...solidGeometryBatch6Definitions,
  ...solidGeometryBatch7Definitions,
  ...solidGeometryBatch8Definitions,
  ...solidGeometryBatch9Definitions,
  ...solidGeometryBatch10Definitions,
] as const;

const masterCatalogNamedSolidTitles = new Set([
  "Sphere Volume Calculator",
  "Sphere Surface Area Calculator",
  "Cylinder Volume Calculator",
  "Cone Volume Calculator",
  "Rectangular Prism Volume Calculator",
]);

describe("solid geometry explicit batch integrity", () => {
  it("contains exactly ten five-calculator batches", () => {
    expect(batchDefinitions).toHaveLength(50);
  });

  it("keeps every batch calculator draft and uniquely identified", () => {
    expect(batchDefinitions.every((definition) => definition.reviewStatus === "draft")).toBe(true);
    expect(new Set(batchDefinitions.map((definition) => definition.id)).size).toBe(50);
    expect(new Set(batchDefinitions.map((definition) => definition.slug)).size).toBe(50);
  });

  it("requires formula, source, example, and golden-test metadata", () => {
    for (const definition of batchDefinitions) {
      expect(definition.formulas.length).toBeGreaterThan(0);
      expect(definition.sources.length).toBeGreaterThan(0);
      expect(definition.examples.length).toBeGreaterThan(0);
      expect(definition.goldenTests.length).toBeGreaterThan(0);
    }
  });

  it("keeps unreconciled Batch 1–10 inventory distinct from explicitly named Master Catalog solids", () => {
    expect(batchDefinitions).toHaveLength(50);
    expect(batchDefinitions.every((definition) => definition.reviewStatus === "draft")).toBe(true);
    expect(batchDefinitions.filter((definition) => masterCatalogNamedSolidTitles.has(definition.title))).toEqual([]);
  });

  it("requires exactly one non-authoritative reconciliation disposition for every Batch 1–10 calculator", () => {
    const batchTitles = batchDefinitions.map((definition) => definition.title).sort();
    const manifestTitles = solidGeometryReconciliationManifest.map((entry) => entry.title).sort();
    expect(solidGeometryReconciliationManifest).toHaveLength(50);
    expect(new Set(manifestTitles).size).toBe(50);
    expect(manifestTitles).toEqual(batchTitles);
    expect(solidGeometryReconciliationManifest.every((entry) => entry.certificationAuthority === false)).toBe(true);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.disposition === "volume-family-proposal")).toHaveLength(26);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.disposition === "surface-area-family-proposal")).toHaveLength(22);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.disposition === "explicit-expansion-required")).toHaveLength(2);
  });

  it("keeps the single governance approval target proposed and non-authoritative", () => {
    expect(solidGeometryReconciliationManifest.every((entry) => entry.governanceDecisionStatus === "proposed")).toBe(true);
    expect(solidGeometryReconciliationManifest.every((entry) => entry.certificationAuthority === false)).toBe(true);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.governanceDecisionCatalogId === 274)).toHaveLength(22);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.governanceDecisionCatalogId === 275)).toHaveLength(26);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.governanceDecisionCatalogId === 278)).toHaveLength(2);
    expect(solidGeometryReconciliationManifest.filter((entry) => entry.disposition === "explicit-expansion-required").every((entry) => entry.governanceDecisionCatalogId === 278)).toBe(true);
  });

  it("registers every explicit batch calculator without identity drift", () => {
    for (const definition of batchDefinitions) {
      expect(calculatorRegistry.getById(definition.id)?.slug).toBe(definition.slug);
      expect(calculatorRegistry.getBySlug(definition.slug)?.id).toBe(definition.id);
    }
  });
});
