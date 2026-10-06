import {describe,expect,it} from "vitest";
import {categoryContent} from "../public-content";
describe("Math category editorial boundary",()=>{it("contains only math-appropriate metadata",()=>{const math=categoryContent.math; const text=JSON.stringify(math).toLowerCase(); expect(math.keywords).toEqual(["math calculator","mathematics calculator","formula calculator"]); expect(text).not.toContain("health calculator"); expect(text).not.toContain("hardware"); expect(text).not.toContain("network specification");});});
