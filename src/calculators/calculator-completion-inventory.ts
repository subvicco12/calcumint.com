/** Offline Node-only evidence. Never imported by an application route or used as publication authority. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {calculatorRegistry} from './registry';
import {runCalculator} from './engine';
import {goldenMismatch} from './launch-certification';
import {draftPreviewDefinitions} from './final-framework/draft-preview-catalog';
import {summarizeCalculatorImplementationInventory} from './implementation-inventory';
import {isRepositoryPublicationEligible} from './publication-authority';
import type {buildMasterIdentityCrosswalk} from './master-identity-crosswalk';
export function buildCalculatorCompletionInventory(options:{hasWebsiteInterface?:(slug:string)=>boolean}={}){
 const source=readFileSync('data/catalog/crosswalk-2026-10-20/crosswalk.json','utf8');
 const crosswalk=JSON.parse(source) as ReturnType<typeof buildMasterIdentityCrosswalk>;
 const engines=calculatorRegistry.list().map(d=>{
  const examples=d.examples.map(example=>{try{const output=runCalculator(d,example.input).output;const issue=goldenMismatch(output,example.expected);return{label:example.label,passed:issue===null,issue};}catch{return{label:example.label,passed:false,issue:'Example execution rejected'};}});
  return{id:d.id,slug:d.slug,title:d.title,category:d.category,version:d.version,riskClass:d.riskClass,repositoryReviewState:d.reviewStatus,websiteInterface:options.hasWebsiteInterface?options.hasWebsiteInterface(d.slug):'UNMEASURED',repositoryPublicationEligible:isRepositoryPublicationEligible(d),previewUrl:`/account/calculators/${d.slug}`,examples,exampleBackedContractForm:d.examples.length>0,sourceCount:d.sources.length,formulaCount:d.formulas.length};
 });
 const bySlug=new Map(engines.map(x=>[x.slug,x]));
 const rows=crosswalk.rows.map(row=>{
  const candidates=row.candidates.map(candidate=>{const engine=bySlug.get(candidate.slug);if(!engine||engine.id!==candidate.calculatorKey||engine.version!==candidate.version)throw Error('Stale crosswalk identity');return{...engine,historicalDbPublication:candidate.dbPublication,currentDbCertification:'UNKNOWN' as const};});
  const draft=draftPreviewDefinitions.find(d=>d.masterId===row.masterId);
  return{masterId:row.masterId,domain:row.domain,title:row.title,linkageState:row.linkageState,implementationState:draft?'PRIVATE_DRAFT_IMPLEMENTED':candidates.length?'CANDIDATE_ENGINE_IMPLEMENTED':'UNRESOLVED_LINKAGE',candidates,privateDraft:draft?{slug:draft.slug,version:draft.version,url:'/account/drafts',published:false}:null,mappingApproved:false,currentPublicState:'UNKNOWN',specialistGate:row.lifecycle.specialistApproval,identityHold:row.lifecycle.hold,remainingWork:draft?'Individual DRAFT identity/math/source/UX review and publication gates; keep unpublished':!candidates.length?'Resolve master scope and existing engine aliases; only then determine missing engine versus missing linkage':candidates.length>1||row.linkageState==='SHARED_CANDIDATE'?'Adjudicate candidate/shared scopes; complete feature UX and required lifecycle gates':'Approve exact master feature contract; complete interface/source/specialist and publication gates',proposedPublicationBatch:draft?'PRIVATE_DRAFT_INDIVIDUAL':candidates.some(x=>x.riskClass!=='standard')?'SPECIALIST_OR_REGULATED':!candidates.length?'IDENTITY_AND_CONTRACT_FIRST':candidates.every(x=>x.repositoryPublicationEligible)?'STANDARD_CERTIFIED_REVIEW':'STANDARD_DRAFT_ENGINEERING'};
 });
 const states=summarizeCalculatorImplementationInventory();
 return{baselineSha:'89573c4e7f0b054dc8fee7ec0073097e36030bcc',crosswalkSha256:createHash('sha256').update(source).digest('hex'),authority:'Repository engine/preview evidence only; historical DB observations are not current publication',summary:{masterEntries:rows.length,registeredEngines:engines.length,privateDraftEngines:draftPreviewDefinitions.length,registryReviewStates:states.byReviewStatus,missingLinkage:crosswalk.summary.missingLinkage,linkedMasterEntries:rows.filter(x=>x.candidates.length).length,provenMissingEngines:0,remainingImplementationCount:'UNKNOWN',contractExamplesPassed:engines.flatMap(x=>x.examples).filter(x=>x.passed).length,contractExamplesFailed:engines.flatMap(x=>x.examples).filter(x=>!x.passed).length,enginesWithoutExamples:engines.filter(x=>!x.examples.length).length,existingWebsiteInterfaces:engines.filter(x=>x.websiteInterface===true).length,engineContractOnlyInterfaces:engines.filter(x=>x.websiteInterface===false).length,previewAvailable:engines.filter(x=>x.exampleBackedContractForm||x.websiteInterface===true).length,currentPubliclyPublishedCount:'UNKNOWN',historicalObservedPublicIdentities:209},rows,engines};
}
