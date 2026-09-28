import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type Out = { value: number; steps: string[] };
type MetricEconomyInput = { distanceKm: number; fuelUsedLiters: number };
type GasMileageInput = { distanceMiles: number; fuelUsedUsGallons: number };
type TripFuelInput = { distanceKm: number; fuelConsumptionLitersPer100Km: number };

const positive = z.number().finite().positive().max(1e12);
const nonnegative = z.number().finite().nonnegative().max(1e12);
const source = { label: "U.S. Department of Energy — FuelEconomy.gov", url: "https://www.fueleconomy.gov/", note: "Fuel economy and trip fuel use vary with vehicle and operating conditions. These DRAFT calculators use explicit user-supplied distance and fuel quantities." };
function finite(value: number): number { if (!Number.isFinite(value)) throw new Error("Calculated result is outside the supported finite range"); return value; }\nconst base = { category: "everyday", version: 1, riskClass: "standard" as const, reviewStatus: "draft" as const, sources: [source], jurisdictions: [{ country: "GLOBAL" }] };

export const fuelEconomyCalculator: CalculatorDefinition<MetricEconomyInput, Out> = {
  ...base, id: "automotive.fuel-economy", slug: "fuel-economy-calculator", title: "Fuel Economy Calculator",
  inputSchema: z.object({ distanceKm: nonnegative, fuelUsedLiters: positive }),
  calculate: (input) => { const value = finite(input.distanceKm / input.fuelUsedLiters); return { value, steps: [`Fuel economy = ${value}`] }; },
  formulas: [{ id: "fuel-economy-calculator", expression: "fuel economy = distance ÷ fuel used", description: "Calculate distance traveled per liter from user-supplied distance and fuel used." }],
  examples: [{ label: "Reference example", input: { distanceKm: 600, fuelUsedLiters: 40 }, expected: { value: 15, steps: ["Fuel economy = 15"] } }],
  goldenTests: [{ label: "Reference example", input: { distanceKm: 600, fuelUsedLiters: 40 }, expected: { value: 15 } }]
};

export const gasMileageCalculator: CalculatorDefinition<GasMileageInput, Out> = {
  ...base, id: "automotive.gas-mileage", slug: "gas-mileage-calculator", title: "Gas Mileage Calculator",
  inputSchema: z.object({ distanceMiles: nonnegative, fuelUsedUsGallons: positive }),
  calculate: (input) => { const value = finite(input.distanceMiles / input.fuelUsedUsGallons); return { value, steps: [`Gas mileage = ${value}`] }; },
  formulas: [{ id: "gas-mileage-calculator", expression: "gas mileage = distance miles ÷ US gallons used", description: "Calculate US miles per gallon from user-supplied distance and US gallons consumed." }],
  examples: [{ label: "Reference example", input: { distanceMiles: 300, fuelUsedUsGallons: 10 }, expected: { value: 30, steps: ["Gas mileage = 30"] } }],
  goldenTests: [{ label: "Reference example", input: { distanceMiles: 300, fuelUsedUsGallons: 10 }, expected: { value: 30 } }]
};

export const tripFuelCalculator: CalculatorDefinition<TripFuelInput, Out> = {
  ...base, id: "automotive.trip-fuel", slug: "trip-fuel-calculator", title: "Trip Fuel Calculator",
  inputSchema: z.object({ distanceKm: nonnegative, fuelConsumptionLitersPer100Km: nonnegative }),
  calculate: (input) => { const value = finite(input.distanceKm * input.fuelConsumptionLitersPer100Km / 100); return { value, steps: [`Trip fuel = ${value}`] }; },
  formulas: [{ id: "trip-fuel-calculator", expression: "trip fuel = distance × L/100 km ÷ 100", description: "Estimate trip fuel quantity from distance and average consumption." }],
  examples: [{ label: "Reference example", input: { distanceKm: 500, fuelConsumptionLitersPer100Km: 8 }, expected: { value: 40, steps: ["Trip fuel = 40"] } }],
  goldenTests: [{ label: "Reference example", input: { distanceKm: 500, fuelConsumptionLitersPer100Km: 8 }, expected: { value: 40 } }]
};

export const automotiveCatalogBatch1Definitions = [fuelEconomyCalculator, gasMileageCalculator, tripFuelCalculator] as const;
