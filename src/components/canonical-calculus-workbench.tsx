'use client';
import { useEffect, useState } from 'react';
import { exportCanonicalCalculation, importCanonicalCalculation, compareCanonicalScenarioSet } from '../calculators/canonical-calculus-workflow';
import { importPrivateCalculus } from '../calculators/private-calculus-successor';
import { appendCanonicalHistory, readCanonicalHistory, clearCanonicalHistory, type CanonicalHistoryRecord } from '../lib/canonical-calculus-history';
import { getPlanEntitlements, type CalcuMintPlan } from '../lib/entitlements';
import { FinalCalculatorRenderer } from './final-calculator-renderer';
import { ResultSeriesPanel } from './result-series-panel';
type Snapshot = ReturnType<typeof exportCanonicalCalculation>;
type Operation = 'derivative' | 'integral' | 'limit';
const json = (v: unknown) => JSON.stringify(v, null, 2);
const examples = { derivative: { expression: 'x^3', x: '2', lower: '0', upper: '1', direction: 'both' }, integral: { expression: 'x^2', x: '0', lower: '0', upper: '1', direction: 'both' }, limit: { expression: '(x^2-1)/(x-1)', x: '1', lower: '0', upper: '1', direction: 'both' } } as const;
export function CanonicalCalculusWorkbench() {
    const [operation, setOperation] = useState<Operation>('limit'), [expression, setExpression] = useState<string>(examples.limit.expression), [x, setX] = useState('1'), [lower, setLower] = useState('0'), [upper, setUpper] = useState('1'), [direction, setDirection] = useState<'both' | 'left' | 'right'>('both'), [plot, setPlot] = useState(true), [radius, setRadius] = useState('1'), [samples, setSamples] = useState<9 | 17 | 33>(17), [plan, setPlan] = useState<CalcuMintPlan>('free'), [snapshot, setSnapshot] = useState<Snapshot | null>(null), [legacy, setLegacy] = useState<ReturnType<typeof importPrivateCalculus> | null>(null), [history, setHistory] = useState<readonly CanonicalHistoryRecord[]>([]), [historyReady, setHistoryReady] = useState(false), [error, setError] = useState(''), [importText, setImportText] = useState(''), [scenarios, setScenarios] = useState<readonly Snapshot[]>([]), [comparison, setComparison] = useState<ReturnType<typeof compareCanonicalScenarioSet> | null>(null);
    const entitlements = getPlanEntitlements(plan), invalidate = () => { setSnapshot(null); setLegacy(null); setError(''); };
    useEffect(() => { const frame = requestAnimationFrame(() => { try {
        const result = readCanonicalHistory(localStorage);
        setHistory(result.records);
        if (result.error)
            setError(result.error);
    }
    catch {
        setError('Local history storage is unavailable.');
    } setHistoryReady(true); }); return () => cancelAnimationFrame(frame); }, []);
    function load(next: Operation) { const e = examples[next]; setOperation(next); setExpression(e.expression); setX(e.x); setLower(e.lower); setUpper(e.upper); setDirection('both'); setRadius('1'); setSamples(17); setPlot(true); invalidate(); }
    function calculate() { invalidate(); try {
        const calculation = operation === 'integral' ? { operation, expression, lower, upper } : operation === 'limit' ? { operation, expression, x, direction } : { operation, expression, x };
        setSnapshot(exportCanonicalCalculation({ calculation, plot: { enabled: plot, radius: plot && operation !== 'integral' ? radius : '1', samples } }, plan));
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Unsupported input');
    } }
    function restore(value: CanonicalHistoryRecord) { invalidate(); if (value.calculation.calculatorVersion === 3) {
        const s = importCanonicalCalculation(value), c = s.calculation.input.calculation;
        setOperation(c.operation);
        setExpression(c.expression);
        if (c.operation === 'integral') {
            setLower(c.lower);
            setUpper(c.upper);
        }
        else {
            setX(c.x);
            if (c.operation === 'limit')
                setDirection(c.direction);
        }
        setPlot(s.calculation.input.plot.enabled);
        setRadius(s.calculation.input.plot.radius);
        setSamples(s.calculation.input.plot.samples);
        setSnapshot(s);
    }
    else {
        const s = importPrivateCalculus(value), c = s.calculation.input;
        const op = String(c.operation) as Operation;
        setOperation(op);
        setExpression(String(c.expression));
        if (op === 'integral') {
            setLower(String(c.lower));
            setUpper(String(c.upper));
        }
        else
            setX(String(c.x));
        setDirection('both');
        setLegacy(s);
    } }
    function download(value: Snapshot | ReturnType<typeof importPrivateCalculus>) { const url = URL.createObjectURL(new Blob([json(value) + '\n'], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'calculus-contract-v' + value.calculation.calculatorVersion + '.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    return <main style={{ maxWidth: 1100, margin: 'auto', padding: 16, fontFamily: 'system-ui', overflowWrap: 'anywhere' }}><h1>CalcuMint calculus — private contract review</h1><p data-testid="calculus-governance">RELEASE HOLD. Related catalog246–248. Declared-domain engineering only; no canonical acceptance, certification or publication. Historical engines remain unchanged.</p>
 <p>Exact rational derivatives, removable and directional limits, and oriented polynomial integrals. Other supported analytic derivatives/continuous limits use the unchanged analytical engine with explicit binary64 precision. General transcendental removable limits, boundary limits and non-polynomial quadrature are unsupported.</p>
 <label htmlFor="cc-plan">Synthetic review plan</label><select id="cc-plan" value={plan} onChange={e => setPlan(e.target.value as CalcuMintPlan)}><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option></select><p>Same primary answer, required warnings and basic data for every plan. Plan controls here are a private review fixture, not live subscription/provider authentication.</p>
 <label htmlFor="cc-operation">Operation</label><select id="cc-operation" value={operation} onChange={e => load(e.target.value as Operation)}><option value="derivative">Derivative</option><option value="integral">Definite integral</option><option value="limit">Limit</option></select>
 <label htmlFor="cc-expression">Expression in x</label><input id="cc-expression" value={expression} maxLength={500} onChange={e => { setExpression(e.target.value); invalidate(); }}/><p>Use explicit multiplication (*), parentheses and powers (^). Coordinates and function values are dimensionless; trigonometric arguments use radians.</p>
 {operation === 'integral' ? <><label htmlFor="cc-lower">Lower bound</label><input id="cc-lower" value={lower} maxLength={40} onChange={e => { setLower(e.target.value); invalidate(); }}/><label htmlFor="cc-upper">Upper bound</label><input id="cc-upper" value={upper} maxLength={40} onChange={e => { setUpper(e.target.value); invalidate(); }}/></> : <><label htmlFor="cc-x">Target x (exact decimal)</label><input id="cc-x" value={x} maxLength={40} onChange={e => { setX(e.target.value); invalidate(); }}/>{operation === 'limit' && <><label htmlFor="cc-direction">Approach direction</label><select id="cc-direction" value={direction} onChange={e => { setDirection(e.target.value as typeof direction); invalidate(); }}><option value="both">Both sides</option><option value="left">Left</option><option value="right">Right</option></select></>}</>}
 <fieldset><legend>Basic engine plot — available to every plan</legend><label><input id="cc-plot" type="checkbox" checked={plot} onChange={e => { setPlot(e.target.checked); invalidate(); }}/> Show operation outcomes and engine samples</label>{plot && <>{operation !== 'integral' && <><label htmlFor="cc-radius">Plot radius around target</label><input id="cc-radius" value={radius} maxLength={40} onChange={e => { setRadius(e.target.value); invalidate(); }}/></>}<label htmlFor="cc-samples">Samples (engine evaluations)</label><select id="cc-samples" value={samples} onChange={e => { setSamples(Number(e.target.value) as 9 | 17 | 33); invalidate(); }}><option value={9}>9</option><option value={17}>17</option><option value={33}>33</option></select></>}<p>Plots use actual operation results; they do not prove a limit or integration error. Unsupported points form gaps. Integral plots use the supplied oriented bounds.</p></fieldset>
 <button onClick={calculate}>Calculate</button>{' '}<button onClick={() => load(operation)}>Load example</button>
 {snapshot && <section aria-label="Current result"><output data-testid="cc-primary" aria-live="polite">{snapshot.calculation.output.core.value}</output><FinalCalculatorRenderer result={{ ...snapshot.calculation.output.structured, series: [] }} plan={plan}/>{snapshot.calculation.output.structured.series?.map(s => <ResultSeriesPanel key={s.id} series={s}/>)}{snapshot.calculation.output.rows.length > 0 && <div role="region" aria-label="Engine samples" tabIndex={0} style={{ overflowX: 'auto' }}><table data-testid="cc-table"><caption>Engine samples from the same immutable revision</caption><thead><tr><th scope="col">Coordinate</th><th scope="col">Stored engine outcome and stated precision</th><th scope="col">Status</th></tr></thead><tbody>{snapshot.calculation.output.rows.map(r => <tr key={r.id} data-anchor={r.anchor ? 'true' : 'false'}><th scope="row">{r.coordinate}{r.anchor ? ' (primary anchor)' : ''}</th><td>{r.output?.value ?? 'Unsupported'}{r.output ? ' (' + r.output.arithmetic + ')' : ''}</td><td>{r.status}</td></tr>)}</tbody></table></div>}<details><summary>Immutable identity, methodology and original Blueprint binding</summary><pre>{json({ source: snapshot.source, governance: snapshot.governance, methodology: snapshot.calculation.output.engineContract })}</pre></details></section>}
 {legacy && <section><h2>Historical calculation</h2><output data-testid="cc-historical">{String(legacy.calculation.output.value)}</output><p>Historical analytic binary64 output has no rigorous error bound. Stored internal technical revision2 and its original result are retained. Calculate explicitly to create a separate revision3 calculation.</p><details><summary>Historical methodology</summary><pre>{json(legacy.methodology)}</pre></details></section>}
 {(snapshot || legacy) && <><button disabled={!historyReady} onClick={() => { setError(''); try {
        setHistory(appendCanonicalHistory(localStorage, snapshot ?? legacy, plan));
    }
    catch (e) {
        setError(String(e instanceof Error ? e.message : e));
    } }}>Save history</button>{' '}<button disabled={!entitlements.exports} onClick={() => { const current = snapshot ?? legacy; if (entitlements.exports && current)
        download(current); }}>Export immutable JSON</button>{!entitlements.exports && <p>Professional export is a Pro capability. Core results, precision, warnings and basic samples remain complete on Free.</p>}</>}
 <h2>Versioned local review history</h2><p>Same-browser persistence for this private fixture; authenticated account history/RLS remains a separate existing service. Free new-write limits use the central resolver; downgrade never deletes existing records. Local resource capacity200records/8MB is independent of commercial quotas.</p><button onClick={() => { try {
        setHistory(clearCanonicalHistory(localStorage));
        setError('');
    }
    catch {
        setError('History could not be cleared.');
    } }}>Clear local history</button><ol data-testid="cc-history">{history.map((s, i) => <li key={i}>{s.calculation.calculatorSlug}, technical revision{s.calculation.calculatorVersion}<button onClick={() => { try {
        restore(s);
    }
    catch {
        setError('Historical verification failed; original storage was not modified.');
    } }}>Restore history {i + 1}</button></li>)}</ol>
 <h2>Scenario comparison</h2><button disabled={!entitlements.scenarios || !snapshot} onClick={() => { if (entitlements.scenarios && snapshot) {
        if (scenarios.length >= 3) {
            setError('Three comparison scenarios are already saved; clear explicitly before replacing them.');
            return;
        }
        setScenarios(s => [...s, snapshot]);
        setComparison(null);
    } }}>Save comparison scenario</button><button disabled={!entitlements.scenarios || scenarios.length < 2} onClick={() => { try {
        if (!entitlements.scenarios)
            throw Error('Pro capability');
        setComparison(compareCanonicalScenarioSet(scenarios));
    }
    catch (e) {
        setError(String(e instanceof Error ? e.message : e));
    } }}>Compare saved scenarios</button><button onClick={() => { setScenarios([]); setComparison(null); }}>Clear comparison scenarios</button>{scenarios.map((s, i) => <button key={i} onClick={() => restore(s)}>Restore scenario {String.fromCharCode(65 + i)}</button>)}<p data-testid="cc-scenarios">{scenarios.length} saved comparison scenarios. Comparison requires the same operation.</p>{comparison && <pre data-testid="cc-comparison">{json(comparison)}</pre>}
 <h2>Reopen an immutable artifact</h2><label htmlFor="cc-import">Calculation JSON (internal revisions2 or3)</label><textarea id="cc-import" rows={7} value={importText} onChange={e => setImportText(e.target.value)}/><button onClick={() => { invalidate(); try {
        if (importText.length > 2000000)
            throw Error('Artifact size bound');
        const raw = JSON.parse(importText);
        restore(raw.calculation?.calculatorVersion === 2 ? importPrivateCalculus(raw) : importCanonicalCalculation(raw));
    }
    catch {
        setError('Artifact differs from its immutable source, domain, identity, revision, lineage or recomputed result.');
    } }}>Verify and restore calculation</button>
 {error && <p role="alert">{error}</p>}<style>{'input:not([type=checkbox]),select,textarea{width:100%;box-sizing:border-box;min-height:44px;font-size:16px}button{min-height:44px;padding:8px 12px;margin:4px}table{width:100%;border-collapse:collapse}td,th{padding:6px;text-align:left;border:1px solid #888}pre{white-space:pre-wrap;overflow-wrap:anywhere}fieldset{margin-block:16px}:focus-visible{outline:3px solid #1259c3;outline-offset:2px}'}</style></main>;
}
