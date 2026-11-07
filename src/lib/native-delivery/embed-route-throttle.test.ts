import {it,expect,vi,beforeEach} from 'vitest';vi.mock('server-only',()=>({}));
const debit=vi.hoisted(()=>vi.fn<(...args:unknown[])=>Promise<boolean>>().mockResolvedValue(false));
vi.mock('./metering',()=>({requirePersistedNativeGrant:async()=>{},debitNativeEmbed:debit}));
vi.mock('./grant',()=>({readNativeGrant:()=>({catalogId:440,version:1,organizationId:'org',issuerId:'issuer'})}));
vi.mock('./authorization',()=>({requireSameOrigin:()=>{},requireNativeIssuer:async()=>{}}));vi.mock('./publication',()=>({requireNativePublication:async()=>{}}));
import {POST} from '@/app/api/native-embed/[grant]/calculate/route';
beforeEach(()=>debit.mockClear());
it('routes an authorized malformed request through the governed shared-key limiter before returning refusal',async()=>{const id='00000000-0000-4000-8000-000000000001';const response=await POST(new Request('https://local/calculate',{method:'POST',headers:{'Idempotency-Key':id},body:'{'}),{params:Promise.resolve({grant:'fixture'})});expect(response.status).toBe(400);expect(debit).toHaveBeenCalledOnce();expect(debit.mock.calls[0]?.[1]).toBe(id);});
