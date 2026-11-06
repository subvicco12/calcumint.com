import {createRoot} from 'react-dom/client';
import {CalculatorInteractive} from '@/components/calculator-interactive';
import {useCalculatorPlan} from '@/components/use-calculator-plan';
import {publication20Definitions} from '@/lib/publication20';
import {verifyRegisteredSnapshot} from '@/lib/registered-snapshot-verification';
import {synthetic} from '../release-candidate/synthetic-client';
import '@/app/globals.css';
const id=Number(new URLSearchParams(location.search).get('id')??432),entry=publication20Definitions.find(x=>x.catalogId===id);
declare global{interface Window{__shortestDownloads:{type:string;text:string}[]}}
window.__shortestDownloads=[];Object.assign(window,{__shortestReplay:verifyRegisteredSnapshot,__synthetic:synthetic});
URL.createObjectURL=blob=>{if(!(blob instanceof Blob))throw Error('Blob expected');void blob.text().then(text=>window.__shortestDownloads.push({type:blob.type,text}));return 'blob:shortest-publication-preview';};
function App(){const plan=useCalculatorPlan();return <main style={{padding:'1rem',maxWidth:1100,margin:'auto',overflowWrap:'anywhere'}}><h1>Private publication candidate acceptance</h1><p>Actual immutable engine/UI/account actions with synthetic account transport. No genuine authentication, production history, canonical approval or publication. RELEASE HOLD active.</p><output id="plan">{plan}</output>{entry?<><h2>{entry.catalogId}: {entry.definition.title}</h2><CalculatorInteractive slug={entry.definition.slug}/></>:<p role="alert">Unknown exact candidate ID</p>}</main>;}
createRoot(document.getElementById('root')!).render(<App/>);
