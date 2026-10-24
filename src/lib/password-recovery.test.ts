import {beforeEach,expect,it,vi} from 'vitest';
import * as recovery from './password-recovery';
const now=1_800_000_000;
const owner='00000000-0000-4000-8000-000000000001',session='00000000-0000-4000-8000-000000000002';
const fresh=()=>({sub:owner,session_id:session,exp:now+3600,amr:[{method:'recovery',timestamp:now-10}]});
let claims:Record<string,unknown>,userError:unknown,claimError:unknown;
const client={auth:{getUser:vi.fn(),getClaims:vi.fn()}};
beforeEach(()=>{claims=fresh();userError=null;claimError=null;client.auth.getUser.mockImplementation(async()=>({data:{user:{id:owner}},error:userError}));client.auth.getClaims.mockImplementation(async()=>({data:{claims},error:claimError}));});
async function verify(){expect(recovery.verifiedPasswordRecovery).toBeTypeOf('function');return recovery.verifiedPasswordRecovery(client as never,now);}
it('accepts only freshly provider-verified recovery for the same owner and session',async()=>{await expect(verify()).resolves.toEqual({ownerId:owner,sessionId:session});});
it.each(['password','oauth','otp','magiclink','email/signup'])('rejects a valid %s session as insufficient recovery authority',async method=>{claims.amr=[{method,timestamp:now}];await expect(verify()).rejects.toThrow();});
it.each([now-601,now+31,NaN,'recent',undefined])('rejects unprovable or expired recovery time %s',async timestamp=>{claims.amr=[{method:'recovery',timestamp}];await expect(verify()).rejects.toThrow();});
it('does not turn a refreshed token into a new recovery time window',async()=>{claims.exp=now+3600;claims.amr=[{method:'recovery',timestamp:now-601}];await expect(verify()).rejects.toThrow();});
it.each([{sub:'other'}, {session_id:''}, {exp:now-1}, {amr:['recovery']}])('rejects malformed or mismatched verified context %j',async change=>{Object.assign(claims,change);await expect(verify()).rejects.toThrow();});
it.each(['user','claims'])('rejects provider %s verification failure without trusting stored data',async which=>{if(which==='user')userError=new Error('private');else claimError=new Error('private');await expect(verify()).rejects.toThrow();});
