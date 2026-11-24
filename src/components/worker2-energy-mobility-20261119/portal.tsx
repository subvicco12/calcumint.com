'use client';
import {getLaunchSpec} from '@/calculators/launch-portfolio';
import {useState,useRef} from 'react';
import {chargingRoundedToZero,mobilityContracts,mobilityContract,mobilityWorkflows} from '@/lib/worker2-energy-mobility-20261119/cohort';
import {CalculatorFactoryWorkbench} from '../calculator-factory-workbench';
import {FinalResultPresentation} from '../final-result-presentation';
import {MobilityPersistence} from './persistence';
import {saveHistory} from '@/app/admin/worker2-energy-mobility-20261119/actions';
import type {ResultSeries} from '@/calculators/final-framework/types';
import type {CalcuMintPlan} from '@/lib/entitlements';
const solarStatuses:Record<string,string>={events:'Horizon crossings found', 'polar-day':'Polar day: no crossing', 'polar-night':'Polar night: no crossing', grazing:'Unresolved near-horizon conditions'};
function SolarEvents({output}:{output:Record<string,unknown>}){
 const offset=Number(output.utcOffsetMinutes);
 return <section aria-label="Solar event times"><h4>Fixed-offset event times</h4><p>UTC offset: {offset} minutes</p>
 {(['sunrisesUtc','sunsetsUtc'] as const).map(key=><div key={key}><strong>{key==='sunrisesUtc'?'Sunrise':'Sunset'}</strong>
 {(output[key] as string[]).length?<ul>{(output[key] as string[]).map(utc=>{
  const local=new Date(Date.parse(utc)+offset*60000).toISOString().slice(0,23).replace('T',' ');
  return <li key={utc}><time dateTime={utc}>{local}</time> local fixed-offset time</li>;
 })}</ul>:<p>No event available for this date.</p>}</div>)}</section>;
}
function StructuredMathDetails({id,output}:{id:number;output:Record<string,unknown>}){
 const matrix=id===242?[[output.m11,output.m12],[output.m21,output.m22]]:output.matrix;
 const steps=Array.isArray(output.steps)?output.steps:[];
 const listed=Array.isArray(output.terms)?output.terms:Array.isArray(output.roots)?output.roots:null;
 return <section aria-label="Structured mathematics result">
 {Array.isArray(matrix)&&<table><caption>{id===242?'Inverse matrix':'Result matrix'}</caption>
  <thead><tr><th scope="col">Row</th>{(matrix[0] as unknown[]).map((_,column)=><th key={column} scope="col">Column {column+1}</th>)}</tr></thead>
  <tbody>{matrix.map((row,index)=><tr key={index}><th scope="row">{index+1}</th>{(row as unknown[]).map((value,column)=><td key={column}>{String(value)}</td>)}</tr>)}</tbody>
 </table>}
 {id===238&&<dl><dt>Root 1</dt><dd>{String(output.root1Text)}</dd><dt>Root 2</dt><dd>{String(output.root2Text)}</dd></dl>}
 {id===244&&<p>Complex result: {String(output.display)}</p>}
 {id===245&&<dl><dt>Cross product (x, y, z)</dt><dd>{['x','y','z'].map(axis=>String((output.cross as Record<string,unknown>)[axis])).join(', ')}</dd>
  {output.angleRadians===null&&<><dt>Angle</dt><dd>Undefined for a zero vector.</dd></>}</dl>}
 {listed&&<details open><summary>{id===253?'Real roots':'Term preview (up to 20)'}</summary><ol>{listed.slice(0,20).map((value,index)=><li key={index}>{String(value)}</li>)}</ol></details>}
 {steps.length>0&&<details><summary>Calculation steps</summary><ol>{steps.map((step,index)=><li key={index}>{String(step)}</li>)}</ol></details>}
 </section>;
}
export function MobilityPortal({ownerId,plan}:{ownerId:string;plan:CalcuMintPlan}){
 const [id,setId]=useState<number>(mobilityContracts[0].catalogId),[draftRevision,setDraftRevision]=useState(0);const c=mobilityContract(id),retry=useRef<{key:string;id:string}|null>(null);
 return <section onChangeCapture={event=>{const target=event.target;if((target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement||target instanceof HTMLSelectElement)&&c.fields.some(f=>f.key===target.name))setDraftRevision(v=>v+1);}} className="worker2-mobility-controls" style={{maxWidth:'100%',minWidth:0,overflowWrap:'anywhere'}}>
 <label>Calculator profile<select value={id} onChange={e=>setId(Number(e.target.value))}>{mobilityContracts.map(c=><option key={c.catalogId} value={c.catalogId}>#{c.catalogId} {c.title}</option>)}</select></label>
 <p>{c.engineId}@{c.version}. {c.scope} {c.limitations.join(' ')}</p>
 <details><summary>Formula and assumptions</summary><ul>{c.engine.formulas.map(f=><li key={f.id}><code>{f.expression}</code> — {f.description}</li>)}</ul></details>
 <CalculatorFactoryWorkbench key={ownerId+':'+id} workflows={mobilityWorkflows(id)} fields={c.fields} title={c.title+' — Result unit: '+c.unit+' — private review'} plan={plan} renderResult={packet=><><FinalResultPresentation plan={plan} result={{
  primaryResult:{id:id===156&&packet.snapshot.input.mode==='dated-npv'?'npv':c.primaryKey,label:id===156&&packet.snapshot.input.mode==='dated-npv'?'Net present value':c.primaryLabel,value:id===214?getLaunchSpec('decimal-to-fraction-calculator')!.formatResult!(packet.snapshot.input as Record<string,number>,Number(packet.snapshot.output.result)):id===535?solarStatuses[String(packet.snapshot.output.status)]:id===156&&packet.snapshot.input.mode==='dated-npv'?Number(packet.snapshot.output.npv):packet.snapshot.output[c.primaryKey]===null?(id===63?'No future equality at the supplied rate':'Unavailable'):id===418?(packet.snapshot.output.offspring as string[]).join(' · '):packet.snapshot.output[c.primaryKey] as number|string,unit:packet.snapshot.output[c.primaryKey]===null?undefined:c.outputUnit?.(packet.snapshot.input)??c.unit},
  metrics:Object.entries(c.outputs).filter(([key])=>key!==c.primaryKey&&Object.hasOwn(packet.snapshot.output,key)&&!(id===156&&key==='npv')).map(([key,meta])=>({id:key,label:meta.label,unit:packet.snapshot.output[key]===null?undefined:meta.unit,value:packet.snapshot.output[key]===null?'Unavailable':packet.snapshot.output[key] as number})),
  ...((id===235||id===251)&&Array.isArray(packet.snapshot.output.points)?{series:[{id:'samples',label:'Sampled f(x)',points:packet.snapshot.output.points as ResultSeries['points']}]}:{}),
  ...(id===418?{metrics:Object.entries(packet.snapshot.output.genotypeProbabilities as Record<string,number>).map(([genotype,fraction])=>({id:genotype,label:genotype,value:100*fraction,unit:'%'}))}:{}),
  ...(packet.snapshot.output.details&&typeof packet.snapshot.output.details==='object'?{metrics:Object.entries(packet.snapshot.output.details)
   .filter(([,value])=>typeof value==='number')
   .map(([key,value])=>({id:key,label:key.replace(/([a-z])([A-Z])/g,'$1 $2'),value:value as number}))}:{}),
  ...(Array.isArray(packet.snapshot.output.amortization)?{
   schedule:(packet.snapshot.output.amortization as {month:number;payment:number;principal:number;interest:number;balance:number}[])
    .map(({month,...values})=>({id:String(month),period:month,values})),
   scheduleMetadata:{caption:'Monthly amortization in supplied currency',period:{key:'month',label:'Month'},
    columns:[{key:'payment',label:'Payment'},{key:'principal',label:'Principal'},{key:'interest',label:'Interest'},{key:'balance',label:'Remaining balance'}],
    granularity:'complete' as const},
  }:{}),
  ...(id===17?{metrics:['avalanche','snowball'].flatMap(method=>{
   const row=packet.snapshot.output[method] as {monthsToPayoff:number;totalInterest:number};
   return [{id:method+'-months',label:method+' payoff period',value:row.monthsToPayoff,unit:'months'},
    {id:method+'-interest',label:method+' total interest',value:row.totalInterest,unit:'supplied currency'}];
  })}:{}),
  methodology:c.scope,sources:c.engine.sources,warnings:c.limitations,
 }}/>{((id>=237&&id<=245)||id===249||id===250||id===253)&&<StructuredMathDetails id={id} output={packet.snapshot.output}/>}
  {id===535&&<SolarEvents output={packet.snapshot.output}/>}
  {chargingRoundedToZero(id,packet.snapshot)&&<p role="status">The estimate is positive but rounds to zero at this calculator version’s six-decimal precision.</p>}</>} onSave={async packet=>{
  const key=JSON.stringify([ownerId,packet]);if(retry.current?.key!==key)retry.current={key,id:crypto.randomUUID()};
  const result=await saveHistory({expectedOwnerId:ownerId,requestId:retry.current.id,packet});return `Authenticated immutable history saved: ${result.id}`;
 }} renderWorkflows={(packet,restore)=><MobilityPersistence catalogId={id} draftRevision={draftRevision} ownerId={ownerId} plan={plan} packet={packet} onRestore={(snapshot,restoredId)=>{if(restoredId!==id)throw Error('Choose the matching power profile before restoring');restore(snapshot);}}/>}/>
 <style>{`.worker2-mobility-controls input,.worker2-mobility-controls select,.worker2-mobility-controls button,.worker2-mobility-controls textarea{max-width:100%;min-height:44px;box-sizing:border-box;font-size:16px}.worker2-mobility-controls label{display:block}.worker2-mobility-controls :focus-visible{outline:3px solid #1259c3;outline-offset:2px}`}</style>
 </section>;
}
