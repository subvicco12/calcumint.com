import { describe, expect, it } from "vitest";
import { rendererTrustSurface } from "./renderer-trust-surface";
describe("Final renderer trust UI contract", () => {
  it("exposes methodology and sources together only when trust evidence is complete", () => {
    const trust = rendererTrustSurface({ primaryResult: { id: "r", label: "Result", value: 1 }, methodology: "Method", sources: [{ label: "Source" }] });
    expect(trust).toEqual({ methodology: "Method", sources: [{ label: "Source" }] });
  });
});
