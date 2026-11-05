import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CalculatorInteractive} from '@/components/calculator-interactive';
import {useCalculatorPlan} from '@/components/use-calculator-plan';
import {synthetic} from '../release-candidate/synthetic-client';
import remaining from './witnesses.json';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import '@/app/globals.css';
declare global{interface Window{__closureDownloads:{type:string;text:string}[]}}
window.__closureDownloads=[];
Object.assign(window,{__registeredReplay:verifyRegisteredSnapshot,__synthetic:synthetic});
URL.createObjectURL=blob=>{if(!(blob instanceof Blob))throw Error('Only Blob exports accepted');void blob.text().then(text=>window.__closureDownloads.push({type:blob.type,text}));return 'blob:private-calculator-closure';};
function App(){
 const plan=useCalculatorPlan();const [id,setId]=useState(Number(new URLSearchParams(location.search).get('id')??'208'));
 const target=remaining.find(row=>row.catalogId===id);
 return <main className="container" style={{padding:'1rem',maxWidth:1100,margin:'auto',overflowWrap:'anywhere'}}><h1>Private calculator workflow regression</h1><p>Actual calculator and account action source with synthetic account transport. No production persistence, approval or publication. RELEASE HOLD active.</p><output id="plan">{plan}</output><label>Review calculator<select value={id} onChange={event=>setId(Number(event.target.value))}>{remaining.map(row=><option key={row.catalogId} value={row.catalogId}>{row.catalogId}: {row.slug}</option>)}</select></label>{target?<CalculatorInteractive slug={target.slug}/>:<p role="alert">Unknown exact review identity.</p>}</main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
