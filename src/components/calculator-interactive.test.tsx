/** @vitest-environment jsdom */
import React from "react";
import {cleanup,fireEvent,render,screen} from "@testing-library/react";
import {afterEach,describe,expect,it,vi} from "vitest";

vi.mock("@/components/use-calculator-plan",()=>({useCalculatorPlan:()=>"free"}));
vi.mock("@/components/calculator-account-actions",()=>({CalculatorAccountActions:()=>null}));

import {CalculatorInteractive} from "./calculator-interactive";

afterEach(cleanup);

describe("calculator interactive entitlement boundary",()=>{
  it("does not expose paid Compound Interest analysis when a Free user selects Advanced",()=>{
    render(<CalculatorInteractive slug="compound-interest-calculator"/>);
    fireEvent.click(screen.getByRole("button",{name:"Advanced"}));

    expect(screen.queryByText("Target future value")).toBeNull();
    expect(screen.queryByLabelText("Goal Solver")).toBeNull();
    expect(screen.queryByLabelText("Scenario comparison")).toBeNull();
    expect(screen.queryByLabelText("Sensitivity analysis")).toBeNull();
  });

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


describe("Physics validation feedback",()=>{it("announces invalid acceleration input",()=>{render(<CalculatorInteractive slug="acceleration-calculator"/>);fireEvent.change(screen.getByLabelText("Time"),{target:{value:"0"}});expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs")})});


describe("Technology final controls",()=>{
  it("supports selectable IEC storage units and updates the result unit",()=>{
    render(<CalculatorInteractive slug="storage-conversion-calculator"/>);
    expect(screen.getByLabelText("From unit")).not.toBeNull();
    expect(screen.getByLabelText("To unit")).not.toBeNull();
    fireEvent.change(screen.getByLabelText("From unit"),{target:{value:"MiB"}});
    fireEvent.change(screen.getByLabelText("To unit"),{target:{value:"KiB"}});
    expect((screen.getByLabelText("To unit") as HTMLSelectElement).value).toBe("KiB");
    expect(screen.getByRole("region",{name:"Calculation result"}).textContent).toContain("1,024");
    expect(screen.getByRole("region",{name:"Calculation result"}).textContent).toContain("KiB");
  });

  it("supports selectable RAID levels",()=>{
    render(<CalculatorInteractive slug="raid-capacity-calculator"/>);
    const selector=screen.getByLabelText("RAID level") as HTMLSelectElement;
    expect(selector.value).toBe("10");
    fireEvent.change(selector,{target:{value:"5"}});
    expect(selector.value).toBe("5");
    expect(screen.getByRole("region",{name:"Calculation result"}).textContent).toContain("3,000");
  });
});


describe("Technology batch 2 UI validation",()=>{
  it("announces invalid zero battery load",()=>{
    render(<CalculatorInteractive slug="battery-runtime-calculator"/>);
    fireEvent.change(screen.getByLabelText("Load (W)"),{target:{value:"0"}});
    expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs");
  });

  it("announces invalid fractional Base64 byte count",()=>{
    render(<CalculatorInteractive slug="base64-size-calculator"/>);
    fireEvent.change(screen.getByLabelText("Input bytes"),{target:{value:"1.5"}});
    expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs");
  });

  it("announces invalid password character pool",()=>{
    render(<CalculatorInteractive slug="password-entropy-calculator"/>);
    fireEvent.change(screen.getByLabelText("Character pool size"),{target:{value:"1"}});
    expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs");
  });
});


describe("Technology batch 1 UI validation",()=>{
  it("announces an invalid CIDR prefix",()=>{
    render(<CalculatorInteractive slug="cidr-calculator"/>);
    fireEvent.change(screen.getByLabelText("CIDR prefix"),{target:{value:"33"}});
    expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs");
  });

  it("announces an invalid RAID topology",()=>{
    render(<CalculatorInteractive slug="raid-capacity-calculator"/>);
    fireEvent.change(screen.getByLabelText("RAID level"),{target:{value:"6"}});
    fireEvent.change(screen.getByLabelText("Disk count"),{target:{value:"3"}});
    expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs");
  });

  it("announces a zero physical diagonal for PPI",()=>{
    render(<CalculatorInteractive slug="screen-ppi-calculator"/>);
    fireEvent.change(screen.getByLabelText("Diagonal (in)"),{target:{value:"0"}});
    expect(screen.getByRole("alert").textContent).toContain("Enter valid inputs");
  });
});
