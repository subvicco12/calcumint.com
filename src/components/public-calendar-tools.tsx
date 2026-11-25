'use client';

import { useId, useState, type FormEvent } from 'react';
import { FinalCalculatorRenderer } from './final-calculator-renderer';
import { calendarContracts, calendarResult, calendarWorkflows } from '@/lib/worker1-calendar-20261119/cohort';
import type { StructuredCalculationResult } from '@/calculators/final-framework/types';

const labels: Record<number, string> = {
    443: 'Whole years', 444: 'Elapsed days', 445: 'Resulting date', 446: 'Elapsed days',
    451: 'Day of the week', 452: 'ISO week number', 455: 'Date after 90 days',
    456: 'Date after 30 days', 457: 'Date after 60 days',
};

export function hasPublicCalendarTool(slug: string) {
    return calendarContracts.some(contract => contract.slug === slug && contract.version === 1);
}

export function PublicCalendarTool({ slug }: { slug: string }) {
    const contract = calendarContracts.find(row => row.slug === slug && row.version === 1);
    return contract ? <CalendarForm key={slug} contract={contract} /> : null;
}

function CalendarForm({ contract }: { contract: typeof calendarContracts[number] }) {
    const id = useId();
    const [result, setResult] = useState<StructuredCalculationResult | null>(null);
    const [error, setError] = useState('');
    const hasOffsets = contract.fields.some(field => field.kind === 'number');

    function calculate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setResult(null);
        setError('');
        const data = new FormData(event.currentTarget);
        const raw = Object.fromEntries(contract.fields.map(field => [field.key, String(data.get(field.key) ?? '').trim()]));
        const invalid = contract.fields.find(field => field.kind === 'number'
            ? !/^[+-]?\d{1,16}$/.test(raw[field.key]) || !Number.isSafeInteger(Number(raw[field.key]))
            : !/^\d{4}-\d{2}-\d{2}$/.test(raw[field.key]));
        if (invalid) {
            setError(invalid.kind === 'number'
                ? `${invalid.label}: enter a whole number within the safe integer range.`
                : `${invalid.label}: enter a date in YYYY-MM-DD format.`);
            const input = event.currentTarget.elements.namedItem(invalid.key);
            if (input instanceof HTMLElement) input.focus();
            return;
        }

        try {
            const presentation = calendarResult(calendarWorkflows(contract.catalogId).execute(raw));
            const primaryResult = { ...presentation.primaryResult, label: labels[contract.catalogId] };
            if (typeof primaryResult.value === 'string' || contract.catalogId === 452) delete primaryResult.unit;
            setResult({
                ...presentation,
                primaryResult,
                warnings: undefined,
                metrics: presentation.metrics?.map(metric => metric.id === 'weekYear'
                    ? { ...metric, value: String(metric.value) }
                    : metric),
            });
        } catch (failure) {
            const message = failure instanceof Error ? failure.message : '';
            if (message === 'asOfDate must not precede birthDate') {
                setError('As-of date must be on or after the birth date.');
            } else if (message.includes('four-digit date range') || message.includes('safe integer range')) {
                setError('The calculation is outside the supported date or offset range. Check the entered dates and offsets.');
            } else {
                setError('Check that each entry is a valid Gregorian calendar date and any offset is a whole number.');
            }
        }
    }

    return <section aria-label={contract.title} className="calculator-ui" style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
        <p>{contract.scope}</p>
        <form aria-label={contract.title} aria-describedby={`${id}-help`} noValidate onSubmit={calculate}
            onChange={() => { setResult(null); setError(''); }}>
            <p id={`${id}-help`}>Use four-digit dates (YYYY-MM-DD).{hasOffsets && ' Enter negative whole numbers to subtract, or 0 for an unused offset.'}</p>
            {contract.fields.map(field => <label className="field" key={field.key}>
                <span>{field.label}</span>
                <input name={field.key} type="text" defaultValue={field.defaultValue} required
                    autoComplete="off" spellCheck={false}
                    style={{ minWidth: 0, maxWidth: '100%', minHeight: 44 }} />
            </label>)}
            <button type="submit" style={{ minHeight: 44 }}>Calculate</button>
        </form>
        {error && <p role="alert">{error}</p>}
        {result && <FinalCalculatorRenderer result={result} />}
    </section>;
}
