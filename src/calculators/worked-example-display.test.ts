import {expect,it} from 'vitest';
import {calculatorRegistry} from './registry';
import {runCalculator} from './engine';
import {goldenMismatch} from './launch-certification';

// Literal display witnesses checked against the cited formulas and binary64 model.
// Scalar expectations remain the existing independently derived mathematical goldens.
const displays = [
  [
    "earthquake-energy-calculator",
    "Earthquake Energy = 1995262314968.8845"
  ],
  [
    "thermal-strain-calculator",
    "Thermal Strain = 0.0006000000000000001"
  ],
  [
    "thermal-expansion-calculator",
    "Linear Thermal Expansion = 0.0012000000000000001"
  ],
  [
    "helical-spring-deflection-calculator",
    "Helical Spring Deflection = 0.020000000000000004"
  ],
  [
    "rectangular-section-bending-stress-calculator",
    "Rectangular Section Bending Stress = 1499999.9999999995"
  ],
  [
    "rectangular-section-modulus-calculator",
    "Rectangular Section Modulus = 0.0006666666666666669"
  ],
  [
    "circle-chord-length-calculator",
    "Circle Chord Length = 4.999999999999999"
  ],
  [
    "regular-polygon-apothem-calculator",
    "Regular Polygon Apothem = 1.7320508075688774"
  ],
  [
    "regular-polygon-circumradius-calculator",
    "Regular Polygon Circumradius = 2.0000000000000004"
  ],
  [
    "parallelogram-height-calculator",
    "Parallelogram Height = 1.9999999999999998"
  ],
  [
    "spherical-cap-volume-calculator",
    "Spherical Cap Volume = 54.454272662223076"
  ],
  [
    "spherical-sector-volume-calculator",
    "Spherical Sector Volume = 104.71975511965977"
  ],
  [
    "hemisphere-volume-calculator",
    "Hemisphere Volume = 56.54866776461627"
  ],
  [
    "spherical-segment-volume-calculator",
    "Spherical Segment Volume = 494.27724416479407"
  ],
  [
    "hollow-cylinder-surface-area-calculator",
    "Hollow Cylinder Surface Area = 188.4955592153876"
  ],
  [
    "rectangular-pyramid-surface-area-calculator",
    "Rectangular Pyramid Surface Area = 49.03610743922462"
  ],
  [
    "regular-hexagonal-prism-volume-calculator",
    "Regular Hexagonal Prism Volume = 51.96152422706632"
  ],
  [
    "regular-polygonal-prism-volume-calculator",
    "Regular Polygonal Prism Volume = 51.96152422706632"
  ],
  [
    "tire-size-calculator",
    "Diameter difference = 2.979662620211271%"
  ]
] as const;
it.each(displays)('keeps %s worked-example step text consistent with its display contract', (slug,display)=>{
 const definition=calculatorRegistry.getBySlug(slug)!;
 const example=definition.examples[0];
 const output=runCalculator(definition,example.input).output as {steps:string[]};
 const expected=example.expected as {steps:string[]};
 const index=slug==='tire-size-calculator'?2:0;
 expect(output.steps[index]).toBe(display);
 expect(expected.steps[index]).toBe(display);
 // Compare every step exactly; do not hide binary64 differences behind numeric tolerance.
 expect(output.steps).toEqual(expected.steps);
 expect(goldenMismatch(runCalculator(definition,example.input).output,example.expected)).toBeNull();
 if(slug!=='tire-size-calculator')expect((example.expected as {value:number}).value).toBe((definition.goldenTests![0].expected as {value:number}).value);
});

// Independent high-precision multiplication of exact binary operands. This does
// not import the implementation's integer-significand product helper.
import Decimal from 'decimal.js';
const D=Decimal.clone({precision:100});
const product=(...xs:number[])=>xs.reduce((a,x)=>a.mul(new D('0b'+x.toString(2))),new D(1)).toNumber();
const energy=10**(1.5*5+4.8),scaledEnergy=energy*1e6;
const witnesses=[
 Math.floor(scaledEnergy+0.5+Number.EPSILON*scaledEnergy*4)/1e6,
 0.000012*50,
 2*0.000012*50,
 8*100*0.05**3*10/(80000000000*0.005**4),
 6*1000/(0.1*0.2**2),
 0.1*0.2**2/6,
 10*Math.sin(Math.PI/6),
 2/(2*Math.tan(Math.PI/6)),
 2/(2*Math.sin(Math.PI/6)),
 4*Math.sin(Math.PI/6),
 product(Math.PI,2,2,5-2/3),
 product(2*Math.PI/3,5,5,2),
 product(2*Math.PI/3,3,3,3),
 product(Math.PI/6,8,3*(9+9)+8*8),
 product(2*Math.PI,5,5)+product(2*Math.PI,1,5),
 product(4,3)+product(4,Math.hypot(5,1.5))+product(3,Math.hypot(5,2)),
 product(3*Math.sqrt(3)/2,2,2,5),
 product(6/(4*Math.tan(Math.PI/6)),2,2,5),
 (653.2-634.3)/634.3*100,
];
it('derives the exact display witnesses from independently substituted formula operands',()=>{
 expect(witnesses).toHaveLength(displays.length);
 for(let i=0;i<witnesses.length;i++)expect(String(witnesses[i])).toBe(displays[i][1].split(' = ')[1].replace('%',''));
});
