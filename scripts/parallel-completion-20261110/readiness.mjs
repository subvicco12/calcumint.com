/** Read-only composition of retained ledgers. Never writes approval or catalog state. */
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
export const categories = Object.freeze({
 'reusable-implementation':{label:'Reusable implementation',level:'shared',requirements:['plan-parity','versioned-replay','tamper-rejection']},
 'calculator-specific-engine':{label:'Calculator-specific engine',level:'individual',requirements:['inputs','domain-negative','goldens-and-rounding']},
 'final-renderer-ui':{label:'Final renderer UI',level:'individual',requirements:['browser-interaction','charts','accessibility','performance']},
 'business-delivery':{label:'Business delivery',level:'shared-and-individual',requirements:['authenticated-history','scenario-workflows','export-workflows','all-plan-acceptance']},
 'numerical-source-evidence':{label:'Numerical/source evidence',level:'individual',requirements:['full-domain-numerical-acceptance','source-publisher-and-applicability']},
 'independent-qa':{label:'Independent QA',level:'individual',requirements:['full-domain-numerical-acceptance','browser-interaction','accessibility']},
 'identity-scope-decisions':{label:'Identity/scope decisions',level:'individual',requirements:['canonical-identity-version-approval','canonical-input-output-feature-scope']},
 'competent-acceptance':{label:'Competent acceptance',level:'individual',requirements:['qualified-review','canonical-product-acceptance']},
 'production-adoption-publication':{label:'Production adoption/publication',level:'shared-and-individual',requirements:[]}
});
const paths={inventory:'docs/product-completion-20261108/inventory-540.json',ledger:'docs/thirteen-program-20261110/requirements-540.json',authority:'docs/full-product-batch16/authority-requests-43.json',classification:'docs/calculator-sprint-20261108/authority-43.json',effort:'docs/full-product-batch22/remaining-work-queue.json',sixEffort:'docs/full-six/input/engineering-effort-estimate.json'};
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function projectRequirement(requirement,pointer){
 return {requirementId:requirement.requirementId,status:requirement.status,scope:requirement.scope,evidence:requirement.evidence??[],retainedPointer:pointer,fullScopeEstablished:requirement.status==='VERIFIED'&&requirement.scope==='FULL_PRODUCT_REQUIREMENT'&&(requirement.evidence??[]).length>0};
}
// A report of actual authority only: no approval import, title mapping, or positive transitions.
export function releaseCandidate(row,inventory){
 const reasons=[];
 if(!Number.isInteger(row.masterId)||row.masterId<1||row.masterId>540)reasons.push('invalid or missing master identity');
 if(inventory.masterId!==row.masterId)reasons.push('inventory identity mismatch');
 for(const key of ['canonicalAccepted','certificationGranted','publicationEligibleEstablished'])if(row[key]!==true)reasons.push(key+': not affirmatively established');
 if(inventory.canonicalCompleteAndCertified!==true)reasons.push('retained full-scope certification absent');
 if(!inventory.engineSourceBindings?.length)reasons.push('exact identity/version binding absent');
 for(const binding of inventory.engineSourceBindings??[]){
  if(!binding.engineId||!Number.isInteger(binding.version)||binding.version<1)reasons.push('invalid exact identity/version');
  if(binding.historicalExactSourceProof!=='VERIFIED_CURRENT_EXACT_VERSION')reasons.push('exact source/version proof is stale or unestablished');
  if(!binding.sourceLocators?.length)reasons.push('source locators absent');
  for(const source of binding.sourceLocators??[]){try{if(sha(readFileSync(source.path))!==source.sha256)reasons.push('source bytes changed: '+source.path);}catch{reasons.push('source bytes unavailable: '+source.path);}}
 }
 for(const requirement of inventory.requirements??[])if(!projectRequirement(requirement,'').fullScopeEstablished)reasons.push('full scope not established: '+requirement.requirementId);
 if(!inventory.requirements?.length)reasons.push('requirements missing');
 for(const id of new Set(Object.values(categories).flatMap(category=>category.requirements)))if(!inventory.requirements?.some(r=>r.requirementId===id))reasons.push('required dimension missing: '+id);
 // Existing records have no affirmative production authority. Missing is never treated as exemption.
 if(row.productionAdoptionAuthorized!==true)reasons.push('production adoption authorization absent');
 return {masterId:row.masterId,eligible:reasons.length===0,reasons};
}
export function buildReport(){
 const input={},sourceHashes={};for(const [key,path]of Object.entries(paths)){const bytes=readFileSync(path);input[key]=JSON.parse(bytes);sourceHashes[path]=sha(bytes);}
 const ids=input.ledger.rows.map(r=>r.masterId);if(ids.length!==540||new Set(ids).size!==540)throw Error('Retained exact540 ledger required');
 const inventory=new Map(input.inventory.rows.map((r,i)=>[r.masterId,{row:r,index:i}]));
 const rows=input.ledger.rows.map((row,i)=>{
  const original=inventory.get(row.masterId);if(!original||original.row.title!==row.title)throw Error('Identity/title mismatch');
  const grouped=Object.fromEntries(Object.entries(categories).map(([key,category])=>[key,{gapLevel:category.level,status:'FULL_SCOPE_NOT_ESTABLISHED',requirements:category.requirements.map(id=>{const index=original.row.requirements.findIndex(r=>r.requirementId===id);return index<0?{requirementId:id,status:'UNKNOWN',missingFromRetainedLedger:true,fullScopeEstablished:false}:projectRequirement(original.row.requirements[index],`${paths.inventory}#/rows/${original.index}/requirements/${index}`);}),sharedImplementationDoesNotApproveIndividualIdentity:true}]));
  return {masterId:row.masterId,title:row.title,retainedDisposition:row.disposition,ledgerPointer:`${paths.ledger}#/rows/${i}`,inventoryPointer:`${paths.inventory}#/rows/${original.index}`,exactBindings:original.row.engineSourceBindings,categories:grouped,remainingEngineeringHours:null,release:releaseCandidate(row,original.row)};
 });
 if(input.authority.rows.length!==43||new Set(input.authority.rows.map(r=>r.masterId)).size!==43)throw Error('Exact43 authority register required');
 const categorySummaries=Object.fromEntries(Object.entries(categories).map(([key,category])=>{
  const requirements=rows.flatMap(row=>row.categories[key].requirements);
  const statusCounts={VERIFIED:0,PARTIAL:0,BLOCKED:0,UNKNOWN:0};for(const requirement of requirements)statusCounts[requirement.status]=(statusCounts[requirement.status]??0)+1;
  return [key,{label:category.label,gapLevel:category.level,identities:rows.length,retainedRequirementOccurrences:requirements.filter(r=>!r.missingFromRetainedLedger).length,statusCounts,fullScopeProofCount:requirements.filter(r=>r.fullScopeEstablished).length,unknownCount:requirements.filter(r=>r.status==='UNKNOWN').length,missingRequirementCount:requirements.filter(r=>r.missingFromRetainedLedger).length,identitiesWithUnestablishedFullScope:rows.filter(row=>key==='production-adoption-publication'?!row.release.eligible:row.categories[key].requirements.some(r=>!r.fullScopeEstablished)).length,missingProductionAuthorizationCount:key==='production-adoption-publication'?input.ledger.rows.filter(row=>row.productionAdoptionAuthorized!==true).length:null,remainingEngineeringHours:null}];
 }));
 const classifications=new Map(input.classification.rows.map(r=>[r.masterId,r]));
 const authorityQueue=input.authority.rows.map((r,i)=>{if(!classifications.has(r.masterId)||!ids.includes(r.masterId))throw Error('Unbound authority case');return {masterId:r.masterId,title:r.title,status:'AWAITING_CASE_SPECIFIC_AUTHORITY',hours:null,classification:classifications.get(r.masterId).classification.categories,exactQuestions:r.exactFullProductQuestions,requestedReturn:r.requestedReturn,qualifiedReview:r.retainedQualifiedReview,currentEvidencePointer:r.currentEvidencePointer,originalRegister:r.originalRegister,originalConditionalTasks:r.originalConditionalTasks,requestPointer:`${paths.authority}#/rows/${i}`,boundedPreparationAlreadyAuthorized:r.ownerBoundedEngineeringPreparationAlreadyAuthorized,acceptanceRule:r.acceptanceRule,canonicalPromotion:false};});
 return {schemaVersion:1,kind:'RETAINED_REQUIREMENT_PROJECTION_NOT_NEW_INVENTORY_OR_APPROVAL',sourceHashes,categories,categorySummaries,categoryCountingRule:'Categories overlap: repeated requirement IDs are references to the same retained per-ID requirement. Do not sum category counts as unique requirements, tasks, missing code, or engineering hours.',summary:{identities:rows.length,retainedRequirements:input.inventory.rows.reduce((n,r)=>n+r.requirements.length,0),authorityActions:authorityQueue.length,releaseCandidates:rows.filter(r=>r.release.eligible).length,canonicalPromotions:0},releaseHold:true,rows,authorityQueue,effort:{basis:'Historical scoped estimates retained without re-estimating completed work or extrapolating to540. Current remaining hours UNKNOWN until each task is reconciled against new lane evidence.',currentRemainingEngineeringHours:null,historicalBatch22Tasks:input.effort.tasks,historicalSixCandidateEstimate:input.sixEffort,unestimatedScope:['Per-ID remaining implementation, renderer and Business delivery across540','43 authority decisions and competent acceptance','Production adoption and external wait time'],sumHistoricalRanges:false}};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const report=buildReport(),dir='docs/parallel-completion-20261110/readiness',out=dir+'/projection.json',bytes=JSON.stringify(report,null,2)+'\n';if(process.argv.includes('--check')){if(readFileSync(out,'utf8')!==bytes)throw Error('Stale readiness projection');}else{mkdirSync(dir,{recursive:true});writeFileSync(out,bytes);}console.log(JSON.stringify(report.summary));}
