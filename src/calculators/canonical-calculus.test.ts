import {describe,it,expect} from 'vitest';
import {runCanonicalCalculus} from './canonical-calculus';
describe('exact canonical calculus engineering contract v3',()=>{
 it.each([['x^3','2','12'],['(x^2-1)/(x-1)','2','1'],['0.1*x+0.2*x','1','0.3']])('differentiates rational %s',(expression,x,value)=>expect(runCanonicalCalculus({operation:'derivative',expression,x}).value).toBe(value));
 it('preserves original domain holes',()=>expect(()=>runCanonicalCalculus({operation:'derivative',expression:'(x^2-1)/(x-1)',x:'1'})).toThrow());
 it.each([['(x^2-1)/(x-1)','1','2'],['(x^3-1)/(x^2-1)','1','1.5'],['(x-1)^2/(x-1)','1','0'],['0/(x-1)','1','0']])('exact removable limit %s',(expression,x,value)=>expect(runCanonicalCalculus({operation:'limit',expression,x,direction:'both'})).toMatchObject({classification:'finite',value,arithmetic:'exact-rational'}));
 it('classifies directional poles without finite fabricated values',()=>{for(const [direction,classification] of [['left','negative-infinity'],['right','positive-infinity'],['both','does-not-exist']] as const)expect(runCanonicalCalculus({operation:'limit',expression:'1/(x-1)',x:'1',direction})).toMatchObject({classification,exact:null});expect(runCanonicalCalculus({operation:'limit',expression:'1/(x-1)^2',x:'1',direction:'both'}).classification).toBe('positive-infinity');});
 it.each([['x^2','0','1','1/3'],['x^2','3','0','-9'],['x/3','-2','2','0']])('integrates polynomial %s',(expression,lower,upper,value)=>expect(runCanonicalCalculus({operation:'integral',expression,lower,upper}).value).toBe(value));
 it.each(['x/x','1/x','0*(1/x)'])('rejects variable denominator integration before cancellation %s',expression=>expect(()=>runCanonicalCalculus({operation:'integral',expression,lower:'1',upper:'1'})).toThrow());
 it('retains validated analytic method for narrow continuous peak',()=>expect(runCanonicalCalculus({operation:'limit',expression:'exp(-x^2/1e-20)',x:'0',direction:'both'})).toMatchObject({value:'1',arithmetic:'binary64-analytic'}));
 it.each([{operation:'limit',expression:'0/0',x:'0'},{operation:'derivative',expression:'x^33',x:'0'},{operation:'integral',expression:'x',lower:'NaN',upper:'1'},{operation:'derivative',expression:'x',x:'1',extra:true},{operation:'derivative',expression:'x',x:'1000000.000000000000000001'}])('strict schemas/resources %j',input=>expect(()=>runCanonicalCalculus(input)).toThrow());
});
