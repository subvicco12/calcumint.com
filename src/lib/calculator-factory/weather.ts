import { runCalculator } from '@/calculators/engine';
import { dewPointCalculator, windChillCalculator } from '@/calculators/earth-science/catalog-batch-1';
import { createCalculationSnapshot, type CalculationSnapshot } from '@/lib/calculation-snapshot';
import { equalCompletionJson } from '@/calculators/completion-contracts';
import { createFactoryWorkflows, type FactoryRaw } from './workflows';

function field(key: string, label: string, unit: string, min: string, max: string, defaultValue: string) {
    return { key, label: `${label} (${min} to ${max})`, unit, min, max, defaultValue, kind: 'number' as const };
}

function scaledDecimal(text: string): bigint | undefined {
    const parts = text.length <= 32 ? /^([+-]?)(\d*)(?:\.(\d+))?$/.exec(text) : null;
    if (!parts || !(parts[2] || parts[3])) return undefined;
    const digits = parts[2] + (parts[3] ?? '').padEnd(32, '0');
    return BigInt(parts[1] === '-' ? '-' + digits : digits);
}

export const weatherProfiles = [
    {
        catalogId: 490,
        definition: windChillCalculator,
        run: (input: unknown) => runCalculator(windChillCalculator, input),
        fields: [field('temperatureC', 'Air temperature', '°C', '-50', '10', '-5'), field('windSpeedKmh', 'Wind speed', 'km/h', '4.8', '300', '20')],
        resultLabel: 'Wind chill index',
        scope: 'Uses the Celsius and km/h wind chill equation for exposed skin. The result is an apparent temperature index and does not establish exposure safety.',
    },
    {
        catalogId: 492,
        definition: dewPointCalculator,
        run: (input: unknown) => runCalculator(dewPointCalculator, input),
        fields: [field('temperatureC', 'Air temperature', '°C', '-80', '60', '20'), field('relativeHumidity', 'Relative humidity', '%', '0.001', '100', '50')],
        resultLabel: 'Estimated dew point',
        scope: 'Uses the Magnus approximation over liquid water with relative humidity entered as a percentage. Below freezing this remains a liquid-water dew point estimate. The registered input range does not establish accuracy across that range.',
    },
].map(profile => {
    const { definition, catalogId, fields } = profile;
    const execute = (input: unknown) => {
        const result = profile.run(input);
        return createCalculationSnapshot({
            calculatorSlug: result.slug, calculatorVersion: result.version,
            input: result.input, output: result.output,
        });
    };
    const identity = {
        catalogId, engineId: definition.id, calculatorSlug: definition.slug,
        calculatorVersion: definition.version, sourceVersion: `${definition.id}@${definition.version}/private-weather-1`,
    };
    const workflows = createFactoryWorkflows({
        identity,
        scopedMetadata: {
            schemaVersion: 1, identity, scope: profile.scope, primaryKey: 'value', fields,
            outputs: { value: { label: profile.resultLabel, unit: '°C' } },
            sourceEvidence: [], publisherSources: definition.sources.map(source => source.url),
            limitations: ['The v1 engine rounds to six decimal places. Output resolution does not establish measurement accuracy.'],
            authority: 'Private engineering evidence. Canonical source and precision approval is pending.',
        },
        execute(raw: FactoryRaw) {
            if (Object.keys(raw).length !== fields.length) throw Error('Enter exactly the fields for this calculator.');
            return execute(Object.fromEntries(fields.map(({ key, label, min, max }) => {
                const text = raw[key]?.trim() ?? '';
                const value = scaledDecimal(text);
                if (value === undefined || value < scaledDecimal(min)! || value > scaledDecimal(max)!) {
                    throw Error(`Enter ${label} as a decimal number.`);
                }
                return [key, Number(text)];
            })));
        },
    });
    return { ...profile, execute, workflows, route: `/calculators/${definition.category}/${definition.slug}` };
});

export function verifyWeatherSnapshot(snapshot: CalculationSnapshot) {
    const profile = weatherProfiles.find(row => row.definition.slug === snapshot.calculatorSlug);
    if (!profile || snapshot.calculatorVersion !== profile.definition.version) throw Error('Weather snapshot version is unavailable.');
    const expected = profile.execute(snapshot.input);
    if (!equalCompletionJson(expected, snapshot)) throw Error('Weather snapshot differs from its exact engine result.');
    return { snapshot: expected, engineId: profile.definition.id, engineVersion: profile.definition.version, scope: profile.scope };
}
