"use client";
import {useState} from 'react';
const PAGE_SIZE=25;
/** Replacement analytical arrays reset paging synchronously; no stale effect frame. */
export function useAnalysisPage<T>(rows:readonly T[]){
 const [selection,setSelection]=useState<{rows:readonly T[];page:number}>({rows,page:0});
 if(selection.rows!==rows)setSelection({rows,page:0});
 const page=selection.rows===rows?Math.min(selection.page,Math.max(0,Math.ceil(rows.length/PAGE_SIZE)-1)):0;
 return {visible:rows.length>PAGE_SIZE?rows.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE):rows,
  page,start:page*PAGE_SIZE+1,end:Math.min((page+1)*PAGE_SIZE,rows.length),total:rows.length,
  previous:()=>setSelection({rows,page:Math.max(0,page-1)}),next:()=>setSelection({rows,page:page+1})};
}
export function AnalysisPagination({name,page,start,end,total,previous,next}:ReturnType<typeof useAnalysisPage>&{name:string}){
 if(total<=PAGE_SIZE)return null;
 return <div className="analysis-pagination"><p role="status" aria-live="polite" aria-atomic="true">Showing {start}–{end} of {total} {name} rows. {(name==='sensitivity'||name==='trend'||name==='overview')?'Chart and table show the same page.':'All rows remain available through these pages.'}</p><div><button type="button" className="button secondary" aria-label={`Previous ${name} page`} disabled={page===0} onClick={previous}>Previous</button><button type="button" className="button secondary" aria-label={`Next ${name} page`} disabled={end===total} onClick={next}>Next</button></div></div>;
}
