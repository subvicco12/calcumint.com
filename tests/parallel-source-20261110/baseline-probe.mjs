/** Executes the unchanged R5 proof in a real, private, literal-A7 checkout. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,relative,isAbsolute} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {makeGitReader} from './git-reader.mjs';
const baseline='a7bab5b5534d51cea25ba5ffe4aa9b3630176909';
const git=makeGitReader((args,options={})=>execFileSync('git',args,{cwd:process.cwd(),stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024,...options}));
assert.equal(git(['rev-parse','HEAD']).toString().trim(),baseline,'Real retained A7 checkout required');
const target='tests/next-five-20261110/source/current-proof.mjs';
assert(readFileSync(target).equals(git(['show',baseline+':'+target])),'Original R5 implementation differs');
// Warm only blobs the unchanged complete proof actually declares. Requests and
// every returned value remain actual Git operations; symbolic HEAD stays fresh.
const metadata=readFileSync('scripts/product-completion-lineage.mjs','utf8'),literal=/const bindings=(\[[\s\S]*?\n\]);/.exec(metadata);assert(literal);
const ids=new Set();function declared(value){if(!value||typeof value!=='object')return;for(const[key,item]of Object.entries(value)){if(/(?:^blob$|Blob$)/.test(key)&&typeof item==='string'&&/^[0-9a-f]{40}$/.test(item))ids.add(item);else if(item&&typeof item==='object')declared(item);}}
declared(JSON.parse(literal[1]));
for(const name of [target,'tests/next-five-20261110/source/accepted-authority.mjs','tests/next-five-20261110/source/fixed-anchor.mjs','tests/next-cohort-20261110/source/runtime-current-anchor.mjs'])for(const match of readFileSync(name,'utf8').matchAll(/"blob"\s*:\s*"([0-9a-f]{40})"/g))ids.add(match[1]);
git.preloadBlobs([...ids]);
const seen=new Map();
const read=name=>{const file=name instanceof URL?fileURLToPath(name):name;const p=relative(process.cwd(),resolve(file));assert(p&&!p.startsWith('..')&&!isAbsolute(p));const b=readFileSync(file);seen.set(p,{path:p,sha256:createHash('sha256').update(b).digest('hex'),bytes:b.length});return b;};
const {verifyCurrentNextFiveSource}=await import(pathToFileURL(resolve(target)).href);
assert.equal(verifyCurrentNextFiveSource(read,git),true);
assert(process.argv[2]&&isAbsolute(process.argv[2]),'Private output file required');
writeFileSync(process.argv[2],JSON.stringify({baseline,passed:true,rows:[...seen.values()].sort((a,b)=>a.path.localeCompare(b.path))}));
