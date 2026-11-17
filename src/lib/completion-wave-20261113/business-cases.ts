import {getFactoryContract,getFactoryWorkflows} from '../calculator-factory/registry';

export const remainingBusinessIds = [208,209,210,211,212,215,216,424,425,427,428,433,434,322,323,324,325,327] as const;
export const restrictedBusinessIds = [323,324] as const;
/** Derived from real factory contracts; no approval, publication or registration changes. */
export function businessCases(){
 return remainingBusinessIds.filter(id=>!restrictedBusinessIds.includes(id as 323|324)).map(id=>{
  const contract=getFactoryContract(id);if(!contract?.registered)throw Error(`Registered exact engine missing: ${id}`);
  const input=Object.fromEntries(contract.fields.map(field=>[field.key,String(field.defaultValue??field.options?.[0]??'1')]));
  const primary=contract.fields.find(field=>field.kind==='number');if(!primary)throw Error(`No numeric edit field: ${id}`);
  const edit={[primary.key]:String(Number(input[primary.key])+1)};
  const workflow=getFactoryWorkflows(id),baseline=workflow.execute(input),edited=workflow.execute({...input,...edit});
  if(JSON.stringify(baseline.snapshot.output)===JSON.stringify(edited.snapshot.output))throw Error(`Edit failed to change result: ${id}`);
  return {id,engine:contract.engineId,slug:contract.slug,version:contract.version,input,edit};
 });
}
