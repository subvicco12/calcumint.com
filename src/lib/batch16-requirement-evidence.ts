/** Exact engineering witnesses are deliberately separate from full product acceptance. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import prepared from '../../docs/full-product-batch14/contract-evidence.json';
import priorRequirements from '../../docs/full-product-batch14/requirements-540.json';
import closure from '../../docs/software-closure/requirements-540.json';
import historical from '../../docs/validation-scale/evidence-540.json';
import {validatePreparedCanonicalEvidence} from './canonical-evidence-preparation';
import {copyCalculationData} from './calculation-snapshot';
import {allContractAdapters,allContractVectors,evaluateScaledContract,scaledContractAdapters} from '../calculators/scaled-contract-adapters';
import {evaluateCanonicalContract} from '../calculators/canonical-contract-adapters';

export type RequirementStatus='VERIFIED'|'PARTIAL'|'BLOCKED'|'UNKNOWN';
type Evidence={path:string;sha256:string};
type Requirement={requirementId:string;status:RequirementStatus;scope:string;evidence:Evidence[]};
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
const paths=['docs/full-product-batch14/contract-evidence.json','docs/full-product-batch14/requirements-540.json','docs/software-closure/requirements-540.json','docs/validation-scale/evidence-540.json','docs/blueprint-reconciliation/blueprint-to-540.json','src/calculators/canonical-contract-vectors.ts','src/calculators/scaled-contract-vectors.ts','src/calculators/canonical-contract-validation.ts','src/calculators/scaled-contract-validation.ts','src/lib/registered-snapshot-replay.test.ts','src/lib/batch16-requirement-evidence.ts','scripts/batch16-requirement-evidence.ts'] as const;
const bounded=['inputs','identity-version','goldens-and-rounding','plan-parity','versioned-replay','tamper-rejection','domain-negative'] as const;
const unproven=['browser-interaction','charts','accessibility','performance'] as const;

export function collectBatch16RequirementEvidence(){
 const contract=validatePreparedCanonicalEvidence(prepared);
 const sourceHashes:Record<string,string>=Object.fromEntries(paths.map(path=>[path,digest(readFileSync(path,'utf8'))]));
 const requirementDefinitions:Record<string,string>={};
 const reference=(path:string,value:unknown):Evidence=>({path,sha256:digest(JSON.stringify(value))});
 const evaluations=allContractAdapters.map(adapter=>scaledContractAdapters.some(a=>a.key===adapter.key)?evaluateScaledContract(adapter.key):evaluateCanonicalContract(adapter.key));
 if(evaluations.length!==79||new Set(evaluations.map(e=>e.catalogId)).size!==79||evaluations.some(e=>!e.engineeringPassed))throw Error('Exact existing independent-engine validation failed');
 if(closure.rows.length!==540||new Set(closure.rows.map(r=>r.masterId)).size!==540)throw Error('Incomplete closure identity set');
 const rows=contract.rows.map((row,index)=>{
  const previous=closure.rows.find(r=>r.masterId===row.masterId);
  const old=historical.rows.find(r=>r.masterId===row.masterId);
  if(!previous||!old||previous.title!==row.title||old.title!==row.title||previous.implementationClass!==row.implementationClass)throw Error('Exact inherited identity mismatch');
  const blocked=row.implementationClass==='CONTRACT_BLOCKED';
  const prior=priorRequirements.rows.find(r=>r.masterId===row.masterId);
  if(!prior||prior.title!==row.title)throw Error('Missing exact original requirements');
  const recordedWorkflow=prior.registeredWorkflowAssociation;
  const workflowCandidate=recordedWorkflow?row.registeredCandidates.find(c=>c.slug===recordedWorkflow.slug&&c.version===recordedWorkflow.version&&c.technicalStatus==='EXACT_RUNTIME_IDENTITY'):null;
  if(recordedWorkflow&&!workflowCandidate)throw Error('Stale exact registered workflow association');
  const workflow=workflowCandidate?.associationStatus==='RECORDED_UNAPPROVED_ASSOCIATION'?recordedWorkflow:null;
  const binding=row.privateAdapterBinding;
  const evaluation=evaluations.find(e=>e.catalogId===row.masterId);
  if(Boolean(binding)!==Boolean(evaluation))throw Error('Unbound live evidence');
  if(binding&&evaluation&&(binding.adapterKey!==evaluation.adapterKey||binding.catalogId!==evaluation.catalogId||binding.engineVersion!==evaluation.engineVersion||JSON.stringify(old.engineeringEvaluation)!==JSON.stringify(evaluation)))throw Error('Historical/live exact adapter evidence differs');
  const inherited=[reference(`docs/full-product-batch14/contract-evidence.json#/rows/${index}`,row),reference(`docs/software-closure/requirements-540.json#/rows/${index}`,previous)];
  const requirements:Requirement[]=bounded.map(requirement=>{
   const checks=evaluation?.checks.flatMap((check,i)=>check.requirement===requirement?[{check,i}]:[])??[];
   if(evaluation&&checks.length===0)throw Error('Missing exact requirement checks');
   requirementDefinitions[requirement]='Only named existing independent vectors for this exact adapter/version; no exhaustive canonical scope, family transfer or browser acceptance.';
   return {requirementId:requirement,status:blocked?'BLOCKED':checks.length?'VERIFIED':'UNKNOWN',scope:'BOUNDED_ENGINE_WITNESSES',evidence:checks.map(({check,i})=>reference(`docs/validation-scale/evidence-540.json#/rows/${index}/engineeringEvaluation/checks/${i}`,check))};
  });
  const add=(requirementId:string,status:RequirementStatus,limitation:string,evidence:Evidence[]=[])=>{requirementDefinitions[requirementId]=limitation;requirements.push({requirementId,status:blocked?'BLOCKED':status,scope:'FULL_PRODUCT_REQUIREMENT',evidence});};
  add('canonical-identity-version-approval','PARTIAL','Recorded candidates and exact technical bindings do not approve canonical identity or feature scope.');
  add('canonical-input-output-feature-scope','PARTIAL','Structural projections and declared outputs preserve candidate scope; complete canonical requirements remain unapproved.');
  add('full-domain-numerical-acceptance',evaluation?'PARTIAL':'UNKNOWN','Named witness coverage is bounded; complete domain and rounding coverage are not established.');
  add('source-publisher-and-applicability','PARTIAL','Exact local source binding preserves source restrictions; publisher bodies and normative applicability are not approved.');
  add('qualified-review','UNKNOWN','Inherited qualified-review restrictions are preserved; metadata does not establish a qualified decision.');
  for(const id of unproven)add(id,'UNKNOWN','No identity-specific independent acceptance evidence is established by these contract checks.');
  for(const id of ['authenticated-history','scenario-workflows','export-workflows'])add(id,evaluation||workflow?'PARTIAL':'UNKNOWN','Only exact private replay or explicitly recorded registered workflow evidence; independent authenticated full-product acceptance remains unestablished.',workflow?[reference(`docs/full-product-batch14/requirements-540.json#/rows/${index}/registeredWorkflowAssociation`,workflow)]:[]);
  add('all-plan-acceptance',evaluation?'PARTIAL':'UNKNOWN','Mathematical plan parity does not establish full product or entitlement acceptance.');
  add('canonical-product-acceptance','BLOCKED','Full canonical input/output/operator scope, mapping and required review remain unapproved.');
  for(const [i,text] of row.retainedCanonicalRequirements.entries())add(`inherited-canonical-requirement-${i+1}`,text.toLowerCase().includes('approval')||text.toLowerCase().includes('unapproved')?'BLOCKED':'UNKNOWN','Exact original requirement text is retained at the per-entry hash-bound evidence pointer; no full-scope acceptance inferred.',[reference(`docs/full-product-batch14/contract-evidence.json#/rows/${index}/retainedCanonicalRequirements/${i}`,text)]);
  const vector=allContractVectors.find(v=>v.id===row.masterId);
  return {masterId:row.masterId,title:row.title,implementationClass:row.implementationClass,disposition:blocked?'AUTHORITY_BLOCKED':'FULL_CONTRACT_REVIEW_REQUIRED',technicalContractEvidence:inherited,liveAdapter:evaluation?{adapterKey:evaluation.adapterKey,catalogId:evaluation.catalogId,engineVersion:evaluation.engineVersion,vector:reference(`${scaledContractAdapters.some(a=>a.catalogId===row.masterId)?'src/calculators/scaled-contract-vectors.ts':'src/calculators/canonical-contract-vectors.ts'}#masterId=${row.masterId}`,vector),existingChecks:evaluation.checks.length}:null,requirements,canonicalAccepted:false,canonicalMappingApproved:false,certificationAuthorized:false,publicationAuthorized:false,releaseHold:true};
 });
 const statuses:Record<RequirementStatus,number>={VERIFIED:0,PARTIAL:0,BLOCKED:0,UNKNOWN:0};
 for(const row of rows)for(const r of row.requirements)statuses[r.status]++;
 return {schemaVersion:1,kind:'EXACT_REQUIREMENT_ENGINEERING_EVIDENCE',sourceHashes,requirementDefinitions,evidenceResolution:'Each requirement references its shared definition by requirementId. Row technicalContractEvidence is the exact common binding context; explicit per-requirement evidence adds narrower checks or original requirement text. Empty evidence does not assert independent acceptance.',summary:{identities:540,reviewRequired:rows.filter(r=>r.disposition==='FULL_CONTRACT_REVIEW_REQUIRED').length,authorityBlocked:rows.filter(r=>r.disposition==='AUTHORITY_BLOCKED').length,exactLiveAdapters:evaluations.length,existingWitnessChecks:evaluations.reduce((n,e)=>n+e.checks.length,0),newIndependentWitnesses:0,canonicalAccepted:0,statuses},limitations:['VERIFIED applies only to the named bounded engineering witness requirement, never canonical product acceptance.','No evidence is transferred between family/component associations or inferred from a shared implementation.','Historical source bindings and canonical counts are preserved; this is not a release authorization.'],rows,releaseHold:true};
}
export type Batch16RequirementEvidence=ReturnType<typeof collectBatch16RequirementEvidence>;
export function validateBatch16RequirementEvidence(raw:unknown):Batch16RequirementEvidence{
 const clean=copyCalculationData({report:raw},{}).input.report;
 const expected=collectBatch16RequirementEvidence();
 if(JSON.stringify(clean)!==JSON.stringify(expected))throw Error('Requirement evidence differs from exact current sources, witnesses or retained restrictions');
 return expected;
}
