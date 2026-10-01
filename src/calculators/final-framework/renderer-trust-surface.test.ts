import { describe, expect, it } from "vitest";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Final renderer trust surface", () => {
  it("fails closed unless methodology and sources are both present", () => {
    const primaryResult = { id: "x", label: "Result", value: 1 };
    expect(rendererTrustSurface({ primaryResult, methodology: "Method" })).toBeNull();
    expect(rendererTrustSurface({ primaryResult, sources: [{ label: "Source" }] })).toBeNull();
    expect(rendererTrustSurface({ primaryResult, methodology: "Method", sources: [{ label: "Source" }] })).not.toBeNull();
  });
});
