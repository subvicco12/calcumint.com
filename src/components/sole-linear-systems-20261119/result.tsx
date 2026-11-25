import {FinalResultPresentation} from '../final-result-presentation';
import {linearContract,verifyLinearSystemsPacket} from '@/lib/sole-linear-systems-20261119/cohort';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';
import type {StructuredCalculationResult} from '@/calculators/final-framework/types';

const fields:Record<number,readonly (readonly [string,string,string?])[]> = {
 237:[['solution','Solution x']],
 238:[['root1Text','First root'],['root2Text','Second root'],['discriminant','Discriminant'],['vertexX','Vertex x'],['vertexY','Vertex y']],
 239:[['x','Solution x'],['y','Solution y'],['determinant','Determinant']],
 241:[['determinant','Determinant']],
 242:[['determinant','Determinant'],['m11','Inverse row 1, column 1'],['m12','Inverse row 1, column 2'],['m21','Inverse row 2, column 1'],['m22','Inverse row 2, column 2']],
 244:[['display','Rectangular result'],['real','Real component'],['imaginary','Imaginary component'],['magnitude','Magnitude'],['argument','Argument','rad']],
};

export function LinearResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const verified=verifyLinearSystemsPacket(packet);
 const c=linearContract(verified.identity.catalogId!);
 const output=verified.snapshot.output;
 const [primaryResult,...metrics]=fields[c.catalogId].map(([id,label,unit])=>{
  const value=output[id];
  if(typeof value!=='string'&&typeof value!=='number')throw Error('Verified result detail unavailable');
  return {id,label,value,unit};
 });
 const result:StructuredCalculationResult={primaryResult,metrics,methodology:c.scope,sources:c.engine.sources,
  warnings:[c.limitations,'Uses the registered v1 numerical model. Competent scope and precision review remains pending.']};
 const steps=output.steps as readonly string[];
 return <>
  <FinalResultPresentation plan={plan} result={result}/>
  <section aria-label="Exact linear systems details">
   {c.catalogId===242&&<table style={{width:'100%',tableLayout:'fixed'}}>
    <caption>Inverse matrix</caption>
    <thead><tr><th scope="col">Row</th><th scope="col">Column 1</th><th scope="col">Column 2</th></tr></thead>
    <tbody><tr><th scope="row">1</th><td>{String(output.m11)}</td><td>{String(output.m12)}</td></tr>
     <tr><th scope="row">2</th><td>{String(output.m21)}</td><td>{String(output.m22)}</td></tr></tbody>
   </table>}
   <details><summary>Calculation steps</summary><ol>{steps.map((step,i)=><li key={i}>{step}</li>)}</ol></details>
  </section>
 </>;
}
