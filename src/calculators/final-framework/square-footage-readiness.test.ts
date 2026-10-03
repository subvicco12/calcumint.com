import {describe,expect,it} from "vitest";
import {runCalculator} from "../engine";
import {squareFootageCalculator} from "../engineering-construction/catalog-batch-1";

describe("Square Footage Calculator Final-renderer readiness",()=>{
  it("has certified standard-risk deterministic evidence",()=>{
    expect(squareFootageCalculator.reviewStatus).toBe("certified");
    expect(squareFootageCalculator.riskClass).toBe("standard");
    expect(squareFootageCalculator.formulas.length).toBeGreaterThan(0);
    expect(squareFootageCalculator.sources.length).toBeGreaterThan(0);
    expect(squareFootageCalculator.goldenTests?.length ?? 0).toBeGreaterThan(0);
  });
  it("preserves authoritative area multiplication",()=>{
    const output=runCalculator(squareFootageCalculator,{lengthFeet:12,widthFeet:10,quantity:2}).output;
    expect(output.value).toBe(240);
    expect(output.steps).toEqual(["Square Footage = 240"]);
  });
  it("preserves positive-only dimensional and quantity validation",()=>{
    expect(squareFootageCalculator.inputSchema.safeParse({lengthFeet:0,widthFeet:10,quantity:2}).success).toBe(false);
    expect(squareFootageCalculator.inputSchema.safeParse({lengthFeet:12,widthFeet:10,quantity:0}).success).toBe(false);
    expect(squareFootageCalculator.inputSchema.safeParse({lengthFeet:12,widthFeet:10,quantity:1.5}).success).toBe(false);
  });
});
