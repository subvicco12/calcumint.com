import { describe, expect, it } from "vitest";
import { executableRendererCapabilities, resolveFinalRendererCapabilities } from "./renderer-capability-policy";

describe("Final renderer capability policy", () => {
  it("delegates execution and preview decisions to the centralized capability policy", () => {
    const capabilities = ["core-calculation", "scenario-comparison"] as const;
    const free = resolveFinalRendererCapabilities("free", capabilities);
    expect(free[0]?.presentation.canExecute).toBe(true);
    expect(free[1]?.presentation.canExecute).toBe(false);
    expect(executableRendererCapabilities("free", capabilities)).toEqual(["core-calculation"]);
  });
});
