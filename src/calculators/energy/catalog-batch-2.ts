import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type Out={energyKwh:number;cost:number;steps:readonly string[]};
type HomeOut={dailyEnergyKwh:number;monthlyEnergyKwh:number;monthlyCost:number;steps:readonly string[]};
const nonnegative=z.number().finite().nonnegative().max(1e12);
const positive=z.number().finite().positive().max(1e12);
const nist={label:"NIST Guide to the SI — energy conversion factors",url:"https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9",note:"NIST lists 1 kWh = 3.6 MJ and 1 Wh = 3.6 kJ, supporting watt-hour and kilowatt-hour unit conversion."};
const doe={label:"U.S. Department of Energy — Energy Efficiency at Home",url:"https://www1.eere.energy.gov/education/pdfs/lesson301.pdf",note:"DOE educational guidance gives kWh = wattage × hours used ÷ 1000 for appliance energy consumption."};
const base={category:"everyday",version:1,riskClass:"standard" as const,reviewStatus:"draft" as const,jurisdictions:[{country:"GLOBAL"}]};
const finite=(v:number)=>{if(!Number.isFinite(v))throw new Error("Calculated result is outside the supported finite range");return v};

export const electricityCostCalculator:CalculatorDefinition<{energyKwh:number;ratePerKwh:number},Out>={
 ...base,id:"energy.electricity-cost",slug:"electricity-cost-calculator",title:"Electricity Cost Calculator",
 inputSchema:z.object({energyKwh:nonnegative,ratePerKwh:nonnegative}),
 calculate:x=>{const cost=finite(x.energyKwh*x.ratePerKwh);return{energyKwh:x.energyKwh,cost,steps:[`Energy = ${x.energyKwh} kWh`,`Cost = ${cost}`]};},
 formulas:[{id:"electricity-cost",expression:"cost = energy kWh × rate per kWh",description:"Calculate electricity cost from metered energy consumption and a user-supplied unit rate."}],
 sources:[nist],examples:[{label:"250 kWh at 0.20 per kWh",input:{energyKwh:250,ratePerKwh:.2},expected:{energyKwh:250,cost:50,steps:["Energy = 250 kWh","Cost = 50"]}}],goldenTests:[{label:"direct energy cost",input:{energyKwh:250,ratePerKwh:.2},expected:{energyKwh:250,cost:50}}]
};

export const applianceRunningCostCalculator:CalculatorDefinition<{powerWatts:number;hoursUsed:number;ratePerKwh:number},Out>={
 ...base,id:"energy.appliance-running-cost",slug:"appliance-running-cost-calculator",title:"Appliance Running Cost Calculator",
 inputSchema:z.object({powerWatts:nonnegative,hoursUsed:nonnegative,ratePerKwh:nonnegative}),
 calculate:x=>{const energyKwh=finite(x.powerWatts*x.hoursUsed/1000);const cost=finite(energyKwh*x.ratePerKwh);return{energyKwh,cost,steps:[`Energy = ${energyKwh} kWh`,`Cost = ${cost}`]};},
 formulas:[{id:"appliance-energy",expression:"energy kWh = power W × hours ÷ 1000",description:"Convert appliance power and runtime to electrical energy."},{id:"appliance-cost",expression:"cost = energy kWh × rate per kWh",description:"Apply a user-supplied electricity rate to calculated energy."}],
 sources:[doe,nist],examples:[{label:"1500 W for 2 h at 0.20 per kWh",input:{powerWatts:1500,hoursUsed:2,ratePerKwh:.2},expected:{energyKwh:3,cost:.6,steps:["Energy = 3 kWh","Cost = 0.6000000000000001"]}}],goldenTests:[{label:"appliance energy and cost",input:{powerWatts:1500,hoursUsed:2,ratePerKwh:.2},expected:{energyKwh:3,cost:.6000000000000001}}]
};

export const homeEnergyConsumptionCalculator:CalculatorDefinition<{averagePowerWatts:number;hoursPerDay:number;days:number;ratePerKwh:number},HomeOut>={
 ...base,id:"energy.home-energy-consumption",slug:"home-energy-consumption-calculator",title:"Home Energy Consumption Calculator",
 inputSchema:z.object({averagePowerWatts:nonnegative,hoursPerDay:z.number().finite().min(0).max(24),days:positive.max(366),ratePerKwh:nonnegative}),
 calculate:x=>{const dailyEnergyKwh=finite(x.averagePowerWatts*x.hoursPerDay/1000);const monthlyEnergyKwh=finite(dailyEnergyKwh*x.days);const monthlyCost=finite(monthlyEnergyKwh*x.ratePerKwh);return{dailyEnergyKwh,monthlyEnergyKwh,monthlyCost,steps:[`Daily energy = ${dailyEnergyKwh} kWh`,`Period energy = ${monthlyEnergyKwh} kWh`,`Period cost = ${monthlyCost}`]};},
 formulas:[{id:"home-energy",expression:"daily kWh = average power W × hours/day ÷ 1000; period kWh = daily kWh × days",description:"Estimate household energy from an explicitly supplied average load and usage duration."},{id:"home-energy-cost",expression:"period cost = period kWh × rate per kWh",description:"Apply a user-supplied electricity rate to estimated period energy."}],
 sources:[doe,nist],examples:[{label:"500 W average for 12 h/day over 30 days",input:{averagePowerWatts:500,hoursPerDay:12,days:30,ratePerKwh:.2},expected:{dailyEnergyKwh:6,monthlyEnergyKwh:180,monthlyCost:36,steps:["Daily energy = 6 kWh","Period energy = 180 kWh","Period cost = 36"]}}],goldenTests:[{label:"30-day household estimate",input:{averagePowerWatts:500,hoursPerDay:12,days:30,ratePerKwh:.2},expected:{dailyEnergyKwh:6,monthlyEnergyKwh:180,monthlyCost:36}}]
};

export const energyEnvironmentCatalogBatch1Definitions=[electricityCostCalculator,applianceRunningCostCalculator,homeEnergyConsumptionCalculator] as const;
