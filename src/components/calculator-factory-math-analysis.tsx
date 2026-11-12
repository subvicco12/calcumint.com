'use client';
import {useId,useState} from 'react';
import {completeScalarMath,reverseScalarMath,type ScalarMathId,type MathGraphPoint} from '@/lib/calculator-factory/completion/math';
type Props={catalogId:number;x:number};
const finite=(text:string)=>{if(!text.trim()||!Number.isFinite(Number(text)))throw Error('Enter a finite numeric value');return Number(text);};
export function CalculatorFactoryMathAnalysis(props:Props){
 if(![218,219,220].includes(props.catalogId))return null;
 return <MathSession key={`${props.catalogId}:${props.x}`} catalogId={props.catalogId as ScalarMathId} x={props.x}/>;
}
function MathSession({catalogId,x}:{catalogId:ScalarMathId;x:number}){
 const prefix=useId();
 const [target,setTarget]=useState(''),[solution,setSolution]=useState<readonly number[]|null>(null);
 const [minimum,setMinimum]=useState('-2'),[maximum,setMaximum]=useState('2'),[count,setCount]=useState('9');
 const [points,setPoints]=useState<readonly MathGraphPoint[]>([]),[error,setError]=useState('');
 let analysis:ReturnType<typeof completeScalarMath>;
 try{analysis=completeScalarMath(catalogId,x);}catch{return <p role="alert">Enter valid current inputs to inspect math analysis.</p>;}
 const valid=points.filter((p):p is MathGraphPoint&{y:number}=>p.y!==undefined);
 const ymax=Math.max(1,...valid.map(p=>Math.abs(p.y)));
 const xmin=points.length?points[0].x:0,xmax=points.length?points[points.length-1].x:1;
 // Normalize before subtracting to avoid overflow for opposite finite extremes.
 const xscale=Math.max(1,Math.abs(xmin),Math.abs(xmax));
 const px=(v:number)=>10+280*((v/xscale-xmin/xscale)/(xmax/xscale-xmin/xscale||1));
 const py=(v:number)=>100-85*(v/ymax);
 return <section aria-label="Scalar math analysis">
  <h3>Arithmetic steps</h3>
  <table aria-label="Arithmetic steps"><thead><tr><th scope="col">Expression</th><th scope="col">Value</th></tr></thead><tbody>{analysis.steps.map((step,i)=><tr key={i}><th scope="row">{step.expression}</th><td>{String(step.value)}</td></tr>)}</tbody></table>
  <p>{analysis.rounding}</p>
  <form aria-label="Reverse solve" onSubmit={event=>{event.preventDefault();setError('');setSolution(null);try{setSolution(reverseScalarMath(catalogId,finite(target)));}catch(e){setError(e instanceof Error?e.message:'Target refused');}}}>
   <p>{analysis.inverse}</p>
   <label htmlFor={`${prefix}-target`}>Target output</label><input id={`${prefix}-target`} inputMode="decimal" value={target} onChange={e=>{setTarget(e.target.value);setSolution(null);}}/>
   <button type="submit">Solve target</button>
  </form>
  {solution&&<p role="status">Candidate input values: {solution.map(String).join(', ')}. Approximate binary64 solutions; verified against forward output within 8 relative machine epsilons (about 1.78e-15). Current input and result are unchanged.</p>}
  <form aria-label="Graph sampling" onSubmit={event=>{event.preventDefault();setError('');setPoints([]);try{
   const lo=finite(minimum),hi=finite(maximum),n=finite(count);
   if(!Number.isInteger(n)||n<2||n>101)throw Error('Enter an integer sample count from 2–101');
   if(!(lo<hi))throw Error('Graph minimum must be less than maximum');
   const samples=Array.from({length:n},(_,i)=>i===0?lo:i===n-1?hi:lo*(1-i/(n-1))+hi*(i/(n-1)));
   if(samples.some(v=>!Number.isFinite(v)))throw Error('Graph samples must be finite');
   setPoints(completeScalarMath(catalogId,x,samples).graph);
  }catch(e){setError(e instanceof Error?e.message:'Graph refused');}}}>
   <label htmlFor={`${prefix}-min`}>Graph minimum x</label><input id={`${prefix}-min`} inputMode="decimal" value={minimum} onChange={e=>{setMinimum(e.target.value);setPoints([]);}}/>
   <label htmlFor={`${prefix}-max`}>Graph maximum x</label><input id={`${prefix}-max`} inputMode="decimal" value={maximum} onChange={e=>{setMaximum(e.target.value);setPoints([]);}}/>
   <label htmlFor={`${prefix}-count`}>Graph sample count</label><input id={`${prefix}-count`} inputMode="numeric" value={count} onChange={e=>{setCount(e.target.value);setPoints([]);}}/>
   <button type="submit">Sample graph</button>
  </form>
  {error&&<p role="alert">{error}</p>}
  {points.length>0&&<>
   <p>Explicit engine samples only. Refused points are gaps; no interpolation is implied. The table gives exact sample values.</p>
   <svg role="img" aria-labelledby={`${prefix}-chart-title`} aria-describedby={`${prefix}-chart-desc`} viewBox="0 0 300 200" style={{width:'100%',maxWidth:600}}>
    <title id={`${prefix}-chart-title`}>Sampled scalar relationship</title><desc id={`${prefix}-chart-desc`}>Horizontal axis: input x from {String(xmin)} to {String(xmax)}. Vertical axis: output, scaled symmetrically to {String(ymax)}. Exact values and refusals follow in Graph samples.</desc>
    <path d="M10 10V190M10 100H290" stroke="currentColor" fill="none"/>
    {valid.map((p,i)=><circle key={i} cx={px(p.x)} cy={py(p.y)} r="3" fill="currentColor"/>)}
   </svg>
   <table aria-label="Graph samples"><thead><tr><th scope="col">Input x</th><th scope="col">Output y or refusal</th></tr></thead><tbody>{points.map((p,i)=><tr key={i}><th scope="row">{String(p.x)}</th><td>{p.error?`Refused: ${p.error}`:String(p.y)}</td></tr>)}</tbody></table>
  </>}
 </section>;
}
