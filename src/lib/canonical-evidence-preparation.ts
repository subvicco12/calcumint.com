/** Offline technical preparation. No canonical identity approval or lifecycle authority. */
import {copyCalculationData} from './calculation-snapshot';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {calculatorRegistry} from '../calculators/registry';
import {buildImplementationReconciliation} from '../calculators/implementation-reconciliation';
import {allContractAdapters} from '../calculators/scaled-contract-adapters';
import {parseMasterCatalogCsv} from '../calculators/catalog-csv-ingestion';
import prior from '../../docs/full-product-batch13/requirements-540.json';
import blueprint from '../../docs/blueprint-reconciliation/blueprint-to-540.json';

export type TechnicalIdentity={id:string;slug:string;version:number};
export type CandidateIdentity=TechnicalIdentity&{basis:string};
/** Titles are master identities, never aliases for resolving runtime definitions. */
export function validateTechnicalIdentity(master:{masterId:number;title:string},record:{masterId:number;title:string},candidate:CandidateIdentity,runtime:readonly TechnicalIdentity[]):void{
 if(master.masterId!==record.masterId||master.title!==record.title)throw Error('Exact master ID/title mismatch');
 if(!Number.isSafeInteger(candidate.version)||candidate.version<1||!candidate.basis)throw Error('Invalid immutable candidate identity');
 if(new Set(runtime.map(r=>r.id)).size!==runtime.length||new Set(runtime.map(r=>r.slug)).size!==runtime.length)throw Error('Duplicate runtime identity');
 const byId=runtime.find(r=>r.id===candidate.id),bySlug=runtime.find(r=>r.slug===candidate.slug);
 if(!byId||byId!==bySlug||byId.version!==candidate.version)throw Error('Candidate ID/slug/version mismatch; aliases and upgrades forbidden');
}
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
const sourcePaths=['data/catalog/master-catalog-2026.csv','docs/full-product-batch13/requirements-540.json','docs/blueprint-reconciliation/blueprint-to-540.json','docs/canonical-acceptance/canonical-ledger.json','src/calculators/registry.ts','src/calculators/implementation-reconciliation.ts','src/calculators/scaled-contract-adapters.ts','src/lib/canonical-evidence-preparation.ts','src/lib/calculation-snapshot.ts'] as const;
export function prepareCanonicalContractEvidence(){
 const master=parseMasterCatalogCsv(readFileSync(sourcePaths[0],'utf8'));
 const actual=buildImplementationReconciliation();
 const runtime=calculatorRegistry.list();
 if(master.length!==540||prior.rows.length!==540||blueprint.rows.length!==540)throw Error('Incomplete 540 identity source');
 for(const rows of [prior.rows,blueprint.rows,actual.rows])if(new Set(rows.map(r=>r.masterId)).size!==540)throw Error('Duplicate source master identity');
 const rows=master.map(identity=>{
  const previous=prior.rows.find(r=>r.masterId===identity.masterId)!;
  const trace=blueprint.rows.find(r=>r.masterId===identity.masterId)!;
  const observed=actual.rows.find(r=>r.masterId===identity.masterId)!;
  if(!previous||!trace||!observed||[previous.title,trace.title,observed.title].some(t=>t!==identity.title)||previous.implementationClass!==observed.implementationClass)throw Error('Stale master mapping or implementation classification');
  if(JSON.stringify(previous.observedRegisteredBindings)!==JSON.stringify(observed.registeredEvidence))throw Error('Stale registered association');
  const candidates=observed.registeredEvidence.map(candidate=>{
   let technicalStatus:'EXACT_RUNTIME_IDENTITY'|'REJECTED_IDENTITY_MISMATCH'='EXACT_RUNTIME_IDENTITY';
   try{validateTechnicalIdentity(identity,previous,candidate,runtime);}catch{technicalStatus='REJECTED_IDENTITY_MISMATCH';}
   const definition=technicalStatus==='EXACT_RUNTIME_IDENTITY'?runtime.find(d=>d.id===candidate.id):undefined;
   const metadata=actual.engines.find(d=>d.id===candidate.id);
   return {...candidate,technicalStatus,associationStatus:candidate.basis==='FAMILY_VARIANT'?'PROPOSED_FAMILY_ASSOCIATION':'RECORDED_UNAPPROVED_ASSOCIATION',canonicalMappingApproved:false,inputStructuralProjection:definition?metadata?.inputContract:null,declaredOutputKeys:definition?metadata?.declaredExampleOutputKeys:[],methodology:definition?{formulas:definition.formulas,sources:definition.sources}:null};
  });
  const binding=previous.privateAdapterBinding;
  if(binding){const adapter=allContractAdapters.find(a=>a.key===binding.adapterKey);if(!adapter||adapter.catalogId!==identity.masterId||adapter.catalogId!==binding.catalogId||adapter.version!==binding.engineVersion)throw Error('Stale private adapter identity/version');}
  return {...identity,implementationClass:observed.implementationClass,registeredCandidates:candidates,privateAdapterBinding:binding,privateContracts:observed.privateImplementations,componentAssociations:observed.componentBindings,sourceAndReviewRestrictions:trace.sourceAndReviewRestrictions,blueprintTrace:previous.blueprintTrace,retainedCanonicalRequirements:previous.inheritedCanonicalRequirements,canonicalMappingApproved:false,canonicalAccepted:false,certificationAuthorized:false,publicationAuthorized:false,releaseHold:true};
 });
 const sourceHashes=Object.fromEntries(sourcePaths.map(path=>[path,digest(readFileSync(path,'utf8'))]));
 const body={schemaVersion:1,kind:'TECHNICAL_CONTRACT_EVIDENCE_PREPARATION',sourceHashes,implementationSourceSnapshot:actual.implementationSnapshot,limitations:['Zod JSON Schema is a structural projection; refinements, complete outputs and canonical mathematical scope are not proven.','Declared output keys and authored examples are metadata, not independent mathematical acceptance.','Exact technical identity does not approve family associations, private/component scope, source applicability or publication.'],summary:{identities:rows.length,registeredCandidates:rows.reduce((n,r)=>n+r.registeredCandidates.length,0),rejectedCandidates:rows.flatMap(r=>r.registeredCandidates).filter(c=>c.technicalStatus==='REJECTED_IDENTITY_MISMATCH').length,privateAdapterBindings:rows.filter(r=>r.privateAdapterBinding).length,canonicalAccepted:0},rows};
 // Normalize trusted repository metadata to the exact exported JSON representation.
 // Zod structural projections may carry non-enumerable implementation annotations.
 const result={...body,contentSHA256:digest(JSON.stringify(body))};
 return JSON.parse(JSON.stringify(result)) as typeof result;
}
export type CanonicalContractEvidence=ReturnType<typeof prepareCanonicalContractEvidence>;
/** Recompute from current sources, rejecting tamper, stale source hashes and governance changes. */
export function validatePreparedCanonicalEvidence(raw:unknown):CanonicalContractEvidence{
 const clean=copyCalculationData({value:raw},{}).input.value;
 const expected=prepareCanonicalContractEvidence();
 if(JSON.stringify(clean)!==JSON.stringify(expected))throw Error('Prepared evidence differs from current exact sources, identities or preserved restrictions');
 return expected;
}
