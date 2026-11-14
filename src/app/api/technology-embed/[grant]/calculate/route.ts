import {NextResponse} from 'next/server';
import {readTechnologyFiveGrant} from '@/lib/native-delivery/technology-five-grant';
import {requireNativeIssuer,requireSameOrigin} from '@/lib/native-delivery/authorization';
import {requireTechnologyFivePublication} from '@/lib/native-delivery/technology-five-publication';
import {captureTechnologyFiveEmbedRequest} from '@/lib/native-delivery/technology-five-embed-request';
import {requirePersistedTechnologyFiveGrant,debitTechnologyFiveEmbed} from '@/lib/native-delivery/technology-five-metering';
import {nativeError} from '@/lib/native-delivery/http';
export async function POST(request:Request,{params}:{params:Promise<{grant:string}>}){try{requireSameOrigin(request);const {grant}=await params,claims=readTechnologyFiveGrant(grant,process.env.EMBED_SESSION_SECRET??'');await requireNativeIssuer(claims.organizationId,claims.issuerId);await requireTechnologyFivePublication(claims.catalogId,claims.version);await requirePersistedTechnologyFiveGrant(claims,grant);const capture=await captureTechnologyFiveEmbedRequest(request,{catalogId:claims.catalogId,version:claims.version});const replayed=await debitTechnologyFiveEmbed(claims,capture.requestId,capture.input,capture.result);return NextResponse.json(capture.result,{status:capture.status,headers:{'Cache-Control':'no-store','Idempotent-Replayed':String(replayed)}});}catch(error){return nativeError(error);}}
