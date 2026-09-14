import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables calculator engine and accounts in B3 while later commercial systems stay disabled", () => {
    expect(featureFlags.calculatorEngine).toBe(true);
    expect(featureFlags.accounts).toBe(true);
    expect(featureFlags.proBilling).toBe(false);
    expect(featureFlags.businessWorkspace).toBe(false);
    expect(featureFlags.calculatorBuilder).toBe(false);
    expect(featureFlags.embedsAndLeads).toBe(false);
    expect(featureFlags.apiAndWebhooks).toBe(false);
    expect(featureFlags.aiAssistant).toBe(false);
    expect(featureFlags.adminConsole).toBe(false);
  });
});
