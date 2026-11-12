import {copyCalculationData,createCalculationSnapshot,type CalculationSnapshot} from '../calculation-snapshot';
import {parseFinalPrivateSnapshotText} from '../final-private-snapshot-text';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {captureScenario,type ScenarioSlot} from '../scenario-set';
import {serializeCalculationCsv} from '../calculation-export';
import {getPlanEntitlements,type CalcuMintPlan} from '../entitlements';

export type FactoryIdentity=Readonly<{calculatorSlug:string;calculatorVersion:number;sourceVersion:string;catalogId?:number;engineId?:string}>;
export type FactoryRaw=Readonly<Record<string,string>>;
export type FactoryExecutionPacket=Readonly<{schemaVersion:1;identity:FactoryIdentity;raw:FactoryRaw;snapshot:CalculationSnapshot}>;
export type FactoryScenario=Readonly<{slot:ScenarioSlot;notes:string;packet:FactoryExecutionPacket}>;
export type FactoryBatchRow=Readonly<{raw:FactoryRaw;packet?:FactoryExecutionPacket;error?:string}>;

/** Private local workflows. The compiled caller owns identity and engine dispatch.
 * Replay proves numerical consistency only, never authentication or publication authority.
 * Plan arguments control local affordances; authenticated server actions own authorization.
 */
export function createFactoryWorkflows(options:{identity:FactoryIdentity;execute:(raw:FactoryRaw)=>CalculationSnapshot}){
 const identity=copyCalculationData({identity:options.identity},{}).input.identity as FactoryIdentity;
 if(!identity.sourceVersion||typeof identity.sourceVersion!=='string')throw Error('Pinned source version required');
 createCalculationSnapshot({...identity,input:{},output:{}});
 const engine=options.execute;
 const rawCopy=(raw:FactoryRaw):FactoryRaw=>{
  const copied=copyCalculationData({raw},{}).input.raw;
  if(!copied||typeof copied!=='object'||Array.isArray(copied)||Object.values(copied).some(v=>typeof v!=='string')||new TextEncoder().encode(JSON.stringify(copied)).length>65536)throw Error('Bounded raw string fields required');
  return copied as FactoryRaw;
 };
 const execute=(raw:FactoryRaw):FactoryExecutionPacket=>{
  const entered=rawCopy(raw),snapshot=createCalculationSnapshot(engine(entered));
  if(snapshot.calculatorSlug!==identity.calculatorSlug||snapshot.calculatorVersion!==identity.calculatorVersion)throw Error('Engine identity/version differs from pinned contract');
  return Object.freeze({schemaVersion:1,identity,raw:entered,snapshot});
 };
 const replay=(text:string):FactoryExecutionPacket=>{
  const supplied=copyCalculationData({packet:parseFinalPrivateSnapshotText(text)},{}).input.packet as FactoryExecutionPacket;
  if(!supplied||!equalCompletionJson(supplied.identity,identity))throw Error('Pinned identity/source version differs');
  const expected=execute(supplied.raw);
  if(!equalCompletionJson(supplied,expected))throw Error('Packet differs from exact raw input and immutable engine result');
  return expected;
 };
 const verify=(packet:FactoryExecutionPacket)=>replay(JSON.stringify(copyCalculationData({packet},{}).input.packet));
 const requirePlan=(plan:CalcuMintPlan,key:'exports'|'scenarios')=>{if(!getPlanEntitlements(plan)[key])throw Error('This workflow requires Pro or Business');};
 const exportPacket=(packet:FactoryExecutionPacket,format:'json'|'csv',plan:CalcuMintPlan):string=>{
  requirePlan(plan,'exports');const checked=verify(packet);
  if(format==='json')return JSON.stringify(checked,null,2);
  if(format!=='csv')throw Error('Unsupported export format');
  return serializeCalculationCsv({identity:checked.identity,raw:checked.raw,input:checked.snapshot.input},checked.snapshot.output);
 };
 const scenario=(previous:readonly FactoryScenario[],slot:ScenarioSlot,packet:FactoryExecutionPacket,notes:string,plan:CalcuMintPlan):readonly FactoryScenario[]=>{
  requirePlan(plan,'scenarios');
  const checked=previous.map(row=>({...row,packet:verify(row.packet)})),current=verify(packet);
  const captured=captureScenario(checked.map(row=>({slot:row.slot,notes:row.notes,snapshot:row.packet.snapshot})),slot,current.snapshot,notes);
  return Object.freeze(captured.map(row=>Object.freeze({slot:row.slot,notes:row.notes,packet:row.slot===slot?current:checked.find(p=>p.slot===row.slot)!.packet})));
 };
 const batch=(rows:readonly FactoryRaw[]):readonly FactoryBatchRow[]=>{
  if(!Array.isArray(rows)||rows.length<1||rows.length>100)throw Error('Enter 1–100 batch rows');
  const copied=rows.map(rawCopy);
  if(new TextEncoder().encode(JSON.stringify(copied)).length>65536)throw Error('Batch exceeds the 64 KiB engineering limit');
  return Object.freeze(copied.map(raw=>{try{return Object.freeze({raw,packet:execute(raw)});}catch(error){return Object.freeze({raw,error:error instanceof Error?error.message:'Invalid row'});}}));
 };
 const exportBatch=(rows:readonly FactoryBatchRow[],plan:CalcuMintPlan):string=>{
  requirePlan(plan,'exports');
  if(rows.length<1||rows.length>100||rows.some(row=>row.error||!row.packet))throw Error('Correct every row before exporting');
  const checked=rows.map(row=>{const packet=verify(row.packet!);if(!equalCompletionJson(row.raw,packet.raw))throw Error('Batch raw provenance differs');return packet;});
  return JSON.stringify(checked,null,2);
 };
 const replayBatch=(text:string):readonly FactoryBatchRow[]=>{
  const packets=parseFinalPrivateSnapshotText(text);
  if(!Array.isArray(packets)||packets.length<1||packets.length>100)throw Error('Enter 1–100 complete batch packets');
  return Object.freeze(packets.map(value=>{const packet=verify(value);return Object.freeze({raw:packet.raw,packet});}));
 };
 return Object.freeze({identity,execute,replay,verify,exportPacket,scenario,batch,exportBatch,replayBatch});
}
export type FactoryWorkflows=ReturnType<typeof createFactoryWorkflows>;
