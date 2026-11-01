/** Offline exact delta only; no lifecycle, certification, SQL or publication API. */
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='docs/full-product-batch21/';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=async file=>JSON.parse(await readFile(file,'utf8'));
const inputs=['docs/calculator-first/publication-readiness-540.json','docs/calculator-first/registry-snapshot.json','docs/calculator-first/hosted-rows.json','docs/full-product-batch16/requirements-540.json',root+'candidates-17.json',root+'six-contract-evidence.json',root+'red-witnesses.json',root+'hosted-lifecycle-observation.json',root+'lifecycle-preparation-17.json'];
const [prior,registry,hosted,requirements,,,red,current,proposal]=await Promise.all(inputs.map(read));
assert.equal(proposal.rows.length,17);assert(proposal.notExecutable&&proposal.submissionAuthorized===false);assert(proposal.rows.every(r=>r.draftStartProposal.lifecycle==='draft'&&r.publicationEligible===false&&r.qaPreparation.every(q=>q.status==='pending')));
assert.equal(prior.rows.length,540);assert.equal(requirements.rows.reduce((n,r)=>n+r.requirements.length,0),14293);
const bySlug=new Map(registry.rows.map(r=>[r.slug,r]));
const hostedSlugs=new Set(hosted.rows.map(r=>r.slug));
const defectSlugs=[...new Set(red.runs.slice(0,2).flatMap(r=>r.cases.filter(c=>c.status==='failed').map(c=>c.title.split(' ')[0].replaceAll("'",'')).filter(slug=>hostedSlugs.has(slug))))].sort();
assert.equal(defectSlugs.length,135,'Count only demonstrated route defects, not nine prior rejection witnesses');
const workflowSlugs=red.runs[2].cases.filter(c=>c.status==='failed').map(c=>c.title.split(' ')[0].replaceAll("'",''));
const workflows=[...new Set(workflowSlugs)].sort();assert.equal(workflows.length,18);
const six=new Map([[235,'graphing-calculator'],[251,'function-plotter-2d'],[275,'volume-calculator'],[276,'slope-calculator'],[282,'standard-deviation-calculator'],[283,'variance-calculator']]);
const rows=prior.rows.map(row=>{
 const observed=row.candidates.filter(c=>c.exactCurrentBinding);
 const routes=observed.filter(c=>defectSlugs.includes(c.slug)||workflows.includes(c.slug));
 return {masterId:row.masterId,title:row.title,publicationDispositionBefore:row.disposition,publicationDispositionAfter:row.disposition,canonicalMappingApproved:row.canonicalMappingApproved,canonicalAccepted:row.canonicalAccepted,publicationEligibleEstablished:false,engineeringEvidence:routes.map(c=>({slug:c.slug,engineId:c.engineId,version:c.version,associationBasis:c.basis,supportsCanonicalRequirementClosure:false,canonicalBindingApproved:false,newChecks:[...(defectSlugs.includes(c.slug)?['required-input-rejection','valid-zero','error-recovery','plan-math-parity']:[]),...(workflows.includes(c.slug)?['native-account-capture-binding','invalid-output-suppression']:[])],meaning:c.identityCandidate?'Bounded observed exact titled legacy candidate evidence; no full canonical acceptance':'Support/family association only; checks are NOT transferred to canonical scope'})),sixCandidate:six.has(row.masterId)?{slug:six.get(row.masterId),engine:bySlug.get(six.get(row.masterId)),scope:'Bounded six-candidate UI/native forward replay only; exact domain, source/applicability, qualified review and lifecycle gates remain pending'}:null,retainedRequirementsPointer:`docs/full-product-batch16/requirements-540.json#/rows/${row.masterId-1}/requirements`};
});
assert.equal(rows.filter(r=>r.publicationDispositionAfter==='AUTHORITY_BLOCKED').length,43);
const report={baseline:'9d82dcf2cd63cf64bf5ef37ff993158cda48e14c',kind:'ADDITIVE_CALCULATOR_ENGINEERING_DELTA_NOT_ACCEPTANCE',summary:{catalogIdentities:540,originalRequirements:14293,livePublicEngineCount:current.rows.reduce((n,r)=>n+(r.lifecycle==='published'?Number(r.identities):0),0),observedLegacyTitledLiveBindings:prior.summary.liveCatalogBindings,approvedCanonicalLiveBindings:prior.rows.filter(r=>r.canonicalMappingApproved&&r.disposition==='LIVE_VERIFIED').length,newlyEstablishedPublicationEligible:0,engineeringBlocked:prior.summary.dispositions.ENGINEERING_BLOCKED,certificationBlocked:prior.summary.dispositions.CERTIFICATION_BLOCKED,authorityBlocked:prior.summary.dispositions.AUTHORITY_BLOCKED,unknown:prior.summary.dispositions.UNKNOWN,demonstratedRouteDefectsFixed:defectSlugs.length,accountWorkflowRoutesAdded:workflows.length,sixCandidatesImproved:6},defectRoutes:defectSlugs.map(slug=>{const d=bySlug.get(slug);assert(d);return {slug,engineId:d.engineId,version:d.version,url:'https://calcumint.com'+d.route};}),newAccountWorkflowRoutes:workflows.map(slug=>{const d=bySlug.get(slug);assert(d);return {slug,engineId:d.engineId,version:d.version,url:'https://calcumint.com'+d.route};}),rows,orderedReleaseManifest:[],conditionalReviewOrder:[235,251,275,276,282,283],eligibility:'No positive eligibility is fabricated from local certification labels or bounded tests; exact hosted source/QA/reviewer/lifecycle and complete canonical decisions remain absent.',sourceHashes:Object.fromEntries(await Promise.all(inputs.map(async file=>[file,hash(await readFile(file))]))),releaseHold:true,productionWrites:false,canonicalPromotion:false};
const text=JSON.stringify(report,null,2)+'\n',file=root+'readiness-delta-540.json';
if(process.argv.includes('--check'))assert.equal(await readFile(file,'utf8'),text,'Exact Batch21 evidence differs');else await writeFile(file,text);
console.log(JSON.stringify(report.summary));
