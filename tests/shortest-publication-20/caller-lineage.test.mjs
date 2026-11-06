import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,copyFileSync,readFileSync,writeFileSync,rmSync,symlinkSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import {verifyPublication20CallerLineage} from '../../scripts/publication20-caller-lineage.mjs';
const root=path.resolve('.'),manifest='docs/shortest-publication-20/caller-lineage.json',old='docs/calculator-first-20261105/execution-manifest.json';
function fixture(fn){const dir=mkdtempSync(path.join(os.tmpdir(),'publication20-lineage-'));try{const m=JSON.parse(readFileSync(manifest));for(const p of [manifest,old,...Object.keys(m.sourceHashes)]){const dest=path.join(dir,p);mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(path.join(root,p),dest);}symlinkSync(execFileSync('git',['rev-parse','--absolute-git-dir'],{encoding:'utf8'}).trim(),path.join(dir,'.git'),'dir');return fn(dir);}finally{rmSync(dir,{recursive:true,force:true});}}
function change(dir,fn){const p=path.join(dir,manifest),m=JSON.parse(readFileSync(p));fn(m);writeFileSync(p,JSON.stringify(m));}
test('binds exact original math/parser and append-only UI successor',()=>assert.equal(verifyPublication20CallerLineage(root).sourceBindings,20));
test('rejects changed source even when a new metadata hash claims it is authorized',()=>fixture(dir=>{const p='src/calculators/conversion/catalog-batch-1.ts';writeFileSync(path.join(dir,p),'changed historical math');change(dir,m=>{m.sourceHashes[p]=createHash('sha256').update('changed historical math').digest('hex');});assert.throws(()=>verifyPublication20CallerLineage(dir),/Frozen engine\/parser predecessor/);}));
test('rejects an altered original evidence manifest',()=>fixture(dir=>{writeFileSync(path.join(dir,old),'{}');assert.throws(()=>verifyPublication20CallerLineage(dir),/Original predecessor/);}));
test('rejects wrong predecessor identity',()=>fixture(dir=>{change(dir,m=>{m.predecessorRef='0'.repeat(40);});assert.throws(()=>verifyPublication20CallerLineage(dir),/predecessor\/authority/);}));
test('rejects release authority promotion',()=>fixture(dir=>{change(dir,m=>{m.releaseHold=false;});assert.throws(()=>verifyPublication20CallerLineage(dir),/authority/);}));
test('rejects source member omission and traversal substitution',()=>fixture(dir=>{change(dir,m=>{delete m.sourceHashes['src/lib/publication20/network.ts'];m.sourceHashes['../escape']='0'.repeat(64);});assert.throws(()=>verifyPublication20CallerLineage(dir),/membership/);}));
test('rejects unbound caller edits',()=>fixture(dir=>{writeFileSync(path.join(dir,'src/components/calculator-interactive.tsx'),'arbitrary');assert.throws(()=>verifyPublication20CallerLineage(dir),/source hash/);}));
test('rejects symlinked dependencies',()=>fixture(dir=>{const n='src/lib/publication20/network.ts';rmSync(path.join(dir,n));symlinkSync(path.join(root,n),path.join(dir,n));assert.throws(()=>verifyPublication20CallerLineage(dir),/symlink/);}));

for(const name of ['src/components/publication20-batch.tsx','src/lib/publication20/batch.ts'])test('rejects unbound shared batch dependency '+name,()=>fixture(dir=>{writeFileSync(path.join(dir,name),'arbitrary');assert.throws(()=>verifyPublication20CallerLineage(dir),/source hash/);}));
