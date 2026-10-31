import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {CalculatorScenarioWorkspace} from '../../../src/components/calculator-scenario-workspace';
import {calculatorRegistry} from '../../../src/calculators/registry';
import {runCalculator} from '../../../src/calculators/engine';
import {createCalculationSnapshot} from '../../../src/lib/calculation-snapshot';
import type {CalcuMintPlan} from '../../../src/lib/entitlements';
import cases from './cases.json';
function Fixture(){
 const params=new URLSearchParams(location.search),index=Number(params.get('case')??0),plan=params.get('plan') as CalcuMintPlan;
 const [changed,setChanged]=useState(false);const [slug,input,key,a,field,b,c]=cases[index] as [string,Record<string,unknown>,string,number,string,number,number];
 const definition=calculatorRegistry.getBySlug(slug)!;const values=changed?{...input,[field]:b}:input;
 const snapshot=createCalculationSnapshot({calculatorSlug:slug,calculatorVersion:definition.version,input:values,output:runCalculator(definition,values).output as Record<string,unknown>});
 if(snapshot.output[key]!== (changed?c:a))throw Error('Independent fixture golden mismatch');
 return <main style={{maxWidth:1000,margin:'auto',padding:12,fontFamily:'system-ui',overflowWrap:'anywhere'}}><h1>Isolated scenario report recovery</h1><p>Synthetic {plan} plan; registered mathematics only. No account authentication, canonical acceptance or publication.</p><output data-testid="golden">{String(snapshot.output[key])}</output><button onClick={()=>setChanged(!changed)}>Switch current calculation</button><pre data-testid="current" hidden>{JSON.stringify(snapshot)}</pre><CalculatorScenarioWorkspace plan={plan} snapshot={snapshot} download={(filename,content,mime)=>{const url=URL.createObjectURL(new Blob([content],{type:mime}));const link=document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}/></main>;
}
createRoot(document.getElementById('root')!).render(<Fixture/>);
