"use client";

import { useMemo, useState } from "react";
import { runCalculator } from "@/calculators/engine";
import { percentageCalculator } from "@/calculators/core/percentage";
import { unitConversionCalculator } from "@/calculators/core/unit-conversion";
import { getUnitFamily, supportedUnits } from "@/calculators/units";

const unitLabels: Record<string, string> = {
  m: "Metres (m)", km: "Kilometres (km)", cm: "Centimetres (cm)", mm: "Millimetres (mm)",
  in: "Inches (in)", ft: "Feet (ft)", yd: "Yards (yd)", mi: "Miles (mi)",
  kg: "Kilograms (kg)", g: "Grams (g)", lb: "Pounds (lb)", oz: "Ounces (oz)",
  l: "Litres (L)", ml: "Millilitres (mL)", m3: "Cubic metres (m³)", gal_us: "US gallons", qt_us: "US quarts",
  c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)"
};

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input inputMode="decimal" type="number" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function PercentageTool() {
  const [percentage, setPercentage] = useState("20");
  const [value, setValue] = useState("250");
  const result = useMemo(() => {
    try {
      return runCalculator(percentageCalculator, { percentage: Number(percentage), value: Number(value) }).output.result;
    } catch {
      return null;
    }
  }, [percentage, value]);

  return (
    <div className="calculator-ui">
      <div className="field-grid">
        <NumberField label="Percentage (%)" value={percentage} onChange={setPercentage} />
        <NumberField label="Value" value={value} onChange={setValue} />
      </div>
      <div className="result-box" aria-live="polite">
        <span>Result</span>
        <strong>{result === null ? "Enter valid numbers" : result.toLocaleString(undefined, { maximumFractionDigits: 12 })}</strong>
      </div>
    </div>
  );
}

function UnitConversionTool() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("mi");
  const [toUnit, setToUnit] = useState("km");
  const family = getUnitFamily(fromUnit);
  const targetUnits = supportedUnits.filter((unit) => getUnitFamily(unit) === family);
  const result = useMemo(() => {
    try {
      return runCalculator(unitConversionCalculator, { value: Number(value), fromUnit, toUnit }).output.result;
    } catch {
      return null;
    }
  }, [value, fromUnit, toUnit]);

  function changeSource(unit: string) {
    setFromUnit(unit);
    const nextFamily = getUnitFamily(unit);
    if (getUnitFamily(toUnit) !== nextFamily) {
      setToUnit(supportedUnits.find((candidate) => getUnitFamily(candidate) === nextFamily && candidate !== unit) ?? unit);
    }
  }

  return (
    <div className="calculator-ui">
      <div className="field-grid three">
        <NumberField label="Value" value={value} onChange={setValue} />
        <label className="field"><span>From</span><select value={fromUnit} onChange={(event) => changeSource(event.target.value)}>{supportedUnits.map((unit) => <option value={unit} key={unit}>{unitLabels[unit] ?? unit}</option>)}</select></label>
        <label className="field"><span>To</span><select value={toUnit} onChange={(event) => setToUnit(event.target.value)}>{targetUnits.map((unit) => <option value={unit} key={unit}>{unitLabels[unit] ?? unit}</option>)}</select></label>
      </div>
      <div className="result-box" aria-live="polite">
        <span>Converted value</span>
        <strong>{result === null ? "Choose compatible units" : result.toLocaleString(undefined, { maximumFractionDigits: 12 })}</strong>
      </div>
    </div>
  );
}

export function CalculatorInteractive({ slug }: { slug: string }) {
  if (slug === percentageCalculator.slug) return <PercentageTool />;
  if (slug === unitConversionCalculator.slug) return <UnitConversionTool />;
  return <p className="muted">This calculator does not yet have a public interface.</p>;
}
