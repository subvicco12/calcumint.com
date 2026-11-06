import assert from 'node:assert/strict';import {mkdir,writeFile,readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {startGoTrueFixture} from '../gotrue-runtime/fixture.mjs';import {initializeTargetShape} from '../adoption1528/initializer.mjs';
const directory=process.env.CRITICAL440_AUDIT_ARTIFACTS||'docs/critical440';await mkdir(directory,{recursive:true});let db;const checks=[];
try{
 db=await startGoTrueFixture({initializeSchema:initializeTargetShape});assert.equal(await db.sql('SHOW server_version;'),'17.6');
 await db.sql("INSERT INTO public.admin_alerts(severity,alert_type,message) VALUES('warning','synthetic' ,'Synthetic isolated TRUNCATE fixture');");
 for(const role of ['anon','authenticated']){
  if(role==='anon')await assert.rejects(db.sql(`SET ROLE ${role}; SELECT count(*) FROM public.admin_alerts;`),/permission denied for function is_platform_admin/);else assert.equal(await db.sql(`SET ROLE ${role}; SELECT count(*) FROM public.admin_alerts;`),'0');
  assert.equal(await db.sql(`BEGIN; SET LOCAL ROLE ${role}; TRUNCATE public.admin_alerts; RESET ROLE; SELECT count(*) FROM public.admin_alerts; ROLLBACK;`),'0');
  assert.equal(await db.sql('SELECT count(*) FROM public.admin_alerts;'),'1');
  checks.push(role+': SELECT denied or RLS hides synthetic alert; captured TRUNCATE privilege bypasses row filtering; rollback restores row');
 }
 // Disposable compatibility witness only, NOT an adoption or grant-change bundle.
 await db.sql('REVOKE TRUNCATE,TRIGGER ON public.admin_alerts FROM anon,authenticated;');
 for(const role of ['anon','authenticated']){
  await assert.rejects(db.sql(`SET ROLE ${role}; TRUNCATE public.admin_alerts;`),/permission denied/);
  assert.equal(await db.sql(`SELECT has_table_privilege('${role}','public.admin_alerts','SELECT') AND has_table_privilege('${role}','public.admin_alerts','INSERT') AND has_table_privilege('${role}','public.admin_alerts','UPDATE') AND has_table_privilege('${role}','public.admin_alerts','DELETE');`),'t');
  checks.push(role+': isolated narrow revocation denies TRUNCATE without changing SELECT/INSERT/UPDATE/DELETE grants');
 }
 const sources={};for(const p of ['tests/critical440-audit/privileges.mjs','tests/adoption1528/initializer.mjs','docs/adoption1528/target-metadata.json'])sources[p]=createHash('sha256').update(await readFile(p)).digest('hex');
 await writeFile(directory+'/privilege-receipt.json',JSON.stringify({passed:true,checks,sources,fixture:db.provenance,productionWrites:false,activationAuthorized:false,limitations:['Direct SQL SET ROLE witness, not a claim that PostgREST exposes TRUNCATE.','Only synthetic admin_alerts row used; no broad provider privilege policy approved.','No privileges changed outside the disposable fixture.']},null,2)+'\n');console.log(JSON.stringify({passed:true,checks}));
}finally{await db?.close();}
