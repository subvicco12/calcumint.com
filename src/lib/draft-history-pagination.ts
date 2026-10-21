import {z} from 'zod';
import {draftPreviewDefinitions} from '@/calculators/final-framework/draft-preview-catalog';
export const draftHistorySlugs=draftPreviewDefinitions.map(definition=>definition.slug);
export type DraftHistorySource='history'|'scenario';
export type DraftHistoryPageRequest={expectedOwnerId:string;source:DraftHistorySource;cursor?:string|null;limit?:20|50};
// Keep PostgreSQL fractional seconds intact: converting through Date loses microseconds.
const timestamp=z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/).refine(value=>Number.isFinite(Date.parse(value)));
const cursorSchema=z.object({v:z.literal(1),owner:z.string().min(1).max(200),source:z.enum(['history','scenario']),limit:z.union([z.literal(20),z.literal(50)]),createdAt:timestamp,id:z.string().uuid()}).strict();
export type DraftHistoryCursor=z.infer<typeof cursorSchema>;
export function encodeDraftHistoryCursor(cursor:DraftHistoryCursor){return Buffer.from(JSON.stringify(cursorSchema.parse(cursor))).toString('base64url');}
export function decodeDraftHistoryCursor(raw:string,owner:string,source:DraftHistorySource,limit:20|50){
 if(raw.length>2048||!/^[-_A-Za-z0-9]+$/.test(raw))throw new Error('Invalid draft history cursor');
 try{const value=cursorSchema.parse(JSON.parse(Buffer.from(raw,'base64url').toString('utf8')));if(value.owner!==owner||value.source!==source||value.limit!==limit)throw new Error();return value;}catch{throw new Error('Invalid draft history cursor');}
}
export function draftHistorySeekFilter(cursor:DraftHistoryCursor){
 const validated=cursorSchema.parse(cursor);
 return `created_at.lt."${validated.createdAt}",and(created_at.eq."${validated.createdAt}",id.lt.${validated.id})`;
}
