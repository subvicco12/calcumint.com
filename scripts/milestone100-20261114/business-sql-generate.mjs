import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const digest=x=>createHash('sha256').update(x).digest('hex');
const q=x=>"'"+String(x).replaceAll("'","''")+"'";
export const signatures=['factory_native_embed_publication_v1(integer,integer)','submit_technology_five_job_v1(uuid,text,uuid,uuid,integer,integer,jsonb,jsonb,uuid)','technology_five_require_publication_v1(integer,integer)','share_factory_nine_snapshot(uuid,jsonb)'];
export const tables=['native_embed_grants','native_embed_usage','technology_five_jobs','technology_next_shared_snapshots'];
export const metadataQuery=`SELECT jsonb_build_object('rows',(SELECT jsonb_agg(jsonb_build_object('signature',p.oid::regprocedure::text,'definition',pg_get_functiondef(p.oid),'sha256',encode(sha256(convert_to(pg_get_functiondef(p.oid),'UTF8')),'hex'),'owner',pg_get_userbyid(p.proowner),'acl',p.proacl::text) ORDER BY p.oid::regprocedure::text) FROM pg_proc p WHERE p.oid IN(${signatures.map(s=>q('public.'+s)+'::regprocedure').join(',')})),'constraints',(SELECT jsonb_agg(jsonb_build_object('table',conrelid::regclass::text,'name',conname,'definition',pg_get_constraintdef(oid),'validated',convalidated,'noInherit',connoinherit) ORDER BY conname) FROM pg_constraint WHERE conname IN('native_embed_grant_exact_tuple','native_embed_usage_exact_tuple','technology_five_jobs_exact_native_tuple_check','technology_next_shared_snapshots_calculator_slug_check') AND connamespace='public'::regnamespace),'tables',(SELECT jsonb_agg(jsonb_build_object('table',relname,'owner',pg_get_userbyid(relowner),'acl',relacl::text,'rls',relrowsecurity,'forceRls',relforcerowsecurity) ORDER BY relname) FROM pg_class WHERE relnamespace='public'::regnamespace AND relname IN(${tables.map(q).join(',')})));`;
const tableName=x=>x.replace(/^public\./,'');
export function assertPredecessor(captured,authentic){
 assert.equal(captured.rows.length,4);assert.equal(captured.constraints.length,4);assert.equal(captured.tables.length,4);
 for(const row of authentic.rows){const got=captured.rows.find(x=>x.signature===row.signature);assert(got);for(const k of ['definition','sha256','owner','acl'])assert.equal(got[k],row[k],row.signature+' '+k);}
 for(const row of authentic.constraints){const got=captured.constraints.find(x=>x.name===row.name&&tableName(x.table)===tableName(row.table));assert(got);assert.equal(got.definition,row.definition);assert.equal(got.validated,true);}
}
function guard(metadata){
 const lines=[];
 for(const row of metadata.rows)lines.push(`IF encode(sha256(convert_to(pg_get_functiondef(${q('public.'+row.signature)}::regprocedure),'UTF8')),'hex') IS DISTINCT FROM ${q(row.sha256)} OR (SELECT pg_get_userbyid(proowner) FROM pg_proc WHERE oid=${q('public.'+row.signature)}::regprocedure) IS DISTINCT FROM ${q(row.owner)} OR (SELECT proacl::text FROM pg_proc WHERE oid=${q('public.'+row.signature)}::regprocedure) IS DISTINCT FROM ${row.acl===null?'NULL':q(row.acl)} THEN RAISE EXCEPTION ${q('Exact function preimage differs: '+row.signature)}; END IF;`);
 for(const c of metadata.constraints)lines.push(`IF NOT EXISTS(SELECT FROM pg_constraint WHERE conrelid=${q('public.'+tableName(c.table))}::regclass AND conname=${q(c.name)} AND encode(sha256(convert_to(pg_get_constraintdef(oid),'UTF8')),'hex')=${q(digest(c.definition))} AND convalidated=${c.validated} AND connoinherit=${c.noInherit}) THEN RAISE EXCEPTION ${q('Exact constraint preimage differs: '+c.name)}; END IF;`);
 for(const t of metadata.tables)lines.push(`IF NOT EXISTS(SELECT FROM pg_class WHERE oid=${q('public.'+t.table)}::regclass AND pg_get_userbyid(relowner)=${q(t.owner)} AND relacl::text IS NOT DISTINCT FROM ${t.acl===null?'NULL':q(t.acl)} AND relrowsecurity=${t.rls} AND relforcerowsecurity=${t.forceRls}) THEN RAISE EXCEPTION ${q('Exact table owner ACL RLS preimage differs: '+t.table)}; END IF;`);
 return 'DO $pre$ BEGIN\n'+lines.join('\n')+'\nEND $pre$;\n';
}
function header(direction){return `-- HELD source-bound engineering fixture only; no production adoption or publication authority.\nBEGIN;\nDO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_MILESTONE100_BUSINESS_${direction}'; END $hold$;\nSET LOCAL lock_timeout='3s'; SET LOCAL statement_timeout='30s';\nDO $operator$ BEGIN IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed postgres operator and READ COMMITTED required'; END IF; END $operator$;\nLOCK TABLE ${tables.map(t=>'public.'+t).join(',')} IN SHARE ROW EXCLUSIVE MODE;\n`;}
export function additionsFor(pre,tuples){
 const embed=pre.rows.find(r=>r.signature===signatures[0]).definition;
 const old=[...embed.matchAll(/\((\d+),'([^']+)','([^']+)'\)/g)].map(m=>({catalogId:Number(m[1]),engineId:m[2],slug:m[3],version:1}));
 assert.equal(old.length,44);assert(tuples.length>44,'Wait for frozen expanded delivery catalog');
 for(const t of old)assert(tuples.some(x=>JSON.stringify(x)===JSON.stringify(t)||x.catalogId===t.catalogId&&x.engineId===t.engineId&&x.slug===t.slug&&x.version===t.version));
 const additions=tuples.filter(t=>!old.some(x=>x.catalogId===t.catalogId));assert.equal(additions.length,tuples.length-44);
 assert.equal(new Set(tuples.map(t=>t.catalogId)).size,tuples.length);for(const t of tuples)assert.equal(t.version,1);
 return additions;
}
export function forwardSQL(pre,tuples){
 const additions=additionsFor(pre,tuples),ids=additions.map(t=>t.catalogId);assert(!ids.includes(435)&&!ids.includes(441));
 let sql=header('SUCCESSOR')+guard(pre);
 const condition=additions.map(t=>`(catalog_id=${t.catalogId} AND engine_id=${q(t.engineId)} AND technical_version=${t.version})`).join(' OR ');
 for(const c of pre.constraints){const extra=c.name==='technology_next_shared_snapshots_calculator_slug_check'?`calculator_slug IN(${additions.map(t=>q(t.slug)).join(',')})`:condition;sql+=`ALTER TABLE public.${tableName(c.table)} DROP CONSTRAINT ${c.name};\nALTER TABLE public.${tableName(c.table)} ADD CONSTRAINT ${c.name} CHECK (${c.definition.replace(/^CHECK /,'')} OR (${extra}));\n`;}
 for(const row of pre.rows){let d=row.definition;
  if(row.signature===signatures[0]){assert.equal(d.split(')t(catalog,engine,slug)').length,2);d=d.replace(')t(catalog,engine,slug)',','+additions.map(t=>`(${t.catalogId},${q(t.engineId)},${q(t.slug)})`).join(',')+')t(catalog,engine,slug)');}
  if(row.signature===signatures[1]){assert.equal(d.split(')t(id,engine)').length,2);d=d.replace(')t(id,engine)',','+additions.map(t=>`(${t.catalogId},${q(t.engineId)})`).join(',')+')t(id,engine)');}
  if(row.signature===signatures[2]){assert.equal(d.split(')t(catalog,engine,slug,version)').length,2);d=d.replace(')t(catalog,engine,slug,version)',','+additions.map(t=>`(${t.catalogId},${q(t.engineId)},${q(t.slug)},${t.version})`).join(',')+')t(catalog,engine,slug,version)');}
  if(row.signature===signatures[3]){const pattern=/(item->>'calculatorSlug' NOT IN\()([^\n]+)(\))/;assert(pattern.test(d));d=d.replace(pattern,(_m,a,b,c)=>a+b+','+additions.map(t=>q(t.slug)).join(',')+c);}
  assert.notEqual(d,row.definition);sql+=d+';\n';
 }
 return sql+'COMMIT;\n';
}
export function reverseSQL(pre,post,tuples,restoreStatements){
 const additions=additionsFor(pre,tuples);let sql=header('REVERSE')+guard(post);
 sql+=`DO $rows$ BEGIN IF ${tables.map(t=>`EXISTS(SELECT FROM public.${t} WHERE ${t==='technology_next_shared_snapshots'?'calculator_slug IN('+additions.map(x=>q(x.slug)).join(',')+')':'catalog_id IN('+additions.map(x=>x.catalogId).join(',')+')'})`).join(' OR ')} THEN RAISE EXCEPTION 'Milestone100 durable evidence prevents reverse; no audit deletion authorized'; END IF; END $rows$;\n`;
 for(const c of pre.constraints){assert(restoreStatements[c.name]);sql+=`ALTER TABLE public.${tableName(c.table)} DROP CONSTRAINT ${c.name};\n${restoreStatements[c.name]};\n`;}
 for(const row of pre.rows)sql+=row.definition+';\n';return sql+'COMMIT;\n';
}
