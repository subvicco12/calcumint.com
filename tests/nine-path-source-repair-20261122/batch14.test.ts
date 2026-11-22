import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {prepareCanonicalContractEvidence} from '../../src/lib/canonical-evidence-preparation';
import {reconcileBatch14Membership} from './proof.mjs';

it('verifies the actual 415-file Batch14 input against the original 412-file artifact',()=>{
 const current=prepareCanonicalContractEvidence().implementationSourceSnapshot.files;
 const raw=readFileSync('docs/full-product-batch14/contract-evidence.json');
 const git=(args:string[])=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});
 const projected=reconcileBatch14Membership({git,read:readFileSync,root:process.cwd()},current,raw);
 expect(current).toHaveLength(415);
 expect(projected).toHaveLength(413);
 expect(projected.map(row=>row.path)).toEqual(
  [...JSON.parse(raw.toString()).implementationSourceSnapshot.files.map((row:{path:string})=>row.path),
   'src/calculators/final-framework/technology-scalar-presentation.ts'].sort());
});
