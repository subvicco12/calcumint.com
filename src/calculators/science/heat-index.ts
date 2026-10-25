/** Private review kernel. Formula port attributed to MetPy; BSD notice in docs/evidence/heat/METPY-LICENSE. */
export interface HeatIndexInput {
  temperature: number;
  temperatureUnit: "F" | "C";
  relativeHumidityPercent: number;
}
const metadata = {
  modelVersion: "MetPy-heat_index-d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05",
  source: "https://github.com/Unidata/MetPy/blob/d247e5dbbfd38291f4f2a9b3379d7881fc8d1c05/src/metpy/calc/basic.py#L235",
  limitations: [
    "Heat index represents shaded, light-wind conditions; direct sunshine and outdoor exertion can increase heat exposure. It does not model solar radiation, wind, clothing or activity.",
    "Private numerical estimate, not a medical assessment, safety threshold or assurance of safe exposure.",
    "Review scope is 80–112 F and 0–100% RH; this rectangle is an implementation guard, not a claim that the regression is validated throughout it. Extreme combinations may extrapolate beyond the underlying Steadman data.",
  ],
} as const;
export type HeatIndexResult = typeof metadata & (
  | { status: "unsupported"; reason: string }
  | { status: "supported"; heatIndex: number; heatIndexF: number; temperatureUnit: "F" | "C"; regime: "simple" | "rothfusz" | "rothfusz-low-humidity" | "rothfusz-high-humidity" }
);
export function calculateHeatIndex(input: HeatIndexInput): HeatIndexResult {
  const {temperature,temperatureUnit,relativeHumidityPercent: rh}=input;
  if (![temperature,rh].every(Number.isFinite) || !["F","C"].includes(temperatureUnit))
    return {...metadata,status:"unsupported",reason:"Finite temperature and RH with explicit F or C units are required."};
  const t=temperatureUnit === "C" ? temperature*9/5+32 : temperature;
  if(t<80 || t>112 || rh<0 || rh>100)
    return {...metadata,status:"unsupported",reason:"Outside private review domain: 80–112 F and RH 0–100%."};
  const simple=-10.3+1.1*t+0.047*rh;
  let value=simple;
  let regime: Extract<HeatIndexResult,{status:"supported"}>["regime"]="simple";
  if(simple>=79) {
    value=-42.379+2.04901523*t+10.14333127*rh-0.22475541*t*rh-0.00683783*t*t-0.05481717*rh*rh+0.00122874*t*t*rh+0.00085282*t*rh*rh-0.00000199*t*t*rh*rh;
    regime="rothfusz";
  }
  // MetPy applies these corrections after branch selection, including the simple branch.
  if(rh<=13 && t>=80 && t<=112) {
    value-=(13-rh)/4*Math.sqrt((17-Math.abs(t-95))/17);
    if(simple>=79) regime="rothfusz-low-humidity";
  }
  if(rh>85 && t>=80 && t<=87) {
    value+=0.02*(rh-85)*(87-t);
    regime="rothfusz-high-humidity";
  }
  return {...metadata,status:"supported",heatIndex:temperatureUnit === "C" ? (value-32)*5/9 : value,heatIndexF:value,temperatureUnit,regime};
}
