'use client';
import {converterWorkedExamples} from '@/lib/converter-cohort-20261110';
import {frequencyPresentationUnit} from '@/lib/frequency-presentation';
export function ConverterWorkedExamples({slug,onUse}:{slug:string;onUse:(draft:Readonly<{value:string;fromUnit:string;toUnit:string}>)=>void}){
 const examples=converterWorkedExamples(slug);
 if(!examples.length)return null;
 const unit=(code:string)=>frequencyPresentationUnit(slug,1,code);
 return <section aria-label="Worked examples"><h3>Worked examples</h3>{examples.map((example,index)=><article key={index}>
  <h4>{example.label}</h4><p>{example.draft.value} {unit(example.draft.fromUnit)} → {String(example.result)} {unit(example.draft.toUnit)}</p>
  <ol><li>Use {example.draft.value} {unit(example.draft.fromUnit)} as the source value.</li>{example.formulas.map(formula=><li key={formula.id}>{formula.description} <code>{formula.expression}</code></li>)}<li>Read {String(example.result)} {unit(example.draft.toUnit)} as the converted value.</li></ol>
  <p>{example.scope}</p><ul>{example.sources.map(source=><li key={source.url}><a href={source.url}>Worked-example source: {source.label}</a>{source.note&&<> — {source.note}</>}</li>)}</ul>
  <button type="button" aria-label={`Use worked example ${index+1}`} onClick={()=>onUse(example.draft)}>Use this example</button>
 </article>)}</section>;
}
