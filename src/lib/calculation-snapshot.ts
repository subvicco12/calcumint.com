export type CalculationSnapshot = Readonly<{
 calculatorSlug:string;calculatorVersion:number;
 input:Record<string,unknown>;output:Record<string,unknown>;
}>;

/** Copy the engine's plain JSON domain once, before any asynchronous account action. */
export function copyCalculationData(input:Record<string,unknown>,output:Record<string,unknown>){
 const active=new Set<object>();
 const copy=(value:unknown):unknown=>{
  if(value===null||typeof value==='string'||typeof value==='boolean')return value;
  if(typeof value==='number'){
   if(!Number.isFinite(value))throw new Error('Non-finite calculation value');
   return value;
  }
  if(typeof value!=='object')throw new Error('Unsupported calculation value');
  if(active.has(value))throw new Error('Cyclic calculation data');
  const array=Array.isArray(value),prototype=Object.getPrototypeOf(value);
  if(array?prototype!==Array.prototype:prototype!==Object.prototype&&prototype!==null)throw new Error('Unsupported calculation object');
  if(Object.getOwnPropertySymbols(value).length)throw new Error('Unsupported symbol field');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  for(const [key,descriptor] of Object.entries(descriptors)){
   if(array&&key==='length')continue;
   if(!descriptor.enumerable||!('value' in descriptor))throw new Error('Unsupported calculation field');
   if(array&&(!/^(0|[1-9][0-9]*)$/.test(key)||Number(key)>=value.length))throw new Error('Unsupported array field');
  }
  active.add(value);
  try{
   if(array){
    const rows:unknown[]=[];
    for(let index=0;index<value.length;index++){
     if(!Object.hasOwn(descriptors,String(index)))throw new Error('Unsupported sparse array');
     rows.push(copy(descriptors[String(index)].value));
    }
    return Object.freeze(rows);
   }
   return Object.freeze(Object.fromEntries(Object.entries(descriptors).map(([key,descriptor])=>[key,copy(descriptor.value)])));
  }finally{active.delete(value);}
 };
 const record=(value:Record<string,unknown>)=>{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Calculation data must be records');
  return copy(value) as Record<string,unknown>;
 };
 return Object.freeze({input:record(input),output:record(output)});
}

export function createCalculationSnapshot({calculatorSlug,calculatorVersion,input,output}:CalculationSnapshot):CalculationSnapshot{
 if(typeof calculatorSlug!=='string'||!calculatorSlug.trim()||!Number.isSafeInteger(calculatorVersion)||calculatorVersion<1)throw new Error('Invalid calculation identity');
 return Object.freeze({calculatorSlug,calculatorVersion,...copyCalculationData(input,output)});
}

/** Standard JSON preserves finite numeric values but represents signed zero as zero. */
export function serializeCalculationJson(snapshot:CalculationSnapshot):string{
 return JSON.stringify(createCalculationSnapshot(snapshot),null,2);
}
