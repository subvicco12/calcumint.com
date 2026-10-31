import { z } from 'zod';
import Decimal from 'decimal.js';
import { canonicalCalculusInputSchema, calculusCoordinateSchema, runCanonicalCalculus, parseExactDecimal, canonicalCalculusContract, type CanonicalCalculusInput } from './canonical-calculus';
import { rational, add, subtract, multiply, formatRational } from './exact-rational';
import { copyCalculationData, createCalculationSnapshot } from '../lib/calculation-snapshot';
import { equalCompletionJson } from './completion-contracts';
import type { StructuredCalculationResult, ResultSeries } from './final-framework/types';
import binding from '../../docs/canonical-calculus/source-binding.json';
const DisplayDecimal = Decimal.clone({ precision: 50 });
const radius = calculusCoordinateSchema.refine(s => BigInt(parseExactDecimal(s).numerator) > 0n, { message: 'Positive plot radius required' });
export const canonicalWorkflowInputSchema = z.object({ calculation: canonicalCalculusInputSchema, plot: z.object({ enabled: z.boolean(), radius, samples: z.union([z.literal(9), z.literal(17), z.literal(33)]) }).strict().default({ enabled: true, radius: '1', samples: 17 }) }).strict();
export type CanonicalWorkflowInput = z.infer<typeof canonicalWorkflowInputSchema>;
type Core = ReturnType<typeof runCanonicalCalculus>;
export type EnginePlotRow = {
    id: string;
    coordinate: string;
    anchor: boolean;
    input: CanonicalCalculusInput;
    output: Core | null;
    plotValue: number | null;
    status: 'ok' | 'unsupported-engine-point' | 'unbounded-result' | 'display-range';
    detail: string;
};
const source = copyCalculationData({ binding }, {}).input.binding as typeof binding;
function displayNumber(output: Core) { if (output.classification !== 'finite')
    return null; const value = output.exact ? new DisplayDecimal(output.exact.numerator).div(output.exact.denominator).toNumber() : Number(output.value); if (!Number.isFinite(value) || value === 0 && (output.exact ? output.exact.numerator !== '0' : Number(output.value) !== 0))
    return null; return value; }
