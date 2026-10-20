import {beforeEach,expect,it,vi} from 'vitest';
import {randomUUID} from 'node:crypto';
import {draftPreviewDefinitions,calculateDraftPreview} from '@/calculators/final-framework/draft-preview-catalog';
const m=vi.hoisted(()=>({owner:'owner-a',plan:'pro',active:true,role:'reviewer',authError:false,profileError:false,loseResponse:false,changeOwnerOnProfile:false,authReads:0,downgradeOnReauth:false,writes:0,rows:new Map<string,Record<string,unknown>>(),filters:[] as string[]}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>{m.authReads++;if(m.downgradeOnReauth&&m.authReads>1)m.plan='free';return {data:{user:{id:m.owner}},error:m.authError?{}:null};}},from:(table:string)=>{
 const filters=new Map<string,unknown>();const matches=(row:Record<string,unknown>)=>[...filters].every(([k,v])=>row[k]===v);
 const q={select:()=>q,eq:(k:string,v:unknown)=>{filters.set(k,v);m.filters.push(`${table}:${k}:${v}`);return q;},order:()=>q,limit:()=>q,
 maybeSingle:async()=>{
  if(table==='platform_admins')return {data:{active:m.active,role:m.role},error:null};
  if(table==='profiles'){if(m.changeOwnerOnProfile)m.owner='owner-b';return {data:{plan:m.plan},error:m.profileError?{}:null};}
  return {data:[...m.rows.values()].find(row=>row.table===table&&matches(row))??null,error:null};
 },then:(resolve:(value:unknown)=>unknown)=>Promise.resolve({data:[...m.rows.values()].filter(row=>row.table===table&&matches(row)),error:null}).then(resolve),
 insert:async(row:Record<string,unknown>)=>{m.writes++;if(m.rows.has(String(row.id)))return {error:{code:'23505'}};m.rows.set(String(row.id),{...JSON.parse(JSON.stringify(row)),table,created_at:'2026-10-20T00:00:00Z'});if(m.loseResponse){m.loseResponse=false;return {error:{code:'503'}};}return {error:null};}};return q;}})}));
import {saveDraftCalculation,reopenDraftCalculation,loadDraftWorkspace} from './actions';
beforeEach(()=>{Object.assign(m,{owner:'owner-a',plan:'pro',active:true,role:'reviewer',authError:false,profileError:false,loseResponse:false,changeOwnerOnProfile:false,authReads:0,downgradeOnReauth:false,writes:0,filters:[]});m.rows.clear();});
it.each(draftPreviewDefinitions)('$masterId guarded action preserves exact capture through save/reopen/scenario copy',async d=>{
 const snapshot=calculateDraftPreview(d.masterId,d.initialInput).snapshot,requestId=randomUUID();
 const args={expectedOwnerId:'owner-a',masterId:d.masterId,requestId,snapshot};
 await saveDraftCalculation(args);expect(await reopenDraftCalculation({expectedOwnerId:'owner-a',source:'history',id:requestId})).toEqual({masterId:d.masterId,snapshot});
 const scenarioId=randomUUID();m.rows.set(scenarioId,{...m.rows.get(requestId),id:scenarioId,table:'saved_scenarios',name:'Owner scenario'});
 expect(await reopenDraftCalculation({expectedOwnerId:'owner-a',source:'scenario',id:scenarioId})).toEqual({masterId:d.masterId,snapshot});
 expect((await loadDraftWorkspace('owner-a')).records.map(r=>r.source).sort()).toEqual(['history','scenario']);expect(m.filters).toContain('calculation_history:user_id:owner-a');
});
const args=()=>({expectedOwnerId:'owner-a',masterId:205,requestId:randomUUID(),snapshot:calculateDraftPreview(205,{left:'-0.000001',right:'0',operation:'add'}).snapshot});
it('reconciles concurrent identical UUID requests without a second stored capture',async()=>{const a=args();await Promise.all([saveDraftCalculation(a),saveDraftCalculation(a)]);expect(m.rows.size).toBe(1);expect(m.rows.get(a.requestId)?.output_data).toEqual(a.snapshot.output);});
it('recovers an unknown committed response using the same UUID without retry duplication',async()=>{const a=args();m.loseResponse=true;await expect(saveDraftCalculation(a)).rejects.toThrow('Saved draft unavailable');expect(m.rows.size).toBe(1);m.plan='free';expect(await saveDraftCalculation(a)).toEqual({id:a.requestId});expect(m.writes).toBe(1);});
it('denies foreign owners, conflicting snapshots and new Free writes without deleting records',async()=>{
 const a=args();await saveDraftCalculation(a);const old=JSON.stringify(m.rows.get(a.requestId));
 const different=calculateDraftPreview(205,{left:'1',right:'2',operation:'add'}).snapshot;
 await expect(saveDraftCalculation({...a,snapshot:different})).rejects.toThrow('Saved draft unavailable');
 m.owner='owner-b';await expect(reopenDraftCalculation({expectedOwnerId:'owner-b',source:'history',id:a.requestId})).rejects.toThrow('Saved draft unavailable');
 m.plan='free';await expect(saveDraftCalculation({...a,expectedOwnerId:'owner-b',requestId:randomUUID()})).rejects.toThrow('atomic Free history quota');expect(JSON.stringify(m.rows.get(a.requestId))).toBe(old);
});
it('denies stale sessions, role loss and pre-dispatch account switching',async()=>{
 const a=args();m.authError=true;await expect(saveDraftCalculation(a)).rejects.toThrow('Draft access unavailable');m.authError=false;m.active=false;await expect(saveDraftCalculation(a)).rejects.toThrow('Draft access unavailable');m.active=true;m.changeOwnerOnProfile=true;await expect(saveDraftCalculation(a)).rejects.toThrow('Draft access unavailable');expect(m.writes).toBe(0);
});
it('rejects corrupt and incompatible saved outputs without upgrading history',async()=>{
 const a=args();await saveDraftCalculation(a);const row=m.rows.get(a.requestId)!;row.calculator_version=2;
 await expect(reopenDraftCalculation({expectedOwnerId:'owner-a',source:'history',id:a.requestId})).rejects.toThrow();expect(row.calculator_version).toBe(2);
 row.calculator_version=1;row.output_data={result:'invented'};await expect(reopenDraftCalculation({expectedOwnerId:'owner-a',source:'history',id:a.requestId})).rejects.toThrow();expect(row.output_data).toEqual({result:'invented'});
});

it('reconciles numeric signed zero after actual JSON transport normalization without changing the original input',async()=>{
 const snapshot=calculateDraftPreview(484,{batteryEnergyAddedKwh:-0,chargingEfficiency:0.9}).snapshot,requestId=randomUUID();const entry={expectedOwnerId:'owner-a',masterId:484,requestId,snapshot};
 m.loseResponse=true;await expect(saveDraftCalculation(entry)).rejects.toThrow('Saved draft unavailable');expect(m.rows.size).toBe(1);expect(await saveDraftCalculation(entry)).toEqual({id:requestId});expect(m.writes).toBe(1);
});

it('rejects a plan downgrade discovered during pre-dispatch account re-verification',async()=>{const a=args();m.downgradeOnReauth=true;await expect(saveDraftCalculation(a)).rejects.toThrow('atomic Free history quota');expect(m.writes).toBe(0);});
