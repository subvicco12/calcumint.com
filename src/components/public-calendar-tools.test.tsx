// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { hasPublicCalendarTool, PublicCalendarTool } from './public-calendar-tools';
import { calendarContracts, calendarWorkflows, verifyCalendarSnapshot } from '@/lib/worker1-calendar-20261119/cohort';
import cases from '../../tests/public-calendar/cases.json';

afterEach(cleanup);

it('dispatches only the assigned immutable calendar slugs', () => {
    expect(calendarContracts.map(row => row.catalogId)).toEqual([443, 444, 445, 446, 451, 452, 455, 456, 457]);
    expect(cases.every(row => hasPublicCalendarTool(row.slug))).toBe(true);
    expect(hasPublicCalendarTool('business-days-calculator')).toBe(false);
});

it.each(cases)('$slug calculates, rejects invalid input, clears stale output, and recovers', ({ slug, input, invalid, result, output }) => {
    render(<PublicCalendarTool slug={slug} />);
    const { catalogId, fields } = calendarContracts.find(row => row.slug === slug)!;
    const enter = (values: Record<string, string | undefined>) => {
        for (const field of fields) {
            if (values[field.key] !== undefined) fireEvent.change(screen.getByLabelText(field.label), { target: { value: values[field.key] } });
        }
    };
    const calculate = () => fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));
    enter(input);
    calculate();
    expect(screen.getByRole('status').textContent).toContain(result);
    if (catalogId === 452) expect(screen.getByText('2020')).toBeTruthy();

    const packet = calendarWorkflows(catalogId).execute(Object.fromEntries(Object.entries(input).map(([k,v]) => [k,String(v)])));
    expect(packet.snapshot.output).toEqual(output);
    expect(verifyCalendarSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);
    expect(() => verifyCalendarSnapshot({ ...packet.snapshot, calculatorVersion: 2 })).toThrow();

    enter(invalid);
    expect(screen.queryByRole('status')).toBeNull();
    calculate();
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.queryByRole('status')).toBeNull();
    enter(input);
    calculate();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain(result);
});
