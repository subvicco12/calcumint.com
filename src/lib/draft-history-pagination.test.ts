import {describe,it,expect} from 'vitest';
import {decodeDraftHistoryCursor,encodeDraftHistoryCursor,draftHistorySeekFilter,draftHistorySlugs} from './draft-history-pagination';
const cursor={v:1 as const,owner:'owner',source:'history' as const,limit:20 as const,createdAt:'2026-10-20T12:00:00.123456+00:00',id:'123e4567-e89b-42d3-a456-426614174000'};
describe('private draft history cursors',()=>{
 it('round trips exact PostgreSQL microseconds and stable UUID ties',()=>{const encoded=encodeDraftHistoryCursor(cursor);expect(decodeDraftHistoryCursor(encoded,'owner','history',20)).toEqual(cursor);expect(draftHistorySeekFilter(cursor)).toBe(`created_at.lt."${cursor.createdAt}",and(created_at.eq."${cursor.createdAt}",id.lt.${cursor.id})`);});
 it('binds cursors to owner, source and page size',()=>{const encoded=encodeDraftHistoryCursor(cursor);expect(()=>decodeDraftHistoryCursor(encoded,'foreign','history',20)).toThrow();expect(()=>decodeDraftHistoryCursor(encoded,'owner','scenario',20)).toThrow();expect(()=>decodeDraftHistoryCursor(encoded,'owner','history',50)).toThrow();});
 it.each(['bad!', '', 'x'.repeat(2049),Buffer.from(JSON.stringify({...cursor,createdAt:'2026-01-01),user_id.eq.foreign'})).toString('base64url'),Buffer.from(JSON.stringify({...cursor,id:'x),user_id.eq.foreign'})).toString('base64url'),Buffer.from(JSON.stringify({...cursor,v:2})).toString('base64url')])('rejects malformed or injected cursor %s',raw=>{expect(()=>decodeDraftHistoryCursor(raw,'owner','history',20)).toThrow();});
 it('includes all fourteen private DRAFT calculators',()=>{expect(draftHistorySlugs).toHaveLength(14);expect(new Set(draftHistorySlugs).size).toBe(14);});
});
