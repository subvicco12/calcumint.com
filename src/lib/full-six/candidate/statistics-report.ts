/** Complete private statistics report. Values are exact artifact strings, never display-rounded. */
import {createCandidateSnapshot,replayCandidateSnapshot,type CandidateArtifact} from './workflow';

const decimal=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function cell(value:string):string {
 // Quoting alone does not prevent spreadsheet formula execution. Reject dangerous
 // text rather than prefixing it and silently changing original observations/units.
 const trimmed=value.trimStart();
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)||/^[\t\r\n]/.test(value)||(/^[=+@-]/.test(trimmed)&&!decimal.test(value.trim())))throw Error('Unsafe spreadsheet cell in statistics report');
 return '"'+value.replaceAll('"','""')+'"';
}
/** Verify both digest and exact current-revision recomputation, including all tables. */
export async function createStatisticsCsvReport(value:CandidateArtifact,replay?:(id:282|283,text:string)=>Promise<CandidateArtifact>):Promise<string> {
 const snapshot=await createCandidateSnapshot(value);
 const id=snapshot.artifact.catalogId;
 if(id!==282&&id!==283)throw Error('Statistics CSV requires catalog 282 or 283');
 const verified=replay?await createCandidateSnapshot(await replay(id,JSON.stringify(snapshot))):await replayCandidateSnapshot(JSON.stringify(snapshot),id);
 if(verified.sha256!==snapshot.sha256)throw Error('Exact-revision recomputation mismatch');
 const artifact=verified.artifact;
 const lines:string[]=[];
 const row=(section:string,path:string,type:string,value:string)=>lines.push([section,path,type,value].map(cell).join(','));
 row('report','format','string','private-statistics-csv-1');
 row('report','title','string',id===282?'Standard deviation report':'Variance report');
 row('report','primaryMetric','string',id===282?'standardDeviation':'variance');
 row('report','snapshotSHA256','string',verified.sha256);
 row('report','numericEncoding','string','Exact artifact strings; no display rounding. Import value column as text to retain decimal precision.');
 function fields(section:string,path:string,value:unknown):void {
  if(value===null){row(section,path,'null','null');return;}
  if(typeof value!=='object'){row(section,path,typeof value,String(value));return;}
  const entries=Object.entries(value);
  // Explicit empty containers preserve empty rows/analyses without disappearing.
  if(entries.length===0){row(section,path,Array.isArray(value)?'array':'object',Array.isArray(value)?'[]':'{}');return;}
  for(const [key,item] of entries)fields(section,path+'/'+key.replaceAll('~','~0').replaceAll('/','~1'),item);
 }
 for(const [key,item] of Object.entries(artifact)) {
  if(key==='input')fields('original-input','/input',item);
  else if(key==='output')for(const [part,data] of Object.entries(artifact.output))fields(part,'/output/'+part,data);
  else fields('implementation-binding','/'+key,item);
 }
 const csv='"section","path","type","value"\r\n'+lines.join('\r\n')+'\r\n';
 if(new TextEncoder().encode(csv).byteLength>8_000_000)throw Error('Statistics CSV exceeds 8 MB report budget');
 return csv;
}
