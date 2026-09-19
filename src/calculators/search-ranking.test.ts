import {describe,expect,it} from "vitest";
import {rankCalculatorSearchItems,tokenizeCalculatorQuery} from "./search-ranking";
const items=[
 {title:"Alpha Loan",description:"general finance",keywords:["credit"]},
 {title:"Beta Tool",description:"loan planning",keywords:["mortgage"]},
 {title:"Gamma Tool",description:"general",keywords:["loan"]}
];
describe("calculator search ranking",()=>{
 it("normalizes punctuation and ignores one-character noise",()=>expect(tokenizeCalculatorQuery(" Loan, EMI + x ")).toEqual(["loan","emi"]));
 it("weights title above keyword above description",()=>expect(rankCalculatorSearchItems(items,"loan",3).map(x=>x.title)).toEqual(["Alpha Loan","Gamma Tool","Beta Tool"]));
 it("does not let repeated query words distort ranking",()=>expect(rankCalculatorSearchItems(items,"loan loan loan",3).map(x=>x.title)).toEqual(rankCalculatorSearchItems(items,"loan",3).map(x=>x.title)));
 it("uses deterministic title tie breaks",()=>expect(rankCalculatorSearchItems([{title:"Zulu",description:"match",keywords:[]},{title:"Alpha",description:"match",keywords:[]}],"match",2).map(x=>x.title)).toEqual(["Alpha","Zulu"]));
 it("returns no results for empty queries or invalid limits",()=>{expect(rankCalculatorSearchItems(items,"...",3)).toEqual([]);expect(rankCalculatorSearchItems(items,"loan",0)).toEqual([]);expect(rankCalculatorSearchItems(items,"loan",1.5)).toEqual([])});
});
