'use client';
import {CalculatorFactoryWorkbench} from './calculator-factory-workbench';
import {getRemainderCaptureWorkflows} from '@/lib/calculator-factory/completion/remainder-capture-successor';
import type {FactoryExecutionPacket} from '@/lib/calculator-factory/workflows';
import type {CalcuMintPlan} from '@/lib/entitlements';

const fields=Object.freeze([{key:'a',label:'Dividend',defaultValue:'1.5',kind:'number' as const},{key:'b',label:'Divisor',defaultValue:'.5',kind:'number' as const}]);
/** Unregistered private preview. A real save handler is supplied by its host;
 * a local plan prop never substitutes for authenticated server authorization. */
export function RemainderCaptureSuccessor({plan='free',onSave}:{plan?:CalcuMintPlan;onSave?:(packet:FactoryExecutionPacket)=>Promise<string>}){
 return <><p>Signed JavaScript remainder, not Euclidean modulo. The result follows the dividend sign. This private capture successor retains the version-one formula and is not adopted or certified.</p>
 <CalculatorFactoryWorkbench workflows={getRemainderCaptureWorkflows()} fields={fields} plan={plan} title="Remainder — private exact-zero capture" onSave={onSave} renderResult={packet=><table aria-label="Exact signed remainder" style={{width:'100%',overflowWrap:'anywhere'}}><thead><tr><th scope="col">Expression</th><th scope="col">Result</th></tr></thead><tbody><tr><th scope="row">a % b</th><td>{Object.is(packet.snapshot.output.result,-0)?'-0':String(packet.snapshot.output.result)}</td></tr></tbody></table>}/></>;
}
