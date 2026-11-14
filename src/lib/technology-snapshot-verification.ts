/** Explicit existing versions only; no routing, historical upgrade or certification authority. */
import {z} from 'zod';
import {ipSubnetCalculator,raidCapacityCalculator,screenPpiCalculator,aspectRatioCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import {resolutionCalculator,dpiCalculator,batteryRuntimeCalculator,upsRuntimeCalculator,powerSupplyCalculator,websiteBandwidthCalculator,cloudStorageCostCalculator,cloudDataTransferCostCalculator,base64SizeCalculator,passwordEntropyCalculator} from '@/calculators/technology-computing/catalog-batch-2';
import type {CalculatorDefinition} from '@/calculators/types';
import {runCalculator} from '@/calculators/engine';
import {copyCalculationData,createCalculationSnapshot} from './calculation-snapshot';
import {sameRecordedJson} from './recorded-json-equality';
const selected=[ipSubnetCalculator,raidCapacityCalculator,screenPpiCalculator,aspectRatioCalculator,resolutionCalculator,dpiCalculator,batteryRuntimeCalculator,upsRuntimeCalculator,powerSupplyCalculator,websiteBandwidthCalculator,cloudStorageCostCalculator,cloudDataTransferCostCalculator,base64SizeCalculator,passwordEntropyCalculator] as unknown as readonly CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>[];
export const technologyReplayBindings=Object.freeze(selected.map(definition=>Object.freeze({slug:definition.slug,engineId:definition.id,version:definition.id==='technology.website-bandwidth'?2:1})));
const shape=z.object({calculatorSlug:z.string().min(1).max(200),calculatorVersion:z.number().int().positive(),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
export function verifyTechnologySnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 const snapshot=createCalculationSnapshot(shape.parse(clean));
 const binding=technologyReplayBindings.find(row=>row.slug===snapshot.calculatorSlug);
 const definition=selected.find(row=>row.slug===snapshot.calculatorSlug);
 if(!binding||!definition||binding.engineId!==definition.id||binding.version!==definition.version||binding.version!==snapshot.calculatorVersion)throw Error('Exact technology engine/version unavailable; historical input is not upgraded.');
 const input=definition.inputSchema.parse(snapshot.input);
 if(Object.keys(snapshot.input).some(key=>!Object.hasOwn(input,key)))throw Error('Unsupported technology recorded input field');
 const output=runCalculator(definition,input).output;
 if(!sameRecordedJson(output,snapshot.output))throw Error('Technology recorded output differs from its exact engine');
 return Object.freeze({snapshot,engineId:binding.engineId,engineVersion:binding.version,scope:'Exact existing forward-engine agreement only; not full canonical, source applicability, certification or publication approval.'});
}
