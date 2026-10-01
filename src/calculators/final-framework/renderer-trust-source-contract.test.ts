import { describe, expect, it } from "vitest";
import { rendererTrustSurface } from "./renderer-trust-surface";
describe("Final renderer source contract", () => {
  it("preserves source metadata without inventing missing URLs", () => {
    const trust = rendererTrustSurface({
      primaryResult: { id: "r", label: "Result", value: 1 },
      methodology: "Certified method",
      sources: [{ label: "Primary reference" }]
    });
    expect(trust?.sources).toEqual([{ label: "Primary reference" }]);
  });
});
