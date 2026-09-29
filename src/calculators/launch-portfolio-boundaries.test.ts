import { describe, expect, it } from "vitest";
import { getLaunchSpec, launchDefinition } from "./launch-portfolio";

const definition=(slug:string)=>{
  const spec=getLaunchSpec(slug);
  if(!spec)throw new Error(`Missing launch spec: ${slug}`);
  return launchDefinition(spec);
};

describe("launch portfolio numeric boundaries",()=>{
  const invalidCases=[
    ["percentage-change-calculator",{old:0,next:1}],
    ["ratio-calculator",{a:1,b:0}],
    ["proportion-calculator",{a:1,b:0}],
    ["reciprocal-calculator",{x:0}],
    ["remainder-calculator",{a:1,b:0}],
    ["odds-from-probability-calculator",{p:100,scale:1}],
    ["growth-factor-calculator",{old:0,next:1}],
    ["slope-calculator",{rise:1,run:0}],
    ["inverse-variation-calculator",{k:1,x:0}],
    ["probability-complement-calculator",{p:101,whole:100}],
    ["probability-complement-calculator",{p:35,whole:101}],
    ["expected-value-two-outcome-calculator",{value:1,probability:101}],
    ["coverage-rate-calculator",{covered:101,total:100}],
    ["completion-rate-calculator",{complete:101,total:100}],
    ["error-rate-calculator",{errors:101,total:100}],
    ["success-rate-calculator",{successes:101,total:100}],
    ["sample-proportion-calculator",{successes:101,sample:100}],
    ["probability-complement-calculator",{p:60,whole:50}],
    ["efficiency-calculator",{output:101,input:100}],
    ["discount-amount-calculator",{price:100,percent:101}],
    ["sale-price-calculator",{price:100,percent:101}],
  ] as const;
  for(const [slug,input] of invalidCases){
    it(`${slug} rejects an invalid denominator/domain boundary`,()=>{
      expect(definition(slug).inputSchema.safeParse(input).success).toBe(false);
    });
  }
  it("fails closed when an otherwise valid calculation overflows",()=>{
    const d=definition("exponential-calculator");
    const parsed=d.inputSchema.parse({x:1000});
    expect(()=>d.calculate(parsed,{})).toThrow("outside the supported finite range");
  });
});
