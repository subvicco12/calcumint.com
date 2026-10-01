import { describe, expect, it } from "vitest";
import { displayFinalValue } from "./renderer-display";
describe("Final renderer display formatting", () => {
  it("formats authoritative values without changing their mathematical value", () => {
    expect(displayFinalValue(1234.567, "USD")).toBe("1,234.57 USD");
    expect(displayFinalValue("classified")).toBe("classified");
  });
});
