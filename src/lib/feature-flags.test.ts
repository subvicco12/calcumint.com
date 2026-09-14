import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables only the certified calculator engine in B2", () => {
    expect(featureFlags.calculatorEngine).toBe(true);
    expect(featureFlags.accounts).toBe(false);
    expect(featureFlags.proBilling).toBe(false);
    expect(featureFlags.businessWorkspace).toBe(false);
    expect(featureFlags.calculatorBuilder).toBe(false);
    expect(featureFlags.embedsAndLeads).toBe(false);
    expect(featureFlags.apiAndWebhooks).toBe(false);
    expect(featureFlags.aiAssistant).toBe(false);
    expect(featureFlags.adminConsole).toBe(false);
  });
});
