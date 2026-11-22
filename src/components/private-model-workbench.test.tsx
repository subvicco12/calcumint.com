// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { PrivateModelWorkbench } from './private-model-workbench';

afterEach(cleanup);
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const calculate = () => fireEvent.click(screen.getByRole('button', { name: 'Calculate' }));

it.each([
    [173, 'private.business.customer-lifetime-value@1', {
        'Currency code': 'USD', 'Upfront acquisition cost per customer': '20', 'Discount per period': '0.25',
        'Activity probability': '0.5', 'Revenue if active': '100', 'Cost if active': '20', 'Unconditional cost': '5',
    }, 'Discount per period', '-1', '8 USD'],
    [204, 'private.business.return-rate-impact@1', {
        'Currency code': 'USD', 'Number of sales': '100', 'Price per sale': '50', 'Cost per sale': '20',
        'Refund per return': '50', 'Handling cost per return': '4', 'Incremental fee per return': '1',
        'Recovered inventory value per return': '15', 'Before return rate': '0.1', 'After return rate': '0.2',
    }, 'After return rate', '1.1', '-400 USD'],
    [485, 'private.environment.supplied-factor-carbon-footprint@1', {
        'Reporting period': '2026', 'Reporting boundary': 'Fixture', 'Unique activity ID': 'electricity',
        'Activity quantity': '1000', 'Activity unit': 'kWh', 'Factor in kg CO₂e per unit': '0.13096',
        'Factor denominator unit': 'kWh', 'Factor source reference': 'Fixture', 'Factor source version': '1',
    }, 'Factor denominator unit', 'MWh', '130.96 kg CO₂e'],
    [522, 'private.sports.supplied-exponent-race-time@1', {
        'Reference distance (metres)': '5000', 'Target distance (metres)': '10000',
        'Reference time (seconds)': '1500', 'Model exponent (0.1 to 3)': '2', 'Calibration reference': 'Fixture',
    }, 'Reference distance (metres)', '0', '6000 seconds'],
] as const)('binds #%s to its exact engine and recovers after refusal', (id, engine, values, invalidLabel, invalidValue, result) => {
    render(<PrivateModelWorkbench />);
    fill('Private calculator', String(id));
    expect(screen.getByText(engine)).toBeTruthy();
    for (const [label, value] of Object.entries(values)) fill(label, value);
    calculate();
    expect(screen.getByRole('status').textContent).toContain(result);
    fill(invalidLabel, invalidValue);
    calculate();
    expect(screen.getByRole('alert').textContent).toContain('Calculation refused');
    const input = screen.getByLabelText(invalidLabel);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('-error');
    expect(screen.getByRole('status').textContent).toBe('');
    fill(invalidLabel, (values as Record<string, string>)[invalidLabel]);
    calculate();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain(result);
});

it('preserves surviving row inputs when an earlier cash-flow period is removed', () => {
    render(<PrivateModelWorkbench />);
    fireEvent.click(screen.getByRole('button', { name: 'Add cash-flow period' }));
    const probabilities = screen.getAllByLabelText<HTMLInputElement>('Activity probability');
    fireEvent.change(probabilities[1], { target: { value: '0.75' } });
    fireEvent.click(screen.getByRole('button', { name: 'Remove cash-flow period 1' }));
    expect(screen.getByLabelText<HTMLInputElement>('Activity probability').value).toBe('0.75');
});
