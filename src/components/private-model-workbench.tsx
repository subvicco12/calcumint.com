'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { ZodError } from 'zod';
import { cohortLifetimeValue, returnRateImpact } from '../calculators/business/private-cohort-economics';
import { suppliedExponentRaceTime, suppliedFactorCarbonFootprint } from '../calculators/private-supplied-forecast-models';
import styles from './private-model-workbench.module.css';

type Field = { key: string; label: string; hint?: string; options?: readonly string[] };
type Result = { label: string; value: string };
const numberHint = 'Use a decimal point and omit thousands separators.';
const currency: Field = { key: 'currency', label: 'Currency code', hint: 'Enter three uppercase letters, e.g. USD. All amounts must use this currency.' };
const fractionHint = 'Enter a fraction from 0 to 1, e.g. 0.2 for 20%.';
const amount = (key: string, label: string): Field => ({ key, label, hint: numberHint });
const text = (data: FormData, key: string) => String(data.get(key) ?? '').trim();
const numeric = (data: FormData, key: string) => {
    const value = text(data, key);
    return /^\d+(?:\.\d+)?$/.test(value) && value.length <= 32 ? Number(value) : NaN;
};
// Check the decimal text before binary64 rounding can erase a fractional count
// or move an out-of-range distance onto an accepted endpoint.
const boundedDecimal = (data: FormData, key: string, min: bigint, max: bigint, wholeOnly = false) => {
    const value = text(data, key);
    const parts = value.length <= 32 ? /^(\d+)(?:\.(\d+))?$/.exec(value) : null;
    if (!parts) return NaN;
    const whole = BigInt(parts[1]);
    const hasFraction = /[1-9]/.test(parts[2] ?? '');
    if (whole < min || whole > max || (hasFraction && (wholeOnly || whole === max))) return NaN;
    return Number(value);
};
const readFields = (data: FormData, fields: Field[], prefix = '') =>
    Object.fromEntries(fields.map(field => [field.key, text(data, prefix + field.key)]));
const money = (label: string, value: string, unit: string) => ({ label, value: `${value} ${unit}` });

const periodFields: Field[] = [
    { key: 'activityProbability', label: 'Activity probability', hint: fractionHint },
    amount('revenueIfActive', 'Revenue if active'),
    amount('costIfActive', 'Cost if active'),
    amount('unconditionalCost', 'Unconditional cost'),
];
const activityFields: Field[] = [
    { key: 'id', label: 'Unique activity ID' }, amount('quantity', 'Activity quantity'),
    { key: 'unit', label: 'Activity unit' },
    amount('factor.kgCO2ePerUnit', 'Factor in kg CO₂e per unit'),
    { key: 'factor.perUnit', label: 'Factor denominator unit', hint: 'Must match the activity unit.' },
    { key: 'factor.sourceReference', label: 'Factor source reference' },
    { key: 'factor.sourceVersion', label: 'Factor source version' },
];
const cohortFields: Field[] = [
    currency, { key: 'period', label: 'Period length', options: ['week', 'month', 'quarter', 'year'] },
    amount('acquisitionCost', 'Upfront acquisition cost per customer'),
    { key: 'discountPerPeriod', label: 'Discount per period', hint: 'Enter a fraction greater than −1.' },
];
const returnFields: Field[] = [
    currency, { key: 'sales', label: 'Number of sales' }, amount('price', 'Price per sale'),
    amount('saleCost', 'Cost per sale'), amount('refund', 'Refund per return'),
    amount('returnHandling', 'Handling cost per return'), amount('incrementalReturnFee', 'Incremental fee per return'),
    amount('recoveredInventoryValue', 'Recovered inventory value per return'),
    { key: 'beforeRate', label: 'Before return rate', hint: fractionHint },
    { key: 'afterRate', label: 'After return rate', hint: fractionHint },
];
const footprintFields: Field[] = [{ key: 'reportingPeriod', label: 'Reporting period' }, { key: 'boundary', label: 'Reporting boundary' }];
const raceFields: Field[] = [
    amount('referenceDistanceMetres', 'Reference distance (metres)'),
    amount('targetDistanceMetres', 'Target distance (metres)'),
    amount('referenceTimeSeconds', 'Reference time (seconds)'),
    amount('exponent', 'Model exponent (0.1 to 3)'),
    { key: 'calibrationReference', label: 'Calibration reference' },
];

