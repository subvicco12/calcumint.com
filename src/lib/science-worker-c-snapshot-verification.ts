/** Target-only immutable replay proposal; shared dispatch adoption is separate. */
import {z} from 'zod';
import {molarityCalculator,molesCalculator,dilutionCalculator} from '@/calculators/chemistry/catalog-batch-1';
import type {CalculatorDefinition} from '@/calculators/types';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';
const definitions=[molarityCalculator,molesCalculator,dilutionCalculator] as unknown as readonly CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>[];
const shape=z.object({calculatorSlug:z.enum(['molarity-calculator','moles-calculator','dilution-calculator']),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyWorkerCScienceSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value,snapshot=createCalculationSnapshot(shape.parse(clean));
 const definition=definitions.find(d=>d.slug===snapshot.calculatorSlug&&d.version===1);
 if(!definition||definition.id!=='chemistry.'+snapshot.calculatorSlug.replace('-calculator',''))throw Error('Exact immutable science v1 engine unavailable');
 const input=definition.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Unsupported recorded science input');
 const expected=runCalculator(definition,input).output;
 if(!sameRecordedJson(expected,snapshot.output))throw Error('Stored science result differs from exact immutable v1 engine');
 return Object.freeze({snapshot,engineId:definition.id,engineVersion:1,scope:'Exact recorded science v1 arithmetic only; no applicability, canonical, specialist or publication approval.'});
}
