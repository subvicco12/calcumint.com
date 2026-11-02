import {describe,it,expect} from 'vitest';
import {formatNumericValue,serializeBinary64} from './format-policy';
describe('isolated presentation policy',()=>{
 it('rounds exact decimal ties to even at 12 and 15 significant digits',()=>{
  expect(formatNumericValue('1.234567890125').display).toBe('1.23456789012');
  expect(formatNumericValue('1.234567890135').display).toBe('1.23456789014');
  expect(formatNumericValue('-1.234567890125').display).toBe('-1.23456789012');
  expect(formatNumericValue('1.234567890123445',{expanded:true}).display).toBe('1.23456789012344');
 });
 it('preserves audit strings without binary64 coercion',()=>{
  const raw='1.2345678901234567890123456789012345678901234567890';
  expect(formatNumericValue(raw).raw).toBe(raw);
  expect(formatNumericValue(raw,{expanded:true}).display).toBe('1.23456789012346');
  expect(formatNumericValue('1e-1000').display).toBe('1e-1000');
  expect(formatNumericValue('1e1000').display).toBe('1e+1000');
  expect(formatNumericValue('5e-324').display).toBe('5e-324');
 });
 it('uses scientific notation at specified magnitude boundaries',()=>{
  expect(formatNumericValue('0.000001').display).toBe('0.000001');
  expect(formatNumericValue('0.000000999').display).toBe('9.99e-7');
  expect(formatNumericValue('1000000000000').display).toBe('1e+12');
 });
 it('preserves signed zero in replay and suppresses its sign in display',()=>{
  expect(serializeBinary64(-0)).toBe('-0');
  expect(formatNumericValue('-0.000')).toMatchObject({raw:'-0.000',display:'0',negativeZero:true});
  expect(serializeBinary64(Number.MIN_VALUE)).toBe('5e-324');
 });
 it('labels approximations and uncertainty without inferring exactness',()=>{
  expect(formatNumericValue('2',{unit:'m'}).text).toBe('≈ 2 m');
  expect(formatNumericValue('2',{approximation:'exact-integer'}).text).toBe('2');
  expect(formatNumericValue('0.333333333333333',{approximation:'exact-rational'}).approximate).toBe(true);
  expect(formatNumericValue('2',{approximation:'exact-integer',uncertainty:'Final digit unstable'}).text).toBe('≈ 2 (Final digit unstable)');
 });
 it.each(['',' ','0x10','NaN','Infinity','1e','1,2','1junk'])('rejects malformed raw value %s',raw=>expect(()=>formatNumericValue(raw)).toThrow(RangeError));
 it('rejects nonfinite binary64 serialization and false integer assertions',()=>{
  expect(()=>serializeBinary64(Infinity)).toThrow(RangeError);
  expect(()=>formatNumericValue('1.2',{approximation:'exact-integer'})).toThrow(RangeError);
 });
});
