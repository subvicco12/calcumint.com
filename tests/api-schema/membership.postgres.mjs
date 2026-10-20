// Disposable PostgreSQL only; no production URL, no host ports, internal network.
import assert from 'node:assert/strict';


import { bootstrapSchema, member, committedMutation } from '../api-schema/bootstrap.mjs';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
const name=`calcumint-embed-test-${randomUUID()}`,network=`${name}-network`;
const image='postgres:16-alpine@sha256:721873c34ceb9f8d8fc265984940dc982404c105f19ad51be9fdc5970a6080ea';
const cmd=(args,input='')=>new Promise((resolve,reject)=>{const c=spawn('docker',args,{stdio:['pipe','pipe','pipe'],timeout:30000});let out='',err='';c.stdout.on('data',v=>out+=v);c.stderr.on('data',v=>err+=v);c.on('error',reject);c.on('close',n=>n===0?resolve(out.trim()):reject(new Error(err||out)));c.stdin.on('error',reject);c.stdin.end(input);});
const sql=q=>cmd(['exec','-i',name,'psql','-h','127.0.0.1','-U','postgres','-X','-qAt','-v','ON_ERROR_STOP=1'],q).catch(e=>{e.message += '\nSynthetic SQL: '+q;throw e;});
const a='00000000-0000-4000-8000-000000000001',b='00000000-0000-4000-8000-000000000002';
let created=false,net=false;
try {
 await cmd(['network','create','--internal',network]);net=true;
 await cmd(['run','-d','--rm','--name',name,'--network',network,'--label','calcumint.embed-fixture=true','--tmpfs','/var/lib/postgresql/data','-e','POSTGRES_HOST_AUTH_METHOD=trust',image]);created=true;
 for(let n=0;;n++){try{await sql('SELECT 1;');break;}catch(e){if(n>=60)throw e;await new Promise(r=>setTimeout(r,250));}}
 await bootstrapSchema(sql,{a,b});
 for(const migration of ['002_b4_billing','007_b9_ai','008_b10_admin_factory','008b_b10_alert_automation','013_production_rpc_privilege_hardening_v2','014_production_entitlement_rpc_sync','035_split_overlapping_write_policies'])await sql(await readFile(`supabase/migrations/${migration}.sql`,'utf8'));
 const helper=await readFile('docs/architecture/proposals/API-RLS-HELPER-EXECUTE.sql','utf8');
 await sql(helper.replace("DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated helper acceptance and owner authorization required'; END $$;",''));
 await sql('GRANT UPDATE,DELETE ON public.organization_members TO authenticated;GRANT UPDATE ON public.organizations TO authenticated;');
 const as=(user,q)=>sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${user}';${q}`);
 // Baseline defects are reproduced transactionally and rolled back.
 await assert.rejects(as(a,`UPDATE public.organization_members SET role='owner' WHERE organization_id='${a}' AND user_id='${member}';`),/permission denied for function org_role/);
 await sql('GRANT EXECUTE ON FUNCTION public.org_role(uuid) TO authenticated;');
 assert.equal(await as(a,`BEGIN;UPDATE public.organization_members SET role='member' WHERE organization_id='${a}' AND user_id='${a}';SELECT role FROM public.organization_members WHERE organization_id='${a}' AND user_id='${a}';ROLLBACK;`),'member');
 assert.equal(await as(a,`BEGIN;UPDATE public.organizations SET owner_user_id='${b}' WHERE id='${a}';SELECT owner_user_id FROM public.organizations WHERE id='${a}';ROLLBACK;`),b);
 await assert.rejects(as(a,`UPDATE public.organization_members SET organization_id='${b}' WHERE organization_id='${a}' AND user_id='${member}';`),/row-level security/);
 await sql(`UPDATE public.organization_members SET role='admin' WHERE organization_id='${a}' AND user_id='${member}';`);
 assert.equal(await as(member,`BEGIN;UPDATE public.organization_members SET role='member' WHERE organization_id='${a}' AND user_id='${a}';SELECT role FROM public.organization_members WHERE organization_id='${a}' AND user_id='${a}';ROLLBACK;`),'member');
 assert.equal(await as(member,`BEGIN;UPDATE public.organizations SET owner_user_id='${b}' WHERE id='${a}';SELECT owner_user_id FROM public.organizations WHERE id='${a}';ROLLBACK;`),b);
 await sql('REVOKE EXECUTE ON FUNCTION public.org_role(uuid) FROM authenticated;');
 console.log('PASS reproduced missing org_role grant, admin owner demotion/reassignment; cross-org outsider move correctly denied');
 const proposal=await readFile('docs/architecture/proposals/MEMBERSHIP-ADMIN-FENCING.sql','utf8');
 const guard="DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated membership acceptance and owner authorization required'; END $$;";
 assert.equal(proposal.split(guard).length,2);await assert.rejects(sql(proposal),/PROPOSAL ONLY/);
 const repair=proposal.replace(guard,'');
 await sql('REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid,text[]) FROM authenticated;');
 await assert.rejects(sql(repair),/Membership helper prerequisite mismatch/);
 assert.equal(await sql("SELECT count(*) FROM pg_trigger WHERE tgname='membership_identity_fence_v1';"),'0');
 await sql('GRANT EXECUTE ON FUNCTION public.has_org_role(uuid,text[]) TO authenticated;');
 await sql(repair);await sql(repair);
 // The invariant is global: privileged callers get no implicit trigger bypass.
 await assert.rejects(sql(`UPDATE public.organizations SET owner_user_id='${b}' WHERE id='${a}';`),/ownership requires owner/);
 await sql('GRANT SELECT,UPDATE ON public.organizations TO service_role;');
 await assert.rejects(sql(`SET ROLE service_role;UPDATE public.organizations SET owner_user_id='${b}' WHERE id='${a}';`),/permission denied for function has_org_role/);
 await assert.rejects(sql(`UPDATE public.organization_members SET user_id='${b}' WHERE organization_id='${a}' AND user_id='${member}';`),/membership identity is immutable/);
 let checks=0;
 const check=async(user,q,expected)=>{assert.equal(await as(user,q),expected);checks++;};
 for(const role of ['owner','admin','manager','member','viewer','outsider']) {
  const user=role==='owner'?a:role==='outsider'?b:member;
  if(!['owner','outsider'].includes(role))await sql(`UPDATE public.organization_members SET role='${role}' WHERE organization_id='${a}' AND user_id='${member}';`);
  const allowed=['owner','admin'].includes(role);
  const transfer=`BEGIN;UPDATE public.organizations SET owner_user_id='${b}' WHERE id='${a}';SELECT owner_user_id FROM public.organizations WHERE id='${a}';ROLLBACK;`;
  if(role==='owner')assert.equal(await as(user,transfer),b);
  else if(role==='admin')await assert.rejects(as(user,transfer),/ownership requires owner/);
  else assert.equal(await as(user,transfer),role==='outsider'?'':a);
  checks++;

  await check(user,`WITH x AS (UPDATE public.organizations SET name='Synthetic changed' WHERE id='${a}' RETURNING id) SELECT count(*) FROM x;`,allowed?'1':'0');
  await check(user,`BEGIN;WITH x AS (UPDATE public.organization_members SET role='viewer' WHERE organization_id='${a}' AND user_id='${a}' RETURNING user_id) SELECT count(*) FROM x;ROLLBACK;`,role==='owner'?'1':'0');
  await check(user,`WITH x AS (DELETE FROM public.organization_members WHERE organization_id='${a}' AND user_id='${a}' RETURNING user_id) SELECT count(*) FROM x;`,'0');
  for(const q of [`UPDATE public.organization_members SET organization_id='${b}' WHERE organization_id='${a}';`,`UPDATE public.organization_members SET user_id='${b}' WHERE organization_id='${a}';`]){if(allowed)await assert.rejects(as(user,q),/membership identity is immutable/);else assert.equal(await as(user,q),'');checks++;}
  await assert.rejects(as(user,`SELECT public.org_role('${a}');`),/permission denied/);checks++;
 }
 await sql(`UPDATE public.organization_members SET role='member' WHERE organization_id='${a}' AND user_id='${member}';`);
 for(const role of ['admin','manager','member','viewer']) {await check(a,`UPDATE public.organization_members SET role='${role}' WHERE organization_id='${a}' AND user_id='${member}';SELECT role FROM public.organization_members WHERE organization_id='${a}' AND user_id='${member}';`,role);}
 await check(a,`BEGIN;UPDATE public.organization_members SET role='owner' WHERE organization_id='${a}' AND user_id='${member}';SELECT role FROM public.organization_members WHERE organization_id='${a}' AND user_id='${member}';ROLLBACK;`,'owner');
 await sql(`UPDATE public.organization_members SET role='admin' WHERE organization_id='${a}' AND user_id='${member}';`);
 await check(member,`WITH x AS (UPDATE public.organization_members SET role='viewer' WHERE organization_id='${b}' RETURNING user_id) SELECT count(*) FROM x;`,'0');
 // Separate statements see committed removal. RLS does not promise cancellation of old snapshots.
 await committedMutation(sql,`DELETE FROM public.organization_members WHERE organization_id='${a}' AND user_id='${member}';`,async()=>{
  await check(member,`WITH x AS (UPDATE public.organizations SET name='Before revocation commit' WHERE id='${a}' RETURNING id) SELECT count(*) FROM x;`,'1');
 });
 await check(member,`WITH x AS (UPDATE public.organizations SET name='Revoked' WHERE id='${a}' RETURNING id) SELECT count(*) FROM x;`,'0');
 await check(member,`SELECT count(*) FROM public.organizations WHERE id='${a}';`,'0');
 await sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${a}','${member}','member');`);
 assert.equal(await sql("SELECT has_function_privilege('authenticated','public.org_role(uuid)','EXECUTE');"),'f');checks++;
 // Conflicting UPDATE: admin waits on a row promoted by the owner, then RLS
 // rechecks the committed OLD owner row through EvalPlanQual and updates zero rows.
 const target=randomUUID(),lockLabel='membership-admin-'+randomUUID();
 await sql(`INSERT INTO auth.users(id,email) VALUES('${target}','race-target@example.invalid');INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${a}','${target}','member');UPDATE public.organization_members SET role='admin' WHERE organization_id='${a}' AND user_id='${member}';`);
 assert.equal(await as(member,`WITH x AS (UPDATE public.organization_members SET role='manager' WHERE organization_id='${a}' AND user_id='${target}' RETURNING user_id) SELECT count(*) FROM x;`),'1');
 await assert.rejects(as(member,`UPDATE public.organization_members SET role='owner' WHERE organization_id='${a}' AND user_id='${target}';`),/row-level security/);
 await committedMutation(sql,`SET LOCAL ROLE authenticated;SET LOCAL request.jwt.claim.sub='${a}';UPDATE public.organization_members SET role='owner' WHERE organization_id='${a}' AND user_id='${target}';`,async()=>{
  const update=as(member,`SET application_name='${lockLabel}';WITH x AS (UPDATE public.organization_members SET role='viewer' WHERE organization_id='${a}' AND user_id='${target}' RETURNING user_id) SELECT count(*) FROM x;`);
  for(let n=0;;n++) {
   if(await sql(`SELECT EXISTS(SELECT FROM pg_stat_activity WHERE application_name='${lockLabel}' AND wait_event_type='Lock');`)==='t')break;
   if(n===100)throw new Error('Admin UPDATE never reached a row-lock wait');
   await new Promise(resolve=>setTimeout(resolve,10));
  }
  assert.equal(await update,'0');
 });
 assert.equal(await sql(`SELECT role FROM public.organization_members WHERE organization_id='${a}' AND user_id='${target}';`),'owner');
 await sql(`DELETE FROM public.organization_members WHERE organization_id='${a}' AND user_id='${target}';`);
 console.log('PASS conflicting owner promotion/admin demotion: observed lock wait, committed owner row retained');
 // Exercise actual granted SECURITY DEFINER membership dependencies after repair.
 const newcomer=randomUUID();
 await sql(`INSERT INTO auth.users(id,email) VALUES('${newcomer}','new-owner@example.invalid');UPDATE public.profiles SET plan='business' WHERE id='${newcomer}';`);
 const newOrg=await as(newcomer,"SELECT public.create_business_organization('New synthetic','new-synthetic');");
 assert.equal(await as(newcomer,`SELECT public.has_org_role('${newOrg}',ARRAY['owner']);`),'t');
 await sql(`INSERT INTO public.organization_invitations(organization_id,email,role,token_hash,invited_by,expires_at) VALUES('${newOrg}','outsider@example.invalid','member','membership-first','${newcomer}',now()+interval '1 hour');`);
 assert.equal(await as(b,"SELECT public.accept_business_invitation('membership-first');"),newOrg);
 await sql(`INSERT INTO public.organization_invitations(organization_id,email,role,token_hash,invited_by,expires_at) VALUES('${newOrg}','outsider@example.invalid','viewer','membership-update','${newcomer}',now()+interval '1 hour');`);
 assert.equal(await as(b,"SELECT public.accept_business_invitation('membership-update');"),newOrg);
 assert.equal(await sql(`SELECT role FROM public.organization_members WHERE organization_id='${newOrg}' AND user_id='${b}';`),'viewer');
 console.log('PASS four real organization-create/invitation-insert/invitation-conflict-update RPC checks');
 console.log(`PASS membership fencing: ${checks} role/RLS/ACL checks; guarded proposal reapply; concurrent uncommitted/committed revocation; owner transfer primitives retained`);
} finally {if(created)await cmd(['rm','-f',name]);if(net)await cmd(['network','rm',network]);}
