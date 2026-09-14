import { describe, expect, it } from "vitest";
import { featureFlags } from "./feature-flags";

describe("product feature flags", () => {
  it("enables B8 API and webhooks while AI and admin remain disabled", () => {
    expect(featureFlags.calculatorEngine).toBe(true);
    expect(featureFlags.accounts).toBe(true);
    expect(featureFlags.proBilling).toBe(true);
    expect(featureFlags.businessWorkspace).toBe(true);
    expect(featureFlags.calculatorBuilder).toBe(true);
    expect(featureFlags.embedsAndLeads).toBe(true);
    expect(featureFlags.apiAndWebhooks).toBe(true);
    expect(featureFlags.aiAssistant).toBe(false);
    expect(featureFlags.adminConsole).toBe(false);
  });
});
