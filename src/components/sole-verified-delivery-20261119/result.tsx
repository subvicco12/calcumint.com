import {FinalCalculatorRenderer} from '../final-calculator-renderer';
import {deliveryContract,verifyVerifiedDeliveryPacket} from '@/lib/sole-verified-delivery-20261119/cohort';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';

export function DeliveryResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const checked=verifyVerifiedDeliveryPacket(packet),profile=deliveryContract(checked.identity.catalogId!);
 const {steps,bracket,residual,iterations}=checked.snapshot.output;
 return <section aria-label="Calculation result">
  <FinalCalculatorRenderer result={profile.result(checked)} presentation={profile.presentation} plan={plan}/>
  <section aria-label="Exact delivery details">
   <p>Technical version {checked.identity.calculatorVersion}. Source revision {checked.identity.sourceVersion}.</p>
   {Array.isArray(bracket)&&<table style={{width:'100%',tableLayout:'fixed',overflowWrap:'anywhere'}}>
    <caption>Bracket and convergence evidence</caption><thead><tr><th scope="col">Measure</th><th scope="col">Value</th></tr></thead>
    <tbody><tr><th scope="row">Left bound</th><td>{String(bracket[0])}</td></tr>
     <tr><th scope="row">Right bound</th><td>{String(bracket[1])}</td></tr>
     <tr><th scope="row">Residual</th><td>{String(residual)}</td></tr>
     <tr><th scope="row">Iterations</th><td>{String(iterations)}</td></tr></tbody>
   </table>}
   {Array.isArray(steps)&&<details><summary>Calculation steps</summary><ol>{steps.map((step,index)=><li key={index}>{String(step)}</li>)}</ol></details>}
  </section>
 </section>;
}
