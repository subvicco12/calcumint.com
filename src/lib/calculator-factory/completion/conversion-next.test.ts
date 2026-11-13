import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {conversionCompletionSource} from './conversion-contracts';
import {expect,it} from 'vitest';
import {conversionNextContracts,conversionNextFixtures,getConversionNextWorkflows,area424Applicability} from './conversion-next';
// Independent defining relationships; legacy rounded factors have declared bounded error.
const inch=.0254,foot=12*inch,pound=.45359237,lbf=pound*9.80665,gallon=231*inch**3;
const factors:Record<number,Record<string,number>>={429:{pa:1,kpa:1000,mpa:1e6,bar:1e5,atm:101325,psi:lbf/inch**2},436:{ml:1,l:1000,tsp_us:gallon*1e6/768,tbsp_us:gallon*1e6/256,fl_oz_us:gallon*1e6/128,cup_us:gallon*1e6/16,pint_us:gallon*1e6/8,quart_us:gallon*1e6/4,gallon_us:gallon*1e6},437:{kg_m3:1,g_cm3:1000,kg_l:1000,lb_ft3:pound/foot**3},439:{n_m:1,kn_m:1000,lbf_ft:lbf*foot,lbf_in:lbf*inch}};
it.each([429,436,437,439])('checks every directed pair against source-derived quantities for %i',id=>{
 const contract=conversionNextContracts.find(row=>row.catalogId===id)!;
 for(const [fromUnit,from] of Object.entries(factors[id]))for(const [toUnit,to] of Object.entries(factors[id]))for(const value of ['-2.5','0','1','17.125']){
  const expected=Number(value)*from/to;
  const actual=contract.execute({value,fromUnit,toUnit}).output.result as number;
  const tolerance=id===436?8e-7:id===439?4e-15:2e-13;
  expect(Math.abs(actual-expected)).toBeLessThanOrEqual(Math.max(Number.MIN_VALUE,Math.abs(expected)*tolerance));
 }
});
it('preserves private exact decimal strings and reciprocal fuel semantics',()=>{
 const fuel=conversionNextContracts.find(row=>row.catalogId===435)!;
 expect(fuel.registered).toBe(false);
 expect(fuel.execute({value:'5',fromUnit:'l_per_100km',toUnit:'km_per_l'}).output.result).toBe('20');
 expect(fuel.execute({value:'1',fromUnit:'mpg_us',toUnit:'mpg_imp'}).output.result).toBe('1.200949925504854929674409234628198');
 const resolution=conversionNextContracts.find(row=>row.catalogId===441)!;
 expect(resolution.execute({value:'1',fromUnit:'dppx',toUnit:'dpi'}).output.result).toBe('96');
 expect(resolution.execute({value:'1',fromUnit:'dpcm',toUnit:'dpi'}).output.result).toBe('2.54');
 for(const value of ['0','-1','NaN','1e2','1junk'])expect(()=>fuel.execute({value,fromUnit:'km_per_l',toUnit:'l_per_100km'})).toThrow();
});
it.each(conversionNextFixtures)('binds local raw replay and exports to exact identity $catalogId',fixture=>{
 const workflows=getConversionNextWorkflows(fixture.catalogId),packet=workflows.execute(fixture.input);
 expect(workflows.replay(JSON.stringify(packet))).toEqual(packet);
 expect(JSON.parse(workflows.exportPacket(packet,'json','pro'))).toEqual(packet);
 expect(()=>workflows.exportPacket(packet,'json','free')).toThrow();
 expect(()=>workflows.replay(JSON.stringify({...packet,raw:fixture.edit}))).toThrow();
 expect(()=>workflows.execute({...fixture.input,extra:'1'})).toThrow();
 expect(()=>workflows.execute({...fixture.input,toUnit:'UNSUPPORTED'})).toThrow();
});
it.each([429,436,437,439])('refuses incomplete/lossy decimals and range losses at new captures %i',id=>{
 const c=conversionNextContracts.find(row=>row.catalogId===id)!;
 const fromUnit=c.fields[1].options![0],toUnit=c.fields[1].options![1];
 for(const value of ['NaN','Infinity','1junk','0.10000000000000001','1e-999','5e-324'])expect(()=>c.execute({value,fromUnit,toUnit})).toThrow();
 expect(()=>c.execute({value:'1e308',fromUnit:toUnit,toUnit:fromUnit})).toThrow();
});
it('distinguishes established acre source fact from CSS full-text blocker',()=>{
 expect(area424Applicability.status).toBe('SOURCE_ESTABLISHED_INTERNATIONAL_ACRE_MAPPING');
 expect(conversionNextContracts.find(row=>row.catalogId===441)!.limitations.join(' ')).toContain('full-text');
});

it('pins the retained authoritative UCUM bytes for these derived relationships',()=>{const bytes=readFileSync(conversionCompletionSource.path);expect(bytes.length).toBe(conversionCompletionSource.captureBytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(conversionCompletionSource.sha256);});

it('retains official NIST international acre separately from survey acre and matches immutable v1',async()=>{
 const manifest=JSON.parse(readFileSync('docs/milestone60-20261113/sources/nist-international-acre-manifest.json','utf8'));
 for(const file of manifest.files){const bytes=readFileSync(file.path);expect(bytes.length).toBe(file.bytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(file.sha256);}
 const html=manifest.files.find((file:{path:string})=>file.path.endsWith('.html'));
 expect(html.representation).toBe('SANITIZED_RENDERED_HTML_DERIVATIVE');expect(html.redactionCount).toBe(1);
 expect(html.sha256).toBe('9f3a70faef0fc6039f9fb3c5731251eedcde1a7eb98265dea3e0891ed7aa93ef');
 expect(manifest.originalRawRetention).toMatchObject({bytes:90304,sha256:'1678d7b0a98a1e38b7b3c238849258ed355ef80379e86a792f46e4ef7966537c',location:'LOCAL_OUTSIDE_GIT'});
 const derivative=readFileSync(html.path,'utf8');expect(derivative).toContain('[REDACTED_THIRD_PARTY_PUBLISHER_TOKEN]');expect(derivative).not.toMatch(/(?:pk|sk)\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/);

 const text=readFileSync('docs/milestone60-20261113/sources/nist-international-acre.md','utf8');
 expect(text).toContain('International foot metric equivalent');
 expect(text).toContain('4046.856 422 4 m2');expect(text).toContain('43,560');
 const {conversionWaveContract}=await import('@/lib/completion-wave-20261113/conversion-workflows');
 const {runConversionFactoryCalculation}=await import('../cohorts/conversions');
 const contract=conversionWaveContract(424);
 if(!('mappingStatus' in contract))throw Error('International acre source mapping must remain explicit');expect(contract.mappingStatus).toBe('SOURCE_RELATIONSHIPS_ESTABLISHED');expect(contract.sourceStatus).toBe('PARTIAL_FORMAL_APPLICABILITY_REVIEW_REMAINS');expect(contract.reviewStatus).toBe('COMPETENT_REVIEW_PENDING');
 expect(contract.reviewStatus).toBe('COMPETENT_REVIEW_PENDING');
 expect(contract.additionalSource?.full424Completion).toBe(false);
 const result=runConversionFactoryCalculation({catalogId:424,version:1,input:{value:'1',fromUnit:'acre',toUnit:'m2'}});
 expect(result.output.result).toBe(4046.8564224);
 // Independent exact integer relationship: 43560 × (381/1250)^2 m².
 expect(43560n*381n*381n*10000000n).toBe(40468564224n*1250n*1250n);
});
