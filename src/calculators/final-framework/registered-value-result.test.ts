import {expect,it} from 'vitest';import {registeredValueResult} from './registered-value-result';
const definition={slug:'synthetic',version:2,formulas:[{id:'f',expression:'Exact expression',description:'Exact description'}],sources:[{label:'Exact source',url:'https://example.invalid/source'}]};
it.each([0,-0,-1e-12,Number.MAX_VALUE])('maps raw value %s without coercion, metadata mutation or invented units',value=>{
 const output={value,steps:['Existing step']};const presentation={label:'Existing label',unit:'Existing unit',methodology:'Existing methodology',warnings:['Existing caution']};const before=structuredClone({definition,output,presentation});const result=registeredValueResult(definition,output,presentation);expect(result.primaryResult).toEqual({id:'result',label:presentation.label,unit:presentation.unit,value});expect(result.sources).toEqual(definition.sources);expect(result.warnings).toEqual(presentation.warnings);expect(result.methodology).toBe('Existing methodology\n\nExact description\nExact expression');expect({definition,output,presentation}).toEqual(before);
});
it('keeps absent sources/formulas absent without erasing caller methodology or adding review claims',()=>{
 const result=registeredValueResult({...definition,formulas:[],sources:[]},{value:0},{label:'Value',methodology:'Existing context'});expect(result.sources).toEqual([]);expect(result.methodology).toBe('Existing context');expect(result.primaryResult.unit).toBeUndefined();
});
