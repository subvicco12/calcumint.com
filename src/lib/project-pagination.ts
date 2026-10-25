import {z} from 'zod';
// Preserve PostgreSQL microseconds, and reject calendar normalization such as February 30.
export const projectTimestamp=z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/).refine(value=>{
 if(!z.iso.datetime({offset:true}).safeParse(value).success)return false;
 const [year,month,day]=value.slice(0,10).split('-').map(Number);
 return month>=1&&month<=12&&day>=1&&day<=new Date(Date.UTC(year,month,0)).getUTCDate();
});
const schema=z.object({v:z.literal(1),owner:z.string().min(1).max(200),kind:z.enum(['projects','scenarios']),projectId:z.string().uuid().optional(),limit:z.literal(20),createdAt:projectTimestamp,id:z.string().uuid()}).strict().refine(v=>v.kind==='scenarios'?Boolean(v.projectId):v.projectId===undefined);
export type ProjectCursor=z.infer<typeof schema>;
export function encodeProjectCursor(cursor:ProjectCursor){return Buffer.from(JSON.stringify(schema.parse(cursor))).toString('base64url');}
export function decodeProjectCursor(raw:string,owner:string,kind:ProjectCursor['kind'],projectId?:string){
 if(raw.length>2048||!/^[-_A-Za-z0-9]+$/.test(raw))throw Error('Invalid project cursor');
 try{const value=schema.parse(JSON.parse(Buffer.from(raw,'base64url').toString('utf8')));if(value.owner!==owner||value.kind!==kind||value.projectId!==projectId)throw Error();return value;}catch{throw Error('Invalid project cursor');}
}
export function projectSeekFilter(cursor:ProjectCursor){const value=schema.parse(cursor);return `created_at.lt."${value.createdAt}",and(created_at.eq."${value.createdAt}",id.lt.${value.id})`;}
