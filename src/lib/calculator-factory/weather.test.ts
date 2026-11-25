import { describe, expect, it } from 'vitest';
import { weatherProfiles } from './weather';
import { verifyRegisteredSnapshot } from '../registered-snapshot-verification';
import { readPersistedCalculationSnapshot } from '../persisted-calculation';
import { factoryDownload } from './completion/exports';
import type { FactoryRaw } from './workflows';

const [wind, dew] = weatherProfiles;
const cases: { profile: typeof wind; catalogId: number; id: string; slug: string; raw: FactoryRaw; expected: number }[] = [
    { profile: wind, catalogId: 490, id: 'earth-science.wind-chill', slug: 'wind-chill-calculator', raw: { temperatureC: '-5', windSpeedKmh: '20' }, expected: -11.551404 },
    { profile: dew, catalogId: 492, id: 'earth-science.dew-point', slug: 'dew-point-calculator', raw: { temperatureC: '20', relativeHumidity: '50' }, expected: 9.261107 },
];

describe.each(cases)('$id', ({ profile, catalogId, id, slug, raw, expected }) => {
    it('binds the catalog tuple and preserves the numerical result', () => {
        const packet = profile.workflows.execute(raw);
        expect(profile.route).toBe(`/calculators/earth-science/${slug}`);
        expect(packet.identity).toMatchObject({ catalogId, engineId: id, calculatorSlug: slug, calculatorVersion: 1 });
        expect(packet.snapshot.output.value).toBe(expected);
        expect(verifyRegisteredSnapshot(packet.snapshot)).toMatchObject({ engineId: id, engineVersion: 1, snapshot: packet.snapshot });
    });
    it('verifies a persisted v1 row without rewriting its original input or output', () => {
        const recorded = {
            calculator_slug: slug,
            calculator_version: 1,
            input_data: Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Number(value)])),
            output_data: { value: expected, steps: [`${profile.definition.title.replace(' Calculator', '')} = ${expected}`] },
        };
        const snapshot = readPersistedCalculationSnapshot(recorded);
        const before = structuredClone(snapshot);
        expect(verifyRegisteredSnapshot(snapshot).snapshot).toEqual(before);
        expect(snapshot).toEqual(before);
    });
    it('refuses tampering and wrong versions in stored and exported records', () => {
        const packet = profile.workflows.execute(raw);
        expect(() => verifyRegisteredSnapshot({ ...packet.snapshot, calculatorVersion: 2 })).toThrow();
        expect(() => verifyRegisteredSnapshot({ ...packet.snapshot, output: { ...packet.snapshot.output, value: expected + 1 } })).toThrow();
        expect(() => verifyRegisteredSnapshot({ ...packet.snapshot, input: { ...packet.snapshot.input, extra: true } })).toThrow();
        expect(() => profile.workflows.verify({ ...packet, identity: { ...packet.identity, sourceVersion: 'untrusted' } })).toThrow();
    });
    it('gates scenario capture and exports and supports corrected batches', () => {
        const { workflows } = profile;
        const packet = workflows.execute(raw);
        expect(() => workflows.scenario([], 'A', packet, '', 'free')).toThrow();
        expect(workflows.scenario([], 'A', packet, '', 'pro')[0].packet).toEqual(packet);
        const bad = workflows.batch([raw, { ...raw, temperatureC: 'NaN' }]);
        expect(bad[1].error).toBeDefined();
        expect(() => workflows.exportBatch(bad, 'business')).toThrow();
        expect(workflows.replayBatch(workflows.exportBatch(workflows.batch([raw, raw]), 'business'))[1].packet).toEqual(packet);
        for (const format of ['json', 'csv', 'pdf'] as const) {
            expect(() => factoryDownload(workflows, packet, format, 'free', profile.definition.title)).toThrow();
            const file = factoryDownload(workflows, packet, format, 'pro', profile.definition.title);
            const text = new TextDecoder().decode(file.bytes);
            expect(text).toContain(String(expected));
            if (format === 'json') {
                expect(workflows.replay(text)).toEqual(packet);
                expect(JSON.parse(text).metadata.outputs.value.unit).toBe('°C');
            }
            if (format === 'csv') expect(text).toContain('°C');
            if (format === 'pdf') expect(text).toMatch(/^%PDF-/);
        }
    });
});

it('accepts the exact wind chill endpoints and refuses values that round onto them', () => {
    for (const [temperatureC, windSpeedKmh] of [['-50', '4.8'], ['10', '300']]) {
        expect(Number.isFinite(wind.workflows.execute({ temperatureC, windSpeedKmh }).snapshot.output.value)).toBe(true);
    }
    for (const [temperatureC, windSpeedKmh] of [['-50.000000000000001', '20'], ['10.0000000000000001', '20'], ['0', '4.7999999999999999'], ['0', '300.000000000000001'], ['0', 'Infinity']]) {
        expect(() => wind.workflows.execute({ temperatureC, windSpeedKmh })).toThrow();
    }
});

it('handles saturated air and refuses humidity and temperature outside the exact domain', () => {
    for (const temperatureC of ['-80', '0', '60']) {
        expect(dew.workflows.execute({ temperatureC, relativeHumidity: '100' }).snapshot.output.value).toBe(Number(temperatureC));
    }
    expect(Number.isFinite(dew.workflows.execute({ temperatureC: '0', relativeHumidity: '.001' }).snapshot.output.value)).toBe(true);
    for (const [temperatureC, relativeHumidity] of [['0', '0'], ['0', '0.00099999999999999999'], ['0', '100.000000000000001'], ['60.000000000000001', '50'], ['0', '0x32'], ['0', '']]) {
        expect(() => dew.workflows.execute({ temperatureC, relativeHumidity })).toThrow();
    }
});
