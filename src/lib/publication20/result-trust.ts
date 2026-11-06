import type {Publication20Definition} from './types';
/** Caller safety only; the exact original engine and its historical JSON remain unchanged. */
export function validatePublication20Result(entry:Publication20Definition,input:Record<string,unknown>,output:Record<string,unknown>):void{
 const value=output[entry.primaryKey];
 if(typeof value!=='number'||!Number.isFinite(value))throw Error('Calculation cannot produce a finite result in the supported numeric range.');
 // Subnormal binary64 values have reduced relative precision. Refuse them at
 // new capture boundaries; do not rewrite original engines or historical replay.
 const minimumNormal=2**-1022;
 const subnormal=(candidate:unknown)=>typeof candidate==='number'&&candidate!==0&&Math.abs(candidate)<minimumNormal;
 // Every selected multiplicative converter has a finite positive scale. A nonzero
 // source therefore cannot legitimately become zero. Affine temperature has real zeros.
 const nonzeroRequired=entry.primaryKey==='value'||(entry.definition.id!=='conversion.temperature'&&typeof input.value==='number'&&input.value!==0);
 if(nonzeroRequired&&value===0)throw Error('Result underflows the supported numeric range; original input is preserved. Choose a larger magnitude or a different unit.');
 if(Object.values(input).some(subnormal)||subnormal(value))throw Error('Input or result is subnormal and outside the supported precision range; original input is preserved. Choose a larger magnitude or a different unit.');
}
