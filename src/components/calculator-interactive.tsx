"use client";

import { useMemo, useState } from "react";
import { runCalculator } from "@/calculators/engine";
import { percentageCalculator } from "@/calculators/core/percentage";
import { unitConversionCalculator } from "@/calculators/core/unit-conversion";
import { getUnitFamily, supportedUnits } from "@/calculators/units";
import { CalculatorAccountActions } from "@/components/calculator-account-actions";
import { AiResultExplanation } from "@/components/ai-result-explanation";

const unitLabels: Record<string, string> = {
  m: "Metres (m)", km: "Kilometres (km)", cm: "Centimetres (cm)", mm: "Millimetres (mm)",
  in: "Inches (in)", ft: "Feet (ft)", yd: "Yards (yd)", mi: "Miles (mi)",
  kg: "Kilograms (kg)", g: "Grams (g)", lb: "Pounds (lb)", oz: "Ounces (oz)",
  l: "Litres (L)", ml: "Millilitres (mL)", m3: "Cubic metres (m³)", gal_us: "US gallons", qt_us: "US quarts",
  c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)"
};

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span><input inputMode="decimal" type="number" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function PercentageTool() {
  const [percentage, setPercentage] = useState("20");
  const [value, setValue] = useState("250");
  const numericInput = useMemo(() => ({ percentage: Number(percentage), value: Number(value) }), [percentage, value]);
  const result = useMemo(() => { try { return runCalculator(percentageCalculator, numericInput).output.result; } catch { return null; } }, [numericInput]);

  return <div className="calculator-ui">
    <div className="field-grid"><NumberField label="Percentage (%)" value={percentage} onChange={setPercentage} /><NumberField label="Value" value={value} onChange={setValue} /></div>
    <div className="result-box" aria-live="polite"><span>Result</span><strong>{result === null ? "Enter valid numbers" : result.toLocaleString(undefined, { maximumFractionDigits: 12 })}</strong></div>
    <CalculatorAccountActions calculatorSlug={percentageCalculator.slug} calculatorVersion={percentageCalculator.version} input={numericInput} output={result === null ? null : { result }} />
    {result !== null && <AiResultExplanation calculatorName="Percentage of a Value" formula="result = percentage / 100 × value" assumptions={["Inputs are finite decimal numbers."]} values={numericInput} result={{ result }} />}
  </div>;
}

function UnitConversionTool() {
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("mi");
  const [toUnit, setToUnit] = useState("km");
  const family = getUnitFamily(fromUnit);
  const targetUnits = supportedUnits.filter((unit) => getUnitFamily(unit) === family);
  const numericInput = useMemo(() => ({ value: Number(value), fromUnit, toUnit }), [value, fromUnit, toUnit]);
  const result = useMemo(() => { try { return runCalculator(unitConversionCalculator, numericInput).output.result; } catch { return null; } }, [numericInput]);

  function changeSource(unit: string) {
    setFromUnit(unit);
    const nextFamily = getUnitFamily(unit);
    if (getUnitFamily(toUnit) !== nextFamily) setToUnit(supportedUnits.find((candidate) => getUnitFamily(candidate) === nextFamily && candidate !== unit) ?? unit);
  }

  return <div className="calculator-ui">
    <div className="field-grid three">
      <NumberField label="Value" value={value} onChange={setValue} />
      <label className="field"><span>From</span><select value={fromUnit} onChange={(event) => changeSource(event.target.value)}>{supportedUnits.map((unit) => <option value={unit} key={unit}>{unitLabels[unit] ?? unit}</option>)}</select></label>
      <label className="field"><span>To</span><select value={toUnit} onChange={(event) => setToUnit(event.target.value)}>{targetUnits.map((unit) => <option value={unit} key={unit}>{unitLabels[unit] ?? unit}</option>)}</select></label>
    </div>
    <div className="result-box" aria-live="polite"><span>Converted value</span><strong>{result === null ? "Choose compatible units" : result.toLocaleString(undefined, { maximumFractionDigits: 12 })}</strong></div>
    <CalculatorAccountActions calculatorSlug={unitConversionCalculator.slug} calculatorVersion={unitConversionCalculator.version} input={numericInput} output={result === null ? null : { result }} />
    {result !== null && <AiResultExplanation calculatorName="Unit Conversion" assumptions={["Only units in the same measurement family are converted."]} values={numericInput} result={{ result }} />}
  </div>;
}

export function CalculatorInteractive({ slug }: { slug: string }) {
  if (slug === percentageCalculator.slug) return <PercentageTool />;
  if (slug === unitConversionCalculator.slug) return <UnitConversionTool />;
  return <p className="muted">This calculator does not yet have a public interface.</p>;
}
