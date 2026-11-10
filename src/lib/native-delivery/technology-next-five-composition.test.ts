import {expect,it} from 'vitest';
import {technologyNextFiveCatalog} from './technology-next-five-catalog';
import {technologyFiveIdentity} from './technology-five-catalog';
import {technologyFiveRequestSchema,runTechnologyFiveCalculation} from './technology-five-contract';
import {issueTechnologyFiveGrant,readTechnologyFiveGrant} from './technology-five-grant';
import {technologyFiveBatchSchema,runTechnologyFiveBatch} from './technology-five-jobs';
import {captureTechnologyFiveEmbedRequest} from './technology-five-embed-request';
const secret='next-five-composition-secret-000000000000000000';
const base={grantId:'00000000-0000-4000-8000-000000000001',apiKeyId:'00000000-0000-4000-8000-000000000002',organizationId:'00000000-0000-4000-8000-000000000003',issuerId:'00000000-0000-4000-8000-000000000004',allowedOrigin:'https://customer.example'};
for(const row of technologyNextFiveCatalog){
 const identity={catalogId:row.catalogId,version:row.version};
 const input=Object.fromEntries(row.fields.map(([key,,value])=>[key,value]));
 it(`composes exact ${row.catalogId}@1 API, embed grant, batch and webhook request`,async()=>{
  expect(technologyFiveIdentity(row.catalogId,1)).toBe(row);
  expect(technologyFiveRequestSchema.safeParse({...identity,input}).success).toBe(true);
  const result=runTechnologyFiveCalculation({...identity,input});
  expect(result).toMatchObject({...identity,engineId:row.engineId,enteredInput:input});
  const grant=readTechnologyFiveGrant(issueTechnologyFiveGrant({...base,...identity},secret,100),secret,101);
  expect(grant).toMatchObject({...base,...identity});
  const captured=await captureTechnologyFiveEmbedRequest(new Request('https://calcumint.example/embed',{method:'POST',headers:{'Idempotency-Key':base.grantId,'Content-Type':'application/json'},body:JSON.stringify(input)}),{catalogId:grant.catalogId,version:grant.version});
  expect(captured).toMatchObject({status:200,result});
  const batch={...identity,rows:[input,{...input,unexpected:'refused'},input],webhookEndpointId:base.grantId};
  expect(technologyFiveBatchSchema.safeParse(batch).success).toBe(true);
  expect(runTechnologyFiveBatch(batch)).toEqual([{index:0,ok:true,result},{index:1,ok:false,error:expect.any(String)},{index:2,ok:true,result}]);
 });
 it(`refuses substituted revision and numeric payload for ${row.catalogId}`,()=>{
  expect(technologyFiveRequestSchema.safeParse({...identity,version:2,input}).success).toBe(false);
  expect(technologyFiveBatchSchema.safeParse({...identity,version:2,rows:[input]}).success).toBe(false);
  expect(()=>issueTechnologyFiveGrant({...base,...identity,version:2},secret,100)).toThrow();
  const numeric={...input,[row.fields[0][0]]:Number(input[row.fields[0][0]])};
  expect(()=>runTechnologyFiveCalculation({...identity,input:numeric})).toThrow();
 });
}
