import React from 'react';
import {createRoot} from 'react-dom/client';
import {StatisticsWorkbench} from '@/components/full-six/statistics-workbench';
import {normalizePlan} from '@/lib/entitlements';
import '@/app/globals.css';
const query=new URLSearchParams(location.search);
const id=query.get('id')==='282'?282:283;
const validIdentity=!query.has('id')||['282','283'].includes(query.get('id')??'');
const plan=normalizePlan(query.get('plan'));
declare global{interface Window{__statisticsWorkerAudit:{created:number;terminated:number;rowCounts:number[]};__statisticsDownloads:{name:string;text:string}[]}}
window.__statisticsDownloads=[];
const capture=query.get('capture')==='1';
window.__statisticsWorkerAudit={created:0,terminated:0,rowCounts:[]};
if(capture){const NativeWorker=window.Worker;window.Worker=class extends NativeWorker{constructor(url:string|URL,options?:WorkerOptions){super(url,options);window.__statisticsWorkerAudit.created++;}postMessage(message:unknown,options?:Transferable[]|StructuredSerializeOptions){if(message&&typeof message==='object'&&'input' in message){const input=(message as {input:{rows?:unknown[]}}).input;if(Array.isArray(input?.rows)){if(window.__statisticsWorkerAudit.rowCounts.length===512)window.__statisticsWorkerAudit.rowCounts.shift();window.__statisticsWorkerAudit.rowCounts.push(input.rows.length);}}if(Array.isArray(options))super.postMessage(message,options);else super.postMessage(message,options);}terminate(){window.__statisticsWorkerAudit.terminated++;super.terminate();}};}

createRoot(document.getElementById('root')!).render(<main className="container" style={{padding:'1rem',maxWidth:'100%',overflowWrap:'anywhere'}}><h1>Private Decimal50 statistics review</h1><p>Isolated reviewer fixture. Unregistered experimental implementation. No canonical certification, authenticated persistence or publication. RELEASE HOLD remains active. Plan selection is synthetic acceptance context only.</p>{validIdentity?<StatisticsWorkbench catalogId={id} plan={plan} {...(capture?{download:(name:string,text:string)=>{window.__statisticsDownloads.push({name,text});}}:{})}/>:<p role="alert">Unknown statistics catalog identity. Select 282 or 283.</p>}</main>);
