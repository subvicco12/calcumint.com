import {it,expect,vi} from 'vitest';vi.mock('server-only',()=>({}));
import {embedDebitStatus} from './metering';
it('admits only durable accepted/replayed outcomes and fails closed otherwise',()=>{expect(embedDebitStatus('accepted')).toBe(false);expect(embedDebitStatus('replayed')).toBe(true);for(const x of [null,{},true,'unknown'])expect(()=>embedDebitStatus(x)).toThrow('metering unavailable');expect(()=>embedDebitStatus('limited')).toThrow('quota');expect(()=>embedDebitStatus('conflict')).toThrow('different');expect(()=>embedDebitStatus('denied')).toThrow('revoked');});
