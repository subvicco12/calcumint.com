import {statisticsAContracts} from './next-engineering-statistics-a';
import {statisticsBContracts} from './next-engineering-statistics-b';
import {chemistryAContracts} from './next-engineering-chemistry-a';
import {chemistryBContracts} from './next-engineering-chemistry-b';
import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from '@/lib/calculation-snapshot';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {createFactoryWorkflows,type FactoryExecutionPacket} from '../workflows';
import type {EngineeringContract} from './next-engineering-core';

/** Closed, exact tuples. Local execution grants no certification or publication authority. */
export const nextEngineeringContracts:readonly EngineeringContract[]=Object.freeze([...statisticsAContracts,...statisticsBContracts,...chemistryAContracts,...chemistryBContracts]);
if(nextEngineeringContracts.length!==20||new Set(nextEngineeringContracts.map(r=>r.catalogId)).size!==20||new Set(nextEngineeringContracts.map(r=>r.slug+'@'+r.version)).size!==20)throw Error('Twenty disjoint immutable engineering contracts required');
export function nextEngineeringContract(id:number){return nextEngineeringContracts.find(row=>row.catalogId===id);}
export function verifyNextEngineeringSnapshot(raw:unknown){
 const clean=copyCalculationData({value:raw},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean)||Object.keys(clean).length!==4||!['calculatorSlug','calculatorVersion','input','output'].every(k=>Object.hasOwn(clean,k)))throw Error('Exact historical snapshot shape required');
 const snapshot=createCalculationSnapshot(clean as CalculationSnapshot),contract=nextEngineeringContracts.find(row=>row.slug===snapshot.calculatorSlug);
 if(!contract)throw Error('Unknown next engineering historical contract');
 return contract.verifyHistorical(snapshot);
}
function workflow(contract:EngineeringContract){return createFactoryWorkflows({identity:{catalogId:contract.catalogId,engineId:contract.engineId,calculatorSlug:contract.slug,calculatorVersion:contract.version,sourceVersion:`factory-wave1-20261112.1/${contract.engineId}@${contract.version}/${contract.captureRevision}`},execute:contract.execute});}
export type EngineeringWitness=Readonly<{raw:string;value:number;packet:FactoryExecutionPacket;error?:never}>;
export type EngineeringSample=EngineeringWitness|Readonly<{raw:string;error:string;value?:never;packet?:never}>;
/** Finite user-supplied candidates only; no analytic inverse or all-solutions claim. */
export function sampleNextEngineering(packet:FactoryExecutionPacket,field:string,values:readonly string[]):readonly EngineeringSample[]{
 const contract=nextEngineeringContract(packet.identity.catalogId??-1);if(!contract)throw Error('Exact next engineering identity required');
 const engine=workflow(contract),baseline=engine.verify(packet);
 if(!contract.fields.some(row=>row.key===field&&row.kind==='number'))throw Error('Choose a supplied numeric field');
 if(!Array.isArray(values)||!values.length||values.length>25||values.some(v=>typeof v!=='string'||!v.trim())||values.join(',').length>20000)throw Error('Enter 1–25 explicit numeric candidates');
 return Object.freeze(values.map((raw:string)=>{try{const candidate=engine.execute({...baseline.raw,[field]:raw});return Object.freeze({raw,value:candidate.snapshot.output[contract.primaryKey] as number,packet:candidate});}catch(cause){return Object.freeze({raw,error:cause instanceof Error?cause.message:'Candidate refused'});}}));
}
export function targetNextEngineering(packet:FactoryExecutionPacket,field:string,values:readonly string[],target:string){
 const desired=requiredCalculatorNumber(target),points=sampleNextEngineering(packet,field,values);
 if(!Number.isFinite(desired))throw Error('A complete finite target is required');
 // Exact output equality avoids presenting a close approximation as an exact witness.
 return Object.freeze(points.filter((point):point is EngineeringWitness=>point.value===desired));
}
