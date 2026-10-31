import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const directory='docs/full-product-batch16',check=process.argv.includes('--check');
const paths={ledger:'docs/software-closure/requirements-540.json',register:'docs/authority485/research-input/resolution-register-43.json',handoff:'docs/authority485/research-input/codex-handoff-43.json',qualified:'docs/authority485/research-input/retained-qualified-requirements-11.json',conditional:'docs/conditional-ten/implementation-manifest.json',remaining:'docs/remaining-six/implementation-manifest.json',electricity:'docs/authority485/component-manifest.json'};
const input={},sourceHashes={};
for(const [key,path]of Object.entries(paths)){const bytes=await readFile(path);input[key]=JSON.parse(bytes);sourceHashes[path]=createHash('sha256').update(bytes).digest('hex');}
const ids=input.ledger.rows.filter(r=>r.implementationClass==='CONTRACT_BLOCKED').map(r=>r.masterId);
if(ids.length!==43||new Set(ids).size!==43||JSON.stringify([...ids].sort((a,b)=>a-b))!==JSON.stringify(input.register.rows.map(r=>r.masterId).sort((a,b)=>a-b)))throw Error('Exact retained43 identities required');
const map=rows=>new Map(rows.map((r,i)=>[r.masterId,{row:r,index:i}]));
const original=map(input.register.rows),handoff=map(input.handoff.rows),qualified=map(input.qualified.rows),conditional=map(input.conditional.rows),remaining=map(input.remaining.rows);
const authorized=new Set([9,20,23,95,97,98,112,132,199,204]);
const rows=ids.map(id=>{
 const base=original.get(id),task=handoff.get(id),retained=qualified.get(id);
 if(!base||!task)throw Error('Missing original source case');
 const latest=remaining.get(id)??conditional.get(id),latestPath=remaining.has(id)?paths.remaining:paths.conditional;
 const electricity=id===485?input.electricity:null;
 const currentBlockers=electricity?.remainingFullProductRequirements??latest?.row.deferredBranchesAndFullProductBlockers??latest?.row.fullProductBlockers??task.row.remainingDependencies??[];
 return {masterId:id,title:base.row.title,fullProductStatus:'BLOCKED',canonicalAccepted:false,ownerBoundedEngineeringPreparationAlreadyAuthorized:authorized.has(id),currentBoundedScope:electricity?{componentId:electricity.componentId,nativeFactorGateSatisfied:electricity.nativeGateSatisfiedForSelectedFactor,evidence:paths.electricity}:latest?{status:latest.row.engineeringStatus??latest.row.engineeringState,scope:latest.row.scope??latest.row.implementedProfile??null,evidence:`${latestPath}#/rows/${latest.index}`} :null,
  exactFullProductQuestions:currentBlockers,retainedCurrentEvidenceLimits:latest?.row.remainingEvidenceLimits??[],retainedActiveBoundedPrerequisites:latest?.row.remainingActiveBlockers??[],retainedDeferredBranchConditions:conditional.get(id)?.row.deferredBranchConditions??[],
  currentEvidencePointer: electricity?paths.electricity:latest?`${latestPath}#/rows/${latest.index}`:`${paths.handoff}#/rows/${task.index}`,
  originalRegister:`${paths.register}#/rows/${base.index}`,originalConditionalTasks:`${paths.handoff}#/rows/${task.index}`,
  historicalConditionalDependencies:task.row.remainingDependencies??[],historicalDependenciesAreNotAutomaticallyActiveBlockers:true,
  retainedQualifiedReview:retained?{question:retained.row.qualifiedReviewRequirement,evidence:`${paths.qualified}#/rows/${retained.index}`}:{question:'Preserve the exact applicability and retained-review obligations in the original case; absence from the additional retained11 register is not an exemption.',evidence:`${paths.register}#/rows/${base.index}`},
  requestedReturn:{publisherProvider:'Where still required by the current case: original governing publisher/provider bytes, official URL, revision, operative period, checksum and exact applicable clauses; observation dates are not effective dates.',scopeMapping:'Case-specific complete canonical input/output/features and exact ID/immutable-version binding; existing bounded engineering authorization is not requested again.',qualifiedReview:'Named retained qualified reviewer decision with explicit permitted scope, exclusions and evidence binding; no inferred clinical, institutional, jurisdiction or provider applicability.'},
  acceptanceRule:'Compare returned evidence against the exact current case questions and historical retained obligations. Resolve only demonstrated prerequisites; full canonical acceptance, certification and publication require separate existing gates.',releaseHold:true};
});
const data={schemaVersion:1,kind:'REUSED_SOURCE_REVIEW_REQUESTS_NOT_NEW_RESEARCH_OR_APPROVAL',sourceHashes,summary:{identities:43,alreadyAuthorizedBoundedPreparation:10,qualifiedAdditionalRetainedRecords:input.qualified.rows.length,canonicalPromotions:0},rows,releaseHold:true};
const text=JSON.stringify(data,null,2)+'\n',path=directory+'/authority-requests-43.json';await mkdir(directory,{recursive:true});
if(check){if(await readFile(path,'utf8')!==text)throw Error('Stale authority request package');}else await writeFile(path,text);
console.log(JSON.stringify(data.summary));
