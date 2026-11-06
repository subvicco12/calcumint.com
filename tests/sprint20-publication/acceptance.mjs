// Local-only PG17.6 / genuine GoTrue / PostgREST fixture; never reads production env.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
const proposalPath='docs/sprint20-publication/guarded/prepare-catalog-inventory-drafts.sql';
const predecessor=await readFile('supabase/migrations/035_atomic_catalog_creation.sql','utf8');
assert.equal(createHash('sha256').update(predecessor).digest('hex'),'426de9383b1ca63f504adbdb9e515c239c8d2c4bd37f518a6b900667d2f30b47');
let db;
try {
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 console.log('PREDECESSOR_SHA256',await db.sql("SELECT encode(sha256(convert_to(pg_get_functiondef('public.create_catalog_calculator_with_audit(text,text,text,text,text,jsonb)'::regprocedure),'UTF8')),'hex');"));
 if(process.argv.includes('--hash-only'))process.exitCode=0;
 else {
 const guard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated acceptance and explicit activation authorization required'; END $$;";
 const proposal=await readFile(proposalPath,'utf8');assert.equal(proposal.split(guard).length,2);await assert.rejects(db.sql(proposal),/PROPOSAL ONLY/);assert.equal(await db.sql("SELECT to_regprocedure('public.prepare_catalog_inventory_drafts(jsonb)') IS NULL;"),'t');await db.sql('\\set ON_ERROR_STOP off\n'+proposal+'\n\\set ON_ERROR_STOP on\n');assert.equal(await db.sql("SELECT to_regprocedure('public.prepare_catalog_inventory_drafts(jsonb)') IS NULL;"),'t');
 await db.sql(predecessor.replace('declare','-- synthetic source drift\ndeclare'));await assert.rejects(db.sql(proposal.replace(guard,'')),/Predecessor source\/security mismatch/);await db.sql(predecessor);
 await db.sql('ALTER TABLE public.calculator_bulk_jobs DISABLE ROW LEVEL SECURITY;');await assert.rejects(db.sql(proposal.replace(guard,'')),/Required RLS table unavailable/);await db.sql('ALTER TABLE public.calculator_bulk_jobs ENABLE ROW LEVEL SECURITY;');
 const definition=()=>db.sql("SELECT pg_get_functiondef('public.prepare_catalog_inventory_drafts(jsonb)'::regprocedure);");
 await db.sql("CREATE FUNCTION public.prepare_catalog_inventory_drafts(p_items jsonb) RETURNS jsonb LANGUAGE sql SECURITY INVOKER AS $$ SELECT '{\"unexpected\":true}'::jsonb $$;");const unexpectedDefinition=await definition();await assert.rejects(db.sql(proposal.replace(guard,'')),/Draft inventory RPC must be absent/);assert.equal(await definition(),unexpectedDefinition);await db.sql('DROP FUNCTION public.prepare_catalog_inventory_drafts(jsonb);');
 await db.sql(proposal.replace(guard,''));const installedDefinition=await definition();await assert.rejects(db.sql(proposal.replace(guard,'')),/Draft inventory RPC must be absent/);assert.equal(await definition(),installedDefinition);console.log('PASS unexpected existing RPC and installation replay refuse without replacing definitions');await db.sql("NOTIFY pgrst, 'reload schema';");
 for(let i=0;i<100;i++){const schema=await fetch(db.url+'/rest/v1/',{headers:{Authorization:'Bearer '+db.serviceKey}}).then(r=>r.json());if(schema.paths?.['/rpc/prepare_catalog_inventory_drafts'])break;if(i===99)throw Error('RPC schema cache unavailable');await new Promise(r=>setTimeout(r,50));}
 const signup=async name=>{const r=await fetch(db.url+'/auth/v1/signup',{method:'POST',headers:{apikey:db.anonKey,'Content-Type':'application/json'},body:JSON.stringify({email:name+'@example.invalid',password:'Synthetic-fixture-pass-123!'})});const body=await r.json();assert.equal(r.status,200,JSON.stringify(body));return body;};
 const owner=await signup('inventory-owner'),reviewer=await signup('inventory-reviewer'),outsider=await signup('inventory-outsider');
 await db.sql(`INSERT INTO public.platform_admins(user_id,role) VALUES('${owner.user.id}','owner'),('${reviewer.user.id}','reviewer');`);
 const rpc=async(items,token=owner.access_token)=>{const r=await fetch(db.url+'/rest/v1/rpc/prepare_catalog_inventory_drafts',{method:'POST',headers:{Authorization:'Bearer '+token,apikey:db.anonKey,'Content-Type':'application/json'},body:JSON.stringify({p_items:items})});return{status:r.status,body:await r.json()};};
 const item=(key,extra={})=>({calculator_key:key,slug:key,title:'Synthetic draft',category:'Testing',risk_class:'standard',metadata:{rulePackRequired:false},version:1,...extra});
 const snap=()=>db.sql("SELECT jsonb_build_array((SELECT count(*) FROM public.calculator_catalog_admin),(SELECT count(*) FROM public.calculator_qa_checks),(SELECT count(*) FROM public.calculator_review_events),(SELECT count(*) FROM public.calculator_bulk_jobs));");
 // Synthetic preservation sentinels only, not certified/approved production evidence.
 // Fixture DDL owner seeds them without invoking publication authority; tested RPC never bypasses RLS.
 await db.sql(`BEGIN;SET LOCAL session_replication_role=replica;INSERT INTO public.calculator_catalog_admin(calculator_key,slug,title,category,risk_class,lifecycle,metadata,created_by) SELECT 'live-sentinel-'||g,'live-sentinel-'||g,'Synthetic draft','Testing','standard','published','{"rulePackRequired":false}'::jsonb,'${owner.user.id}' FROM generate_series(1,209) g;COMMIT;`);
 const live=()=>db.sql("SELECT jsonb_agg(to_jsonb(c) ORDER BY calculator_key) FROM public.calculator_catalog_admin c WHERE calculator_key LIKE 'live-sentinel-%';");const liveBefore=await live();
 const initial=await snap();
 for(const token of [reviewer.access_token,outsider.access_token,db.anonKey]){const r=await rpc([item('denied-draft')],token);assert(r.status>=400,JSON.stringify(r));}assert.equal(await snap(),initial);console.log('PASS actual JWT reviewer/nonadmin/anon denial');
 // Historical RED: same RLS jobs UPDATE call as the old app silently affects no row.
 await db.sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${owner.user.id}';INSERT INTO public.calculator_bulk_jobs(job_type,requested_by,status) VALUES('inventory-import','${owner.user.id}','processing');UPDATE public.calculator_bulk_jobs SET status='completed';`);
 assert.equal(await db.sql("SELECT status FROM public.calculator_bulk_jobs;"),'processing');await db.sql('DELETE FROM public.calculator_bulk_jobs;');console.log('RED reproduced old bulk completion remains processing under real RLS');
 let r=await rpc([item('draft-one')]);assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.body.inserted,1);assert.equal(await db.sql("SELECT count(*) FROM public.calculator_qa_checks WHERE status='pending';"),'15');assert.equal(await db.sql("SELECT count(*) FROM public.calculator_review_events WHERE event_type='created';"),'1');
 r=await rpc([item('draft-one')]);assert.equal(r.body.existing,1);assert.equal(r.body.healedQa,0);assert.equal(await db.sql("SELECT count(*) FROM public.calculator_review_events;"),'1');console.log('PASS create and idempotent retry audit/QA');
 await db.sql(`SET request.jwt.claim.sub='${owner.user.id}';SELECT public.record_calculator_qa_decision((SELECT id FROM public.calculator_catalog_admin WHERE calculator_key='draft-one'),'formula-review','failed','Preserve this synthetic negative decision');DELETE FROM public.calculator_qa_checks WHERE check_type='engine-tests';`);const qaBefore=await db.sql("SELECT to_jsonb(q) FROM public.calculator_qa_checks q WHERE check_type='formula-review';");r=await rpc([item('draft-one')]);assert.equal(r.body.healedQa,1);assert.equal(await db.sql("SELECT to_jsonb(q) FROM public.calculator_qa_checks q WHERE check_type='formula-review';"),qaBefore);console.log('PASS missing draft QA healed only');
 for(const bad of [[],Array.from({length:251},(_,i)=>item('oversized-'+i)),[item('bad-version',{version:2})],[item('draft-one',{risk_class:'health'})],[item('draft-one'),item('draft-one')],[{...item('extra'),unexpected:true}]]){const before=await snap();r=await rpc(bad);assert(r.status>=400,JSON.stringify(r));assert.equal(await snap(),before);}console.log('PASS malformed/conflicting/version/duplicate boundaries rollback');
 const bound=item('bound-draft',{metadata:{rulePackRequired:false,engineBinding:{engineId:'bound-draft',slug:'bound-draft',version:1}}});assert.equal((await rpc([bound])).status,200);
 for(const items of [[{...bound,metadata:{rulePackRequired:false,engineBinding:{engineId:'other',slug:'bound-draft',version:1}}}],[item('new-key',{slug:'draft-one'})],[item('batch-must-rollback'),item('draft-one',{risk_class:'health'})]]){const before=await snap();assert((await rpc(items)).status>=400);assert.equal(await snap(),before);}console.log('PASS existing binding/slug conflict and later batch conflict rollback');
 for(const table of ['calculator_qa_checks','calculator_review_events','calculator_bulk_jobs']){
 await db.sql(`CREATE FUNCTION public.inventory_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic inventory failure';END $$;CREATE TRIGGER inventory_failure BEFORE INSERT ON public.${table} FOR EACH ROW EXECUTE FUNCTION public.inventory_failure();`);
 const before=await snap();r=await rpc([item('failure-'+table.replaceAll('_','-'))]);assert(r.status>=400);assert.match(r.body.message,/synthetic inventory failure/);assert.equal(await snap(),before);await db.sql(`DROP TRIGGER inventory_failure ON public.${table};DROP FUNCTION public.inventory_failure();`);
 }console.log('PASS QA/audit/job injected failures roll back entire batch');
 const replies=await Promise.all([rpc([item('concurrent-draft')]),rpc([item('concurrent-draft')])]);assert.deepEqual(replies.map(v=>v.status),[200,200]);assert.deepEqual(replies.map(v=>v.body.inserted).sort(),[0,1]);console.log('PASS concurrent identical imports serialize');
 r=await rpc([item('live-sentinel-1')]);assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.body.existing,1);assert.equal(r.body.healedQa,0);assert.equal(await live(),liveBefore);assert.equal(await db.sql("SELECT count(*) FROM public.calculator_qa_checks q JOIN public.calculator_catalog_admin c ON c.id=q.calculator_id WHERE c.lifecycle='published';"),'0');console.log('PASS all 209 synthetic published preservation sentinels untouched');
 assert.equal(await db.sql("SELECT count(*) FROM public.calculator_bulk_jobs WHERE status<>'completed';"),'0');
 console.log('PASS isolated provisioning acceptance; proposal remains guarded outside active migrations');
 }
} finally {if(db)await db.close();}
