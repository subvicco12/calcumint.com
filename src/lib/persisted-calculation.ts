import {z} from 'zod';
import {readVersionedSlopeSnapshot} from '@/calculators/geometry/slope-versioned-compatibility';
import {createCalculationSnapshot,type CalculationSnapshot} from './calculation-snapshot';

/** Validate recorded data, not current-engine agreement. Never migrate or recalculate history. */
export function validateHistoricalCalculationSnapshot(value:CalculationSnapshot):CalculationSnapshot {
 const snapshot=createCalculationSnapshot(value);
 if(snapshot.calculatorSlug==='slope-calculator') {
  // v1 rise/run and v2 coordinates are separate immutable contracts, even on a v2 registry.
  return createCalculationSnapshot(readVersionedSlopeSnapshot(snapshot));
 }
 // Other historical versions remain readable without consulting today's registry/schema.
 return snapshot;
}

const persistedRow=z.object({
 calculator_slug:z.string(),calculator_version:z.number(),
 input_data:z.record(z.string(),z.unknown()),output_data:z.record(z.string(),z.unknown()),
}).passthrough();

/** Shared by persisted history/scenario rows; DB metadata is not mathematical snapshot data. */
export function readPersistedCalculationSnapshot(value:unknown):CalculationSnapshot {
 const row=persistedRow.parse(value);
 return validateHistoricalCalculationSnapshot({calculatorSlug:row.calculator_slug,calculatorVersion:row.calculator_version,input:row.input_data,output:row.output_data});
}
