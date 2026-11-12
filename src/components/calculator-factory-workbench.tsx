'use client';
import {useRef,useState,type ReactNode} from 'react';
import type {FactoryWorkflows,FactoryExecutionPacket,FactoryScenario,FactoryBatchRow} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';

/** Private engineering workbench; caller supplies a compiled trusted workflow.
 * No account mutation or server authorization is implied by a local plan prop.
 */
export type FactoryWorkbenchField=Readonly<{key:string;label:string;defaultValue?:string|number;kind?:'select'|'number'|'text';options?:readonly string[];optionLabels?:Readonly<Record<string,string>>;unit?:string}>;
export function CalculatorFactoryWorkbench({workflows,title,fields,plan='free',renderResult,onSave}:{workflows:FactoryWorkflows;title:string;fields:readonly FactoryWorkbenchField[];plan?:CalcuMintPlan;renderResult?:(packet:FactoryExecutionPacket)=>ReactNode;onSave?:(packet:FactoryExecutionPacket)=>Promise<string>}){
 const [raw,setRaw]=useState<Record<string,string>>(()=>Object.fromEntries(fields.map(f=>[f.key,String(f.defaultValue??'')])));
 const [packet,setPacket]=useState<FactoryExecutionPacket|null>(null),[scenarios,setScenarios]=useState<readonly FactoryScenario[]>([]),[rows,setRows]=useState<readonly FactoryBatchRow[]>([]);
 const [replayText,setReplayText]=useState(''),[batchText,setBatchText]=useState(''),[exportText,setExportText]=useState(''),[error,setError]=useState('');
 const [saving,setSaving]=useState(false),[saveMessage,setSaveMessage]=useState('');
 const savePending=useRef(false),revision=useRef(0);
 const clearFeedback=()=>{revision.current++;setSaveMessage('');setError('');};
 const act=(action:()=>void)=>{clearFeedback();try{action();}catch(e){setError(e instanceof Error?e.message:'Workflow failed');}};
 const save=async()=>{
  if(!onSave||!packet||savePending.current)return;
  savePending.current=true;setSaving(true);clearFeedback();const capturedRevision=revision.current;
  try{const captured=workflows.verify(packet),message=await onSave(captured);if(revision.current===capturedRevision)setSaveMessage(message);}
  catch(e){if(revision.current===capturedRevision)setError(e instanceof Error?e.message:'Save failed');}
  finally{savePending.current=false;setSaving(false);}
 };
 return <section aria-label={title}><h2>{title}</h2><p>Private engineering review. Replay checks consistency with the compiled engine and source version.</p>
 <form onSubmit={e=>{e.preventDefault();setPacket(null);setExportText('');act(()=>setPacket(workflows.execute(raw)));}}>
 {fields.map(field=>{const change=(value:string)=>{clearFeedback();setRaw({...raw,[field.key]:value});setPacket(null);setExportText('');};return <label key={field.key}>{field.label}{field.kind==='select'?<select name={field.key} value={raw[field.key]??''} onChange={e=>change(e.target.value)}><option value="">Choose {field.label}</option>{field.options?.map(option=><option key={option} value={option}>{field.optionLabels?.[option]??option}</option>)}</select>:<input type="text" inputMode={field.kind==='number'?'decimal':undefined} name={field.key} value={raw[field.key]??''} onChange={e=>change(e.target.value)}/>} {field.unit&&<span>{field.unit}</span>}</label>;})}
 <button type="submit">Calculate</button></form>
 {error&&<p role="alert">{error}</p>}
 {saveMessage&&<p role="status">{saveMessage}</p>}
 {packet&&<><h3>Result</h3>{renderResult?renderResult(packet):<pre aria-label="Exact result">{JSON.stringify(packet.snapshot.output,null,2)}</pre>}
 {onSave&&<button disabled={saving} onClick={()=>void save()}>{saving?'Saving…':'Save calculation'}</button>}
 <button onClick={()=>act(()=>setExportText(workflows.exportPacket(packet,'json',plan)))}>Export JSON</button>
 <button onClick={()=>act(()=>setExportText(workflows.exportPacket(packet,'csv',plan)))}>Export CSV</button>
 {(['A','B','C'] as const).map(slot=><button key={slot} onClick={()=>act(()=>setScenarios(workflows.scenario(scenarios,slot,packet,'',plan)))}>Capture scenario {slot}</button>)}</>}
 {scenarios.length>0&&<ul aria-label="Captured scenarios">{scenarios.map(row=><li key={row.slot}>Scenario {row.slot}<pre>{JSON.stringify(row.packet.snapshot.output)}</pre></li>)}</ul>}
 <label>Packet JSON to replay<textarea value={replayText} onChange={e=>{clearFeedback();setReplayText(e.target.value);}}/></label>
 <button onClick={()=>{setPacket(null);setExportText('');act(()=>{const checked=workflows.replay(replayText);setRaw({...checked.raw});setPacket(checked);});}}>Replay packet</button>
 <label>Batch rows (one JSON object of raw string fields per line)<textarea value={batchText} onChange={e=>{clearFeedback();setBatchText(e.target.value);setRows([]);setExportText('');}}/></label>
 <button onClick={()=>{setRows([]);setExportText('');act(()=>{if(batchText.length>65536)throw Error('Batch exceeds the 64 KiB engineering limit');setRows(workflows.batch(batchText.split('\n').map(line=>JSON.parse(line))));});}}>Run batch</button>
 {rows.length>0&&<><ol aria-label="Batch results">{rows.map((row,index)=><li key={index}>{row.error??JSON.stringify(row.packet?.snapshot.output)}</li>)}</ol><button onClick={()=>act(()=>setExportText(workflows.exportBatch(rows,plan)))}>Export batch JSON</button></>}
 {exportText&&<label>Exported data<textarea readOnly value={exportText}/></label>}
 </section>;
}
