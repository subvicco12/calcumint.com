import type {CalculatorDefinition} from '@/calculators/types';
import {bandwidthCalculator,downloadTimeCalculator,uploadTimeCalculator,dataTransferCalculator,storageConversionCalculator} from '@/calculators/technology-computing/catalog-batch-1';
import type {Publication20Definition,Publication20Field} from './types';
const numeric=(key:string,label:string,unit:string,defaultValue:string):Publication20Field=>Object.freeze({key,label,kind:'number',unit,defaultValue});
const transferScope='Ideal deterministic arithmetic using decimal MB (1 MB = 1,000,000 octets) and Mbps (1 Mbps = 1,000,000 bits/second), eight bits per octet. Strictly positive supplied quantities; not measured bandwidth, provider speed or a delivery guarantee. Protocol overhead, latency, congestion and changing rates are excluded.';
const storageUnits=Object.freeze(['B','KiB','MiB','GiB','TiB']);
const existing=(definition:unknown)=>definition as CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
/** Exact immutable registered definitions; metadata does not certify or publish them. */
export const networkPublicationDefinitions:readonly Publication20Definition[]=Object.freeze([
 {catalogId:370,definition:existing(bandwidthCalculator),fields:Object.freeze([numeric('dataMegabytes','Data (MB)','MB','100'),numeric('timeSeconds','Time (s)','s','10')]),primaryKey:'value' as const,outputUnit:()=> 'Mbps',scope:transferScope},
 {catalogId:371,definition:existing(downloadTimeCalculator),fields:Object.freeze([numeric('dataMegabytes','Data (MB)','MB','100'),numeric('bandwidthMbps','Bandwidth (Mbps)','Mbps','80')]),primaryKey:'value' as const,outputUnit:()=> 's',scope:transferScope},
 {catalogId:372,definition:existing(uploadTimeCalculator),fields:Object.freeze([numeric('dataMegabytes','Data (MB)','MB','100'),numeric('bandwidthMbps','Bandwidth (Mbps)','Mbps','80')]),primaryKey:'value' as const,outputUnit:()=> 's',scope:transferScope},
 {catalogId:373,definition:existing(dataTransferCalculator),fields:Object.freeze([numeric('bandwidthMbps','Bandwidth (Mbps)','Mbps','80'),numeric('timeSeconds','Time (s)','s','10')]),primaryKey:'value' as const,outputUnit:()=> 'MB',scope:transferScope},
 {catalogId:374,definition:existing(storageConversionCalculator),fields:Object.freeze([numeric('value','Value','selected source unit','1'),Object.freeze({key:'fromUnit',label:'From unit',kind:'select' as const,options:storageUnits,defaultValue:'GiB'}),Object.freeze({key:'toUnit',label:'To unit',kind:'select' as const,options:storageUnits,defaultValue:'MiB'})]),primaryKey:'value' as const,outputUnit:(input:Record<string,unknown>)=>typeof input.toUnit==='string'?input.toUnit:'',scope:'Binary IEC storage conversion only: B, KiB, MiB, GiB and TiB use exact powers of 1024 bytes. Decimal MB/GB and provider billing conventions are not silently substituted. The immutable v1 schema requires a strictly positive value.'},
].map(row=>Object.freeze(row)));

export const networkPublicationLabels:Readonly<Record<number,string>>=Object.freeze({370:'Bandwidth',371:'Download time',372:'Upload time',373:'Transferred data',374:'Converted storage'});
export const networkPublicationMethodology='Deterministic calculation using the reviewed Technology & Computing engine.';
