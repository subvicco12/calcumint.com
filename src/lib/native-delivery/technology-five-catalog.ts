import {technologyNextCatalog,type TechnologyNativeDescriptor} from './technology-next-catalog';
/** Exact supported technical tuples; no title-derived or arbitrary calculator routing. */
export const technologyFiveCatalog=[
 {catalogId:370,engineId:'technology.bandwidth',slug:'bandwidth-calculator',version:1,title:'Bandwidth Calculator',fields:[['dataMegabytes','Data size (MB)','100'],['timeSeconds','Duration (seconds)','10']],unit:'Mbps'},
 {catalogId:371,engineId:'technology.download-time',slug:'download-time-calculator',version:1,title:'Download Time Calculator',fields:[['dataMegabytes','Data size (MB)','100'],['bandwidthMbps','Bandwidth (Mbps)','80']],unit:'seconds'},
 {catalogId:372,engineId:'technology.upload-time',slug:'upload-time-calculator',version:1,title:'Upload Time Calculator',fields:[['dataMegabytes','Data size (MB)','100'],['bandwidthMbps','Bandwidth (Mbps)','80']],unit:'seconds'},
 {catalogId:373,engineId:'technology.data-transfer',slug:'data-transfer-calculator',version:1,title:'Data Transfer Calculator',fields:[['bandwidthMbps','Bandwidth (Mbps)','80'],['timeSeconds','Duration (seconds)','10']],unit:'MB'},
 {catalogId:386,engineId:'technology.base64-size',slug:'base64-size-calculator',version:1,title:'Base64 Size Calculator',fields:[['inputBytes','Raw payload (bytes)','4']],unit:'encoded bytes'}
] as const;
export const technologyNativeCatalog:readonly TechnologyNativeDescriptor[]=[...technologyFiveCatalog.map(row=>({...row,limitations:row.catalogId===386?'Padded Base64 payload length only; no line wrapping or MIME/data-URL headers.':'Ideal decimal MB/Mbps arithmetic; protocol overhead, latency and congestion are excluded.',enumOptions:{}})),...technologyNextCatalog];
export function technologyFiveIdentity(catalogId:number,version:number){return technologyNativeCatalog.find(row=>row.catalogId===catalogId&&row.version===version);}
