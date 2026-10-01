import { describe, expect, it } from "vitest";
import { calculatorRegistry } from "../registry";

describe("Final trust and technical-version contract", () => {
  it("retains immutable numeric technical versions for certified definitions", () => {
    const certified = calculatorRegistry.list().filter(definition => definition.reviewStatus === "certified");
    expect(certified.length).toBeGreaterThan(0);
    for (const definition of certified) {
      expect(Number.isInteger(definition.version)).toBe(true);
      expect(definition.version).toBeGreaterThan(0);
    }
  });

  it("keeps customer-facing Final terminology separate from technical version identity", () => {
    const certified = calculatorRegistry.list().filter(definition => definition.reviewStatus === "certified");
    for (const definition of certified) {
      expect(String(definition.version).toLowerCase()).not.toBe("final");
    }
  });
});
