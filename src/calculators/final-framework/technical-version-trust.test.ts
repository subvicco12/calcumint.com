import { describe, expect, it } from "vitest";
import { createStructuredResult } from "./structured-result";
import { resolveStructuredFinalTrustMetadata } from "./structured-trust-metadata";

describe("Final technical version trust", () => {
  const trusted = createStructuredResult({
    primaryResult: { key: "result", label: "Result", value: 1 },
    methodology: "Certified deterministic method",
    sources: [{ label: "Method reference" }]
  });
  it("rejects blank technical versions", () => {
    expect(resolveStructuredFinalTrustMetadata(trusted, "   ")).toBeNull();
  });
  it("does not treat a technical version as a customer release label", () => {
    expect(resolveStructuredFinalTrustMetadata(trusted, "engine-2026.10")?.technicalVersion).toBe("engine-2026.10");
  });
});
