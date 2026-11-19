'use client';
import {useEffect,useRef} from 'react';
import {FinalCalculatorRenderer} from '../final-calculator-renderer';
import {specializedContract,verifySpecializedFactoryPacket} from '@/lib/sole-specialized-factory-20261119/cohort';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {SurfaceOutput} from '@/calculators/advanced-math/catalog-final';

function SurfacePreview({points,minimum,maximum}:SurfaceOutput){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const element=canvas.current,context=element?.getContext('2d');
  if(!element||!context)return;
  const axes=(axis:'x'|'y'|'z')=>{
   const values=points.map(point=>point[axis]);
   const scale=Math.max(1,...values.map(Math.abs));
   const lo=Math.min(...values)/scale,hi=Math.max(...values)/scale;
   return (value:number)=>hi===lo?0.5:(value/scale-lo)/(hi-lo);
  };
  const x=axes('x'),y=axes('y'),z=axes('z');
  context.clearRect(0,0,element.width,element.height);
  for(const point of [...points].sort((left,right)=>y(right.y)-y(left.y))){
   const px=160+(x(point.x)-y(point.y))*130;
   const py=160-(x(point.x)+y(point.y))*35-z(point.z)*70;
   context.fillStyle=`hsl(${210-z(point.z)*160} 74% 34%)`;
   context.fillRect(px-2,py-2,5,5);
  }
 },[points]);
 return <figure>
  <canvas ref={canvas} width={320} height={180} style={{width:'100%',maxWidth:320,height:'auto'}}
   role="img" aria-label="Oblique preview of finite sampled surface points. Exact coordinates follow."/>
  <figcaption>{points.length} finite samples. Sampled minimum {minimum}, maximum {maximum}.</figcaption>
  <details><summary>All exact sampled coordinates</summary>
   <table style={{width:'100%',tableLayout:'fixed',overflowWrap:'anywhere'}}>
    <caption>Finite v1 surface samples</caption>
    <thead><tr><th scope="col">x</th><th scope="col">y</th><th scope="col">z</th></tr></thead>
    <tbody>{points.map((point,index)=><tr key={index}><td>{point.x}</td><td>{point.y}</td><td>{point.z}</td></tr>)}</tbody>
   </table>
  </details>
 </figure>;
}
export function SpecializedResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const checked=verifySpecializedFactoryPacket(packet),profile=specializedContract(checked.identity.catalogId!);
 const {steps}=checked.snapshot.output;
 return <section aria-label="Calculation result">
  <FinalCalculatorRenderer result={profile.result(checked)} presentation={profile.presentation} plan={plan}/>
  <section aria-label="Exact specialized details">
   <p>Technical version {checked.identity.calculatorVersion}. Source revision {checked.identity.sourceVersion}.</p>
   {profile.catalogId===252&&<SurfacePreview {...checked.snapshot.output as SurfaceOutput}/>}
   {Array.isArray(steps)&&<details><summary>Calculation steps</summary><ol>{steps.map((step,index)=><li key={index}>{String(step)}</li>)}</ol></details>}
  </section>
 </section>;
}
