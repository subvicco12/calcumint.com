import { describe, expect, it } from "vitest";
import { displayFinalValue } from "./renderer-display";
describe("Final renderer metric contract", () => {
  it("preserves labels, units and zero values for rendering", () => {
    expect(displayFinalValue(0, "%")).toBe("0 %");
    expect(displayFinalValue(12.5, "months")).toBe("12.5 months");
  });
});
