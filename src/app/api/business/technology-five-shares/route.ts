import {requireSameOrigin} from '@/lib/native-delivery/authorization';
import {NativeDeliveryError} from '@/lib/native-delivery/contract';
import {TechnologyFiveSharingError,storeTechnologyFiveShare} from '@/lib/business/technology-five-sharing-server';
import {storeTechnologyNextShare} from '@/lib/business/technology-next-sharing-server';
export const runtime='nodejs';
async function body(request:Request){
 const reader=request.body?.getReader();if(!reader)throw new TechnologyFiveSharingError(400,'JSON body required.');
 const chunks:Uint8Array[]=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>65536){await reader.cancel();throw new TechnologyFiveSharingError(413,'Sharing request exceeds 64 KiB.');}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new TechnologyFiveSharingError(400,'Valid JSON required.');}
}
export async function POST(request:Request){
 try{
  requireSameOrigin(request);
  if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json')throw new TechnologyFiveSharingError(415,'JSON sharing requests required.');
  const params=new URL(request.url).searchParams;
  const cohorts=params.getAll('cohort');
  if([...params.keys()].some(key=>key!=='cohort')||cohorts.length>1||(cohorts.length===1&&cohorts[0]!=='next'))throw new TechnologyFiveSharingError(400,'Unknown sharing cohort.');
  const next=cohorts[0]==='next';
  const id=await (next?storeTechnologyNextShare:storeTechnologyFiveShare)(await body(request));
  return Response.json({id,href:'/business/shared/'+id+(next?'?cohort=next':'')},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(error){const known=error instanceof TechnologyFiveSharingError||error instanceof NativeDeliveryError;return Response.json({error:known?error.message:'Sharing is temporarily unavailable. Earlier records are unchanged.'},{status:known?error.status:503,headers:{'Cache-Control':'no-store'}});}
}
