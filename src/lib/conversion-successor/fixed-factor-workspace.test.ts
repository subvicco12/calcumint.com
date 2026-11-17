import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {describe,it,expect} from 'vitest';
import {fixedFactorWorkspaces as definitions,runFixedFactorDraft as run,emptyFixedFactorWorkspace as empty,
 setFixedFactorCurrent as current,saveFixedFactorHistory as save,saveFixedFactorScenario as scenario,restoreFixedFactorHistory as restore,
 restoreFixedFactorScenario,compareFixedFactorScenarios as compare,exportFixedFactorWorkspace as serialize,importFixedFactorWorkspace as replay,
 fixedFactorScalarResult,fixedFactorWorkspaceDefinition} from './fixed-factor-workspace';
const pressure=definitions[0],density=definitions[1],torque=definitions[2];
describe('controlled private converter draft workflow',()=>{
 it.each(['',' ','-','.','1e','1e-999','Infinity','0x10','9007199254740993','1.0000000000000001'])('retains invalid raw input instead of inventing zero: %s',value=>{
  const draft={...pressure.example,value};expect(()=>run(pressure.engine.id,draft)).toThrow();expect(draft.value).toBe(value);
 });
 it.each(definitions)('reuses unchanged core and supplied domain for $catalogId',definition=>{
  const record=run(definition.engine.id,definition.example);
  expect(record.artifact.snapshot.output).toEqual(definition.engine.calculate({value:1,fromUnit:definition.example.fromUnit,toUnit:definition.example.toUnit}));
  expect(fixedFactorScalarResult(record).primaryResult.value).toBe(record.artifact.snapshot.output.result);
  expect(record.artifact.allocatedSuccessorVersion).toBe(null);
  expect(definition.engine.qualification.sourceApplicability).toBe('PENDING');
  expect(()=>run(definition.engine.id,{...definition.example,value:'1e308'})).toThrow(/bounded/);
  expect(()=>run(definition.engine.id,{...definition.example,value:'5e-324'})).toThrow(/bounded/);
  expect(run(definition.engine.id,{value:'5e-324',fromUnit:definition.example.fromUnit,toUnit:definition.example.fromUnit}).artifact.snapshot.output.result).toBe(Number.MIN_VALUE);
  expect(run(definition.engine.id,{...definition.example,value:'-0'}).artifact.snapshot.output.result).toBe(0);
  expect(run(definition.engine.id,{...definition.example,value:'-1'}).artifact.snapshot.output.result).toBe(-(record.artifact.snapshot.output.result as number));
 });
 it('rejects unknown fields, units and private identity without switching sources',()=>{
  expect(()=>run('unknown',pressure.example)).toThrow();expect(()=>fixedFactorWorkspaceDefinition('conversion.pressure')).toThrow();
  for(const extra of [{plan:'pro'},{value:1},{fromUnit:'invalid'},{toUnit:'kg_m3'}])expect(()=>run(pressure.engine.id,{...pressure.example,...extra})).toThrow();
 });
 it('preserves original valid raw text in detached deeply frozen history',()=>{
  const draft={...pressure.example,value:' 01.00 '},record=run(pressure.engine.id,draft);
  const a=save(current(empty(),record));draft.value='2';
  const b=save(current(a,run(density.engine.id,density.example)));
  expect(a.history).toHaveLength(1);expect(b.history).toHaveLength(2);
  expect(restore(b,0).current?.draft.value).toBe(' 01.00 ');
  expect(Object.isFrozen(a.history)&&Object.isFrozen(a.history[0].draft)&&Object.isFrozen(a.history[0].artifact.snapshot.output)).toBe(true);
  expect(()=>restore(b,-1)).toThrow();expect(()=>save(empty())).toThrow();
 });
 it('caps history explicitly at 20 without mutating previous state',()=>{
  const original=current(empty(),run(torque.engine.id,torque.example));let state=original;
  for(let index=0;index<22;index++)state=save(state);
  expect(state.history).toHaveLength(20);expect(original.history).toHaveLength(0);
 });
 it('keeps immutable A/B scenarios and requires matching identities/output units',()=>{
  const A=scenario(current(empty(),run(pressure.engine.id,pressure.example)),'A');
  const B=scenario(current(A,run(pressure.engine.id,{...pressure.example,value:'2'})),'B');
  expect(compare(B).map(row=>row.record.artifact.snapshot.output.result)).toEqual([6894.757293168362,13789.514586336723]);
  expect(A.scenarios.B).toBe(null);expect(restoreFixedFactorScenario(B,'A').current?.draft.value).toBe('1');
  expect(()=>compare(A)).toThrow(/both/);
  expect(()=>compare(scenario(current(A,run(density.engine.id,density.example)),'B'))).toThrow(/same/);
  expect(()=>compare(scenario(current(A,run(pressure.engine.id,{value:'1',fromUnit:'psi',toUnit:'kpa'})),'B'))).toThrow(/same/);
  expect(()=>restoreFixedFactorScenario(empty(),'B')).toThrow();
 });
 it('recovers all three identities and raw scenarios through one strict source-pinned envelope',()=>{
  let state=empty();for(const definition of definitions)state=save(current(state,run(definition.engine.id,definition.example)));
  state=scenario(state,'A');state=scenario(current(state,run(torque.engine.id,{...torque.example,value:'2.00'})),'B');
  const text=serialize(state),restored=replay(text);
  expect(serialize(restored)).toBe(text);expect(restored.history.map(row=>row.artifact.privateId)).toEqual(definitions.map(row=>row.engine.id));
  expect(restored.scenarios.B?.draft.value).toBe('2.00');expect(Object.isFrozen(restored.scenarios)).toBe(true);
  expect(restored.canonicalAdoptionAuthorized).toBe(false);expect(restored).not.toHaveProperty('plan');
 });
 it('rejects tamper atomically, including source/revision/raw-output mismatch and extra fields',()=>{
  const good=scenario(save(current(empty(),run(pressure.engine.id,pressure.example))),'A'),text=serialize(good);
  const changes=[{workspaceRevision:'old'},{coreRevision:'other'},{sourceArchiveSha256:'0'.repeat(64)},{canonicalAdoptionAuthorized:true},{plan:'business'},
   {current:{...good.current,draft:{...pressure.example,value:'2'}}},
   {history:[{...good.current,artifact:{...good.current!.artifact,baselineEngineId:'conversion.density'}}]},
   {scenarios:{A:good.current,B:null,C:good.current}},{history:Array.from({length:21},()=>good.current)}];
  for(const change of changes)expect(()=>replay(JSON.stringify({...good,...change}))).toThrow();
  expect(()=>replay(text.replace('"result": 6894.757293168362','"result": 0'))).toThrow();
  expect(()=>replay(text.replace('"transportVersion": 1','"transportVersion": 1,"transport\\u0056ersion": 1'))).toThrow();
  expect(()=>replay('{')).toThrow();expect(()=>replay(' '.repeat(2_000_001))).toThrow();
  expect(serialize(good)).toBe(text);
 });
 it('retains the existing immutable core and previously qualified independent witness packet bytes',()=>{
  const hash=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
  expect(hash('src/lib/conversion-successor/fixed-factor-private.ts')).toBe('b86d00832c5d9f5329e247c90a11f1463f7a8b8afb57cbbb09df99afff123e28');
  const packet=JSON.parse(readFileSync('docs/converter-methodology-20261109/converter-successor-witnesses.json','utf8'));
  expect(packet.signedNonzeroCases).toBe(1224);expect(packet.pairs).toHaveLength(68);
  expect(packet.sourceArchiveSha256).toBe(pressure.engine.sourceArchiveSha256);
 });
});
