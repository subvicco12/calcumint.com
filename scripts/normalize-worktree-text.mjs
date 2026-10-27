/** Explicit local repair for checkouts made before .gitattributes existed.
 * Only CRLF sequences in tracked text files are changed; no file is removed. */
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
let changed=0;
for(const file of execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean)){
 const bytes=readFileSync(file);
 if(file.endsWith('.csv')){
  const historical=execFileSync('git',['show',`HEAD:${file}`]);
  if(historical.includes(Buffer.from('\r\n'))){
   if(bytes.equals(Buffer.from(historical.toString('utf8').replaceAll('\r\n','\n'))))writeFileSync(file,historical);
   continue;
  }
 }
 if(bytes.includes(0)||!bytes.includes(Buffer.from('\r\n')))continue;
 const value=bytes.toString('utf8');if(!Buffer.from(value).equals(bytes))continue;
 writeFileSync(file,value.replaceAll('\r\n','\n'));changed++;
}
console.log(`Normalized CRLF in ${changed} tracked text files; logical contents preserved.`);
