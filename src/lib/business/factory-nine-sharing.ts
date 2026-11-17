import {z} from 'zod';
import {copyCalculationData,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {factoryContracts} from '@/lib/calculator-factory/registry';
import {factoryDeliveryCatalog} from '@/lib/native-delivery/factory-delivery-catalog';
import {verifyFactoryStoredSnapshot} from '@/lib/calculator-factory/completion/business';
export const FACTORY_NINE_SHARING_REVISION='factory-nine-sharing-private-1';
export const factoryNineShareBindings=Object.freeze(factoryDeliveryCatalog.map(binding=>{const row=factoryContracts.find(x=>x.catalogId===binding.catalogId&&x.registered&&x.version===binding.version&&x.slug===binding.slug&&x.engineId===binding.engineId);if(!row||binding.version!==1)throw Error('Exact factory sharing tuple unavailable');return binding;}));
export const factoryNineShareSlugs=Object.freeze(factoryNineShareBindings.map(row=>row.slug));
const snapshotSchema=z.object({calculatorSlug:z.string(),calculatorVersion:z.literal(1),input:z.record(z.string(),z.unknown()),output:z.record(z.string(),z.unknown())}).strict();
const shareSchema=z.object({organizationId:z.uuid(),projectId:z.uuid(),clientWorkspaceId:z.uuid().nullable(),requestId:z.uuid(),title:z.string().trim().min(1).max(240),snapshot:snapshotSchema}).strict();
export function verifyFactoryNineSnapshot(raw:unknown){const snapshot=snapshotSchema.parse(raw);const verified=verifyFactoryStoredSnapshot(snapshot);if(!factoryNineShareBindings.some(row=>row.catalogId===verified.catalogId&&row.slug===snapshot.calculatorSlug))throw Error('Exact factory nine sharing calculator/version required');return verified;}
export function parseFactoryNineShare(raw:unknown){const copied=copyCalculationData({value:raw},{}).input.value;const clean=shareSchema.parse(copied);if(new TextEncoder().encode(JSON.stringify(clean)).length>65536)throw Error('Shared snapshot exceeds64KiB');const {snapshot}=verifyFactoryNineSnapshot(clean.snapshot);return Object.freeze({...clean,snapshot});}
export function readFactoryNineSharedSnapshot(raw:unknown){const row=z.object({calculator_slug:z.string(),calculator_version:z.number(),input_data:z.record(z.string(),z.unknown()),output_data:z.record(z.string(),z.unknown())}).parse(raw);return verifyFactoryNineSnapshot({calculatorSlug:row.calculator_slug,calculatorVersion:row.calculator_version,input:row.input_data,output:row.output_data}).snapshot;}
export function factoryNineComparisonKey(snapshot:CalculationSnapshot){verifyFactoryNineSnapshot(snapshot);return snapshot.calculatorSlug+'@'+snapshot.calculatorVersion+(typeof snapshot.input.toUnit==='string'?':'+snapshot.input.toUnit:'');}
