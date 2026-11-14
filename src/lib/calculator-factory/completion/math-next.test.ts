import {describe,it,expect} from 'vitest';
import originalVectors from '../../../../tests/milestone60-20261113/math-vectors.json';
import extraVectors from '../../../../docs/milestone60-20261113/math-next-extra-cases.json';
const vectors=[...originalVectors,...extraVectors];
import {calculateNextMath,reverseNextMath,graphNextMath,nextMathContracts,type NextMathId} from './math-next';
import {launchDefinitions} from '../../../calculators/launch-portfolio';
describe('fifteen private geometry completions',()=>{
 for(const vector of vectors){const id=vector.catalogId as NextMathId;const input=vector.input as unknown as Record<string,number>;
 it(`captures, reverse solves and replays ${id}`,()=>{
 const packet=calculateNextMath(id,input);expect(packet.snapshot.output.result).toBeCloseTo(vector.expected,12);
 const contract=nextMathContracts.find(row=>row.catalogId===id)!;
 const engine=launchDefinitions.find(row=>row.id===contract.engineId&&row.slug===contract.slug&&row.version===contract.version)!;
 expect(packet.snapshot.output).toEqual(engine.calculate(engine.inputSchema.parse(input),{}));
 const inverse=reverseNextMath(id,input,vector.target);expect(inverse.value).toBeCloseTo(vector.reverseExpected,12);
 expect(inverse.replay.snapshot.output.result).toBeCloseTo(vector.target,11);
 expect(calculateNextMath(id,JSON.parse(JSON.stringify(packet.snapshot.input)) ).snapshot.output).toEqual(packet.snapshot.output);
 expect(Object.isFrozen(packet.snapshot.input)).toBe(true);
 const graph=graphNextMath(id,input,[0,12,-1,Infinity]);expect('y' in graph[1] ? graph[1].y : undefined).toBeCloseTo(vector.target,11);expect(graph[2]).toHaveProperty('error');expect(graph[3]).toHaveProperty('error');
 expect(()=>calculateNextMath(id,{...input,unexpected:2})).toThrow();
 expect(()=>reverseNextMath(id,input,-1)).toThrow();
 });}
 it('matches independent exact integer area and perimeter witnesses',()=>{
 const area=calculateNextMath(259,{length:12345,width:6789}).snapshot.output.result;
 expect(area).toBe(Number(12345n*6789n));
 expect(calculateNextMath(256,{base:24690,height:6789}).snapshot.output.result).toBe(area);
 expect(calculateNextMath(260,{length:12345,width:6789}).snapshot.output.result).toBe(Number(2n*(12345n+6789n)));
 expect(calculateNextMath(255,{a:119,b:120}).snapshot.output.result).toBe(169);
 });
 it('checks exact additional shape witnesses and degenerate volume domains',()=>{
 expect(calculateNextMath(261,{side:12345}).snapshot.output.result).toBe(Number(12345n**2n));
 expect(calculateNextMath(262,{side:12345}).snapshot.output.result).toBe(Number(4n*12345n));
 expect(calculateNextMath(266,{base:12345,height:6789}).snapshot.output.result).toBe(Number(12345n*6789n));
 expect(calculateNextMath(267,{a:12344,b:12346,height:6789}).snapshot.output.result).toBe(Number(12345n*6789n));
 expect(calculateNextMath(273,{length:123,width:456,height:789}).snapshot.output.result).toBe(Number(123n*456n*789n));
 expect(()=>reverseNextMath(267,{a:0,b:0,height:3},0)).toThrow(/unique/);
 expect(()=>reverseNextMath(271,{radius:0,height:3},0)).toThrow(/unique/);
 expect(()=>reverseNextMath(273,{length:0,width:3,height:4},0)).toThrow(/unique/);
 for(const row of extraVectors){const id=row.catalogId as NextMathId;const input=row.input as unknown as Record<string,number>;const contract=nextMathContracts.find(c=>c.catalogId===id)!;
 expect(()=>calculateNextMath(id,{...input,[contract.solveFor]:-1})).toThrow();
 expect(()=>calculateNextMath(id,{...input,[contract.solveFor]:Number.MIN_VALUE})).toThrow();
 expect(()=>calculateNextMath(id,{...input,[contract.solveFor]:Number.MAX_VALUE})).toThrow();
 expect(calculateNextMath(id,{...input,[contract.solveFor]:0}).snapshot.output.result).toBe(0);
 }
 });
 it('refuses degenerate inverses and out of domain targets',()=>{
 expect(()=>reverseNextMath(255,{a:3,b:4},2)).toThrow();
 expect(()=>reverseNextMath(256,{base:0,height:2},0)).toThrow();
 expect(()=>reverseNextMath(259,{length:0,width:2},0)).toThrow();
 expect(()=>reverseNextMath(260,{length:10,width:5},4)).toThrow();
 expect(()=>graphNextMath(265,{radius:1},Array(102).fill(1))).toThrow();
 });
 it('refuses overflow, subnormal and lost nonzero captures but preserves witnessed zero',()=>{
 expect(()=>calculateNextMath(263,{radius:1e200})).toThrow();
 expect(()=>calculateNextMath(259,{length:1e-200,width:1e-200})).toThrow();
 expect(()=>calculateNextMath(259,{length:1e-160,width:1e-160})).toThrow();
 expect(calculateNextMath(259,{length:0,width:4}).snapshot.output.result).toBe(0);
 expect(()=>calculateNextMath(265,{radius:NaN})).toThrow();
 expect(()=>calculateNextMath(255,{a:Number.MIN_VALUE,b:4})).toThrow(/input outside/);
 expect(()=>calculateNextMath(265,{radius:2**-1022})).not.toThrow();
 expect(()=>calculateNextMath(256,{base:-1,height:2})).toThrow();
 expect(()=>calculateNextMath(260,{length:1e308,width:1e308})).toThrow();
 });
});
