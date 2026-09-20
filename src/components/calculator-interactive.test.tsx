/** @vitest-environment jsdom */
import React from "react";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it,vi} from "vitest";

vi.mock("@/components/use-calculator-plan",()=>({useCalculatorPlan:()=>"free"}));
vi.mock("@/components/calculator-account-actions",()=>({CalculatorAccountActions:()=>null}));

import {CalculatorInteractive} from "./calculator-interactive";

afterEach(cleanup);

describe("calculator interactive entitlement boundary",()=>{
  it("does not expose paid SIP analysis when a Free user selects Advanced",()=>{
    render(<CalculatorInteractive slug="sip-calculator"/>);
    fireEvent.click(screen.getByRole("button",{name:"Advanced"}));

    expect(screen.queryByLabelText("Goal Solver")).toBeNull();
    expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
    expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
  });

  it("does not expose paid Mortgage analysis when a Free user selects Advanced",()=>{
    render(<CalculatorInteractive slug="mortgage-payment"/>);
    fireEvent.click(screen.getByRole("button",{name:"Advanced"}));

    expect(screen.queryByText("Target monthly payment")).toBeNull();
    expect(screen.queryByLabelText("Goal Solver")).toBeNull();
    expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
    expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
  });

  it("does not expose paid Break-even analysis when a Free user selects Advanced",()=>{
    render(<CalculatorInteractive slug="break-even-calculator"/>);
    fireEvent.click(screen.getByRole("button",{name:"Advanced"}));

    expect(screen.queryByText("Target break-even units")).toBeNull();
    expect(screen.queryByLabelText("Goal Solver")).toBeNull();
    expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
    expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
  });

  it("does not expose paid Loan/EMI analysis when a Free user selects Advanced",()=>{
    render(<CalculatorInteractive slug="loan-emi-calculator"/>);
    fireEvent.click(screen.getByRole("button",{name:"Advanced"}));

    expect(screen.getByText("Extra monthly payment")).not.toBeNull();
    expect(screen.queryByText("Target monthly payment")).toBeNull();
    expect(screen.queryByLabelText("Goal Solver")).toBeNull();
    expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
    expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
  });
});
