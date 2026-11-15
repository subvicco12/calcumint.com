/** Target-specific historical replay proposal. Shared dispatch adoption is separate. */
import {z} from 'zod';
import {surfaceAreaCalculator} from '@/calculators/geometry/catalog-completion';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';
const shape=z.object({calculatorSlug:z.literal('surface-area-calculator'),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifySurfaceAreaSnapshot(raw:unknown){
 const copied=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(copied));
 if(surfaceAreaCalculator.id!=='geometry.surface-area'||surfaceAreaCalculator.slug!==snapshot.calculatorSlug||surfaceAreaCalculator.version!==1)throw Error('Exact surface-area v1 engine unavailable');
 const input=surfaceAreaCalculator.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Unsupported recorded surface-area input');
 const output=runCalculator(surfaceAreaCalculator,input).output;
 if(!sameRecordedJson(output,snapshot.output))throw Error('Stored surface-area result differs from its immutable v1 engine');
 return Object.freeze({snapshot,engineId:surfaceAreaCalculator.id,engineVersion:1,scope:'Rectangular-prism surface-area v1 replay only; no canonical approval or publication authority.'});
}
