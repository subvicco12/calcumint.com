import {describe,it,expect} from 'vitest';
import {buildCalculatorFirstReadiness} from './calculator-first-readiness';
const sample=()=>({catalog:[{masterId:1,title:'Example'}],ledger:[{masterId:1,implementationClass:'REGISTERED_IMPLEMENTED',canonicalAccepted:false,observedContracts:{registeredCandidates:[{currentId:'engine.example',currentVersion:1,slug:'example',basis:'RECORDED_CANDIDATE_NOT_CANONICAL_MAPPING',exactCurrentBinding:true}],privateCandidates:[]}}],requirements:[{masterId:1,canonicalMappingApproved:false,requirements:[{requirementId:'canonical-product-acceptance',status:'BLOCKED',scope:'FULL_PRODUCT_REQUIREMENT',evidence:[]}]}],registry:[{engineId:'engine.example',slug:'example',version:1,title:'Example',route:'/calculators/math/example',reviewStatus:'certified',certificationSoftwareIssues:[]}],hosted:[{calculator_key:'engine.example',slug:'example',version:1,title:'Example',lifecycle:'published'}],routes:[{slug:'example',url:'https://calcumint.com/calculators/math/example',status:200,finalUrl:'https://calcumint.com/calculators/math/example',h1:'Example',canonical:'https://calcumint.com/calculators/math/example',displayedVersion:1,inputControls:2}],hostedComplete:true});
describe('calculator-first publication evidence',()=>{
 it('records an observed live legacy binding without promoting full contract acceptance or release authority',()=>{
  const r=buildCalculatorFirstReadiness(sample());expect(r.rows[0].disposition).toBe('LIVE_VERIFIED');expect(r.rows[0].canonicalAccepted).toBe(false);expect(r.summary.eligibleToPublish).toBe(0);expect(r.releaseWave).toEqual([]);expect(r.releaseHold).toBe(true);
 });
 it.each(['FAMILY_VARIANT','UNSUPPORTED_MAPPING','SCOPE_DECISION_REQUIRED'])('never counts a %s support engine as the catalog calculator',basis=>{
  const x=sample();x.ledger[0].observedContracts.registeredCandidates[0].basis=basis;
  expect(buildCalculatorFirstReadiness(x).summary.liveCatalogBindings).toBe(0);
 });
 it('requires lifecycle, exact version, canonical URL, title, controls and HTTP observations together',()=>{
  for(const alter of [(x:ReturnType<typeof sample>)=>{x.hosted[0].version=2;},(x:ReturnType<typeof sample>)=>{x.hosted[0].lifecycle='draft';},(x:ReturnType<typeof sample>)=>{x.routes[0].status=404;},(x:ReturnType<typeof sample>)=>{x.routes[0].finalUrl='https://calcumint.com/other';},(x:ReturnType<typeof sample>)=>{x.routes[0].h1='Other';},(x:ReturnType<typeof sample>)=>{x.routes[0].canonical='https://example.com';},(x:ReturnType<typeof sample>)=>{x.routes[0].displayedVersion=2;},(x:ReturnType<typeof sample>)=>{x.routes[0].inputControls=0;}]){
   const x=sample();alter(x);expect(buildCalculatorFirstReadiness(x).summary.liveCatalogBindings).toBe(0);
  }
 });
 it('preserves authority blocks even if a support or titled engine is already public',()=>{
  const x=sample();x.ledger[0].implementationClass='CONTRACT_BLOCKED';expect(buildCalculatorFirstReadiness(x).rows[0].disposition).toBe('AUTHORITY_BLOCKED');
 });
 it('does not interpret unavailable lifecycle evidence as unpublished or draft',()=>{
  const x=sample();x.hosted=[];x.hostedComplete=false;const r=buildCalculatorFirstReadiness(x);expect(r.rows[0].candidates[0].lifecycle).toBe('UNKNOWN');expect(r.rows[0].disposition).toBe('UNKNOWN');
 });
 it('refuses duplicate identities and inconsistent ledger coverage instead of inflating counts',()=>{
  const x=sample();x.hosted.push(x.hosted[0]);expect(()=>buildCalculatorFirstReadiness(x)).toThrow(/Duplicate/);
  const y=sample();y.requirements=[];expect(()=>buildCalculatorFirstReadiness(y)).toThrow(/coverage/);
 });
});
it('cannot manufacture eligibility from accepted booleans or arbitrary evidence arrays',()=>{
 for(const blocked of [true,false]){
  const x=sample();x.ledger[0].canonicalAccepted=true;x.requirements[0].canonicalMappingApproved=true;
  x.requirements[0].requirements=[{requirementId:'all',status:'VERIFIED',scope:'FULL_PRODUCT_REQUIREMENT',evidence:[null] as never[]}];
  x.hosted=[];x.hostedComplete=false;x.registry[0].route=null as unknown as string;
  if(blocked)x.ledger[0].implementationClass='CONTRACT_BLOCKED';
  const r=buildCalculatorFirstReadiness(x);expect(r.summary.eligibleToPublish).toBe(0);expect(r.releaseWave).toEqual([]);
 }
});
it('retains duplicate titled catalog identities as unresolved instead of counting one shared engine twice',()=>{
 const x=sample();x.catalog.push({...x.catalog[0],masterId:2});x.ledger.push({...x.ledger[0],masterId:2});x.requirements.push({...x.requirements[0],masterId:2});
 const r=buildCalculatorFirstReadiness(x);expect(r.summary.liveCatalogBindings).toBe(0);expect(r.rows.map(x=>x.disposition)).toEqual(['UNKNOWN','UNKNOWN']);
});
