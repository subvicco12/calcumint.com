import React, {useState} from 'react';
import {calculateDraftPreview,draftPreviewDefinitions} from '../../src/calculators/final-framework/draft-preview-catalog';
import {DraftCalculatorPreview} from '../../src/components/draft-calculator-preview';
import {validateDraftPersistedCapture,type DraftSavedReference,type DraftPersistedCapture} from '../../src/lib/draft-persistence-contract';
import type {CalculationSnapshot} from '../../src/lib/calculation-snapshot';
import type {CalcuMintPlan} from '../../src/lib/entitlements';
type FixtureRow={owner:string;requestId:string;capture:DraftPersistedCapture;reference:DraftSavedReference};
type FixtureCall=({operation:'save';owner:string;requestId:string}&DraftPersistedCapture)|{operation:'reopen';owner:string;id:string}|{operation:'page';owner:string;source:string;cursor:string};
type FixtureState={
 rows:FixtureRow[];calls:FixtureCall[];mode:'normal'|'pending'|'commit-error'|'reopen-error'|'page-error';
 pending:Array<()=>void>;exports:unknown[];owner?:string;plan?:CalcuMintPlan;
 setOwner?:React.Dispatch<React.SetStateAction<string>>;
 setPlan?:React.Dispatch<React.SetStateAction<CalcuMintPlan>>;release?:()=>void;
};
declare global {interface Window {__draftAccountFixture?:FixtureState}}
// Deliberately test-only. This transport never connects to a service or authenticates a user.
export function AccountFixture(){
 const [owner,setOwner]=useState('synthetic-account-a'),[plan,setPlan]=useState<CalcuMintPlan>('pro'),[,refresh]=useState(0);
 const fixture=window.__draftAccountFixture??=(window.__draftAccountFixture={rows:[],calls:[],mode:'normal',pending:[],exports:[]});
 fixture.owner=owner;fixture.plan=plan;
 fixture.setOwner=setOwner;fixture.setPlan=setPlan;
 fixture.release=()=>{for(const resolve of fixture.pending.splice(0))resolve();};
 const pause=()=>new Promise<void>(resolve=>fixture.pending.push(resolve));
 const pagination = new URLSearchParams(location.search).has('paginationFixture');
 if(pagination && !fixture.rows.length) for(const fixtureOwner of ['synthetic-account-a','synthetic-account-b']) for(const source of ['history','scenario'] as const) for(let index=0;index<126;index++) {
  const definition=draftPreviewDefinitions[index%14];
  fixture.rows.push({owner:fixtureOwner,requestId:`seed-${source}-${index}`,capture:{masterId:definition.masterId,snapshot:calculateDraftPreview(definition.masterId,definition.initialInput).snapshot},reference:{id:`synthetic-${String(999-index).padStart(4,'0')}`,masterId:definition.masterId,source,label:`${fixtureOwner} ${source} ${index}`,createdAt:'2026-10-20T00:00:00Z'}});
 }
 const allRecords:DraftSavedReference[]=fixture.rows.filter((row)=>row.owner===owner).map((row)=>row.reference);
 const records=pagination?allRecords.filter(record=>allRecords.filter(r=>r.source===record.source).indexOf(record)<14):allRecords;
 return <><aside aria-label="Synthetic account fixture"><p>Synthetic account fixture only. No sign-in, database, or deployed authentication is exercised.</p><label>Fixture owner<select value={owner} onChange={e=>setOwner(e.target.value)}><option>synthetic-account-a</option><option>synthetic-account-b</option></select></label><label>Fixture plan<select value={plan} onChange={e=>setPlan(e.target.value as CalcuMintPlan)}><option>free</option><option>pro</option><option>business</option></select></label></aside><DraftCalculatorPreview persistence={{ownerId:owner,plan,records,...(pagination?{pages:{history:{records:[],nextCursor:`${owner}:history:14`},scenario:{records:[],nextCursor:`${owner}:scenario:14`}},async loadPage(source:'history'|'scenario',cursor?:string){
 fixture.calls.push({operation:'page',owner,source,cursor:cursor??''});
 const parts=cursor?.split(':');if(parts?.[0]!==owner||parts[1]!==source)throw Error('Cursor belongs to another owner or source');
 const mode=fixture.mode;fixture.mode='normal';if(mode==='pending')await pause();if(mode==='page-error')throw Error('Private transport details');
 const start=Number(parts[2]),rows=allRecords.filter(r=>r.source===source),end=start+14;
 return {records:rows.slice(start,end),nextCursor:end<rows.length?`${owner}:${source}:${end}`:null};
 }}:{}),
 async save(masterId:number,snapshot:CalculationSnapshot,requestId:string){
  const captured=structuredClone(validateDraftPersistedCapture(masterId,snapshot));
  fixture.calls.push({operation:'save',owner,requestId,...structuredClone(captured)});
  if(plan==='free')throw Error('Atomic Free quota unavailable');
  const existing=fixture.rows.find((row)=>row.owner===owner&&row.requestId===requestId);
  if(existing&&JSON.stringify(existing.capture)!==JSON.stringify(captured))throw Error('Request identity conflict');
  const row:FixtureRow=existing??{owner,requestId,capture:captured,reference:{id:crypto.randomUUID(),masterId,source:'history',label:`Synthetic ${masterId}`,createdAt:new Date().toISOString()}};
  if(!existing)fixture.rows.push(row);
  const mode=fixture.mode;fixture.mode='normal';
  if(mode==='pending')await pause();
  if(mode==='commit-error')throw Error('Synthetic response lost after commit');
  refresh(n=>n+1);return {id:row.reference.id};
 },
 async reopen(record){
  fixture.calls.push({operation:'reopen',owner,id:record.id});
  const row=fixture.rows.find((row)=>row.owner===owner&&row.reference.id===record.id&&row.reference.source===record.source);
  if(!row)throw Error('Snapshot unavailable for this owner');
  const mode=fixture.mode;fixture.mode='normal';if(mode==='pending')await pause();
  if(mode==='reopen-error')throw Error('Synthetic reopen failure');
  return structuredClone(row.capture);
 }}}/></>;
}
