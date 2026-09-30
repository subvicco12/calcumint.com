import { describe, expect, it } from "vitest";
import {
  FINAL_CAPABILITY_MATRIX,
  MATHEMATICAL_PARITY_CAPABILITIES,
  canUseFinalCapability,
  resolveFinalCapability
} from "./product-capabilities";

describe("Final Blueprint product capability resolver", () => {
  it("keeps mathematical correctness capabilities active for every plan", () => {
    for (const capability of MATHEMATICAL_PARITY_CAPABILITIES) {
      expect(FINAL_CAPABILITY_MATRIX[capability]).toEqual({
        free: "active",
        pro: "active",
        business: "active"
      });
    }
  });

  it("models Free analysis as useful limited/preview capability rather than a weaker calculation", () => {
    expect(resolveFinalCapability("free", "basicVisualization")).toBe("active");
    expect(resolveFinalCapability("free", "detailedCharts")).toBe("limited");
    expect(resolveFinalCapability("free", "scenarioComparison")).toBe("preview");
    expect(resolveFinalCapability("free", "sensitivityAnalysis")).toBe("preview");
  });

  it("makes Pro analytical capabilities active without granting Business deployment capabilities", () => {
    expect(canUseFinalCapability("pro", "scenarioComparison")).toBe(true);
    expect(canUseFinalCapability("pro", "professionalExports")).toBe(true);
    expect(canUseFinalCapability("pro", "teamWorkspace")).toBe(false);
    expect(canUseFinalCapability("pro", "apiBatchWebhooks")).toBe(false);
  });

  it("reserves organization and deployment capabilities for Business", () => {
    expect(canUseFinalCapability("business", "teamWorkspace")).toBe(true);
    expect(canUseFinalCapability("business", "customCalculatorBuilder")).toBe(true);
    expect(canUseFinalCapability("business", "brandingWhiteLabelEmbed")).toBe(true);
    expect(canUseFinalCapability("business", "apiBatchWebhooks")).toBe(true);
    expect(canUseFinalCapability("business", "leadCaptureGovernance")).toBe(true);
  });

  it("keeps ads out of paid plans", () => {
    expect(resolveFinalCapability("free", "ads")).toBe("active");
    expect(resolveFinalCapability("pro", "ads")).toBe("unavailable");
    expect(resolveFinalCapability("business", "ads")).toBe("unavailable");
  });
});
