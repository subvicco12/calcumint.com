import {z} from 'zod';
import type {StructuredCalculationResult} from '../../calculators/final-framework/types';
import {copyCalculationData} from '../calculation-snapshot';
import {sameRecordedJson} from '../recorded-json-equality';
import {parsePublicationFactoryInput,parsePublicationFactoryNumber} from '../publication-factory-contracts-input';
import {privateFixedFactorCandidates,fixedFactorPrivateRevision,fixedFactorSourceArchiveSha256,
 createPrivateFixedFactorSnapshot,replayPrivateFixedFactorSnapshot,type PrivateFixedFactorArtifact} from './fixed-factor-private';

export const fixedFactorWorkspaceRevision='private-fixed-factor-workspace-20261109.1';
export const fixedFactorWorkspaceStorageKey='calcumint-private-fixed-factor-workspace-20261109.1';
const draftSchema=z.object({value:z.string().max(200),fromUnit:z.string().max(30),toUnit:z.string().max(30)}).strict();
export type FixedFactorDraft=Readonly<z.infer<typeof draftSchema>>;
export type FixedFactorRecord=Readonly<{draft:FixedFactorDraft;artifact:PrivateFixedFactorArtifact}>;
const definitions=[
 {catalogId:429,title:'Pressure',engine:privateFixedFactorCandidates[0],example:{value:'1',fromUnit:'psi',toUnit:'pa'}},
 {catalogId:437,title:'Density',engine:privateFixedFactorCandidates[1],example:{value:'1',fromUnit:'lb_ft3',toUnit:'kg_m3'}},
 {catalogId:439,title:'Torque',engine:privateFixedFactorCandidates[2],example:{value:'1',fromUnit:'lbf_ft',toUnit:'n_m'}}
] as const;
export const fixedFactorWorkspaces=Object.freeze(definitions.map(row=>Object.freeze({...row,example:Object.freeze(row.example)})));
export function fixedFactorWorkspaceDefinition(id:string){
 const definition=fixedFactorWorkspaces.find(row=>row.engine.id===id);
 if(!definition)throw new Error('Unknown private conversion workspace');
 return definition;
}
const freeze=<T extends object>(value:T)=>copyCalculationData({value},{}).input.value as T;
export function runFixedFactorDraft(id:string,raw:unknown):FixedFactorRecord{
 fixedFactorWorkspaceDefinition(id);
 const draft=draftSchema.parse(raw),value=parsePublicationFactoryNumber(draft.value.trim());
 if(typeof value!=='number')throw new Error('Enter a finite round-trippable decimal value; unfinished, lossy or underflowing text is not zero.');
 const artifact=createPrivateFixedFactorSnapshot(id,{value,fromUnit:draft.fromUnit,toUnit:draft.toUnit});
 return freeze({draft,artifact});
}
const recordSchema=z.object({draft:draftSchema,artifact:z.unknown()}).strict();
function verifyRecord(raw:unknown):FixedFactorRecord{
 const record=recordSchema.parse(raw);
 const artifact=replayPrivateFixedFactorSnapshot(JSON.stringify(record.artifact));
 const expected=runFixedFactorDraft(artifact.privateId,record.draft);
 if(!sameRecordedJson(raw,expected))throw new Error('Saved raw input and immutable private result differ');
 return expected;
}
export type FixedFactorWorkspace=Readonly<{
 transportVersion:1;workspaceRevision:typeof fixedFactorWorkspaceRevision;coreRevision:typeof fixedFactorPrivateRevision;
 sourceArchiveSha256:typeof fixedFactorSourceArchiveSha256;canonicalAdoptionAuthorized:false;
 current:FixedFactorRecord|null;history:readonly FixedFactorRecord[];
 scenarios:Readonly<{A:FixedFactorRecord|null;B:FixedFactorRecord|null}>;
}>;
export function emptyFixedFactorWorkspace():FixedFactorWorkspace{
 return freeze({transportVersion:1,workspaceRevision:fixedFactorWorkspaceRevision,coreRevision:fixedFactorPrivateRevision,
  sourceArchiveSha256:fixedFactorSourceArchiveSha256,canonicalAdoptionAuthorized:false,current:null,history:[],scenarios:{A:null,B:null}} as const);
}
const workspaceSchema=z.object({transportVersion:z.literal(1),workspaceRevision:z.literal(fixedFactorWorkspaceRevision),coreRevision:z.literal(fixedFactorPrivateRevision),
 sourceArchiveSha256:z.literal(fixedFactorSourceArchiveSha256),canonicalAdoptionAuthorized:z.literal(false),current:recordSchema.nullable(),
 history:z.array(recordSchema).max(20),scenarios:z.object({A:recordSchema.nullable(),B:recordSchema.nullable()}).strict()}).strict();
