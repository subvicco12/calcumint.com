import {describe,it,expect} from 'vitest';
import {evaluateFullGraphDerivative} from './graph-derivative';
describe('experimental original-domain-preserving symbolic derivative',()=>{
 it.each([['x^3','2','12'],['x^2','0','0'],['x','-3','1'],['5','0','0'],['2*x+4','1','2'],['1/x','2','-0.25'],['sqrt(x)','4','0.25'],['ln(x)','2','0.5'],['exp(x)','0','1'],['abs(x)','-2','-1'],['abs(x)','2','1'],['sin(x)','0','1'],['cos(x)','0','-0'],['tan(x)','0','1'],['x^x','1','1'],['x^0','2','0'],['x^1','0','1']])('independent exact derivative witness %s at %s',(expression,x,expected)=>{const r=evaluateFullGraphDerivative(expression,x);expect(r.status).toBe('finite');expect(r.raw).toBe(expected);});
 it('applies the degree chain rule without changing saved mode',()=>{const r=evaluateFullGraphDerivative('sin(x)','0',{angleMode:'degrees'});expect(r.status).toBe('finite');expect(r.value).toBeCloseTo(0.017453292519943295769236907684886,15);expect(r.angleMode).toBe('degrees');});
 it.each([['abs(x)','0'],['sqrt(x)','0'],['(x^2-1)/(x-1)','1'],['0^0','0'],['ln(x)','0'],['x^1.5','0'],['(-2)^x','2']])('preserves original domain and unsupported derivative at %s,%s',(expression,x)=>expect(evaluateFullGraphDerivative(expression,x).status).not.toBe('finite'));
 it('returns typed domain failures rather than NaN/Infinity',()=>{const r=evaluateFullGraphDerivative('sin x','1');expect(r.status).toBe('domain-error');expect(r.raw).toBeNull();});
});
