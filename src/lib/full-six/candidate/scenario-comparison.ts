import type {CandidateArtifact} from './workflow';
type Data=Record<string,unknown>;
type Context={mode:string;unit:string;encoding:string;effectiveN:number|null;metrics:Record<string,string>};
function context(artifact:CandidateArtifact):Context{
 const summary=artifact.output.summary as Data|undefined,counts=summary?.counts as Data|undefined;
 return {mode:typeof summary?.mode==='string'?summary.mode:'unavailable',unit:typeof summary?.unit==='string'?summary.unit:'',encoding:typeof summary?.encoding==='string'?summary.encoding:'unavailable',effectiveN:typeof counts?.effectiveN==='number'?counts.effectiveN:null,metrics:Object.fromEntries(Object.entries((summary?.metrics as Data)??{}).filter((entry):entry is [string,string]=>typeof entry[1]==='string'))};
}
/** Recorded descriptive summaries only. Never infer unit conversions, change an
 * estimand, compute deltas between unlike quantities, or mutate saved artifacts. */
export function compareStatisticsScenarios(a:CandidateArtifact,b:CandidateArtifact){
 const ac=context(a),bc=context(b),reasons:string[]=[];
 if(![282,283].includes(a.catalogId)||a.catalogId!==b.catalogId||a.engineId!==b.engineId||a.baselineVersion!==b.baselineVersion||a.implementationRevision!==b.implementationRevision||a.contractSHA256!==b.contractSHA256)reasons.push('Calculator identity, contract or immutable implementation binding differs.');
 if(a.output.status!=='finite'||b.output.status!=='finite'||!['population','sample'].includes(ac.mode)||!['population','sample'].includes(bc.mode)||!Object.keys(ac.metrics).length||!Object.keys(bc.metrics).length)reasons.push('Two successful statistics summaries are required.');
 if(ac.mode!==bc.mode)reasons.push('Population/sample estimands differ.');
 if(ac.unit!==bc.unit)reasons.push('Observation units differ; no unit conversion is inferred.');
 const compatible=reasons.length===0;
 const names=[...new Set([...Object.keys(ac.metrics),...Object.keys(bc.metrics)])];
 const unitFor=(name:string)=>ac.unit?(['variance','centeredM2'].includes(name)?`${ac.unit}^2`:ac.unit):'dimensionless';
 return {compatible,reasons,a:ac,b:bc,metrics:compatible?names.map(name=>({name,a:ac.metrics[name]??'unavailable',b:bc.metrics[name]??'unavailable',unit:unitFor(name)})):[]};
}
