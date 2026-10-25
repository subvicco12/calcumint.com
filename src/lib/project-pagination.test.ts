import {expect,it} from 'vitest';
import {encodeProjectCursor,decodeProjectCursor,projectSeekFilter} from './project-pagination';
const cursor={v:1 as const,owner:'owner-a',kind:'scenarios' as const,projectId:'11111111-1111-4111-8111-111111111111',limit:20 as const,createdAt:'2026-10-20T12:00:00.123456+00:00',id:'22222222-2222-4222-8222-222222222222'};
it('preserves microseconds and binds project pagination to its owner and collection',()=>{
 const raw=encodeProjectCursor(cursor);
 expect(decodeProjectCursor(raw,'owner-a','scenarios',cursor.projectId)).toEqual(cursor);
 expect(projectSeekFilter(cursor)).toBe('created_at.lt."2026-10-20T12:00:00.123456+00:00",and(created_at.eq."2026-10-20T12:00:00.123456+00:00",id.lt.22222222-2222-4222-8222-222222222222)');
 for(const [owner,kind,project] of [['owner-b','scenarios',cursor.projectId],['owner-a','projects',undefined],['owner-a','scenarios','33333333-3333-4333-8333-333333333333']] as const)expect(()=>decodeProjectCursor(raw,owner,kind,project)).toThrow();
});
it.each(['2026-02-30T12:00:00Z','2026-13-01T00:00:00Z','2026-10-20T12:00:00.1234567Z','garbage'])('rejects invalid cursor timestamp %s',createdAt=>{expect(()=>encodeProjectCursor({...cursor,createdAt})).toThrow();});
it('rejects malformed payloads and unsupported page sizes',()=>{
 for(const raw of ['', '*', 'a'.repeat(2049), Buffer.from(JSON.stringify({...cursor,limit:50})).toString('base64url'),Buffer.from(JSON.stringify({...cursor,extra:'injected'})).toString('base64url')])expect(()=>decodeProjectCursor(raw,'owner-a','scenarios',cursor.projectId)).toThrow();
 expect(()=>encodeProjectCursor({...cursor,kind:'projects'})).toThrow();
});
