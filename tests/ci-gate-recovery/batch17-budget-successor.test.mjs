import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
import {verifyCompletionBinding} from '../../scripts/product-completion-lineage.mjs';
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}),hash=x=>createHash('sha256').update(x).digest('hex');
const path='.github/workflows/ci.yml',bytes=readFileSync(path),claim=hash(git(['show','a955cdad7019a645b7ed2950299d0603ba1784a7:'+path]));
test('exact current workflow admission rejects job, native-step and aggregate budget weakening',()=>{
 assert.equal(verifyCompletionBinding(path,bytes,claim,git),true);const source=bytes.toString();
 for(const mutate of [s=>s.replace('    timeout-minutes: 25','    timeout-minutes: 26'),s=>s.replace('    timeout-minutes: 20','    timeout-minutes: 21'),s=>s.replace('      - name: Genuine Next frequency history and Business workflow\n        timeout-minutes: 6','      - name: Genuine Next frequency history and Business workflow\n        timeout-minutes: 7'),s=>s.replace('          test "$PUBLICATION_FACTORY_RESULT" = success','          true')]){
  const changed=mutate(source);assert.notEqual(changed,source);assert.throws(()=>verifyCompletionBinding(path,Buffer.from(changed),claim,git),/current successor/);
 }
});
test('historical captured Batch17 test claim admits only exact successor and retains original validation bytes',()=>{
 const capture=JSON.parse(readFileSync('docs/first-five-20261109/ci-recovery/workflow-test-successor.json','utf8')),name=capture.binding.path,current=readFileSync(name),historic=git(['show',capture.originalTestCapture.ref+':'+name]);
 assert.equal(hash(historic),capture.originalTestCapture.sha256);assert.equal(hash(readFileSync(capture.historicalValidationPath)),capture.historicalValidationSha256);
 assert.equal(verifyCompletionBinding(name,current,hash(historic),git),true);assert.throws(()=>verifyCompletionBinding(name,historic,hash(historic),git),/current successor/);assert.throws(()=>verifyCompletionBinding(name,current,'0'.repeat(64),git),/predecessor claim/);
});
