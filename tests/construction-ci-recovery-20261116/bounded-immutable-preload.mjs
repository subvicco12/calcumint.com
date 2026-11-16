/** Explicit native-runtime transport; every object is still verified by the original reader. */
import assert from 'node:assert/strict';
import {completionGitReader} from '../parallel-source-20261110/git-reader.mjs';
const chunkLimit=8*1024*1024,totalLimit=128*1024*1024;
export function boundedImmutableBatchTransport(invoke){
 return (args,options)=>{
  if(args.length!==2||args[0]!=='cat-file'||args[1]!=='--batch'||options?.maxBuffer!==totalLimit||options.timeout!==30000||!Buffer.isBuffer(options.input))return invoke(args,options);
  const text=options.input.toString('ascii');assert(/^(?:[a-f0-9]{40}\n)+$/.test(text),'Full immutable batch identities required');
  const ids=text.slice(0,-1).split('\n'),deadline=Date.now()+options.timeout;
  const remaining=()=>{const ms=deadline-Date.now();assert(ms>0,'Immutable preload exceeded original deadline');return ms;};
  const sizes=invoke(['cat-file','--batch-check=%(objectname) %(objecttype) %(objectsize)'],{...options,maxBuffer:chunkLimit,timeout:remaining()});
  assert(Buffer.isBuffer(sizes),'Binary immutable batch sizes required');const rows=sizes.toString('ascii').split('\n');assert.equal(rows.pop(),'','Complete immutable size response required');assert.equal(rows.length,ids.length,'Immutable size cardinality differs');
  const records=rows.map((row,index)=>{const m=/^([a-f0-9]{40}) (blob|commit) (0|[1-9][0-9]*)$/.exec(row);assert(m&&m[1]===ids[index],'Immutable batch size identity/type differs');const size=Number(m[3]);assert(Number.isSafeInteger(size)&&size>=0,'Safe immutable object size required');const wire=Buffer.byteLength(row)+1+size+1;assert(Number.isSafeInteger(wire),'Safe immutable wire size required');return {id:m[1],type:m[2],size,wire};});
  // Predetermine fallback before executing any data chunk; never replay partial work.
  if(records.some(row=>row.wire>chunkLimit)||records.reduce((n,r)=>n+r.wire,0)>totalLimit)return invoke(args,{...options,timeout:remaining()});
  const groups=[];let group=[],wire=0;
  for(const row of records){if(wire+row.wire>chunkLimit){groups.push(group);group=[];wire=0;}group.push(row);wire+=row.wire;}if(group.length)groups.push(group);
  const outputs=[];
  for(const group of groups){
   const output=invoke(args,{...options,input:Buffer.from(group.map(r=>r.id).join('\n')+'\n'),maxBuffer:chunkLimit,timeout:remaining()});assert(Buffer.isBuffer(output),'Binary immutable chunk required');
   let offset=0;for(const row of group){const header=Buffer.from(row.id+' '+row.type+' '+row.size+'\n');assert(output.subarray(offset,offset+header.length).equals(header),'Immutable chunk framing differs');offset+=header.length+row.size;assert(offset<output.length&&output[offset]===10,'Immutable chunk delimiter differs');offset++;}assert.equal(offset,output.length,'Immutable chunk has trailing bytes');outputs.push(output);
  }
  remaining();return Buffer.concat(outputs);
 };
}
const readers=new WeakMap();
export function boundedCompletionGitReader(invoke){let reader=readers.get(invoke);if(!reader){reader=completionGitReader(boundedImmutableBatchTransport(invoke));readers.set(invoke,reader);}return reader;}
