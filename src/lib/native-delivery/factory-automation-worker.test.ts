import {it,expect,vi} from 'vitest';
import {processTechnologyFiveWebhooks} from './technology-five-webhook-worker';
import {runFactoryAutomationBatch} from './factory-automation-contract';
import {verifyWebhookSignature} from '@/lib/api/webhooks';
const id='00000000-0000-4000-8000-000000000001',event='00000000-0000-4000-8000-000000000002',organizationId='00000000-0000-4000-8000-000000000003',issuerId='00000000-0000-4000-8000-000000000004';
const rows=[{x:'3'}],outputs=runFactoryAutomationBatch({catalogId:219,version:1,rows});
const payload=JSON.stringify({id:event,type:'calculation.completed',data:{id:event,catalog_id:219,engine_id:'launch-cube-calculator',technical_version:1,status:'completed',input_rows:rows,output_rows:outputs}});
function fixture(payloadText=payload){let first=true;return {finish:vi.fn(async()=>true),check:vi.fn(async()=>true),assertAuthority:vi.fn(async()=>{}),decrypt:()=> 'test-signature-secret-00000000000000',claim:async(token:string)=>{if(!first)return {status:'missing'};first=false;return {status:'claimed',id,eventId:event,leaseToken:token,payloadText,endpointUrl:'https://receiver.example/hook',secretCiphertext:'encrypted',organizationId,issuerId,catalogId:219,version:1};}};}
it('reuses signed shared durable worker with identical immutable payload across retry attempts',async()=>{
 const bodies:string[]=[];
 const send=vi.fn(async(_url:string,body:string,headers:Record<string,string>,before:()=>Promise<void>)=>{await before();bodies.push(body);expect(verifyWebhookSignature(fixture().decrypt(),Number(headers['x-calcumint-timestamp']),body,headers['x-calcumint-signature'].slice(3))).toBe(true);expect(headers['x-calcumint-event-id']).toBe(event);return bodies.length===1?503:204;});
 expect(await processTechnologyFiveWebhooks(fixture(),send)).toMatchObject({failed:1,delivered:0});expect(await processTechnologyFiveWebhooks(fixture(),send)).toMatchObject({failed:0,delivered:1});expect(bodies).toEqual([payload,payload]);
});
it('refuses modified factory outputs before signing or dispatch and audits failed leased attempt',async()=>{
 const tampered=JSON.parse(payload);tampered.data.output_rows[0].result.output.result=28;
 const deps=fixture(JSON.stringify(tampered)),send=vi.fn(async()=>204);
 expect(await processTechnologyFiveWebhooks(deps,send)).toMatchObject({failed:1});expect(send).not.toHaveBeenCalled();expect(deps.finish).toHaveBeenCalledWith(expect.objectContaining({delivered:false,error:expect.stringContaining('exact engine replay')}));
});
it('rechecks issuer/publication/lease and refuses lost authority without successful delivery',async()=>{
 const deps=fixture();deps.check.mockResolvedValue(false);const send=vi.fn(async()=>204);
 expect(await processTechnologyFiveWebhooks(deps,send)).toMatchObject({failed:1});expect(send).not.toHaveBeenCalled();expect(deps.assertAuthority).toHaveBeenCalledOnce();
});

it('binds the replay packet to original request text even when substituted raw text has the same numeric result',async()=>{
 const equivalent=JSON.parse(payload);equivalent.data.output_rows[0].result.packet.raw.x='03';
 const deps=fixture(JSON.stringify(equivalent)),send=vi.fn(async()=>204);
 expect(await processTechnologyFiveWebhooks(deps,send)).toMatchObject({failed:1});expect(send).not.toHaveBeenCalled();
});
