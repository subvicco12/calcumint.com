import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {it,expect} from 'vitest';
import {factoryDeliveryCatalog} from '@/lib/native-delivery/factory-delivery-catalog';
import {retainedFactoryNineTuples,retainedTechnologyTwentyTuples} from './retained-nine-tuples';
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
it('pins both immutable historical SQL files and exact old-nine plus old20 maps without filtering',()=>{
 expect(createHash('sha256').update(old).digest('hex')).toBe('65706ff31b78cb47d8f34d3c8c4f5d228df1314e2d808edade87078db44849f1');
 expect(createHash('sha256').update(reverse).digest('hex')).toBe('3dc8cfb63725abcf2782a6a9afc223c830411836706f28ee225896b477041654');
 const f=functions(old),retained=[...retainedTechnologyTwentyTuples,...retainedFactoryNineTuples];
 expect(values(f.technology_five_require_publication_v1,'catalog,engine,slug,version')).toEqual(publication(retained));
 expect(values(f.submit_technology_five_job_v1,'id,engine')).toEqual(sorted(retained).map(r=>({id:r.catalogId,engine:r.engineId})));
 expect(retainedTechnologyTwentyTuples).toHaveLength(20);expect(retainedFactoryNineTuples).toHaveLength(9);
 expect(retainedTechnologyTwentyTuples.find(r=>r.catalogId===383)?.version).toBe(2);
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
});
it('retains unchanged dispatch bindings in pinned predecessor and preserves modified submit controls',()=>{
 const dispatch=functions(old).check_technology_five_dispatch_v1;
 for(const clause of ['d.payload_text::jsonb=d.payload',"j.payload->'rows'=j.input_rows","j.payload->'catalogId'=to_jsonb(j.catalog_id)","j.payload->'version'=to_jsonb(j.technical_version)"])expect(dispatch).toContain(clause);
 expect(Object.keys(functions(next))).not.toContain('check_technology_five_dispatch_v1');
 expect(Object.keys(functions(next)).some(name=>name.startsWith('claim_'))).toBe(false);
 for(const control of ['public.consume_native_business_api_quota_v1(p_api_key_id)','public.technology_five_key_authority_v1','INSERT INTO public.technology_five_webhook_outbox'])expect(functions(next).submit_technology_five_job_v1).toContain(control);
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
});
it('parser refuses duplicate or conflicting IDs and exposes unknown tuple additions',()=>{
 expect(()=>values("FROM(VALUES(218,'a'),(218,'b'))t(id,engine)",'id,engine')).toThrow();
 expect(values("FROM(VALUES(999,'unknown'))t(id,engine)",'id,engine')).toEqual([{id:999,engine:'unknown'}]);
});
