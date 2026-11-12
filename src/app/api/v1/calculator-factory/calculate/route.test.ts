import { beforeEach, expect, it, vi } from 'vitest';
const lane = vi.hoisted(() => ({ auth:vi.fn(), publish:vi.fn(), execute:vi.fn() }));
vi.mock('@/lib/native-delivery/authorization',()=>({requireNativeApi:lane.auth}));
vi.mock('@/lib/calculator-factory/publication',()=>({requireFactoryPublication:lane.publish}));
vi.mock('@/lib/calculator-factory/registry',()=>({runFactoryCalculation:lane.execute}));
import { NativeDeliveryError } from '@/lib/native-delivery/contract';
import { POST } from './route';
const request=(body:unknown)=>new Request('https://local/api/v1/calculator-factory/calculate',{method:'POST',body:JSON.stringify(body)});
const valid={catalogId:208,version:1,input:{old:'80',next:'100'}};
beforeEach(()=>{vi.clearAllMocks();lane.auth.mockResolvedValue({});lane.publish.mockResolvedValue({});lane.execute.mockReturnValue({catalogId:208,version:1,output:{result:25}});});
it('composes governed authorization before publication and execution (authorization is synthetic here)',async()=>{
 const response=await POST(request(valid));expect(response.status).toBe(200);expect(response.headers.get('Cache-Control')).toBe('no-store');
 expect(lane.auth.mock.invocationCallOrder[0]).toBeLessThan(lane.publish.mock.invocationCallOrder[0]);
 expect(lane.publish.mock.invocationCallOrder[0]).toBeLessThan(lane.execute.mock.invocationCallOrder[0]);
 expect(lane.execute).toHaveBeenCalledWith(208,1,{old:'80',next:'100'});
});
it('stops before body parsing, publication and execution when authorization rejects',async()=>{
 lane.auth.mockRejectedValue(new NativeDeliveryError(401,'API key required'));
 const response=await POST(new Request('https://local',{method:'POST',body:'malformed'}));
 expect(response.status).toBe(401);expect(lane.publish).not.toHaveBeenCalled();expect(lane.execute).not.toHaveBeenCalled();
});
it('rejects invalid strict envelopes with422 before publication or execution',async()=>{
 for(const body of [{...valid,extra:true},{...valid,version:0},{...valid,version:1.5},{...valid,catalogId:'208'},{...valid,catalogId:208.5},{...valid,input:{old:80}},{...valid,input:[]},{...valid,input:null},{catalogId:208,version:1}]) {
  expect((await POST(request(body))).status).toBe(422);
 }
 expect(lane.publish).not.toHaveBeenCalled();expect(lane.execute).not.toHaveBeenCalled();
});
it('honors existing bounded JSON reader and fails closed at publication',async()=>{
 expect((await POST(new Request('https://local',{method:'POST',body:'x'.repeat(8193)}))).status).toBe(413);
 lane.publish.mockRejectedValue(new NativeDeliveryError(404,'Factory delivery unavailable'));
 expect((await POST(request(valid))).status).toBe(404);expect(lane.execute).not.toHaveBeenCalled();
});

it('maps calculator validation failures to422 after authorization and publication',async()=>{
 lane.execute.mockImplementationOnce(()=>{throw new Error('Invalid calculator field');});
 expect((await POST(request(valid))).status).toBe(422);
 lane.execute.mockImplementationOnce(()=>{throw new NativeDeliveryError(503,'Engine binding unavailable');});
 expect((await POST(request(valid))).status).toBe(503);
 lane.auth.mockRejectedValueOnce(new NativeDeliveryError(503,'Authority unavailable'));
 expect((await POST(request(valid))).status).toBe(503);
});

it('refuses serialized identity and version digits that JSON.parse would erase',async()=>{
 for(const body of ['{"catalogId":208.0000000000000000001,"version":1,"input":{"old":"80","next":"100"}}','{"catalogId":208,"version":1.00000000000000001,"input":{"old":"80","next":"100"}}'])expect((await POST(new Request('https://local',{method:'POST',body}))).status).toBe(400);
 expect(lane.publish).not.toHaveBeenCalled();expect(lane.execute).not.toHaveBeenCalled();
 expect((await POST(request(valid))).status).toBe(200);
});
