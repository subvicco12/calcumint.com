/** Offline source inspection only. Never an alias, lifecycle or publication authority. */
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname,resolve,relative} from 'node:path';
import {z} from 'zod';
import type {CalculatorDefinition} from './types';
import {calculatorRegistry} from './registry';
import {parseMasterCatalogCsv} from './catalog-csv-ingestion';
import {privateCatalogAdapters} from './private-catalog-adapters';
import {privateScientificDefinitions} from './private-scientific-definitions';
import {privateOwnerDefinitions} from './private-owner-definitions';
import {draftPreviewDefinitions,calculateDraftPreview} from './final-framework/draft-preview-catalog';
import {finalPrivateDiscovery,finalPrivateExamples} from './final-private-workbench';
import {completionContracts} from './completion-contracts';
import {financialContracts} from './financial-contracts';
import {sourceBoundProfiles} from './source-bound-profiles';
import {annualHeatComparison} from './annual-heat-comparison';
import {privateWorkflowDefinitions} from './private-scenario-workflows';
import {componentContracts,componentExamples,componentOutputSchemas} from './component-contracts';
import {businessContracts,businessExamples} from './business-contracts';
import type {ContractDecision} from './catalog-contract-reconciliation';
import baseline from '../../data/catalog/calculator-completion-2026-10-25/inventory.json';
import historicalCrosswalk from '../../data/catalog/crosswalk-2026-10-20/crosswalk.json';
import historicalReconciliation from '../../data/catalog/reconciliation-2026-10-25/manifest.json';
import financeDecisions from '../../data/catalog/reconciliation-2026-10-25/financial-decisions.json';
import otherDecisions from '../../data/catalog/reconciliation-2026-10-25/nonfinancial-decisions.json';
import methodology from '../../data/catalog/source-driven-2026-10-27/engineering-register.json';
import riskReview from '../../data/catalog/risk-review-2026-10-26/reassessment.json';
import technical from '../../docs/audits/specialist-technical-review-2026-10-26/technical-register.json';

