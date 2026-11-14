'use client';
import {useId,useState} from 'react';
import {getFactoryContract,getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';
import {getPlanEntitlements,type CalcuMintPlan} from '@/lib/entitlements';
import {analyzePairMath,reversePairMath,type PairMathId} from '@/lib/completion-wave-20261113/math-analysis';
import {conversionWaveContract,conversionTargetMatrix,swapConversionUnits} from '@/lib/completion-wave-20261113/conversion-workflows';
import {replayConversionFactoryCalculation,type ConversionFactoryRequest} from '@/lib/calculator-factory/cohorts/conversions';
import {physicsPresentation} from '@/lib/completion-wave-20261113/physics';
type Props={catalogId:number;packet:FactoryExecutionPacket;plan:CalcuMintPlan;onRestore:(snapshot:CalculationSnapshot)=>void};
const mathIds=[208,209,210,211,212,215,216],converterIds=[424,425,427,428,433,434],physicsIds=[322,323,324,325,327];
const control={minHeight:44,minWidth:44};
const message=(error:unknown)=>error instanceof Error?error.message:'Analysis refused';
const number=(text:string)=>{if(!text.trim()||!Number.isFinite(Number(text)))throw Error('Enter a finite numeric value');return Number(text);};
type Point={x:number;y?:number;error?:string};
export function CompletionWaveAnalysis(props:Props){
 if(![...mathIds,...converterIds,...physicsIds].includes(props.catalogId))return null;
 try{getFactoryWorkflows(props.catalogId).verify(props.packet);}catch{return <p role="alert">Analysis requires a verified current calculation.</p>;}
 return <Session key={`${props.catalogId}:${props.plan}:${JSON.stringify(props.packet)}`} {...props}/>;
}
function Samples({points,field}:{points:readonly Point[];field:string}){
 const prefix=useId(),valid=points.filter((point):point is Point&{y:number}=>point.y!==undefined);
 const xs=Math.max(1,...valid.map(p=>Math.abs(p.x))),ys=Math.max(1,...valid.map(p=>Math.abs(p.y)));
 return <><p>Discrete engine samples only. Refused points are gaps; no interpolation is implied.</p>
 <svg role="img" aria-labelledby={`${prefix}-title`} aria-describedby={`${prefix}-desc`} viewBox="0 0 300 200" style={{width:'100%',maxWidth:600}}>
 <title id={`${prefix}-title`}>Discrete relationship samples</title><desc id={`${prefix}-desc`}>Horizontal axis: {field}, symmetric scale ±{String(xs)}. Vertical axis: numeric output, symmetric scale ±{String(ys)}. Values and refusals follow in the Sample values table.</desc>
 <path d="M10 10V190M10 100H290" stroke="currentColor" fill="none"/>{valid.map((p,i)=><circle key={i} cx={150+140*(p.x/xs)} cy={100-85*(p.y/ys)} r="3" fill="currentColor"/>)}</svg>
 <table aria-label="Sample values"><thead><tr><th scope="col">{field}</th><th scope="col">Output or refusal</th></tr></thead><tbody>{points.map((p,i)=><tr key={i}><th scope="row">{String(p.x)}</th><td>{p.error?`Refused: ${p.error}`:String(p.y)}</td></tr>)}</tbody></table></>;
}
function Session({catalogId,packet,plan,onRestore}:Props){
 const prefix=useId(),contract=getFactoryContract(catalogId)!,input=packet.snapshot.input as Record<string,number>;
 const [field,setField]=useState(contract.fields[0].key),[samples,setSamples]=useState(String(packet.snapshot.input[contract.fields[0].key]));
 const [points,setPoints]=useState<readonly Point[]>([]),[target,setTarget]=useState(''),[solution,setSolution]=useState(''),[error,setError]=useState('');
 const isMath=mathIds.includes(catalogId),isConverter=converterIds.includes(catalogId),paid=getPlanEntitlements(plan).scenarios;
 if(isConverter){
  const details=conversionWaveContract(catalogId),request:ConversionFactoryRequest={catalogId,version:1,input:{value:packet.raw.value,fromUnit:packet.raw.fromUnit,toUnit:packet.raw.toUnit}};
  const units=details.units as Record<string,{symbol:string;meaning:string}>,rows=conversionTargetMatrix(request);
  const restore=(next:ConversionFactoryRequest,snapshot:CalculationSnapshot)=>{try{setError('');onRestore(replayConversionFactoryCalculation(next,snapshot).snapshot);}catch(e){setError(message(e));}};
  return <section aria-label="Conversion analysis"><h3>Offered unit relationships</h3><p>{details.scope}</p><p>{details.numericalPolicy}</p><p>{details.sourceStatus==='PARTIAL_ACRE_MAPPING_REVIEW_REMAINS'?'International acre mapping still requires source review.':'Offered unit relationships have source evidence.'} Competent review remains pending.</p>
   <dl>{Object.entries(units).map(([code,unit])=><div key={code}><dt>{unit.symbol} ({code})</dt><dd>{unit.meaning}</dd></div>)}</dl>
   <button style={control} type="button" onClick={()=>{try{setError('');const swapped=swapConversionUnits(request);restore({...request,input:{value:request.input.value,fromUnit:request.input.toUnit,toUnit:request.input.fromUnit}},swapped.snapshot);}catch(e){setError(message(e));}}}>Swap units and calculate</button>
   <p>Swap retains the entered value and exchanges source and target units.</p>
   <table aria-label="All target units"><thead><tr><th scope="col">Target unit</th><th scope="col">Result or refusal</th><th scope="col">Use result</th></tr></thead><tbody>{rows.map(row=><tr key={row.toUnit}><th scope="row">{units[row.toUnit]?.symbol??row.toUnit}</th><td>{row.status==='available'?String(row.calculation.output.result):`Refused: ${row.reason}`}</td><td>{row.status==='available'&&<button style={control} type="button" aria-label={`Use target ${units[row.toUnit]?.symbol??row.toUnit}`} onClick={()=>restore({...request,input:{...request.input,toUnit:row.toUnit}},row.calculation.snapshot)}>Use target</button>}</td></tr>)}</tbody></table>{error&&<p role="alert">{error}</p>}</section>;
 }
 const baseline=isMath?analyzePairMath(catalogId as PairMathId,input,field):physicsPresentation(catalogId,input,{field,samples:[input[field]]});
 return <section aria-label={isMath?'Paired math analysis':'Physics analysis'}><h3>Arithmetic steps</h3>
 {isMath?<><table aria-label="Arithmetic steps"><thead><tr><th scope="col">Expression</th><th scope="col">Value</th></tr></thead><tbody>{('precision' in baseline?baseline.steps:[]).map((step,i)=><tr key={i}><th scope="row">{step.expression}</th><td>{String(step.value)}</td></tr>)}</tbody></table><p>{'precision' in baseline?baseline.precision:''}</p></>:<><p>Canonical units unresolved; values below are supplied numeric operands and engine outputs. Source applicability and competent physical review remain pending.</p><p>{'releaseHold' in baseline?baseline.steps.expression:''}</p><ol>{('releaseHold' in baseline?baseline.steps.engineSteps:[]).map((step,i)=><li key={i}>{step}</li>)}</ol></>}
 <p>{baseline.scope}</p>
 <label htmlFor={`${prefix}-field`}>Analysis variable</label><select style={control} id={`${prefix}-field`} value={field} onChange={e=>{setField(e.target.value);setSamples(String(input[e.target.value]));setPoints([]);setSolution('');setError('');}}>{contract.fields.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select>
 {isMath&&<form aria-label="Reverse paired math" onSubmit={e=>{e.preventDefault();setSolution('');setError('');try{if(!paid)throw Error('Reverse solve requires Pro or Business');const solved=reversePairMath(catalogId as PairMathId,input,field,number(target));setSolution(`${solved.note}${solved.candidates.map(c=>` Candidate ${String(c.value)}; forward output ${String(c.forwardValue)}.`).join('')}`);}catch(e){setError(message(e));}}}>
 <label htmlFor={`${prefix}-target`}>Target output</label><input style={control} id={`${prefix}-target`} inputMode="decimal" disabled={!paid} value={target} onChange={e=>{setTarget(e.target.value);setSolution('');setError('');}}/><button style={control} type="submit" disabled={!paid}>Solve target</button>{!paid&&<p>Reverse solve requires Pro or Business.</p>}</form>}
 {solution&&<p role="status">{solution} Current input and result are unchanged.</p>}
 <form aria-label="Discrete sample analysis" onSubmit={e=>{e.preventDefault();setError('');setPoints([]);try{const values=samples.split(',').map(number);if(values.length>101)throw Error('Supply 1–101 samples');setPoints(isMath?analyzePairMath(catalogId as PairMathId,input,field,values).points:values.map(x=>{try{return{x,y:physicsPresentation(catalogId,{...input,[field]:x},{field,samples:[x]}).value};}catch(e){return{x,error:message(e)};}}));}catch(e){setError(message(e));}}}>
 <label htmlFor={`${prefix}-samples`}>Sample input values, separated by commas</label><input style={control} id={`${prefix}-samples`} value={samples} onChange={e=>{setSamples(e.target.value);setPoints([]);setError('');}}/><button style={control} type="submit">Calculate samples</button></form>
 {error&&<p role="alert">{error}</p>}{points.length>0&&<Samples points={points} field={contract.fields.find(f=>f.key===field)!.label}/>}</section>;
}
