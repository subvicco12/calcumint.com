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

  it("registers every explicit batch calculator without identity drift", () => {
    for (const definition of batchDefinitions) {
      expect(calculatorRegistry.getById(definition.id)?.slug).toBe(definition.slug);
      expect(calculatorRegistry.getBySlug(definition.slug)?.id).toBe(definition.id);
    }
  });
});
