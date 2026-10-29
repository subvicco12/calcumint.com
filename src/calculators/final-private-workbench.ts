import {z} from 'zod';
import type {CalculationSnapshot} from '../lib/calculation-snapshot';
import {copyCalculationData} from '../lib/calculation-snapshot';
import type {CalculatorDefinition} from './types';
import register from '../../data/catalog/source-driven-2026-10-27/engineering-register.json';
import {completionContracts,completionExamples,exportCompletion,importCompletion,equalCompletionJson} from './completion-contracts';
import {financialContracts,financialExamples,exportFinancialContract,importFinancialContract} from './financial-contracts';
import {sourceBoundProfiles} from './source-bound-profiles';
import {exportSourceProfile,importSourceProfile} from './source-profile-snapshot';
import {annualHeatComparison,exportAnnualHeatComparison,importAnnualHeatComparison} from './annual-heat-comparison';
import {privateWorkflowDefinitions,exportPrivateWorkflow,importPrivateWorkflow} from './private-scenario-workflows';
import {formatRational,type Rational} from './exact-rational';

type Plan='free'|'pro'|'business';
type Payload={calculation:CalculationSnapshot};
type Info=Pick<CalculatorDefinition<unknown,unknown>,'id'|'title'|'formulas'|'sources'>;
type Adapter={masterId:number;engineKind:string;definition:Info;example:Record<string,unknown>;run:(input:unknown,plan:Plan)=>Payload;replay:(raw:unknown)=>Payload;headline:(output:Record<string,unknown>)=>string};
const adapters:Adapter[]=[];
for(const d of completionContracts){const n=Number(d.id.split('.').at(-1));adapters.push({masterId:n,engineKind:'completion',definition:d,example:completionExamples[n],run:(input,plan)=>exportCompletion(n,input,plan),replay:importCompletion,headline:o=>String(o.headline)});}
for(const d of financialContracts){const n=Number(d.id.split('.').at(-1));adapters.push({masterId:n,engineKind:'financial',definition:d,example:financialExamples[d.id],run:(input,plan)=>exportFinancialContract(d.id,input,plan),replay:importFinancialContract,headline:o=>{
 if('comparison' in o)return String((o.comparison as {difference:number}).difference);
 if(n===43||n===46)return String(o.profit);if(n===468)return o.withinSuppliedBudget?'Within supplied budget':'Over supplied budget';return String(o.totalOwnerCashflow);
}});}
const sourceExamples:Record<number,{name:string;input:Record<string,unknown>;metric:string}>={
 126:{name:'nz-gst-prices',metric:'gst',input:{policySnapshot:'2026-10-28',currency:'NZD',lines:[{id:'headphones',amount:'100',priceBasis:'exclusive',classification:'standard'}]}},
 133:{name:'assessment-levies',metric:'totalTax',input:{methodSnapshot:'2026-10-28',currency:'USD',assessmentYear:2026,levies:[{id:'town',jurisdiction:'Town A example',assessedValue:'175000',grantedExemptions:'25000',ratePerThousand:'50'}]}},
 516:{name:'stanford-transcript-gpa',metric:'gpa',input:{policySnapshot:'2026-10-28',gradingEra:'autumn-2014-or-later',studentCareer:'undergraduate',transcriptStatus:'registrar-resolved',rows:[{recordId:'x',grade:'B-',units:'3',gradingSystem:'general'},{recordId:'y',grade:'A-',units:'4',gradingSystem:'general'},{recordId:'z',grade:'B+',units:'3',gradingSystem:'general'}]}},
};
for(const [key,s] of Object.entries(sourceExamples)){
 const d=sourceBoundProfiles.find(d=>d.id===`private.profile.${s.name}`)!;
 adapters.push({masterId:Number(key),engineKind:'source-profile',definition:d,example:s.input,run:(input,plan)=>exportSourceProfile(d.id,input,plan),replay:importSourceProfile,headline:o=>o[s.metric]===null?'No graded units':formatRational(o[s.metric] as Rational)});
}
adapters.push({masterId:488,engineKind:'annual-heat',definition:annualHeatComparison,
 example:{methodSnapshot:'2026-10-29',currency:'GBP',heatBoundary:'same-annual-space-heat',auxiliaryBoundary:'outside-scop-only',usefulHeatKwh:'12000',existingEfficiency:'0.8',scop:'3',outsideAuxiliaryKwh:'0',fuelTariff:'0.08',electricityTariff:'0.25',incrementalInstalledCost:'4000'},
 run:exportAnnualHeatComparison,replay:importAnnualHeatComparison,headline:o=>formatRational(o.annualSavings as Rational)});