export type ImplementationClass='REGISTERED_IMPLEMENTED'|'PRIVATE_COMPLETE'|'COMPONENT_ONLY'|'CONTRACT_BLOCKED'|'MISSING_ENGINE'|'UNKNOWN';
export function classifyImplementation(s:{privateCount:number;exactRegisteredCount:number;componentCount:number;blocked:boolean;currentAbsenceProven:boolean}):ImplementationClass{
 if(s.privateCount)return 'PRIVATE_COMPLETE';if(s.exactRegisteredCount)return 'REGISTERED_IMPLEMENTED';if(s.blocked)return 'CONTRACT_BLOCKED';if(s.componentCount)return 'COMPONENT_ONLY';return s.currentAbsenceProven?'MISSING_ENGINE':'UNKNOWN';
}
const hash=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
const file=(path:string)=>({path,sha256:hash(readFileSync(path))});
function schema(d:Pick<CalculatorDefinition<unknown,unknown>,'inputSchema'>){try{return {json:z.toJSONSchema(d.inputSchema,{io:'input',unrepresentable:'any'}),limitation:'JSON schema cannot express every Zod refinement; pinned implementation remains authoritative.'};}catch{return {json:null,limitation:'Schema serialization unsupported; inspect pinned implementation. No canonical fields inferred.'};}}
type Info=Pick<CalculatorDefinition<unknown,unknown>,'id'|'slug'|'version'|'reviewStatus'|'riskClass'|'formulas'|'sources'|'inputSchema'|'examples'|'goldenTests'>;
function metadata(d:Info,input?:unknown){if(typeof(d as Info&{calculate?:unknown}).calculate!=='function')throw Error('Missing actual calculation function');return {id:d.id,slug:d.slug,version:d.version,repositoryReviewStatus:d.reviewStatus,riskClass:d.riskClass as string,formulas:d.formulas,sources:d.sources,inputContract:schema(d),declaredExampleInput:input??d.examples[0]?.input??null,declaredExampleOutputKeys:d.examples[0]&&typeof d.examples[0].expected==='object'&&d.examples[0].expected!==null?Object.keys(d.examples[0].expected):[],declaredExampleCount:d.examples.length,declaredGoldenCount:d.goldenTests?.length??0,evidenceMeaning:'Definition metadata and authored cases; not full canonical I/O approval, publisher-body verification or per-ID browser acceptance.'};}
type PrivateInfo=Omit<ReturnType<typeof metadata>,'id'>&{id:string|null;outputContract?:unknown;identityKind?:string;implementationProbe?:{kind:string;calculatorSlug:string;calculatorVersion:number};family:string;scopeEvidencePaths:string[];numericalEvidencePaths:string[];browserEvidencePaths:string[]};
function collectPrivate(){
 const map=new Map<number,PrivateInfo[]>();
 const insert=(id:number,info:PrivateInfo)=>map.set(id,[...(map.get(id)??[]),info]);
 for(const [family,entries,source,test,browser] of [
  ['private-catalog',privateCatalogAdapters,'src/calculators/private-catalog-adapters.ts','src/calculators/private-catalog-adapters.test.ts','docs/audits/specialist-technical-review-2026-10-26/REPORT.md'],
  ['private-scientific',privateScientificDefinitions,'src/calculators/private-scientific-definitions.ts','src/calculators/private-scientific-definitions.test.ts','docs/audits/specialist-technical-review-2026-10-26/REPORT.md'],
  ['private-owner',privateOwnerDefinitions,'src/calculators/private-owner-definitions.ts','src/calculators/private-owner-definitions.test.ts','docs/cloud-sprint/REPORT.md'],
 ] as const){for(const e of entries)insert(e.masterId,{...metadata(e.definition),family,scopeEvidencePaths:[source],numericalEvidencePaths:[test],browserEvidencePaths:[browser].filter(existsSync)});}
 const definitions:Info[]=[...completionContracts,...financialContracts,...sourceBoundProfiles,annualHeatComparison,...privateWorkflowDefinitions];
 for(const r of finalPrivateDiscovery.filter(r=>r.available)){
  const d=definitions.find(d=>d.id===r.definitionId);if(!d)throw Error('Stale final private definition');
  insert(r.masterId,{...metadata(d,finalPrivateExamples[r.masterId]),family:'final-private-workbench',scopeEvidencePaths:['docs/cloud-batch06/implementation-manifest.json'],numericalEvidencePaths:['src/calculators/final-private-workbench.test.ts'],browserEvidencePaths:['tests/final-private-workbench/browser.mjs','docs/cloud-batch06/REPORT.md']});
 }
 const extra=privateWorkflowDefinitions.find(d=>d.id==='private.workflow.heat-costs')!;
 insert(488,{...metadata(extra),family:'prior-heat-workflow',scopeEvidencePaths:['docs/cloud-sprint/workflow-inventory.json'],numericalEvidencePaths:['src/calculators/private-scenario-workflows.test.ts'],browserEvidencePaths:['tests/workflow-review/browser.mjs','docs/cloud-sprint/REPORT.md']});
 for(const d of draftPreviewDefinitions){
  const probe=calculateDraftPreview(d.masterId,d.initialInput).snapshot;
  if(probe.calculatorSlug!==d.slug||probe.calculatorVersion!==d.version)throw Error('Frozen DRAFT dispatch/version mismatch');
  insert(d.masterId,{id:null,identityKind:'FROZEN_PRIVATE_SLUG_VERSION_NO_DEFINITION_ID',slug:d.slug,version:d.version,repositoryReviewStatus:'draft',riskClass:'UNKNOWN',formulas:[],sources:[],inputContract:{json:null,limitation:'Frozen DRAFT input/UI metadata and pinned source supplied; canonical full contract is not approved.'},declaredExampleInput:d.initialInput,declaredExampleOutputKeys:Object.keys(probe.output),declaredExampleCount:1,declaredGoldenCount:0,implementationProbe:{kind:'ACTUAL_DISPATCH_NOT_INDEPENDENT_ACCEPTANCE',calculatorSlug:probe.calculatorSlug,calculatorVersion:probe.calculatorVersion},evidenceMeaning:'Original frozen private DRAFT, not certification or full canonical scope acceptance.',family:'original-14-drafts',scopeEvidencePaths:['src/calculators/final-framework/draft-preview-catalog.ts'],numericalEvidencePaths:['src/lib/draft-persistence-contract.test.ts'],browserEvidencePaths:['tests/draft-preview/index.html','docs/windows-sprint/contract-inventory.json'].filter(existsSync)});
 }
 for(const d of businessContracts){const id=Number(d.id.split('.').at(-1));insert(id,{...metadata(d,businessExamples[id]),family:'batch07-business',scopeEvidencePaths:['docs/cloud-batch07/selected-contract-evidence.json','src/calculators/business-contracts.ts'],numericalEvidencePaths:['src/calculators/business-contracts.test.ts','src/calculators/business-contracts-independent.test.ts'],browserEvidencePaths:['tests/catalog-engineering-review/browser.mjs']});}
 for(const d of componentContracts){const id=Number(d.id.split('.').at(-1));insert(id,{...metadata(d,componentExamples[id]),family:'batch08-components',outputContract:z.toJSONSchema(componentOutputSchemas[id]),scopeEvidencePaths:['docs/cloud-batch08/selected-contract-evidence.json','src/calculators/component-contracts.ts'],numericalEvidencePaths:['src/calculators/component-contracts.test.ts','src/calculators/component-contracts-independent.test.ts'],browserEvidencePaths:['tests/component-engineering-review/browser.mjs']});}
 return map;
}
function calculatorFiles(directory='src/calculators'):string[]{return readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?calculatorFiles(directory+'/'+e.name):/\.(ts|tsx)$/.test(e.name)&&!e.name.includes('.test.')?[directory+'/'+e.name]:[]).sort();}
export function buildImplementationReconciliation(csv=readFileSync('data/catalog/master-catalog-2026.csv','utf8')){
 const master=parseMasterCatalogCsv(csv);if(master.length!==540)throw Error('Exactly540 authoritative identities required');
 if(baseline.rows.length!==540||new Set(baseline.rows.map(r=>r.masterId)).size!==540)throw Error('Incomplete baseline identity evidence');
 const decisions=[...financeDecisions,...otherDecisions] as ContractDecision[],privateMap=collectPrivate();
 const engines=calculatorRegistry.list().map(d=>{const recorded=historicalReconciliation.registeredContracts.find(e=>e.slug===d.slug);return {...metadata(d),registered:true,canonicalBindingApproved:false,historicalExampleDiagnostics:{status:'HISTORICAL_NOT_REATTESTED',source:'data/catalog/reconciliation-2026-10-25/manifest.json',recordedId:recorded?.id??null,recordedVersion:recorded?.version??null,issues:recorded?.strictExampleIssues??[]}};});
 const bySlug=new Map(engines.map(d=>[d.slug,d]));if(bySlug.size!==engines.length||new Set(engines.map(e=>e.id)).size!==engines.length)throw Error('Duplicate runtime registry identity');
 const evidencePaths=new Set<string>(['data/catalog/master-catalog-2026.csv','data/catalog/calculator-completion-2026-10-25/inventory.json','data/catalog/crosswalk-2026-10-20/crosswalk.json','data/catalog/reconciliation-2026-10-25/financial-decisions.json','data/catalog/reconciliation-2026-10-25/nonfinancial-decisions.json','data/catalog/source-driven-2026-10-27/engineering-register.json','data/catalog/risk-review-2026-10-26/reassessment.json','docs/audits/specialist-technical-review-2026-10-26/technical-register.json']);
 const rows=master.map(identity=>{
  const previous=baseline.rows.find(r=>r.masterId===identity.masterId),crosswalk=historicalCrosswalk.rows.find(r=>r.masterId===identity.masterId);
  if(!previous||previous.title!==identity.title||previous.domain!==identity.domain||!crosswalk||crosswalk.title!==identity.title)throw Error('Canonical identity drift or stale evidence');
  const decision=decisions.find(r=>r.masterId===identity.masterId),method=methodology.rows.find(r=>r.masterId===identity.masterId),risk=riskReview.rows.find(r=>r.masterId===identity.masterId),specialist=technical.cases.find(r=>r.masterId===identity.masterId);
  const privateImplementations=privateMap.get(identity.masterId)??[];
  const candidateRefs=previous.candidates.map(c=>({id:c.id,slug:c.slug,version:c.version,basis:'RECORDED_CANDIDATE_NOT_CANONICAL_MAPPING'}));
  const decisionRefs=(decision?.engineSlugs??[]).filter(slug=>!candidateRefs.some(c=>c.slug===slug)).map(slug=>{const recorded=historicalReconciliation.registeredContracts.find(d=>d.slug===slug);return {id:recorded?.id??'',slug,version:recorded?.version??0,basis:decision!.classification};});
  const registeredEvidence=[...candidateRefs,...decisionRefs].map(c=>{const current=bySlug.get(c.slug);return {...c,currentId:current?.id??null,currentVersion:current?.version??null,exactCurrentBinding:!!current&&current.id===c.id&&current.version===c.version};});
  const exactRegisteredCount=registeredEvidence.filter(c=>c.exactCurrentBinding&&(c.basis==='RECORDED_CANDIDATE_NOT_CANONICAL_MAPPING'||c.basis==='ENGINE_CONTRACT_MATCH')).length;
  const componentBindings=[...(decision?.classification==='FAMILY_VARIANT'?[{evidence:decision.formulaScope,engineSlugs:decision.engineSlugs,helperRefs:decision.helperRefs,classification:'FAMILY_VARIANT_SUPPORT_ONLY'}]:[]),...(method?.suppliedArithmeticComponents??[])];
  const blocked=decision?.classification==='SCOPE_DECISION_REQUIRED'||decision?.classification==='UNSUPPORTED_MAPPING';
  // Historical missingEngineConfirmed is deliberately NOT current absence proof.
  const implementationClass=classifyImplementation({privateCount:privateImplementations.length,exactRegisteredCount,componentCount:componentBindings.length,blocked,currentAbsenceProven:false});
  const missing=[...(method?.remainingGaps??[]),...(risk?.remainingOwnerAndContractChoices??[]),...(decision?.limitations??[]),'Full canonical input/output/feature scope and exact ID-to-version mapping remain unapproved.'];
  const sourceEvidencePaths=[...(decision?.sourcePaths??[]),...privateImplementations.flatMap(p=>p.scopeEvidencePaths),...privateImplementations.flatMap(p=>p.numericalEvidencePaths),...privateImplementations.flatMap(p=>p.browserEvidencePaths)].filter(existsSync);
  sourceEvidencePaths.forEach(p=>evidencePaths.add(p));
  const nextAction=implementationClass==='PRIVATE_COMPLETE'?'Private bounded scope implemented; resolve retained canonical I/O/mapping and applicable source/specialist decisions before any lifecycle action.':implementationClass==='REGISTERED_IMPLEMENTED'?'Review exact canonical feature/input/output contract against recorded registered engine(s); approve mapping and required source/specialist evidence separately.':implementationClass==='COMPONENT_ONLY'?'Implement a distinct validated private input/output contract around the cited source-supported components; preserve accounting/policy exclusions.':implementationClass==='CONTRACT_BLOCKED'?'Obtain the specific governing model/provider/institution/jurisdiction/period decision recorded below; continue independent cases meanwhile.':'Resolve current implementation linkage by code/source inspection; do not infer missing engine from absent mapping.';
  return {...identity,implementationClass,classificationScope:'Technical repository evidence only; PRIVATE_COMPLETE means bounded private scope, not canonical completion.',canonicalMappingApproved:false,registeredEvidence,privateImplementations,componentBindings,
   methodologyEvidence:{declaredFormulaScope:decision?.formulaScope??null,sources:registeredEvidence.filter(e=>e.exactCurrentBinding).flatMap(e=>bySlug.get(e.slug)!.sources),archivedSourceObservations:method?.sourceEvidence??[],sourcePaths:sourceEvidencePaths,normativeVersionApplicability:'UNAPPROVED_OR_UNKNOWN',publisherBodyVerification:'NOT_INFERRED_FROM_METADATA'},
   canonicalRequirements:{observedCandidateInputs:registeredEvidence.filter(e=>e.exactCurrentBinding).map(e=>({id:e.id,input:bySlug.get(e.slug)!.declaredExampleInput})),recordedInputSignature:decision?.inputSignature??null,recordedOutputSignature:decision?.outputSignature??null,missing:[...new Set(missing)]},
   specialistRestrictions:{screening:risk?.disposition??'UNKNOWN',reviewerGroups:specialist?.originalReviewerGroups??[],historicalQualifiedApproval:specialist?.qualifiedApprovalStatus??'UNKNOWN',qualifiedDecisionEvidence:specialist?.qualifiedDecisionEvidence??null,notAnExemption:true},
   acceptanceEvidence:{historicalDiagnosticIssues:registeredEvidence.filter(e=>e.exactCurrentBinding&&bySlug.get(e.slug)!.historicalExampleDiagnostics.issues.length).map(e=>({slug:e.slug,...bySlug.get(e.slug)!.historicalExampleDiagnostics})),declaredRegisteredExamples:registeredEvidence.filter(e=>e.exactCurrentBinding).map(e=>({id:e.id,count:bySlug.get(e.slug)!.declaredExampleCount,goldenCount:bySlug.get(e.slug)!.declaredGoldenCount})),numericalTestReferences:sourceEvidencePaths.filter(p=>p.includes('.test.')),browserReferences:sourceEvidencePaths.filter(p=>p.includes('browser')||p.endsWith('/REPORT.md')),coverageMeaning:'References and suite-level receipts; per-ID independent browser completeness is UNKNOWN unless explicitly stated in that artifact. No title/example count is acceptance.',verifiedCandidateCI:{runId:40918367925,head:'5a6f2311bde292ac0c3799c01eb3bb316522f426',conclusion:'success',meaning:'Single verified baseline suite receipt; not per-ID canonical acceptance.'}},
   lifecycle:{repositoryReviewStates:[...new Set(registeredEvidence.filter(e=>e.exactCurrentBinding).map(e=>bySlug.get(e.slug)!.repositoryReviewStatus))],publicRegistryPresence:registeredEvidence.some(e=>e.exactCurrentBinding),registryPresenceMeaning:'Underlying candidate/component registry presence, not approved canonical registration.',currentPublicPublication:'UNKNOWN',protectedCertification:'UNKNOWN',historicalPublicationObservations:crosswalk.candidates.map(c=>({slug:c.slug,state:c.dbPublication,observedKey:c.observedDbKey,observedVersion:c.observedDbVersion})),historicalSnapshot:historicalCrosswalk.provenance.historicalAnonymousSnapshot,releaseHold:true,certificationAuthorized:false,publicationAuthorized:false},
   historicalAbsenceFinding:decision?.missingEngineConfirmed??false,currentAbsenceProven:false,nextAction};
 });
 const classes=Object.fromEntries((['REGISTERED_IMPLEMENTED','PRIVATE_COMPLETE','COMPONENT_ONLY','CONTRACT_BLOCKED','MISSING_ENGINE','UNKNOWN'] as ImplementationClass[]).map(c=>[c,rows.filter(r=>r.implementationClass===c).length]));
 // Pin the literal JSON inputs of the inspected calculator graph as well as
 // TypeScript. These include historical identity/version and owner-scope inputs.
 const paths=calculatorFiles();
 for(const path of paths){
  const source=readFileSync(path,'utf8');
  for(const match of source.matchAll(/\bfrom\s+['"]([^'"]+\.json)['"]/g)){
   if(!match[1].startsWith('.'))continue;
   const imported=relative(process.cwd(),resolve(dirname(path),match[1])).replaceAll('\\','/');
   if(!imported.startsWith('../')&&existsSync(imported))evidencePaths.add(imported);
  }
 }
 const sourceFiles=paths.map(file);
 return {schemaVersion:1,baselineSHA:'5a6f2311bde292ac0c3799c01eb3bb316522f426',candidateCI:{runId:40918367925,status:'completed',conclusion:'success',verification:'USER_SUPPLIED_TERMINAL_SUCCESS; prior single API check was pending'},releaseHold:true,canonicalCompletedCount:0,
  classificationMeaning:{REGISTERED_IMPLEMENTED:'Exact repository registry binding of recorded candidate/contract-match evidence; canonical linkage unapproved.',PRIVATE_COMPLETE:'Complete bounded private scenario, NOT completed canonical calculator.',COMPONENT_ONLY:'Source-backed family/helper arithmetic without a distinct completed private contract.',CONTRACT_BLOCKED:'Governing contract/model or rejected mapping blocks implementation.',MISSING_ENGINE:'Only current positive absence proof for a selected contract; historical missing linkage is insufficient.',UNKNOWN:'No sufficient current implementation evidence.'},
  summary:{catalogIdentities:rows.length,registeredEngineDefinitions:engines.length,originalPrivateDrafts:draftPreviewDefinitions.length,privateIdentityCount:rows.filter(r=>r.privateImplementations.length).length,classes,canonicalMappingsApproved:0,currentPublishedCount:'UNKNOWN',historicallyObservedPublicIdentities:209,publicationsAuthorized:0,certificationsAuthorized:0},
  implementationSnapshot:{meaning:'Exact inspected calculator source bytes on verified baseline plus new files; not publisher source bodies or identity approval.',sourceTreeSHA256:hash(JSON.stringify(sourceFiles)),files:sourceFiles},evidenceBindings:[...evidencePaths].sort().map(file),engines,rows};
}
