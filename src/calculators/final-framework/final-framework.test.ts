import { describe, expect, it } from "vitest";
import { capabilitiesFor, hasCalculatorCapability, minimumPlanFor } from "./entitlements";
import { referencePresentations } from "./reference-presentations";
import { calculatorRegistry } from "../registry";
import { getPublicCalculatorContent, listPublicCalculators } from "../public-content";

describe("Final Calculator Framework", () => {
  it("keeps mathematical correctness free", () => {
    expect(hasCalculatorCapability("free", "coreCalculation")).toBe(true);
    expect(hasCalculatorCapability("free", "resultMetrics")).toBe(true);
    expect(hasCalculatorCapability("free", "methodology")).toBe(true);
    expect(minimumPlanFor("coreCalculation")).toBe("free");
  });

  it("places the complete analysis and professional capability set at Pro without blocking Business", () => {
    for (const capability of [
      "advancedVisualization", "detailedSchedule", "goalSolver", "scenarioComparison",
      "sensitivityAnalysis", "professionalExport", "advancedAIExplanation", "savedProjects"
    ] as const) {
      expect(minimumPlanFor(capability)).toBe("pro");
      expect(hasCalculatorCapability("free", capability)).toBe(false);
      expect(hasCalculatorCapability("pro", capability)).toBe(true);
      expect(hasCalculatorCapability("business", capability)).toBe(true);
    }
  });

  it("reserves the complete workspace, deployment and automation capability set for Business", () => {
    for (const capability of [
      "teamWorkspace", "customBuilder", "embed", "whiteLabel", "api", "batchProcessing",
      "webhooks", "leadCapture", "governance"
    ] as const) {
      expect(minimumPlanFor(capability)).toBe("business");
      expect(hasCalculatorCapability("free", capability)).toBe(false);
      expect(hasCalculatorCapability("pro", capability)).toBe(false);
      expect(hasCalculatorCapability("business", capability)).toBe(true);
    }
  });

  it("defines all six architecture reference calculators", () => {
    expect(Object.keys(referencePresentations)).toEqual([
      "loanEmi", "sip", "compoundInterest", "mortgage", "bmi", "breakEven"
    ]);
  });

  it("gives every reference a meaningful free visualization", () => {
    for (const presentation of Object.values(referencePresentations)) {
      expect(presentation.freeVisualization).toBeTruthy();
      expect(presentation.supportedVisualizations).toContain(presentation.freeVisualization);
    }
  });


  it("keeps reference feature declarations semantically bounded", () => {
    const bmi = referencePresentations.bmi;
    expect(bmi.supportedVisualizations).toEqual(["range-indicator"]);
    expect(bmi.supportsSchedule).toBe(false);
    expect(bmi.supportsGoalSolver).toBe(false);
    expect(bmi.supportsScenarios).toBe(false);
    expect(bmi.supportsSensitivity).toBe(false);

    expect(referencePresentations.loanEmi.supportsSchedule).toBe(true);
    expect(referencePresentations.sip.supportsSchedule).toBe(false);
    expect(referencePresentations.compoundInterest.supportsSchedule).toBe(false);
    expect(referencePresentations.mortgage.supportsSchedule).toBe(false);
    expect(referencePresentations.breakEven.supportsSchedule).toBe(false);

    for (const key of ["loanEmi", "sip", "compoundInterest", "mortgage", "breakEven"] as const) {
      const presentation = referencePresentations[key];
      expect(presentation.supportsGoalSolver).toBe(true);
      expect(presentation.supportsScenarios).toBe(true);
      expect(presentation.supportsSensitivity).toBe(true);
    }
  });

  it("keeps declared analysis capabilities represented by matching visualization semantics", () => {
    for (const presentation of Object.values(referencePresentations)) {
      if (presentation.supportsScenarios) expect(presentation.supportedVisualizations).toContain("comparison-bars");
      if (presentation.supportsSensitivity) expect(presentation.supportedVisualizations).toContain("sensitivity");
      if (!presentation.supportsScenarios) expect(presentation.supportedVisualizations).not.toContain("comparison-bars");
      if (!presentation.supportsSensitivity) expect(presentation.supportedVisualizations).not.toContain("sensitivity");
    }
  });

  it("keeps decision references distinct from analytical references", () => {
    expect(referencePresentations.loanEmi.level).toBe("decision");
    expect(referencePresentations.sip.level).toBe("decision");
    expect(referencePresentations.mortgage.level).toBe("decision");
    expect(referencePresentations.breakEven.level).toBe("decision");
    expect(referencePresentations.compoundInterest.level).toBe("analytical");
    expect(referencePresentations.bmi.level).toBe("analytical");
  });

  it("keeps draft BMI and Break-even references outside public content", () => {
    expect(calculatorRegistry.getBySlug("bmi-calculator")?.reviewStatus).toBe("draft");
    expect(calculatorRegistry.getBySlug("break-even-calculator")?.reviewStatus).toBe("draft");
    expect(getPublicCalculatorContent("bmi-calculator")).toBeUndefined();
    expect(getPublicCalculatorContent("break-even-calculator")).toBeUndefined();
  });

  it("keeps public calculator slugs unique with one canonical category route", () => {
    const published = listPublicCalculators();
    expect(new Set(published.map(item => item.slug)).size).toBe(published.length);
    for (const item of published) {
      expect(getPublicCalculatorContent(item.slug)?.category).toBe(item.category);
      expect(calculatorRegistry.getBySlug(item.slug)?.reviewStatus).toBe("certified");
    }
  });

  it("keeps capability inheritance monotonic", () => {
    const free = new Set(capabilitiesFor("free"));
    const pro = new Set(capabilitiesFor("pro"));
    const business = new Set(capabilitiesFor("business"));
    for (const capability of free) expect(pro.has(capability)).toBe(true);
    for (const capability of pro) expect(business.has(capability)).toBe(true);
  });

  it("keeps every declared capability in exactly one minimum-tier partition", () => {
    const free = capabilitiesFor("free").filter(capability => minimumPlanFor(capability) === "free");
    const pro = capabilitiesFor("pro").filter(capability => minimumPlanFor(capability) === "pro");
    const business = capabilitiesFor("business").filter(capability => minimumPlanFor(capability) === "business");
    const all = capabilitiesFor("business");
    expect(new Set([...free, ...pro, ...business]).size).toBe(all.length);
    expect(free.length + pro.length + business.length).toBe(all.length);
  });
});
