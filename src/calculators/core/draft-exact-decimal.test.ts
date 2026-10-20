import { describe, expect, it } from 'vitest';
import { formatRational, parseDecimal } from './draft-exact-decimal';
describe('draft exact rational final rounding and exponent bounds',()=>{
 it.each([
  [125n,100n,2,'1.2'],[135n,100n,2,'1.4'],[-125n,100n,2,'-1.2'],[-135n,100n,2,'-1.4'],
  [125n,-100n,2,'-1.2'],[-125n,-100n,2,'1.2'],[999n,100n,2,'10'],
  [1n,8n,34,'0.125'],[1n,3n,34,'0.3333333333333333333333333333333333'],
  [1000n,1n,34,'1000'],[100000n,1000000n,34,'0.1'],[0n,-1n,34,'0'],
 ] as const)('formats %s/%s at %s significant digits', (n,d,digits,expected)=>expect(formatRational(n,d,digits)).toBe(expected));
 it('accepts both exact adjusted exponent boundaries',()=>{
  expect(formatRational(10n**1000n,1n)).toBe('1'+'0'.repeat(1000));
  expect(formatRational(1n,10n**1000n)).toBe('0.'+'0'.repeat(999)+'1');
 });
 it('rejects exponent overflow and underflow before serialization',()=>{
  expect(()=>formatRational(10n**1001n,1n)).toThrow(/exponent/);
  expect(()=>formatRational(1n,10n**1001n)).toThrow(/exponent/);
  expect(()=>formatRational(10n**1001n-1n,1n)).toThrow(/Rounded/);
 });
 it('keeps largest rounding-safe exponent boundary without exponent notation',()=>{
  const n=9994n*10n**997n;
  expect(formatRational(n,1n,3)).toBe('999'+'0'.repeat(998));
  expect(()=>formatRational(9995n*10n**997n,1n,3)).toThrow(/Rounded/);
 });
 it.each([0,-1,101,1.5,NaN,Infinity])('rejects invalid precision %s',digits=>expect(()=>formatRational(1n,1n,digits)).toThrow(/precision/));
 it('rejects denominator zero even for zero numerator',()=>expect(()=>formatRational(0n,0n)).toThrow(/zero/));
 it('parses signed decimal variants without binary conversion',()=>{
  expect(parseDecimal('-.125')).toEqual({numerator:-125n,denominator:1000n});
  expect(parseDecimal('+0002.00')).toEqual({numerator:200n,denominator:100n});
  expect(parseDecimal('-0')).toEqual({numerator:0n,denominator:1n});
 });
});
