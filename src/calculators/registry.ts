import type { CalculatorDefinition } from "./types";
import { percentageCalculator } from "./core/percentage";
import { unitConversionCalculator } from "./core/unit-conversion";
import { compoundInterestCalculator } from "./finance/compound-interest";
import { loanPaymentCalculator } from "./finance/loan-payment";
import { loanAnalysisCalculator } from "./finance/loan-analysis";
import { loanRefinanceCalculator } from "./finance/loan-refinance";
import { termDepositCalculator } from "./finance/term-deposit";
import { recurringDepositCalculator } from "./finance/recurring-deposit";
import { sipCalculator } from "./finance/sip";
import { stepUpSipCalculator } from "./finance/step-up-sip";
import { investmentMathCalculator } from "./finance/investment-math";
import { swpCalculator } from "./finance/swp";
import { launchDefinitions } from "./launch-portfolio";

type RegistryCalculator = CalculatorDefinition<unknown, unknown>;
function eraseCalculatorTypes<TInput,TOutput>(definition:CalculatorDefinition<TInput,TOutput>):RegistryCalculator{return definition as unknown as RegistryCalculator;}
const definitions: readonly RegistryCalculator[] = [
  eraseCalculatorTypes(percentageCalculator), eraseCalculatorTypes(unitConversionCalculator), eraseCalculatorTypes(compoundInterestCalculator), eraseCalculatorTypes(loanPaymentCalculator),
  eraseCalculatorTypes(loanAnalysisCalculator), eraseCalculatorTypes(loanRefinanceCalculator), eraseCalculatorTypes(termDepositCalculator), eraseCalculatorTypes(recurringDepositCalculator), eraseCalculatorTypes(sipCalculator), eraseCalculatorTypes(stepUpSipCalculator), eraseCalculatorTypes(investmentMathCalculator), eraseCalculatorTypes(swpCalculator),
  ...launchDefinitions.map(eraseCalculatorTypes)
];
const bySlug=new Map<string,RegistryCalculator>(); const byId=new Map<string,RegistryCalculator>();
for(const definition of definitions){if(bySlug.has(definition.slug))throw new Error(`Duplicate calculator slug: ${definition.slug}`);if(byId.has(definition.id))throw new Error(`Duplicate calculator id: ${definition.id}`);bySlug.set(definition.slug,definition);byId.set(definition.id,definition);}
export const calculatorRegistry={list:():readonly RegistryCalculator[]=>definitions,getBySlug:(slug:string)=>bySlug.get(slug),getById:(id:string)=>byId.get(id)} as const;
