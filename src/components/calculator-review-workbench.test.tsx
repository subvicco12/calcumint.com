// @vitest-environment jsdom
import {cleanup,fireEvent,render,screen} from '@testing-library/react';
import {afterEach,expect,it} from 'vitest';
import {CalculatorReviewWorkbench} from './calculator-review-workbench';
afterEach(cleanup);
it('calculates the real engine and removes stale output as soon as input changes',()=>{render(<CalculatorReviewWorkbench slug="power-calculator"/>);fireEvent.click(screen.getByRole('button',{name:'Calculate preview'}));expect(screen.getByLabelText('Complete engine output').textContent).toContain('50');fireEvent.change(screen.getByLabelText('time'),{target:{value:''}});expect(screen.queryByLabelText('Complete engine output')).toBeNull();fireEvent.click(screen.getByRole('button',{name:'Calculate preview'}));expect(screen.getByRole('alert')).toBeTruthy();expect(screen.queryByRole('button',{name:'Download reviewer JSON'})).toBeNull();});
it('shows immutable version and real formula sources without certified/public claims',()=>{render(<CalculatorReviewWorkbench slug="power-calculator"/>);expect(screen.getByText(/Version 1/)).toBeTruthy();expect(screen.getByText('P=W/t')).toBeTruthy();expect(screen.getByLabelText('work')).toBeTruthy();});
it('does not fabricate inputs or output for an unknown engine',()=>{render(<CalculatorReviewWorkbench slug="not-a-calculator"/>);expect(screen.queryByRole('button',{name:'Calculate preview'})).toBeNull();expect(screen.getByRole('alert')).toBeTruthy();});

it('uses an explicitly private supplied-total adapter without a fabricated public identity',()=>{render(<CalculatorReviewWorkbench slug="private-catalog-39"/>);fireEvent.click(screen.getByRole('button',{name:'Calculate preview'}));expect(JSON.parse(screen.getByLabelText('Complete engine output').textContent!)).toEqual({capitalizationRatePercent:2});});
