import {createHash} from 'node:crypto';

const objectId=/^[0-9a-f]{40}$/;
const bytes=value=>{if(!Buffer.isBuffer(value))throw Error('Git transport must return binary Buffer output');return value;};
function verifyBlob(id,content){
 const actual=createHash('sha1').update(Buffer.from(`blob ${content.length}\0`)).update(content).digest('hex');
 if(actual!==id)throw Error('Git blob content address differs: '+id);
}
/** Cache only objects addressed by full immutable Git identities. Symbolic requests stay live. */
export function makeGitReader(invoke){
 const trees=new Map(),blobs=new Map(),commits=new Map(),commitObjects=new Map(),immutablePaths=new Map();
 function tree(ref){
  if(trees.has(ref))return trees.get(ref);
  const raw=bytes(invoke(['ls-tree','-rz','--full-tree',ref]));const entries=new Map();let offset=0;
  while(offset<raw.length){
   const end=raw.indexOf(0,offset);if(end<0)throw Error('Truncated Git tree record');
   const record=raw.subarray(offset,end),tab=record.indexOf(9);if(tab<0)throw Error('Invalid Git tree record');
   const header=record.subarray(0,tab).toString('ascii'),match=/^([0-7]{6}) (blob|tree|commit) ([0-9a-f]{40})$/.exec(header);
   if(!match)throw Error('Invalid Git tree object identity');
   const path=record.subarray(tab+1).toString('utf8');if(entries.has(path))throw Error('Duplicate Git tree path');
   entries.set(path,{type:match[2],id:match[3]});offset=end+1;
  }
  trees.set(ref,entries);return entries;
 }
 function blob(id){
  if(!blobs.has(id)){const value=bytes(invoke(['cat-file','blob',id]));verifyBlob(id,value);blobs.set(id,Buffer.from(value));}
  return Buffer.from(blobs.get(id));
 }
 function reader(args,options){
  if(options!==undefined)return invoke(args,options);
  if(args.length===3&&args[0]==='cat-file'&&args[1]==='blob'&&objectId.test(args[2]))return blob(args[2]);
  if(args.length===3&&args[0]==='cat-file'&&args[1]==='commit'&&objectId.test(args[2])&&commitObjects.has(args[2]))return Buffer.from(commitObjects.get(args[2]));
  if(args.length===3&&args[0]==='rev-parse'&&args[1]==='--verify'&&/^[0-9a-f]{40}\^\{commit\}$/.test(args[2])){
   const id=args[2].slice(0,40);
   if(!commits.has(id)){
    const result=bytes(invoke(args));if(result.toString()!==id+'\n')throw Error('Git commit identity differs');commits.set(id,Buffer.from(result));
   }
   return Buffer.from(commits.get(id));
  }
  if(args.length===2&&(args[0]==='rev-parse'||args[0]==='show')){
   const match=/^([0-9a-f]{40}):(.*)$/s.exec(args[1]);
   if(match){const pinned=immutablePaths.get(args[1]);if(pinned)return args[0]==='rev-parse'?Buffer.from(pinned+'\n'):blob(pinned);const entry=tree(match[1]).get(match[2]);if(entry?.type==='blob')return args[0]==='rev-parse'?Buffer.from(entry.id+'\n'):blob(entry.id);}
  }
  return invoke(args);
 }
 /** Exact immutable path mappings only. Symbolic/current requests never enter this cache. */
 reader.preloadPaths=records=>{
  if(!Array.isArray(records)||records.length>4096)throw Error('Finite independently pinned immutable path records required');
  const nominated=new Map();let commandBytes=0;
  for(const record of records){
   const{ref,path,blob:expected}=record??{};
   if(typeof ref!=='string'||!objectId.test(ref)||typeof expected!=='string'||!objectId.test(expected)||typeof path!=='string'||!path||path.length>1024||path.startsWith('/')||/[\0\r\n]/.test(path)||path.split('/').some(part=>!part||part==='.'||part==='..'))throw Error('Full immutable commit/path/blob identity required');
   const spec=ref+':'+path;commandBytes+=Buffer.byteLength(spec)+1;if(commandBytes>512*1024)throw Error('Immutable path batch exceeds finite argument budget');
   if(nominated.has(spec)&&nominated.get(spec)!==expected)throw Error('Conflicting immutable path nomination');
   if(immutablePaths.has(spec)&&immutablePaths.get(spec)!==expected)throw Error('Immutable path cache poisoning refused');
   nominated.set(spec,expected);
  }
  const pending=[...nominated].filter(([spec])=>!immutablePaths.has(spec));if(!pending.length)return;
  const output=bytes(invoke(['rev-parse','--revs-only','--end-of-options',...pending.map(([spec])=>spec)],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024,timeout:30000})).toString('utf8');
  const lines=output.endsWith('\n')?output.slice(0,-1).split('\n'):[];
  if(lines.length!==pending.length)throw Error('Immutable path batch output cardinality differs');
  for(let index=0;index<pending.length;index++)if(!objectId.test(lines[index])||lines[index]!==pending[index][1])throw Error('Immutable path object substitution refused');
  // Install nothing until every output has passed validation.
  for(const[spec,expected]of pending)immutablePaths.set(spec,expected);
 };
 reader.preloadBlobs=ids=>{
  if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'||!objectId.test(id)))throw Error('Full immutable Git blob identities required');
  const pending=[...new Set(ids)].filter(id=>!blobs.has(id));if(!pending.length)return;
  const output=bytes(invoke(['cat-file','--batch'],{input:Buffer.from(pending.join('\n')+'\n'),stdio:['pipe','pipe','pipe'],maxBuffer:128*1024*1024,timeout:30000}));
  const loaded=new Map();let offset=0;
  for(const expected of pending){
   const newline=output.indexOf(10,offset);if(newline<0)throw Error('Truncated Git batch header');
   const header=output.subarray(offset,newline).toString('ascii'),match=/^([0-9a-f]{40}) blob (0|[1-9][0-9]*)$/.exec(header);
   if(!match||match[1]!==expected)throw Error('Git batch blob identity/type unavailable: '+expected);
   const length=Number(match[2]);if(!Number.isSafeInteger(length))throw Error('Invalid Git batch blob length');
   const start=newline+1,end=start+length;
   if(end>=output.length||output[end]!==10)throw Error('Truncated Git batch blob or invalid delimiter');
   const content=output.subarray(start,end);verifyBlob(expected,content);loaded.set(expected,Buffer.from(content));offset=end+1;
  }
  if(offset!==output.length)throw Error('Unexpected trailing Git batch output');
  for(const [id,content]of loaded)blobs.set(id,content);
 };
 reader.preloadCommits=ids=>{
  if(!Array.isArray(ids)||ids.some(id=>typeof id!=='string'||!objectId.test(id)))throw Error('Full immutable Git commit identities required');
  const pending=[...new Set(ids)].filter(id=>!commitObjects.has(id));if(!pending.length)return;
  const output=bytes(invoke(['cat-file','--batch'],{input:Buffer.from(pending.join('\n')+'\n'),stdio:['pipe','pipe','pipe'],maxBuffer:128*1024*1024,timeout:30000}));
  const loaded=new Map();let offset=0;
  for(const expected of pending){
   const newline=output.indexOf(10,offset);if(newline<0)throw Error('Truncated Git commit batch header');
   const header=output.subarray(offset,newline).toString('ascii');if(header===expected+' missing'){const error=Error('Exact Git commit unavailable: '+expected);error.missingCommit=expected;throw error;}const match=/^([0-9a-f]{40}) commit (0|[1-9][0-9]*)$/.exec(header);
   if(!match||match[1]!==expected)throw Error('Git batch commit identity/type unavailable: '+expected);
   const length=Number(match[2]);if(!Number.isSafeInteger(length))throw Error('Invalid Git batch commit length');
   const start=newline+1,end=start+length;if(end>=output.length||output[end]!==10)throw Error('Truncated Git commit batch or invalid delimiter');
   const content=output.subarray(start,end),actual=createHash('sha1').update(Buffer.from(`commit ${content.length}\0`)).update(content).digest('hex');if(actual!==expected)throw Error('Git commit content address differs: '+expected);
   loaded.set(expected,Buffer.from(content));offset=end+1;
  }
  if(offset!==output.length)throw Error('Unexpected trailing Git commit batch output');
  for(const[id,content]of loaded){commitObjects.set(id,content);commits.set(id,Buffer.from(id+'\n'));}
 };
 return reader;
}

// Completion checks share immutable Git objects only for the identical supplied
// transport. Current target reads are outside this reader; symbolic HEAD stays live.
const completionReaders=new WeakMap();
export function completionGitReader(invoke){
 let reader=completionReaders.get(invoke);
 if(!reader){reader=makeGitReader(invoke);completionReaders.set(invoke,reader);completionReaders.set(reader,reader);}
 return reader;
}
