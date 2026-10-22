import {beforeEach,describe,expect,it,vi} from 'vitest';
const mocks=vi.hoisted(()=>({create:vi.fn(),getUser:vi.fn(),single:vi.fn(),eq:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:mocks.create}));
import {requireDraftAccountAccess} from './draft-account-access';
beforeEach(()=>{vi.clearAllMocks();mocks.getUser.mockResolvedValue({data:{user:{id:'owner'}},error:null});mocks.single.mockResolvedValue({data:{role:'reviewer',active:true},error:null});mocks.eq.mockReturnValue({maybeSingle:mocks.single});mocks.create.mockResolvedValue({auth:{getUser:mocks.getUser},from:()=>({select:()=>({eq:mocks.eq})})});});
describe('private draft account authority',()=>{
 it('allows active reviewer from owner-scoped platform authority',async()=>{expect((await requireDraftAccountAccess('owner')).user.id).toBe('owner');expect(mocks.eq).toHaveBeenCalledWith('user_id','owner');});
 it.each([{role:'editor',active:true},{role:'future-role',active:true},{role:'admin',active:false},null])('denies unauthorized role %j',async(data)=>{mocks.single.mockResolvedValue({data,error:null});await expect(requireDraftAccountAccess()).rejects.toThrow('Draft access unavailable');});
 it('fails closed on authentication error even with a user',async()=>{mocks.getUser.mockResolvedValue({data:{user:{id:'owner'}},error:new Error('offline')});await expect(requireDraftAccountAccess()).rejects.toThrow('Draft access unavailable');expect(mocks.single).not.toHaveBeenCalled();});
 it('denies stale owner and role lookup failures',async()=>{await expect(requireDraftAccountAccess('other')).rejects.toThrow('Draft access unavailable');mocks.single.mockResolvedValue({data:{role:'owner',active:true},error:new Error('offline')});await expect(requireDraftAccountAccess()).rejects.toThrow('Draft access unavailable');});
});
