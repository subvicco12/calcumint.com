'use client';
import {useId,useState} from 'react';
import {getPlanEntitlements,type CalcuMintPlan} from '@/lib/entitlements';
import {factoryResult,getFactoryContract} from '@/lib/calculator-factory/registry';
import {previewFactorySensitivity,exportFactorySensitivity,replayFactorySensitivity,type FactorySensitivityPreview} from '@/lib/calculator-factory/completion/sensitivity';
import {equalCompletionJson} from '@/calculators/completion-contracts';
import {factoryDeliveryIdentity} from '@/lib/native-delivery/factory-delivery-catalog';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
export function CalculatorFactorySensitivity({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 if(!factoryDeliveryIdentity(packet.identity.catalogId??-1,packet.identity.calculatorVersion))return null;
 return <PreviewSession key={JSON.stringify([packet,plan])} packet={packet} plan={plan}/>;
}
function PreviewSession({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const prefix=useId(),contract=getFactoryContract(packet.identity.catalogId!)!,fields=contract.fields.filter(row=>row.kind==='number'),enabled=getPlanEntitlements(plan).scenarios;
 const [field,setField]=useState(fields[0]?.key??''),[text,setText]=useState(''),[result,setResult]=useState<FactorySensitivityPreview|null>(null),[error,setError]=useState(''),[replayText,setReplayText]=useState('');
 const unit=factoryResult(contract.catalogId,packet.raw).primaryResult.unit;
 const download=(format:'json'|'csv'|'pdf')=>{if(!result)return;try{const file=exportFactorySensitivity(result,format,plan),url=URL.createObjectURL(new Blob([new Uint8Array(file.bytes)],{type:file.mime})),anchor=document.createElement('a');anchor.href=url;anchor.download=file.filename;document.body.append(anchor);try{anchor.click();}finally{anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}}catch(cause){setError(cause instanceof Error?cause.message:'Download unavailable');}};
 const clear=()=>{setResult(null);setError('');};
 return <section aria-label="What-if sensitivity"><h3>What-if sensitivity</h3><p>Explicit candidates run the same immutable engine. This is not a derivative or forecast. Current results, saved history and scenario captures stay unchanged. Differences retain the original output scale{unit?` (${unit})`:''}.</p>
 {!enabled&&<p>Optional what-if previews require Pro or Business; Free calculations use identical mathematics.</p>}
 <form onSubmit={event=>{event.preventDefault();clear();try{setResult(previewFactorySensitivity(packet,field,text.split(','),plan));}catch(cause){setError(cause instanceof Error?cause.message:'Candidate refused');}}}>
 <label htmlFor={prefix+'-field'}>What-if numeric field</label><select id={prefix+'-field'} value={field} disabled={!enabled} onChange={event=>{setField(event.target.value);clear();}}>{fields.map(row=><option key={row.key} value={row.key}>{row.label}</option>)}</select>
 <label htmlFor={prefix+'-values'}>Candidate values</label><input id={prefix+'-values'} value={text} disabled={!enabled} maxLength={20000} aria-invalid={error?true:undefined} aria-describedby={prefix+'-help'} onChange={event=>{setText(event.target.value);clear();}}/>
 <p id={prefix+'-help'}>Enter 1–25 complete decimal values, separated by commas. Every candidate must satisfy the same field domain and numerical refusal boundaries; one invalid candidate refuses the entire preview.</p>
 <button type="submit" disabled={!enabled}>Preview what-if</button></form>
 {error&&<p role="alert">{error}</p>}{result&&<><p role="status">{result.points.length} candidate values computed; original captures are unchanged.</p><div role="region" aria-label="What-if comparison table" tabIndex={0} style={{maxWidth:'100%',overflowX:'auto'}}><table><caption>What-if comparison</caption><thead><tr><th scope="col">Entered candidate</th><th scope="col">Actual engine result{unit?` (${unit})`:''}</th><th scope="col">Difference from baseline{unit?` (${unit})`:''}</th></tr></thead><tbody>{result.points.map((point,index)=><tr key={index}><th scope="row">{point.raw}</th><td>{String(point.value)}</td><td>{point.difference===null?'Difference outside finite range':String(point.difference)}</td></tr>)}</tbody></table></div>{(['json','csv','pdf'] as const).map(format=><button key={format} onClick={()=>download(format)}>Download what-if {format.toUpperCase()}</button>)}</>}
 <label htmlFor={prefix+'-replay'}>What-if artifact JSON</label><textarea id={prefix+'-replay'} value={replayText} disabled={!enabled} maxLength={8_000_000} onChange={event=>{setReplayText(event.target.value);setError('');}}/>
 <button type="button" disabled={!enabled||!replayText.trim()} onClick={()=>{clear();try{const replayed=replayFactorySensitivity(replayText,plan);if(!equalCompletionJson(replayed.baseline,packet))throw Error('Restore the matching original baseline packet before replaying this what-if artifact');setResult(replayed);setField(replayed.field);setText(replayed.points.map(point=>point.raw).join(','));}catch(cause){setError(cause instanceof Error?cause.message:'Replay refused');}}}>Replay what-if</button>
 </section>;
}
