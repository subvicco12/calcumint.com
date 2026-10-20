// Real migrated policies; these table ACLs are explicit disposable platform setup,
// not grants contained in the helper repair proposal or a production attestation.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

export async function verifyHelperCompatibility(sql,{a,b,member,config,proposal,serviceRead}) {
 const as=(user,q)=>sql(`SET ROLE authenticated;SET request.jwt.claim.sub='${user}';${q}`);
 const repaired=proposal.replace("DO $$ BEGIN RAISE EXCEPTION 'PROPOSAL ONLY: isolated helper acceptance and owner authorization required'; END $$;",'');
 const signatures=['public.is_org_member(uuid)','public.has_org_role(uuid,text[])'];
 // A missing second signature must roll back the preceding grant, not leave half a repair.
 await sql('REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid),public.has_org_role(uuid,text[]) FROM authenticated;');
 await assert.rejects(sql(repaired.replace('public.has_org_role(uuid,text[])','public.has_org_role(uuid,integer[])')),/does not exist/);
 for(const signature of signatures)assert.equal(await sql(`SELECT has_function_privilege('authenticated','${signature}','EXECUTE');`),'f');
 await sql("CREATE FUNCTION public.has_org_role(uuid,integer[]) RETURNS boolean LANGUAGE sql AS 'SELECT false';REVOKE ALL ON FUNCTION public.has_org_role(uuid,integer[]) FROM PUBLIC,anon,authenticated;");
 await sql(repaired);await sql(repaired);
 assert.equal(await sql("SELECT has_function_privilege('authenticated','public.has_org_role(uuid,integer[])','EXECUTE');"),'f');
 await sql('DROP FUNCTION public.has_org_role(uuid,integer[]);');
 for(const signature of signatures) {
  assert.equal(await sql(`SELECT has_function_privilege('authenticated','${signature}','EXECUTE');`),'t');
  assert.equal(await sql(`SELECT has_function_privilege('anon','${signature}','EXECUTE');`),'f');
  const metadata=JSON.parse(await sql(`SELECT json_build_object('owner',pg_get_userbyid(proowner),'definer',prosecdef,'config',proconfig) FROM pg_proc WHERE oid='${signature}'::regprocedure;`));
  assert.deepEqual(metadata,{owner:'postgres',definer:true,config:['search_path=public']});
 }
 for(const role of ['anon','authenticated']) {
  assert.equal(await sql(`SELECT has_schema_privilege('${role}','public','CREATE');`),'f');
  await assert.rejects(sql(`SET ROLE ${role};CREATE FUNCTION public.is_org_member(text) RETURNS boolean LANGUAGE sql AS 'SELECT true';`),/permission denied for schema public/);
 }
 // Qualified helper references and pinned search_path resist a caller-owned shadow schema.
 await sql(`CREATE SCHEMA helper_shadow;GRANT USAGE ON SCHEMA helper_shadow TO authenticated;
 CREATE FUNCTION helper_shadow.org_role(uuid) RETURNS text LANGUAGE sql AS 'SELECT ''owner''::text';
 CREATE FUNCTION helper_shadow.is_org_member(uuid) RETURNS boolean LANGUAGE sql AS 'SELECT true';`);
 assert.equal(await as(b,`SET search_path=helper_shadow,public;SELECT public.has_org_role('${a}',ARRAY['owner']);`),'f');
 await sql('DROP SCHEMA helper_shadow CASCADE;');
 await sql('GRANT SELECT,INSERT,UPDATE,DELETE ON public.embed_configs,public.business_projects,public.shared_calculations TO authenticated;');
 let checks=0;
 // Reuse one actual member, changing committed database membership between requests.
 // Owner identity is independently exercised; all other 003 roles and outsider are explicit.
 for(const role of ['owner','admin','manager','member','viewer','outsider']) {
  const user=role==='owner'?a:role==='outsider'?b:member;
  if(!['owner','outsider'].includes(role))await sql(`UPDATE public.organization_members SET role='${role}' WHERE organization_id='${a}' AND user_id='${member}';`);
  const writer=['owner','admin','manager'].includes(role),present=role!=='outsider';
  assert.equal(await as(user,`SELECT public.is_org_member('${a}');`),present?'t':'f');checks++;
  for(const allowed of ["ARRAY['owner']","ARRAY['admin','manager']","ARRAY['member','viewer']","ARRAY[]::text[]","NULL::text[]","ARRAY['invented']"]) {
   const expected=allowed.includes(`'${role}'`) && present;
   assert.equal(await as(user,`SELECT public.has_org_role('${a}',${allowed});`),expected?'t':'f');checks++;
  }
  assert.equal(await as(user,`SELECT public.has_org_role('${b}',ARRAY['owner','admin','manager','member','viewer']);`),user===b?'t':'f');checks++;
  assert.equal(await as(user,"SELECT public.is_org_member('ffffffff-ffff-4fff-8fff-ffffffffffff');"),'f');checks++;
  assert.equal(await as(user,`SELECT count(*) FROM public.embed_configs WHERE id='${config}';`),present?'1':'0');checks++;
  // 003 gives members shared-calculation editing, managers project editing,
  // and neither relation has a DELETE policy. Exercise that distinction.
  for(const table of ['business_projects','shared_calculations']) {
   const editor=writer || (table==='shared_calculations' && role==='member');
   const row=randomUUID();
   const values=table==='business_projects'?"name":"calculator_slug,calculator_version";
   const content=table==='business_projects'?"'Matrix project'":"'matrix-calculator',1";
   const create=`INSERT INTO public.${table}(id,organization_id,created_by,${values}) VALUES('${row}','${a}','${user}',${content});`;
   if(editor)await as(user,create);else await assert.rejects(as(user,create),/row-level security/);checks++;
   if(!editor)await sql(create);
   const assignment=table==='business_projects'?"name='Changed project'":"title='Changed calculation'";
   assert.equal(await as(user,`WITH changed AS (UPDATE public.${table} SET ${assignment} WHERE id='${row}' RETURNING id) SELECT count(*) FROM changed;`),editor?'1':'0');checks++;
   assert.equal(await as(user,`WITH changed AS (DELETE FROM public.${table} WHERE id='${row}' RETURNING id) SELECT count(*) FROM changed;`),'0');checks++;
   await sql(`DELETE FROM public.${table} WHERE id='${row}';`);
  }
  const id=randomUUID();
  const insert=`INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,created_by) VALUES('${id}','${a}','${a}','helper_${id}','Matrix','${user}');`;
  if(writer)await as(user,insert);else await assert.rejects(as(user,insert),/row-level security/);checks++;
  // Existing row created by each actor so 035's created_by check is also respected.
  await sql(`INSERT INTO public.embed_configs(id,organization_id,calculator_id,public_key,name,created_by) VALUES('${writer?randomUUID():id}','${a}','${a}','seed_${randomUUID()}','Matrix seed','${user}');`);
  const seed=await sql(`SELECT id FROM public.embed_configs WHERE name='Matrix seed' AND created_by='${user}' ORDER BY created_at DESC LIMIT 1;`);
  assert.equal(await as(user,`WITH changed AS (UPDATE public.embed_configs SET name='Matrix updated' WHERE id='${seed}' RETURNING id) SELECT count(*) FROM changed;`),writer?'1':'0');checks++;
  assert.equal(await as(user,`WITH changed AS (DELETE FROM public.embed_configs WHERE id='${seed}' RETURNING id) SELECT count(*) FROM changed;`),writer?'1':'0');checks++;
  if(writer)await assert.rejects(as(user,`UPDATE public.embed_configs SET organization_id='${b}' WHERE id='${id}';`),/row-level security/);
  await sql(`DELETE FROM public.embed_configs WHERE name LIKE 'Matrix%';`);
 }
 // Revocation is observed immediately across requests, then restored membership works.
 await sql(`DELETE FROM public.organization_members WHERE organization_id='${a}' AND user_id='${member}';`);
 assert.equal(await as(member,`SELECT public.is_org_member('${a}');`),'f');
 assert.equal(await as(member,`SELECT count(*) FROM public.embed_configs WHERE id='${config}';`),'0');
 await sql(`INSERT INTO public.organization_members(organization_id,user_id,role) VALUES('${a}','${member}','member');`);
 assert.equal(await as(member,`SELECT count(*) FROM public.embed_configs WHERE id='${config}';`),'1');
 // Existing service RPC execution succeeds while both client helper grants are absent.
 await sql('REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid),public.has_org_role(uuid,text[]) FROM authenticated;');
 await assert.rejects(as(a,'SELECT count(*) FROM public.embed_configs;'),/permission denied for function is_org_member/);
 await serviceRead();await sql(repaired);
 await sql('REVOKE INSERT,UPDATE,DELETE ON public.embed_configs,public.business_projects,public.shared_calculations FROM authenticated;REVOKE SELECT ON public.business_projects,public.shared_calculations FROM authenticated;');
 console.log(`PASS helper compatibility: ${checks} role/predicate/RLS checks across owner/admin/manager/member/viewer/outsider; membership removal/rejoin; repair reapply/partial rollback; effective ACL/schema/shadow denial; revoked-helper service independence`);
}
