import { runCalculator } from "../engine";
import { compoundInterestCalculator } from "../finance/compound-interest";
import { sipCalculator } from "../finance/sip";
import { compoundInterestResult, sipResult } from "./adapters";
import type { StructuredCalculationResult } from "./types";

type SipInput = Parameters<typeof sipCalculator.calculate>[0];
type SipOutput = ReturnType<typeof sipCalculator.calculate>;
type CompoundInput = Parameters<typeof compoundInterestCalculator.calculate>[0];
type CompoundOutput = ReturnType<typeof compoundInterestCalculator.calculate>;
const MAX_SNAPSHOTS = 1200;

function reconcileOutput(actual: Record<string, number>, supplied: Record<string, number>) {
  if (Object.entries(actual).some(([key, value]) => !Number.isFinite(value) || supplied[key] !== value)) throw new Error("Projection input and terminal result do not reconcile.");
}

/** Monthly snapshots from the certified closed-form engine, not cash-flow transactions. */
export function sipPeriodResult(input: SipInput, output: SipOutput): StructuredCalculationResult {
  const certified = runCalculator(sipCalculator, input);
  reconcileOutput(certified.output, output);
  const schedule = Array.from({ length: certified.input.termMonths }, (_, index) => {
    const month = index + 1;
    const values = month === certified.input.termMonths ? certified.output : runCalculator(sipCalculator, { ...certified.input, termMonths: month }).output;
    return { id: String(month), period: month, values };
  });
  return {
    ...sipResult(certified.input, output), schedule,
    scheduleMetadata: { caption: "SIP projected monthly snapshots", period: { key: "month", label: "Month", unit: "months" }, columns: [{ key: "investedAmount", label: "Cumulative contributions" }, { key: "estimatedGain", label: "Cumulative modeled growth" }, { key: "futureValue", label: "Projected value" }], granularity: "complete", terminal: Object.entries(output).map(([column, expected]) => ({ column, expected, tolerance: 0 })) },
    series: [{ id: "growth", label: "Projected monthly value", points: schedule.map(row => ({ x: row.period, y: row.values.futureValue })) }],
    methodology: "Each monthly snapshot evaluates the same certified SIP engine at that term and contribution timing. Contributions and growth are cumulative, rounded engine outputs; do not sum snapshots as cash-flow transactions. Modeled returns are not guaranteed."
  };
}

/** Compounding-boundary projections; very long terms are explicitly sampled. */
export function compoundPeriodResult(input: CompoundInput, output: CompoundOutput): StructuredCalculationResult {
  const certified = runCalculator(compoundInterestCalculator, input);
  reconcileOutput(certified.output, output);
  const wholePeriods = Math.floor(certified.input.years * certified.input.compoundsPerYear);
  const stride = Math.max(1, Math.ceil(wholePeriods / (MAX_SNAPSHOTS - 2)));
  const years = [0];
  for (let period = stride; period <= wholePeriods; period += stride) {
    const year = period / certified.input.compoundsPerYear;
    if (year < certified.input.years) years.push(year);
  }
  if (certified.input.years !== 0) years.push(certified.input.years);
  const schedule = years.map(year => ({ id: String(year), period: year, values: { elapsedYears: String(year), ...(year === certified.input.years ? certified.output : runCalculator(compoundInterestCalculator, { ...certified.input, years: year }).output) } }));
  return {
    ...compoundInterestResult(certified.input, output), schedule,
    scheduleMetadata: { caption: "Compound-interest projected snapshots", period: { key: "years", label: "Elapsed time", unit: "years" }, columns: [{ key: "elapsedYears", label: "Exact elapsed time", unit: "years" }, { key: "totalInterest", label: "Cumulative modeled interest" }, { key: "futureValue", label: "Projected value" }], granularity: stride === 1 ? "complete" : "checkpoints", terminal: [{ column: "years", expected: certified.input.years, tolerance: 0 }, ...Object.entries(output).map(([column, expected]) => ({ column, expected, tolerance: 0 }))] },
    series: [{ id: "growth", label: "Projected value", points: schedule.map(row => ({ x: row.period, y: row.values.futureValue })) }],
    methodology: `Snapshots evaluate the certified compound-interest engine at modeled compounding boundaries and the exact requested terminal time, including fractional periods. ${stride > 1 ? "Long schedules use explicitly sampled checkpoints. " : ""}Interest is cumulative, rounded engine output; do not sum snapshots as cash-flow transactions.`
  };
}

/** The export payload carries exactly the validated projection rows used by the renderer. */
export function investmentPeriodExport(output: SipOutput | CompoundOutput, result: StructuredCalculationResult) {
  return { ...output, periodProjection: { metadata: result.scheduleMetadata, rows: result.schedule } };
}
