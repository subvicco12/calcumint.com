import {getFactoryContract,runFactoryCalculation} from '@/lib/calculator-factory/registry';
import {factoryDeliveryIdentity} from './factory-delivery-catalog';
import {NativeDeliveryError,runNativeCalculation} from './contract';
import {calculatorRegistry} from '@/calculators/registry';
/** Exact native packets; frequency retains the original v1 response and hashes. */
export function runFactoryEmbedCalculation(catalogId:number,version:number,input:unknown){
 if(catalogId===440&&version===1){try{return runNativeCalculation({catalogId,version,input});}catch(error){if(error instanceof NativeDeliveryError)throw error;throw new NativeDeliveryError(422,'Value is outside the supported finite normal range or has unsupported precision.');}}
 const identity=factoryDeliveryIdentity(catalogId,version),contract=getFactoryContract(catalogId);
 if(!identity||!contract||contract.engineId!==identity.engineId||contract.slug!==identity.slug||contract.version!==version)throw new NativeDeliveryError(404,'Native calculator unavailable');
 const definition=calculatorRegistry.getBySlug(identity.slug);
 if(!definition||definition.id!==identity.engineId||definition.version!==version)throw new NativeDeliveryError(503,'Native engine binding unavailable');
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.values(input).some(value=>typeof value!=='string'))throw new NativeDeliveryError(422,'Exact decimal text input fields required');
 try{
  const packet=runFactoryCalculation(catalogId,version,input as Record<string,string>);
  return {...identity,input:packet.snapshot.input,output:packet.snapshot.output,packet,methodology:definition.formulas,sources:definition.sources,limitations:contract.scope,warnings:['Binary64 range and precision limits apply. Display rounding does not change the native result or recorded packet.']};
 }catch{throw new NativeDeliveryError(422,'Value is outside the supported range, precision or exact input contract.');}
}
