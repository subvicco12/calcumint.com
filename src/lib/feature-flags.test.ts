import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables Business workspace in B5 while later systems stay disabled", () => {
    expect(featureFlags.calculatorEngine).toBe(true);
    expect(featureFlags.accounts).toBe(true);
    expect(featureFlags.proBilling).toBe(true);
    expect(featureFlags.businessWorkspace).toBe(true);
    expect(featureFlags.calculatorBuilder).toBe(false);
    expect(featureFlags.embedsAndLeads).toBe(false);
    expect(featureFlags.apiAndWebhooks).toBe(false);
    expect(featureFlags.aiAssistant).toBe(false);
    expect(featureFlags.adminConsole).toBe(false);
  });
});