type Profile = {
    id: string;
    version: number;
    masterId: number;
    title: string;
    methodology: string;
    fields: Field[];
    group?: { key: string; label: string; min: number; max: number; fields: Field[] };
    run: (data: FormData, rowCount: number) => Result[];
};
export const privateModelProfiles: Profile[] = [
    {
        ...cohortLifetimeValue, title: 'Customer Lifetime Value', fields: cohortFields,
        group: { key: 'periods', label: 'Cash-flow period', min: 0, max: 60, fields: periodFields },
        run(data, count) {
            const result = cohortLifetimeValue.calculate({
                ...readFields(data, cohortFields),
                periods: Array.from({ length: count }, (_, index) => readFields(data, periodFields, `periods.${index}.`)),
            });
            return [money('Lifetime value per original customer', result.value, result.currency)];
        },
    },
    {
        ...returnRateImpact, title: 'Return Rate Impact', fields: returnFields,
        run(data) {
            const result = returnRateImpact.calculate({ ...readFields(data, returnFields), sales: boundedDecimal(data, 'sales', 0n, 1_000_000_000n, true) });
            return [
                money('Before contribution', result.beforeContribution, result.currency),
                money('After contribution', result.afterContribution, result.currency),
                money('Impact (after minus before)', result.impact, result.currency),
            ];
        },
    },
    {
        ...suppliedFactorCarbonFootprint, title: 'Carbon Footprint', fields: footprintFields,
        group: { key: 'activities', label: 'Activity', min: 1, max: 100, fields: activityFields },
        run(data, count) {
            const result = suppliedFactorCarbonFootprint.calculate({
                ...readFields(data, footprintFields),
                activities: Array.from({ length: count }, (_, index) => {
                    const prefix = `activities.${index}.`;
                    const value = (key: string) => text(data, prefix + key);
                    return {
                        id: value('id'), unit: value('unit'), quantity: value('quantity'),
                        factor: {
                            kgCO2ePerUnit: value('factor.kgCO2ePerUnit'), perUnit: value('factor.perUnit'),
                            sourceReference: value('factor.sourceReference'), sourceVersion: value('factor.sourceVersion'),
                        },
                    };
                }),
            });
            return [
                money('Total emissions', result.kgCO2e, 'kg CO₂e'),
                ...result.rows.map(row => ({ label: row.id, value: `${row.kgCO2e} kg CO₂e (${row.sourceReference}, ${row.sourceVersion})` })),
            ];
        },
    },
    {
        ...suppliedExponentRaceTime, title: 'Race Time Predictor', fields: raceFields,
        run(data) {
            const result = suppliedExponentRaceTime.calculate({
                referenceDistanceMetres: boundedDecimal(data, 'referenceDistanceMetres', 1n, 1_000_000n),
                targetDistanceMetres: boundedDecimal(data, 'targetDistanceMetres', 1n, 1_000_000n),
                referenceTimeSeconds: numeric(data, 'referenceTimeSeconds'),
                exponent: numeric(data, 'exponent'), calibrationReference: text(data, 'calibrationReference'),
            });
            return [
                { label: 'Modelled target time (binary64 approximation)', value: `${result.targetTimeSeconds} seconds` },
                { label: 'Calibration reference', value: result.calibrationReference },
            ];
        },
    },
];

function ModelForm({ profile }: { profile: Profile }) {
    const id = useId();
    const nextRow = useRef(1);
    const [rows, setRows] = useState([0]);
    const [result, setResult] = useState<Result[] | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [refused, setRefused] = useState(false);
    const group = profile.group;
    function clear() {
        setResult(null);
        setErrors({});
        setRefused(false);
    }
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        clear();
        try {
            setResult(profile.run(new FormData(event.currentTarget), rows.length));
        } catch (error) {
            setRefused(true);
            if (error instanceof ZodError) {
                setErrors(Object.fromEntries(error.issues.map(issue => [issue.path.join('.'), issue.message])));
            }
        }
    }
    function field({ key, label, hint, options }: Field, prefix = '') {
        const name = prefix + key;
        const inputId = `${id}-${name}`;
        const description = [hint && `${inputId}-hint`, errors[name] && `${inputId}-error`].filter(Boolean).join(' ');
        const props = { id: inputId, name, required: true, 'aria-invalid': errors[name] ? true : undefined, 'aria-describedby': description || undefined };
        return <div key={key} className={styles.field}>
            <label htmlFor={inputId}>{label}</label>
            {options ? <select {...props}>{options.map(option => <option key={option}>{option}</option>)}</select>
                : <input {...props} maxLength={120} />}
            {hint && <small id={`${inputId}-hint`}>{hint}</small>}
            {errors[name] && <small id={`${inputId}-error`}>{errors[name]}</small>}
        </div>;
    }
    return <>
        <h3>{profile.title}</h3>
        <p>Exact engine <code>{profile.id}@{profile.version}</code></p>
        <p>{profile.methodology}</p>
        <form onSubmit={submit} onChange={clear} noValidate>
            <div className={styles.grid}>{profile.fields.map(item => field(item))}</div>
            {group && <>
                {rows.map((row, index) => <fieldset className={styles.row} key={row}>
                    <legend>{group.label} {index + 1}</legend>
                    <div className={styles.grid}>{group.fields.map(item => field(item, `${group.key}.${index}.`))}</div>
                    <button type="button" disabled={rows.length <= group.min} onClick={() => {
                        setRows(rows.filter(current => current !== row));
                        clear();
                    }}>Remove {group.label.toLowerCase()} {index + 1}</button>
                </fieldset>)}
                <button type="button" disabled={rows.length >= group.max} onClick={() => {
                    setRows([...rows, nextRow.current++]);
                    clear();
                }}>Add {group.label.toLowerCase()}</button>
            </>}
            <button type="submit">Calculate</button>
        </form>
        {refused && <p role="alert">Calculation refused. Correct the marked inputs and calculate again.</p>}
        <div role="status" aria-atomic="true">
            {result && <dl className={styles.result}>
                {result.map(({ label, value }, index) => <div key={index}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>}
        </div>
    </>;
}

export function PrivateModelWorkbench() {
    const id = useId();
    const [selected, setSelected] = useState(privateModelProfiles[0].masterId);
    const profile = privateModelProfiles.find(item => item.masterId === selected) ?? privateModelProfiles[0];
    return <section className={styles.workbench} aria-labelledby={id}>
        <h2 id={id}>Private calculator models</h2>
        <label htmlFor={`${id}-selector`}>Private calculator</label>
        <select id={`${id}-selector`} value={selected} onChange={event => setSelected(Number(event.target.value))}>
            {privateModelProfiles.map(item => <option value={item.masterId} key={item.masterId}>#{item.masterId} {item.title}</option>)}
        </select>
        <ModelForm key={profile.masterId} profile={profile} />
    </section>;
}
