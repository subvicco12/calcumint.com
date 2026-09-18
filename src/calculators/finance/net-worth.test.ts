import { describe,expect,it } from "vitest";
import { runCalculator } from "../engine";
import { calculateNetWorth,netWorthCalculator } from "./net-worth";
describe("net worth",()=>{
 it("sums assets and liabilities",()=>{const r=calculateNetWorth({assets:[{name:"Cash",amount:10000},{name:"Investments",amount:40000}],liabilities:[{name:"Loan",amount:15000}]});expect(r.totalAssets).toBe(50000);expect(r.totalLiabilities).toBe(15000);expect(r.netWorth).toBe(35000);expect(r.debtToAssetPercent).toBe(30);});
 it("supports negative net worth",()=>{expect(calculateNetWorth({assets:[{name:"Cash",amount:1000}],liabilities:[{name:"Debt",amount:3000}]}).netWorth).toBe(-2000);});
 it("does not invent a debt-to-asset ratio with zero assets",()=>{expect(calculateNetWorth({assets:[],liabilities:[{name:"Debt",amount:100}]}).debtToAssetPercent).toBeNull();});
 it("validates through the common engine",()=>{expect(()=>runCalculator(netWorthCalculator,{assets:[{name:"",amount:1}],liabilities:[]})).toThrow();const r=runCalculator(netWorthCalculator,{assets:[{name:"Cash",amount:500}],liabilities:[]});expect(r.output.netWorth).toBe(500);});
 it("rejects aggregate numeric overflow",()=>{expect(()=>calculateNetWorth({assets:[{name:"A",amount:Number.MAX_VALUE},{name:"B",amount:Number.MAX_VALUE}],liabilities:[]})).toThrow(/numeric range/);});
 it("rejects malformed direct items",()=>{expect(()=>calculateNetWorth({assets:[{name:" ",amount:100}],liabilities:[]})).toThrow();expect(()=>calculateNetWorth({assets:[{name:"Cash",amount:Number.NaN}],liabilities:[]})).toThrow();expect(()=>calculateNetWorth({assets:[],liabilities:[{name:"Debt",amount:-1}]})).toThrow();});
});
