/** Additive historical forward agreement only; never changes engine v1 or adopts a successor. */
import {z} from 'zod';
import {cookingMeasurementConverter as engine} from '@/calculators/conversion/catalog-batch-4';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';
const shape=z.object({calculatorSlug:z.literal('cooking-measurement-converter'),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyCookingSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean)),input=engine.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Unsupported recorded cooking input fields; history is unchanged.');
 const expected=engine.calculate(input,{});
 if(!sameRecordedJson(expected,snapshot.output))throw Error('Recorded cooking output differs from its exact immutable v1 engine; history is unchanged.');
 return Object.freeze({snapshot,engineId:engine.id,engineVersion:engine.version,scope:'Exact historical cooking v1 forward agreement only, including original arithmetic and defaults. No physical, canonical, specialist, certification or publication acceptance is granted.'});
}
