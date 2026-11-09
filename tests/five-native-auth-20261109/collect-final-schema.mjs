import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';
const source=process.argv[2]??'/tmp/five-native-auth-final-schema',dest='docs/five-native-auth-20261109/final-schema';await mkdir(dest,{recursive:true});
const sanitize=s=>s.replace(/cm_test_[a-f0-9]+/g,'[REDACTED_LOCAL_API_KEY]').replace(/base64-[A-Za-z0-9_-]+/g,'[REDACTED_AUTH_COOKIE]').replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_.-]+/g,'[REDACTED_LOCAL_TOKEN]');
for(const file of ['receipt.json','build-source-sha256.json','production-transport.json','production-next.log']){const raw=await readFile(path.join(source,file),'utf8');await writeFile(path.join(dest,file),sanitize(raw));}
