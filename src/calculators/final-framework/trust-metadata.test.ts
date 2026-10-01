import { describe, expect, it } from "vitest";
import { resolveFinalTrustMetadata } from "./trust-metadata";

describe("Final trust metadata", () => {
  it("requires methodology, sources and immutable technical version metadata", () => {
    const result = { primaryResult: { id: "x", label: "Result", value: 1 }, methodology: "Certified method", sources: [{ label: "Reference" }] };
    expect(resolveFinalTrustMetadata(result, "calc-1.2.3")).toEqual({
      methodology: "Certified method",
      sources: [{ label: "Reference" }],
      technicalVersion: "calc-1.2.3"
    });
    expect(resolveFinalTrustMetadata({ primaryResult: result.primaryResult }, "calc-1.2.3")).toBeNull();
  });
});
