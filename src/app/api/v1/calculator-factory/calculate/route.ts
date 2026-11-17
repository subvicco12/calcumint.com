import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireNativeApi } from '@/lib/native-delivery/authorization';
import { NativeDeliveryError } from '@/lib/native-delivery/contract';
import {parseFinalPrivateSnapshotText} from '@/lib/final-private-snapshot-text';
import { nativeError } from '@/lib/native-delivery/http';
import { requireFactoryPublication } from '@/lib/calculator-factory/publication';
import { runFactoryCalculation } from '@/lib/calculator-factory/registry';

const requestSchema = z.object({
  catalogId: z.number().int(),
  version: z.number().int().positive(),
  input: z.record(z.string(), z.string()),
}).strict();

/** Keep exact serialized identity digits, while retaining the governed 8 KiB bound. */
async function readFactoryJson(request:Request){
 const reader=request.body?.getReader();if(!reader)throw new NativeDeliveryError(400,'JSON body required');
 const chunks:Uint8Array[]=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>8192){await reader.cancel();throw new NativeDeliveryError(413,'Request exceeds 8 KiB');}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{return parseFinalPrivateSnapshotText(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{throw new NativeDeliveryError(400,'Valid lossless JSON required');}
}

export async function POST(request: Request) {
  try {
    await requireNativeApi(request);
    const parsed = requestSchema.safeParse(await readFactoryJson(request));
    if (!parsed.success) throw new NativeDeliveryError(422, 'Invalid exact-version factory input');
    await requireFactoryPublication(parsed.data.catalogId, parsed.data.version);
    let packet;
    try { packet = runFactoryCalculation(parsed.data.catalogId, parsed.data.version, parsed.data.input); }
    catch (error) {
      if (error instanceof NativeDeliveryError) throw error;
      throw new NativeDeliveryError(422, 'Input is outside the supported factory calculator domain');
    }
    return NextResponse.json(packet, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) { return nativeError(error); }
}
