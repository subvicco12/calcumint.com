import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("Compound Interest renderer wiring contract", () => {
  it("keeps advanced analysis panels separate from the core result presentation", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src/components/calculator-interactive.tsx"), "utf8");
    const start = source.indexOf("function CompoundInterestTool()");
    const end = source.indexOf("function LoanGoalSolver", start);
    const tool = source.slice(start, end);
    expect(tool).toContain("compoundInterestResult(input,output)");
    expect(tool).toContain("ScenarioComparisonPanel");
    expect(tool).toContain("SensitivityPanel");
    expect(tool).toContain("CompoundGoalSolver");
  });
});
