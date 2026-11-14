import {it,expect,vi} from 'vitest';
vi.mock('@/lib/supabase/admin',()=>({createSupabaseAdminClient:vi.fn()}));
vi.mock('./technology-five-sharing-server',()=>({technologyFiveSharingSession:vi.fn(),technologyFiveSharingAccess:vi.fn(async()=> 'admin'),TechnologyFiveSharingError:class extends Error{constructor(public status:number,message:string){super(message);}}}));
import {technologyNextSharingAccess} from './technology-next-sharing-server';
it('uses authoritative capability for specific profile access without upgrading private2',async()=>{
 for(const capability of ['technology-next-sharing-private-2','technology-next-sharing-private-3']){
  const rpc=vi.fn(async()=>({data:capability,error:null})),context={client:{rpc},user:{id:'actor'}} as unknown as Parameters<typeof technologyNextSharingAccess>[0];
  await expect(technologyNextSharingAccess(context,'organization',true,true,'dpi-calculator')).resolves.toBe('admin');
  for(const slug of ['ip-subnet-calculator','screen-ppi-calculator']){
   const result=technologyNextSharingAccess(context,'organization',true,true,slug);
   if(capability.endsWith('-2'))await expect(result).rejects.toMatchObject({status:403});else await expect(result).resolves.toBe('admin');
  }
  expect(rpc).toHaveBeenCalledWith('technology_next_sharing_capability',{target_org:'organization'});
 }
});
it('refuses missing, unknown or failed authoritative capability',async()=>{for(const reply of [{data:null,error:null},{data:'technology-next-sharing-private-4',error:null},{data:'technology-next-sharing-private-3',error:{message:'unavailable'}}]){const context={client:{rpc:async()=>reply},user:{id:'actor'}} as unknown as Parameters<typeof technologyNextSharingAccess>[0];await expect(technologyNextSharingAccess(context,'organization',true,true,'ip-subnet-calculator')).rejects.toMatchObject({status:reply.error?503:403});}});
