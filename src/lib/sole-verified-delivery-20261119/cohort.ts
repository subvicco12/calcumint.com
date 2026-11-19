import {compilePrivateFinal,encodePrivateFinalInputs} from '../calculator-factory/private-final/adapter';
import {monthlyRecurringRevenueCalculator,annualRecurringRevenueCalculator} from '@/calculators/business/catalog-batch-1';
import {cashRunwayCalculator} from '@/calculators/business/catalog-batch-2';
import {rootFinderCalculator} from '@/calculators/advanced-math/catalog-batch-8';
import {airDensityCalculator} from '@/calculators/earth-science/catalog-batch-2';
import type {CalculatorDomain} from '@/calculators/final-framework/types';
import type {CalculatorDefinition} from '@/calculators/types';
import type {FactoryWorkbenchField} from '@/components/sole-civil-time-20261119/workbench';
import type {FactoryExecutionPacket} from '../calculator-factory/workflows';
import {copyCalculationData} from '../calculation-snapshot';
import {equalCompletionJson} from '@/calculators/completion-contracts';

type Engine=CalculatorDefinition<Record<string,unknown>,Record<string,unknown>>;
type InputField=FactoryWorkbenchField & {encoding?:'json'|'boolean'};
const field=(key:string,label:string,unit:string):InputField=>({key,label,unit,kind:'number'});
const specs=[
 [162,monthlyRecurringRevenueCalculator,'business-accounting','currency units/month','Monthly recurring revenue','value','Uses a supplied average from the same recurring-revenue population and time period.',
  [field('payingCustomers','Paying customers','count'),field('averageMonthlyRevenuePerCustomer','Average monthly revenue per paying customer','currency units/month')]],
 [163,annualRecurringRevenueCalculator,'business-accounting','currency units/year','Annualized recurring revenue','value','Twelve times the supplied monthly run rate. This is neither earned revenue nor a growth forecast.',
  [field('monthlyRecurringRevenue','Monthly recurring revenue','currency units/month')]],
 [179,cashRunwayCalculator,'business-accounting','months','Estimated runway','value','Uses a constant positive monthly burn rate in the same currency as cash balance. It does not model future inflows or changes in burn.',
  [field('cashBalance','Cash balance','currency units'),field('monthlyBurnRate','Monthly burn rate','currency units/month')]],
 [254,rootFinderCalculator,'math','dimensionless','Approximate root','root','Uses v1 bisection for a polynomial with ordered bounds and a sign-changing bracket or endpoint root. It finds one bracketed root.',
  [...['a','b','c','d'].map(key=>field(key,'Coefficient '+key,'')),field('left','Left bound',''),field('right','Right bound','')]],
 [493,airDensityCalculator,'engineering','kg/m³','Dry-air density','value','Uses the dry ideal gas model with absolute pressure and Celsius temperature. Humidity and other real-gas corrections are outside this model.',
  [field('pressurePa','Absolute pressure','Pa'),field('temperatureC','Air temperature','°C')]],
] as const satisfies readonly (readonly [number,unknown,CalculatorDomain,string,string,string,string,readonly InputField[]])[];
export const deliveryContracts=Object.freeze(specs.map(([catalogId,definition,domain,unit,label,key,limitations,fields])=>{
 const engine=definition as unknown as Engine;
 return compilePrivateFinal<Record<string,unknown>,Record<string,unknown>,InputField>(engine,{catalogId,revision:'sole-verified-delivery-20261119.1',unit,fields,limitations,

  presentation:{id:`structured-${catalogId}`,domain,family:'technical-engineering',level:'essential',supportedVisualizations:[]},
  project(output){
   const value=output[key];
   if(typeof value!=='string'&&typeof value!=='number')throw Error('Expected structured engine headline');
   return {primaryResult:{id:key,label,value,unit}};
  },
 });
}));
export function deliveryContract(id:number){
 const row=deliveryContracts.find(candidate=>candidate.catalogId===id);
 if(!row)throw Error('Private delivery factory identity unavailable');
 return row;
}
export const deliveryWorkflows=(id:number)=>deliveryContract(id).workflows;
export function verifyVerifiedDeliveryPacket(packet:unknown){
 const clean=copyCalculationData({value:packet},{}).input.value as FactoryExecutionPacket;
 if(!clean||typeof clean.identity?.catalogId!=='number')throw Error('Expected private factory packet');
 return deliveryWorkflows(clean.identity.catalogId).verify(clean);
}
export function verifyVerifiedDeliverySnapshot(value:unknown){
 const clean=copyCalculationData({value},{}).input.value;
 if(!clean||typeof clean!=='object'||Array.isArray(clean))throw Error('Expected private delivery snapshot');
 const tuple=clean as {calculatorSlug?:unknown;calculatorVersion?:unknown};
 const profile=deliveryContracts.find(row=>row.slug===tuple.calculatorSlug&&row.version===tuple.calculatorVersion);
 if(!profile)throw Error('Private factory version unavailable');
 return profile.verifyHistorical(clean);
}
export function prepareVerifiedDeliveryRecovery(value:unknown){
 const checked=verifyVerifiedDeliverySnapshot(value);
 let packet:FactoryExecutionPacket;
 try{packet=deliveryWorkflows(checked.catalogId).execute(encodePrivateFinalInputs(checked.snapshot.input));}
 catch{return {...checked,currentCaptureAvailable:false as const};}
 if(!equalCompletionJson(checked.snapshot,packet.snapshot))throw Error('Historical replay mismatch');
 return {...checked,currentCaptureAvailable:true as const};
}
