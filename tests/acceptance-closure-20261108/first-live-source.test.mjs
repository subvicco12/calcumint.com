import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const directory='docs/first-live-closure-20261108/';
const json=p=>JSON.parse(readFileSync(p));
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
for(const name of ['src/components/private-workflow-review.tsx','src/components/source-profile-review.tsx','src/components/financial-contract-review.tsx']){
 const old=git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+name]),claim=hash(old);
 test('admits exact validated-history UI successor '+name,()=>assert.equal(verifyCompletionBinding(name,readFileSync(name),claim,git),true));
 test('rejects history UI predecessor reversion '+name,()=>assert.throws(()=>verifyCompletionBinding(name,old,claim,git),/current successor differs/));
 test('rejects unauthorized history UI changes '+name,()=>assert.throws(()=>verifyCompletionBinding(name,Buffer.from('tamper'),claim,git),/current successor differs/));
 test('requires exact history UI provenance '+name,()=>assert.throws(()=>verifyCompletionBinding(name,readFileSync(name),claim,()=>{throw Error('Missing exact source');}),/Missing exact source/));
}
test('native UCUM source archive retains exact publisher Git blobs and fixed unit definitions',()=>{
 const metadata=json(directory+'time-source-capture.json');
 const result=JSON.parse(execFileSync('python3',['-c',`
import json,zipfile,hashlib,xml.etree.ElementTree as E
p=json.load(open('docs/first-live-closure-20261108/time-source-capture.json'))
with zipfile.ZipFile(p['archive']['path']) as z:
 assert z.testzip() is None
 for row in p['files']:
  b=z.read(row['archiveEntry']);assert len(b)==row['bytes'];assert hashlib.sha256(b).hexdigest()==row['sha256'];assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\\0'+b).hexdigest()==row['gitBlob']
 r=E.fromstring(z.read('ucum-essence.xml'));ns={'u':'http://unitsofmeasure.org/ucum-essence'}
 facts={}
 for code in ['min','h','d','wk']:
  v=r.find("u:unit[@Code='"+code+"']/u:value",ns);facts[code]=dict(value=v.attrib['value'],unit=v.attrib['Unit'])
 print(json.dumps(dict(version=r.attrib['version'],date=r.attrib['revision-date'],facts=facts)))
`],{encoding:'utf8'}));
 assert.equal(metadata.commit,'d060c6d3dfe3b0deb196c190b8024d95385e0b92');
 assert.equal(metadata.files[0].sha256,'dfccea1b5dc284245ebae97edd1dc03c45864da4e87df55bc9851797b4fd0b61');
 assert.equal(metadata.files[1].sha256,'f73b71889bfe726c63acb4a36fa0affc19dfc64ee3e49e1dcef4a1308940bef0');
 assert.equal(result.version,'2.2');assert.equal(result.date,'2024-06-17');
 assert.deepEqual(result.facts,{min:{value:'60',unit:'s'},h:{value:'60',unit:'min'},d:{value:'24',unit:'h'},wk:{value:'7',unit:'d'}});
 assert.equal(metadata.formalSourceApplicability,'PENDING_COMPETENT_ADOPTION');assert.match(metadata.sourceDiscrepancy,/864000/);
});
test('unchanged exact time engine passes independently bounded coefficient and numerical checks',()=>{
 const receipt=json(directory+'time-precision-evidence.json'),record=receipt.result;
 assert.equal(receipt.exitCode,0);assert.equal(hash(readFileSync(record.source)),record.sourceSha256);
 const raw=execFileSync(process.execPath,['tests/first-live-closure-20261108/time-precision-bound.mjs'],{encoding:'utf8'});const actual=JSON.parse(raw);
 assert.deepEqual(actual,record);
});
test('first-live ledger preserves540 dispositions and records15individual history scopes only',()=>{
 const raw=readFileSync('docs/acceptance-continuation-20261108/requirements-540.json'),old=JSON.parse(raw),current=json(directory+'requirements-540.json');
 assert.equal(hash(raw),current.parentLedgerSHA256);assert.equal(current.rows.length,540);assert.deepEqual(current.counts,old.counts);
 const ids=[21,32,36,43,46,49,82,126,133,468,469,470,472,488,516];
 for(let i=0;i<540;i++){
  const row=current.rows[i],prior=old.rows[i];assert.equal(row.masterId,i+1);assert.equal(row.disposition,prior.disposition);assert.equal(row.canonicalAccepted,false);assert.equal(row.certificationGranted,false);assert.equal(row.publicationEligibleEstablished,false);
  assert.deepEqual(row.newScopedChecks.slice(0,prior.newScopedChecks.length),prior.newScopedChecks);
  assert.equal(row.newScopedChecks.length-prior.newScopedChecks.length,(ids.includes(i+1)?1:0)+(i+1===432?2:0));
 }
 assert.equal(current.newFullEngineeringComplete,0);assert.equal(current.newPublicationEligible,0);
});
test('440packet has no manufactured signer or authority from one observed owner role',()=>{
 const p=json(directory+'440-decision-packet.json'),roles=json(directory+'review-capability-counts.json');assert.deepEqual(roles.activeRoleCounts,{owner:1});assert.equal(roles.identityCollected,false);assert.equal(roles.identityIndependenceCompetenceAssignmentEstablished,false);
 assert(Object.values(p.actualCompetentReviewer).every(v=>v===null));assert.equal(p.goNoGo,'NO_GO_FOR_CERTIFICATION_OR_PUBLICATION');assert.equal(p.certificationGranted,false);assert.equal(p.publicationAuthorized,false);assert.equal(p.newPublicationEligible,0);
 assert.equal(hash(readFileSync(p.engineBinding.path)),p.engineBinding.sha256);
});
test('native history receipt covers30individual profile/viewport recoveries with original imports',()=>{
 const d=json(directory+'history-browser-report.json');assert.equal(d.passed,true);assert.equal(d.journeys.length,30);
});
