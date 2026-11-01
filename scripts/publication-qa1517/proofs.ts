/** Offline partial evidence only. Bundle with esbuild for existing extensionless imports. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import React from 'react';
import {assertPendingReport as assertProofContract} from './proof-contract.mjs';
import {ScaledContractReview} from '../../src/components/scaled-contract-review';
import {getPlanEntitlements,normalizePlan} from '../../src/lib/entitlements';
import {capabilitiesFor} from '../../src/calculators/final-framework/entitlements';
import {allContractVectors,getScaledAdapter,exportScaledContract} from '../../src/calculators/scaled-contract-adapters';
import {calculatorRegistry} from '../../src/calculators/registry';
export type ProofRow={masterId:number;engineId:string;version:number;requests:{checkType:string;qaStatus:string;fullCriterionEvidenceSufficient:boolean}[];seo:{exactPublicBinding:boolean;canonicalURL:string|null};performance:{warmSamplesMs:number[];artifactSHA256:string;inputSHA256:string;warmMedianMs:number;warmP95Ms:number;repeats:number;firstExecutionMs:number};entitlement:{baselineArtifactSHA256:string}};
type QuotaObservation={plan:string;priorCount:number;writeAccepted:boolean;resultCount:number;error:string;deniedBytesPreserved:boolean|null};
export type StressRecord={masterId:number;engineId:string;version:number;input:Record<string,unknown>;inputSHA256:string;artifactSHA256:string;firstExecutionMs:number;warmSamplesMs:number[];repeats:number;expectedValue:number;actualValue:number;schemaValidated:boolean;scope:string};
export type ProofReport={stressWorkloads:StressRecord[];rows:ProofRow[];summary:{pendingRequests:number;newApprovals:number;newPublicationEligible:number};releaseHold:boolean;productionWrites:boolean;sourceHashes:Record<string,string>;sharedEntitlement:{unknownPlanFallback:string;historyCapture:{observations:QuotaObservation[]}}};
type Baseline=typeof import('../../docs/publication-factory/contracts-evidence.json');
type Cohort=typeof import('../../docs/publication-factory/cohort-76.json');
type Packet=ReturnType<typeof exportScaledContract>;
type HookDispatcher={useState:()=>[unknown,(value:unknown)=>void];useMemo:(fn:()=>unknown)=>unknown};
type ElementNode={type?:unknown;props?:{children?:unknown;onClick?:()=>void}};
const hash=(v:string|Uint8Array)=>createHash('sha256').update(v).digest('hex');
const load=(p:string):unknown=>JSON.parse(readFileSync(p,'utf8'));
const baselinePath='docs/publication-factory/contracts-evidence.json';
const cohortPath='docs/publication-factory/cohort-76.json';
export function assertPendingReport(value:unknown):asserts value is ProofReport{assertProofContract(value);}

function children(node:unknown):ElementNode[]{if(Array.isArray(node))return node.flatMap(children);if(!node||typeof node!=='object')return [];const element=node as ElementNode;return [element,...children(element.props?.children)];}
/** Invoke the real component's event closure through a controlled React hook dispatcher.
 * No DOM, browser interaction, session or server authorization is claimed. */
