import {appendFileSync,readFileSync} from 'node:fs';
export const directory='/tmp/worker3-full115-critical';
export function emit(value){appendFileSync(directory+'/events.jsonl',JSON.stringify({utc:new Date().toISOString(),unixMS:Date.now(),monotonicNS:process.hrtime.bigint().toString(),pid:process.pid,...value})+'\n');}
export function processGroup(){try{return Number(readFileSync('/proc/self/stat','utf8').split(') ')[1].split(' ')[2]);}catch{return null;}}
export function fileStart(file){emit({event:'file-start',file,ppid:process.ppid,pgid:processGroup()});process.on('exit',code=>emit({event:'file-exit',file,code,ppid:process.ppid,pgid:processGroup()}));}
