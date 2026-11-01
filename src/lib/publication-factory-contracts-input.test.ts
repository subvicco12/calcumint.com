import {expect,it} from 'vitest';
import {parsePublicationFactoryInput as parse,parsePublicationFactoryNumber as number} from './publication-factory-contracts-input';
it.each(['1e-400','1e400','100000000000.000001','9007199254740993'])('retains lossy numeric draft %s and refuses JSON capture',text=>{expect(number(text)).toBe(text);expect(()=>parse('{"value":'+text+'}')).toThrow(/precision|finite/i);});
it.each(['0.1','1.00','1e3','1e100','9007199254740992','-0','0e999999999'])('accepts stable numeric spelling %s',text=>{expect(number(text)).toBe(Number(text));expect(parse(text)).toBe(Number(text));});
it('ignores numeric-looking quoted strings including escaped quote and slash',()=>{const text=JSON.stringify({label:'"1e400\\ 9007199254740993',nested:['1e-400',0.1]});expect(parse(text)).toEqual(JSON.parse(text));});
it.each(['','+1','01','1.','1e','NaN','Infinity','{"a":1,}','[1 2]','"unterminated'])('keeps malformed JSON invalid: %s',text=>expect(()=>parse(text)).toThrow());
it('keeps invalid and incomplete numeric drafts as raw text',()=>{for(const text of ['','-','1e','  ','0x10'])expect(number(text)).toBe(text);});
it('bounds text and nesting without rejecting a normal nested object',()=>{expect(()=>parse(' '.repeat(2000001))).toThrow(/size/);expect(()=>parse('['.repeat(129)+'0'+']'.repeat(129))).toThrow(/nesting/);expect(parse('{"a":[{"b":2}]}')).toEqual({a:[{b:2}]});});

it('distinguishes precision refusal from unchanged JSON syntax errors',()=>{try{parse('{"value":1e-400}');throw Error('Expected refusal');}catch(error){expect(error).toBeInstanceOf(Error);expect(error).not.toBeInstanceOf(SyntaxError);expect((error as Error).message).toMatch(/precision/);}expect(()=>parse('{"value":}')).toThrow(SyntaxError);});
it('bounds extreme exponent handling and ignores zero exponents',()=>{expect(number('1e-'+ '9'.repeat(10000))).toMatch(/^1e-/);expect(number('0e'+ '9'.repeat(10000))).toBe(0);});

it.each(['.5','+1','1.','01','-.5'])('accepts native decimal form draft %s while JSON stays strict',text=>{expect(number(text)).toBe(Number(text));expect(()=>parse(text)).toThrow(SyntaxError);});
it.each(['.1e-400','+100000000000.000001','01.000000000000000001'])('retains lossy native decimal form %s',text=>expect(number(text)).toBe(text));
