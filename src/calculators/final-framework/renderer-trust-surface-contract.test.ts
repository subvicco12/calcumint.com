import { describe, expect, it } from "vitest";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("renderer trust rendering contract", () => {
  it("preserves authoritative source labels and URLs", () => {
    const trust = rendererTrustSurface({
      primaryResult: { id: "result", label: "Result", value: 1 },
      methodology: "Certified deterministic method",
      sources: [{ label: "Reference", url: "https://example.com/reference" }]
    });
    expect(trust?.methodology).toBe("Certified deterministic method");
    expect(trust?.sources[0]).toEqual({ label: "Reference", url: "https://example.com/reference" });
  });
});
