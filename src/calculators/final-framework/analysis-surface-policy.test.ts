import { describe, expect, it } from "vitest";
import { referencePresentations } from "./reference-presentations";
import { resolveAnalysisSurface } from "./analysis-surface-policy";

describe("Final analysis surface policy", () => {
  it("keeps unsupported surfaces absent", () => {
    expect(resolveAnalysisSurface("business", referencePresentations.bmi, "scenarios")).toBeNull();
  });
  it("uses centralized entitlements for supported surfaces", () => {
    expect(resolveAnalysisSurface("free", referencePresentations.loanEmi, "schedule")?.canExecute).toBe(false);
    expect(resolveAnalysisSurface("pro", referencePresentations.loanEmi, "schedule")?.canExecute).toBe(true);
    expect(resolveAnalysisSurface("free", referencePresentations.breakEven, "scenarios")?.showPreview).toBe(true);
  });
});
