// Runs after the unchanged npm-ci operation and before the unchanged driver.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';import {execFileSync} from 'node:child_process';
const out=path.join(process.env.WORKER2_MOBILITY_BROWSER_ARTIFACTS,'executable-dependency-preflight.json');
const checks=[];let stage='identity';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
function command(name,args){
 stage=name;
 const resolved=execFileSync('/bin/sh',['-c','command -v '+name],{encoding:'utf8',timeout:10000}).trim();
 const real=fs.realpathSync(resolved),parents=[];let p=real;
 for(;;){fs.accessSync(p,fs.constants.X_OK);parents.push({path:p,mode:(fs.statSync(p).mode&0o7777).toString(8)});const parent=path.dirname(p);if(parent===p)break;p=parent;}
 execFileSync(real,args,{timeout:10000,stdio:'ignore'});
 checks.push({command:name,resolved,real,sha256:sha(real),parents});return real;
}
try {
 assert.equal(process.getuid(),65534);assert.equal(process.getgid(),65534);assert.deepEqual(process.getgroups(),[65534]);
 for(const key of ['GITHUB_TOKEN','GH_TOKEN','BOOTSTRAP_DRIVE_TOKEN','ACTIONS_RUNTIME_TOKEN','ACTIONS_ID_TOKEN_REQUEST_TOKEN'])assert(!process.env[key]);
 for(const mode of [fs.constants.R_OK,fs.constants.W_OK]){let exposed=false;try{fs.accessSync('/var/run/docker.sock',mode);exposed=true;}catch{}assert(!exposed);}
 command('env',['--version']);command('git',['--version']);command('bash',['--version']);command('id',['-u']);command('node',['--version']);
 assert.equal(sha(process.execPath),'94efd062ed066c1a0b332e18249859c905e920eeada5df55d24c99b919629a90');
 command('npm',['--version']);command('python3',['-I','-c','import json,pathlib,re,subprocess,sys']);
 command('psql',['--version']);command('rg',['--version']);command('pdftotext',['-v']);
 stage='installed-native-modules';
 const require=createRequire(path.join(process.env.APP_SOURCE,'package.json'));
 assert.equal(sha(path.join(process.env.APP_SOURCE,'package-lock.json')),'b564e5ff97f9dad6c934e6a2eb0977871b2ee3f0b36a23325f1715b241114273');
 for(const name of ['@supabase/supabase-js','next','react','react-dom','decimal.js','zod','typescript','postcss','tailwindcss','@tailwindcss/postcss'])require.resolve(name);
 assert.equal(require('next/package.json').version,'16.3.5');
 const esbuild=require('esbuild');await esbuild.transform('const dependencyProbe = 1',{loader:'js'});esbuild.stop();
 require('@next/swc-linux-x64-gnu');require('@tailwindcss/oxide');
 require('lightningcss').transform({filename:'dependency-probe.css',code:Buffer.from('a {color:red}')});
 await require('sharp')({create:{width:1,height:1,channels:3,background:'#fff'}}).png().toBuffer();
 // Browser wrapper, ELF dependencies, fonts and rendering are probed without the app/CSP.
 stage='chrome-runtime';const chrome=process.env.CHROMIUM_PATH;assert(path.isAbsolute(chrome));fs.accessSync(chrome,fs.constants.X_OK);
 const elf=fs.realpathSync(chrome);assert.equal(fs.readFileSync(elf).subarray(0,4).toString('hex'),'7f454c46');fs.accessSync(elf,fs.constants.X_OK);
 const crashpad=path.join(path.dirname(elf),'chrome_crashpad_handler');fs.accessSync(crashpad,fs.constants.X_OK);execFileSync(crashpad,['--help'],{stdio:'ignore',timeout:10000});
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'mass426-dependency-browser-'));
 const dom=execFileSync(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--no-first-run','--user-data-dir='+profile,'--dump-dom','about:blank'],{env:{...process.env,DBUS_SESSION_BUS_ADDRESS:'unix:path=/dev/null'},encoding:'utf8',timeout:20000,maxBuffer:2000000});assert(dom.includes('<html'));
 checks.push({command:'chrome',path:chrome,wrapperSha256:sha(chrome),elfSha256:sha(elf),sharedLibrariesResolved:true,headlessRender:true});
 fs.writeFileSync(out,JSON.stringify({passed:true,uid:65534,gid:65534,checks,lockfileSha256:sha(path.join(process.env.APP_SOURCE,'package-lock.json')),nativeModules:['esbuild-service','next-swc-gnu','tailwind-oxide','lightningcss','sharp-libvips'],providerCredentialsPresent:false,dockerSocketAccessible:false,browserJourneys:0})+'\n');
} catch {
 fs.writeFileSync(out,JSON.stringify({passed:false,category:'executable-dependency-refused',stage})+'\n');process.exitCode=1;
}
