import {expect,it} from 'vitest';
import {z} from 'zod';
import {ownerModel,finiteNumber,sumFinite,isoDay} from './owner-model-support';
it('constructs only approved private draft identities and preserves explicit non-approvals',()=>{
 const b=ownerModel(145,z.object({a:z.number()}).strict(),x=>({value:x.a}),[{label:'Literal',input:{a:3},expected:{value:3}}],{expression:'a',description:'Test supplied arithmetic'});
 expect(b.definition.slug).toBe('private-owner-145');expect(b.definition.reviewStatus).toBe('draft');expect(b.definition.sources[0].url).toContain('2a351a99fdcd3861beaed453db4ca11cccebb684');expect(()=>ownerModel(9,z.number(),x=>x,[],{expression:'x',description:'x'})).toThrow();
});
it('rejects invalid arithmetic instead of returning nonfinite numbers',()=>{expect(()=>finiteNumber(Infinity)).toThrow();expect(()=>sumFinite([1e308,1e308])).toThrow();expect(sumFinite([100,20,-30])).toBe(90);});
it('requires actual Gregorian UTC dates',()=>{expect(isoDay('2024-02-29')).toBe(Date.UTC(2024,1,29));expect(()=>isoDay('2023-02-29')).toThrow();expect(()=>isoDay('2024-01-01T00:00:00Z')).toThrow();});
