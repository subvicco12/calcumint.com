import { describe, expect, it } from "vitest";
import { createStructuredResult } from "./structured-result";
import { resolveStructuredFinalTrustMetadata } from "./structured-trust-metadata";

describe("structured Final trust metadata", () => {
  const primaryResult = { id: "result", label: "Result", value: 1 };

  it("fails closed when methodology is missing", () => {
    const result = createStructuredResult({ primaryResult, sources: [{ label: "Source" }] });
    expect(resolveStructuredFinalTrustMetadata(result, "engine-1")).toBeNull();
  });

  it("fails closed when sources are missing", () => {
    const result = createStructuredResult({ primaryResult, methodology: "Method" });
    expect(resolveStructuredFinalTrustMetadata(result, "engine-1")).toBeNull();
  });
});
