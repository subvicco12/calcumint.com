import {businessDaysCalculator, timeDurationCalculator, hoursCalculator, timeCardCalculator} from '@/calculators/date-time/catalog-batch-2';
import {timeZoneCalculator, countdownCalculator} from '@/calculators/date-time/catalog-batch-4';
import type {CalculatorDefinition} from '@/calculators/types';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';
import {createFactoryWorkflows, type FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {copyCalculationData, createCalculationSnapshot} from '@/lib/calculation-snapshot';
import {parsePublicationFactoryInput} from '@/lib/publication-factory-contracts-input';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {serializeCalculationCsv} from '@/lib/calculation-export';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {FactoryWorkbenchField} from '@/components/sole-civil-time-20261119/workbench';

type Engine = CalculatorDefinition<Record<string, unknown>, Record<string, number | string>>;
const text = (key: string, label: string, unit: string): FactoryWorkbenchField => ({key, label, unit, kind: 'text'});
const number = (key: string, label: string, unit: string): FactoryWorkbenchField => ({key, label, unit, kind: 'number'});
const json = (key: string, label: string): FactoryWorkbenchField => ({key, label, kind: 'textarea'});
const clockFields: readonly FactoryWorkbenchField[] = [
  text('startTime', 'Start time', 'HH:MM'),
  text('endTime', 'End time', 'HH:MM'),
  {key: 'overnight', label: 'Allow end time on the next day', kind: 'select', options: ['false', 'true'], optionLabels: {false: 'No', true: 'Yes'}},
];
const rows = [
  [447, businessDaysCalculator, 'businessDays', 'business days', [text('startDate', 'Start date', 'YYYY-MM-DD'), text('endDate', 'End date (excluded)', 'YYYY-MM-DD'), json('holidays', 'Holidays as a JSON array of YYYY-MM-DD strings')], 'Counts Monday through Friday. The end date is excluded. Only supplied holidays are used.'],
  [448, timeDurationCalculator, 'totalMinutes', 'min', clockFields, 'Enter wall-clock times. Equal times yield zero, including with the overnight option.'],
  [449, hoursCalculator, 'totalMinutes', 'min', [...clockFields, number('breakMinutes', 'Unpaid break', 'min')], 'Subtracts whole-minute breaks from elapsed clock time. Payroll rounding is outside this model.'],
  [450, timeCardCalculator, 'totalMinutes', 'min', [json('shifts', 'Shifts as a JSON array with startTime, endTime, overnight, and breakMinutes')], 'Sum one to 31 explicit shifts. Enter HH:MM clock strings, an overnight boolean, and whole break minutes.'],
  [453, timeZoneCalculator, 'localDateTime', 'local time', [text('localDateTime', 'Source local time', 'YYYY-MM-DDTHH:MM'), number('sourceOffsetMinutes', 'Source UTC offset', 'min'), number('targetOffsetMinutes', 'Target UTC offset', 'min')], 'Uses fixed offsets only. Named zones and daylight-saving transitions are outside this model.'],
  [454, countdownCalculator, 'totalSeconds', 's', [text('referenceInstant', 'Reference instant', 'YYYY-MM-DDTHH:MM:SSZ'), text('targetInstant', 'Target instant', 'YYYY-MM-DDTHH:MM:SSZ')], 'The reference and target are explicit whole-second UTC instants. The result never depends on the live clock.'],
] as const;

export function toTimeRaw(input: Record<string, unknown>) {
  // JSONB preserves array order but can reorder the keys within a shift.
  const orderObjectKeys = (_key: string, value: unknown) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
  };
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [
    key, typeof value === 'string' ? value : JSON.stringify(value, orderObjectKeys),
  ]));
}

export const timeContracts = Object.freeze(rows.map(([catalogId, definition, resultKey, unit, fields, limitations]) => {
  const engine = definition as unknown as Engine;
  const defaults = toTimeRaw(engine.examples[0].input);
  return Object.freeze({
    catalogId, engineId: engine.id, slug: engine.slug, version: engine.version, title: engine.title,
    resultKey, unit, engine, limitations,
    scope: engine.formulas.map(formula => formula.description).join(' '),
    fields: Object.freeze(fields.map(field => Object.freeze({...field, defaultValue: defaults[field.key]}))),
  });
}));

export function timeContract(id: number) {
  const row = timeContracts.find(candidate => candidate.catalogId === id);
  if (!row) throw Error('Civil time profile unavailable');
  return row;
}

function normalize(c: ReturnType<typeof timeContract>, value: Record<string, unknown>) {
  const parsed = c.engine.inputSchema.safeParse(value);
  if (!parsed.success) throw Error(parsed.error.issues.map(issue => [issue.path.join('.'), issue.message].filter(Boolean).join(' — ')).join('. '));
  if (!equalCompletionJson(parsed.data, value)) throw Error('Use exactly the fields required by this version');
  return parsed.data;
}

