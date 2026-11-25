import {FinalCalculatorRenderer} from '../final-calculator-renderer';
import {finalContract,verifyFinalFactoryPacket} from '@/lib/sole-final-factory-20261119/cohort';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';

export function FactoryResult({packet,plan}:{packet:FactoryExecutionPacket;plan:CalcuMintPlan}){
 const checked=verifyFinalFactoryPacket(packet);
 const profile=finalContract(checked.identity.catalogId!);
 const steps=checked.snapshot.output.steps as readonly string[];
 return <section aria-label="Calculation result">
  <FinalCalculatorRenderer result={profile.result(checked)} presentation={profile.presentation} plan={plan}/>
  <section aria-label="Exact factory details">
   <p>Technical version {checked.identity.calculatorVersion}. Source revision {checked.identity.sourceVersion}.</p>
   <details><summary>Calculation steps</summary><ol>{steps.map((step,index)=><li key={index}>{step}</li>)}</ol></details>
  </section>
 </section>;
}
