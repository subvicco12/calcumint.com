import {expect,it} from 'vitest';
import {issueNativeGrant,readNativeGrant} from './grant';
const secret='isolated-grant-secret-000000000000000000000000';
it.each([218,219,220,423,430,431,432,438,440])('issues an exact version-one signed grant for selected calculator %s',catalogId=>{
 const input={grantId:'00000000-0000-4000-8000-000000000001',apiKeyId:'00000000-0000-4000-8000-000000000002',organizationId:'00000000-0000-4000-8000-000000000003',issuerId:'00000000-0000-4000-8000-000000000004',catalogId,version:1 as const,allowedOrigin:'https://customer.example'};
 const token=issueNativeGrant(input,secret,100);
 expect(readNativeGrant(token,secret,101)).toMatchObject(input);
});
