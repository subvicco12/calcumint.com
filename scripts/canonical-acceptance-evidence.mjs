import {createServer} from 'vite';
import {mkdtemp,rm} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {prepareCanonicalExpected} from './canonical-runtime-profile.mjs';
const output=process.argv[2];if(!output)throw Error('Explicit offline output directory required');
let expected={directory:output,close:async()=>{}};
if(process.argv.includes('--check')){const bindings=JSON.parse(await readFile(new URL('../docs/blueprint-reconciliation/canonical-runtime-bindings.json',import.meta.url),'utf8'));expected=await prepareCanonicalExpected(output,{node:process.version,platform:process.platform,arch:process.arch},bindings);}
const cacheDir=await mkdtemp(path.join(os.tmpdir(),'calcumint-canonical-'));
const server=await createServer({configFile:false,envFile:false,root:process.cwd(),cacheDir,resolve:{alias:{'@':path.join(process.cwd(),'src')}},server:{watch:null},ssr:{noExternal:[]}});
try{process.argv=[process.argv[0],'/scripts/reconcile-canonical-540.ts',expected.directory,...process.argv.slice(3)];await server.ssrLoadModule('/scripts/reconcile-canonical-540.ts');}finally{await server.close();await rm(cacheDir,{recursive:true,force:true});await expected.close();}
