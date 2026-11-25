import test from 'node:test';import assert from 'node:assert/strict';import {plan} from './run.mjs';
const env={CALCUMINT_REQUIRE_SOCKET_FREE:'true',CALCUMINT_SERVICE_CONFIG:'/tmp/private-disposable.json',CALCUMINT_BATCH_SOURCE_SHA:'a'.repeat(40),GITHUB_RUN_ATTEMPT:'1'},identity={uid:65534,gid:65534,groups:[65534]};
test('selects only the fixed independent calendar batch',()=>{assert.deepEqual(plan('calendar',env,identity).ids,[443,444,445,446,451,452,455,456,457]);assert.throws(()=>plan('other',env,identity));});
test('refuses identities, Docker fallback, credentials, source ambiguity and reruns',()=>{
 for(const bad of [{...identity,uid:0},{...identity,gid:0},{...identity,groups:[65534,0]}])assert.throws(()=>plan('sports',env,bad));
 for(const bad of [{...env,CALCUMINT_REQUIRE_SOCKET_FREE:'false'},{...env,CALCUMINT_SERVICE_CONFIG:''},{...env,GITHUB_TOKEN:'SYNTHETIC_ONLY'},{...env,DATABASE_URL:'SYNTHETIC_ONLY'},{...env,CALCUMINT_BATCH_SOURCE_SHA:'wrong'},{...env,GITHUB_RUN_ATTEMPT:'2'}])assert.throws(()=>plan('sports',bad,identity));
});
