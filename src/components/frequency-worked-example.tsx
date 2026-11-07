import {frequencyConverter} from '@/calculators/conversion/catalog-batch-3';
import {runCalculator} from '@/calculators/engine';
import {frequencyPresentationUnit} from '@/lib/frequency-presentation';

/** Render the exact immutable v1 definition's example through its existing engine. */
export function FrequencyWorkedExample(){
 const definition=frequencyConverter;
 const example=definition.examples[0];
 const {output}=runCalculator(definition,example.input);
 const symbol=(code:string)=>frequencyPresentationUnit(definition.slug,definition.version,code);
 return <div data-frequency-worked-example="conversion.frequency@1">
  <p>Input: {example.input.value} {symbol(example.input.fromUnit)} → {symbol(example.input.toUnit)}</p>
  <p><code>{definition.formulas[0].expression}</code></p>
  {example.input.fromUnit==='ghz'&&example.input.toUnit==='mhz'&&<>
   <p>GHz denotes 10^9 Hz; MHz denotes 10^6 Hz. The source-to-target factor for this example is 1000.</p>
   <p>Substitution: {example.input.value} × 1000 = {output.result} {symbol(example.input.toUnit)}</p>
  </>}
  <p>Result: {output.result} {symbol(example.input.toUnit)}</p>
  <p>Calculation engine: {definition.id}, version {definition.version}.</p>
 </div>;
}
