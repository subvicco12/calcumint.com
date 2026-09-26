import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";

describe("solid geometry cross-batch audit", () => {
  const solid = calculatorRegistry.list().filter((d) => d.id.startsWith("geometry.") && /(?:sphere|spherical|cylinder|cone|prism|pyramid|frustum|polyhedron|tetrahedron|octahedron|dodecahedron|icosahedron|capsule|cuboid)/i.test(d.title));
  it("keeps every audited solid-geometry calculator non-public until certification", () => {
    expect(solid.length).toBeGreaterThanOrEqual(50);
    for (const d of solid) expect(d.reviewStatus).toBe("draft");
  });
  it("has unique ids and slugs across the audited family", () => {
    expect(new Set(solid.map((d) => d.id)).size).toBe(solid.length);
    expect(new Set(solid.map((d) => d.slug)).size).toBe(solid.length);
  });
  it("provides formula, source, example, and golden-test metadata for every audited calculator", () => {
    for (const d of solid) {
      expect(d.formulas?.length ?? 0).toBeGreaterThan(0);
      expect(d.sources?.length ?? 0).toBeGreaterThan(0);
      expect(d.examples?.length ?? 0).toBeGreaterThan(0);
      expect(d.goldenTests?.length ?? 0).toBeGreaterThan(0);
    }
  });
});
