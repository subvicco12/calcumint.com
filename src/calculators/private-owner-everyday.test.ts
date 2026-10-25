import {describe,it,expect} from 'vitest';
import {privateOwnerEveryday} from './private-owner-everyday';
const run=(id:number,input:unknown)=>privateOwnerEveryday.find(x=>x.masterId===id)!.definition.calculate(input,{});
describe('private everyday supplied-input models',()=>{
 it('matches literal examples for every mode',()=>{for(const {definition:d} of privateOwnerEveryday)for(const e of d.examples)expect(d.calculate(e.input,{})).toEqual(e.expected);});
 it('compares matched baskets and leaves zero-base percentage undefined',()=>{
 expect(run(109,{currency:'USD',period:'month',first:[{category:'rent',amount:100}],second:[{category:'rent',amount:125}]})).toMatchObject({firstTotal:100,secondTotal:125,difference:25,percentage:25});
 expect(run(109,{currency:'USD',period:'month',first:[{category:'rent',amount:0}],second:[{category:'rent',amount:5}]})).toMatchObject({percentage:null});
 expect(()=>run(109,{currency:'USD',period:'month',first:[{category:'a',amount:1}],second:[{category:'b',amount:1}]})).toThrow();
 expect(()=>run(109,{currency:'USD',period:'month',first:[{category:'a',amount:Number.MAX_VALUE},{category:'b',amount:Number.MAX_VALUE}],second:[{category:'a',amount:1},{category:'b',amount:1}]})).toThrow();
 });
 it('enforces floor, annual schedule and runtime guard',()=>{
 expect(run(467,{mode:'straightLine',currency:'USD',initial:100,floor:20,years:3,annualAmount:30})).toMatchObject({schedule:[{year:1,value:70},{year:2,value:40},{year:3,value:20}]});
 expect(run(467,{mode:'percentDecline',currency:'USD',initial:80,floor:15,years:4,annualRatePercent:50})).toMatchObject({schedule:[{year:1,value:40},{year:2,value:20},{year:3,value:15},{year:4,value:15}]});
 for(const changes of [{floor:101},{years:1201},{annualAmount:Infinity}])expect(()=>run(467,{mode:'straightLine',currency:'USD',initial:100,floor:20,years:3,annualAmount:30,...changes})).toThrow();
 });
 it('rejects invalid dates, zero reciprocal denominators and overflow',()=>{
 const line={date:'2026-01-01',baseCurrency:'EUR',quoteCurrency:'USD',amount:10,rate:2,direction:'reportingPerUnit'};
 for(const changes of [{date:'2026-02-30'},{rate:0,direction:'unitsPerReporting'},{amount:Number.MAX_VALUE,rate:2},{baseCurrency:'USD',rate:2}])expect(()=>run(512,{reportingCurrency:'USD',lines:[{...line,...changes}]})).toThrow();
 expect(()=>run(507,{transportCost:1e12+1,lodgingCost:0,foodCost:0,otherCost:0})).toThrow();
 });
 it('requires consistent car horizons, currency and terminal dates',()=>{
 const s={currency:'USD',startDate:'2026-01-01',endDate:'2027-01-01',cashflows:[{date:'2026-01-01',kind:'purchase',amount:120},{date:'2026-07-01',kind:'operating',amount:10},{date:'2026-08-01',kind:'financing',amount:5}],terminalResale:{date:'2027-01-01',amount:60}};
 expect(run(471,{new:s,used:{...s,cashflows:[{date:'2026-01-01',kind:'purchase',amount:80}],terminalResale:{date:'2027-01-01',amount:30}}})).toMatchObject({newCost:75,usedCost:50,difference:25});
 for(const changes of [{currency:'EUR'},{endDate:'2028-01-01'},{terminalResale:{date:'2026-12-31',amount:60}},{cashflows:[{date:'2025-12-31',kind:'purchase',amount:1}]}])expect(()=>run(471,{new:s,used:{...s,...changes}})).toThrow();
 });
 it('rejects additional trip fields while retaining original limits',()=>{
 expect(()=>run(507,{transportCost:1,lodgingCost:2,foodCost:3,otherCost:4,extra:5})).toThrow();
 });
});
