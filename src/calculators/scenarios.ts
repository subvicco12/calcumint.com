export type Scenario<TInput>={id:string;label:string;input:TInput};
export type ScenarioResult<TInput,TOutput>=Scenario<TInput>&{output:TOutput};
export type ScenarioMetric<TOutput>={id:string;value:(output:TOutput)=>number;preference?:"lower"|"higher"};
export type ScenarioMetricComparison={metricId:string;values:Readonly<Record<string,number>>;preferredScenarioId?:string};
export type ScenarioComparison<TInput,TOutput>={scenarios:readonly ScenarioResult<TInput,TOutput>[];metrics:readonly ScenarioMetricComparison[]};
function finite(value:number,label:string){if(!Number.isFinite(value))throw new Error(`${label} must be finite`);return value;}
function validId(id:string,label:string){if(!id.trim())throw new Error(`${label} id must not be empty`);if(id==="__proto__"||id==="constructor"||id==="prototype")throw new Error(`${label} id is reserved`);return id;}
function validLabel(label:string){if(!label.trim())throw new Error("Scenario label must not be empty");return label;}
/** Runs deterministic scenarios and compares only explicitly supplied numeric metrics. */
export function compareScenarios<TInput,TOutput>(scenarios:readonly Scenario<TInput>[],calculate:(input:TInput)=>TOutput,metrics:readonly ScenarioMetric<TOutput>[]):ScenarioComparison<TInput,TOutput>{
 if(scenarios.length<2)throw new Error("Scenario comparison requires at least two scenarios");
 scenarios.forEach(s=>{validId(s.id,"Scenario");validLabel(s.label);});
 if(new Set(scenarios.map(s=>s.id)).size!==scenarios.length)throw new Error("Scenario ids must be unique");
 if(metrics.length<1)throw new Error("Scenario comparison requires at least one metric");
 metrics.forEach(m=>{validId(m.id,"Scenario metric");if(m.preference!==undefined&&m.preference!=="lower"&&m.preference!=="higher")throw new Error("Scenario metric preference must be lower or higher");});
 if(new Set(metrics.map(m=>m.id)).size!==metrics.length)throw new Error("Scenario metric ids must be unique");
 const results=scenarios.map(s=>({...s,output:calculate(s.input)}));
 const comparisons=metrics.map(metric=>{
  const values=Object.create(null) as Record<string,number>;
  for(const scenario of results)values[scenario.id]=finite(metric.value(scenario.output),`Metric ${metric.id}`);
  let preferredScenarioId:string|undefined;
  if(metric.preference){
   const ordered=results.map(s=>({id:s.id,value:values[s.id]})).sort((a,b)=>metric.preference==="lower"?a.value-b.value:b.value-a.value);
   if(ordered.length>1&&ordered[0].value!==ordered[1].value)preferredScenarioId=ordered[0].id;
  }
  return{metricId:metric.id,values:Object.freeze(values),preferredScenarioId};
 });
 return{scenarios:results,metrics:comparisons};
}
