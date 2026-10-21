// Test transport only. No SDK, credentials, network, storage, or engine replacements.
type Session={user:{id:string}}|null;
type Callback=(event:string,session:Session)=>void;
const callbacks=new Set<Callback>();
const params=new URLSearchParams(location.search);
export const synthetic={plan:params.get('plan')??'free',userId:'synthetic-reference-owner' as string|null,readFailure:false,holdReads:false,pendingReads:[] as (()=>void)[],writes:[] as {table:string;operation:string;value:unknown}[],
 emit(event:string,userId:string|null){this.userId=userId;for(const callback of callbacks)callback(event,userId?{user:{id:userId}}:null);}};
export function createSupabaseBrowserClient(){return {auth:{async getUser(){return {data:{user:synthetic.userId?{id:synthetic.userId}:null},error:null};},onAuthStateChange(callback:Callback){callbacks.add(callback);return {data:{subscription:{unsubscribe:()=>callbacks.delete(callback)}}};}},from(table:string){
 let operation='read';let value:unknown;
 const result=()=>({data:table==='profiles'?{plan:synthetic.plan}:null,count:0,error:synthetic.readFailure?{message:'Synthetic read failure'}:null});
 const query={select:()=>query,eq:()=>query,async maybeSingle(){return result();},insert(payload:unknown){operation='insert';value=payload;return query;},upsert(payload:unknown){operation='upsert';value=payload;return query;},delete(){operation='delete';return query;},then(resolve:(value:ReturnType<typeof result>)=>unknown){if(operation!=='read')synthetic.writes.push({table,operation,value});return (synthetic.holdReads?new Promise<void>(resume=>synthetic.pendingReads.push(resume)):Promise.resolve()).then(()=>result()).then(resolve);}};
 return query;
}};}
