import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type LightingEnergyOutput = { energyKwh: number; steps: readonly string[] };

const nonnegative = z.number().finite().nonnegative().max(1e12);
const positiveInteger = z.number().int().positive().max(1_000_000);
const finite = (value: number) => {
  if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range");
  return value;
};
const doe = {
  label: "U.S. Department of Energy — Estimating Appliance and Home Electronic Energy Use",
  url: "https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use",
  note: "DOE describes estimating electricity consumption from wattage and operating time; this calculator applies that method across an explicitly supplied number of identical lights."
};

export const lightingEnergyCalculator: CalculatorDefinition<
  { quantity: number; wattsPerLight: number; hoursUsed: number },
  LightingEnergyOutput
> = {
  id: "energy.lighting-energy",
  slug: "lighting-energy-calculator",
  title: "Lighting Energy Calculator",
  category: "everyday",
  version: 1,
  riskClass: "standard",
  reviewStatus: "draft",
  jurisdictions: [{ country: "GLOBAL" }],
  inputSchema: z.object({
    quantity: positiveInteger,
    wattsPerLight: nonnegative,
    hoursUsed: nonnegative
  }),
  calculate: (input) => {
    z.object({ quantity: positiveInteger, wattsPerLight: nonnegative, hoursUsed: nonnegative }).parse(input);
    const energyKwh = finite(input.quantity * input.wattsPerLight * input.hoursUsed / 1000);
    return {
      energyKwh,
      steps: [`Energy = ${input.quantity} × ${input.wattsPerLight} W × ${input.hoursUsed} h ÷ 1000 = ${energyKwh} kWh`]
    };
  },
  formulas: [{
    id: "lighting-energy",
    expression: "energy kWh = quantity × watts per light × hours used ÷ 1000",
    description: "Sum identical lighting load and convert watt-hours to kilowatt-hours."
  }],
  sources: [doe],
  examples: [{
    label: "Ten 12 W lights for 5 hours",
    input: { quantity: 10, wattsPerLight: 12, hoursUsed: 5 },
    expected: { energyKwh: 0.6, steps: ["Energy = 10 × 12 W × 5 h ÷ 1000 = 0.6 kWh"] }
  }],
  goldenTests: [{
    label: "LED lighting energy",
    input: { quantity: 10, wattsPerLight: 12, hoursUsed: 5 },
    expected: { energyKwh: 0.6 }
  }]
};

export const energyEnvironmentCatalogBatch2Definitions = [lightingEnergyCalculator] as const;
