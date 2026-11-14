import {expect,it} from 'vitest';
import {factoryDeliveryCatalog,factoryDeliveryIdentity} from './factory-delivery-catalog';
import {runFactoryEmbedCalculation} from './factory-embed-contract';
import {getFactoryContract,runFactoryCalculation} from '@/lib/calculator-factory/registry';
import {runNativeCalculation} from './contract';
import {issueNativeGrant,readNativeGrant} from './grant';
const secret='test-only-native-secret-000000000000000000000000';
const base={grantId:'00000000-0000-4000-8000-000000000001',apiKeyId:'00000000-0000-4000-8000-000000000002',organizationId:'00000000-0000-4000-8000-000000000003',issuerId:'00000000-0000-4000-8000-000000000004',version:1 as const,allowedOrigin:'https://customer.example'};
it('closes delivery to the original nine and exact sixteen registered successors',()=>{
 expect(factoryDeliveryCatalog.map(row=>row.catalogId)).toEqual([218,219,220,423,430,431,432,438,440,208,209,210,211,212,215,216,424,425,427,428,433,434,322,325,327] .concat([255, 256, 259, 260, 263, 264, 265, 429, 436, 437, 439, 261, 262, 266, 267, 269, 270, 271, 273]).concat([213,221,223,224,225,226,227,228,229,230,231,234,254,257,258,268,272,274,275,278,279,280,328,331,332]));
 for(const id of [222,276,277,323,324,441,999])expect(factoryDeliveryIdentity(id,1)).toBeUndefined();
 for(const row of factoryDeliveryCatalog)expect(factoryDeliveryIdentity(row.catalogId,2)).toBeUndefined();
});
it.each(factoryDeliveryCatalog)('uses exact existing engine data and binds signed grants for $catalogId',identity=>{
 const contract=getFactoryContract(identity.catalogId)!;
 const input=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue??field.options?.[0]??'')]));
 const actual=runFactoryEmbedCalculation(identity.catalogId,1,input);
 expect(actual.output).toEqual(runFactoryCalculation(identity.catalogId,1,input).snapshot.output);
 expect(actual).toMatchObject(identity);
 const token=issueNativeGrant({...base,catalogId:identity.catalogId},secret,100);
 expect(readNativeGrant(token,secret,101)).toMatchObject({...base,catalogId:identity.catalogId});
 expect(()=>readNativeGrant(token,secret,3700)).toThrow();
 expect(()=>readNativeGrant(token+'x',secret,101)).toThrow();
 expect(()=>runFactoryEmbedCalculation(identity.catalogId,2,input)).toThrow();
 expect(()=>runFactoryEmbedCalculation(identity.catalogId,1,{...input,formula:'x*100'})).toThrow();
});
it('retains the exact frequency response including methodology and sources',()=>{
 const input={value:'01.000',fromUnit:'hz',toUnit:'khz'};
 expect(runFactoryEmbedCalculation(440,1,input)).toEqual(runNativeCalculation({catalogId:440,version:1,input}));
 try{runFactoryEmbedCalculation(440,1,{...input,value:'bad'});throw Error('Expected refusal');}catch(error){expect(error).toMatchObject({status:422});}
 expect(()=>issueNativeGrant({...base,catalogId:441},secret,100)).toThrow();
});
it.each(factoryDeliveryCatalog)('constrains every signed $catalogId frame to its exact origin',async identity=>{
 const {nativeFramePolicy}=await import('./frame-policy');
 const token=issueNativeGrant({...base,catalogId:identity.catalogId},secret);
 expect(nativeFramePolicy(token,secret)).toContain('frame-ancestors https://customer.example');
 expect(nativeFramePolicy(token+'x',secret)).toContain("frame-ancestors 'none'");
 expect(()=>issueNativeGrant({...base,catalogId:identity.catalogId,allowedOrigin:'https://customer.example/path'},secret)).toThrow();
});
it.each([[430,'mj','MJ'],[431,'mw','MW'],[432,'week','wk'],[438,'kn','kN']] as const)('presents source-bound result units and applicability for %s', (catalogId,toUnit,symbol)=>{
 const contract=getFactoryContract(catalogId)!;
 const fromUnit=contract.fields.find(field=>field.key==='fromUnit')!.options![0];
 const actual=runFactoryEmbedCalculation(catalogId,1,{value:'1',fromUnit,toUnit});
 expect(actual).toHaveProperty('unit',symbol);
 expect(actual).toHaveProperty('applicability',expect.any(String));
 expect(actual).toHaveProperty('numericalPolicy',expect.stringContaining('binary64'));
 expect(actual).toHaveProperty('refusalPolicy',expect.stringContaining('Refuse'));
});