for(const spec of [
 {masterId:469,name:'disclosed-lease',metric:'totalPayment',input:{currency:'USD',period:'month',capitalized:18800,residual:12350,rentCharge:5295,payments:48,disclosedChargePerPayment:12.25}},
 {masterId:82,name:'target-trajectory',metric:'balance',input:{currency:'USD',period:'month',initial:100,initialTarget:150,timing:'end',steps:[{rate:0,cashflow:25,target:150},{rate:0,cashflow:25,target:150}]}},
]){
 const d=privateWorkflowDefinitions.find(d=>d.id===`private.workflow.${spec.name}`)!;
 adapters.push({masterId:spec.masterId,engineKind:'workflow',definition:d,example:spec.input,run:input=>exportPrivateWorkflow(d.id,input),replay:importPrivateWorkflow,headline:o=>String(o[spec.metric])});
}
function adapter(id:number){const a=adapters.find(a=>a.masterId===id);if(!a)throw Error('No adopted private engineering profile for this identity');return a;}
export const finalPrivateExamples:Readonly<Record<number,Record<string,unknown>>>=copyCalculationData(Object.fromEntries(adapters.map(a=>[a.masterId,a.example])),{}).input as Record<number,Record<string,unknown>>;
type Discovery={masterId:number;title:string;available:boolean;canonicalCompleted:false;definitionId:string|null;methodology:string;sources:readonly {label:string;url?:string;note?:string}[];remainingGaps:readonly string[]};
export const finalPrivateDiscovery:readonly Discovery[]=copyCalculationData({rows:register.rows.map(r=>{
 const a=adapters.find(a=>a.masterId===r.masterId);
 return {masterId:r.masterId,title:r.title,available:!!a,canonicalCompleted:false,definitionId:a?.definition.id??null,methodology:a?.definition.formulas.map(f=>f.description).join('\n')??'No selected private profile in this workbench. Existing candidates and original authority decisions are retained; do not invent a governing contract.',sources:a?.definition.sources??[],remainingGaps:r.remainingGaps};
})},{}).input.rows as unknown as readonly Discovery[];
export function exportFinalPrivate(masterId:number,input:unknown,plan:Plan='free'){
 z.enum(['free','pro','business']).parse(plan);const a=adapter(masterId);
 return Object.freeze({schemaVersion:1 as const,masterId,engineKind:a.engineKind,calculatorId:a.definition.id,payload:a.run(input,plan)});
}
export type FinalPrivateSnapshot=ReturnType<typeof exportFinalPrivate>;
const envelope=z.object({schemaVersion:z.literal(1),masterId:z.number().int(),engineKind:z.string(),calculatorId:z.string(),payload:z.unknown()}).strict();
export function importFinalPrivate(raw:unknown):FinalPrivateSnapshot{
 const s=envelope.parse(copyCalculationData({envelope:raw},{}).input.envelope),a=adapter(s.masterId);
 const replayed=a.replay(s.payload);
 // Family replay establishes a valid historical payload, but it can belong to
 // another profile. Re-export through the SELECTED adapter to bind the outer
 // method/identity to its actual input, metadata and output contract.
 const payload=a.run(replayed.calculation.input,'free');
 const expected=Object.freeze({schemaVersion:1 as const,masterId:a.masterId,engineKind:a.engineKind,calculatorId:a.definition.id,payload});
 if(!equalCompletionJson(s,expected))throw Error('Workbench identity/engine/payload mismatch');return expected;
}
export function finalPrivateHeadline(snapshot:FinalPrivateSnapshot){return adapter(snapshot.masterId).headline(snapshot.payload.calculation.output);}
