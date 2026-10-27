/** Run every unit file in bounded serial partitions, retaining native exit codes.
 * Avoids retaining 753 isolated module graphs in one long Windows process. */
import {readdirSync,mkdirSync,openSync,closeSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):/\.test\.tsx?$/.test(e.name)?[path.join(dir,e.name).replaceAll('\\','/')]:[]);}
const all=files('src').sort(),size=100,directory='docs/windows-sprint/evidence/unit-partitions';mkdirSync(directory,{recursive:true});
const selection=process.argv.find(a=>a.startsWith('--partition='));
if(selection&&(!/^--partition=[1-9]\d*$/.test(selection)||Number(selection.slice(12))>Math.ceil(all.length/size)))throw new RangeError('Partition must identify an existing unit-test partition');
const outcomes=[];
for(let offset=0;offset<all.length;offset+=size){
 const part=offset/size+1;if(selection&&part!==Number(selection.slice(12)))continue;
 const selected=all.slice(offset,offset+size),log=path.join(directory,`part-${part}.log`),json=path.join(directory,`part-${part}.json`);
 const fd=openSync(log,'w');console.log(`START partition ${part}: ${selected.length} files`);
 const result=spawnSync(process.execPath,['node_modules/vitest/vitest.mjs','run',...selected,'--maxWorkers=2','--testTimeout=30000','--hookTimeout=60000','--reporter=json',`--outputFile=${json}`],{stdio:['ignore',fd,fd],env:process.env,windowsHide:true,timeout:600000});closeSync(fd);
 const outcome={partition:part,files:selected,status:result.status,error:result.error?.message??null,signal:result.signal};outcomes.push(outcome);
 writeFileSync(path.join(directory,`part-${part}-exit.json`),JSON.stringify(outcome,null,2)+'\n');console.log(`END partition ${part}: exit ${result.status}, ${result.error?.message??'completed'}`);
 if(result.status!==0)process.exitCode=1;
}
writeFileSync(path.join(directory,selection?`selection-${selection.slice(12)}.json`:'all-exits.json'),JSON.stringify({totalFiles:all.length,outcomes},null,2)+'\n');
