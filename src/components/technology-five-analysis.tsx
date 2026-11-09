'use client';
import {useId,useState} from 'react';
import {TechnologyFiveBatchPanel} from './technology-five-batch';
import {analyzeTechnologyFive,solveTechnologyFive} from '@/lib/technology-five-analysis';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {canUseFinalCapability,resolveFinalCapability} from '@/calculators/final-framework/product-capabilities';
import type {FinalPlan} from '@/calculators/final-framework/product-capabilities';
/** Read-only analysis: never changes authoritative input, headline, or saved snapshot. */
export function TechnologyFiveAnalysis({id,input,plan}:{id:string;input:Record<string,unknown>;plan:FinalPlan}){
 const uid=useId(),[target,setTarget]=useState(''),[attempt,setAttempt]=useState<{context:string;message?:string;error?:string}|null>(null);
 const context=JSON.stringify({id,input,plan});
 let analysis;try{analysis=analyzeTechnologyFive(id,input);}catch{return <section aria-label='Analysis'><p>Analysis requires valid current inputs within the supported calculation domain.</p></section>;}
 const currentAttempt=attempt?.context===context?attempt:null;
 const base64=id==='technology.base64-size';
 const title=base64?'Padded Base64 relationship: encoded bytes by raw bytes':`Transfer relationship: ${analysis.resultUnit} by ${analysis.variableUnit}`;
 const valid=analysis.points.filter((p):p is typeof p&{result:number}=>p.result!==undefined);
 const maxX=Math.max(Number.MIN_VALUE,...valid.map(p=>p.inputValue)),maxY=Math.max(Number.MIN_VALUE,...valid.map(p=>p.result));
 const baseline=analysis.points.find(p=>base64?p.inputValue===input.inputBytes:p.label==='Current')?.result;
 const percent=(value:number|undefined)=>{if(value===undefined||baseline===undefined)return 'Refused';if(baseline===0)return 'Undefined at zero baseline';const change=(value/baseline-1)*100;return Number.isFinite(change)?String(change)+'%':'Outside supported relative range';};
 const canSolve=canUseFinalCapability(plan,'goalSolver');
 return <section aria-label='Analysis'>
  <h3>Relationship analysis</h3>
  <p>{base64?'Padded payload only; line wrapping and MIME/data-URL headers are excluded.':'Ideal transfer arithmetic with decimal MB and Mbps. Protocol overhead, latency and congestion are excluded.'}</p>
  {canUseFinalCapability(plan,'basicVisualization')&&<figure>
   <svg role='img' aria-label={title} viewBox='0 0 360 220' width='360' style={{maxWidth:'100%',height:'auto'}}>
    <title>{title}</title><desc>Discrete engine-verified samples; the complete values and any refusals appear in the relationship table.</desc>
    <path d='M40 10V180H350' fill='none' stroke='currentColor'/>
    {valid.map(p=><circle key={p.inputValue} cx={40+(p.inputValue/maxX)*300} cy={180-(p.result/maxY)*160} r='4' fill='currentColor'/>)}
    <text x='45' y='205'>{analysis.variable} ({analysis.variableUnit})</text><text x='45' y='20'>{analysis.resultUnit}</text>
   </svg><figcaption>{title}. Samples are separate points, not a continuous interpolation.</figcaption>
  </figure>}
  <table aria-label='Relationship samples'><caption>Original registered engine samples</caption><thead><tr><th scope='col'>Sample</th><th scope='col'>{analysis.variable} ({analysis.variableUnit})</th><th scope='col'>Result ({analysis.resultUnit})</th></tr></thead><tbody>{analysis.points.map(p=><tr key={p.inputValue}><th scope='row'>{p.label}</th><td>{String(p.inputValue)}</td><td>{p.error?'Refused: '+p.error:String(p.result)}</td></tr>)}</tbody></table>
  {analysis.base64&&<div><p>Padding: {analysis.base64.padding} characters</p><p>Overhead: {analysis.base64.overheadBytes} bytes ({analysis.base64.overheadPercent===null?'percentage undefined for empty input':String(analysis.base64.overheadPercent)+'%'})</p></div>}
  {canUseFinalCapability(plan,'sensitivityAnalysis')?<section aria-label='Sensitivity comparison'><h4>Sensitivity comparison</h4><p>Other supplied inputs remain constant. Percentage changes are relative to the current engine result.</p><table aria-label='Relative result changes'><thead><tr><th scope='col'>Sample</th><th scope='col'>Result change</th></tr></thead><tbody>{analysis.points.map(p=><tr key={p.inputValue}><th scope='row'>{p.label}</th><td>{percent(p.result)}</td></tr>)}</tbody></table></section>:<p>Sensitivity preview: the relationship samples show how changing one input affects the result ({resolveFinalCapability(plan,'sensitivityAnalysis')}).</p>}
  {canUseFinalCapability(plan,'scenarioComparison')?<section aria-label='Projection scenarios'><h4>Projection scenarios</h4><p>Read-only candidate scenarios use the displayed {analysis.variable.toLowerCase()} samples and retain every other supplied input:</p><dl>{Object.entries(input).filter(([key])=>key!==(base64?'inputBytes':analysis.variableUnit==='Mbps'?'bandwidthMbps':'timeSeconds')).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl><p>These projections are not saved records. Save distinct current calculations through the calculator’s account actions for persisted comparison and replay.</p></section>:<p>Scenario comparison uses the centrally controlled account workflow ({resolveFinalCapability(plan,'scenarioComparison')}).</p>}
  {canSolve?<form aria-label='Target calculation' onSubmit={event=>{event.preventDefault();try{const solved=solveTechnologyFive(id,input,requiredCalculatorNumber(target));const answer=solved.interval?solved.interval.join('–'):String(solved.value);setAttempt({context,message:`${solved.label}: ${answer} ${solved.unit}. Forward verified result: ${solved.forwardValue} ${analysis.resultUnit}.`});}catch(cause){setAttempt({context,error:cause instanceof Error?cause.message:'Target cannot be verified'});}}}>
   <label htmlFor={uid}>Target result ({analysis.resultUnit})</label><input id={uid} inputMode='decimal' value={target} onChange={event=>{setTarget(event.target.value);setAttempt(null);}}/>
   <button type='submit'>Solve target</button>
   {currentAttempt?.error&&<p role='alert'>{currentAttempt.error}</p>}{currentAttempt?.message&&<p role='status'>{currentAttempt.message}</p>}
  </form>:<p>Goal solving is available with an active goal-solver capability.</p>}
  <TechnologyFiveBatchPanel key={id} id={id}/>
  <p>Technical calculation revision: {analysis.id}@{analysis.version}. Analysis does not alter the current calculation or saved snapshots.</p>
 </section>;
}
