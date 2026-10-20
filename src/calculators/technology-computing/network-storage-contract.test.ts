import { describe, expect, it } from "vitest";
import { z } from "zod";
import { runCalculator } from "../engine";
import { cidrCalculator, ipSubnetCalculator, raidCapacityCalculator } from "./catalog-batch-1";

// Independent integer address counts and nominal RAID capacity vectors. These
// concern existing engine contracts; they do not approve any master mappings.
describe("IPv4 and RAID input-contract parity", () => {
  it("preserves object field discovery and existing examples after schema refinements", () => {
    for (const [definition, fields] of [
      [ipSubnetCalculator, ["address", "prefixLength"]],
      [raidCapacityCalculator, ["diskCount", "diskSizeGb", "raidLevel"]],
    ] as const) {
      const schema = definition.inputSchema;
      expect(schema).toBeInstanceOf(z.ZodObject);
      if (!(schema instanceof z.ZodObject)) throw new Error("Object schema required for field discovery");
      expect(Object.keys(schema.shape)).toEqual(fields);
      expect(Object.keys(z.toJSONSchema(schema).properties ?? {})).toEqual(fields);
      for (const example of definition.examples) {
        expect(schema.safeParse(example.input).success).toBe(true);
      }
    }
    for (const golden of ipSubnetCalculator.goldenTests ?? []) {
      expect(ipSubnetCalculator.calculate(golden.input, {})).toMatchObject(golden.expected);
    }
    for (const golden of raidCapacityCalculator.goldenTests ?? []) {
      expect(raidCapacityCalculator.calculate(golden.input, {})).toMatchObject(golden.expected);
    }
  });
  it.each(["256.0.0.1", "1.999.2.3", "1.2.256.3", "1.2.3.999"])("rejects out-of-range octets in %s before execution", address => {
    const input = { address, prefixLength: 24 };
    expect(ipSubnetCalculator.inputSchema.safeParse(input).success).toBe(false);
    expect(() => ipSubnetCalculator.calculate(input, {})).toThrow();
    expect(() => runCalculator(ipSubnetCalculator, input)).toThrow();
  });

  it.each([
    { raidLevel: "5" as const, diskCount: 2 },
    { raidLevel: "6" as const, diskCount: 2 },
    { raidLevel: "6" as const, diskCount: 3 },
    { raidLevel: "10" as const, diskCount: 2 },
    { raidLevel: "10" as const, diskCount: 3 },
    { raidLevel: "10" as const, diskCount: 5 },
    { raidLevel: "10" as const, diskCount: 63 },
  ])("rejects RAID $raidLevel with $diskCount disks before execution", layout => {
    const input = { ...layout, diskSizeGb: 1000 };
    expect(raidCapacityCalculator.inputSchema.safeParse(input).success).toBe(false);
    expect(() => raidCapacityCalculator.calculate(input, {})).toThrow();
    expect(() => runCalculator(raidCapacityCalculator, input)).toThrow();
  });

  it.each([
    ["0", 2, 2000], ["1", 2, 1000], ["1", 64, 1000],
    ["5", 3, 2000], ["6", 4, 2000],
    ["0", 64, 64000], ["5", 64, 63000], ["6", 64, 62000], ["10", 64, 32000],
  ] as const)("preserves RAID %s capacity with %i disks", (raidLevel, diskCount, expected) => {
    const input = { raidLevel, diskCount, diskSizeGb: 1000 };
    expect(raidCapacityCalculator.inputSchema.safeParse(input).success).toBe(true);
    expect(raidCapacityCalculator.calculate(input, {}).value).toBe(expected);
    expect(runCalculator(raidCapacityCalculator, input).output.value).toBe(expected);
  });

  it.each(["0", "1", "5", "6", "10"] as const)("keeps the schema and executable domain aligned for every supported RAID %s disk count", raidLevel => {
    for (let diskCount = 2; diskCount <= 64; diskCount++) {
      const supported = raidLevel === "5" ? diskCount >= 3
        : raidLevel === "6" ? diskCount >= 4
        : raidLevel === "10" ? diskCount >= 4 && diskCount % 2 === 0 : true;
      const input = { raidLevel, diskCount, diskSizeGb: 750 };
      expect(raidCapacityCalculator.inputSchema.safeParse(input).success).toBe(supported);
      if (supported) {
        expect(() => raidCapacityCalculator.calculate(input, {})).not.toThrow();
      } else {
        expect(() => raidCapacityCalculator.calculate(input, {})).toThrow();
      }
    }
  });

  it("continues to accept every legal octet value in each IPv4 position", () => {
    for (let position = 0; position < 4; position++) {
      for (let octet = 0; octet <= 255; octet++) {
        const parts = [192, 0, 2, 17];
        parts[position] = octet;
        const input = { address: parts.join("."), prefixLength: 32 };
        expect(ipSubnetCalculator.inputSchema.safeParse(input).success).toBe(true);
        expect(ipSubnetCalculator.calculate(input, {}).value).toBe(1);
      }
    }
  });

  it.each(Array.from({ length: 33 }, (_, prefix) => prefix))("preserves CIDR /%i address counts at IPv4 extremes", prefixLength => {
    const expected = Number(1n << BigInt(32 - prefixLength));
    expect(cidrCalculator.calculate({ prefixLength }, {}).value).toBe(expected);
    for (const address of ["0.0.0.0", "255.255.255.255", "192.0.2.17"]) {
      expect(runCalculator(ipSubnetCalculator, { address, prefixLength }).output.value).toBe(expected);
    }
  });
});
