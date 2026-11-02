import type {DecimalStatisticsInput} from './decimal-descriptive';
export type StatisticsDraft={text:string;mode:''|'population'|'sample';encoding:'raw'|'frequency';unit:string;omitMissing:boolean};
export const emptyStatisticsDraft:StatisticsDraft={text:'',mode:'',encoding:'raw',unit:'',omitMissing:false};
/** Never trim the dataset or filter blank lines: those are explicit missing rows. */
export function parseStatisticsDraft(draft:StatisticsDraft):DecimalStatisticsInput{
 if(draft.text.length>2_000_000)throw Error('Dataset exceeds 2000000 characters.');
 if(!draft.mode)throw Error('Choose population or sample mode.');
 if(draft.text==='')throw Error('Enter a dataset.');
 const lines=draft.text.split(/\r\n|\n|\r/,10001);
 if(lines.length>10000)throw Error('Dataset exceeds 10000 rows.');
 const rows=lines.map((line,index)=>{
  if(draft.encoding==='raw'){
   if(line.includes(','))throw Error(`Row ${index+1}: raw data requires one decimal per line; commas and thousands separators are not allowed.`);
   return {value:line};
  }
  if(line.trim()==='')return {value:line,frequency:'1'};
  const parts=line.split(',');
  if(parts.length!==2)throw Error(`Row ${index+1}: expected value,frequency with exactly one comma and no thousands separators.`);
  return {value:parts[0],frequency:parts[1]};
 });
 return {mode:draft.mode,encoding:draft.encoding,unit:draft.unit,missingPolicy:draft.omitMissing?'omit':'reject',rows};
}
export function draftFromStatisticsInput(input:DecimalStatisticsInput):StatisticsDraft{
 const draft:StatisticsDraft={text:input.rows.map(row=>input.encoding==='frequency'?`${row.value??''},${row.frequency??''}`:row.value??'').join('\n'),mode:input.mode,encoding:input.encoding,unit:input.unit??'',omitMissing:input.missingPolicy==='omit'};
 const candidate=parseStatisticsDraft(draft);
 const normalized=(value:DecimalStatisticsInput)=>JSON.stringify({mode:value.mode,encoding:value.encoding,unit:value.unit??'',missingPolicy:value.missingPolicy??'reject',rows:value.rows.map(row=>({value:row.value??null,...(row.frequency!==undefined?{frequency:row.frequency}:{}),...(row.missing!==undefined?{missing:row.missing}:{})}))});
 if(normalized(candidate)!==normalized(input))throw Error('Snapshot input cannot be represented losslessly by this dataset editor.');
 return draft;
}
