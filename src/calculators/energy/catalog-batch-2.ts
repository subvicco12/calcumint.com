import { z } from "zod";
import type { CalculatorDefinition } from "../types";

type Out={energyKwh:number;cost:number;steps:readonly string[]};
type HomeOut={dailyEnergyKwh:number;periodEnergyKwh:number;periodCost:number;steps:readonly string[]};
const nonnegative=z.number().finite().nonnegative().max(1e12);
const positive=z.number().finite().positive().max(1e12);
const doe={label:"U.S. Department of Energy — Estimating Appliance and Home Electronic Energy Use",url:"https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use",note:"DOE describes estimating energy consumption from appliance wattage and operating time and calculating annual operating cost from kWh consumption and electricity rate."};
const base={category:"everyday",version:1,riskClass:"standard" as const,reviewStatus:"draft" as const,jurisdictions:[{country:"GLOBAL"}]};
const finite=(v:number)=>{if(!Number.isFinite(v))throw new Error("Calculated result is outside the supported finite range");return v};

export const applianceRunningCostCalculator:CalculatorDefinition<{powerWatts:number;hoursUsed:number;ratePerKwh:number},Out>={
 ...base,id:"energy.appliance-running-cost",slug:"appliance-running-cost-calculator",title:"Appliance Running Cost Calculator",
 inputSchema:z.object({powerWatts:nonnegative,hoursUsed:nonnegative,ratePerKwh:nonnegative}),
 calculate:x=>{z.object({powerWatts:nonnegative,hoursUsed:nonnegative,ratePerKwh:nonnegative}).parse(x);const energyKwh=finite(x.powerWatts*x.hoursUsed/1000);const cost=finite(energyKwh*x.ratePerKwh);return{energyKwh,cost,steps:[`Energy = ${energyKwh} kWh`,`Cost = ${cost}`]};},
 formulas:[{id:"appliance-energy",expression:"energy kWh = power W × hours ÷ 1000",description:"Convert appliance power and runtime to electrical energy."},{id:"appliance-cost",expression:"cost = energy kWh × rate per kWh",description:"Apply a user-supplied electricity rate to calculated energy."}],
 sources:[doe],examples:[{label:"1500 W for 2 h at 0.25 per kWh",input:{powerWatts:1500,hoursUsed:2,ratePerKwh:.25},expected:{energyKwh:3,cost:.75,steps:["Energy = 3 kWh","Cost = 0.75"]}}],goldenTests:[{label:"appliance energy and cost",input:{powerWatts:1500,hoursUsed:2,ratePerKwh:.25},expected:{energyKwh:3,cost:.75}}]
};

export const homeEnergyConsumptionCalculator:CalculatorDefinition<{averagePowerWatts:number;hoursPerDay:number;days:number;ratePerKwh:number},HomeOut>={
 ...base,id:"energy.home-energy-consumption",slug:"home-energy-consumption-calculator",title:"Home Energy Consumption Calculator",
 inputSchema:z.object({averagePowerWatts:nonnegative,hoursPerDay:z.number().finite().min(0).max(24),days:positive.max(366),ratePerKwh:nonnegative}),
 calculate:x=>{z.object({averagePowerWatts:nonnegative,hoursPerDay:z.number().finite().min(0).max(24),days:positive.max(366),ratePerKwh:nonnegative}).parse(x);const dailyEnergyKwh=finite(x.averagePowerWatts*x.hoursPerDay/1000);const periodEnergyKwh=finite(dailyEnergyKwh*x.days);const periodCost=finite(periodEnergyKwh*x.ratePerKwh);return{dailyEnergyKwh,periodEnergyKwh,periodCost,steps:[`Daily energy = ${dailyEnergyKwh} kWh`,`Period energy = ${periodEnergyKwh} kWh`,`Period cost = ${periodCost}`]};},
 formulas:[{id:"home-energy",expression:"daily kWh = average power W × hours/day ÷ 1000; period kWh = daily kWh × days",description:"Estimate household energy from an explicitly supplied average load and usage duration."},{id:"home-energy-cost",expression:"period cost = period kWh × rate per kWh",description:"Apply a user-supplied electricity rate to estimated period energy."}],
 sources:[doe],examples:[{label:"500 W average for 12 h/day over 30 days",input:{averagePowerWatts:500,hoursPerDay:12,days:30,ratePerKwh:.2},expected:{dailyEnergyKwh:6,periodEnergyKwh:180,periodCost:36,steps:["Daily energy = 6 kWh","Period energy = 180 kWh","Period cost = 36"]}}],goldenTests:[{label:"30-day household estimate",input:{averagePowerWatts:500,hoursPerDay:12,days:30,ratePerKwh:.2},expected:{dailyEnergyKwh:6,periodEnergyKwh:180,periodCost:36}}]
};

export const energyEnvironmentCatalogBatch1Definitions=[applianceRunningCostCalculator,homeEnergyConsumptionCalculator] as const;
