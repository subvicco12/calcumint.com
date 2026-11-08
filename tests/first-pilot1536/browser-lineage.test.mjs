import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync,symlinkSync,unlinkSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyBatch21BrowserLineage,batch21BrowserPath} from '../../scripts/batch21-browser-lineage.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const claim='42ead9e3ca6ccb3491230cde760a462f1bc9292e364a5fab97b363dbdccb836d';
const names=['browser.mjs','failure-diagnostics.mjs','journey-readiness.mjs','journey-lifecycle.mjs'].map(n=>'tests/batch21-calculator-wave/'+n);
const git=args=>execFileSync('git',args,{cwd:root,stdio:['pipe','pipe','pipe']});
function fixture(run){
 const dir=mkdtempSync(path.join(os.tmpdir(),'batch21-lineage-test-'));
 try{for(const name of names){mkdirSync(path.dirname(path.join(dir,name)),{recursive:true});writeFileSync(path.join(dir,name),readFileSync(path.join(root,name)));}run(dir);}finally{rmSync(dir,{recursive:true,force:true});}
}
test('exact reviewed successor admits only independently pinned historical browser',()=>{
 const result=verifyBatch21BrowserLineage(root,claim,git);
 assert.equal(result.browserBindingsVerified,4);
 assert(result.predecessorBrowserBytes.equals(git(['show','6d2960c2fac7817741b08877ebd3b611720923b7:'+batch21BrowserPath])));
});
for(const name of names)test('reject current tamper: '+name,()=>fixture(dir=>{
 writeFileSync(path.join(dir,name),Buffer.concat([readFileSync(path.join(dir,name)),Buffer.from('\n// tampered')]));
 assert.throws(()=>verifyBatch21BrowserLineage(dir,claim,git),/current successor differs/);
}));
test('reject predecessor bytes presented as current browser',()=>fixture(dir=>{
 writeFileSync(path.join(dir,batch21BrowserPath),git(['show','6d2960c2fac7817741b08877ebd3b611720923b7:'+batch21BrowserPath]));
 assert.throws(()=>verifyBatch21BrowserLineage(dir,claim,git),/current successor differs/);
}));
test('reject successor Git object substitution',()=>assert.throws(()=>verifyBatch21BrowserLineage(root,claim,args=>args[0]==='cat-file'&&args[2]==='45b920157091642f5d36afe0c94ff1aa002f9591'?Buffer.from('substituted'):git(args)),/Git object SHA differs/));
test('reject historical claim substitution',()=>assert.throws(()=>verifyBatch21BrowserLineage(root,'0'.repeat(64),git),/historical claim differs/));
for(const ref of ['6d2960c2fac7817741b08877ebd3b611720923b7','c1c7371ac4f284ff7b6371a90fb3296c632396f9','815fa75177ff4348b64502d6745a8fc294c65fed'])test('reject unavailable exact commit '+ref,()=>{
 assert.throws(()=>verifyBatch21BrowserLineage(root,claim,args=>{if(args[0]==='rev-parse'&&args[2]===ref+'^{commit}')throw Error('missing');return git(args);}),/commit unavailable/);
});
test('reject Git object byte substitution',()=>assert.throws(()=>verifyBatch21BrowserLineage(root,claim,args=>args[0]==='cat-file'?Buffer.from('substituted'):git(args)),/Git object SHA differs/));
test('reject predecessor tree substitution',()=>assert.throws(()=>verifyBatch21BrowserLineage(root,claim,args=>args[0]==='ls-tree'?Buffer.from('100644 blob '+'0'.repeat(40)+'\t'+batch21BrowserPath+'\0'):git(args)),/membership\/type\/blob differs/));
test('reject successor tree substitution and symlink mode',()=>{
 for(const mode of ['100644','120000'])assert.throws(()=>verifyBatch21BrowserLineage(root,claim,args=>args[0]==='ls-tree'&&args[2]==='815fa75177ff4348b64502d6745a8fc294c65fed'?Buffer.from(mode+' blob '+'0'.repeat(40)+'\t'+batch21BrowserPath+'\0'):git(args)),/membership\/type\/blob differs/);
});
for(const name of names)test('reject current symlink: '+name,()=>fixture(dir=>{
 unlinkSync(path.join(dir,name));symlinkSync(path.join(root,name),path.join(dir,name));
 assert.throws(()=>verifyBatch21BrowserLineage(dir,claim,git),/symlink/);
}));
test('reject symlink directory and root',()=>fixture(dir=>{
 const linked=dir+'-link';symlinkSync(dir,linked,'dir');
 try{assert.throws(()=>verifyBatch21BrowserLineage(linked,claim,git),/root/);}finally{unlinkSync(linked);}
 rmSync(path.join(dir,'tests'),{recursive:true});symlinkSync(path.join(root,'tests'),path.join(dir,'tests'),'dir');
 assert.throws(()=>verifyBatch21BrowserLineage(dir,claim,git),/symlink/);
}));
test('historical wrapper runs original guards and negative tests unchanged',()=>{
 const result=JSON.parse(execFileSync(process.execPath,['scripts/check-calculator-closure-history.mjs'],{cwd:root,maxBuffer:128*1024*1024,stdio:['pipe','pipe','pipe']}));
 assert.equal(result.browserBindingsVerified,4);
 assert.equal(result.frozen.sourceFilesChecked,21);
 assert.match(result.originalHistoricalNegativeTests,/# fail 0/);
 assert.match(result.originalHistoricalNegativeTests,/# tests 8/);
});
