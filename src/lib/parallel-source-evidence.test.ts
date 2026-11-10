import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
it('executes fresh current-source, full-authority, reader, reversion and nomination negatives',()=>{
 const directory=mkdtempSync(join(tmpdir(),'calcumint-r6-cases-')),output=join(directory,'cases.tap'),env={...process.env};delete env.NODE_TEST_CONTEXT;
 try{
  execFileSync(process.execPath,['--test','--test-reporter=tap','--test-reporter-destination='+output,'tests/parallel-source-20261110/current.test.mjs','tests/parallel-source-20261110/git-reader.test.mjs','tests/parallel-source-20261110/retained-vitest.test.mjs'],{env,stdio:'inherit',timeout:150000});
  const tap=readFileSync(output,'utf8');expect(tap).toMatch(/# tests 48\b/);expect(tap).toMatch(/# pass 48\b/);expect(tap).toMatch(/# fail 0\b/);
 }finally{rmSync(directory,{recursive:true,force:true});}
},160000);
