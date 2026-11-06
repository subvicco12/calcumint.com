/** UI metadata for exact existing registered converters; no new arithmetic,
 * canonical mapping adoption, certification or lifecycle status is introduced. */
import type {CalculatorDefinition} from '@/calculators/types';
import {lengthConverter,areaConverter,volumeConverter,temperatureConverter,speedConverter} from '@/calculators/conversion/catalog-batch-1';
import {pressureConverter,energyConverter,powerConverter,timeConverter,angleConverter} from '@/calculators/conversion/catalog-batch-2';
import {dataStorageConverter,densityConverter,forceConverter,torqueConverter,frequencyConverter} from '@/calculators/conversion/catalog-batch-3';
import type {Publication20Definition,Publication20Field} from './types';
type ConverterDefinition=CalculatorDefinition<{value:number;fromUnit:string;toUnit:string},{result:number}>;
const metadata=(catalogId:number,definition:ConverterDefinition,codes:readonly string[],scope:string):Publication20Definition=>{
 const options=Object.freeze([...codes]);
 const fields:readonly Publication20Field[]=Object.freeze([
  Object.freeze({key:'value',label:'Value',kind:'number' as const,defaultValue:'1'}),
  Object.freeze({key:'fromUnit',label:'From unit',kind:'select' as const,options,defaultValue:options[0]}),
  Object.freeze({key:'toUnit',label:'To unit',kind:'select' as const,options,defaultValue:options[1]}),
 ]);
 return Object.freeze({catalogId,definition:definition as unknown as Publication20Definition['definition'],fields,primaryKey:'result' as const,outputUnit:(input:Record<string,unknown>)=>String(input.toUnit??''),scope});
};
const linear='Fixed-unit scalar conversion through the exact existing v1 factor table. Decimal input is represented by binary64; physical applicability, source review and complete canonical acceptance are separate. The caller must refuse nonzero input rounded to zero by a linear conversion.';
export const conversionPublicationDefinitions:readonly Publication20Definition[]=Object.freeze([
 metadata(423,lengthConverter,['m','km','cm','mm','in','ft','yd','mi'],linear+' International inch/foot/yard/mile codes; no survey-foot mode.'),
 metadata(424,areaConverter,['m2','km2','cm2','ft2','yd2','acre','ha','mi2'],linear+' Squared international-length area factors; no land-jurisdiction assessment.'),
 metadata(425,volumeConverter,['m3','l','ml','cm3','ft3','in3','gal_us','qt_us'],linear+' Explicit U.S. liquid gallon/quart codes; no imperial gallon or ingredient-density conversion.'),
 metadata(427,temperatureConverter,['c','f','k'],'Algebraic Celsius/Fahrenheit/Kelvin temperature-value conversion, not temperature-interval conversion. Algebraic conversion does not establish physical feasibility; values below absolute zero are not rejected on physical grounds. Existing numerical precision and finite-result limits still apply. OWN-427 approves this product scope only; source applicability, competent QA and certification remain separate. Historical v1 is unchanged.'),
 metadata(428,speedConverter,['m_s','km_h','mph','ft_s','knot'],linear+' Knot uses one international nautical mile per hour; no travel or velocity-vector model.'),
 metadata(429,pressureConverter,['pa','kpa','mpa','bar','atm','psi'],linear+' Fixed standard-atmosphere and existing psi factors; no gauge/absolute pressure offset is inferred.'),
 metadata(430,energyConverter,['j','kj','mj','wh','kwh','cal','kcal'],linear+' cal/kcal retain the existing 4.184 J thermochemical factor; no ingredient/nutritional applicability is inferred.'),
 metadata(431,powerConverter,['w','kw','mw','hp_mech'],linear+' hp_mech is the declared mechanical-horsepower factor, not metric/electrical horsepower.'),
 metadata(432,timeConverter,['s','ms','min','h','day','week'],linear+' Fixed durations only: day=86400 seconds and week=7 fixed days; no calendar, timezone or leap-second computation.'),
 metadata(433,angleConverter,['rad','deg','grad','turn'],linear+' Radians use the existing host Math.PI representation; no arbitrary precision or orientation normalization.'),
 metadata(434,dataStorageConverter,['B','KB','MB','GB','TB','KiB','MiB','GiB'],linear+' Case-sensitive existing codes: B is byte, KB/MB/GB/TB are decimal, KiB/MiB/GiB are binary; no bit, compression or provider-pricing mode.'),
 metadata(437,densityConverter,['kg_m3','g_cm3','kg_l','lb_ft3'],linear+' lb_ft3 retains the existing international-pound/cubic-foot factor; no material-specific temperature dependence.'),
 metadata(438,forceConverter,['n','kn','dyn','lbf'],linear+' lbf retains the defined conventional standard-gravity factor; no mass/weight location model.'),
 metadata(439,torqueConverter,['n_m','kn_m','lbf_ft','lbf_in'],linear+' lbf_in and lbf_ft retain exact 12-inch geometry within the existing factor table; no tool/calibration or safety applicability is inferred.'),
 metadata(440,frequencyConverter,['hz','khz','mhz','ghz'],linear+' Scalar cycle frequency only; no angular-frequency or spectral model.'),
]);
