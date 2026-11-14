import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {it,expect} from 'vitest';
import frozenCatalog44 from '../../../docs/milestone100-20261114/retained-catalog44.json';
import newCases from '../../../docs/milestone100-20261114/business-account-cases.json';
import {factoryDeliveryCatalog as liveFactoryDeliveryCatalog} from '@/lib/native-delivery/factory-delivery-catalog';
import {execFileSync} from 'node:child_process';
import {retainedFactoryNineTuples,retainedTechnologyTwentyTuples} from './retained-nine-tuples';

const currentFactoryDeliveryCatalog=Object.freeze(frozenCatalog44);
// Whole frozen25 fixture from the published BASE2 catalog; this never registers a tuple.
const factoryDeliveryCatalog=Object.freeze([
 {catalogId:218,engineId:'launch-square-calculator',slug:'square-calculator',version:1},
 {catalogId:219,engineId:'launch-cube-calculator',slug:'cube-calculator',version:1},
 {catalogId:220,engineId:'launch-square-root-calculator',slug:'square-root-calculator',version:1},
 {catalogId:423,engineId:'conversion.length',slug:'length-converter',version:1},
 {catalogId:430,engineId:'conversion.energy',slug:'energy-converter',version:1},
 {catalogId:431,engineId:'conversion.power',slug:'power-converter',version:1},
 {catalogId:432,engineId:'conversion.time',slug:'time-converter',version:1},
 {catalogId:438,engineId:'conversion.force',slug:'force-converter',version:1},
 {catalogId:440,engineId:'conversion.frequency',slug:'frequency-converter',version:1},
 {catalogId:208,engineId:'launch-percentage-change-calculator',slug:'percentage-change-calculator',version:1},
 {catalogId:209,engineId:'launch-percentage-increase-calculator',slug:'percentage-increase-calculator',version:1},
 {catalogId:210,engineId:'launch-percentage-decrease-calculator',slug:'percentage-decrease-calculator',version:1},
 {catalogId:211,engineId:'launch-ratio-calculator',slug:'ratio-calculator',version:1},
 {catalogId:212,engineId:'launch-proportion-calculator',slug:'proportion-calculator',version:1},
 {catalogId:215,engineId:'launch-fraction-to-decimal-calculator',slug:'fraction-to-decimal-calculator',version:1},
 {catalogId:216,engineId:'launch-average-two-numbers-calculator',slug:'average-two-numbers-calculator',version:1},
 {catalogId:424,engineId:'conversion.area',slug:'area-converter',version:1},
 {catalogId:425,engineId:'conversion.volume',slug:'volume-converter',version:1},
 {catalogId:427,engineId:'conversion.temperature',slug:'temperature-converter',version:1},
 {catalogId:428,engineId:'conversion.speed',slug:'speed-converter',version:1},
 {catalogId:433,engineId:'conversion.angle',slug:'angle-converter',version:1},
 {catalogId:434,engineId:'conversion.data-storage',slug:'data-storage-converter',version:1},
 {catalogId:322,engineId:'physics.capacitance',slug:'capacitance-calculator',version:1},
 {catalogId:325,engineId:'physics.free-fall',slug:'free-fall-calculator',version:1},
 {catalogId:327,engineId:'physics.angular-velocity',slug:'angular-velocity-calculator',version:1},
].map(row=>Object.freeze(row)));
const digest=(source:string|Buffer)=>createHash('sha256').update(source).digest('hex');
const retainedCatalogSource=execFileSync('git',['show','2d5d105892134f8af46fc2a02edd5932c431b845:src/lib/native-delivery/factory-delivery-catalog.ts'],{stdio:['ignore','pipe','pipe']}).toString();
const milestoneNext=readFileSync('docs/milestone60-20261113/held-business-successor.sql','utf8');
const milestoneUndo=readFileSync('docs/milestone60-20261113/held-business-reverse.sql','utf8');
const milestoneResult=JSON.parse(readFileSync('docs/milestone60-20261113/business-sql-result.json','utf8'));
const milestoneAddedIds=[255,256,259,260,261,262,263,264,265,266,267,269,270,271,273,429,436,437,439];
// Literal pre/postimages from the genuine held44 roundtrip receipt65f1010b...; no DB state is invented here.
const milestonePreFunctions=[
 ["factory_native_embed_publication_v1(integer,integer)","96d5e14e77884fc7d64dad571acf499c27245f6a6a736d2cbfe9bee7e4223cd4","{postgres=X/postgres}"],
 ["share_factory_nine_snapshot(uuid,jsonb)","372531e032f647fb38db88455b043d1725f350fb71e321249bb8bee8859cc9bb","{postgres=X/postgres,service_role=X/postgres}"],
 ["submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid)","bdfa1d70803f54fa300fd5c0939c063026d6a06458af1c2b39aec83239ba18b6","{postgres=X/postgres,service_role=X/postgres}"],
 ["technology_five_require_publication_v1(integer,integer)","e62812e6165104554a128223df206bef0ed417fa0be174377557b860e4d7d8bd","{postgres=X/postgres}"],
] as const;
const milestonePostFunctions=[
 ["factory_native_embed_publication_v1(integer,integer)","f4a3a8aa6e32d5aa14019252f672ddbdf7e0bfef87362c1e2d760075991d3ec8","{postgres=X/postgres}"],
 ["share_factory_nine_snapshot(uuid,jsonb)","0a13711b4ab67638056f36d84c6db18cbee5a53bf00b9a795b9b6eefb0590489","{postgres=X/postgres,service_role=X/postgres}"],
 ["submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid)","83a47dbb4ccc1427e6dffad3eac12fdcd290db99859ad176e79b73bef9089b53","{postgres=X/postgres,service_role=X/postgres}"],
 ["technology_five_require_publication_v1(integer,integer)","656de367a1392d7846047c39d841bfe367258ad69970a0a93e86e13e80adac60","{postgres=X/postgres}"],
] as const;
const milestonePreConstraints=[
 ["native_embed_grant_exact_tuple","28a2f23cb0d1f93ab675ada00d037d6375a926494cedcafed76879a9e27d1170"],
 ["native_embed_usage_exact_tuple","28a2f23cb0d1f93ab675ada00d037d6375a926494cedcafed76879a9e27d1170"],
 ["technology_five_jobs_exact_native_tuple_check","b766ae0fe1eb3bad16caf7080c98b88e6f313b372e692efbab0734ced7633c07"],
 ["technology_next_shared_snapshots_calculator_slug_check","25804dcf431303991b9e0434d25b7109d936bb98e87b128e4d7190367d62ae75"],
] as const;
const milestonePostConstraints=[
 ["native_embed_grant_exact_tuple","45adfa87b262b13358a2cc531ac6ec33109308a53c856b4945f90672ce9fe08a"],
 ["native_embed_usage_exact_tuple","45adfa87b262b13358a2cc531ac6ec33109308a53c856b4945f90672ce9fe08a"],
 ["technology_five_jobs_exact_native_tuple_check","3a66ecf3e6f0c4e1f764a68af4918e4cd21d4633aaa3e2a86fe4b0f203a85ec3"],
 ["technology_next_shared_snapshots_calculator_slug_check","63d2e45264ab5ebe0018bad6308da10c415f3e1c9cad12c84ecd5116368d88d4"],
] as const;
const milestoneTableAcl=[
 ["native_embed_grants","{postgres=arwdDxtm/postgres,service_role=ar/postgres}"],
 ["native_embed_usage","{postgres=arwdDxtm/postgres}"],
 ["technology_five_jobs","{postgres=arwdDxtm/postgres}"],
 ["technology_next_shared_snapshots","{postgres=arwdDxtm/postgres,authenticated=r/postgres,service_role=ar/postgres}"],
] as const;
const old=readFileSync('docs/completion-first-20261112/automation/contract-successor.sql','utf8');
const reverse=readFileSync('docs/completion-first-20261112/automation/contract-reverse.sql','utf8');
const next=readFileSync('docs/completion-wave-20261113/held-business-successor.sql','utf8');
const undo=readFileSync('docs/completion-wave-20261113/held-business-reverse.sql','utf8');
const addedIds=[208,209,210,211,212,215,216,322,325,327,424,425,427,428,433,434];
const names=['factory_native_embed_publication_v1','share_factory_nine_snapshot','submit_technology_five_job_v1','technology_five_require_publication_v1'];
function functions(sql:string){
 const matches=[...sql.matchAll(/CREATE OR REPLACE FUNCTION public\.(\w+)\(/g)];
 expect(new Set(matches.map(m=>m[1])).size).toBe(matches.length);
 return Object.fromEntries(matches.map((m,i)=>[m[1],sql.slice(m.index,matches[i+1]?.index??sql.length)]));
}
function sorted<T extends {catalogId:number}>(rows:readonly T[]){return [...rows].sort((a,b)=>a.catalogId-b.catalogId);}
// Parse every entry in a VALUES map. Never filter unknown IDs or deduplicate conflicts.
function values(body:string,columns:string){
 const m=body.match(new RegExp('FROM\\s*\\(VALUES(.*?)\\)t\\('+columns+'\\)','s'));
 expect(m,`missing ${columns} map`).not.toBeNull();
 const entries=[...m![1].matchAll(/\(([^()]*)\)/g)].map(m=>m[1].split(',').map(v=>v.trim()));
 expect(entries.length).toBeGreaterThan(0);
 expect(m![1].replace(/\([^()]*\)/g,'').replace(/[\s,]/g,'')).toBe('');
 const keys=columns.split(',');
 const rows=entries.map(entry=>{expect(entry).toHaveLength(keys.length);return Object.fromEntries(entry.map((value,i)=>[keys[i],value.startsWith("'")?value.slice(1,-1):Number(value)]));});
 expect(new Set(rows.map(row=>row[keys[0]])).size).toBe(rows.length);
 return rows.sort((a,b)=>Number(a[keys[0]])-Number(b[keys[0]]));
}
const publication=(rows:readonly {catalogId:number;engineId:string;slug:string;version:number}[])=>sorted(rows).map(r=>({catalog:r.catalogId,engine:r.engineId,slug:r.slug,version:r.version}));
function assertImageGuards(source:string,images:readonly (readonly [string,string,string])[],constraintImages:readonly (readonly [string,string])[]){
 expect([...source.matchAll(/Exact function preimage differs: (\w+)\(/g)].map(m=>m[1]).sort()).toEqual(names);
 expect(source.match(/proacl::text/g)).toHaveLength(4);expect(source.match(/pg_get_userbyid\(proowner\)/g)).toHaveLength(4);
 for(const [signature,hash,acl] of images){
  const ref="'public."+signature+"'::regprocedure";
  expect(source).toContain(`pg_get_functiondef(${ref}),'UTF8')),'hex') IS DISTINCT FROM '${hash}'`);
  expect(source).toContain(`(SELECT pg_get_userbyid(proowner) FROM pg_proc WHERE oid=${ref}) IS DISTINCT FROM 'postgres'`);
  expect(source).toContain(`(SELECT proacl::text FROM pg_proc WHERE oid=${ref}) IS DISTINCT FROM '${acl}'`);
 }
 expect([...source.matchAll(/Exact constraint preimage differs: (\w+)/g)].map(m=>m[1]).sort()).toEqual(constraintImages.map(([name])=>name).sort());
 for(const [name,hash] of constraintImages)expect(source).toContain(`conname='${name}' AND encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex')='${hash}' AND convalidated=true AND connoinherit=false`);
 expect(source.match(/Exact table owner ACL RLS preimage differs:/g)).toHaveLength(4);
 for(const [table,acl] of milestoneTableAcl)expect(source).toContain(`WHERE oid='public.${table}'::regclass AND pg_get_userbyid(relowner)='postgres' AND relacl::text IS NOT DISTINCT FROM '${acl}' AND relrowsecurity=true AND relforcerowsecurity=false`);
 expect(source).not.toMatch(/DELETE FROM|TRUNCATE|CREATE TABLE|(?:GRANT|REVOKE)\s+(?:EXECUTE|ALL|SELECT|INSERT|UPDATE|DELETE)/i);
}

it('pins both immutable historical SQL files and exact old-nine plus old20 maps without filtering',()=>{
 expect(createHash('sha256').update(old).digest('hex')).toBe('65706ff31b78cb47d8f34d3c8c4f5d228df1314e2d808edade87078db44849f1');
 expect(createHash('sha256').update(reverse).digest('hex')).toBe('3dc8cfb63725abcf2782a6a9afc223c830411836706f28ee225896b477041654');
 const f=functions(old),retained=[...retainedTechnologyTwentyTuples,...retainedFactoryNineTuples];
 expect(values(f.technology_five_require_publication_v1,'catalog,engine,slug,version')).toEqual(publication(retained));
 expect(values(f.submit_technology_five_job_v1,'id,engine')).toEqual(sorted(retained).map(r=>({id:r.catalogId,engine:r.engineId})));
 expect(retainedTechnologyTwentyTuples).toHaveLength(20);expect(retainedFactoryNineTuples).toHaveLength(9);
 expect(retainedTechnologyTwentyTuples.find(r=>r.catalogId===383)?.version).toBe(2);
 expect(digest(retainedCatalogSource)).toBe('53875801eabe03375245190b2bdd4cfe8dca27283c5a65af8899b5f93f0c45d7');
 const frozenRows=[...retainedCatalogSource.matchAll(/\{catalogId:(\d+),engineId:'([^']+)',slug:'([^']+)',version:(\d+)\}/g)].map(m=>({catalogId:Number(m[1]),engineId:m[2],slug:m[3],version:Number(m[4])}));expect(frozenRows).toEqual(factoryDeliveryCatalog);
 expect(digest(next)).toBe('deb431b7e21a194e27f66e3b3ea06e575a8fe057ea739cb487403302b19ee8a8');expect(digest(undo)).toBe('169858355922c76cac0bb98b91d7bd9ece4883878f07a20d53739b80a826f02b');
 expect(digest(milestoneNext)).toBe('487113fa011516c89146ccf001368d69a9fc832f1aec0dda4e086664b401dbe9');expect(digest(milestoneUndo)).toBe('8d9027f3a0a47dd8fe4a8b1e0c13e64cb44951b608c775cd304f52f467791036');
 expect(digest(execFileSync('git',['show','eac9a6c23ae4d8f1abb607e32f57ce0d422a3cb8:src/lib/native-delivery/factory-delivery-catalog.ts']))).toBe('171aa03828ca3adb5880123d0c303ca6b98d598c70ab906baef3c59ef5ed61c9');
 expect(milestoneResult).toMatchObject({passed:true,kind:'MILESTONE60_HELD_BUSINESS_SQL_EXACT_ROUNDTRIP',sourceSHA256:digest(milestoneNext),reverseSHA256:digest(milestoneUndo),receiptSHA256:'65f1010b854e09efb85b9a3f7ebf83102b262dcba20de72eb5daa39d8d5e7ee2',productionWrites:false,releaseHold:true});

});
it('checks each new function map independently: exact25, exact16 additions and all original20',()=>{
 expect(factoryDeliveryCatalog).toHaveLength(25);
 expect(sorted(factoryDeliveryCatalog).filter(r=>!retainedFactoryNineTuples.some(old=>old.catalogId===r.catalogId)).map(r=>r.catalogId)).toEqual(addedIds);
 for(const row of retainedFactoryNineTuples)expect(factoryDeliveryCatalog).toContainEqual(row);
 expect(factoryDeliveryCatalog.some(r=>r.catalogId===323||r.catalogId===324)).toBe(false);
 const f=functions(next);expect(Object.keys(f).sort()).toEqual(names);
 const all=[...retainedTechnologyTwentyTuples,...factoryDeliveryCatalog];
 expect(values(f.factory_native_embed_publication_v1,'catalog,engine,slug')).toEqual(publication(factoryDeliveryCatalog).map(({version,...r})=>r));
 expect(f.factory_native_embed_publication_v1).toContain('p_version IS DISTINCT FROM 1');
 expect(values(f.submit_technology_five_job_v1,'id,engine')).toEqual(sorted(all).map(r=>({id:r.catalogId,engine:r.engineId})));
 expect(values(f.technology_five_require_publication_v1,'catalog,engine,slug,version')).toEqual(publication(all));
 const slugs=f.share_factory_nine_snapshot.match(/item->>'calculatorSlug' NOT IN\(([^)]*)\)/)![1].split(',').map(v=>v.trim().slice(1,-1));
 expect(slugs.sort()).toEqual(factoryDeliveryCatalog.map(r=>r.slug).sort());
 expect(f.share_factory_nine_snapshot).toContain("item->'calculatorVersion' IS DISTINCT FROM '1'::jsonb");
 expect(currentFactoryDeliveryCatalog).toHaveLength(44);expect(new Set(currentFactoryDeliveryCatalog.map(row=>row.catalogId)).size).toBe(44);
 for(const row of factoryDeliveryCatalog)expect(currentFactoryDeliveryCatalog).toContainEqual(row);
 expect(sorted(currentFactoryDeliveryCatalog).filter(row=>!factoryDeliveryCatalog.some(old=>old.catalogId===row.catalogId)).map(row=>row.catalogId)).toEqual(milestoneAddedIds);
 expect(currentFactoryDeliveryCatalog.some(row=>[323,324,435,441].includes(row.catalogId))).toBe(false);
 expect(milestoneResult.catalogIds).toEqual(currentFactoryDeliveryCatalog.map(row=>row.catalogId));
 const current=functions(milestoneNext),complete=[...retainedTechnologyTwentyTuples,...currentFactoryDeliveryCatalog];expect(Object.keys(current).sort()).toEqual(names);
 expect(values(current.factory_native_embed_publication_v1,'catalog,engine,slug')).toEqual(publication(currentFactoryDeliveryCatalog).map(({version,...row})=>row));expect(current.factory_native_embed_publication_v1).toContain('p_version IS DISTINCT FROM 1');
 expect(values(current.submit_technology_five_job_v1,'id,engine')).toEqual(sorted(complete).map(row=>({id:row.catalogId,engine:row.engineId})));
 expect(values(current.technology_five_require_publication_v1,'catalog,engine,slug,version')).toEqual(publication(complete));
 const currentSlugs=current.share_factory_nine_snapshot.match(/item->>'calculatorSlug' NOT IN\(([^)]*)\)/)![1].split(',').map(value=>value.trim().slice(1,-1));expect(currentSlugs.sort()).toEqual(currentFactoryDeliveryCatalog.map(row=>row.slug).sort());expect(current.share_factory_nine_snapshot).toContain("item->'calculatorVersion' IS DISTINCT FROM '1'::jsonb");

});
it('retains unchanged dispatch bindings in pinned predecessor and preserves modified submit controls',()=>{
 const dispatch=functions(old).check_technology_five_dispatch_v1;
 for(const clause of ['d.payload_text::jsonb=d.payload',"j.payload->'rows'=j.input_rows","j.payload->'catalogId'=to_jsonb(j.catalog_id)","j.payload->'version'=to_jsonb(j.technical_version)"])expect(dispatch).toContain(clause);
 expect(Object.keys(functions(next))).not.toContain('check_technology_five_dispatch_v1');
 expect(Object.keys(functions(next)).some(name=>name.startsWith('claim_'))).toBe(false);
 for(const control of ['public.consume_native_business_api_quota_v1(p_api_key_id)','public.technology_five_key_authority_v1','INSERT INTO public.technology_five_webhook_outbox'])expect(functions(next).submit_technology_five_job_v1).toContain(control);
 expect(Object.keys(functions(milestoneNext))).not.toContain('check_technology_five_dispatch_v1');expect(Object.keys(functions(milestoneNext)).some(name=>name.startsWith('claim_'))).toBe(false);
 for(const control of ['public.consume_native_business_api_quota_v1(p_api_key_id)','public.technology_five_key_authority_v1','INSERT INTO public.technology_five_webhook_outbox'])expect(functions(milestoneNext).submit_technology_five_job_v1).toContain(control);

});
it('retains forward/reverse holds, four exact function/constraint preimages and non-destructive reverse',()=>{
 expect(next).toContain("RAISE EXCEPTION 'UNAPPLIED_COMPLETION_WAVE_BUSINESS_SUCCESSOR'");
 expect(undo).toContain("RAISE EXCEPTION 'UNAPPLIED_COMPLETION_WAVE_BUSINESS_REVERSE'");
 const constraints=['native_embed_grant_exact_tuple','native_embed_usage_exact_tuple','technology_five_jobs_exact_native_tuple_check','technology_next_shared_snapshots_calculator_slug_check'];
 for(const source of [next,undo]){
  expect([...source.matchAll(/Exact function preimage differs: (\w+)\(/g)].map(m=>m[1]).sort()).toEqual(names);
  expect([...source.matchAll(/Exact constraint preimage differs: (\w+)/g)].map(m=>m[1]).sort()).toEqual(constraints.sort());
  expect(source.match(/IF encode\(sha256\(convert_to\(pg_get_functiondef/g)).toHaveLength(4);
  expect(source.match(/proacl::text/g)).toHaveLength(4);expect(source.match(/pg_get_userbyid\(proowner\)/g)).toHaveLength(4);
  expect(source).not.toMatch(/DELETE FROM|TRUNCATE|CREATE TABLE/);
 }
 expect(undo).toContain('Wave durable evidence prevents reverse; no audit deletion authorized');
 const rowGuard=undo.match(/DO \$rows\$([\s\S]*?)END \$rows\$/)![1];
 for(const table of ['native_embed_grants','native_embed_usage','technology_five_jobs']){
  const ids=rowGuard.match(new RegExp('FROM public\\.'+table+' WHERE catalog_id IN\\(([^)]*)\\)'))![1].split(',').map(Number).sort((a,b)=>a-b);
  expect(ids).toEqual(addedIds);
 }
 expect(rowGuard).toContain('FROM public.technology_next_shared_snapshots WHERE calculator_slug IN(');
 expect(milestoneNext).toContain("RAISE EXCEPTION 'UNAPPLIED_MILESTONE60_BUSINESS_SUCCESSOR'");expect(milestoneUndo).toContain("RAISE EXCEPTION 'UNAPPLIED_MILESTONE60_BUSINESS_REVERSE'");
 assertImageGuards(milestoneNext,milestonePreFunctions,milestonePreConstraints);assertImageGuards(milestoneUndo,milestonePostFunctions,milestonePostConstraints);
 for(const source of [milestoneNext,milestoneUndo]){expect(source).toContain("SET LOCAL lock_timeout='3s'");expect(source).toContain("SET LOCAL statement_timeout='30s'");expect(source).toContain('Reviewed postgres operator and READ COMMITTED required');expect(source).toContain('IN SHARE ROW EXCLUSIVE MODE');}
 expect(milestoneUndo).toContain('Milestone60 durable evidence prevents reverse; no audit deletion authorized');
 const currentRows=milestoneUndo.match(/DO \$rows\$([\s\S]*?)END \$rows\$/)![1];
 for(const table of ['native_embed_grants','native_embed_usage','technology_five_jobs'])expect(currentRows.match(new RegExp(String.raw`FROM public\.${table} WHERE catalog_id IN\(([^)]*)\)`))![1].split(',').map(Number).sort((a,b)=>a-b)).toEqual(milestoneAddedIds);
 const currentAdditions=currentFactoryDeliveryCatalog.filter(row=>milestoneAddedIds.includes(row.catalogId));expect(currentRows.match(/FROM public\.technology_next_shared_snapshots WHERE calculator_slug IN\(([^)]*)\)/)![1].split(',').map(value=>value.trim().slice(1,-1)).sort()).toEqual(currentAdditions.map(row=>row.slug).sort());
 const restored=functions(milestoneUndo),retained=[...retainedTechnologyTwentyTuples,...factoryDeliveryCatalog];expect(Object.keys(restored).sort()).toEqual(names);
 expect(values(restored.factory_native_embed_publication_v1,'catalog,engine,slug')).toEqual(publication(factoryDeliveryCatalog).map(({version,...row})=>row));expect(values(restored.submit_technology_five_job_v1,'id,engine')).toEqual(sorted(retained).map(row=>({id:row.catalogId,engine:row.engineId})));expect(values(restored.technology_five_require_publication_v1,'catalog,engine,slug,version')).toEqual(publication(retained));
 for(const name of names){const pattern=new RegExp(String.raw`CREATE OR REPLACE FUNCTION public\.${name}\([\s\S]*?\$function\$[\s\S]*?\$function\$`);const original=next.match(pattern),restoration=milestoneUndo.match(pattern);expect(original).not.toBeNull();expect(restoration?.[0]).toBe(original?.[0]);}
 for(const name of constraints){const pattern=new RegExp(String.raw`ALTER TABLE public\.\w+ ADD CONSTRAINT ${name} [^;]+;`);const original=next.match(pattern),restoration=milestoneUndo.match(pattern);expect(original).not.toBeNull();expect(restoration?.[0]).toBe(original?.[0]);}

});
it('parser refuses duplicate or conflicting IDs and exposes unknown tuple additions',()=>{
 expect(()=>values("FROM(VALUES(218,'a'),(218,'b'))t(id,engine)",'id,engine')).toThrow();
 expect(values("FROM(VALUES(999,'unknown'))t(id,engine)",'id,engine')).toEqual([{id:999,engine:'unknown'}]);
});

it('closes the entire current roster against literal44 plus all25 exact successor witnesses without filtering',()=>{
 expect(liveFactoryDeliveryCatalog).toEqual([...currentFactoryDeliveryCatalog,...newCases.map(row=>({catalogId:row.id,engineId:row.engine,slug:row.slug,version:row.version}))]);expect(liveFactoryDeliveryCatalog).toHaveLength(69);expect(new Set(liveFactoryDeliveryCatalog.map(row=>row.catalogId)).size).toBe(69);
 const sql=functions(readFileSync('docs/milestone100-20261114/business-held-successor.sql','utf8')),complete=[...retainedTechnologyTwentyTuples,...liveFactoryDeliveryCatalog];
 expect(values(sql.factory_native_embed_publication_v1,'catalog,engine,slug')).toEqual(publication(liveFactoryDeliveryCatalog).map(({version,...row})=>row));expect(values(sql.submit_technology_five_job_v1,'id,engine')).toEqual(sorted(complete).map(row=>({id:row.catalogId,engine:row.engineId})));expect(values(sql.technology_five_require_publication_v1,'catalog,engine,slug,version')).toEqual(publication(complete));
});
