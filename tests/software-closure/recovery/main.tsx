import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ScenarioSetRecovery} from '../../../src/components/scenario-set-recovery';
import type {CapturedScenario} from '../../../src/lib/scenario-set';
// Delay only dispatch to the native reader so browser automation can exercise a pending
// operation deterministically. Completion still uses the browser's native FileReader.
const read=FileReader.prototype.readAsText;
let defer=false,release:(()=>void)|undefined;
FileReader.prototype.readAsText=function(...args:Parameters<typeof read>){
 this.addEventListener('loadend',()=>{document.documentElement.dataset.completedReads=String(Number(document.documentElement.dataset.completedReads??0)+1);},{once:true});
 if(defer){defer=false;release=()=>read.apply(this,args);}else read.apply(this,args);
};
function Fixture(){
 const [plan,setPlan]=useState<'pro'|'free'>('pro'),[version,setVersion]=useState(1),[rows,setRows]=useState<readonly CapturedScenario[]>([]);
 return <main style={{fontFamily:'system-ui',maxWidth:800,margin:'auto',overflowWrap:'anywhere'}}><h1>Private recovery lifecycle acceptance</h1><p>Synthetic access and identity controls. No authentication or canonical acceptance.</p><button onClick={()=>{defer=true;}}>Defer next native read</button><button onClick={()=>{const next=release;release=undefined;next?.();}}>Release native read</button><button onClick={()=>setPlan(p=>p==='pro'?'free':'pro')}>Toggle access</button><button onClick={()=>setVersion(v=>v===1?2:1)}>Toggle identity</button><output data-testid="context">{plan}:{version}</output><ScenarioSetRecovery plan={plan} identity={{calculatorSlug:'percentage-of-value-calculator',calculatorVersion:version}} onRecovered={setRows}/><output data-testid="recovered">{JSON.stringify(rows)}</output></main>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
