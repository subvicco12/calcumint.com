import { describe, expect, it } from 'vitest';
import { cohortLifetimeValue, returnRateImpact } from './private-cohort-economics';

const lifetime = {
    currency: 'USD', period: 'month', acquisitionCost: '20', discountPerPeriod: '0.25',
    periods: [
        { activityProbability: '0.5', revenueIfActive: '100', costIfActive: '20', unconditionalCost: '5' },
        { activityProbability: '0', revenueIfActive: '100', costIfActive: '20', unconditionalCost: '5' },
    ],
};
const returns = {
    currency: 'USD', sales: 100, price: '50', saleCost: '20', refund: '50',
    returnHandling: '4', incrementalReturnFee: '1', recoveredInventoryValue: '15',
    beforeRate: '0.1', afterRate: '0.2',
};

describe('private cohort economics', () => {
    it('discounts conditional and unconditional costs at each matching period', () => {
        // 35 / 1.25 − 5 / 1.25² − 20 = 4.8.
        expect(cohortLifetimeValue.calculate(lifetime)).toEqual({ currency: 'USD', value: '4.8' });
    });
    it('keeps acquisition at time zero and returns a reduced repeating fraction', () => {
        expect(cohortLifetimeValue.calculate({ ...lifetime, periods: [] }).value).toBe('-20');
        expect(cohortLifetimeValue.calculate({
            ...lifetime, acquisitionCost: '0', discountPerPeriod: '0.5',
            periods: [{ activityProbability: '1', revenueIfActive: '1', costIfActive: '0', unconditionalCost: '0' }],
        }).value).toBe('2/3');
    });
    it('supports a negative discount above −1 and bounds horizon and precision', () => {
        expect(cohortLifetimeValue.calculate({ ...lifetime, discountPerPeriod: '-0.5' }).value).toBe('30');
        expect(() => cohortLifetimeValue.calculate({ ...lifetime, discountPerPeriod: '-1' })).toThrow();
        expect(() => cohortLifetimeValue.calculate({ ...lifetime, acquisitionCost: '0.0000001' })).toThrow();
        expect(() => cohortLifetimeValue.calculate({ ...lifetime, periods: Array(61).fill(lifetime.periods[0]) })).toThrow();
        expect(() => cohortLifetimeValue.calculate({
            ...lifetime, periods: [{ ...lifetime.periods[0], activityProbability: '1.000001' }],
        })).toThrow();
    });
    it('isolates the cost of incremental returns and preserves direction', () => {
        expect(returnRateImpact.calculate(returns)).toEqual({
            currency: 'USD', beforeContribution: '2600', afterContribution: '2200', impact: '-400',
        });
        expect(returnRateImpact.calculate({ ...returns, beforeRate: '0.2', afterRate: '0.1' }).impact).toBe('400');
    });
    it('handles empty cohorts, fractional expected returns, and both rate endpoints exactly', () => {
        expect(returnRateImpact.calculate({ ...returns, sales: 0 }).impact).toBe('0');
        expect(returnRateImpact.calculate({ ...returns, sales: 1 }).impact).toBe('-4');
        expect(returnRateImpact.calculate({ ...returns, beforeRate: '0', afterRate: '1' }).afterContribution).toBe('-1000');
    });
    it('rejects out-of-range rates, noninteger sales, and undeclared fees', () => {
        expect(() => returnRateImpact.calculate({ ...returns, sales: 1.5 })).toThrow();
        expect(() => returnRateImpact.calculate({ ...returns, afterRate: '1.01' })).toThrow();
        expect(() => returnRateImpact.calculate({ ...returns, originalFee: '1' })).toThrow();
    });
});
