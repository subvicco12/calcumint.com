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
  sources: [
    {
      label: "NIST Guide to the SI — conversion factors",
      url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",
      note: "Reference conversion factors for units by quantity, including the exact international mile-to-kilometre relationship used by the verified example."
    },
    {
      label: "BIPM — SI Brochure, 9th edition",
      url: "https://www.bipm.org/en/publications/si-brochure",
      note: "Authoritative reference for the International System of Units (SI)."
    }
  ],
  examples: [
    {
      label: "1 mile to kilometres",
      input: { value: 1, fromUnit: "mi", toUnit: "km" },
      expected: { result: 1.609344 }
    }
  ]
};