function fieldValue(field: FactoryWorkbenchField, value: string) {
  switch (field.kind) {
    case 'textarea': {
      if (new TextEncoder().encode(value).length > 65536) throw Error('Structured input exceeds 64 KiB');
      const array = parsePublicationFactoryInput(value);
      if (!Array.isArray(array)) throw Error('Enter a JSON array');
      return array;
    }
    case 'select':
      if (value !== 'true' && value !== 'false') throw Error('Select whether overnight is allowed');
      return value === 'true';
    case 'number': {
      const num = requiredCalculatorNumber(value);
      if (!Number.isSafeInteger(num)) throw Error('Enter a whole number of minutes');
      return num;
    }
    default:
      return value;
  }
}

export function timeWorkflows(id: number) {
  const c = timeContract(id);
  const flow = createFactoryWorkflows({
    identity: {catalogId: id, engineId: c.engineId, calculatorSlug: c.slug, calculatorVersion: c.version,
      sourceVersion: `sole-civil-time-20261119.1/${c.engineId}@${c.version}`},
    execute: raw => {
      if (Object.keys(raw).length !== c.fields.length || c.fields.some(field => !Object.hasOwn(raw, field.key))) throw Error('Use exactly the fields required by this version');
      const input = normalize(c, Object.fromEntries(c.fields.map(field => [field.key, fieldValue(field, raw[field.key])])));
      return createCalculationSnapshot({calculatorSlug: c.slug, calculatorVersion: c.version, input, output: c.engine.calculate(input, {})});
    },
  });
  return Object.freeze({...flow, exportPacket(packet: FactoryExecutionPacket, format: 'json' | 'csv', plan: CalcuMintPlan) {
    const exported = flow.exportPacket(packet, format, plan);
    if (format === 'json') return exported;
    const checked = flow.verify(packet);
    return serializeCalculationCsv({identity: checked.identity, raw: checked.raw, input: checked.snapshot.input},
      {...checked.snapshot.output, outputUnit: c.unit});
  }});
}

export function verifyCivilTimePacket(value: unknown) {
  const clean = copyCalculationData({value}, {}).input.value as FactoryExecutionPacket;
  if (!clean || typeof clean.identity?.catalogId !== 'number') throw Error('Exact civil time packet required');
  return timeWorkflows(clean.identity.catalogId).verify(clean);
}

export function verifyCivilTimeSnapshot(value: unknown) {
  const clean = copyCalculationData({value}, {}).input.value;
  if (!clean || typeof clean !== 'object' || Array.isArray(clean) || Object.keys(clean).sort().join(',') !== 'calculatorSlug,calculatorVersion,input,output') throw Error('Exact civil time snapshot fields required');
  const snapshot = createCalculationSnapshot(clean as Parameters<typeof createCalculationSnapshot>[0]);
  const c = timeContracts.find(row => row.slug === snapshot.calculatorSlug && row.version === snapshot.calculatorVersion);
  if (!c) throw Error('Exact immutable civil time version unavailable');
  const expected = c.engine.calculate(normalize(c, snapshot.input), {});
  if (!equalCompletionJson(expected, snapshot.output)) throw Error('Snapshot differs from immutable engine');
  return Object.freeze({catalogId: c.catalogId, engineId: c.engineId, engineVersion: c.version, scope: c.scope, snapshot});
}

export function timeResult(packet: FactoryExecutionPacket): StructuredCalculationResult {
  const checked = verifyCivilTimePacket(packet);
  const c = timeContract(checked.identity.catalogId!);
  const result = checked.snapshot.output as Record<string, string | number>;
  return {
    primaryResult: {id: c.resultKey, label: c.title.replace(' Calculator', ''), value: result[c.resultKey], unit: c.unit},
    metrics: Object.entries(result).filter(([key]) => key !== c.resultKey).map(([id, value]) => ({id, label: id === 'utcOffsetMinutes' ? 'Target UTC offset (min)' : id, value})),
    methodology: c.scope, sources: c.engine.sources, warnings: [c.limitations, 'Competent source and scope review is pending.'],
  };
}

export function prepareCivilTimeRecovery(value: unknown) {
  const verified = verifyCivilTimeSnapshot(value);
  let current: FactoryExecutionPacket;
  try {
    current = timeWorkflows(verified.catalogId).execute(toTimeRaw(verified.snapshot.input));
  } catch {
    return {...verified, currentCaptureAvailable: false as const};
  }
  if (!equalCompletionJson(current.snapshot, verified.snapshot)) throw Error('Historical result differs from current capture');
  return {...verified, currentCaptureAvailable: true as const};
}
