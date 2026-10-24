// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, expect, it, vi} from 'vitest';
vi.mock('./calculator-account-actions', () => ({CalculatorAccountActions: () => null}));
import {CalculatorInteractive} from './calculator-interactive';
afterEach(cleanup);
it('uses the canonical renderer for the unchanged reviewed CIDR result and trust disclosure', () => {
 const {container}=render(<CalculatorInteractive slug="cidr-calculator"/>);
 expect(container.querySelector('.final-calculator-renderer')).not.toBeNull();
 expect(screen.getByRole('status').textContent).toContain('256 addresses');
 expect(screen.getByText('Methodology')).toBeDefined();
 expect(screen.getByText(/total IPv4 addresses/)).toBeDefined();
 expect(screen.getByRole('link').getAttribute('href')).toContain('rfc4632');
});
it.each([['0','4,294,967,296'],['31','2'],['32','1']])('preserves /%s total addresses including reserved values', (value,expected) => {
 render(<CalculatorInteractive slug="cidr-calculator"/>);
 fireEvent.change(screen.getByLabelText('CIDR prefix'),{target:{value}});
 expect(screen.getByRole('status').textContent).toContain(`${expected} addresses`);
});
it.each(['','-1','33','1.5'])('announces invalid prefix %s and recovers without stale result', value => {
 render(<CalculatorInteractive slug="cidr-calculator"/>);
 const input=screen.getByLabelText('CIDR prefix');
 expect(input.getAttribute('step')).toBe('1');
 expect(input.getAttribute('min')).toBe('0');
 fireEvent.change(input,{target:{value}});
 expect(screen.getByRole('alert').textContent).toContain('Enter a whole-number CIDR prefix from 0 to 32.');
 expect(screen.queryByText('256 addresses')).toBeNull();
 fireEvent.change(input,{target:{value:'24'}});
 expect(screen.queryByRole('alert')).toBeNull();
 expect(screen.getByRole('status').textContent).toContain('256 addresses');
});
