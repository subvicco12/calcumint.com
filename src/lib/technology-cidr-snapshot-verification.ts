/** Narrow additional replay binding; original fourteen technology readers stay unchanged. */
import {z} from 'zod';
import {cidrCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';
const shape=z.object({calculatorSlug:z.literal('cidr-calculator'),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyCidrSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean));
 if(cidrCalculator.id!=='technology.cidr'||cidrCalculator.slug!==snapshot.calculatorSlug||cidrCalculator.version!==snapshot.calculatorVersion)throw Error('Exact original CIDR engine/version unavailable.');
 const input=cidrCalculator.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Unsupported recorded CIDR input field.');
 const output=runCalculator(cidrCalculator,input).output;
 if(!sameRecordedJson(output,snapshot.output))throw Error('Recorded CIDR output differs from the exact original engine.');
 return Object.freeze({snapshot,engineId:cidrCalculator.id,engineVersion:cidrCalculator.version,scope:'Exact original IPv4 prefix address-count replay only; no scope approval, certification or publication authority.'});
}
