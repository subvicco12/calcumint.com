import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeTargetShape} from '../adoption1528/initializer.mjs';
import {snapshot,prepareApply,prepareRollback,bindExpectedPostimage} from '../adoption1528/bundle.mjs';
import {packageSnapshot,packageApply,packageReverse} from '../publication540-shared/database-package.mjs';
import {combinedRuntime} from '../adoption1528/runtime.mjs';
import {tables} from '../adoption1528/catalog.mjs';
import {compose,root,hash} from '../../scripts/adoption1535/package.mjs';
// This module owns its disposable genuine fixture. It accepts no caller connection.
const open=s=>s.replace(/^DO \$hold\$ BEGIN RAISE EXCEPTION '[^']+'; END \$hold\$;$/m,'-- disposable fixture copy only');
const startedAt=new Date().toISOString(),startedMs=Date.now();
const checks=[],pass=x=>{checks.push(x);console.log('PASS '+x);};let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeTargetShape});
 const packageSQL=await readFile(root+'docs/adoption1535/package/guarded-target-apply.sql','utf8')+await readFile(root+'docs/adoption1535/package/guarded-target-reverse.sql','utf8');assert(!/\b(?:CREATE|DROP)\s+EXTENSION\b/i.test(packageSQL));
 const hookRows=JSON.parse(await readFile(root+'docs/adoption1535/evidence/pgrst-hooks.json','utf8'));
 const hookPins={pgrst_ddl_watch:'2b4b5d702ddf70fbd1a05c9825f9f9016d5c0ef97dd3df5f5b012ea23d9b94b1',pgrst_drop_watch:'3a2696133853e17a0456cbfbb233a03815f50895492143e84df983b558d76593'};
 assert.equal(hookRows.length,2);for(const h of hookRows){assert.equal(h.read_only,'on');assert.equal(hash(h.definition),hookPins[h.proname]);}
 const provider=JSON.parse(await readFile(root+'docs/adoption1535/evidence/provider-hooks.json','utf8'));
 assert.equal(provider.provider_event_hooks.length,6);assert(provider.provider_event_hooks.filter(h=>!Object.hasOwn(hookPins,h.name)).every(h=>h.tags.length===1&&['CREATE EXTENSION','DROP EXTENSION'].includes(h.tags[0])));
 await db.sql('CREATE ROLE supabase_admin SUPERUSER; CREATE SCHEMA extensions AUTHORIZATION supabase_admin;'+hookRows.map(h=>h.definition+';ALTER FUNCTION extensions.'+h.proname+'() OWNER TO supabase_admin;').join('\n')+"CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end EXECUTE FUNCTION extensions.pgrst_ddl_watch();ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop EXECUTE FUNCTION extensions.pgrst_drop_watch();ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;");
 const hooks=()=>db.sql("SELECT jsonb_build_object('events',(SELECT jsonb_agg(jsonb_build_object('name',e.evtname,'owner',pg_get_userbyid(e.evtowner),'event',e.evtevent,'enabled',e.evtenabled,'tags',e.evttags,'function',e.evtfoid::regprocedure::text) ORDER BY e.evtname) FROM pg_event_trigger e),'functions',(SELECT jsonb_agg(jsonb_build_object('name',p.proname,'owner',pg_get_userbyid(p.proowner),'definition',pg_get_functiondef(p.oid),'acl',p.proacl::text,'securityDefiner',p.prosecdef) ORDER BY p.proname) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='extensions'));");
 const hooksBefore=await hooks();pass('Exact captured provider hook bodies and event registrations installed before core; extension-only hook tags do not match package DDL');
 const before=await snapshot(db.sql),core=await prepareApply(before);
 await db.sql(open(core.sql));const coreAfter=await snapshot(db.sql),p0=await packageSnapshot(db.sql);
 const successor=await readFile(root+'docs/publication540-shared/database/guarded-successor.sql','utf8');await db.sql(open(successor));const p1=await packageSnapshot(db.sql);
 const addonApply=await packageApply(p0,p1),addonReverse=packageReverse(p0,p1),coreApply=bindExpectedPostimage(core,coreAfter).sql,coreReverse=prepareRollback(before,coreAfter).sql;
 await db.sql(open(addonReverse));await db.sql(open(coreReverse));
 const apply=compose(coreApply,addonApply,'APPLY'),reverse=compose(addonReverse,coreReverse,'REVERSE'),a=open(apply),r=open(reverse);
 const exact=async expected=>{assert.equal((await packageSnapshot(db.sql)).sha256,expected.sha256);assert.equal(await hooks(),hooksBefore);};
 const initial=await packageSnapshot(db.sql);
 const absent=async()=>{const response=await fetch(db.url+'/rest/v1/rpc/publish_calculator_batch_with_audit_v1',{method:'POST',headers:{apikey:db.anonKey,Authorization:'Bearer '+db.anonKey,'Content-Type':'application/json'},body:JSON.stringify({p_items:[]})});return {status:response.status,body:await response.json()};};
 let cold;for(let i=0;i<100;i++){cold=await absent();if(cold.status===404&&cold.body.code==='PGRST202')break;await new Promise(resolve=>setTimeout(resolve,50));}assert.equal(cold.status,404);assert.equal(cold.body.code,'PGRST202');pass('Cold PostgREST cache confirms addon absent after automatic drop callback before composed adoption');
 await assert.rejects(db.sql(apply),/UNAPPLIED_ADOPTION1535/);await db.sql('\\set ON_ERROR_STOP off\n'+apply+'\n\\set ON_ERROR_STOP on');await exact(initial);pass('Default unconditional hold aborts transaction even when client continues');
 await assert.rejects(db.sql('BEGIN ISOLATION LEVEL REPEATABLE READ;'+a),/READ COMMITTED/);await assert.rejects(db.sql('SET ROLE authenticated;'+a),/postgres owner/);await exact(initial);pass('Operator and isolation context refuse');
 const drifts=[['ALTER TABLE public.calculator_bulk_jobs ADD COLUMN adoption1535_drift integer;','ALTER TABLE public.calculator_bulk_jobs DROP COLUMN adoption1535_drift;'],['CREATE FUNCTION public.publish_calculator_batch_with_audit_v1(text) RETURNS integer LANGUAGE sql AS $$ SELECT 0 $$;','DROP FUNCTION public.publish_calculator_batch_with_audit_v1(text);'],['REVOKE EXECUTE ON FUNCTION auth.uid() FROM PUBLIC;','GRANT EXECUTE ON FUNCTION auth.uid() TO PUBLIC;']];
 for(const [change,undo] of drifts){await db.sql(change);await assert.rejects(db.sql(a),/EXACT_METADATA/);await db.sql(undo);await exact(initial);}pass('Column, every addon overload and provider ACL drift refuse without partial core adoption');
 await assert.rejects(db.sql(a.replace('-- SECOND CONSTITUENT','SELECT 1/0;\n-- SECOND CONSTITUENT')),/division by zero/);await exact(initial);
 await assert.rejects(db.sql(a.replace(/COMMIT;\s*$/,'SELECT 1/0; COMMIT;')),/division by zero/);await exact(initial);const afterAbortedDDL=await absent();assert.equal(afterAbortedDDL.status,404);assert.equal(afterAbortedDDL.body.code,'PGRST202');pass('Failure after core and after addon rolls back entire composition; transactional hook notifications expose no aborted RPC');
 await db.sql(a);await exact(p1);await assert.rejects(db.sql(a),/EXACT_METADATA/);pass('Complete postimage exact and duplicate application refused');
 const signup=await fetch(db.url+'/auth/v1/signup',{method:'POST',headers:{apikey:db.anonKey,'Content-Type':'application/json'},body:JSON.stringify({email:'provider-discovery@example.invalid',password:'Synthetic-fixture-pass-123!'})});assert.equal(signup.status,200);const probe=await signup.json();await db.sql(`INSERT INTO public.platform_admins(user_id,role) VALUES('${probe.user.id}','owner');`);
 const discover=async()=>{const response=await fetch(db.url+'/rest/v1/rpc/publish_calculator_batch_with_audit_v1',{method:'POST',headers:{apikey:db.anonKey,Authorization:'Bearer '+probe.access_token,'Content-Type':'application/json'},body:JSON.stringify({p_items:[]})});return {status:response.status,body:await response.json()};};
 let discovered;for(let i=0;i<100;i++){discovered=await discover();if(discovered.status!==404)break;await new Promise(resolve=>setTimeout(resolve,50));}assert.notEqual(discovered.status,404,JSON.stringify(discovered));assert.equal(discovered.status,400,JSON.stringify(discovered));assert.notEqual(discovered.body.code,'PGRST202');pass('Committed composed DDL automatically discovers new atomic RPC through exact provider NOTIFY hooks with genuine owner JWT and no manual reload');
 // Existing core runtime helper requests a manual reload. Suppress only that exact request;
 // all RPC discovery and runtime requests now depend on captured provider callbacks.
 let suppressedReloads=0;const runtimeDb={...db,sql:async q=>{if(q==="NOTIFY pgrst, 'reload schema';"){suppressedReloads++;return '';}return db.sql(q);}};
 await combinedRuntime(runtimeDb,pass);assert.equal(suppressedReloads,1);pass('Core genuine JWT runtime succeeds without manual schema-cache signaling');
 const rows=()=>db.sql(`SELECT jsonb_build_array(${tables.map(t=>`(SELECT jsonb_agg(to_jsonb(r) ORDER BY to_jsonb(r)::text) FROM public.${t} r)`).join(',')});`),retained=await rows();
 await assert.rejects(db.sql(reverse),/UNAPPLIED_ADOPTION1535/);await exact(p1);
 await assert.rejects(db.sql(r.replace(/COMMIT;\s*$/,'SELECT 1/0; COMMIT;')),/division by zero/);await exact(p1);assert.equal(await rows(),retained);pass('Late reverse failure restores complete core plus addon postimage and every row');
 await db.sql('GRANT EXECUTE ON FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb) TO anon;');await assert.rejects(db.sql(r),/EXACT_METADATA/);await db.sql('REVOKE EXECUTE ON FUNCTION public.publish_calculator_batch_with_audit_v1(jsonb) FROM anon;');await exact(p1);pass('Reverse rejects addon ACL drift');
 await db.sql(r);await exact(initial);assert.equal(await rows(),retained);await assert.rejects(db.sql(r),/EXACT_METADATA/);await db.sql(a);await exact(p1);assert.equal(await rows(),retained);await db.sql(r);await exact(initial);assert.equal(await rows(),retained);pass('Whole reversal, reapplication and recovery preserve all209 synthetic published rows and all application rows');
 await writeFile(root+'docs/adoption1535/package/rehearsal.json',JSON.stringify({passed:true,startedAt,finishedAt:new Date().toISOString(),durationMs:Date.now()-startedMs,checks,activationAuthorized:false,productionWrites:false,formalAcceptance:false,syntheticPublished:209,localPreimage:initial.sha256,localPostimage:p1.sha256,localApplySHA256:hash(apply),localReverseSHA256:hash(reverse),providerHooks:{bodySHA256:hookPins,unchangedThroughEveryTransition:true,coldCacheBeforeComposition:cold,abortedDDLCache:afterAbortedDDL,automaticRPCDiscovery:discovered,manualReloadsSuppressed:suppressedReloads,localRole:'supabase_admin SUPERUSER created only in fixture; target role attributes not reproduced',excludedHooks:'Four extension-only callbacks are not invoked or reconstructed; package performs no extension operations'},provenance:db.provenance},null,2)+'\n');
}finally{if(db)await db.close();}