function verifyWorkspace(raw:unknown):FixedFactorWorkspace{
 const parsed=workspaceSchema.parse(raw);
 return freeze({...parsed,current:parsed.current===null?null:verifyRecord(parsed.current),history:parsed.history.map(verifyRecord),
  scenarios:{A:parsed.scenarios.A===null?null:verifyRecord(parsed.scenarios.A),B:parsed.scenarios.B===null?null:verifyRecord(parsed.scenarios.B)}});
}
/** Strict envelope keys, including escaped duplicates, before any state commit. */
function rejectDuplicateKeys(text:string){
 const stack:(Set<string>|null)[]=[];
 for(let i=0;i<text.length;i++){
  if(text[i]==='{')stack.push(new Set());else if(text[i]==='[')stack.push(null);
  else if(text[i]==='}'||text[i]===']')stack.pop();
  else if(text[i]==='"'){
   const start=i;for(i++;i<text.length;i++){if(text[i]==='\\'){i++;continue;}if(text[i]==='"')break;}
   let next=i+1;while(next<text.length&&/\s/.test(text[next]))next++;
   if(text[next]===':'){
    const keys=stack[stack.length-1],key=JSON.parse(text.slice(start,i+1)) as string;
    if(!keys||keys.has(key))throw new Error('Duplicate private workspace key');keys.add(key);
   }
  }
 }
}
export function importFixedFactorWorkspace(text:string):FixedFactorWorkspace{
 if(typeof text!=='string'||text.length>2_000_000)throw new Error('Private workspace size/type bound');
 const raw=parsePublicationFactoryInput(text);rejectDuplicateKeys(text);
 return verifyWorkspace(raw);
}
export function exportFixedFactorWorkspace(workspace:FixedFactorWorkspace):string{
 const text=JSON.stringify(verifyWorkspace(workspace),null,2);
 if(text.length>2_000_000)throw new Error('Private workspace size bound');
 return text;
}
export function setFixedFactorCurrent(workspace:FixedFactorWorkspace,record:FixedFactorRecord|null):FixedFactorWorkspace{
 return verifyWorkspace({...workspace,current:record});
}
export function saveFixedFactorHistory(workspace:FixedFactorWorkspace):FixedFactorWorkspace{
 const state=verifyWorkspace(workspace);if(!state.current)throw new Error('Calculate a valid proposal before saving history');
 return verifyWorkspace({...state,history:[...state.history,state.current].slice(-20)});
}
export function saveFixedFactorScenario(workspace:FixedFactorWorkspace,slot:'A'|'B'):FixedFactorWorkspace{
 if(slot!=='A'&&slot!=='B')throw new Error('Unknown scenario slot');
 const state=verifyWorkspace(workspace);if(!state.current)throw new Error('Calculate a valid proposal before capturing a scenario');
 return verifyWorkspace({...state,scenarios:{...state.scenarios,[slot]:state.current}});
}
export function restoreFixedFactorHistory(workspace:FixedFactorWorkspace,index:number):FixedFactorWorkspace{
 const state=verifyWorkspace(workspace);
 if(!Number.isInteger(index)||!state.history[index])throw new Error('Unknown private history record');
 return setFixedFactorCurrent(state,state.history[index]);
}
export function restoreFixedFactorScenario(workspace:FixedFactorWorkspace,slot:'A'|'B'):FixedFactorWorkspace{
 if(slot!=='A'&&slot!=='B')throw new Error('Unknown scenario slot');
 const state=verifyWorkspace(workspace),record=state.scenarios[slot];
 if(!record)throw new Error('Capture the scenario before restoring it');
 return setFixedFactorCurrent(state,record);
}
export function compareFixedFactorScenarios(workspace:FixedFactorWorkspace){
 const {A,B}=verifyWorkspace(workspace).scenarios;
 if(!A||!B)throw new Error('Capture both A and B before comparing');
 if(A.artifact.privateId!==B.artifact.privateId||A.draft.toUnit!==B.draft.toUnit)throw new Error('Compare the same private converter and output unit; restore or recalculate to align units');
 return freeze([{slot:'A',record:A},{slot:'B',record:B}] as const);
}
const unitLabels:Readonly<Record<string,string>>=Object.freeze({pa:'Pa',kpa:'kPa',mpa:'MPa',bar:'bar',atm:'atm',psi:'psi',
 kg_m3:'kg/m³',g_cm3:'g/cm³',kg_l:'kg/L',lb_ft3:'lb/ft³',n_m:'N·m',kn_m:'kN·m',lbf_ft:'lbf·ft',lbf_in:'lbf·in'});
export const fixedFactorUnitLabel=(code:string)=>unitLabels[code]??code;
export function fixedFactorScalarResult(raw:FixedFactorRecord):StructuredCalculationResult{
 const record=verifyRecord(raw),definition=fixedFactorWorkspaceDefinition(record.artifact.privateId),qualification=definition.engine.qualification;
 return {primaryResult:{id:'private-converted-value',label:'Private converted value',value:record.artifact.snapshot.output.result as number,unit:fixedFactorUnitLabel(record.draft.toUnit)},
  methodology:qualification.methodology+' '+qualification.relativeBound,
  sources:[{label:'Retained UCUM 2.2 native source ZIP; SHA256 '+fixedFactorSourceArchiveSha256}],
  warnings:['Private proposal only. Source applicability, competent review and canonical adoption remain pending.',...qualification.limitations]};
}
