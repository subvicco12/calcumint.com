import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {catalogSQL,tables} from '../adoption1528/catalog.mjs';
import {sha} from '../adoption1528/bundle.mjs';
const name='publish_calculator_batch_with_audit_v1';
const addon=`SELECT coalesce(jsonb_agg(jsonb_build_object('id','public.'||p.proname||'('||oidvectortypes(p.proargtypes)||')','definition',pg_get_functiondef(p.oid),'owner',pg_get_userbyid(p.proowner),'acl',coalesce((SELECT jsonb_agg(jsonb_build_object('grantee',CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,'privilege',x.privilege_type,'grantable',x.is_grantable) ORDER BY CASE WHEN x.grantee=0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee) END,x.privilege_type,x.is_grantable) FROM aclexplode(p.proacl) x),'[]'::jsonb)) ORDER BY oidvectortypes(p.proargtypes)),'[]'::jsonb) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname='${name}'`;
export const projection=`SELECT jsonb_build_object('base',(${catalogSQL}),'addon',(${addon}))`;
export async function packageSnapshot(sql){const raw=await sql(`BEGIN;SET LOCAL search_path=pg_catalog;${projection};COMMIT;`);return {raw,data:JSON.parse(raw),sha256:sha(raw)}}
const assertion=h=>`DO $exact$ BEGIN IF encode(sha256(convert_to((${projection})::text,'UTF8')),'hex') IS DISTINCT FROM '${h}' THEN RAISE EXCEPTION 'PUBLICATION540_EXACT_METADATA'; END IF; END $exact$;`;
const guard=direction=>`BEGIN;
SET LOCAL search_path=pg_catalog;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='30s';
DO $hold$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION540_DATABASE_${direction}'; END $hold$;
DO $actor$ BEGIN IF current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'PUBLICATION540_OPERATOR_OR_ISOLATION'; END IF; END $actor$;
LOCK TABLE ${[...tables].sort().map(t=>'public.'+t).join(',')} IN ACCESS EXCLUSIVE MODE;
`;
export async function packageApply(before,after){
 assert.equal(sha(before.raw),before.sha256);assert.equal(sha(after.raw),after.sha256);assert.deepEqual(before.data.addon,[]);assert.equal(after.data.addon.length,1);assert.equal(after.data.addon[0].id,'public.'+name+'(jsonb)');assert.equal(after.data.addon[0].owner,'postgres');assert.deepEqual(before.data.base,after.data.base);
 const bindings=JSON.parse(await readFile('docs/publication540-shared/database/source-bindings.json','utf8'));for(const b of bindings.files)assert.equal(sha(await readFile(b.path,'utf8')),b.sha256,'Source drift '+b.path);
 const raw=await readFile('docs/publication540-shared/database/guarded-successor.sql','utf8');const body=raw.replace(/^BEGIN;$/m,'').replace(/^COMMIT;$/m,'').replace(/DO \$hold\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_PUBLICATION540_DATABASE'; END \$hold\$;/,'-- constituent hold replaced by outer hold');
 return guard('APPLY')+assertion(before.sha256)+`\n-- Successor source SHA256 ${sha(raw)}\n`+body+'\n'+assertion(after.sha256)+'\nCOMMIT;\n';
}
export function packageReverse(before,after){assert.equal(sha(before.raw),before.sha256);assert.equal(sha(after.raw),after.sha256);return guard('REVERSE')+assertion(after.sha256)+`\nDROP FUNCTION public.${name}(jsonb);\n`+assertion(before.sha256)+'\nCOMMIT;\n'}
export async function targetSnapshots(sql,before,after){const capture=JSON.parse(await readFile('docs/adoption1528/package/expected-postimage.json','utf8'));const convert=async addon=>{const raw=await sql("SELECT '"+JSON.stringify({base:capture.data,addon}).replaceAll("'","''")+"'::jsonb::text;");return {raw,data:JSON.parse(raw),sha256:sha(raw)}};return {before:await convert(before.data.addon),after:await convert(after.data.addon)}}
