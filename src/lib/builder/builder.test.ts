import { describe, expect, it } from "vitest";
import { evaluateFormula } from "./formula";
import { customCalculatorSchema, runCustomCalculator } from "./definition";

describe("safe custom calculator formula engine", () => {
  it("evaluates arithmetic with precedence", () => {
    expect(evaluateFormula("revenue - cost * 2", { revenue: 100, cost: 20 })).toBe(60);
  });

  it("supports IF and comparison logic", () => {
    expect(evaluateFormula("IF(revenue > 0, profit / revenue * 100, 0)", { revenue: 1000, profit: 250 })).toBe(25);
    expect(evaluateFormula("IF(revenue > 0 && cost >= 0, 1, 0)", { revenue: 1000, cost: 0 })).toBe(1);
  });

  it("supports deterministic helper functions", () => {
    expect(evaluateFormula("ROUND(MAX(ABS(-2.345), 1), 2)", {})).toBe(2.35);
  });

  it("rejects unknown variables and unsupported syntax", () => {
    expect(() => evaluateFormula("missing + 1", {})).toThrow(/Unknown/);
    expect(() => evaluateFormula("globalThis.process", {})).toThrow(/Unsupported formula token/);
    expect(() => evaluateFormula("1 / 0", {})).toThrow(/Division by zero/);
  });

  it("validates and runs a versioned calculator definition", () => {
    const definition = customCalculatorSchema.parse({
      name: "Margin",
      description: "Test",
      fields: [
        { key: "revenue", label: "Revenue", type: "currency", required: true, min: 0 },
        { key: "cost", label: "Cost", type: "currency", required: true, min: 0 }
      ],
      outputs: [
        { key: "profit", label: "Profit", formula: "revenue-cost", format: "currency", decimals: 2 },
        { key: "margin", label: "Margin", formula: "IF(revenue > 0, profit/revenue*100, 0)", format: "percentage", decimals: 2 }
      ]
    });
    expect(runCustomCalculator(definition, { revenue: 1000, cost: 600 }).output).toEqual({ profit: 400, margin: 40 });
  });
});
