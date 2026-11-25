// Read-only source inventory; no acceptance, authority, lifecycle or production calls.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {execFileSync} from 'node:child_process';import {createRequire} from 'node:module';
const root=path.resolve(process.argv[2]||'.'),out=path.resolve(process.argv[3]||'/tmp/calcumint-product-inventory.json');
const require=createRequire(path.join(root,'package.json')),esbuild=require('esbuild');
const dirs=fs.readdirSync(path.join(root,'src/lib')).filter(n=>/^(worker|sole-)/.test(n));
const modules=dirs.map(n=>'src/lib/'+n+'/cohort.ts').filter(n=>fs.existsSync(path.join(root,n)));
modules.push('src/lib/calculator-factory/registry.ts');
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'calcumint-product-inventory-'));
const entry=modules.map((m,i)=>`import * as m${i} from ${JSON.stringify(path.join(root,m))};`).join('\n')+'\nconst groups=['+modules.map((m,i)=>`{path:${JSON.stringify(m)},module:m${i}}`).join(',')+'];\nconsole.log(JSON.stringify(groups.flatMap(g=>Object.entries(g.module).filter(([k,v])=>Array.isArray(v)&&v.length&&v.every(x=>Number.isInteger(x?.catalogId)&&typeof x?.engineId==="string")).map(([key,rows])=>({path:g.path,key,rows:rows.map(c=>({id:c.catalogId,engineId:c.engineId,version:c.version,slug:c.slug,scope:c.scope,sourceEvidence:c.sourceEvidence}))}))),null,2));';
fs.writeFileSync(path.join(tmp,'entry.ts'),entry);esbuild.buildSync({entryPoints:[path.join(tmp,'entry.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(tmp,'inventory.cjs'),alias:{'@':path.join(root,'src')},packages:'external'});
const groups=JSON.parse(execFileSync(process.execPath,[path.join(tmp,'inventory.cjs')],{env:{...process.env,NODE_PATH:path.join(root,'node_modules')},encoding:'utf8',maxBuffer:8000000}));
const source=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
fs.writeFileSync(out,JSON.stringify({source,groups,distinctIds:[...new Set(groups.flatMap(g=>g.rows.map(r=>r.id)))].sort((a,b)=>a-b),qualificationInferred:false,releaseHold:true},null,2)+'\n');
console.log('Source inventory written; no qualification inferred: '+out);
