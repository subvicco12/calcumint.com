/** @vitest-environment jsdom */
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
const fixture = vi.hoisted(() => ({ plan: 'free', capture: null as null | { output: unknown } }));
vi.mock('@/components/use-calculator-plan', () => ({ useCalculatorPlan: () => fixture.plan }));
vi.mock('@/components/calculator-account-actions', () => ({ CalculatorAccountActions: (props: { output: unknown }) => { fixture.capture = props; return null; } }));
import { CalculatorInteractive } from '../../components/calculator-interactive';
afterEach(() => { cleanup(); fixture.capture = null; });
const change = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
for (const plan of ['free', 'pro', 'business']) {
  it(`${plan} SIP suppresses invalid results and account captures, then recovers in both modes`, () => {
    fixture.plan = plan;
    render(<CalculatorInteractive slug="sip-calculator" />);
    expect(fixture.capture?.output).not.toBeNull();
    change('Monthly contribution', '1'); change('Term (months)', '1200');
    change('Modeled annual return (%)', '1e-300');
    expect(screen.getByRole('alert').textContent).toContain('Enter valid values');
    expect(screen.queryByRole('status')).toBeNull();
    expect(fixture.capture?.output).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Advanced' }));
    fireEvent.change(screen.getByLabelText('Contribution timing'), { target: { value: 'end' } });
    expect(fixture.capture?.output).toBeNull();
    change('Modeled annual return (%)', '0');
    expect(fixture.capture?.output).toMatchObject({ futureValue: 1200, investedAmount: 1200, estimatedGain: 0 });
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Solve monthly contribution' }));
    change('Target future value', '1200'); change('Modeled annual return (%)', '-1e-300');
    expect(screen.getByRole('alert')).toBeTruthy(); expect(fixture.capture?.output).toBeNull();
    change('Modeled annual return (%)', '0');
    expect(fixture.capture?.output).toMatchObject({ requiredMonthlyContribution: 1, targetFutureValue: 1200 });
    fireEvent.click(screen.getByRole('button', { name: 'Project future value' }));
    change('Monthly contribution', '1e308');
    expect(fixture.capture?.output).toBeNull(); expect(screen.queryByRole('status')).toBeNull();
    change('Monthly contribution', '1');
    expect(fixture.capture?.output).toMatchObject({ futureValue: 1200, investedAmount: 1200, estimatedGain: 0 });
  });
}
