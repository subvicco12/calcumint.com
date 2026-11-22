import {execFileSync} from 'node:child_process';
import {closeSync, mkdtempSync, openSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

/** Feed the bounded historical blob request through a regular file with explicit EOF. */
export function execA7BatchInput(args, options, temporaryRoot=tmpdir()){
 const {input, ...spawnOptions}=options;
 const isBatch=args.length===2&&args[0]==='cat-file'&&args[1]==='--batch';
 if(!isBatch||!Buffer.isBuffer(input))return execFileSync('git',args,options);
 const temporary=mkdtempSync(join(temporaryRoot,'calcumint-a7-batch-'));
 try{
  const request=join(temporary,'request');
  writeFileSync(request,input,{flag:'wx',mode:0o600});
  const fd=openSync(request,'r');
  try{return execFileSync('git',args,{...spawnOptions,stdio:[fd,'pipe','pipe']});}
  finally{closeSync(fd);}
 }finally{rmSync(temporary,{recursive:true,force:true});}
}
