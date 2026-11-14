import {it,expect,vi} from 'vitest';vi.mock('server-only',()=>({}));
const state=vi.hoisted(()=>({reply:{data:null as unknown,error:null}}));
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:()=>({rpc:async()=>state.reply})}));
import {readTechnologyFiveJob,submitTechnologyFiveJob} from './technology-five-job-storage';
import {runFactoryAutomationBatch} from './factory-automation-contract';
const key='00000000-0000-4000-8000-000000000001',principal={keyId:key,keyHash:'a'.repeat(64),organizationId:key};
it('recovers exact nine packet through existing RPC and fails closed on persisted output/input mutation',async()=>{
 const input=[{x:'2'}],rows=runFactoryAutomationBatch({catalogId:218,version:1,rows:input});
 const job={id:key,catalog_id:218,engine_id:'launch-square-calculator',technical_version:1,status:'completed',input_rows:input,output_rows:rows};
 state.reply.data={status:'completed',request_id:key,job};
 expect(await readTechnologyFiveJob(principal,key)).toMatchObject({catalogId:218,rows});
 expect(await submitTechnologyFiveJob(principal,key,{catalogId:218,version:1,rows:input},null)).toMatchObject({catalogId:218});
 await expect(submitTechnologyFiveJob(principal,key,{catalogId:218,version:1,rows:[{x:'3'}]},null)).rejects.toMatchObject({status:503});
 state.reply.data={status:'completed',request_id:key,job:{...job,output_rows:[{index:0,ok:true,result:{output:{result:5}}}]}};
 await expect(readTechnologyFiveJob(principal,key)).rejects.toMatchObject({status:503});
});
