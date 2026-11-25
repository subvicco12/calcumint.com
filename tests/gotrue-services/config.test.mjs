import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
const target=new URL('./fixture.mjs',import.meta.url);
test('socket-free fixture exists without Docker fallback',async()=>{
 assert(existsSync(target),'socket-free fixture implementation missing');
 const {validateConfig}=await import(target);
 const config={kind:'CALCUMINT_DISPOSABLE_SERVICES_V1',repository:'subvicco12/calcumint.com',runId:'123',attempt:1,workflowSha:'e'.repeat(40),postgres:{host:'127.0.0.1',port:5432,database:'postgres'},authUrl:'http://127.0.0.1:9999',restUrl:'http://127.0.0.1:3000',jwtSecret:'calcumint-disposable-only-not-production-'+ 'a'.repeat(32),serviceIds:{postgres:'a'.repeat(64),gotrue:'b'.repeat(64),postgrest:'c'.repeat(64)}};
 assert.equal(validateConfig(config,{runId:'123',workflowSha:'e'.repeat(40)}).postgres.port,5432);
 for(const bad of [{...config,kind:'production'},{...config,attempt:2},{...config,postgres:{...config.postgres,host:'db.supabase.co'}},{...config,authUrl:'https://calcumint.com/auth/v1'},{...config,jwtSecret:'secret'},{...config,unexpected:true}])assert.throws(()=>validateConfig(bad,{runId:'123',workflowSha:'e'.repeat(40)}));
 assert.throws(()=>validateConfig(config,{runId:'other',workflowSha:'e'.repeat(40)}));
});
test('required socket-free mode refuses missing endpoints before container handling',async()=>{
 const previous=process.env.CALCUMINT_REQUIRE_SOCKET_FREE;const file=process.env.CALCUMINT_SERVICE_CONFIG;
 process.env.CALCUMINT_REQUIRE_SOCKET_FREE='true';delete process.env.CALCUMINT_SERVICE_CONFIG;
 try{const {startGoTrueFixture}=await import('../gotrue-runtime/fixture.mjs');await assert.rejects(startGoTrueFixture(),/Docker fallback refused/);}
 finally{if(previous===undefined)delete process.env.CALCUMINT_REQUIRE_SOCKET_FREE;else process.env.CALCUMINT_REQUIRE_SOCKET_FREE=previous;if(file!==undefined)process.env.CALCUMINT_SERVICE_CONFIG=file;}
});
