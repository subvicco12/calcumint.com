import { describe, expect, it } from "vitest";
import { resolveCapabilityPresentation } from "./capability-presentation";

describe("Final capability presentation policy", () => {
  it("shows Free scenario analysis as preview without execution entitlement", () => {
    expect(resolveCapabilityPresentation("free", "scenarioComparison")).toEqual({
      state: "preview", canExecute: false, showPreview: true, showUpgradePrompt: true
    });
  });
  it("allows Pro analysis execution", () => {
    expect(resolveCapabilityPresentation("pro", "scenarioComparison")).toEqual({
      state: "active", canExecute: true, showPreview: false, showUpgradePrompt: false
    });
  });
  it("does not tease unavailable Business-only workflow as a Free preview", () => {
    expect(resolveCapabilityPresentation("free", "teamWorkspace")).toEqual({
      state: "unavailable", canExecute: false, showPreview: false, showUpgradePrompt: false
    });
  });
});
