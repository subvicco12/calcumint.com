import {AuthSessionMissingError} from '@supabase/supabase-js';
import {describe,it,expect,vi} from 'vitest';
import {saveHistoryAtomically} from './account-persistence';
const id='11111111-1111-4111-8111-111111111111';
const snapshot={calculatorSlug:'slope-calculator',calculatorVersion:1,input:{rise:2},output:{result:1.999}};
describe('atomic history persistence',()=>{
 it('uses only the atomic RPC and accepts the exact scalar retry UUID',async()=>{const rpc=vi.fn().mockResolvedValue({data:id,error:null});const from=vi.fn();expect(await saveHistoryAtomically({rpc,from} as never,id,snapshot,'owner')).toEqual({id});expect(from).not.toHaveBeenCalled();expect(rpc).toHaveBeenCalledWith('save_calculation_history_atomic',{p_expected_owner_id:'owner',p_request_id:id,p_calculator_slug:'slope-calculator',p_calculator_version:1,p_input_data:{rise:2},p_output_data:{result:1.999}});});
 it.each([null,[],{id},'22222222-2222-4222-8222-222222222222'])('rejects malformed or mismatched reply %j',async(data)=>{await expect(saveHistoryAtomically({rpc:vi.fn().mockResolvedValue({data,error:null})} as never,id,snapshot,'owner')).rejects.toThrow('Could not save calculation history');});
 it('fails closed when the RPC is unavailable without REST or count fallback',async()=>{const from=vi.fn();await expect(saveHistoryAtomically({rpc:vi.fn().mockResolvedValue({data:null,error:{code:'PGRST202'}}),from} as never,id,snapshot,'owner')).rejects.toThrow('Could not save calculation history');expect(from).not.toHaveBeenCalled();});
});

it('preserves typed terminal authentication failures from RPC',async()=>{const error=new AuthSessionMissingError();await expect(saveHistoryAtomically({rpc:vi.fn().mockResolvedValue({data:null,error})} as never,id,snapshot,'owner')).rejects.toBe(error);});
it('rejects absent owner binding before invoking the RPC',async()=>{const rpc=vi.fn();await expect(saveHistoryAtomically({rpc} as never,id,snapshot,'')).rejects.toThrow();expect(rpc).not.toHaveBeenCalled();});
