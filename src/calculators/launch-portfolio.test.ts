import { describe,expect,it } from "vitest";
import { getLaunchSpec,launchDefinitions,launchSpecs } from "./launch-portfolio";
import { runCalculator } from "./engine";
import { listPublicCalculators } from "./public-content";
describe("B11 launch portfolio",()=>{
 it("ships at least 100 new certified calculators",()=>{expect(launchSpecs.length).toBeGreaterThanOrEqual(100);expect(launchDefinitions.every(x=>x.reviewStatus==="certified")).toBe(true);expect(new Set(launchSpecs.map(x=>x.slug)).size).toBe(launchSpecs.length)});
 it("keeps launch formulas in standard-risk categories",()=>{expect(launchDefinitions.every(x=>x.riskClass==="standard")).toBe(true)});
 it("executes every golden default vector deterministically",()=>{for(const definition of launchDefinitions){const example=definition.examples[0];const first=runCalculator(definition,example.input).output.result;const second=runCalculator(definition,example.input).output.result;expect(Number.isFinite(first),definition.slug).toBe(true);expect(first).toBe(second)}});
 it("uses complete inputs for formerly normalized calculators",()=>{
  const cases=[
   ["trapezoid-area-calculator",{a:8,b:12,height:5},50],
   ["rectangular-prism-volume-calculator",{length:8,width:5,height:3},120],
   ["z-score-calculator",{value:85,mean:75,sd:10},1],
   ["heat-energy-calculator",{mass:2,specificHeat:4186,deltaT:10},83720]
  ] as const;
  for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}
 });
 it("includes the first catalog foundation math expansion with verified vectors",()=>{
  const cases=[
   ["percentage-increase-calculator",{value:100,percent:20},120],
   ["percentage-decrease-calculator",{value:100,percent:20},80],
   ["percent-error-calculator",{observed:98,actual:100},2],
   ["pythagorean-theorem-calculator",{a:3,b:4},5]
  ] as const;
  for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(definition.reviewStatus).toBe("certified");expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}
 });
 it("includes the second catalog foundation math expansion with validation",()=>{
  const cases=[
   ["exponent-calculator",{base:3,exponent:4},81],
   ["logarithm-calculator",{x:100,base:10},2],
   ["scientific-notation-calculator",{coefficient:3.2,exponent:6},3200000],
   ["rounding-calculator",{value:123.4567,decimals:2},123.46]
  ] as const;
  for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(definition.reviewStatus).toBe("certified");expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}
  const log=launchDefinitions.find(x=>x.slug==="logarithm-calculator")!;
  expect(()=>runCalculator(log,{x:100,base:1})).toThrow();
  const rounding=launchDefinitions.find(x=>x.slug==="rounding-calculator")!;
  expect(()=>runCalculator(rounding,{value:12.34,decimals:1.5})).toThrow();
 });
 it("includes the third catalog foundation math and geometry expansion with validation",()=>{
  const cases=[
   ["fraction-to-decimal-calculator",{numerator:3,denominator:4},0.75],
   ["lcm-calculator",{a:12,b:18},36],
   ["gcf-calculator",{a:48,b:18},6],
   ["polygon-area-calculator",{sides:6,side:4},41.569219381653056]
  ] as const;
  for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(definition.reviewStatus).toBe("certified");expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}
  expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="fraction-to-decimal-calculator")!,{numerator:3,denominator:0})).toThrow();
  expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="lcm-calculator")!,{a:12.5,b:18})).toThrow();
  expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="gcf-calculator")!,{a:0,b:18})).toThrow();
  expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="polygon-area-calculator")!,{sides:2,side:4})).toThrow();
  expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="polygon-area-calculator")!,{sides:6.5,side:4})).toThrow();
 });
 it("includes the fourth catalog foundation math expansion with validation",()=>{const cases=[["fraction-calculator",{numerator:3,denominator:4},0.75],["decimal-to-fraction-calculator",{decimal:0.75,precision:2},0.75],["factor-calculator",{number:12},2]] as const;for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(definition.reviewStatus).toBe("certified");expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="fraction-calculator")!,{numerator:3,denominator:0})).toThrow();expect(getLaunchSpec("decimal-to-fraction-calculator")?.formatResult?.({decimal:0.75,precision:2},0.75)).toBe("3/4");expect(getLaunchSpec("decimal-to-fraction-calculator")?.formatResult?.({decimal:-1.25,precision:2},-1.25)).toBe("-5/4");expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="decimal-to-fraction-calculator")!,{decimal:0.75,precision:1.5})).toThrow();expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="decimal-to-fraction-calculator")!,{decimal:0.75,precision:309})).toThrow();expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="factor-calculator")!,{number:1})).toThrow();expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="factor-calculator")!,{number:12.5})).toThrow();expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="factor-calculator")!,{number:1_000_000_001})).toThrow();});
 it("keeps the certified two-number average stable at finite extremes",()=>{const definition=launchDefinitions.find(x=>x.slug==="average-two-numbers-calculator")!;expect(runCalculator(definition,{a:Number.MAX_VALUE,b:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE);expect(runCalculator(definition,{a:Number.MIN_VALUE,b:Number.MIN_VALUE}).output.result).toBe(Number.MIN_VALUE)});
 it("keeps the certified weighted average finite at maximum inputs",()=>{const definition=launchDefinitions.find(x=>x.slug==="weighted-average-two-values-calculator")!;expect(runCalculator(definition,{a:Number.MAX_VALUE,b:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE);expect(runCalculator(definition,{a:Number.MIN_VALUE,b:Number.MIN_VALUE}).output.result).toBe(Number.MIN_VALUE)});
 it("keeps the certified midrange stable at finite extremes",()=>{const definition=launchDefinitions.find(x=>x.slug==="midrange-calculator")!;expect(runCalculator(definition,{min:Number.MAX_VALUE,max:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE);expect(runCalculator(definition,{min:Number.MIN_VALUE,max:Number.MIN_VALUE}).output.result).toBe(Number.MIN_VALUE)});
 it("keeps the certified linear midpoint stable at finite extremes",()=>{const definition=launchDefinitions.find(x=>x.slug==="linear-interpolation-midpoint-calculator")!;expect(runCalculator(definition,{a:10,b:30}).output.result).toBe(20);expect(runCalculator(definition,{a:-Number.MAX_VALUE,b:Number.MAX_VALUE}).output.result).toBe(0);expect(runCalculator(definition,{a:Number.MAX_VALUE,b:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE);expect(runCalculator(definition,{a:Number.MIN_VALUE,b:Number.MIN_VALUE}).output.result).toBe(Number.MIN_VALUE)});
 it("keeps certified rectangle perimeter finite when the side sum would overflow",()=>{const definition=launchDefinitions.find(x=>x.slug==="rectangle-perimeter-calculator")!;expect(runCalculator(definition,{length:10,width:5}).output.result).toBe(30);const side=Number.MAX_VALUE/4;expect(side+side).toBe(Number.MAX_VALUE/2);expect(runCalculator(definition,{length:side,width:side}).output.result).toBe(Number.MAX_VALUE)});
 it("keeps certified triangle area finite when the product would overflow before halving",()=>{const definition=launchDefinitions.find(x=>x.slug==="triangle-area-calculator")!;expect(runCalculator(definition,{base:10,height:6}).output.result).toBe(30);expect(Number.MAX_VALUE*2).toBe(Infinity);expect(runCalculator(definition,{base:Number.MAX_VALUE,height:2}).output.result).toBe(Number.MAX_VALUE)});
 it("keeps certified radians-to-degrees finite when multiplying by 180 would overflow",()=>{const definition=launchDefinitions.find(x=>x.slug==="radians-to-degrees-calculator")!;expect(runCalculator(definition,{radians:Math.PI}).output.result).toBe(180);const boundary=Number.MAX_VALUE/180;const radians=boundary+Number.EPSILON*boundary;expect(Number.isFinite(radians)).toBe(true);expect(radians*180).toBe(Infinity);expect(runCalculator(definition,{radians}).output.result).toBe(radians/Math.PI*180)});
 it("keeps certified degrees-to-radians finite when multiplying by pi would overflow",()=>{const definition=launchDefinitions.find(x=>x.slug==="degrees-to-radians-calculator")!;expect(runCalculator(definition,{degrees:180}).output.result).toBe(Math.PI);expect(runCalculator(definition,{degrees:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE/180*Math.PI)});
 it("keeps certified trapezoid area finite when the parallel-side sum overflows",()=>{const definition=launchDefinitions.find(x=>x.slug==="trapezoid-area-calculator")!;expect(runCalculator(definition,{a:8,b:12,height:5}).output.result).toBe(50);expect(runCalculator(definition,{a:Number.MAX_VALUE,b:Number.MAX_VALUE,height:1}).output.result).toBe(Number.MAX_VALUE)});
 it("keeps certified centripetal acceleration finite when squaring would overflow",()=>{const definition=launchDefinitions.find(x=>x.slug==="centripetal-acceleration-calculator")!;expect(runCalculator(definition,{velocity:10,radius:5}).output.result).toBe(20);expect(runCalculator(definition,{velocity:Number.MAX_VALUE,radius:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE)});
 it("keeps the certified z-score finite across opposite maximum inputs",()=>{const definition=launchDefinitions.find(x=>x.slug==="z-score-calculator")!;expect(runCalculator(definition,{value:85,mean:75,sd:10}).output.result).toBe(1);expect(runCalculator(definition,{value:Number.MAX_VALUE,mean:-Number.MAX_VALUE,sd:Number.MAX_VALUE}).output.result).toBe(2)});
 it("keeps the certified percent error finite across opposite maximum inputs",()=>{const definition=launchDefinitions.find(x=>x.slug==="percent-error-calculator")!;expect(runCalculator(definition,{observed:98,actual:100}).output.result).toBe(2);expect(runCalculator(definition,{observed:-Number.MAX_VALUE,actual:Number.MAX_VALUE}).output.result).toBe(200)});
 it("keeps the certified percentage change finite across opposite maximum inputs",()=>{const definition=launchDefinitions.find(x=>x.slug==="percentage-change-calculator")!;expect(runCalculator(definition,{old:100,next:125}).output.result).toBe(25);expect(runCalculator(definition,{old:Number.MAX_VALUE,next:-Number.MAX_VALUE}).output.result).toBe(-200)});
 it("keeps the certified relative difference finite at opposite maximum inputs",()=>{const definition=launchDefinitions.find(x=>x.slug==="relative-difference-calculator")!;expect(runCalculator(definition,{a:100,b:110}).output.result).toBeCloseTo(9.523809523809524,10);expect(runCalculator(definition,{a:Number.MAX_VALUE,b:-Number.MAX_VALUE}).output.result).toBe(200)});
 it("keeps the certified harmonic mean finite at maximum inputs",()=>{const definition=launchDefinitions.find(x=>x.slug==="harmonic-mean-two-values-calculator")!;expect(runCalculator(definition,{a:60,b:40}).output.result).toBe(48);expect(runCalculator(definition,{a:Number.MAX_VALUE,b:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE)});
 it("keeps the certified geometric mean finite across supported extremes",()=>{const definition=launchDefinitions.find(x=>x.slug==="geometric-mean-two-values-calculator")!;expect(runCalculator(definition,{a:Number.MAX_VALUE,b:Number.MAX_VALUE}).output.result).toBe(Number.MAX_VALUE);expect(runCalculator(definition,{a:0,b:Number.MAX_VALUE}).output.result).toBe(0);expect(runCalculator(definition,{a:4,b:9}).output.result).toBe(6);expect(runCalculator(definition,{a:Number.MIN_VALUE,b:Number.MIN_VALUE}).output.result).toBe(Number.MIN_VALUE)});
 it("publishes 100+ SEO-routable calculator pages",()=>{const pages=listPublicCalculators();expect(pages.length).toBeGreaterThanOrEqual(108);for(const page of pages){expect(page.intro.length).toBeGreaterThan(80);expect(page.faq.length).toBeGreaterThanOrEqual(2);expect(page.assumptions.length).toBeGreaterThanOrEqual(2);expect(page.keywords.length).toBeGreaterThanOrEqual(3)}});
});
