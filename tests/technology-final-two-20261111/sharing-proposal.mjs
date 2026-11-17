import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const directory='docs/technology-final-two-20261111/sharing';
const sha=b=>createHash('sha256').update(b).digest('hex');
const q=s=>"'"+s.replaceAll("'","''")+"'";
export const removeFinalTwoSharingHold=s=>s.replace(/DO \$hold\$ BEGIN RAISE EXCEPTION 'UNAPPLIED_FINAL_TWO_SHARING_(SUCCESSOR|REVERSE)'; END \$hold\$;/,'-- DISPOSABLE LOCAL MODEL ONLY');
export async function prepareFinalTwoSharing(sql,{capture=false}={}){
 const query=(await readFile('docs/parallel-five-20261110/sharing/metadata-query.sql','utf8')).trim().replace(/;$/,'');
 const fingerprint=`SELECT encode(sha256(convert_to(metadata::text,'UTF8')),'hex') FROM (${query}) scoped;`;
 const signatures=['public.technology_next_sharing_capability(uuid)','public.share_technology_next_snapshot(uuid,jsonb)'];
 const before=await sql(fingerprint),oldDefinitions=await Promise.all(signatures.map(s=>sql(`SELECT pg_get_functiondef(${q(s)}::regprocedure);`)));
 for(const [i,signature]of signatures.entries())assert.equal(await sql(`SELECT encode(sha256(convert_to(pg_get_functiondef(${q(signature)}::regprocedure),'UTF8')),'hex');`),sha(oldDefinitions[i]+'\n'),'Exact native pg_get_functiondef trailing newline binding');
 const constraint=await sql("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid='public.technology_next_shared_snapshots'::regclass AND conname='technology_next_shared_snapshots_calculator_slug_check';");
 const nextDefinitions=oldDefinitions.map((s,i)=>{const from=i===0?'technology-next-sharing-private-2':"'password-entropy-calculator'",to=i===0?'technology-next-sharing-private-3':"'password-entropy-calculator','ip-subnet-calculator','screen-ppi-calculator'";assert.equal(s.split(from).length,2);return s.replace(from,to);});
 // Replace the whole existing whitelist with an equivalent exact15 whitelist.
 const slugs=['storage-conversion-calculator','aspect-ratio-calculator','resolution-calculator','dpi-calculator','power-supply-calculator','website-bandwidth-calculator','cloud-storage-cost-calculator','cloud-data-transfer-cost-calculator','cidr-calculator','raid-capacity-calculator','battery-runtime-calculator','ups-runtime-calculator','password-entropy-calculator','ip-subnet-calculator','screen-ppi-calculator'];
 const constraintSql=expression=>`ALTER TABLE public.technology_next_shared_snapshots DROP CONSTRAINT technology_next_shared_snapshots_calculator_slug_check;\nALTER TABLE public.technology_next_shared_snapshots ADD CONSTRAINT technology_next_shared_snapshots_calculator_slug_check ${expression};`;
 const policy=revision=>`ALTER POLICY technology_next_shared_member_read ON public.technology_next_shared_snapshots USING(public.technology_next_sharing_capability(organization_id)=${q(revision)});`;
 const make=(hold,hash,definitions,body)=>`-- HELD13-to15 MODEL ONLY: no production compatibility or activation authority.\nBEGIN;\nDO $hold$ BEGIN RAISE EXCEPTION '${hold}'; END $hold$;\nSET LOCAL lock_timeout='3s';SET LOCAL statement_timeout='30s';\nDO $role$ BEGIN IF session_user<>'postgres' OR current_user<>'postgres' OR current_setting('transaction_isolation')<>'read committed' THEN RAISE EXCEPTION 'Reviewed postgres operator and READ COMMITTED required'; END IF;END $role$;\nLOCK TABLE public.technology_next_shared_snapshots IN SHARE ROW EXCLUSIVE MODE;\nDO $pre$ BEGIN IF (${fingerprint.slice(0,-1)}) IS DISTINCT FROM '${hash}' THEN RAISE EXCEPTION 'Exact sharing scoped metadata preimage differs';END IF;\n${definitions.map((definition,i)=>`IF encode(sha256(convert_to(pg_get_functiondef(${q(signatures[i])}::regprocedure),'UTF8')),'hex') IS DISTINCT FROM '${sha(definition+'\n')}' THEN RAISE EXCEPTION 'Exact sharing predecessor definition differs';END IF;`).join('\n')}\nEND $pre$;\n${body}\nCOMMIT;\n`;
 const forward=make('UNAPPLIED_FINAL_TWO_SHARING_SUCCESSOR',before,oldDefinitions,constraintSql('CHECK(calculator_slug IN('+slugs.map(q).join(',')+'))')+'\n'+nextDefinitions.join(';\n')+';\n'+policy('technology-next-sharing-private-3'));
 if(capture)await writeFile(directory+'/contract-successor.sql',forward);else assert.equal(await readFile(directory+'/contract-successor.sql','utf8'),forward,'Exact independently reconstructed sharing successor required');
 return{forward,before,query,fingerprint,async reverse(){
  const after=await sql(fingerprint);
  const body="DO $rows$ BEGIN IF EXISTS(SELECT 1 FROM public.technology_next_shared_snapshots WHERE calculator_slug IN('ip-subnet-calculator','screen-ppi-calculator')) THEN RAISE EXCEPTION 'Reverse refused: new-two shared snapshots exist; no audit deletion authorized';END IF;END $rows$;\n"+constraintSql(constraint)+'\n'+oldDefinitions.join(';\n')+';\n'+policy('technology-next-sharing-private-2');
  const reverse=make('UNAPPLIED_FINAL_TWO_SHARING_REVERSE',after,nextDefinitions,body);
  if(capture)await writeFile(directory+'/contract-reverse.sql',reverse);else assert.equal(await readFile(directory+'/contract-reverse.sql','utf8'),reverse,'Exact independently reconstructed sharing reverse required');
  return{reverse,after};
 }};
}
