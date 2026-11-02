import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root='docs/first20-publication/',input=root+'input/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const safe=p=>typeof p==='string'&&!p.startsWith('/')&&!p.includes('\\')&&p.split('/').every(s=>s&&s!=='.'&&s!=='..');
export function verifyPackage(){
 const integrity=read(root+'package-integrity.json');
 for(const [original,expected] of Object.entries(integrity.retainedFiles)){
  const storage=integrity.storagePaths[original];assert(safe(original)&&safe(storage));const bytes=fs.readFileSync(input+storage);assert.equal(sha(bytes),expected,'Retained package drift: '+original);
 }
 for(const name of ['MANIFEST-SHA256.json','INPUT-MANIFEST.json'])for(const [original,record] of Object.entries(read(input+name))){const storage=integrity.storagePaths[original];assert(safe(storage));const bytes=fs.readFileSync(input+storage);assert.equal(bytes.length,record.bytes);assert.equal(sha(bytes),record.sha256);}
 return integrity;
}
export function verifyExecutionManifest(){
 const m=read(root+'execution-manifest.json');assert.equal(m.baseline,'cac3becb8957c10452b3a66e882b8a3a1d7ec555');assert.equal(m.releaseHold,true);assert.equal(m.canonicalPromotion,false);assert.equal(m.publicationEligible,0);
 for(const [name,hash] of Object.entries(m.sourceHashes)){assert(safe(name)&&/^(src|tests|scripts|docs)\//.test(name));assert.equal(sha(fs.readFileSync(name)),hash,'Current source binding drift: '+name);}
}
export function project(register,requirements,requests,ranked,numerical,browser){
 assert.equal(register.rows.length,44);assert.equal(new Set(register.rows.map(r=>r.masterId)).size,44);assert.equal(requirements.entries.length,1100);assert.equal(requirements.closed,0);
 assert.equal(ranked.wave1.length,20);assert.equal(new Set(ranked.wave1).size,20);assert(!ranked.wave1.some(id=>[214,217,268].includes(id)));assert.deepEqual([...ranked.wave1,...ranked.wave2,...ranked.wave3].sort((a,b)=>a-b),register.rows.map(r=>r.masterId).sort((a,b)=>a-b));
 assert.deepEqual(numerical.bindings.map(r=>r.masterId),ranked.wave1);assert.equal(numerical.witnesses.length,60);assert.equal(numerical.evaluations.length,60);assert.equal(browser.passed,true);assert.equal(browser.journeys.length,120);
 return ranked.wave1.map(id=>{
  const records=register.rows.filter(r=>r.masterId===id);assert.equal(records.length,1);const row=records[0],binding=numerical.bindings.find(r=>r.masterId===id);assert.deepEqual([row.engineId,row.slug,row.version],[binding.engineId,binding.slug,binding.version]);
  assert.equal(row.canonicalMappingApproved,false);assert.equal(row.fullContractReady,false);assert.equal(row.publicationEligible,false);assert.equal(row.canonicalAccepted,false);assert.equal(row.activationAuthorized,false);
  const entries=requirements.entries.map((r,i)=>({r,i})).filter(x=>x.r.masterId===id);assert.equal(entries.length,25);assert.equal(new Set(entries.map(x=>x.r.requirementId)).size,25);assert(entries.every(x=>x.r.retainedStatus===x.r.originalRequirement.status&&x.r.engineId===row.engineId&&x.r.version===row.version));
  const witnesses=numerical.evaluations.filter(r=>r.masterId===id);assert.equal(witnesses.length,3);assert(witnesses.every(w=>w.immutable&&(w.accepted?w.numericalPass&&w.replayParity&&w.planComputeParity:w.rejectionPass)));
  const journeys=browser.journeys.map((r,i)=>({r,i})).filter(x=>x.r.catalogId===id);assert.equal(journeys.length,6);assert.equal(new Set(journeys.map(x=>x.r.plan+':'+x.r.width)).size,6);assert(journeys.every(x=>x.r.engineId===row.engineId&&x.r.version===row.version));
  const numericalWitness=numerical.witnesses.find(w=>w.masterId===id&&w.kind==='numerical'),boundary=numerical.witnesses.find(w=>w.masterId===id&&w.kind==='boundary');
  assert(numericalWitness&&boundary);const actual=numerical.evaluations.find(w=>w.id===numericalWitness.id).artifact;
  const snapshot={calculatorSlug:row.slug,calculatorVersion:row.version,input:actual.input,output:actual.output};
  assert.deepEqual(journeys.map(x=>x.r.plan+':'+x.r.width).sort(),['free:360','free:1440','pro:360','pro:1440','business:360','business:1440'].sort());
  for(const {r:j} of journeys){assert.deepEqual(j.input,numericalWitness.input);assert.deepEqual(j.output,actual.output);assert.equal(j.artifactSHA256,sha(JSON.stringify(snapshot)));assert.deepEqual(j.boundaryInput,boundary.input);assert.equal(j.boundaryResult,boundary.expected);assert.equal(j.noHorizontalOverflow,true);assert.equal(j.jsonExportAndReplayExecuted,j.plan!=='free');assert.equal(j.freeExportNotOffered,j.plan==='free');assert.equal(j.scenarioCaptureExportExecuted,(j.width===360&&j.plan==='pro')||(j.width===1440&&j.plan==='business'));}
  const reviewer=requests.rows.filter(r=>r.masterId===id);assert.equal(reviewer.length,1);assert.equal(reviewer[0].engineId,row.engineId);assert.equal(reviewer[0].version,row.version);
  return {masterId:id,title:row.title,engineId:row.engineId,slug:row.slug,version:row.version,canonicalScopeStatus:row.canonicalScopeStatus,sourceAndReviewRestrictions:row.sourceAndReviewRestrictions,existingReadiness:row.readiness,reviewerAndSourceRequest:reviewer[0],requirements:entries.map(({r,i})=>({requirementId:r.requirementId,retainedStatus:r.retainedStatus,retainedDisposition:r.disposition,originalRequirementSHA256:r.originalRequirementSHA256,sourcePointer:'input/requirement-dispositions-1100.json#/entries/'+i,fullCriterionSatisfied:false,formalDecision:null})),newEvidence:{actualEngineWitnessIds:witnesses.map(w=>w.id),browserPointers:journeys.map(x=>'browser.json#/journeys/'+x.i),scope:'New bounded scalar/software/workflow evidence only; synthetic accounts, no full-domain or genuine persistence acceptance.'},canonicalAccepted:false,publicationEligible:false,activationAuthorized:false,releaseHold:true};
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 if(process.argv.includes('--check'))verifyExecutionManifest();
 verifyPackage();const paths=['publication-readiness-register-44.json','requirement-dispositions-1100.json','reviewer-and-source-requests-44.json','ranked-review-cohorts.json'];const rows=project(...paths.map(p=>read(input+p)),read(root+'wave1-numerical.json'),read(root+'browser.json'));
 const out={kind:'FIRST20_SOFTWARE_SUPPLEMENTS_NOT_REVIEWER_DECISIONS',baseline:'cac3becb8957c10452b3a66e882b8a3a1d7ec555',baselineCI:{run:41507851529,conclusion:'SUCCESS'},summary:{firstWave:20,retainedAllCohortRequirements:1100,firstWaveRequirements:500,newNumericalBoundaryRejectionWitnesses:60,actualSourceBrowserJourneys:120,formalQaPassesAdded:0,newFullCriterionAcceptances:0,newlyPublicationEligible:0},sourceHashes:Object.fromEntries([...paths.map(p=>input+p),root+'wave1-numerical.json',root+'browser.json'].map(p=>[p,sha(fs.readFileSync(p))])),rows,releaseHold:true};
 const text=JSON.stringify(out,null,2)+'\n',dest=root+'readiness-supplement-20.json';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(dest,'utf8'),text,'First20 supplemental evidence drift');else fs.writeFileSync(dest,text);
 console.log(JSON.stringify(out.summary));
}
