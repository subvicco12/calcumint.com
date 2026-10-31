import {describe,it,expect} from 'vitest';
import {runCanonicalCalculus as run} from './canonical-calculus';
const derivative=(expression:string,x='0')=>run({operation:'derivative',expression,x});
const limit=(expression:string,x='1',direction='both')=>run({operation:'limit',expression,x,direction});
const integral=(expression:string,lower='0',upper='1')=>run({operation:'integral',expression,lower,upper});
describe('independent exact calculus revision3',()=>{
 it.each([['x^3','2','12'],['x^-2','2','-0.25'],['(x^2-1)/(x-1)','2','1'],['(3*x^2+2*x+1)/(x+1)','0','1'],['0.1*x+0.2*x','1','0.3'],['1e-200*1e-200*1e200*x','1','1e-200']])('exact derivative %s',(expression,x,expected)=>{const r=derivative(expression,x);expect(r.arithmetic).toBe('exact-rational');if(expected==='1e-200'){expect(r.exact).toEqual({numerator:'1',denominator:'1'+'0'.repeat(200)});}else expect(r.value).toBe(expected);});
 it.each(['(x^2-1)/(x-1)','x/x','(1/x)^0','0*(1/x)'])('retains original derivative hole %s',expression=>expect(()=>derivative(expression,expression.includes('x-1')?'1':'0')).toThrow());
 it.each([['(x^3-1)/(x^2-1)','1','3/2'],['(x-1)^2/(x-1)','1','0'],['0/(x-1)','1','0'],['(x-1)^32/(x-1)^31','1','0'],['(x-1)^2/(2*(x-1)^2)','1','0.5']])('exact removable limit %s',(expression,x,expected)=>expect(limit(expression,x).value).toBe(expected==='3/2'?'1.5':expected));
 it('uses pole parity and selected side',()=>{const f='(x-1)/(x-1)^2';expect(limit(f,'1','left').classification).toBe('negative-infinity');expect(limit(f,'1','right').classification).toBe('positive-infinity');expect(limit(f).classification).toBe('does-not-exist');expect(limit('1/(x-1)^2').classification).toBe('positive-infinity');expect(limit('-1/(x-1)^2').classification).toBe('negative-infinity');});
 it.each([['x^2','0','1','1/3'],['x/3','-2','2','0'],['x^2','1','0','-1/3'],['(x+1)^2','-1','2','9'],['x^32','0','1','1/33']])('exact polynomial integral %s',(expression,lower,upper,value)=>expect(integral(expression,lower,upper).value).toBe(value));
 it.each(['x/x','1/(1+x^2)','(1/x)^0','1/(x-x)','exp(x)'])('does not infer polynomial extension %s',expression=>{expect(()=>integral(expression)).toThrow();expect(()=>integral(expression,'0','0')).toThrow();});
 it('rejects identically undefined ratio and over-budget expressions',()=>{for(const expression of ['0/0','x^33','1e257*x','1e-257*x','9'.repeat(65)+'*x'])expect(()=>derivative(expression,'1')).toThrow();});
 it('preserves precision and classifies fallback honestly',()=>{expect(derivative('x^2','0.000000000000000001').value).toBe('0.000000000000000002');const r=limit('exp(-x^2/1e-20)','0');expect(r.value).toBe('1');expect(r.arithmetic).toBe('binary64-analytic');expect(r.exact).toBeNull();expect(()=>derivative('sin(x)','1000000.000000000000000001')).toThrow();expect(()=>derivative('sin(1.000000000000000001*x)','1')).toThrow();});
 it('rejects schema drift and nondifferentiable analytic domains',()=>{expect(()=>run({operation:'derivative',expression:'x',x:1})).toThrow();expect(()=>derivative('abs(x)')).toThrow();expect(()=>limit('sqrt(x)','0')).toThrow();expect(()=>run({operation:'limit',expression:'x',x:'0',direction:'up'})).toThrow();});
});
