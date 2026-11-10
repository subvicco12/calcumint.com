/** Executes the unchanged R5 proof in a real, private, literal-A7 checkout. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve,relative,isAbsolute} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const baseline='a7bab5b5534d51cea25ba5ffe4aa9b3630176909';
const git=args=>execFileSync('git',args,{cwd:process.cwd(),stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024});
assert.equal(git(['rev-parse','HEAD']).toString().trim(),baseline,'Real retained A7 checkout required');
const target='tests/next-five-20261110/source/current-proof.mjs';
assert(readFileSync(target).equals(git(['show',baseline+':'+target])),'Original R5 implementation differs');
const seen=new Map();
const read=name=>{const file=name instanceof URL?fileURLToPath(name):name;const p=relative(process.cwd(),resolve(file));assert(p&&!p.startsWith('..')&&!isAbsolute(p));const b=readFileSync(file);seen.set(p,{path:p,sha256:createHash('sha256').update(b).digest('hex'),bytes:b.length});return b;};
const {verifyCurrentNextFiveSource}=await import(pathToFileURL(resolve(target)).href);
assert.equal(verifyCurrentNextFiveSource(read,git),true);
assert(process.argv[2]&&isAbsolute(process.argv[2]),'Private output file required');
writeFileSync(process.argv[2],JSON.stringify({baseline,passed:true,rows:[...seen.values()].sort((a,b)=>a.path.localeCompare(b.path))}));
