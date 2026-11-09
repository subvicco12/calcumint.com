import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';
const source=process.argv[2]??'/tmp/five-native-auth-final-schema',dest='docs/five-native-auth-20261109/final-schema';await mkdir(dest,{recursive:true});
import {sanitizeEvidence} from './evidence-sanitizer.mjs';
for(const file of ['receipt.json','build-source-sha256.json','production-transport.json','production-next.log']){const raw=await readFile(path.join(source,file),'utf8');await writeFile(path.join(dest,file),sanitizeEvidence(raw));}
