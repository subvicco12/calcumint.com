'use client';
import {clipFullSlopeLine,type FullSlopeResult} from '@/lib/full-six/slope';
import type {FullGraphResult} from '@/lib/full-six/graph-full';
import type {CandidateArtifact} from '@/lib/full-six/candidate/workflow';
export function CandidateCharts({artifact}:{artifact:CandidateArtifact}){
 if(artifact.catalogId===276&&artifact.input.operation!=='inverse'){
  const result=artifact.output as unknown as FullSlopeResult,clip=clipFullSlopeLine(result,{xmin:-10,xmax:10,ymin:-10,ymax:10});
  const points=clip.points.map(p=>`${(p.x+10)*25},${(10-p.y)*15}`).join(' ');
  return <figure><svg role="img" aria-label="Line clipped to x and y from negative ten to ten" viewBox="0 0 500 300" style={{width:'100%',maxHeight:360}}><title>Analytic line, viewport −10 to 10</title><path d="M0 150H500M250 0V300" fill="none" stroke="currentColor" opacity="0.3"/>{clip.status==='segment'&&<polyline points={points} fill="none" stroke="currentColor" strokeWidth={3}/>}</svg><figcaption>{clip.status==='segment'?'Line segment in the stated viewport.':`No visible segment: ${clip.status}.`} The values table remains authoritative.</figcaption></figure>;
 }
 if((artifact.catalogId===235||artifact.catalogId===251)&&Array.isArray(artifact.output.curves)){
  const result=artifact.output as unknown as FullGraphResult,minX=Number(result.request.minX),maxX=Number(result.request.maxX),minY=Number(result.viewport.minY),maxY=Number(result.viewport.maxY);
  const paths:{key:string;points:string}[]=[];
  for(const [i,curve] of result.curves.entries()){
   let current:number|null=null,points:string[]=[],piece=0;
   const flush=()=>{if(points.length)paths.push({key:`${i}-${piece++}`,points:points.join(' ')});points=[];current=null;};
   for(const sample of curve.samples){if(sample.segmentId===null||sample.y===null){flush();continue;}const x=(sample.x-minX)/(maxX-minX)*500,y=(maxY-Number(sample.y))/(maxY-minY)*300;if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(y)>10000){flush();continue;}if(current!==sample.segmentId)flush();current=sample.segmentId;points.push(`${x},${y}`);}
   flush();
  }
  return <figure><svg role="img" aria-label="Sampled function curves with unresolved gaps omitted" viewBox="0 0 500 300" style={{width:'100%',maxHeight:360,overflow:'hidden'}}><title>Sampled curves; incomplete coverage</title>{paths.map(p=><polyline key={p.key} points={p.points} fill="none" stroke="currentColor" strokeWidth={2}/>)}</svg><figcaption>Sampled-incomplete plot. Unresolved cells are gaps; no continuity, exhaustive roots or global-extrema claim.</figcaption></figure>;
 }
 if((artifact.catalogId===282||artifact.catalogId===283)&&artifact.output.histogram){
  const histogram=artifact.output.histogram as {bins:{count:number}[]};const max=Math.max(1,...histogram.bins.map(b=>b.count)),width=500/Math.max(1,histogram.bins.length);
  return <figure><svg role="img" aria-label="Frequency histogram; exact bin edges and counts are in the result table" viewBox="0 0 500 300" style={{width:'100%',maxHeight:360}}><title>Frequency histogram</title>{histogram.bins.map((b,i)=><rect key={i} x={i*width} y={300-b.count/max*280} width={Math.max(0,width-1)} height={b.count/max*280} fill="currentColor"/>)}</svg><figcaption>Histogram counts; exact rational edges and inclusion rules are retained in the complete result artifact.</figcaption></figure>;
 }
 return null;
}
