/** Private default runtime transport: immutable query views bind object identity and repository root. */
import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {isImmutableTreeQuery} from '../milestone100-20261114/source-immutable-queries.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
export function runtimeNativeGit(args,options={}){
 const immutable=isImmutableTreeQuery(args);
 const query=immutable&&args[0]==='diff'?[...args.slice(0,2),'--no-relative','--no-ext-diff','--no-textconv',...args.slice(2)]:args;
 const env={...process.env,...options.env,GIT_NO_REPLACE_OBJECTS:'1'};
 if(immutable){for(const name of ['GIT_GLOB_PATHSPECS','GIT_NOGLOB_PATHSPECS','GIT_ICASE_PATHSPECS'])delete env[name];env.GIT_LITERAL_PATHSPECS='1';}
 const config=immutable?['-c','diff.renames=false','-c','diff.orderFile=/dev/null','-c','diff.ignoreSubmodules=none','-c','core.quotePath=true']:[];
 return execFileSync('git',[...config,...query],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024,...options,cwd:root,env});
}
