import assert from 'node:assert/strict';
const normalized=text=>text.replace(/\s+/g,' ');
export function expectedPdfFields(value,path){
 if(value!==null&&typeof value==='object'&&Object.keys(value).length)return Object.entries(value).flatMap(([key,child])=>expectedPdfFields(child,`${path}[${Array.isArray(value)?key:JSON.stringify(key)}]`));
 const rendered=typeof value==='number'?(Object.is(value,-0)?'-0':String(value)):JSON.stringify(value);
 return [`${path} = ${rendered}`];
}
export function assertPdfSnapshotReadback(text,snapshot){
 const actual=normalized(text);
 for(const group of ['input','output'])for(const [key,value]of Object.entries(snapshot[group]))for(const field of expectedPdfFields(value,`${group}[${JSON.stringify(key)}]`))assert(actual.includes(normalized(field)),'PDF field/value readback missing: '+field);
}
