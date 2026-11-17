'use client';
import {useId,useState} from 'react';
import {getFactoryWorkflows} from '@/lib/calculator-factory/registry';
import {nextEngineeringContract,sampleNextEngineering,targetNextEngineering} from '@/lib/calculator-factory/completion/next-engineering';
import {getPlanEntitlements,type CalcuMintPlan} from '@/lib/entitlements';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalculationSnapshot} from '@/lib/calculation-snapshot';
type Props={packet:FactoryExecutionPacket;plan:CalcuMintPlan;onRestore:(snapshot:CalculationSnapshot)=>void};
const touch={minWidth:44,minHeight:44};
export function NextEngineeringAnalysis(props:Props){
 const contract=nextEngineeringContract(props.packet.identity.catalogId??-1);if(!contract)return null;
 try{getFactoryWorkflows(contract.catalogId).verify(props.packet);}catch{return <p role="alert">Analysis requires a verified exact-version packet.</p>;}
 return <Session {...props} key={JSON.stringify([props.packet,props.plan])}/>;
}
function Session({packet,plan,onRestore}:Props){
 const id=useId(),contract=nextEngineeringContract(packet.identity.catalogId!)!,enabled=getPlanEntitlements(plan).scenarios;
 const [field,setField]=useState(contract.fields[0].key),[candidates,setCandidates]=useState(''),[target,setTarget]=useState(''),[error,setError]=useState('');
 const [points,setPoints]=useState<ReturnType<typeof sampleNextEngineering>>([]),[witnesses,setWitnesses]=useState<ReturnType<typeof targetNextEngineering>>([]);
 const clear=()=>{setPoints([]);setWitnesses([]);setError('');};
 const valid=points.filter(point=>point.value!==undefined),xs=valid.map(p=>Number(p.raw)),ys=valid.map(p=>p.value!);
 const sx=Math.max(1,...xs.map(Math.abs)),sy=Math.max(1,...ys.map(Math.abs)),xmin=Math.min(0,...xs)/sx,xmax=Math.max(1,...xs)/sx,ymin=Math.min(0,...ys)/sy,ymax=Math.max(1,...ys)/sy;
 return <section aria-label="Next engineering analysis"><h3>Exact-version analysis</h3><p>{contract.scope}</p>
 <table aria-label="Complete immutable output"><thead><tr><th scope="col">Recorded field</th><th scope="col">Exact value</th></tr></thead><tbody>{Object.entries(packet.snapshot.output).map(([key,value])=><tr key={key}><th scope="row">{key}</th><td style={{overflowWrap:'anywhere'}}>{typeof value==='object'?JSON.stringify(value):String(value)}{key===contract.primaryKey&&contract.unit?` ${contract.unit}`:''}</td></tr>)}</tbody></table>
 <p>Samples use the same immutable engine with other inputs fixed. Refusals remain gaps. A finite candidate search does not establish a unique inverse or enumerate every solution.</p>
 <label htmlFor={id+'field'}>Candidate field</label><select id={id+'field'} value={field} onChange={e=>{setField(e.target.value);clear();}}>{contract.fields.map(row=><option key={row.key} value={row.key}>{row.label}{row.unit?` (${row.unit})`:''}</option>)}</select>
 <label htmlFor={id+'candidates'}>Explicit candidate values</label><input id={id+'candidates'} maxLength={20000} value={candidates} onChange={e=>{setCandidates(e.target.value);clear();}}/>
 <button style={touch} type="button" onClick={()=>{clear();try{setPoints(sampleNextEngineering(packet,field,candidates.split(',')));}catch(cause){setError(cause instanceof Error?cause.message:'Candidates refused');}}}>Sample candidates</button>
 {points.length>0&&<><svg role="img" aria-labelledby={id+'plot'} aria-describedby={id+'description'} viewBox="0 0 320 200" style={{width:'100%',maxWidth:640}}><title id={id+'plot'}>Discrete engine samples</title><desc id={id+'description'}>Horizontal: {field}. Vertical: {contract.primaryKey} ({contract.unit}). Exact values and refusals are in the adjacent table. Samples are not connected.</desc><path d="M20 10V180H310" stroke="currentColor" fill="none"/>{valid.map((point,index)=><circle key={index} cx={20+290*(Number(point.raw)/sx-xmin)/(xmax-xmin||1)} cy={180-170*(point.value!/sy-ymin)/(ymax-ymin||1)} r="3" fill="currentColor"/>)}</svg>
 <table aria-label="Explicit candidate results"><thead><tr><th scope="col">Entered value</th><th scope="col">Result or refusal</th></tr></thead><tbody>{points.map((point,index)=><tr key={index}><th scope="row">{point.raw}</th><td>{point.value===undefined?point.error:`${point.value} ${contract.unit??''}`}</td></tr>)}</tbody></table></>}
 <label htmlFor={id+'target'}>Target result</label><input id={id+'target'} value={target} disabled={!enabled} onChange={e=>{setTarget(e.target.value);setWitnesses([]);setError('');}}/>
 {!enabled&&<p>Target reconciliation requires Pro or Business. Free uses the same forward mathematics.</p>}
 <button style={touch} type="button" disabled={!enabled} onClick={()=>{setWitnesses([]);setError('');try{if(!enabled)throw Error('Target reconciliation requires Pro or Business');const found=targetNextEngineering(packet,field,candidates.split(','),target);setWitnesses(found);if(!found.length)setError('No exact witness among the supplied candidates. This does not prove no solution exists.');}catch(cause){setError(cause instanceof Error?cause.message:'Target refused');}}}>Reconcile exact target</button>
 {witnesses.map((point,index)=><p role="status" key={index}>{field} = {point.raw}; exact forward result = {point.value}. <button style={touch} type="button" onClick={()=>{try{onRestore(getFactoryWorkflows(contract.catalogId).verify(point.packet!).snapshot);}catch(cause){setError(cause instanceof Error?cause.message:'Restore refused');}}}>Restore verified candidate</button></p>)}
 {error&&<p role="alert">{error}</p>}
 </section>;
}
