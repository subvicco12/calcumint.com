import { describe, expect, it } from "vitest";
import { rendererTrustSurface } from "./renderer-trust-surface";

describe("Final renderer complete trust section", () => {
  it("fails closed when methodology or sources are absent", () => {
    const primaryResult = { id: "r", label: "Result", value: 1 };
    expect(rendererTrustSurface({ primaryResult, methodology: "Method" })).toBeNull();
    expect(rendererTrustSurface({ primaryResult, sources: [{ label: "Source" }] })).toBeNull();
  });
});
