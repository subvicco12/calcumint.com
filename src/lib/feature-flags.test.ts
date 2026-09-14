import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables the certified platform through Business workspaces in B5", () => {
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