function quotaProof(packet:Packet){
 const internals=(React as unknown as {__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE:{H:HookDispatcher|null}}).__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,previous=internals.H;
 const observations=[];
 try{for(const plan of ['free','pro','business'] as const)for(const count of [19,20,99,100]){
  let raw=JSON.stringify(Array(count).fill(packet)),error='',index=0;const before=raw;
  const state=[packet.adapterKey,JSON.stringify(getScaledAdapter(packet.adapterKey).getInput(packet.artifact)),plan,packet,null,'',[],[],null,'',''];
  internals.H={useState:()=>{const i=index++;return [state[i],(v:unknown)=>{if(i===5){assert.equal(typeof v,'string');error=v as string;}}];},useMemo:(fn:()=>unknown)=>fn()};
  const priorStorage=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:()=>raw,setItem:(_k:string,v:string)=>{raw=v;}}});
  try{const button=children(ScaledContractReview()).find((n)=>n.type==='button'&&n.props?.children==='Save review history');assert(button);assert(button.props?.onClick);button.props.onClick();}finally{if(priorStorage)Object.defineProperty(globalThis,'localStorage',priorStorage);else Reflect.deleteProperty(globalThis,'localStorage');}
  const allowed=plan==='free'?count<20:count<100;assert.equal(error==='',allowed);assert.equal(JSON.parse(raw).length,allowed?count+1:count);if(!allowed)assert.equal(raw,before);
  observations.push({plan,priorCount:count,writeAccepted:allowed,resultCount:JSON.parse(raw).length,error,deniedBytesPreserved:allowed?null:raw===before});
 } }finally{internals.H=previous;}
 return {scope:'Actual private review component history event closure; controlled hook state and in-memory storage. Shared local software check only, not 76 authenticated tests.',artifactSHA256:hash(JSON.stringify(packet)),observations};
}
export function generateProofs(){
 const baseline=load(baselinePath) as Baseline,cohort=load(cohortPath) as Cohort;let quota:ReturnType<typeof quotaProof>|undefined;
 const rows=cohort.rows.map((binding)=>{
  const prior=baseline.rows.find((r)=>r.masterId===binding.masterId&&r.adapterKey===binding.engineId&&r.engineVersion===binding.version);assert(prior);
  const vector=allContractVectors.find(v=>v.id===binding.masterId)!.witnesses[0];assert.equal(hash(JSON.stringify(vector.input)),prior.witnesses[0].inputSHA256);
  const run=()=>exportScaledContract(binding.engineId,vector.input,'free');
  const begin=performance.now(),packet=run(),firstExecutionMs=performance.now()-begin;
  const artifactSHA256=hash(JSON.stringify(packet));assert.equal(artifactSHA256,prior.witnesses[0].artifactSHA256);
  const samples=[];for(let i=0;i<30;i++){const start=performance.now();run();samples.push(performance.now()-start);}
  const sorted=[...samples].sort((a,b)=>a-b);if(!quota)quota=quotaProof(packet);
  const publicMatches=calculatorRegistry.list().filter(d=>d.id===binding.engineId&&d.version===binding.version);assert.equal(publicMatches.length,0);
  const requests=['entitlement-validation','performance','seo-content'].map(checkType=>({requestId:`${binding.engineId}@${binding.version}:${checkType}`,checkType,qaStatus:'PENDING',fullCriterionEvidenceSufficient:false}));
  return {masterId:binding.masterId,engineId:binding.engineId,version:binding.version,requests,baseline:{path:baselinePath,pointer:'/rows/'+baseline.rows.indexOf(prior),retainedWitnesses:prior.witnesses.length},performance:{scope:'Single known per-ID first fixture; process already imported modules; first execution is not cold startup. No SLO/budget/worst-case/load/production claim.',fixture:vector.name,inputSHA256:prior.witnesses[0].inputSHA256,artifactSHA256,firstExecutionMs,warmSamplesMs:samples,warmMedianMs:(sorted[14]+sorted[15])/2,warmP95Ms:sorted[28],repeats:30},entitlement:{baselineArtifactSHA256:artifactSHA256,sharedLocalControlEvidence:'/sharedEntitlement',gap:'Authenticated account/tenant authorization, server feature enforcement and full canonical features remain unproven.'},seo:{scope:'Actual local public registry exact engine/version lookup; absence is negative binding evidence, not SEO acceptance or non-applicability.',exactPublicBinding:false,canonicalURL:null,gap:'Approved canonical binding, metadata/content, structured data, indexability and claims review remain missing.'}};
 });
 const stressWorkloads=[3,5,6,7,8,22,27,29].map(masterId=>{
  const binding=cohort.rows.find(row=>row.masterId===masterId);assert(binding);const adapter=getScaledAdapter(binding.engineId);assert.equal(adapter.catalogId,masterId);assert.equal(adapter.version,binding.version);
  const firstInput=allContractVectors.find(vector=>vector.id===masterId)!.witnesses[0].input;
  const input={...structuredClone(firstInput),principal:1200,annualRatePercent:0,termMonths:1200,extraMonthlyPayment:0};adapter.input.parse(input);
  const run=()=>exportScaledContract(binding.engineId,input,'free');const start=performance.now(),packet=run(),firstExecutionMs=performance.now()-start;
  const output=adapter.output.parse(adapter.getOutput(packet.artifact)) as Record<string,unknown>;assert.equal(output.value,1);assert.equal(output.scheduledPayment,1);assert(Array.isArray(output.amortization));assert.equal(output.amortization.length,1200);
  const warmSamplesMs=[];for(let repeat=0;repeat<5;repeat++){const begin=performance.now();run();warmSamplesMs.push(performance.now()-begin);}
  return {masterId,engineId:binding.engineId,version:binding.version,input,inputSHA256:hash(JSON.stringify(input)),artifactSHA256:hash(JSON.stringify(packet)),firstExecutionMs,warmSamplesMs,repeats:5,expectedValue:1,actualValue:1,schemaValidated:true,scope:'Exact private loan profile at declared termMonths1200 schema bound, principal1200 and zero interest/extra payment. Original currency/scope retained. Not all worst cases, production SLO or full QA acceptance.'};
 });
 const pins=['scripts/publication-qa1517/proof-contract.mjs','scripts/publication-qa1517/proofs.ts',baselinePath,cohortPath,'docs/full-product-batch16/requirements-540.json','src/lib/entitlements.ts','src/calculators/final-framework/entitlements.ts','src/components/scaled-contract-review.tsx','src/calculators/registry.ts','src/calculators/scaled-contract-adapters.ts',...Object.keys(baseline.sourceHashes)];
 const report={kind:'PARTIAL_OFFLINE_MISSING_PROOFS_NO_APPROVAL',candidateBaseline:'9b6b4cfc846b942294cc44350c1338f1c0d1c09c',runtime:{node:process.version,platform:process.platform,arch:process.arch},sourceHashes:Object.fromEntries([...new Set(pins)].map(p=>[p,hash(readFileSync(p))])),sharedEntitlement:{policy:['free','pro','business'].map(plan=>({plan,controls:getPlanEntitlements(plan),capabilities:capabilitiesFor(plan as 'free'|'pro'|'business')})),unknownPlanFallback:normalizePlan('unknown'),historyCapture:quota},summary:{profiles:76,pendingRequests:228,newApprovals:0,newPublicationEligible:0,retainedMathWitnesses:152,retainedBrowserJourneys:152},stressWorkloads,preservedOtherRequests:{partial:380,applicability:304,mathReview:76,YMYL:67,source:76,owner:76},rows,releaseHold:true,productionWrites:false};assertPendingReport(report);return report;
}
if(process.argv.includes('--generate')){const report=generateProofs();writeFileSync('docs/publication-qa1517/missing-proofs.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.summary));}
if(process.argv.includes('--check')){const report=load('docs/publication-qa1517/missing-proofs.json');assertPendingReport(report);for(const [p,h] of Object.entries(report.sourceHashes))assert.equal(hash(readFileSync(p)),h,`Stale proof: ${p}`);console.log(JSON.stringify(report.summary));}
