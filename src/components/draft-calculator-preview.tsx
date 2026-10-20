"use client";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { draftPreviewDefinitions, getDraftPreviewDefinition, calculateDraftPreview, draftPreviewScenarioMetadata } from '@/calculators/final-framework/draft-preview-catalog';
import { readDraftPreviewCapture, saveDraftPreviewCapture } from '@/lib/draft-preview-history';
import { validateDraftPersistedCapture, type DraftAuthenticatedPersistence, type DraftSavedReference } from '@/lib/draft-persistence-contract';
import { createCalculationSnapshot } from '@/lib/calculation-snapshot';
import { serializeCalculationJson } from '@/lib/calculation-snapshot';
import { serializeCalculationCsv } from '@/lib/calculation-export';
import { getPlanEntitlements, type CalcuMintPlan } from '@/lib/entitlements';
import { FinalCalculatorRenderer } from './final-calculator-renderer';
import { CalculatorScenarioWorkspace } from './calculator-scenario-workspace';
import { CalculatorInputError } from './calculator-input-error';
import './draft-calculator-preview.css';
type Props = {
    ownerScope?: string;
    persistence?: DraftAuthenticatedPersistence;
    initialMasterId?: number;
    download?: (name: string, content: string, mime: string) => void;
};
function recordKey(record: Pick<DraftSavedReference, 'source' | 'id'>) { return `${record.source}:${record.id}`; }
type Capture = ReturnType<typeof calculateDraftPreview>;
function browserDownload(name: string, content: string, mime: string) { const url = URL.createObjectURL(new Blob([content], { type: mime })); const anchor = document.createElement('a'); try {
    anchor.href = url;
    anchor.download = name;
    document.body.append(anchor);
    anchor.click();
}
finally {
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
} }
function draftInput(input: Record<string, unknown>) { return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, typeof value === 'number' ? String(value) : JSON.parse(JSON.stringify(value))])); }
export function DraftCalculatorPreview(props: Props) { return <DraftOwnerWorkspace key={props.persistence ? `account:${props.persistence.ownerId}` : props.ownerScope ?? 'local-reviewer'} {...props}/>; }
function DraftOwnerWorkspace({ ownerScope = 'local-reviewer', initialMasterId = 205, download = browserDownload, persistence }: Props) {
 const [id, setId] = useState(initialMasterId), [previewPlan, setPlan] = useState<CalcuMintPlan>('free');
 const [addedRecords, setAddedRecords] = useState<DraftSavedReference[]>([]);
 const accountPersistence = persistence ? {...persistence, records: [...persistence.records, ...addedRecords]} : undefined;
 const plan = persistence?.plan ?? previewPlan;
 return <section className="draft-calculator-preview" aria-label={persistence ? 'Account DRAFT workspace' : 'Private DRAFT review'}><h1>Private DRAFT calculator review</h1>{persistence ? <p>Signed-in account workspace. Plan: {plan}. Saved snapshots belong to your account.</p> : <p>Unpublished synthetic review only. Local reviewer scope simulates ownership; it is not authentication. No account or database is used.</p>}<p>Results show display precision; captures retain raw engine values. Standard JSON serializes numeric signed zero as zero; exact decimal and integer strings stay strings.</p><div className="field-grid"><label>DRAFT calculator<select value={id} onChange={event => setId(Number(event.target.value))}>{draftPreviewDefinitions.map(item => <option key={item.masterId} value={item.masterId}>{item.masterId} · {item.title}</option>)}</select></label>{!persistence && <label>Preview plan<select value={plan} onChange={event => setPlan(event.target.value as CalcuMintPlan)}><option value="free">Free</option><option value="pro">Pro</option><option value="business">Business</option></select></label>}</div><DraftForm key={id} id={id} owner={persistence?.ownerId ?? ownerScope} plan={plan} download={download} persistence={accountPersistence} onSaved={record => setAddedRecords(previous => [...previous.filter(item => recordKey(item) !== recordKey(record)), record])}/></section>;
}
function DraftForm({ id, owner, plan, download, persistence, onSaved }: {
    onSaved: (record: DraftSavedReference) => void;
    persistence?: DraftAuthenticatedPersistence;
    id: number;
    owner: string;
    plan: CalcuMintPlan;
    download: NonNullable<Props['download']>;
}) {
    const definition = getDraftPreviewDefinition(id);
    const [raw, setRaw] = useState<Record<string, unknown>>(() => draftInput(definition.initialInput)), [capture, setCapture] = useState<Capture | null>(null), [invalid, setInvalid] = useState<string[]>([]), [message, setMessage] = useState(''), [failure, setFailure] = useState(false);
    const form = useRef<HTMLFormElement>(null), status = useRef<HTMLParagraphElement>(null);
    useEffect(() => { if (failure && invalid.length === 0) status.current?.focus(); }, [failure, message, invalid.length]);
    const latestPlan = useRef(plan);
    useLayoutEffect(() => { latestPlan.current = plan; }, [plan]);
    const generation = useRef(0), mounted = useRef(true), pending = useRef(false);
    const request = useRef<{ capture: Capture; id: string } | null>(null);
    const [busy, setBusy] = useState(false), [selectedRecord, setSelectedRecord] = useState(() => { const matching = persistence?.records.filter(record => record.masterId === id && record.id === persistence.initialRecordId && (!persistence.initialRecordSource || record.source === persistence.initialRecordSource)) ?? []; return matching.length === 1 ? recordKey(matching[0]) : ''; });
    const records = [...(persistence?.records ?? [])].filter((record, index, all) => record.masterId === id && all.findIndex(item => recordKey(item) === recordKey(record)) === index);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    async function accountOperation(reopening: boolean) {
        if (!persistence || pending.current || (!reopening && !capture)) return;
        const record = records.find(item => recordKey(item) === selectedRecord);
        if (reopening && !record) return;
        const revision = generation.current;
        pending.current = true; setBusy(true); setFailure(false); setMessage(reopening ? 'Opening saved account snapshot…' : 'Saving account snapshot…');
        try {
            if (reopening) {
                const response = await persistence.reopen(record!);
                if (response.masterId !== id) throw Error('Wrong calculator');
                const saved = validateDraftPersistedCapture(id, response.snapshot);
                if (saved.masterId !== id) throw Error('Wrong calculator');
                const restored = { ...calculateDraftPreview(id, saved.snapshot.input), snapshot: saved.snapshot };
                if (!mounted.current || revision !== generation.current || latestPlan.current !== plan) return;
                setRaw(draftInput(saved.snapshot.input)); setCapture(restored); setInvalid([]); request.current = null;
                setMessage('Reopened saved account snapshot.');
            } else {
                if (request.current?.capture !== capture) request.current = { capture: capture!, id: crypto.randomUUID() };
                const snapshot = createCalculationSnapshot(capture!.snapshot);
                const saved = await persistence.save(id, snapshot, request.current.id);
                if (!mounted.current || revision !== generation.current || latestPlan.current !== plan) return;
                const reference: DraftSavedReference = { id: saved.id, masterId: id, source: 'history', label: definition.title, createdAt: new Date().toISOString() };
                onSaved(reference); setSelectedRecord(recordKey(reference));
                setMessage('Snapshot saved to your account.');
            }
        } catch {
            if (mounted.current && revision === generation.current && latestPlan.current === plan) { setFailure(true); setMessage(reopening ? 'Could not reopen this saved version. Your current draft and capture are preserved.' : 'Save was not confirmed. Your draft and capture are preserved. Retry checks the same request; no automatic retry is made.'); }
        } finally {
            pending.current = false;
            if (mounted.current) setBusy(false);
        }
    }
    function edit(key: string, value: unknown) { generation.current++; setRaw(previous => ({ ...previous, [key]: value })); setCapture(null); setInvalid([]); setMessage(''); setFailure(false); }
    function calculate() {
        generation.current++;
        const bad: string[] = [];
        const input = { ...raw };
        for (const field of definition.fields) {
            const value = raw[field.key];
            if (field.optional && (value === undefined || value === null || value === '')) {
                delete input[field.key];
                continue;
            }
            if (field.kind === 'number') {
                if (typeof value !== 'string' || !value.trim() || !Number.isFinite(Number(value)))
                    bad.push(field.key);
                else
                    input[field.key] = Number(value);
            }
            else if (field.kind === 'assessments' && Array.isArray(value)) {
                input[field.key] = value.map(row => { const item = { ...row }; for (const key of ['score', 'weight']) {
                    if (key === 'weight' && (raw.mode==='unweighted'||item[key] === null || item[key] === ''))
                        delete item[key];
                    else if (item[key] !== undefined && item[key] !== null) {
                        if (!String(item[key]).trim() || !Number.isFinite(Number(item[key])))
                            bad.push(field.key);
                        else
                            item[key] = Number(item[key]);
                    }
                } return item; });
            }
            else if (field.kind === 'grade-scale') {
                const scale = value as Record<string, unknown>;
                input[field.key] = { ...scale, minScore: Number(scale.minScore), maxScore: Number(scale.maxScore), ...(Array.isArray(scale.bands) ? { bands: scale.bands.map(band => ({ ...band, minScore: Number(band.minScore) })) } : {}) };
                if(Array.isArray(scale.bands)&&scale.bands.length===0)delete (input[field.key] as Record<string,unknown>).bands;
                if (!String(scale.minScore).trim() || !String(scale.maxScore).trim() || (Array.isArray(scale.bands) && scale.bands.some(band => !String(band.minScore).trim() || !Number.isFinite(Number(band.minScore)))))
                    bad.push(field.key);
            }
            else if (field.kind !== 'assessments' && (typeof value !== 'string' || !value.trim()))
                bad.push(field.key);
        }
        try {
            if (bad.length)
                throw Error('Invalid fields');
            setCapture(calculateDraftPreview(id, input));
            setInvalid([]);
            setMessage('Calculated private DRAFT snapshot.');
            setFailure(false);
        }
        catch (error) {
            setCapture(null);
            const issues = error && typeof error === 'object' && 'issues' in error && Array.isArray(error.issues) ? error.issues as {
                path?: unknown[];
            }[] : [];
            const issueKeys = definition.fields.filter(field => issues.some(issue => issue.path?.[0] === field.key)).map(field => field.key);
            const keys = bad.length ? bad : issueKeys.length ? issueKeys : definition.fields.map(field => field.key);
            setInvalid(keys);
            setFailure(true);
            setMessage('Check required values, supported ranges and row policies.');
            requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[data-field="${keys[0]}"] input, [data-field="${keys[0]}"] select, [data-field="${keys[0]}"] textarea`)?.focus());
        }
    }
    function exportCapture(format: 'json' | 'csv') { if (!capture || !getPlanEntitlements(plan).exports)
        return; try {
        download(`${definition.slug}-draft.${format}`, format === 'json' ? serializeCalculationJson(capture.snapshot) : serializeCalculationCsv(capture.snapshot.input, capture.snapshot.output), format === 'json' ? 'application/json' : 'text/csv;charset=utf-8');
        setFailure(false);
        setMessage('Download requested. If your browser blocks it, allow downloads and retry; your capture is preserved.');
    }
    catch {
        setFailure(true);
        setMessage('Could not download. Try again; your valid capture is preserved.');
    } }
    function retain() { if (!capture)
        return; try {
        saveDraftPreviewCapture(localStorage, owner, id, capture.snapshot);
        setFailure(false);
        setMessage('Snapshot retained locally for this reviewer scope.');
    }
    catch {
        setFailure(true);
        setMessage('Local storage unavailable or full. Your draft and capture are preserved; retry when available.');
    } }
    function reopen() { try {
        const saved = readDraftPreviewCapture(localStorage, owner, id);
        if (!saved) {
            setMessage('No saved snapshot for this reviewer and calculator.');
            setFailure(false);
            return;
        }
        setRaw(draftInput(saved.snapshot.input));
        setCapture(saved);
        setInvalid([]);
        setFailure(false);
        setMessage('Reopened saved local snapshot.');
    }
    catch {
        setFailure(true);
        setMessage('Could not reopen local snapshot. Your current draft is preserved.');
    } }
    return <><h2>{definition.title} · DRAFT v1</h2><form ref={form} noValidate onSubmit={event => { event.preventDefault(); calculate(); }}><div className="field-grid">{definition.fields.map(field => { const key = field.key, error = invalid.includes(key), controlId = `draft-${id}-${key}`, hint = `${controlId}-hint`; return <div key={key} data-field={key}><label htmlFor={controlId}>{field.label}{field.unit ? ` (${field.unit})` : ''}</label>{field.kind === 'assessments' || field.kind === 'grade-scale' ? <StructuredRows id={controlId} label={field.label} kind={field.kind} weighted={raw.mode!=='unweighted'} value={raw[key]} onChange={value => edit(key, value)} invalid={error} describedBy={hint}/> : field.kind === 'select' ? <select id={controlId} aria-invalid={error} aria-describedby={hint} value={String(raw[key] ?? '')} onChange={event => edit(key, event.target.value)}>{field.options?.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input id={controlId} type="text" inputMode={field.kind === 'timestamp' ? 'text' : 'decimal'} aria-invalid={error} aria-describedby={hint} value={String(raw[key] ?? '')} onChange={event => edit(key, event.target.value)}/>}<small id={hint}>{field.hint ?? (error ? 'Enter a supported value.' : ' ')}</small></div>; })}</div>{invalid.length > 0 && <CalculatorInputError />}<div className="draft-actions"><button type="submit">Calculate</button><button type="button" onClick={() => { generation.current++; setRaw(draftInput(definition.initialInput)); setCapture(null); setInvalid([]); setMessage('Example loaded. Calculate to capture it.'); setFailure(false); }}>Load example</button>{persistence ? <><button type="button" disabled={!capture || busy} onClick={() => void accountOperation(false)}>Save to account</button><label>Saved account snapshot<select value={selectedRecord} onChange={event => setSelectedRecord(event.target.value)}><option value="">Choose a saved snapshot</option>{records.map(record => <option key={recordKey(record)} value={recordKey(record)}>{record.label} · {record.createdAt}</option>)}</select></label><button type="button" disabled={!records.some(record => recordKey(record) === selectedRecord) || busy} onClick={() => void accountOperation(true)}>Reopen account snapshot</button></> : <><button type="button" disabled={!capture} onClick={retain}>Retain snapshot locally</button><button type="button" onClick={reopen}>Reopen saved snapshot</button></>}<button type="button" disabled={!capture || !getPlanEntitlements(plan).exports} onClick={() => exportCapture('json')}>Export calculation JSON</button><button type="button" disabled={!capture || !getPlanEntitlements(plan).exports} onClick={() => exportCapture('csv')}>Export calculation CSV</button></div>{persistence && plan === 'free' && <p>New Free account saves are unavailable until atomic quota enforcement is supported. Existing saved snapshots can still be opened.</p>}{!getPlanEntitlements(plan).exports && <p>Calculation exports require Pro or Business.</p>}</form>{message && <p ref={status} tabIndex={-1} role={failure ? 'alert' : 'status'}>{message}</p>}{capture && <FinalCalculatorRenderer result={capture.result} presentation={capture.presentation} plan={plan}/>}<CalculatorScenarioWorkspace plan={plan} snapshot={capture?.snapshot ?? null} displayMetadata={capture ? draftPreviewScenarioMetadata(id, capture) : undefined} download={download}/></>;
}
function StructuredRows({ id, label, kind, weighted, value, onChange, invalid, describedBy }: {
    id: string;
    label: string;
    kind: string;
    weighted:boolean;
    value: unknown;
    onChange: (value: unknown) => void;
    invalid: boolean;
    describedBy: string;
}) {
    if (kind === 'grade-scale')
        return <GradeScaleRows id={id} label={label} value={value} onChange={onChange} invalid={invalid} describedBy={describedBy}/>;
    const rows = Array.isArray(value) ? value as Record<string, unknown>[] : [];
    const keys = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
    const columns = (kind==='assessments'?['score','weight']:keys.length?keys:['label','minimum']).filter(key=>weighted||key!=='weight');
    function update(index: number, key: string, text: string) { const next = rows.map((row, i) => i === index ? { ...row, [key]: text === '' ? null : text } : row); onChange(next); }
    return <fieldset id={id} aria-invalid={invalid} aria-describedby={describedBy}><legend>{label} rows</legend>{rows.map((row, index) => <div className="draft-row" key={index}><strong>Row {index + 1}</strong>{columns.map(key => <label key={key}>{key}<input aria-label={`${label} row ${index + 1} ${key}`} type="text" value={row[key] === null ? '' : String(row[key] ?? '')} onChange={event => update(index, key, event.target.value)}/></label>)}{kind === 'assessments' && <label><input type="checkbox" checked={row.score === null} onChange={event => onChange(rows.map((item, i) => i === index ? { ...item, score: event.target.checked ? null : 0 } : item))}/>Missing score</label>}<button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))}>Remove row {index + 1}</button></div>)}<button type="button" onClick={() => onChange([...rows, Object.fromEntries(columns.map(key => [key, rows[0]?.[key] === undefined ? '' : typeof rows[0][key] === 'number' ? 0 : '']))])}>Add {label} row</button><p>Blank scores are missing; apply the selected missing-score policy. Configure your own grade bands; no institution scale is assumed.</p></fieldset>;
}
function GradeScaleRows({ id, label, value, onChange, invalid, describedBy }: {
    invalid:boolean;
    describedBy:string;
    id: string;
    label: string;
    value: unknown;
    onChange: (value: unknown) => void;
}) {
    const scale = (value && typeof value === 'object' ? value : { minScore: 0, maxScore: 100 }) as {
        minScore: number | string;
        maxScore: number | string;
        bands?: {
            minScore: number | string;
            label: string;
        }[];
    };
    const bands = scale.bands ?? [];
    return <fieldset id={id} aria-invalid={invalid} aria-describedby={describedBy}><legend>{label}</legend>{(['minScore', 'maxScore'] as const).map(key => <label key={key}>{key === 'minScore' ? 'Minimum score' : 'Maximum score'}<input type="text" aria-invalid={invalid} aria-describedby={describedBy} value={scale[key]} onChange={event => onChange({ ...scale, [key]: event.target.value })}/></label>)}{bands.map((band, index) => <div className="draft-row" key={index}><label>Band {index + 1} minimum score<input type="text" aria-invalid={invalid} aria-describedby={describedBy} value={band.minScore} onChange={event => onChange({ ...scale, bands: bands.map((item, i) => i === index ? { ...item, minScore: event.target.value } : item) })}/></label><label>Band {index + 1} label<input type="text" aria-invalid={invalid} aria-describedby={describedBy} value={band.label} onChange={event => onChange({ ...scale, bands: bands.map((item, i) => i === index ? { ...item, label: event.target.value } : item) })}/></label><button type="button" onClick={() => onChange({ ...scale, bands: bands.filter((_, i) => i !== index) })}>Remove band {index + 1}</button></div>)}<button type="button" onClick={() => onChange({ ...scale, bands: [...bands, { minScore: scale.minScore, label: '' }] })}>Add grade band</button><p>Optional caller-defined bands. No institution scale is assumed.</p></fieldset>;
}
