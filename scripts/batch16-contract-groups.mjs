import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const path='docs/full-product-batch14/contract-evidence.json',bytes=await readFile(path),prepared=JSON.parse(bytes);
const ledgerPath='docs/full-product-batch16/requirements-540.json',ledgerBytes=await readFile(ledgerPath),ledger=JSON.parse(ledgerBytes);
if(ledger.sourceHashes[path]!==digest(bytes)||ledger.rows.length!==540)throw Error('Unbound requirement source');
const groups=new Map();
for(const [index,row]of prepared.rows.entries()){
 if(row.implementationClass==='CONTRACT_BLOCKED')continue;
 for(const candidate of row.registeredCandidates){
  if(candidate.technicalStatus!=='EXACT_RUNTIME_IDENTITY'||candidate.associationStatus!=='RECORDED_UNAPPROVED_ASSOCIATION')continue;
  const contractDigest=digest(JSON.stringify({input:candidate.inputStructuralProjection,outputs:candidate.declaredOutputKeys,methodology:candidate.methodology}));
  const key=JSON.stringify([candidate.id,candidate.version,contractDigest]);
  if(!groups.has(key))groups.set(key,{engineId:candidate.id,immutableVersion:candidate.version,projectedContractSHA256:contractDigest,masterIds:[],candidateEvidence:[]});
  const group=groups.get(key);group.masterIds.push(row.masterId);group.candidateEvidence.push(`${path}#/rows/${index}/registeredCandidates/${row.registeredCandidates.indexOf(candidate)}`);
 }
}
const exact=[...groups.values()];
const privateIds=ledger.rows.filter(r=>r.liveAdapter).map(r=>r.masterId);
const registeredIds=ledger.rows.filter(r=>r.requirements.some(q=>q.requirementId==='scenario-workflows'&&q.evidence.length)).map(r=>r.masterId);
const data={schemaVersion:1,sourceHashes:{[path]:digest(bytes),[ledgerPath]:digest(ledgerBytes)},meaning:'Exact runtime implementation/schema-projection groups and explicit shared workflow protocols only. Canonical contracts and applicability are not equated; no witnesses transfer between identities.',technicalGroups:exact,workflowGroups:[{protocol:'existing-private-immutable-packet-and-plan-parity',masterIds:privateIds,evidence:'requirements-540.json: per-row exact adapter witnesses',limitation:'Shared validation/export protocol; each mathematical input/output/domain contract retains its own independent vectors.'},{protocol:'existing-registered-forward-scenario-snapshot',masterIds:registeredIds,evidence:'requirements-540.json: explicit nonfamily registeredWorkflowAssociation evidence',limitation:'Shared capture/history/export envelope; seven exact unapproved associations, different mathematical schemas and engines.'},{protocol:'published-catalog-finder',masterIds:null,membership:'Authoritative runtime publication snapshot only; not inferred from registered/private catalog class.',evidence:['src/components/ai-finder.test.tsx','src/app/api/ai/routes-security.test.ts'],limitation:'Global discovery workflow, not per-ID mathematical or publication acceptance.'}],summary:{nonAuthorityIdentities:497,exactTechnicalGroups:exact.length,multiIdentityTechnicalGroups:exact.filter(g=>g.masterIds.length>1).length,privateWitnessIdentities:privateIds.length,recordedNonFamilyWorkflowIdentities:registeredIds.length,canonicalPromotions:0},releaseHold:true};
const output='docs/full-product-batch16/contract-groups.json',text=JSON.stringify(data,null,2)+'\n';
if(process.argv.includes('--check')){if(await readFile(output,'utf8')!==text)throw Error('Stale exact contract grouping');}else await writeFile(output,text);
console.log(JSON.stringify(data.summary));
