'use client';
import {useId,useState} from 'react';
import {getFactoryContract,getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {nextMathContracts,calculateNextMath,reverseNextMath,graphNextMath,type NextMathId} from '@/lib/calculator-factory/completion/math-next';
import {conversionNextContracts} from '@/lib/calculator-factory/completion/conversion-next';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';
import {getPlanEntitlements,type CalcuMintPlan} from '@/lib/entitlements';
type Props={packet:FactoryExecutionPacket;plan:CalcuMintPlan;onRestore:(snapshot:CalculationSnapshot)=>void};
const mathIds=new Set(nextMathContracts.map(row=>row.catalogId)),conversionIds=new Set(conversionNextContracts.filter(row=>row.registered).map(row=>row.catalogId));
const touch={minHeight:44,minWidth:44};
const reason=(e:unknown)=>e instanceof Error?e.message:'Operation refused';
export function MilestoneCalculatorAnalysis(props:Props){
 const id=props.packet.identity.catalogId;if(typeof id!=='number'||(!mathIds.has(id as NextMathId)&&!conversionIds.has(id)))return null;
 try{getFactoryWorkflows(id).verify(props.packet);}catch{return <p role="alert">Analysis requires a verified exact-version packet.</p>;}
 return <Session key={JSON.stringify([props.packet,props.plan])} {...props} id={id}/>;
}
function Session({packet,plan,onRestore,id}:Props&{id:number}){
 const prefix=useId(),contract=getFactoryContract(id)!,workflows=getFactoryWorkflows(id);
 const [target,setTarget]=useState(''),[samples,setSamples]=useState(''),[solution,setSolution]=useState(''),[error,setError]=useState('');
 const [points,setPoints]=useState<ReturnType<typeof graphNextMath>>([]);
 if(conversionIds.has(id)){
  const units=contract.fields.find(field=>field.key==='toUnit')!.options!;
  const rows=units.map(toUnit=>{try{return{toUnit,snapshot:workflows.execute({...packet.raw,toUnit}).snapshot};}catch(e){return{toUnit,error:reason(e)};}});
  return <section aria-label="Additional conversion analysis"><h3>Offered unit relationships</h3><p>{contract.scope}</p>
  <button type="button" style={touch} onClick={()=>{setError('');try{onRestore(workflows.execute({...packet.raw,fromUnit:packet.raw.toUnit,toUnit:packet.raw.fromUnit}).snapshot);}catch(e){setError(reason(e));}}}>Exchange offered units</button>
  <p>Exchange calculates using the entered decimal text. Restoring uses normalized stored engine inputs; original exported packets retain their own raw entry.</p>
  <table aria-label="Offered conversion targets"><thead><tr><th scope="col">Target</th><th scope="col">Result or refusal</th><th scope="col">Restore</th></tr></thead><tbody>{rows.map(row=><tr key={row.toUnit}><th scope="row">{row.toUnit}</th><td>{row.snapshot?String(row.snapshot.output.result):`Refused: ${row.error}`}</td><td>{row.snapshot&&<button style={touch} type="button" aria-label={`Restore target ${row.toUnit}`} onClick={()=>{setError('');try{onRestore(row.snapshot!);}catch(e){setError(reason(e));}}}>Restore target</button>}</td></tr>)}</tbody></table>{error&&<p role="alert">{error}</p>}</section>;
 }
 const valid=points.filter((point):point is {x:number;y:number}=>'y' in point),xScale=Math.max(1,...valid.map(point=>Math.abs(point.x))),yScale=Math.max(1,...valid.map(point=>Math.abs(point.y)));
 const mathId=id as NextMathId,input=packet.snapshot.input as Record<string,number>,details=calculateNextMath(mathId,input),binding=nextMathContracts.find(row=>row.catalogId===id)!;
 return <section aria-label="Geometry analysis"><h3>Geometry arithmetic</h3><p>{contract.scope}</p><p>{contract.limitations.join(' ')}</p>
 <table aria-label="Geometry arithmetic"><thead><tr><th scope="col">Expression</th><th scope="col">Value</th><th scope="col">Units</th></tr></thead><tbody>{details.steps.map((row,i)=><tr key={i}><th scope="row">{row.expression}</th><td>{String(row.value)}</td><td>{details.unit}</td></tr>)}</tbody></table>
 <form aria-label="Geometry samples" onSubmit={e=>{e.preventDefault();setError('');setPoints([]);try{if(!samples.trim()||samples.length>16000)throw Error('Enter 1–101 finite sample dimensions');const values=samples.split(',').map(value=>{if(!value.trim()||!Number.isFinite(Number(value)))throw Error('Complete finite dimensions required');return Number(value);});setPoints(graphNextMath(mathId,input,values));}catch(e){setError(reason(e));}}}>
 <label htmlFor={`${prefix}-samples`}>Dimension samples</label><input id={`${prefix}-samples`} value={samples} onChange={e=>{setSamples(e.target.value);setPoints([]);setError('');}}/><p>Vary {binding.solveFor}; other dimensions stay fixed. Explicit samples only; refused points are gaps.</p><button style={touch}>Sample dimensions</button></form>
 {points.length>0&&<><svg role="img" aria-labelledby={`${prefix}-plot-title`} aria-describedby={`${prefix}-plot-description`} viewBox="0 0 320 200" style={{width:'100%',maxWidth:640}}>
 <title id={`${prefix}-plot-title`}>Geometry sample plot</title><desc id={`${prefix}-plot-description`}>Horizontal axis: {binding.solveFor}, scale 0 to {String(xScale)}. Vertical axis: engine result in {details.unit}, scale 0 to {String(yScale)}. Discrete samples only; refused inputs are omitted, never connected. Exact values and refusals follow in the Dimension samples table.</desc>
 <path d="M20 10V180H310" fill="none" stroke="currentColor"/>{valid.map((point,index)=><circle key={index} cx={20+290*(point.x/xScale)} cy={180-170*(point.y/yScale)} r="3" fill="currentColor"/>)}</svg><table aria-label="Dimension samples"><thead><tr><th scope="col">Dimension</th><th scope="col">Result or refusal</th></tr></thead><tbody>{points.map((row,i)=><tr key={i}><th scope="row">{String(row.x)}</th><td>{'y' in row?String(row.y):`Refused: ${row.error}`}</td></tr>)}</tbody></table></>}
 <form aria-label="Reverse geometry" onSubmit={e=>{e.preventDefault();setError('');setSolution('');try{if(!getPlanEntitlements(plan).scenarios)throw Error('Reverse dimensions require Pro or Business');if(!target.trim()||!Number.isFinite(Number(target)))throw Error('A finite target is required');const solved=reverseNextMath(mathId,input,Number(target));setSolution(`${solved.solveFor}: ${solved.value}. Candidate reconciled through the unchanged forward engine.`);}catch(e){setError(reason(e));}}}>
 <label htmlFor={`${prefix}-target`}>Target geometry result</label><input id={`${prefix}-target`} inputMode="decimal" value={target} onChange={e=>{setTarget(e.target.value);setSolution('');setError('');}}/><button style={touch} disabled={!getPlanEntitlements(plan).scenarios}>Solve dimension</button></form>{solution&&<p role="status">{solution}</p>}{error&&<p role="alert">{error}</p>}</section>;
}
