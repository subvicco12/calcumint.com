import {describe,it,expect} from 'vitest';
import {convertGeometryUnit,getGeometryUnit,supportedGeometryUnits} from './units';
describe('isolated sourced geometry units',()=>{
 it('converts exact mixed lengths and powers independently',()=>{
  expect(convertGeometryUnit('30','cm','m')).toBe('0.3');
  expect(convertGeometryUnit('1','in','m')).toBe('0.0254');
  expect(convertGeometryUnit('1','ft2','m2')).toBe('0.09290304');
  expect(convertGeometryUnit('1','in3','m3')).toBe('0.000016387064');
  expect(convertGeometryUnit('1','L','m3')).toBe('0.001');
  expect(convertGeometryUnit('1','mL','cm3')).toBe('1');
  expect(convertGeometryUnit('2','h','s')).toBe('7200');
 });
 it('retains exact same-unit lexical values including signed zero and fifty digits',()=>{
  for(const raw of ['-0','1.1234567890123456789012345678901234567890123456789','1e-1000']) expect(convertGeometryUnit(raw,'m','m')).toBe(raw);
  expect(convertGeometryUnit('1e-1000','m','cm')).toBe('1e-998');
 });
 it('provides immutable provenance and dimension metadata',()=>{
  expect(getGeometryUnit('ft')?.dimension).toBe('length');
  expect(getGeometryUnit('m2')?.dimension).toBe('area');
  expect(getGeometryUnit('ft')?.provenance).toContain('275-volume-calculator.md');
  expect(Object.isFrozen(supportedGeometryUnits)).toBe(true);
  expect(Object.isFrozen(getGeometryUnit('m'))).toBe(true);
 });
 it.each(['gal_us','gal','__proto__','constructor','yd2','kg'])('rejects unsupported unit %s',unit=>{
  expect(getGeometryUnit(unit)).toBeUndefined();
  expect(()=>convertGeometryUnit('1',unit,'m')).toThrow(RangeError);
 });
 it('rejects incompatible dimensions and malformed values',()=>{
  expect(()=>convertGeometryUnit('1','m','m2')).toThrow(RangeError);
  expect(()=>convertGeometryUnit('1','s','m')).toThrow(RangeError);
  expect(()=>convertGeometryUnit('NaN','m','m')).toThrow(RangeError);
  expect(convertGeometryUnit('1','unitless','unitless')).toBe('1');
 });
});
