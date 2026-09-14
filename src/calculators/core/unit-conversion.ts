import { z } from "zod";
import { convertUnit, getUnitFamily, supportedUnits } from "../units";
import { roundTo } from "../precision";
import type { CalculatorDefinition } from "../types";

const inputSchema = z.object({
  value: z.number().finite(),
  fromUnit: z.string().refine((unit) => supportedUnits.includes(unit), "Unsupported source unit"),
  toUnit: z.string().refine((unit) => supportedUnits.includes(unit), "Unsupported target unit")
}).superRefine((input, ctx) => {
  if (getUnitFamily(input.fromUnit) !== getUnitFamily(input.toUnit)) {
    ctx.addIssue({ code: "custom", message: "Units must belong to the same family" });
  }
});

type Input = z.infer<typeof inputSchema>;
type Output = { result: number };

export const unitConversionCalculator: CalculatorDefinition<Input, Output> = {
  id: "core.unit-conversion",
  slug: "unit-conversion-calculator",
  title: "Unit Conversion Calculator",
  category: "unit-conversions",
  version: 1,
  riskClass: "standard",
  reviewStatus: "certified",
  inputSchema,
  calculate: ({ value, fromUnit, toUnit }) => ({ result: roundTo(convertUnit(value, fromUnit, toUnit), 12) }),
  formulas: [
    {
      id: "unit-conversion",
      expression: "target = source × sourceFactor / targetFactor",
      description: "Linear conversions use SI/base factors; temperatures convert through kelvin."
    }
  ],
  sources: [],
  examples: [
    {
      label: "1 mile to kilometres",
      input: { value: 1, fromUnit: "mi", toUnit: "km" },
      expected: { result: 1.609344 }
    }
  ]
};
