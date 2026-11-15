import {it,expect} from 'vitest';
import {verifyRegisteredSnapshot} from './registered-snapshot-verification';
import {getFactoryWorkflows} from './calculator-factory/registry';
import {getRemainderCaptureWorkflows} from './calculator-factory/completion/remainder-capture-successor';
import {verifyFactoryPacket,verifyFactoryStoredSnapshot} from './calculator-factory/completion/business';
const snapshot=()=>getFactoryWorkflows(274).execute({length:'2',width:'3',height:'4'}).snapshot;
it('dispatches exact immutable surface-area v1 history without changing its fields',()=>{const value=snapshot();const verified=verifyRegisteredSnapshot(value);expect(verified.snapshot).toEqual(value);expect(verified.engineId).toBe('geometry.surface-area');expect(verified.engineVersion).toBe(1);});
it('rejects unknown versions, extra fields, nonfinite input and output substitution',()=>{const value=snapshot();for(const bad of [{...value,calculatorVersion:2},{...value,input:{...value.input,extra:1}},{...value,input:{...value.input,length:Infinity}},{...value,output:{...value.output,surfaceArea:0}},{...value,extra:true}])expect(()=>verifyRegisteredSnapshot(bad)).toThrow();});
it('coexists with Worker A historical recovery and preserves unadopted packet refusal',()=>{const packet=getRemainderCaptureWorkflows().execute({a:'1.5',b:'.5'});expect(verifyRegisteredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);expect(verifyFactoryStoredSnapshot(packet.snapshot).snapshot).toEqual(packet.snapshot);expect(()=>verifyFactoryPacket(packet)).toThrow();});
