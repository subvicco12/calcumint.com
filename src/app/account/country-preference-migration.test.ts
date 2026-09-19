import { describe,expect,it } from "vitest";
import { readFileSync } from "node:fs";
describe("country preference migration",()=>{it("stores only explicit Wave 1 country codes and allows custom null",()=>{const sql=readFileSync("supabase/migrations/009_country_preferences.sql","utf8");expect(sql).toContain("country_code");for(const code of ["IN","US","GB","CA","AU"])expect(sql).toContain(`'${code}'`);expect(sql).toContain("country_code is null")})});
