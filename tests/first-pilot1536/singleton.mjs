/** Owned disposable fixture only. Synthetic approval records are NOT competent acceptance. */
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeTargetShape} from '../adoption1528/initializer.mjs';
import {prepareApply,snapshot,sha} from '../adoption1528/bundle.mjs';
for(const key of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGSERVICE','PGDATABASE'])assert(!process.env[key],`External connection selector refused: ${key}`);
const checks=[],pass=x=>{checks.push(x);console.log('PASS '+x)},dir='docs/first-pilot1536';let db;
const selected=JSON.parse(await readFile('docs/shortest-publication-20/selected-20.json','utf8'));
const pins=JSON.parse(await readFile('docs/publication540-shared/database/source-bindings.json','utf8'));
for(const b of pins.files)assert.equal(sha(await readFile(b.path,'utf8')),b.sha256);
try{
 db=await startGoTrueFixture({initializeSchema:initializeTargetShape});
 const core=await prepareApply(await snapshot(db.sql));
 await assert.rejects(db.sql(core.sql),/UNAPPLIED/);
 await db.sql(core.sql.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_ADOPTION1528_[^']+: no activation authority'; END \$hold\$;/,'-- Owned local fixture only'));
 const addon=await readFile('docs/publication540-shared/database/guarded-successor.sql','utf8');
 await assert.rejects(db.sql(addon),/UNAPPLIED/);
 await db.sql(addon.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION540_DATABASE[^']*'; END \$hold\$;/,'-- Owned local fixture only'));
 const signup=async name=>{const r=await fetch(db.url+'/auth/v1/signup',{method:'POST',headers:{apikey:db.anonKey,'Content-Type':'application/json'},body:JSON.stringify({email:name+'@example.invalid',password:'Synthetic-fixture-pass-123!'})});assert.equal(r.status,200);return r.json()};
 const owner=await signup('pilot-owner'),reviewer=await signup('pilot-reviewer'),outsider=await signup('pilot-outsider');
 await db.sql(`INSERT INTO public.platform_admins(user_id,role) VALUES('${owner.user.id}','owner'),('${reviewer.user.id}','reviewer');`);
 const rpc=async(name,args,token=owner.access_token)=>{const r=await fetch(db.url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:db.anonKey,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(args)});return{status:r.status,body:await r.text()}};
 await db.sql("NOTIFY pgrst,'reload schema';");
 for(let i=0;i<100;i++){const r=await rpc('publish_calculator_batch_with_audit_v1',{p_items:[]});if(r.status!==404)break;await new Promise(r=>setTimeout(r,50));}
 const rows=()=>db.sql("SELECT jsonb_build_array((SELECT jsonb_agg(to_jsonb(c) ORDER BY id) FROM public.calculator_catalog_admin c),(SELECT jsonb_agg(to_jsonb(e) ORDER BY id) FROM public.calculator_review_events e));");
 const capture=async id=>JSON.parse(await db.sql(`SELECT jsonb_build_object('id',c.id,'calculator_key',c.calculator_key,'slug',c.slug,'version',c.version,'expected_catalog',to_jsonb(c),'expected_metadata',c.metadata,'expected_sources',(SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY s.id),'[]'::jsonb) FROM public.calculator_source_evidence s WHERE s.calculator_id=c.id),'expected_qa',(SELECT coalesce(jsonb_agg(to_jsonb(q) ORDER BY q.id),'[]'::jsonb) FROM public.calculator_qa_checks q WHERE q.calculator_id=c.id)) FROM public.calculator_catalog_admin c WHERE c.id='${id}';`));
 const identities=new Map([[440,{engineId:'conversion.frequency',slug:'frequency-converter',version:1}],[432,{engineId:'conversion.time',slug:'time-converter',version:1}]]);
 const ids=[];
 for(const catalogId of [440,432]){
  const item=selected.rows.find(x=>x.catalogId===catalogId||x.masterId===catalogId);assert(item,'Exact retained selected identity '+catalogId);assert.deepEqual({engineId:item.engineId,slug:item.slug,version:item.version},identities.get(catalogId));
  const r=await rpc('create_catalog_calculator_with_audit',{p_calculator_key:item.engineId,p_slug:item.slug,p_title:item.catalogTitle,p_category:'unit-conversions',p_risk_class:'standard',p_metadata:{rulePackRequired:false,engineBinding:{engineId:item.engineId,slug:item.slug,version:1}}});assert.equal(r.status,200,r.body);const id=JSON.parse(r.body);ids.push(id);
  let p=await rpc('publish_calculator_batch_with_audit_v1',{p_items:[await capture(id)]});assert(p.status>=400,p.body);
  assert.equal(await db.sql(`SELECT lifecycle FROM public.calculator_catalog_admin WHERE id='${id}';`),'draft');
 }
 pass('Exact440 and432 singleton drafts contain pending QA and cannot publish; fallback not implicitly selected');
 const id=ids[0];let r=await rpc('assign_calculator_reviewer',{p_calculator_id:id,p_reviewer_id:reviewer.user.id});assert.equal(r.status,204,r.body);
 await db.sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${reviewer.user.id}';INSERT INTO public.calculator_source_evidence(calculator_id,label,url,reviewed_by) VALUES('${id}','SYNTHETIC FIXTURE ONLY','https://example.invalid/pilot-source','${reviewer.user.id}');`);
 const types=JSON.parse(await db.sql(`SELECT jsonb_agg(check_type) FROM public.calculator_qa_checks WHERE calculator_id='${id}';`));
 for(const type of types){r=await rpc('record_calculator_qa_decision',{p_calculator_id:id,p_check_type:type,p_status:'passed',p_details:'SYNTHETIC FIXTURE ONLY - NOT REAL COMPETENT APPROVAL'},reviewer.access_token);assert.equal(r.status,204,r.body);}
 const transition=async(from,to)=>{const r=await rpc('transition_calculator_with_audit',{p_calculator_id:id,p_expected_lifecycle:from,p_target_lifecycle:to});assert.equal(r.status,204,r.body)};
 await transition('draft','review');await transition('review','certified');
 let batch=[await capture(id)],before=await rows();
 for(const token of [reviewer.access_token,outsider.access_token,db.anonKey,db.serviceKey]){r=await rpc('publish_calculator_batch_with_audit_v1',{p_items:batch},token);assert(r.status>=400,r.body);assert.equal(await rows(),before);}
 const wrong=structuredClone(batch);wrong[0].version=2;r=await rpc('publish_calculator_batch_with_audit_v1',{p_items:wrong});assert(r.status>=400);assert.equal(await rows(),before);
 pass('Actual JWT role/RLS and exact immutable-version singleton refusals preserve lifecycle and audit');
 await db.sql("CREATE FUNCTION public.pilot_audit_failure() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.to_state='published' THEN RAISE EXCEPTION 'synthetic pilot audit failure'; END IF;RETURN NEW;END $$;CREATE TRIGGER pilot_audit_failure BEFORE INSERT ON public.calculator_review_events FOR EACH ROW EXECUTE FUNCTION public.pilot_audit_failure();");
 r=await rpc('publish_calculator_batch_with_audit_v1',{p_items:batch});assert.match(r.body,/synthetic pilot audit failure/);assert.equal(await rows(),before);
 await db.sql('DROP TRIGGER pilot_audit_failure ON public.calculator_review_events;DROP FUNCTION public.pilot_audit_failure();');
 pass('Late singleton audit failure rolls back publication and is safely retryable');
 const concurrent=await Promise.all([rpc('publish_calculator_batch_with_audit_v1',{p_items:batch}),rpc('publish_calculator_batch_with_audit_v1',{p_items:batch})]);assert.deepEqual(concurrent.map(x=>x.status).sort(),[200,400]);
 assert.equal(await db.sql(`SELECT count(*) FROM public.calculator_review_events WHERE calculator_id='${id}' AND to_state='published';`),'1');assert.equal(await db.sql(`SELECT lifecycle FROM public.calculator_catalog_admin WHERE id='${ids[1]}';`),'draft');
 pass('Concurrent singleton retry commits exactly one publication/audit and leaves432 DRAFT');
 const manifest=async()=>{const r=await fetch(db.url+'/rest/v1/rpc/list_published_calculator_manifest',{method:'POST',headers:{apikey:db.anonKey,'Content-Type':'application/json'},body:'{}'});assert.equal(r.status,200);return r.json()};
 let published=await manifest();assert.deepEqual(published.map(x=>({calculator_key:x.calculator_key,slug:x.slug,version:x.version})),[{calculator_key:'conversion.frequency',slug:'frequency-converter',version:1}]);
 await transition('published','review');published=await manifest();assert(!published.some(x=>x.calculator_key==='conversion.frequency'));assert.equal(await db.sql(`SELECT count(*) FROM public.calculator_review_events WHERE calculator_id='${id}' AND from_state='published' AND to_state='review';`),'1');
 pass('Real anonymous authority manifest exposes exact published440 only; audited withdrawal removes it and preserves records');
 await mkdir(dir,{recursive:true});await writeFile(dir+'/singleton-receipt.json',JSON.stringify({baseline:'6d2960c2fac7817741b08877ebd3b611720923b7',passed:true,checks,syntheticApprovalsOnly:true,productionWrites:false,publicationEligible:false,sourcePinsVerified:true,provenance:db.provenance},null,2)+'\n');
}finally{await db?.close()}
