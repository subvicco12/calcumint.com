import {createRoot} from 'react-dom/client';
import {CandidateWorkbench} from '@/components/full-six/candidate-workbench';
import {candidateIds,type CandidateCatalogId} from '@/lib/full-six/candidate/workflow';
import {normalizePlan} from '@/lib/entitlements';
import '@/app/globals.css';
const query=new URLSearchParams(location.search),id=Number(query.get('id')??276) as CandidateCatalogId,plan=normalizePlan(query.get('plan'));
declare global{interface Window{__sixCandidateDownloads:{name:string;text:string}[]}}
window.__sixCandidateDownloads=[];
if(query.get('capture')==='1'){const Original=window.Worker;(window as unknown as {__sixWorkerAudit:{created:number;terminated:number}}).__sixWorkerAudit={created:0,terminated:0};window.Worker=class extends Original{constructor(url:string|URL,options?:WorkerOptions){super(url,options);(window as unknown as {__sixWorkerAudit:{created:number}}).__sixWorkerAudit.created++;}terminate(){(window as unknown as {__sixWorkerAudit:{terminated:number}}).__sixWorkerAudit.terminated++;super.terminate();}};}
createRoot(document.getElementById('root')!).render(<main style={{maxWidth:1000,padding:'1rem',margin:'auto',overflowWrap:'anywhere'}}><p>Isolated authenticated reviewer preview. Experimental code, synthetic plan context, no production account or storage. RELEASE HOLD remains active.</p>{candidateIds.includes(id)?<CandidateWorkbench catalogId={id} plan={plan} {...(query.get('capture')==='1'?{download:(name:string,text:string)=>window.__sixCandidateDownloads.push({name,text})}:{})}/>:<p role="alert">Unknown catalog identity</p>}</main>);
