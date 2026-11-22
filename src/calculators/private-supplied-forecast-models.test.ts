import { describe, expect, it } from 'vitest';
import { suppliedExponentRaceTime, suppliedFactorCarbonFootprint } from './private-supplied-forecast-models';

const electricity = {
    id: 'electricity', quantity: '1000', unit: 'kWh',
    factor: { kgCO2ePerUnit: '0.13096', perUnit: 'kWh', sourceReference: 'Fixture factor', sourceVersion: 'fixture-1' },
};
const inventory = { reportingPeriod: '2026', boundary: 'Fixture boundary', activities: [electricity] };
const race = {
    referenceDistanceMetres: 5000, targetDistanceMetres: 10000, referenceTimeSeconds: 1500,
    exponent: 1, calibrationReference: 'Fixture exponent',
};

describe('supplied-factor carbon footprint', () => {
    it('sums independent rows exactly with factor references and no extra multiplier', () => {
        const result = suppliedFactorCarbonFootprint.calculate({
            ...inventory, activities: [electricity, { ...electricity, id: 'tiny', quantity: '0.000001' }],
        });
        expect(result.kgCO2e).toBe('130.96000013096');
        expect(result.rows[0]).toEqual({
            id: 'electricity', kgCO2e: '130.96', sourceReference: 'Fixture factor', sourceVersion: 'fixture-1',
        });
    });

    it('accepts explicit zero quantities and factors', () => {
        expect(suppliedFactorCarbonFootprint.calculate({
            ...inventory, activities: [{ ...electricity, quantity: '0' }],
        }).kgCO2e).toBe('0');
        expect(suppliedFactorCarbonFootprint.calculate({
            ...inventory, activities: [{ ...electricity, factor: { ...electricity.factor, kgCO2ePerUnit: '0' } }],
        }).kgCO2e).toBe('0');
    });

    it.each([
        [],
        [electricity, electricity],
        [{ ...electricity, factor: undefined }],
        [{ ...electricity, unit: 'MWh' }],
        [{ ...electricity, quantity: '0.0000001' }],
        [{ ...electricity, quantity: '-1' }],
        [{ ...electricity, factor: { ...electricity.factor, sourceVersion: '' } }],
        Array.from({ length: 101 }, (_, index) => ({ ...electricity, id: String(index) })),
    ])('refuses incomplete, inconsistent or out-of-range activities %#', (...activities) => {
        expect(() => suppliedFactorCarbonFootprint.calculate({ ...inventory, activities })).toThrow();
    });
});

describe('supplied-exponent race time', () => {
    it('preserves identity and evaluates linear and quadratic cases', () => {
        expect(suppliedExponentRaceTime.calculate(race).targetTimeSeconds).toBe(3000);
        expect(suppliedExponentRaceTime.calculate({ ...race, exponent: 2 }).targetTimeSeconds).toBe(6000);
        expect(suppliedExponentRaceTime.calculate({ ...race, targetDistanceMetres: 5000 }).targetTimeSeconds).toBe(1500);
    });

    it('matches a non-integer independent reference and preserves the calibration reference', () => {
        const result = suppliedExponentRaceTime.calculate({ ...race, exponent: 1.06 });
        expect(result.targetTimeSeconds).toBeCloseTo(3127.397282523366, 10);
        expect(result.calibrationReference).toBe('Fixture exponent');
    });

    it.each([
        { exponent: undefined }, { exponent: 0 }, { exponent: Infinity },
        { referenceDistanceMetres: 0 }, { targetDistanceMetres: 1_000_001 },
        { referenceTimeSeconds: NaN }, { calibrationReference: '' },
    ])('rejects unsupported parameters %j', patch => {
        expect(() => suppliedExponentRaceTime.calculate({ ...race, ...patch })).toThrow();
    });
});
