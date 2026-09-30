import { describe, expect, it } from "vitest";
import {
  assertNoAccuracyPaywall,
  requiredEntitlementForInput,
  validateInputEntitlement
} from "./input-governance";

describe("Final Blueprint input governance", () => {
  it("never paywalls core, accuracy-required or jurisdiction-required inputs", () => {
    expect(requiredEntitlementForInput("core")).toBe("always");
    expect(requiredEntitlementForInput("accuracy-required")).toBe("always");
    expect(requiredEntitlementForInput("jurisdiction-required")).toBe("always");
  });

  it("allows optional analytical depth to be Pro/Business", () => {
    expect(requiredEntitlementForInput("advanced-analysis")).toBe("pro-or-business");
  });

  it("reserves organization/deployment controls for Business", () => {
    expect(requiredEntitlementForInput("business-workflow")).toBe("business");
  });

  it("fails closed when an accuracy-required input is assigned to a paid entitlement", () => {
    expect(() =>
      validateInputEntitlement({
        key: "interestRate",
        inputClass: "accuracy-required",
        entitlement: "pro-or-business"
      })
    ).toThrow(/must use entitlement "always"/);
  });

  it("validates a mixed governed input contract", () => {
    expect(() =>
      assertNoAccuracyPaywall([
        { key: "principal", inputClass: "core", entitlement: "always" },
        { key: "country", inputClass: "jurisdiction-required", entitlement: "always" },
        { key: "refinanceScenario", inputClass: "advanced-analysis", entitlement: "pro-or-business" },
        { key: "embedTheme", inputClass: "business-workflow", entitlement: "business" }
      ])
    ).not.toThrow();
  });
});
