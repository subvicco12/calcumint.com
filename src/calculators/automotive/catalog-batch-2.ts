import { z } from "zod";
import type { CalculatorDefinition } from "../types";
import { roundTo } from "../precision";

type Out={value:number;steps:readonly string[]};
const positive=z.number().finite().positive().max(1e12);
const nonnegative=z.number().finite().nonnegative().max(1e12);
const source={label:"U.S. Department of Energy — FuelEconomy.gov",url:"https://www.fueleconomy.gov/",note:"Fuel economy and trip fuel use vary with vehicle and operating conditions. These DRAFT calculators use explicit user-supplied distance and fuel quantities."};
const mk=<I>(id:string,slug:string,title:string,schema:z.ZodType<I>,calc:(x:I)=>number,expression:string,description:string,example:I,expected:number)=>({id,slug,title,category:"everyday",version:1,riskClass:"standard" as const,reviewStatus:"draft" as const,inputSchema:schema,calculate:(input:I)=>{const value=roundTo(calc(input),6);if(!Number.isFinite(value))throw new Error("Calculated result is outside the supported finite range");return{value,steps:[title.replace(" Calculator","")+" = "+value]}},formulas:[{id:slug,expression,description}],sources:[source],examples:[{label:"Reference example",input:example,expected:{value:expected,steps:[title.replace(" Calculator","")+" = "+expected]}}],goldenTests:[{label:"Reference example",input:example,expected:{value:expected}}],jurisdictions:[{country:"GLOBAL"}]}) satisfies CalculatorDefinition<I,Out>;

export const fuelEconomyCalculator=mk("automotive.fuel-economy","fuel-economy-calculator","Fuel Economy Calculator",z.object({distanceKm:nonnegative,fuelUsedLiters:positive}),x=>x.distanceKm/x.fuelUsedLiters,"fuel economy = distance ÷ fuel used","Calculate distance traveled per liter from user-supplied distance and fuel used.",{distanceKm:600,fuelUsedLiters:40},15);
export const gasMileageCalculator=mk("automotive.gas-mileage","gas-mileage-calculator","Gas Mileage Calculator",z.object({distanceMiles:nonnegative,fuelUsedUsGallons:positive}),x=>x.distanceMiles/x.fuelUsedUsGallons,"gas mileage = distance miles ÷ US gallons used","Calculate US miles per gallon from user-supplied distance and US gallons consumed.",{distanceMiles:300,fuelUsedUsGallons:10},30);
export const tripFuelCalculator=mk("automotive.trip-fuel","trip-fuel-calculator","Trip Fuel Calculator",z.object({distanceKm:nonnegative,fuelConsumptionLitersPer100Km:nonnegative}),x=>x.distanceKm*x.fuelConsumptionLitersPer100Km/100,"trip fuel = distance × L/100 km ÷ 100","Estimate trip fuel quantity from distance and average consumption.",{distanceKm:500,fuelConsumptionLitersPer100Km:8},40);

export const automotiveCatalogBatch1Definitions=[fuelEconomyCalculator,gasMileageCalculator,tripFuelCalculator] as const;
