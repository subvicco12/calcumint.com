'use client';
import {useState} from 'react';
import type {FactoryWorkflows,FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import {factoryDownload} from '@/lib/calculator-factory/completion/exports';
import type {CalcuMintPlan} from '@/lib/entitlements';
export function CalculatorFactoryDownloads({workflows,packet,title,plan}:{workflows:FactoryWorkflows;packet:FactoryExecutionPacket;title:string;plan:CalcuMintPlan}){
 const [error,setError]=useState('');
 const download=(format:'json'|'csv'|'pdf')=>{
  setError('');try{
   const file=factoryDownload(workflows,packet,format,plan,title),url=URL.createObjectURL(new Blob([new Uint8Array(file.bytes)],{type:file.mime}));
   const anchor=document.createElement('a');anchor.href=url;anchor.download=file.filename;document.body.append(anchor);
   try{anchor.click();}finally{anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  }catch(e){setError(e instanceof Error?e.message:'Download failed');}
 };
 return <section aria-label="Verified file downloads"><p>JSON retains raw entry and exact replay provenance. CSV and tagged PDF are presentation artifacts.</p>{(['json','csv','pdf'] as const).map(format=><button key={format} onClick={()=>download(format)}>Download {format.toUpperCase()}</button>)}{error&&<p role="alert">{error}</p>}</section>;
}
