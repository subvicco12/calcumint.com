import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {sanitizeEvidence} from '../five-native-auth-20261109/evidence-sanitizer.mjs';
const source=process.argv[2]??'/tmp/next-cohort-auth',dest='docs/next-cohort-auth-20261110';await mkdir(dest,{recursive:true});
for(const file of ['acceptance.log','native-receipt.json','source-version.json','receipt.json','build-source-sha256.json','production-transport.json','production-next.log'])await writeFile(dest+'/'+file,sanitizeEvidence(await readFile(source+'/'+file,'utf8')));
