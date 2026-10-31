import {readFile,writeFile} from 'node:fs/promises';
import {compare,reconcile,validate} from './descriptor.mjs';
try{
 const [command,...args]=process.argv.slice(2);
 if(command==='sql'&&args.length===0)process.stdout.write(await readFile(new URL('./export.sql',import.meta.url),'utf8'));
 else if(['compare','reconcile'].includes(command)&&args.length===2){const descriptors=await Promise.all(args.map(async p=>JSON.parse(await readFile(p,'utf8'))));const result=(command==='compare'?compare:reconcile)(...descriptors);console.log(JSON.stringify(result,null,2));if(!result.equal)process.exitCode=2;}
 else if(command==='attach-ledgers'&&args.length===3){const [raw,ledger,out]=args;const d=JSON.parse(await readFile(raw,'utf8')),l=JSON.parse(await readFile(ledger,'utf8'));if(JSON.stringify(Object.keys(l).sort())!==JSON.stringify(['effectLedger','migrationLedger']))throw Error('Expected exactly migrationLedger and effectLedger observed sections');for(const s of Object.keys(l)){if(d.sections[s]?.status!=='UNKNOWN')throw Error('Refusing to replace an existing ledger');d.sections[s]=l[s];}validate(d);await writeFile(out,JSON.stringify(d,null,2)+'\n',{flag:'wx'});}
 else throw Error('Usage: cli.mjs sql | compare|reconcile <model.json> <capture.json> | attach-ledgers <catalog.json> <observed-ledgers.json> <new-output.json>');
}catch(e){console.error(e.message);process.exitCode=1;}
