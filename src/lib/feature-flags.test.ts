import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables the complete B0-B10 product surface", () => {
    expect(featureFlags.calculatorEngine).toBe(true);
    expect(featureFlags.accounts).toBe(true);
    expect(featureFlags.proBilling).toBe(true);
    expect(featureFlags.businessWorkspace).toBe(true);
    expect(featureFlags.calculatorBuilder).toBe(true);
    expect(featureFlags.embedsAndLeads).toBe(true);
    expect(featureFlags.apiAndWebhooks).toBe(true);
    expect(featureFlags.aiAssistant).toBe(true);
    expect(featureFlags.adminConsole).toBe(true);
  });
});
