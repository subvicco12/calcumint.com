import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables B9 AI while the later admin console remains disabled", () => {
    expect(featureFlags.calculatorEngine).toBe(true);
    expect(featureFlags.accounts).toBe(true);
    expect(featureFlags.proBilling).toBe(true);
    expect(featureFlags.businessWorkspace).toBe(true);
    expect(featureFlags.calculatorBuilder).toBe(true);
    expect(featureFlags.embedsAndLeads).toBe(true);
    expect(featureFlags.apiAndWebhooks).toBe(true);
    expect(featureFlags.aiAssistant).toBe(true);
    expect(featureFlags.adminConsole).toBe(false);
  });
});
