/** Bounded engineering applicability of existing v1 converters. No review or release approval. */
type Unit = Readonly<{symbol:string;sourceCode:string;exactBase:string}>;
const unit=(symbol:string,sourceCode:string,exactBase:string):Unit=>Object.freeze({symbol,sourceCode,exactBase});
export const conversionCompletionSource=Object.freeze({
 authority:'UCUM 2.2',path:'docs/first-live-closure-20261108/source/ucum-v2.2-native-source.zip',
 url:'https://github.com/ucum-org/ucum/releases/tag/v2.2',captureBytes:147651,
 member:'ucum-essence.xml',memberBytes:82776,memberSHA256:'dfccea1b5dc284245ebae97edd1dc03c45864da4e87df55bc9851797b4fd0b61',sha256:'2b0496305b2caa4748859667519ff7ed10dc241fcdad5d2ff0a23801457a447b',
});
const contract=(catalogId:number,baseSymbol:string,units:Record<string,Unit>,applicability:string,example:{value:string;fromUnit:string;toUnit:string})=>Object.freeze({
 catalogId,version:1 as const,baseSymbol,units:Object.freeze(units),source:conversionCompletionSource,applicability,example:Object.freeze(example),
 numericalPolicy:'Existing binary64 v1 factor ratios; no decimal rounding of native output. Presentation rounding must never replace recorded numeric output. Negative scalar values and zero are supported. Exact rational source relationships are not exact real-number output guarantees.',
 refusalPolicy:'Refuse unsupported or incorrectly cased product codes, incomplete/lossy decimal inputs, overflow, nonzero linear results lost to zero, and subnormal precision outside the existing result-trust boundary.',
 applicabilityReview:'COMPETENT_HUMAN_REVIEW_NOT_ESTABLISHED',engineeringGate:'SOURCE_SCOPED_CONTRACT_AND_PAIR_MATRIX',
});
export const conversionCompletionContracts=Object.freeze([
 contract(423,'m',{m:unit('m','m','1'),km:unit('km','km','1000'),cm:unit('cm','cm','1/100'),mm:unit('mm','mm','1/1000'),in:unit('in','[in_i]','127/5000'),ft:unit('ft','[ft_i]','381/1250'),yd:unit('yd','[yd_i]','1143/1250'),mi:unit('mi','[mi_i]','201168/125')},'International inch=.0254 m, foot=12 inches, yard=3 feet, mile=5280 feet. Product aliases explicitly exclude survey lengths.',{value:'1',fromUnit:'mi',toUnit:'km'}),
 contract(430,'J',{j:unit('J','J','1'),kj:unit('kJ','kJ','1000'),mj:unit('MJ','MJ','1000000'),wh:unit('Wh','W.h','3600'),kwh:unit('kWh','kW.h','3600000'),cal:unit('cal','cal_th','523/125'),kcal:unit('kcal','kcal_th','4184')},'Thermochemical calorie=4.184 J; watt-hour uses hour=3600 seconds. No alternate calorie or ingredient/nutrition interpretation.',{value:'10',fromUnit:'cal',toUnit:'j'}),
 contract(431,'W',{w:unit('W','W','1'),kw:unit('kW','kW','1000'),mw:unit('MW','MW','1000000'),hp_mech:unit('hp (mechanical)','[HP]','37284993579113511/50000000000000')},'Mechanical horsepower=550 international feet × conventional pound-force / second. Exact745.69987158227022 W rounds to the existing binary64 literal745.6998715822702; no metric/electrical horsepower.',{value:'1',fromUnit:'hp_mech',toUnit:'w'}),
 contract(432,'s',{s:unit('s','s','1'),ms:unit('ms','ms','1/1000'),min:unit('min','min','60'),h:unit('h','h','3600'),day:unit('d','d','86400'),week:unit('wk','wk','604800')},'Fixed durations: minute=60 s; hour=60 min; day=24 h; week=7 d. No calendar, timezone, DST or leap-second model.',{value:'1.5',fromUnit:'week',toUnit:'h'}),
 contract(438,'N',{n:unit('N','N','1'),kn:unit('kN','kN','1000'),dyn:unit('dyn','dyn','1/100000'),lbf:unit('lbf','[lbf_av]','8896443230521/2000000000000')},'Conventional pound-force=.45359237 kg ×9.80665 m/s². Dyne=g.cm/s². No local gravity, mass or weight interpretation.',{value:'1',fromUnit:'lbf',toUnit:'n'}),
 contract(440,'Hz',{hz:unit('Hz','Hz','1'),khz:unit('kHz','kHz','1000'),mhz:unit('MHz','MHz','1000000'),ghz:unit('GHz','GHz','1000000000')},'Scalar cycle frequency; Hz=s^-1 with decimal SI prefixes. No angular frequency or spectrum interpretation.',{value:'0.125',fromUnit:'mhz',toUnit:'hz'}),
]);
export function conversionCompletionUnit(catalogId:number,code:string):Unit{
 const contract=conversionCompletionContracts.find(row=>row.catalogId===catalogId);
 const result=contract?.units[code];
 if(!result)throw Error('Unsupported conversion completion unit');
 return result;
}