export function exportCanonicalCalculation(raw: unknown, plan: 'free' | 'pro' | 'business' = 'free') {
    z.enum(['free', 'pro', 'business']).parse(plan);
    const clean = copyCalculationData({ raw }, {}).input.raw, input = canonicalWorkflowInputSchema.parse(clean), calculation = input.calculation, core = runCanonicalCalculus(calculation), rows: EnginePlotRow[] = [];
    if (input.plot.enabled) {
        const center = calculation.operation === 'integral' ? parseExactDecimal(calculation.lower) : parseExactDecimal(calculation.x), start = calculation.operation === 'integral' ? center : subtract(center, parseExactDecimal(input.plot.radius)), end = calculation.operation === 'integral' ? parseExactDecimal(calculation.upper) : add(center, parseExactDecimal(input.plot.radius));
        for (let i = 0; i < input.plot.samples; i++) {
            const coordinate = formatRational(add(start, multiply(subtract(end, start), rational(BigInt(i), BigInt(input.plot.samples - 1))))), anchor = calculation.operation === 'integral' ? i === input.plot.samples - 1 : coordinate === formatRational(center), point: CanonicalCalculusInput = calculation.operation === 'integral' ? { ...calculation, upper: coordinate } : { ...calculation, x: coordinate };
            try {
                const output = runCanonicalCalculus(point), plotValue = displayNumber(output);
                rows.push({ id: 'engine-point-' + i, coordinate, anchor, input: point, output, plotValue, status: output.classification !== 'finite' ? 'unbounded-result' : plotValue === null ? 'display-range' : 'ok', detail: output.warning });
            }
            catch (error) {
                rows.push({ id: 'engine-point-' + i, coordinate, anchor, input: point, output: null, plotValue: null, status: 'unsupported-engine-point', detail: String(error instanceof Error ? error.message : error) });
            }
        }
        const anchor = rows.find(r => r.anchor);
        if (!anchor?.output || anchor.output.value !== core.value || anchor.output.classification !== core.classification)
            throw Error('Primary/engine-table anchor reconciliation failed');
    }
    const series: ResultSeries[] = [];
    let segment: ResultSeries['points'][number][] = [];
    const finish = () => { if (segment.length)
        series.push({ id: 'segment-' + series.length, label: calculation.operation + ' engine outcomes — segment' + (series.length + 1), points: segment }); segment = []; };
    for (const row of rows) {
        if (row.plotValue === null) {
            finish();
            continue;
        }
        segment.push({ x: row.coordinate, y: row.plotValue, label: row.output!.value });
    }
    finish();
    const warnings = [core.warning, 'Private engineering contract; no canonical acceptance, certification or publication.', 'x and function values are dimensionless; trigonometric arguments are radians.', 'Plot/table rows are actual engine operation outcomes at each coordinate, not a sampled proof or a graph of a different formula.', 'Chart numbers are display approximations. Stored engine strings in the table and headline are authoritative for this snapshot; analytic results retain binary64 precision.'];
    if (rows.some(r => r.status !== 'ok'))
        warnings.push('Unsupported, unbounded or unrepresentable display points form explicit gaps. Segments are separate; no line bridges a gap.');
    const structured: StructuredCalculationResult = { primaryResult: { id: 'calculus-result', label: calculation.operation === 'integral' ? 'Oriented integral' : calculation.operation === 'derivative' ? 'Derivative' : 'Requested ' + calculation.direction + ' limit', value: core.value }, metrics: [{ id: 'classification', label: 'Mathematical outcome', value: core.classification }, { id: 'arithmetic', label: 'Arithmetic method', value: core.arithmetic }], series, warnings, scenarioVariables: calculation.operation === 'integral' ? ['expression', 'lower', 'upper'] : calculation.operation === 'limit' ? ['expression', 'x', 'direction'] : ['expression', 'x'], assumptions: ['Expression and coordinates are supplied mathematical inputs; no physical, clinical, financial or jurisdictional applicability is inferred.'], methodology: canonicalCalculusContract.rounding + ' ' + canonicalCalculusContract.domain + ' ' + canonicalCalculusContract.limitations, sources: [{ label: 'Polynomial power/quotient rules and exact vanishing-order theorem; independent implementation goldens.' }, { label: 'Original CalcuMint Master Blueprint, SHA256 ' + source.nativeBlueprintSHA256 }] };
    const output = { core, structured, rows, reconciliation: { primary: core.value, anchor: rows.find(r => r.anchor)?.output?.value ?? null, rule: input.plot.enabled ? 'Exact primary/anchor strings and classification agree' : 'Plot disabled; primary computation unchanged' }, engineContract: canonicalCalculusContract };
    const id = calculation.operation === 'derivative' ? 246 : calculation.operation === 'integral' ? 247 : 248;
    const snapshot = createCalculationSnapshot({ calculatorSlug: 'private-canonical-calculus-' + calculation.operation, calculatorVersion: 3, input, output }) as ReturnType<typeof createCalculationSnapshot> & {
        input: CanonicalWorkflowInput;
        output: typeof output;
    };
    const envelope = { schemaVersion: 1, contractId: 'private.canonical-calculus.' + id, source, governance: { relatedCatalogId: id, engineId: canonicalCalculusContract.engineId, technicalRevision: 3, presentationRevision: 1, engineeringContract: 'DEFINED_AND_TESTED_FOR_DECLARED_DOMAIN', canonicalAccepted: false, canonicalMappingApproved: false, certificationAuthorized: false, publicationAuthorized: false, releaseHold: true }, calculation: snapshot };
    return copyCalculationData({ envelope }, {}).input.envelope as typeof envelope;
}
export function importCanonicalCalculation(raw: unknown) { const supplied = copyCalculationData({ envelope: raw }, {}).input.envelope as ReturnType<typeof exportCanonicalCalculation>; if (!supplied?.calculation)
    throw Error('Missing versioned calculation'); const expected = exportCanonicalCalculation(supplied.calculation.input); if (!equalCompletionJson(supplied, expected))
    throw Error('Immutable input, output, lineage, source, identity, revision or governance mismatch'); return expected; }
export function compareCanonicalCalculations(a: unknown, b: unknown) { const left = importCanonicalCalculation(a), right = importCanonicalCalculation(b); if (left.calculation.input.calculation.operation !== right.calculation.input.calculation.operation)
    throw Error('Compare the same mathematical operation'); const l = left.calculation.output.core, r = right.calculation.output.core; return Object.freeze({ left: l.value, right: r.value, exactDelta: l.classification === 'finite' && r.classification === 'finite' && l.exact && r.exact ? formatRational(subtract(r.exact, l.exact)) : null, meaning: 'Delta only for finite exact-rational results; no higher-accuracy analytic result is inferred.' }); }
export function compareCanonicalScenarioSet(values: readonly unknown[]) { if (values.length < 2 || values.length > 3)
    throw Error('Select two or three complete scenarios'); const snapshots = values.map(importCanonicalCalculation); return Object.freeze({ scenarios: snapshots.map((s, i) => Object.freeze({ name: ['A', 'B', 'C'][i], input: s.calculation.input, value: s.calculation.output.core.value })), comparisons: snapshots.slice(1).map((s, i) => Object.freeze({ pair: 'A→' + ['B', 'C'][i], ...compareCanonicalCalculations(snapshots[0], s) })) }); }
