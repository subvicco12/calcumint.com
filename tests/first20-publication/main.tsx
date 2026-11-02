import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CalculatorInteractive} from '@/components/calculator-interactive';
import {useCalculatorPlan} from '@/components/use-calculator-plan';
import {synthetic} from '../release-candidate/synthetic-client';
import {wave1Bindings,getWave1Definition} from '@/lib/first20/wave1-witnesses';
import {runCalculator} from '@/calculators/engine';
import {launchDefinitions} from '@/calculators/launch-portfolio';
import {polygonAreaSuccessor,createPolygonSnapshot,replayPolygonSnapshot} from '@/lib/first20/polygon-successor';
import {requiredCalculatorNumber} from '@/lib/registered-input-successor';
import '@/app/globals.css';
declare global{interface Window{__first20Downloads:{type:string;text:string}[];__first20Replay:(id:number,value:unknown)=>unknown;__polygonReplay:typeof replayPolygonSnapshot}}
window.__first20Downloads=[];window.__polygonReplay=replayPolygonSnapshot;
window.__first20Replay=(id,value)=>{const snapshot=value as {calculatorSlug:string;calculatorVersion:number;input:unknown;output:unknown};const def=getWave1Definition(id);if(snapshot.calculatorSlug!==def.slug||snapshot.calculatorVersion!==def.version)throw Error('Exact first-wave identity mismatch');const actual=runCalculator(def,snapshot.input);if(JSON.stringify(actual.input)!==JSON.stringify(snapshot.input)||JSON.stringify(actual.output)!==JSON.stringify(snapshot.output))throw Error('First-wave replay differs');return actual;};
Object.assign(window,{__synthetic:synthetic});
URL.createObjectURL=blob=>{if(!(blob instanceof Blob))throw Error('First20 fixture only captures Blob exports');void blob.text().then((text:string)=>window.__first20Downloads.push({type:blob.type,text}));return 'blob:private-first20-fixture';};
function PolygonReview(){const [sides,setSides]=useState('');const [side,setSide]=useState('');const input={sides:requiredCalculatorNumber(sides),side:requiredCalculatorNumber(side)};const legacy=launchDefinitions.find(x=>x.id===polygonAreaSuccessor.id)!;let before='Enter valid inputs',after='Enter valid inputs';try{before=String(runCalculator(legacy,input).output.result);}catch{before='v1 rejects this input';}let output:number|undefined;try{output=runCalculator(polygonAreaSuccessor,input).output.result;after=String(output);}catch{output=undefined;}return <section aria-label="Regular polygon successor review"><h2>Unregistered regular-polygon v2 review target</h2><p>Not canonical, certified or published; regular n/side mode only. Historical v1 is unchanged.</p><label>Sides<input type="number" value={sides} onChange={e=>setSides(e.target.value)}/></label><label>Side length<input type="number" value={side} onChange={e=>setSide(e.target.value)}/></label><p id="legacy">Legacy: {before}</p><p id="successor">Candidate: {after}</p><button disabled={output===undefined} onClick={()=>{const snapshot=createPolygonSnapshot(input,2);window.__first20Downloads.push({type:'application/json',text:JSON.stringify(snapshot)});}}>Export review JSON</button></section>;}
function App(){const plan=useCalculatorPlan();const id=Number(new URLSearchParams(location.search).get('id')??'209');const target=wave1Bindings.find(x=>x.masterId===id);return <main className="container" style={{padding:'1rem',maxWidth:1100,margin:'auto',overflowWrap:'anywhere'}}><h1>Private first-20 acceptance</h1><p>Actual calculator source with synthetic account transport/plan. No production persistence, approval or publication. RELEASE HOLD remains active.</p><output id="plan">{plan}</output>{id===268?<PolygonReview/>:target?<CalculatorInteractive slug={target.slug}/>:<p role="alert">Unknown exact first-wave identity.</p>}</main>;}
createRoot(document.getElementById('root')!).render(<App/>);
