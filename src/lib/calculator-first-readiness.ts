/** Read-only evidence reconciliation. This module cannot certify, route or publish calculators. */
type Candidate={currentId?:string;currentVersion?:number;slug:string;basis:string;exactCurrentBinding?:boolean};
type Requirement={requirementId:string;status:string;scope?:string;evidence?:readonly unknown[]};
type Inputs={
 catalog:readonly {masterId:number;title:string}[];
 ledger:readonly {masterId:number;implementationClass:string;canonicalAccepted:boolean;observedContracts:{registeredCandidates:readonly Candidate[];privateCandidates?:readonly unknown[]}}[];
 requirements:readonly {masterId:number;canonicalMappingApproved:boolean;requirements:readonly Requirement[]}[];
 registry:readonly {engineId:string;slug:string;version:number;title:string;route:string|null;reviewStatus:string;certificationSoftwareIssues:readonly string[]}[];
 hosted:readonly {calculator_key:string;slug:string;version:number;title:string;lifecycle:string}[];
 routes:readonly {slug:string;url:string;status:number|null;finalUrl?:string;h1?:string|null;canonical?:string|null;displayedVersion?:number|null;inputControls?:number}[];
 hostedComplete:boolean;
};
function index<T>(rows:readonly T[],key:(row:T)=>string|number){
 const map=new Map<string|number,T>();for(const row of rows){const id=key(row);if(map.has(id))throw Error('Duplicate evidence identity: '+id);map.set(id,row);}return map;
}
export function buildCalculatorFirstReadiness(input:Inputs){
 const catalog=index(input.catalog,r=>r.masterId),ledger=index(input.ledger,r=>r.masterId),requirements=index(input.requirements,r=>r.masterId);
 if(catalog.size!==ledger.size||catalog.size!==requirements.size||[...catalog.keys()].some(id=>!ledger.has(id)||!requirements.has(id)))throw Error('Catalog/ledger requirement coverage mismatch');
 const registry=index(input.registry,r=>r.engineId),hosted=index(input.hosted,r=>r.slug),routes=index(input.routes,r=>r.slug);
 index(input.registry,r=>r.slug);index(input.hosted,r=>r.calculator_key);
 const owners=new Map<string,Set<number>>();
 for(const row of input.ledger)for(const c of row.observedContracts.registeredCandidates){
  const d=c.currentId?registry.get(c.currentId):undefined,identity=catalog.get(row.masterId);
  if(c.exactCurrentBinding&&d&&identity&&d.slug===c.slug&&d.version===c.currentVersion&&['RECORDED_CANDIDATE_NOT_CANONICAL_MAPPING','ENGINE_CONTRACT_MATCH'].includes(c.basis)&&d.title.toLocaleLowerCase('en-US')===identity.title.toLocaleLowerCase('en-US')){
   const key=d.engineId+'@'+d.version;const ids=owners.get(key)??new Set<number>();ids.add(row.masterId);owners.set(key,ids);
  }
 }
 const liveEngine=(slug:string)=>{
  const h=hosted.get(slug),o=routes.get(slug),d=h?registry.get(h.calculator_key):undefined;
  // Title, URL and displayed immutable version are independent public observations.
  return Boolean(input.hostedComplete&&h?.lifecycle==='published'&&d?.slug===slug&&d.version===h.version&&o?.h1===h.title&&o?.status===200&&o.url===o.canonical&&o.finalUrl===o.url&&o.url==='https://calcumint.com'+d.route&&o.url.startsWith('https://calcumint.com/calculators/')&&o.displayedVersion===h.version&&(o.inputControls??0)>0);
 };
 const rows=input.catalog.map(identity=>{
  const prior=ledger.get(identity.masterId)!,contract=requirements.get(identity.masterId)!;
  const candidates=prior.observedContracts.registeredCandidates.map(c=>{
   const d=c.currentId?registry.get(c.currentId):undefined,h=hosted.get(c.slug),o=routes.get(c.slug);
   const exact=Boolean(c.exactCurrentBinding&&d&&d.slug===c.slug&&d.version===c.currentVersion);
   const identityCandidate=c.basis==='RECORDED_CANDIDATE_NOT_CANONICAL_MAPPING'||c.basis==='ENGINE_CONTRACT_MATCH';
   const identityMatch=Boolean(exact&&identityCandidate&&d?.title.toLocaleLowerCase('en-US')===identity.title.toLocaleLowerCase('en-US'));
   const sharedCatalogIds=[...(owners.get((c.currentId??'')+'@'+c.currentVersion)??[])];
   const live=Boolean(sharedCatalogIds.length===1&&identityMatch&&h&&h.calculator_key===d?.engineId&&h.version===d.version&&o?.h1===d.title&&o.url==='https://calcumint.com'+d.route&&liveEngine(c.slug));
   return {engineId:c.currentId??null,version:c.currentVersion??null,slug:c.slug,basis:c.basis,sharedCatalogIds,exactCurrentBinding:exact,identityCandidate:identityMatch,canonicalMappingApproved:contract.canonicalMappingApproved,proposedUrl:d?.route?'https://calcumint.com'+d.route:null,lifecycle:input.hostedComplete?(h?.lifecycle??'UNPUBLISHED_ABSENT'):'UNKNOWN',hostedIdentityMatches:Boolean(h&&d&&h.calculator_key===d.engineId&&h.version===d.version),httpStatus:o?.status??null,observedUrl:o?.url??null,displayedVersion:o?.displayedVersion??null,liveVerified:live,codeReviewStatus:d?.reviewStatus??null,certificationSoftwareIssues:d?.certificationSoftwareIssues??['No exact current registry binding']};
  });
  const identityCandidates=candidates.filter(c=>c.identityCandidate),live=identityCandidates.filter(c=>c.liveVerified);
  const unresolved=contract.requirements.filter(r=>r.status!=='VERIFIED'||!r.evidence?.length).map(r=>({requirementId:r.requirementId,status:r.status,scope:r.scope??null}));
  const software=identityCandidates.some(c=>c.exactCurrentBinding&&c.codeReviewStatus==='certified'&&!c.certificationSoftwareIssues.length);
  // No inference from private arithmetic, source counts, code labels or old QA rows.
  // Historical flags/requirement arrays cannot authenticate full gate decisions.
  // Existing sanitized-db-evidence likewise reports observations, never grants.
  // A separately reviewed version-bound decision importer is still required.
  const eligible=false;
  const disposition=prior.implementationClass==='CONTRACT_BLOCKED'?'AUTHORITY_BLOCKED':live.length===1?'LIVE_VERIFIED':eligible?'ELIGIBLE_TO_PUBLISH':!input.hostedComplete?'UNKNOWN':identityCandidates.length>1||identityCandidates.some(c=>c.sharedCatalogIds.length>1)?'UNKNOWN':software?'CERTIFICATION_BLOCKED':'ENGINEERING_BLOCKED';
  return {masterId:identity.masterId,title:identity.title,disposition,meaning:disposition==='LIVE_VERIFIED'?'Observed existing legacy titled binding and production route; not complete canonical acceptance':'Publication preparation only; no route/certification approval inferred',canonicalAccepted:prior.canonicalAccepted,canonicalMappingApproved:contract.canonicalMappingApproved,implementationClass:prior.implementationClass,candidates,privateCandidates:prior.observedContracts.privateCandidates??[],requirementEvidencePointer:`docs/full-product-batch16/requirements-540.json#/rows/${identity.masterId-1}`,requirementCounts:contract.requirements.reduce<Record<string,number>>((a,r)=>{a[r.status]=(a[r.status]??0)+1;return a;},{}),unresolvedRequirements:unresolved,eligibleToPublish:eligible,eligibilityEvidence:'NOT_ESTABLISHED: no authenticated complete canonical certification/applicability decision importer',activationAuthorized:false};
 });
 const dispositions=rows.reduce<Record<string,number>>((a,r)=>{a[r.disposition]=(a[r.disposition]??0)+1;return a;},{});
 return {scope:'Observed legacy availability is separate from canonical acceptance. Family/support bindings never establish catalog live status. Evidence evaluator is not a production authorization gate.',summary:{catalogIdentities:rows.length,livePublicEngines:input.hosted.filter(h=>liveEngine(h.slug)).length,liveCatalogBindings:rows.filter(r=>r.disposition==='LIVE_VERIFIED').length,eligibleToPublish:rows.filter(r=>r.eligibleToPublish).length,authorityBlocked:rows.filter(r=>r.disposition==='AUTHORITY_BLOCKED').length,dispositions},rows,releaseWave:rows.filter(r=>r.eligibleToPublish).map(r=>({masterId:r.masterId,title:r.title,candidate:r.candidates.find(c=>c.identityCandidate)})),releaseHold:true,activationAuthorized:false};
}
