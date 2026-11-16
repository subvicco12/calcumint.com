/** Cache immutable Git tree-query bytes only. Never cache a proof, symbolic ref, status, config or current file. */
const readers=new WeakMap(),oid=/^[a-f0-9]{40}$/;
function literalArguments(args){
 if(!Array.isArray(args))return undefined;
 const length=Object.getOwnPropertyDescriptor(args,'length')?.value;if(typeof length!=='number'||!Number.isSafeInteger(length))return undefined;
 const result=[];for(let index=0;index<length;index++){const field=Object.getOwnPropertyDescriptor(args,String(index));if(!field||!Object.hasOwn(field,'value')||typeof field.value!=='string')return undefined;result.push(field.value);}
 return result;
}
function literalSourcePath(path){return path.length<=1024&&/^src(?:\/[A-Za-z0-9_.-]+)*$/.test(path)&&!path.split('/').some(part=>part==='.'||part==='..');}
function sourceTail(tail){return tail.length===0||tail.length>=2&&tail.length<=257&&tail[0]==='--'&&tail.slice(1).every(literalSourcePath);}
export function isImmutableTreeQuery(input){
 const args=literalArguments(input);if(!args)return false;
 if(args[0]==='ls-tree'){
  if(!['-r','-rz'].includes(args[1])||!['--name-only','--full-tree'].includes(args[2])||!oid.test(args[3]??''))return false;
  const tail=args.slice(4);
  return sourceTail(tail);
 }
 if(args[0]!=='diff'||args[1]!=='--name-only')return false;
 const first=args[2]==='-z'?3:2;
 if(!oid.test(args[first]??'')||!oid.test(args[first+1]??''))return false;
 const tail=args.slice(first+2);
 return sourceTail(tail);
}
export function immutableTreeQueryReader(source){
 if(readers.has(source))return readers.get(source);
 const cache=new Map();
 const reader=(input,options)=>{
  const args=literalArguments(input);if(!args)return source(input,options);
  if(options!==undefined||!isImmutableTreeQuery(args))return source(args,options);
  const key=JSON.stringify(args);
  if(!cache.has(key)){
   const bytes=source(args);if(!Buffer.isBuffer(bytes))throw Error('Immutable Git query must return Buffer');
   if(cache.size>=4096)cache.delete(cache.keys().next().value);
   cache.set(key,Buffer.from(bytes));
  }
  return Buffer.from(cache.get(key));
 };
 for(const name of ['preloadCommits','preloadBlobs','preloadPaths'])if(typeof source[name]==='function')reader[name]=values=>source[name](values);
 readers.set(source,reader);readers.set(reader,reader);return reader;
}
