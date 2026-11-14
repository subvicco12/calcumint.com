import {NextResponse} from 'next/server';
import {requireNativeApi} from '@/lib/native-delivery/authorization';
import {readNativeJson} from '@/lib/native-delivery/contract';
import {technologyFiveRequestSchema,runTechnologyFiveCalculation} from '@/lib/native-delivery/technology-five-contract';
import {requireTechnologyFivePublication} from '@/lib/native-delivery/technology-five-publication';
import {nativeError} from '@/lib/native-delivery/http';
export async function POST(request:Request){try{await requireNativeApi(request);const parsed=technologyFiveRequestSchema.safeParse(await readNativeJson(request));if(!parsed.success)return NextResponse.json({error:'Invalid exact-version Technology input'},{status:422});await requireTechnologyFivePublication(parsed.data.catalogId,parsed.data.version);return NextResponse.json(runTechnologyFiveCalculation(parsed.data),{headers:{'Cache-Control':'no-store'}});}catch(error){return nativeError(error);}}
