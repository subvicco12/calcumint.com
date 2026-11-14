import test from 'node:test';
import assert from 'node:assert/strict';
import {buildReport,categories,projectRequirement,releaseCandidate} from '../../scripts/parallel-completion-20261110/readiness.mjs';
test('retains all540 identities,14293 requirements and exact43 authority cases without promotion',()=>{
 const report=buildReport();assert.deepEqual(report.summary,{identities:540,retainedRequirements:14293,authorityActions:43,releaseCandidates:0,canonicalPromotions:0});
 assert.equal(Object.keys(categories).length,9);assert.equal(Object.keys(report.categorySummaries).length,9);
 for(const [key,summary]of Object.entries(report.categorySummaries)){const requirements=report.rows.flatMap(row=>row.categories[key].requirements);assert.equal(Object.values(summary.statusCounts).reduce((a,b)=>a+b,0),requirements.length);assert.equal(summary.unknownCount,requirements.filter(r=>r.status==='UNKNOWN').length);assert.equal(summary.fullScopeProofCount,requirements.filter(r=>r.fullScopeEstablished).length);assert.equal(summary.remainingEngineeringHours,null);}
 assert.ok(report.rows.every(row=>row.ledgerPointer.startsWith('docs/thirteen-program-20261110/requirements-540.json#')));assert.equal(new Set(report.rows.map(r=>r.masterId)).size,540);
 for(const row of report.rows){assert.equal(Object.keys(row.categories).length,9);assert.equal(row.release.eligible,false);assert.equal(row.remainingEngineeringHours,null);}
 assert.equal(report.effort.currentRemainingEngineeringHours,null);assert.equal(report.effort.sumHistoricalRanges,false);
});
test('bounded VERIFIED witness cannot establish full product scope',()=>{
 assert.equal(projectRequirement({requirementId:'inputs',status:'VERIFIED',scope:'BOUNDED_ENGINE_WITNESSES',evidence:['x']},'x').fullScopeEstablished,false);
 assert.equal(projectRequirement({requirementId:'inputs',status:'VERIFIED',scope:'FULL_PRODUCT_REQUIREMENT',evidence:[]},'x').fullScopeEstablished,false);
});
test('bulk boolean promotion cannot bypass per-ID evidence, adoption or exact versions',()=>{
 const report=buildReport();for(const row of report.rows){const decision=releaseCandidate({...row,canonicalAccepted:true,certificationGranted:true,publicationEligibleEstablished:true},{canonicalCompleteAndCertified:true,engineSourceBindings:[],requirements:[]});assert.equal(decision.eligible,false);assert.ok(decision.reasons.includes('production adoption authorization absent'));}
});
test('affirmative approval booleans cannot hide stale source/version or missing requirements',()=>{
 assert.equal(releaseCandidate({},{}).eligible,false);
 const decision=releaseCandidate({masterId:1,canonicalAccepted:true,certificationGranted:true,publicationEligibleEstablished:true,productionAdoptionAuthorized:true},{canonicalCompleteAndCertified:true,engineSourceBindings:[{engineId:'x',version:0,historicalExactSourceProof:'VERIFIED_CURRENT_EXACT_VERSION',sourceLocators:[{path:'scripts/parallel-completion-20261110/readiness.mjs',sha256:'stale'}]}],requirements:[]});
 assert.equal(decision.eligible,false);assert.ok(decision.reasons.includes('invalid exact identity/version'));assert.ok(decision.reasons.some(r=>r.startsWith('source bytes changed')));assert.ok(decision.reasons.includes('requirements missing'));
});
test('authority actions preserve exact per-case questions and do not request bounded authorization again',()=>{
 const report=buildReport();for(const task of report.authorityQueue){assert.ok(task.originalRegister);assert.ok(task.requestPointer);assert.equal(task.canonicalPromotion,false);assert.equal(task.hours,null);assert.ok(task.requestedReturn.scopeMapping);}
});
