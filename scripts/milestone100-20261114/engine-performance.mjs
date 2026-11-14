/** Actual private-engine measurements, not a production/browser performance SLA. */
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import {createJiti} from 'jiti';
const root=process.cwd(),path='docs/milestone100-20261114/business-account-cases.json',bytes=readFileSync(path),sha=b=>createHash('sha256').update(b).digest('hex');
assert.equal(sha(bytes),'a712d00ca926fd2869b58b5860b7ba3d80adf3a27bbb3c75388256385cc548c4');
const source='b1dccffe1cc9e0515030d5e7ea4bad8a72756080';assert.equal(execFileSync('git',['diff','--name-only',source,'HEAD','--','src']).length,0);assert.equal(execFileSync('git',['status','--porcelain','--untracked-files=all','--','src']).length,0);
const jiti=createJiti(import.meta.url,{alias:{'@':resolve(root,'src')}}),{getFactoryWorkflows}=await jiti.import(resolve(root,'src/lib/calculator-factory/registry.ts'));
const rows=[];for(const row of JSON.parse(bytes)){const w=getFactoryWorkflows(row.id),expected=w.execute(row.input),samples=[];for(let i=0;i<200;i++){const start=performance.now(),actual=w.execute(row.input);samples.push(performance.now()-start);assert.deepEqual(actual,expected);}samples.sort((a,b)=>a-b);rows.push({catalogId:row.id,slug:row.slug,version:row.version,runs:200,minMs:samples[0],medianMs:samples[100],p95Ms:samples[190],maxMs:samples.at(-1),unchangedPacket:true});}
const out=resolve('/workspace/artifacts/milestone100-20261114/engine-performance.json');mkdirSync(dirname(out),{recursive:true});writeFileSync(out,JSON.stringify({kind:'ACTUAL_ENGINE_EXECUTION_MEASUREMENTS_NOT_PRODUCTION_SLA',head:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),applicationSource:source,producerSHA256:sha(readFileSync(new URL(import.meta.url))),casesSHA256:sha(bytes),node:process.version,rows,releaseHold:true,productionWrites:false},null,2)+'\n');console.log(JSON.stringify({identities:rows.length,runs:rows.reduce((s,r)=>s+r.runs,0),maxMs:Math.max(...rows.map(r=>r.maxMs)),maxP95Ms:Math.max(...rows.map(r=>r.p95Ms)),artifact:out}));
