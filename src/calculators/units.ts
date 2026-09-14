import { assertFiniteNumber } from "./precision";

export type UnitFamily = "length" | "mass" | "volume" | "temperature";

type LinearUnit = { family: Exclude<UnitFamily, "temperature">; toBase: number };

type TemperatureUnit = { family: "temperature"; toKelvin: (value: number) => number; fromKelvin: (value: number) => number };

type UnitDefinition = LinearUnit | TemperatureUnit;

const units: Record<string, UnitDefinition> = {
  m: { family: "length", toBase: 1 },
  km: { family: "length", toBase: 1000 },
  cm: { family: "length", toBase: 0.01 },
  mm: { family: "length", toBase: 0.001 },
  in: { family: "length", toBase: 0.0254 },
  ft: { family: "length", toBase: 0.3048 },
  yd: { family: "length", toBase: 0.9144 },
  mi: { family: "length", toBase: 1609.344 },
  kg: { family: "mass", toBase: 1 },
  g: { family: "mass", toBase: 0.001 },
  lb: { family: "mass", toBase: 0.45359237 },
  oz: { family: "mass", toBase: 0.028349523125 },
  l: { family: "volume", toBase: 1 },
  ml: { family: "volume", toBase: 0.001 },
  "m3": { family: "volume", toBase: 1000 },
  gal_us: { family: "volume", toBase: 3.785411784 },
  qt_us: { family: "volume", toBase: 0.946352946 },
  c: { family: "temperature", toKelvin: (v) => v + 273.15, fromKelvin: (v) => v - 273.15 },
  f: { family: "temperature", toKelvin: (v) => (v - 32) * (5 / 9) + 273.15, fromKelvin: (v) => (v - 273.15) * (9 / 5) + 32 },
  k: { family: "temperature", toKelvin: (v) => v, fromKelvin: (v) => v }
};

export const supportedUnits = Object.freeze(Object.keys(units));

export function convertUnit(value: number, from: string, to: string): number {
  assertFiniteNumber(value, "value");
  const source = units[from];
  const target = units[to];

  if (!source || !target) {
    throw new RangeError("Unsupported unit");
  }
  if (source.family !== target.family) {
    throw new RangeError(`Cannot convert ${source.family} to ${target.family}`);
  }

  if (source.family === "temperature" && target.family === "temperature") {
    return target.fromKelvin(source.toKelvin(value));
  }

  if (source.family === "temperature" || target.family === "temperature") {
    throw new RangeError("Invalid unit family conversion");
  }

  return value * source.toBase / target.toBase;
}

export function getUnitFamily(unit: string): UnitFamily | undefined {
  return units[unit]?.family;
}
