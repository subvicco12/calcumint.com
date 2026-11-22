import { z } from 'zod';
import { add, decimal, formatRational, multiply, zero } from './exact-rational';

const decimalInput = z.string().max(19).regex(/^(0|[1-9]\d{0,11})(\.\d{1,6})?$/);
const text = z.string().trim().min(1).max(120);
const activity = z.object({
    id: text,
    quantity: decimalInput,
    unit: text,
    factor: z.object({
        kgCO2ePerUnit: decimalInput,
        perUnit: text,
        sourceReference: text,
        sourceVersion: text,
    }).strict(),
}).strict().refine(row => row.unit === row.factor.perUnit, {
    path: ['factor', 'perUnit'],
    message: 'The factor denominator must match the activity unit.',
});

const footprintInput = z.object({
    reportingPeriod: text,
    boundary: text,
    activities: z.array(activity).min(1).max(100),
}).strict().superRefine(({ activities }, context) => {
    const seen = new Set<string>();
    for (const [index, { id }] of activities.entries()) {
        if (seen.has(id)) {
            context.addIssue({
                code: 'custom',
                path: ['activities', index, 'id'],
                message: 'Activity IDs must be unique within the reporting boundary.',
            });
        }
        seen.add(id);
    }
});

export const suppliedFactorCarbonFootprint = {
    masterId: 485,
    id: 'private.environment.supplied-factor-carbon-footprint',
    version: 1,
    inputSchema: footprintInput,
    methodology: 'Multiply each activity by its supplied factor in kg CO₂e per matching unit and sum exact decimal results. The caller supplies the reporting boundary and factor provenance. No dataset, unit conversion, or additional global warming potential multiplier is applied.',
    calculate(raw: unknown) {
        const input = footprintInput.parse(raw);
        let total = zero;
        const rows = input.activities.map(row => {
            const emissions = multiply(decimal(row.quantity), decimal(row.factor.kgCO2ePerUnit));
            total = add(total, emissions);
            return {
                id: row.id,
                kgCO2e: formatRational(emissions),
                sourceReference: row.factor.sourceReference,
                sourceVersion: row.factor.sourceVersion,
            };
        });
        return { reportingPeriod: input.reportingPeriod, boundary: input.boundary, rows, kgCO2e: formatRational(total) };
    },
} as const;

const distanceMetres = z.number().finite().min(1).max(1_000_000);
const raceInput = z.object({
    referenceDistanceMetres: distanceMetres,
    targetDistanceMetres: distanceMetres,
    referenceTimeSeconds: z.number().finite().min(1).max(10_000_000),
    exponent: z.number().finite().min(0.1).max(3),
    calibrationReference: text,
}).strict();

export const suppliedExponentRaceTime = {
    masterId: 522,
    id: 'private.sports.supplied-exponent-race-time',
    version: 1,
    inputSchema: raceInput,
    methodology: 'Evaluate T₂ = T₁ × (D₂ / D₁)^b in binary64 using the supplied exponent. Inputs use metres and seconds. Bounds are computational limits. The output is a model scenario with no claimed individual accuracy, calibration, or prediction interval.',
    calculate(raw: unknown) {
        const input = raceInput.parse(raw);
        const targetTimeSeconds = input.referenceTimeSeconds
            * Math.pow(input.targetDistanceMetres / input.referenceDistanceMetres, input.exponent);
        return { targetTimeSeconds, exponent: input.exponent, calibrationReference: input.calibrationReference };
    },
} as const;
