import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
it('executes fresh current-source, full-authority, reader, reversion and nomination negatives',()=>{
 const directory=mkdtempSync(join(tmpdir(),'calcumint-r6-cases-')),output=join(directory,'cases.tap'),env={...process.env};delete env.NODE_TEST_CONTEXT;
 try{
  execFileSync(process.execPath,['--test','--test-reporter=tap','--test-reporter-destination='+output,'tests/parallel-source-20261110/current.test.mjs','tests/parallel-source-20261110/git-reader.test.mjs','tests/parallel-source-20261110/retained-vitest.test.mjs'],{env,stdio:'inherit',timeout:150000});
  const tap=readFileSync(output,'utf8');expect(tap).toMatch(/# tests 50\b/);expect(tap).toMatch(/# pass 50\b/);expect(tap).toMatch(/# fail 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},160000);

it('executes the actual shortest-publication CI consumer with current immutable graph edges',()=>{
 const env={...process.env};delete env.NODE_TEST_CONTEXT;
 const output=execFileSync(process.execPath,['scripts/check-shortest-publication20.mjs'],{env,encoding:'utf8',timeout:60000,maxBuffer:4000000});
 expect(JSON.parse(output)).toMatchObject({identities:20,callerBindings:20,canonicalAccepted:0,publicationEligible:0,releaseHold:true});
 const directory=mkdtempSync(join(tmpdir(),'calcumint-shortest-current-')),report=join(directory,'cases.tap');
 try{
  execFileSync(process.execPath,['--test','--test-reporter=tap','--test-reporter-destination='+report,'tests/shortest-publication-20/caller-lineage.test.mjs','tests/shortest-publication-20/frequency-presentation-lineage.test.mjs','tests/shortest-publication-20/completion-lineage.test.mjs'],{env,stdio:'inherit',timeout:60000});
  const tap=readFileSync(report,'utf8');expect(tap).toMatch(/# tests 36\b/);expect(tap).toMatch(/# pass 36\b/);expect(tap).toMatch(/# fail 0\b/);expect(tap).toMatch(/# skipped 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},65000);
