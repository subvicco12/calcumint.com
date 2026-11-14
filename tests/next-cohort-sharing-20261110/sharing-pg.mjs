import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';
import {initializeFullSchema} from '../gotrue-full-schema/schema.mjs';
for(const k of ['DATABASE_URL','SUPABASE_DB_URL','PGHOST','PGDATABASE','PGPORT','PGUSER','PGPASSWORD'])assert(!process.env[k],'External selector refused '+k);
assert.equal(process.argv.length,2);
const directory='docs/next-cohort-sharing-20261110/pg';await mkdir(directory,{recursive:true});
const checks=[],log=[],sources=['docs/next-cohort-sharing-20261110/review-only-sharing.sql','docs/first-five-full-contract-20261109/sharing/review-only-sharing.sql','src/lib/native-delivery/technology-next-catalog.ts','tests/next-cohort-sharing-20261110/sharing-pg.mjs','tests/gotrue-runtime/fixture.mjs','tests/gotrue-full-schema/schema.mjs'];
const sourceHashes=Object.fromEntries(await Promise.all(sources.map(async p=>[p,createHash('sha256').update(await readFile(p)).digest('hex')])));
const pass=s=>{checks.push(s);log.push('PASS '+s);console.log('PASS '+s);};
const ok=async q=>{const r=await q;assert.equal(r.error,null,JSON.stringify(r.error));return r.data;};let db;
try{
 db=await startGoTrueFixture({initializeSchema:initializeFullSchema});
 const old=await readFile(sources[1],'utf8');const oldGuard=/DO \$sharing_guard\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_FIVE_SHARING_PRIVATE_1'; END \$sharing_guard\$;/;assert.match(old,oldGuard);await db.sql(old.replace(oldGuard,'-- Local preservation fixture only.'));
 const oldState=()=>db.sql("SELECT jsonb_build_object('constraints',(SELECT jsonb_agg(pg_get_constraintdef(oid) ORDER BY conname) FROM pg_constraint WHERE conrelid='public.technology_five_shared_snapshots'::regclass),'rows',(SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY id),'[]'::jsonb) FROM public.technology_five_shared_snapshots s),'acl',(SELECT relacl::text FROM pg_class WHERE oid='public.technology_five_shared_snapshots'::regclass));");
 const proposal=await readFile(sources[0],'utf8');await assert.rejects(db.sql(proposal),/UNAPPLIED_TECHNOLOGY_NEXT_SHARING_PRIVATE_1/);assert.equal(await db.sql("SELECT to_regclass('public.technology_next_shared_snapshots') IS NULL;"),'t');
 pass('Unchanged new guard rejects atomically; no next table created');
 const guard=/DO \$sharing_guard\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_TECHNOLOGY_NEXT_SHARING_PRIVATE_1'; END \$sharing_guard\$;/;assert.match(proposal,guard);
 const users={};for(const name of ['owner','member','viewer','foreign']){const sdk=createClient(db.url,db.anonKey,{auth:{persistSession:false,autoRefreshToken:false}});const d=await ok(sdk.auth.signUp({email:name+'-'+randomUUID()+'@example.invalid',password:'Local-'+randomUUID()}));await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${d.user.id}';`);users[name]={sdk,id:d.user.id};}
 const org=await ok(users.owner.sdk.rpc('create_business_organization',{org_name:'Next SQL sharing',org_slug:'next-'+randomUUID()}));const foreignOrg=await ok(users.foreign.sdk.rpc('create_business_organization',{org_name:'Foreign',org_slug:'foreign-'+randomUUID()}));
 await db.sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${org}','${users.member.id}','member'),('${org}','${users.viewer.id}','viewer');`);
 const project=await ok(users.owner.sdk.from('business_projects').insert({organization_id:org,name:'Project',created_by:users.owner.id}).select().single());
 const other=await ok(users.owner.sdk.from('business_projects').insert({organization_id:org,name:'Other',created_by:users.owner.id}).select().single());
 const foreignProject=await ok(users.foreign.sdk.from('business_projects').insert({organization_id:foreignOrg,name:'Foreign',created_by:users.foreign.id}).select().single());
 const client=await ok(users.owner.sdk.from('client_workspaces').insert({organization_id:org,project_id:project.id,name:'Client',created_by:users.owner.id}).select().single());
 const wrongClient=await ok(users.owner.sdk.from('client_workspaces').insert({organization_id:org,project_id:other.id,name:'Wrong project',created_by:users.owner.id}).select().single());
 const foreignClient=await ok(users.foreign.sdk.from('client_workspaces').insert({organization_id:foreignOrg,project_id:foreignProject.id,name:'Foreign',created_by:users.foreign.id}).select().single());
 const payload=(slug='aspect-ratio-calculator',version=1)=>({organizationId:org,projectId:project.id,clientWorkspaceId:client.id,requestId:randomUUID(),title:'SQL authority test',snapshot:{calculatorSlug:slug,calculatorVersion:version,input:{supplied:'server verified upstream'},output:{recorded:'server verified upstream'}}});
 // Seed the old table before adopting new SQL so preservation includes nonempty data.
 const oldPayload=payload('bandwidth-calculator');await db.sql(`SET ROLE service_role; SELECT public.share_technology_five_snapshot('${users.owner.id}', '${JSON.stringify(oldPayload)}'::jsonb); RESET ROLE;`);
 const baseline=await oldState();await db.sql(proposal.replace(guard,'-- ONLY this disposable candidate-model fixture.'));assert.equal(await oldState(),baseline);
 pass('New sibling adoption preserves original-five constraints, ACL and nonempty row data exactly');
 const service=createClient(db.url,db.serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
 const rpc=(actor,request)=>service.rpc('share_technology_next_snapshot',{actor_id:actor,request_payload:request});
 const deadline=Date.now()+10000;for(;;){const r=await users.owner.sdk.rpc('technology_next_sharing_capability',{target_org:org});if(!r.error){assert.equal(r.data,'technology-next-sharing-private-1');break;}assert(Date.now()<deadline,JSON.stringify(r.error));await new Promise(r=>setTimeout(r,100));}
 const ids=[];for(const [slug,version] of [['aspect-ratio-calculator',1],['resolution-calculator',1],['dpi-calculator',1],['storage-conversion-calculator',1],['power-supply-calculator',1],['website-bandwidth-calculator',2],['cloud-storage-cost-calculator',1],['cloud-data-transfer-cost-calculator',1]]){const p=payload(slug,version);const results=await Promise.all([ok(rpc(users.owner.id,p)),ok(rpc(users.owner.id,p))]);assert.equal(results[0],results[1]);assert((await rpc(users.owner.id,{...p,title:'Conflict'})).error);assert.equal(await db.sql(`SELECT count(*) FROM public.organization_audit_log WHERE entity_id='${results[0]}';`),'1');ids.push(results[0]);}
 pass('Priority 377/378/379 then all eight tuples accepted; concurrent identical retry one ID and one audit; conflict rejected');
 const deny=async(p,actor=users.owner.id)=>assert((await rpc(actor,p)).error,'Expected refusal '+JSON.stringify(p));
 await deny(payload('website-bandwidth-calculator',1));for(const slug of ['base64-size-calculator','bandwidth-calculator','download-time-calculator','upload-time-calculator','data-transfer-calculator'])await deny(payload(slug));
 for(const p of [null,[],{}, {...payload(),extra:true},{...payload(),snapshot:null},{...payload(),title:null},{...payload(),title:5},{...payload(),title:''},{...payload(),clientWorkspaceId:{}},{...payload(),snapshot:{...payload().snapshot,calculatorVersion:'1'}},{...payload(),snapshot:{...payload().snapshot,input:null}},{...payload(),snapshot:{...payload().snapshot,calculatorSlug:null}}])await deny(p);
 pass('Historical website v1, all original-five identities and malformed shapes refused');
 await deny(payload(),users.viewer.id);await deny(payload(),users.foreign.id);await deny({...payload(),projectId:foreignProject.id});await deny({...payload(),clientWorkspaceId:foreignClient.id});await deny({...payload(),clientWorkspaceId:wrongClient.id});
 await db.sql(`UPDATE public.business_projects SET status='archived' WHERE id='${project.id}';`);await deny(payload());await db.sql(`UPDATE public.business_projects SET status='active' WHERE id='${project.id}';`);
 await db.sql(`UPDATE public.profiles SET plan='free' WHERE id='${users.member.id}';`);await deny(payload(),users.member.id);await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${users.member.id}';`);
 await db.sql(`UPDATE public.profiles SET plan='free' WHERE id='${users.owner.id}';`);await deny(payload());assert.equal(await ok(users.viewer.sdk.rpc('technology_next_sharing_capability',{target_org:org})),null);await db.sql(`UPDATE public.profiles SET plan='business' WHERE id='${users.owner.id}';`);
 await ok(rpc(users.member.id,{...payload(),clientWorkspaceId:null}));
 pass('Member/null-client positive; viewer/foreign actor, inactive project, foreign and wrong-project clients, actor/owner plan downgrade refused');
 assert.equal((await ok(users.viewer.sdk.from('technology_next_shared_snapshots').select('id'))).length,9);assert.deepEqual(await ok(users.foreign.sdk.from('technology_next_shared_snapshots').select('id')),[]);
 assert((await users.owner.sdk.rpc('share_technology_next_snapshot',{actor_id:users.owner.id,request_payload:payload()})).error);assert((await users.owner.sdk.from('technology_next_shared_snapshots').insert({organization_id:org})).error);
 for(const role of ['anon','authenticated','service_role'])for(const privilege of ['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','TRIGGER','REFERENCES'])assert.equal(await db.sql(`SELECT has_table_privilege('${role}','public.technology_next_shared_snapshots','${privilege}');`),((role==='service_role'&&['SELECT','INSERT'].includes(privilege))||(role==='authenticated'&&privilege==='SELECT'))?'t':'f');
 for(const role of ['anon','authenticated'])assert.equal(await db.sql(`SELECT has_function_privilege('${role}','public.share_technology_next_snapshot(uuid,jsonb)','EXECUTE');`),'f');
 await assert.rejects(db.sql(`UPDATE public.technology_next_shared_snapshots SET title='mutated' WHERE id='${ids[0]}';`),/Shared snapshots are immutable/);await assert.rejects(db.sql(`DELETE FROM public.technology_next_shared_snapshots WHERE id='${ids[0]}';`),/Shared snapshots are immutable/);
 await assert.rejects(db.sql('SET ROLE service_role; TRUNCATE public.technology_next_shared_snapshots;'),/permission denied/);
 pass('Viewer read and tenant RLS isolation; direct authenticated RPC/writes denied; exact least privilege including service TRUNCATE denial; UPDATE/DELETE immutable');
 await db.sql(`DELETE FROM public.organization_members WHERE organization_id='${org}' AND user_id='${users.viewer.id}';`);assert.deepEqual(await ok(users.viewer.sdk.from('technology_next_shared_snapshots').select('id')),[]);assert.equal(await oldState(),baseline);
 pass('Live membership revocation closes reads; original-five state still byte-identical');
 await writeFile(directory+'/receipt.json',JSON.stringify({passed:true,kind:'NEXT_SHARING_GENUINE_ISOLATED_POSTGRES_GOTRUE',sourceHashes,checks,fixture:db.provenance,limitations:['Local adoption of guarded candidate repository model only; no production equivalence or deployment','SQL trusts server/service role for exactmath and newcapture verification; opaque input/output here test only authority/storage','Original five guarded proposal locally adopted only to prove nonempty preservation']},null,2)+'\n');
}catch(e){log.push(e.stack);await writeFile(directory+'/failure.txt',e.stack+'\n');throw e;}finally{await db?.close();await writeFile(directory+'/raw.log',log.join('\n')+'\n');}
