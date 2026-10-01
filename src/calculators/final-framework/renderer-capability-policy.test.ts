import { describe, expect, it } from "vitest";
import { executableRendererCapabilities, resolveFinalRendererCapabilities } from "./renderer-capability-policy";

describe("Final renderer capability policy", () => {
  it("delegates execution and preview decisions to the centralized capability policy", () => {
    const capabilities = ["certifiedCoreCalculation", "scenarioComparison"] as const;
    const free = resolveFinalRendererCapabilities("free", capabilities);
    expect(free[0]?.presentation.canExecute).toBe(true);
    expect(free[1]?.presentation.canExecute).toBe(false);
    expect(free[1]?.presentation.showPreview).toBe(true);
    expect(executableRendererCapabilities("free", capabilities)).toEqual(["certifiedCoreCalculation"]);
  });
});
