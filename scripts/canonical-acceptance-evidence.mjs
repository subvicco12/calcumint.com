import {createServer} from 'vite';import {mkdtemp,rm,readFile} from 'node:fs/promises';import os from 'node:os';import path from 'node:path';
import {prepareCanonicalExpected} from './canonical-runtime-profile.mjs';import {frozenCanonicalSource} from './frozen-canonical-source.mjs';
const repository=process.cwd(),output=process.argv[2];if(!output)throw Error('Explicit offline output directory required');const destination=path.resolve(output),flags=process.argv.slice(3);
let expected={directory:destination,close:async()=>{}},source={root:repository,close:async()=>{}},server;
const cacheDir=await mkdtemp(path.join(os.tmpdir(),'calcumint-canonical-'));
try{
 if(flags.includes('--check')){const bindings=JSON.parse(await readFile(new URL('../docs/blueprint-reconciliation/canonical-runtime-bindings.json',import.meta.url),'utf8'));expected=await prepareCanonicalExpected(destination,{node:process.version,platform:process.platform,arch:process.arch},bindings);source=await frozenCanonicalSource(repository,bindings.baselineSHA);}
 process.chdir(source.root);server=await createServer({configFile:false,envFile:false,root:source.root,cacheDir,resolve:{alias:{'@':path.join(source.root,'src')}},server:{watch:null},ssr:{noExternal:[]}});
 process.argv=[process.argv[0],'/scripts/reconcile-canonical-540.ts',expected.directory,...flags];await server.ssrLoadModule('/scripts/reconcile-canonical-540.ts');
}finally{process.chdir(repository);await server?.close();await rm(cacheDir,{recursive:true,force:true});await expected.close();await source.close();}
