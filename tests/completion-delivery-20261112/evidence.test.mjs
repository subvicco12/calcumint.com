import assert from 'node:assert/strict';
import {registerCredentials,redactText,evidenceJSON} from './evidence.mjs';
const body=Buffer.from(JSON.stringify({grantId:'fixture-id',purpose:'embed'})).toString('base64url'),token=body+'.opaque_signature',opaque='opaque-execution-secret-123456';
registerCredentials(opaque);
const result=evidenceJSON({failureDOM:`<iframe src="http://127.0.0.1:1234/embed/native/${token}">`,error:`POST /api/native-embed/${token}/calculate`,secret:opaque,apiKey:'cm_test_disposable_12345',catalogId:440,sha256:'a'.repeat(64)});
assert(!result.includes(token));assert(!result.includes('opaque_signature'));assert(!result.includes(opaque));assert(!result.includes('cm_test_disposable_12345'));assert.equal(JSON.parse(result).catalogId,440);assert.equal(JSON.parse(result).sha256,'a'.repeat(64));assert(redactText('Cookie: sb-fixture-auth-token=opaque_cookie').includes('[REDACTED'));
console.log('PASS signed iframe/API URLs, credential fields and in-memory execution secrets redacted; identity/hashes retained');
