import { describe,expect,it } from "vitest";
import { launchDefinitions,launchSpecs } from "./launch-portfolio";
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
 it("includes the fourth catalog foundation math expansion with validation",()=>{const cases=[["fraction-calculator",{numerator:3,denominator:4},0.75],["decimal-to-fraction-calculator",{decimal:0.75,precision:2},0.75],["factor-calculator",{number:12},2]] as const;for(const [slug,input,expected] of cases){const definition=launchDefinitions.find(x=>x.slug===slug)!;expect(definition.reviewStatus).toBe("certified");expect(runCalculator(definition,input).output.result).toBeCloseTo(expected,10)}expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="fraction-calculator")!,{numerator:3,denominator:0})).toThrow();expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="decimal-to-fraction-calculator")!,{decimal:0.75,precision:1.5})).toThrow();expect(()=>runCalculator(launchDefinitions.find(x=>x.slug==="factor-calculator")!,{number:12.5})).toThrow();});
 it("publishes 100+ SEO-routable calculator pages",()=>{const pages=listPublicCalculators();expect(pages.length).toBeGreaterThanOrEqual(108);for(const page of pages){expect(page.intro.length).toBeGreaterThan(80);expect(page.faq.length).toBeGreaterThanOrEqual(2);expect(page.assumptions.length).toBeGreaterThanOrEqual(2);expect(page.keywords.length).toBeGreaterThanOrEqual(3)}});
});
