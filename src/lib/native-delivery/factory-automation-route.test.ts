import {it,expect,vi,beforeEach} from 'vitest';
vi.mock('server-only',()=>({}));
const state=vi.hoisted(()=>({published:true,submit:vi.fn(),read:vi.fn()}));
vi.mock('./technology-five-job-storage',()=>({requireTechnologyBatchApi:async()=>({keyId:'k',keyHash:'hash',organizationId:'o'}),submitTechnologyFiveJob:state.submit,readTechnologyFiveJob:state.read}));
vi.mock('@/lib/calculator-factory/publication',()=>({requireFactoryPublication:async()=>{if(!state.published){const {NativeDeliveryError}=await import('./contract');throw new NativeDeliveryError(404,'Publication unavailable');}}}));
import {POST,GET} from '@/app/api/v1/calculator-factory/batch/route';
const requestId='00000000-0000-4000-8000-000000000001';
const body={catalogId:218,version:1,rows:[{x:'2'},{x:'1e-200'}]};
const req=(value:unknown=body,key=requestId)=>new Request('https://local/api/v1/calculator-factory/batch',{method:'POST',headers:{'Idempotency-Key':key},body:JSON.stringify(value)});
beforeEach(()=>{vi.clearAllMocks();state.published=true;state.submit.mockReset();state.read.mockReset();});
it('probes existing durable storage then submits unchanged registered result and captures domain refusals',async()=>{
 state.submit.mockResolvedValueOnce(null).mockImplementationOnce(async(_p,_key,_body,rows)=>({requestId,catalogId:218,version:1,rows}));
 const reply=await POST(req());expect(reply.status).toBe(200);const json=await reply.json();
 expect(json.rows[0]).toMatchObject({index:0,ok:true,result:{engineId:'launch-square-calculator',output:{result:4},packet:{snapshot:{output:{result:4}}}}});
 expect(json.rows[1].ok).toBe(false);expect(state.submit.mock.calls[0][3]).toBeNull();
});
it('duplicate POST reuses persisted outcome and recovery GET never submits or debits',async()=>{
 const snapshot={requestId,catalogId:218,version:1,rows:[]};state.submit.mockResolvedValue(snapshot);
 expect((await POST(req())).status).toBe(200);expect(state.submit).toHaveBeenCalledOnce();state.submit.mockClear();state.read.mockResolvedValue(snapshot);
 expect((await GET(req())).status).toBe(200);expect(state.submit).not.toHaveBeenCalled();
 state.read.mockResolvedValue({...snapshot,catalogId:386});expect((await GET(req())).status).toBe(404);
});
it('unknown commit remains503 and withdrawal or invalid tuple cannot submit',async()=>{
 state.submit.mockResolvedValue(null);expect((await POST(req())).status).toBe(503);state.submit.mockClear();
 state.published=false;expect((await POST(req())).status).toBe(404);expect(state.submit).not.toHaveBeenCalled();state.published=true;
 expect((await POST(req({...body,catalogId:323}))).status).toBe(422);expect((await POST(req(body,'invalid'))).status).toBe(400);expect(state.submit).not.toHaveBeenCalled();
});
