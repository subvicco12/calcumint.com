import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireNativeApi } from '@/lib/native-delivery/authorization';
import { readNativeJson, NativeDeliveryError } from '@/lib/native-delivery/contract';
import { nativeError } from '@/lib/native-delivery/http';
import { requireFactoryPublication } from '@/lib/calculator-factory/publication';
import { runFactoryCalculation } from '@/lib/calculator-factory/registry';

const requestSchema = z.object({
  catalogId: z.number().int(),
  version: z.number().int().positive(),
  input: z.record(z.string(), z.string()),
}).strict();

export async function POST(request: Request) {
  try {
    await requireNativeApi(request);
    const parsed = requestSchema.safeParse(await readNativeJson(request));
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
