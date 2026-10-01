import { describe, expect, it } from "vitest";
import { MATHEMATICAL_PARITY_CAPABILITIES, resolveFinalCapability } from "./product-capabilities";

describe("Final cross-plan mathematical parity matrix", () => {
  it("keeps every mathematical parity capability active for every plan", () => {
    for (const capability of MATHEMATICAL_PARITY_CAPABILITIES) {
      expect(resolveFinalCapability("free", capability)).toBe("active");
      expect(resolveFinalCapability("pro", capability)).toBe("active");
      expect(resolveFinalCapability("business", capability)).toBe("active");
    }
  });

  it("keeps monetized analysis capability separate from core mathematical parity", () => {
    expect(resolveFinalCapability("free", "scenarioComparison")).not.toBe("active");
    expect(resolveFinalCapability("pro", "scenarioComparison")).toBe("active");
    expect(resolveFinalCapability("business", "scenarioComparison")).toBe("active");
  });
});
