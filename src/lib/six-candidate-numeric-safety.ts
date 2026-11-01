/** Caller-side loss-of-representation refusal, never a historical engine rewrite.
 * Exact forward replay remains available for the original recorded artifact. */
export function sixCandidatePrecisionError(slug:string,input:Record<string,unknown>,output:Record<string,unknown>|null):string|null{
 if(!output)return null;
 const message='The result is below the supported numeric precision. Use values at a different scale.';
 if(slug==='volume-calculator'&&output.volume===0)return message;
 if((slug==='standard-deviation-calculator'||slug==='variance-calculator')&&output.variance===0){
  const values=input.values;
  if(Array.isArray(values)&&values.some(value=>value!==values[0]))return message;
 }
 if(slug==='slope-calculator'&&output.value===0&&output.dy!==0)return message;
 return null;
}
