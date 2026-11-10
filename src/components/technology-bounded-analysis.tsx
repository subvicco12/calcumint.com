'use client';
import {useId,useState} from 'react';
import {analyzeTechnologyNextFive,solveTechnologyNextFive} from '@/lib/technology-next-five-analysis';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import {canUseFinalCapability,type FinalPlan} from '@/calculators/final-framework/product-capabilities';
type Props={id:string;input:Readonly<Record<string,unknown>>;plan:FinalPlan};
export function TechnologyBoundedAnalysis(props:Props){
 // An input change starts a new goal session, including clearing the entered target.
 return <AnalysisSession key={JSON.stringify([props.id,props.input])} {...props}/>;
}
function AnalysisSession({id,input,plan}:Props){
 const uid=useId(),[target,setTarget]=useState(''),[attempt,setAttempt]=useState<{message?:string;error?:string}|null>(null);
 let analysis:ReturnType<typeof analyzeTechnologyNextFive>;
 try{analysis=analyzeTechnologyNextFive(id,input);}catch{return <section aria-label='Analysis'><p role='alert'>Analysis requires valid current inputs in the supported domain.</p></section>;}
 const a=analysis,valid=a.points.filter(p=>p.result!==undefined),maxX=Math.max(1,...valid.map(p=>p.inputValue)),maxY=Math.max(1,...valid.map(p=>p.result!)),title=`Relationship: ${a.axis.resultUnit} by ${a.axis.unit}`;
 const change=(value:number|undefined)=>{if(value===undefined)return 'Refused';if(a.current===0)return 'Undefined at zero baseline';const percentage=(value-a.current)/Math.abs(a.current)*100;return Number.isFinite(percentage)?String(percentage)+'%':'Outside supported finite percentage range';};
 return <section aria-label='Analysis' style={{minWidth:0,overflowWrap:'anywhere'}}>
 <h3>Relationship and supported goals</h3><p>Each sample changes one supplied variable and uses the original registered engine. All other inputs stay fixed.</p>
 <figure><svg role='img' aria-label={title} viewBox='0 0 360 220' width='360' style={{maxWidth:'100%',height:'auto'}}><title>{title}</title><desc>Unconnected verified points. Read exact values and refusals in the relationship table.</desc><path d='M40 10V180H350' fill='none' stroke='currentColor'/>{valid.map((p,i)=><circle key={i} cx={40+p.inputValue/maxX*300} cy={180-p.result!/maxY*160} r='4' fill='currentColor'/>)}<text x='45' y='205'>{a.axis.label} ({a.axis.unit})</text><text x='45' y='20'>{a.axis.resultUnit}</text></svg><figcaption>{title}. Discrete points are not a continuous interpolation.{a.axis.discrete?' Only supported integer inputs are sampled.':''}</figcaption></figure>
 <div role='region' aria-label='Relationship table' tabIndex={0} style={{maxWidth:'100%',overflowX:'auto'}}><table aria-label='Relationship samples'><caption>Original registered engine samples</caption><thead><tr><th scope='col'>Sample</th><th scope='col'>{a.axis.label} ({a.axis.unit})</th><th scope='col'>Result ({a.axis.resultUnit})</th></tr></thead><tbody>{a.points.map((p,i)=><tr key={i}><th scope='row'>{p.label}</th><td>{String(p.inputValue)}</td><td>{p.error?'Refused: '+p.error:String(p.result)}</td></tr>)}</tbody></table></div>
 <p>Samples outside the supported domain are refused individually; a partial set does not extend the calculator domain.</p>
 {canUseFinalCapability(plan,'sensitivityAnalysis')?<section aria-label='Sensitivity comparison'><h4>Sensitivity comparison</h4><table aria-label='Relative result changes'><thead><tr><th scope='col'>Sample</th><th scope='col'>Result change</th></tr></thead><tbody>{a.points.map((p,i)=><tr key={i}><th scope='row'>{p.label}</th><td>{change(p.result)}</td></tr>)}</tbody></table></section>:<p>Sensitivity comparison uses the centrally governed account capability.</p>}
 {canUseFinalCapability(plan,'scenarioComparison')?<section aria-label='Projection scenarios'><h4>Projection scenarios</h4><p>These unsaved projections keep the supplied context below. They do not change saved calculations or create persisted scenarios.</p><dl>{Object.entries(input).filter(([key])=>key!==a.axis.key).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{String(value)}</dd></div>)}</dl></section>:<p>Persisted scenarios use the centrally governed account workflow.</p>}
 {canUseFinalCapability(plan,'goalSolver')?<form aria-label='Target calculation' onSubmit={event=>{event.preventDefault();try{const solved=solveTechnologyNextFive(id,input,requiredCalculatorNumber(target));setAttempt({message:`${solved.label}: ${solved.value} ${solved.unit}. Forward verified result: ${solved.forwardValue} ${a.axis.resultUnit}.`});}catch(error){setAttempt({error:error instanceof Error?error.message:'Target cannot be verified'});}}}><label htmlFor={uid}>Target result ({a.axis.resultUnit})</label><input id={uid} inputMode='decimal' value={target} onChange={event=>{setTarget(event.target.value);setAttempt(null);}} aria-describedby={uid+'-help'}/><p id={uid+'-help'}>Only supported targets with an exact forward verification are returned. An unattainable target is refused.</p><button type='submit'>Solve target</button>{attempt?.error&&<p role='alert'>{attempt.error}</p>}{attempt?.message&&<p role='status'>{attempt.message}</p>}</form>:<p>Goal solving requires an active goal-solver capability.</p>}
 <p>Batch delivery is not available in this analysis panel; its exact Business contract remains a separate requirement.</p><p>Technical calculation revision: {a.id}@{a.version}. Analysis does not change saved snapshots.</p>
 </section>;
}
