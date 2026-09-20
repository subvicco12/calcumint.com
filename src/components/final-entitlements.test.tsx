// @vitest-environment jsdom
import React from "react";
import {cleanup,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it} from "vitest";
import {FinalResultPresentation} from "./final-result-presentation";
import {GoalSolverPanel,ScenarioComparisonPanel,SensitivityPanel} from "./final-analysis-panels";
import type {StructuredCalculationResult} from "@/calculators/final-framework/types";

afterEach(cleanup);

const result:StructuredCalculationResult={
  primaryResult:{id:"payment",label:"Monthly payment",value:599.55},
  schedule:[{id:"1",period:1,values:{payment:599.55,principal:99.55,interest:500,balance:99900.45}}],
  methodology:"Certified deterministic result.",
  sources:[{label:"Authoritative reference",url:"https://example.com/reference"},{label:"Internal rule note"}]
};

describe("final calculator entitlement rendering",()=>{
  it("keeps the detailed schedule locked for Free",()=>{
    render(<FinalResultPresentation result={result} plan="free"/>);
    expect(screen.getByText("Detailed schedule").closest(".locked-feature")).not.toBeNull();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("renders the detailed schedule for Pro",()=>{
    render(<FinalResultPresentation result={result} plan="pro"/>);
    expect(screen.getByRole("table")).not.toBeNull();
  });



  it("renders certified metrics beyond the first four instead of dropping them",()=>{
    const expanded:StructuredCalculationResult={...result,metrics:[
      {id:"principal",label:"Principal",value:100000},
      {id:"interest",label:"Total interest",value:115838},
      {id:"total",label:"Total repayment",value:215838},
      {id:"term",label:"Term",value:360,unit:"months"},
      {id:"payoff",label:"Payoff time",value:300,unit:"months"},
      {id:"interest-saved",label:"Interest saved",value:12000},
      {id:"months-saved",label:"Time saved",value:60,unit:"months"}
    ]};
    render(<FinalResultPresentation result={expanded} plan="free"/>);
    expect(screen.getByText("Payoff time")).not.toBeNull();
    expect(screen.getByText("Interest saved")).not.toBeNull();
    expect(screen.getByText("Time saved")).not.toBeNull();
  });

  it("renders methodology and provenance without a paid-plan gate",()=>{
    render(<FinalResultPresentation result={result} plan="free"/>);
    expect(screen.getByText("Result methodology")).not.toBeNull();
    expect(screen.getByText("Sources")).not.toBeNull();
    const source=screen.getByRole("link",{name:"Authoritative reference"});
    expect(source.getAttribute("href")).toBe("https://example.com/reference");
    expect(source.getAttribute("target")).toBe("_blank");
    expect(screen.getByText("Internal rule note")).not.toBeNull();
  });

  it("hides Pro analysis panels for Free",()=>{
    render(<><GoalSolverPanel plan="free" target={100} solved={10}/><ScenarioComparisonPanel plan="free" scenarios={[{id:"base",label:"Base",value:100,delta:0}]}/><SensitivityPanel plan="free" points={[{input:1,value:100}]}/></>);
    expect(screen.queryByLabelText("Goal Solver")).toBeNull();
    expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
    expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
  });

  it("renders Pro analysis panels for Pro and Business",()=>{
    const scenarios=[{id:"base",label:"Base",value:100,delta:0}];
    const points=[{input:1,value:100}];
    const {rerender}=render(<><GoalSolverPanel plan="pro" target={100} solved={10}/><ScenarioComparisonPanel plan="pro" scenarios={scenarios}/><SensitivityPanel plan="pro" points={points}/></>);
    expect(screen.getByLabelText("Goal Solver")).not.toBeNull();
    expect(screen.getByLabelText("Scenario comparison")).not.toBeNull();
    expect(screen.getByLabelText("Sensitivity analysis")).not.toBeNull();
    rerender(<><GoalSolverPanel plan="business" target={100} solved={10}/><ScenarioComparisonPanel plan="business" scenarios={scenarios}/><SensitivityPanel plan="business" points={points}/></>);
    expect(screen.getByLabelText("Goal Solver")).not.toBeNull();
    expect(screen.getByLabelText("Scenario comparison")).not.toBeNull();
    expect(screen.getByLabelText("Sensitivity analysis")).not.toBeNull();
  });
});
