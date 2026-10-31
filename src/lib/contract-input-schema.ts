import {z} from 'zod';
const calculusOperations:Readonly<Record<string,string>>=Object.freeze({'private.canonical-calculus.246':'derivative','private.canonical-calculus.247':'integral','private.canonical-calculus.248':'limit'});
/** Form-only narrowing: immutable shared engine schemas and their runtime validation stay unchanged. */
export function contractFormSchema(adapterKey:string,schema:z.ZodType):z.ZodType{
 const operation=calculusOperations[adapterKey];if(!operation)return schema;
 if(!(schema instanceof z.ZodObject))throw Error('Selected calculus form schema unavailable.');
 const calculation=schema.shape.calculation;
 if(!(calculation instanceof z.ZodDiscriminatedUnion))throw Error('Selected calculus operation schema unavailable.');
 const branch=calculation.options.find(option=>option instanceof z.ZodObject&&option.shape.operation instanceof z.ZodLiteral&&option.shape.operation.values.has(operation));
 if(!branch)throw Error('Selected calculus operation branch unavailable.');
 return schema.extend({calculation:branch});
}
export function hasFixedCalculusOperation(adapterKey:string){return Object.hasOwn(calculusOperations,adapterKey);}
